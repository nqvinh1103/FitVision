import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema, updateProfileSchema } from '../schemas/auth.schema';
import * as authController from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authMiddleware, authController.getMe);
authRouter.patch('/me', authMiddleware, validate(updateProfileSchema), authController.updateMe);
