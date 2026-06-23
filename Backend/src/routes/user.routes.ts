import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';

export const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng (Admin)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách tất cả người dùng
 *     description: |
 *       Trả về toàn bộ user trên hệ thống, sắp xếp theo ngày tạo mới nhất.
 *
 *       **Yêu cầu role:** ADMIN
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Không có quyền (chỉ ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  userController.getAllUsers,
);
