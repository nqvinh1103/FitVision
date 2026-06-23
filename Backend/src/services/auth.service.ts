import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Prisma, Role, User } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import {
  ChangePasswordInput,
  LoginInput,
  normalizeRegisterRole,
  RegisterInput,
  UpdateProfileInput,
  VerifyForgotPasswordInput,
  VerifyRegisterInput,
} from '../schemas/auth.schema';
import {
  AuthResponse,
  MessageResponse,
  PublicUser,
  RefreshResponse,
  RegisterOtpResponse,
} from '../types/auth.types';
import { AppError } from '../utils/app-error';
import { parseDurationToDate } from '../utils/duration';
import {
  generateOtp,
  getOtpExpiresInSeconds,
  hashOtp,
  validateOtpOrThrow,
} from '../utils/otp';
import * as emailService from './email.service';

const BCRYPT_ROUNDS = 12;
const REGISTER_TOO_MANY_ATTEMPTS = 'Too many failed attempts. Please register again';

const toPrismaRole = (role: NonNullable<ReturnType<typeof normalizeRegisterRole>>): Role =>
  role === 'TRAINER' ? Role.TRAINER : Role.TRAINEE;

const resolveRegistrationRole = (...candidates: unknown[]): Role => {
  for (const candidate of candidates) {
    const normalized = normalizeRegisterRole(candidate);
    if (normalized) {
      return toPrismaRole(normalized);
    }
  }

  return Role.TRAINEE;
};

const forgotPasswordResponse = (): RegisterOtpResponse => ({
  message: 'If the email exists, an OTP has been sent',
  expiresIn: getOtpExpiresInSeconds(),
});

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  aiCredits: user.aiCredits,
  avatarUrl: user.avatarUrl,
  experienceLevel: user.experienceLevel,
});

const signAccessToken = (user: User): string => {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, options);
};

const createRefreshToken = async (userId: number): Promise<string> => {
  const token = randomBytes(32).toString('hex');

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: parseDurationToDate(env.JWT_REFRESH_EXPIRES_IN),
    },
  });

  return token;
};

const revokeAllRefreshTokens = async (userId: number): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

const issueTokens = async (user: User): Promise<AuthResponse & { refreshToken: string }> => {
  const accessToken = signAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: toPublicUser(user),
  };
};

const assertResendCooldown = (lastSentAt: Date): void => {
  const cooldownMs = env.OTP_RESEND_COOLDOWN_SECONDS * 1000;
  const elapsed = Date.now() - lastSentAt.getTime();

  if (elapsed < cooldownMs) {
    const retryAfter = Math.ceil((cooldownMs - elapsed) / 1000);
    throw new AppError(429, `Please wait ${retryAfter} seconds before resending OTP`);
  }
};

const createAndSendOtp = async (
  email: string,
  passwordHash: string,
  role: Role,
  name: string | undefined,
): Promise<RegisterOtpResponse> => {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = parseDurationToDate(env.OTP_EXPIRES_IN);
  const now = new Date();

  await prisma.registrationOtp.upsert({
    where: { email },
    create: {
      email,
      otpHash,
      passwordHash,
      role,
      name,
      expiresAt,
      lastSentAt: now,
    },
    update: {
      otpHash,
      passwordHash,
      role,
      name,
      attempts: 0,
      expiresAt,
      lastSentAt: now,
    },
  });

  await emailService.sendOtpEmail(email, otp);

  return {
    message: 'OTP sent to email',
    expiresIn: getOtpExpiresInSeconds(),
  };
};

export const requestRegister = async (input: RegisterInput): Promise<RegisterOtpResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const role = resolveRegistrationRole(input.role);

  return createAndSendOtp(input.email, passwordHash, role, input.name);
};

export const verifyRegister = async (
  input: VerifyRegisterInput,
): Promise<AuthResponse & { refreshToken: string }> => {
  const pending = await prisma.registrationOtp.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      otpHash: true,
      passwordHash: true,
      name: true,
      role: true,
      attempts: true,
      expiresAt: true,
    },
  });

  if (!pending) {
    throw new AppError(404, 'No pending registration found');
  }

  await validateOtpOrThrow(
    pending,
    input.otp,
    {
      delete: async (id) => {
        await prisma.registrationOtp.delete({ where: { id } });
      },
      incrementAttempts: async (id, attempts) => {
        await prisma.registrationOtp.update({ where: { id }, data: { attempts } });
      },
    },
    REGISTER_TOO_MANY_ATTEMPTS,
  );

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    await prisma.registrationOtp.delete({ where: { id: pending.id } });
    throw new AppError(409, 'Email already exists');
  }

  const role = resolveRegistrationRole(input.role, pending.role);

  const user = await prisma.user.create({
    data: {
      email: pending.email,
      passwordHash: pending.passwordHash,
      role,
      name: pending.name,
    },
  });

  await prisma.registrationOtp.delete({ where: { id: pending.id } });

  return issueTokens(user);
};

