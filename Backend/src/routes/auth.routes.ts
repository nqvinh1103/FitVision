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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Đăng ký, đăng nhập, quản lý tài khoản
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yêu cầu đăng ký tài khoản mới
 *     description: Gửi OTP xác thực về email. Tài khoản chưa được tạo cho đến khi verify OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               role:
 *                 type: string
 *                 enum: [TRAINEE, TRAINER]
 *                 example: TRAINEE
 *     responses:
 *       200:
 *         description: OTP đã gửi về email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to user@example.com
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/register/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực OTP và tạo tài khoản
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [TRAINEE, TRAINER]
 *     responses:
 *       201:
 *         description: Tài khoản tạo thành công, trả về access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: OTP sai hoặc hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/register/verify', validate(verifyRegisterSchema), authController.verifyRegister);

/**
 * @swagger
 * /auth/register/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi lại OTP đăng ký
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP đã gửi lại
 *       429:
 *         description: Gửi quá nhanh, cần chờ cooldown
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/register/resend-otp', validate(resendOtpSchema), authController.resendRegisterOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập
 *     description: Trả về accessToken trong body và set refreshToken trong HttpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Sai email hoặc mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Email đã đăng ký nhưng chưa xác thực OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Làm mới access token
 *     description: Đọc refreshToken từ HttpOnly cookie, trả về accessToken mới.
 *     responses:
 *       200:
 *         description: Access token mới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token không hợp lệ hoặc hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất
 *     description: Xóa refreshToken khỏi DB và clear cookie.
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
authRouter.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy thông tin người dùng hiện tại
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     tags: [Auth]
 *     summary: Cập nhật thông tin cá nhân
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van B
 *               avatarUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/avatar.jpg
 *               experienceLevel:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.get('/me', authMiddleware, authController.getMe);
authRouter.patch('/me', authMiddleware, validate(updateProfileSchema), authController.updateMe);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Đổi mật khẩu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPass123
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: NewPass456
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu hiện tại sai hoặc mật khẩu mới trùng cũ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Yêu cầu đặt lại mật khẩu
 *     description: Gửi OTP về email để xác thực trước khi đặt mật khẩu mới.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP đã gửi về email
 *       404:
 *         description: Email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @swagger
 * /auth/forgot-password/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực OTP và đặt mật khẩu mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: "654321"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: NewPass789
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại thành công
 *       400:
 *         description: OTP sai hoặc hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/forgot-password/verify', validate(verifyForgotPasswordSchema), authController.verifyForgotPassword);

/**
 * @swagger
 * /auth/forgot-password/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi lại OTP quên mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP đã gửi lại
 *       429:
 *         description: Gửi quá nhanh, cần chờ cooldown
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/forgot-password/resend-otp', validate(resendOtpSchema), authController.resendForgotPasswordOtp);
