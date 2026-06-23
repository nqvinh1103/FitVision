import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  updateProfileSchema,
  verifyForgotPasswordSchema,
  verifyRegisterSchema,
} from '../schemas/auth.schema';
import * as authController from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/register/verify', validate(verifyRegisterSchema), authController.verifyRegister);
authRouter.post('/register/resend-otp', validate(resendOtpSchema), authController.resendRegisterOtp);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/forgot-password/verify', validate(verifyForgotPasswordSchema), authController.verifyForgotPassword);
authRouter.post('/forgot-password/resend-otp', validate(resendOtpSchema), authController.resendForgotPasswordOtp);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authMiddleware, authController.getMe);
authRouter.patch('/me', authMiddleware, validate(updateProfileSchema), authController.updateMe);
