import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { healthRouter } from './routes/health.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(morgan('dev'));
  app.use(express.json());

  app.use('/health', healthRouter);

  app.use(errorMiddleware);

  return app;
};
