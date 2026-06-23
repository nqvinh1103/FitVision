import { Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE,
  setRefreshTokenCookie,
} from '../utils/cookie';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.register(req.body as RegisterInput);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.login(req.body as LoginInput);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;

    if (!rawToken) {
      res.status(401).json({ error: 'Missing refresh token' });
      return;
    }

    const result = await authService.refresh(rawToken);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({ accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    await authService.logout(rawToken);
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await authService.getMe(req.userId!);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
