import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err.stack);
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(500).json({ error: message });
};