export const resendRegisterOtp = async (email: string): Promise<RegisterOtpResponse> => {
  const pending = await prisma.registrationOtp.findUnique({
    where: { email },
  });

  if (!pending) {
    throw new AppError(404, 'No pending registration found');
  }

  assertResendCooldown(pending.lastSentAt);

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = parseDurationToDate(env.OTP_EXPIRES_IN);
  const now = new Date();

  await prisma.registrationOtp.update({
    where: { id: pending.id },
    data: {
      otpHash,
      attempts: 0,
      expiresAt,
      lastSentAt: now,
    },
  });

  await emailService.sendOtpEmail(email, otp);

  return {
    message: 'OTP sent to email',
    expiresIn: getOtpExpiresInSeconds(),
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse & { refreshToken: string }> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    const pending = await prisma.registrationOtp.findUnique({
      where: { email: input.email },
    });

    if (pending) {
      const isPendingPasswordValid = await bcrypt.compare(input.password, pending.passwordHash);

      if (isPendingPasswordValid) {
        throw new AppError(
          403,
          'Email chưa được xác thực. Vui lòng nhập mã OTP đã gửi về email của bạn.',
        );
      }
    }

    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  return issueTokens(user);
};

export const refresh = async (rawToken: string): Promise<RefreshResponse & { refreshToken: string }> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: rawToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const accessToken = signAccessToken(storedToken.user);
  const refreshToken = await createRefreshToken(storedToken.userId);

  return { accessToken, refreshToken };
};

export const logout = async (rawToken: string | undefined): Promise<void> => {
  if (!rawToken) {
    return;
  }

  await prisma.refreshToken.deleteMany({
    where: { token: rawToken },
  });
};

export const getMe = async (userId: number): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return toPublicUser(user);
};

export const updateProfile = async (
  userId: number,
  input: UpdateProfileInput,
): Promise<PublicUser> => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: input,
    });

    return toPublicUser(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'User not found');
    }
    throw err;
  }
};

export const changePassword = async (
  userId: number,
  input: ChangePasswordInput,
): Promise<MessageResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isCurrentPasswordValid = await bcrypt.compare(input.currentPassword, user.passwordHash);

  if (!isCurrentPasswordValid) {
    throw new AppError(401, 'Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await revokeAllRefreshTokens(userId);

  return { message: 'Password changed successfully' };
};

export const requestForgotPassword = async (email: string): Promise<RegisterOtpResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return forgotPasswordResponse();
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = parseDurationToDate(env.OTP_EXPIRES_IN);
  const now = new Date();

  await prisma.passwordResetOtp.upsert({
    where: { email },
    create: {
      email,
      otpHash,
      expiresAt,
      lastSentAt: now,
    },
    update: {
      otpHash,
      attempts: 0,
      expiresAt,
      lastSentAt: now,
    },
  });

  await emailService.sendPasswordResetOtpEmail(email, otp);

  return forgotPasswordResponse();
};

export const verifyForgotPassword = async (
  input: VerifyForgotPasswordInput,
): Promise<MessageResponse> => {
  const pending = await prisma.passwordResetOtp.findUnique({
    where: { email: input.email },
  });

  if (!pending) {
    throw new AppError(404, 'No pending password reset found');
  }

  await validateOtpOrThrow(pending, input.otp, {
    delete: async (id) => {
      await prisma.passwordResetOtp.delete({ where: { id } });
    },
    incrementAttempts: async (id, attempts) => {
      await prisma.passwordResetOtp.update({ where: { id }, data: { attempts } });
    },
  });

  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    await prisma.passwordResetOtp.delete({ where: { id: pending.id } });
    throw new AppError(404, 'User not found');
  }

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.passwordResetOtp.delete({ where: { id: pending.id } });
  await revokeAllRefreshTokens(user.id);

  return { message: 'Password reset successfully' };
};

export const resendForgotPasswordOtp = async (email: string): Promise<RegisterOtpResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return forgotPasswordResponse();
  }

  const pending = await prisma.passwordResetOtp.findUnique({
    where: { email },
  });

  if (!pending) {
    throw new AppError(404, 'No pending password reset found');
  }

  assertResendCooldown(pending.lastSentAt);

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = parseDurationToDate(env.OTP_EXPIRES_IN);
  const now = new Date();

  await prisma.passwordResetOtp.update({
    where: { id: pending.id },
    data: {
      otpHash,
      attempts: 0,
      expiresAt,
      lastSentAt: now,
    },
  });

  await emailService.sendPasswordResetOtpEmail(email, otp);

  return forgotPasswordResponse();
};
