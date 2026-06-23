import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/health', healthRouter);
  app.use('/auth', authRouter);

  app.use(errorMiddleware);

  return app;
};
