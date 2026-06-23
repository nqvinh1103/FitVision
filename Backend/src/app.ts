import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './swagger';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { programRouter } from './routes/program.routes';
import { userRouter } from './routes/user.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get('/docs/json', (_req, res) => res.json(swaggerSpec));

  app.use('/health', healthRouter);
  app.use('/auth', authRouter);
  app.use('/programs', programRouter);
  app.use('/users', userRouter);

  app.use(errorMiddleware);

  return app;
};
