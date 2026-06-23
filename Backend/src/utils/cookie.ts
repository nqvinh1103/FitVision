import { Response } from 'express';
import { env } from '../config/env';
import { parseDurationToMs } from './duration';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/auth',
  maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, refreshCookieOptions);
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth',
  });
};
