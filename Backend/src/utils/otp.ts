import { randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { AppError } from './app-error';
import { parseDurationToMs } from './duration';

const BCRYPT_ROUNDS = 12;

export const MAX_OTP_ATTEMPTS = 5;

export interface OtpRecord {
  id: number;
  otpHash: string;
  attempts: number;
  expiresAt: Date;
}

export interface OtpHandlers {
  delete: (id: number) => Promise<void>;
  incrementAttempts: (id: number, attempts: number) => Promise<void>;
}

export const generateOtp = (): string => randomInt(100000, 999999).toString();

export const hashOtp = (otp: string): Promise<string> => bcrypt.hash(otp, BCRYPT_ROUNDS);

export const getOtpExpiresInSeconds = (): number =>
  Math.floor(parseDurationToMs(env.OTP_EXPIRES_IN) / 1000);

export const validateOtpOrThrow = async (
  pending: OtpRecord,
  inputOtp: string,
  handlers: OtpHandlers,
  tooManyAttemptsMessage = 'Too many failed attempts. Please try again',
): Promise<void> => {
  if (pending.expiresAt < new Date()) {
    await handlers.delete(pending.id);
    throw new AppError(410, 'OTP has expired');
  }

  if (pending.attempts >= MAX_OTP_ATTEMPTS) {
    await handlers.delete(pending.id);
    throw new AppError(429, tooManyAttemptsMessage);
  }

  const isOtpValid = await bcrypt.compare(inputOtp, pending.otpHash);

  if (!isOtpValid) {
    const newAttempts = pending.attempts + 1;

    if (newAttempts >= MAX_OTP_ATTEMPTS) {
      await handlers.delete(pending.id);
      throw new AppError(429, tooManyAttemptsMessage);
    }

    await handlers.incrementAttempts(pending.id, newAttempts);
    throw new AppError(401, 'Invalid OTP');
  }
};
