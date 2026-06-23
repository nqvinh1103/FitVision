import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { AuthResponse, PublicUser, RefreshResponse } from '../types/auth.types';
import { AppError } from '../utils/app-error';
import { parseDurationToDate } from '../utils/duration';

const BCRYPT_ROUNDS = 12;

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

export const register = async (input: RegisterInput): Promise<AuthResponse & { refreshToken: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
    },
  });

  return issueTokens(user);
};

export const login = async (input: LoginInput): Promise<AuthResponse & { refreshToken: string }> => {
  const user = await prisma.user.findUnique({
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
