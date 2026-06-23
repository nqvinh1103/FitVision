import { randomBytes, randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  VerifyRegisterInput,
} from '../schemas/auth.schema';
import {
  AuthResponse,
  PublicUser,
  RefreshResponse,
  RegisterOtpResponse,
} from '../types/auth.types';
import { AppError } from '../utils/app-error';
import { parseDurationToDate, parseDurationToMs } from '../utils/duration';
import * as emailService from './email.service';

const BCRYPT_ROUNDS = 12;
const MAX_OTP_ATTEMPTS = 5;
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

const issueTokens = async (user: User): Promise<AuthResponse & { refreshToken: string }> => {
  const accessToken = signAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: toPublicUser(user),
  };
};

const generateOtp = (): string => randomInt(100000, 999999).toString();

const hashOtp = (otp: string): Promise<string> => bcrypt.hash(otp, BCRYPT_ROUNDS);

const getOtpExpiresInSeconds = (): number =>
  Math.floor(parseDurationToMs(env.OTP_EXPIRES_IN) / 1000);

const createAndSendOtp = async (
  email: string,
  passwordHash: string,
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
      name,
      expiresAt,
      lastSentAt: now,
    },
    update: {
      otpHash,
      passwordHash,
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

  return createAndSendOtp(input.email, passwordHash, input.name);
};

export const verifyRegister = async (
  input: VerifyRegisterInput,
): Promise<AuthResponse & { refreshToken: string }> => {
  const pending = await prisma.registrationOtp.findUnique({
    where: { email: input.email },
  });

  if (!pending) {
    throw new AppError(404, 'No pending registration found');
  }

  if (pending.expiresAt < new Date()) {
    await prisma.registrationOtp.delete({ where: { id: pending.id } });
    throw new AppError(410, 'OTP has expired');
  }

  if (pending.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.registrationOtp.delete({ where: { id: pending.id } });
    throw new AppError(429, 'Too many failed attempts. Please register again');
  }

  const isOtpValid = await bcrypt.compare(input.otp, pending.otpHash);

  if (!isOtpValid) {
    const newAttempts = pending.attempts + 1;

    if (newAttempts >= MAX_OTP_ATTEMPTS) {
      await prisma.registrationOtp.delete({ where: { id: pending.id } });
      throw new AppError(429, 'Too many failed attempts. Please register again');
    }

    await prisma.registrationOtp.update({
      where: { id: pending.id },
      data: { attempts: newAttempts },
    });

    throw new AppError(401, 'Invalid OTP');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    await prisma.registrationOtp.delete({ where: { id: pending.id } });
    throw new AppError(409, 'Email already exists');
  }

  const user = await prisma.user.create({
    data: {
      email: pending.email,
      passwordHash: pending.passwordHash,
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

  const cooldownMs = env.OTP_RESEND_COOLDOWN_SECONDS * 1000;
  const elapsed = Date.now() - pending.lastSentAt.getTime();

  if (elapsed < cooldownMs) {
    const retryAfter = Math.ceil((cooldownMs - elapsed) / 1000);
    throw new AppError(429, `Please wait ${retryAfter} seconds before resending OTP`);
  }

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

export const login = async (input: LoginInput): Promise<AuthResponse & { refreshToken: string }> => {  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
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
