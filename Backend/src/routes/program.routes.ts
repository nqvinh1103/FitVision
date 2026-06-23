import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { generateProgramSchema } from '../schemas/program.schema';
import * as programController from '../controllers/program.controller';

export const programRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: AI Program Builder — sinh giáo án bằng LLM + RAG
 */

/**
 * @swagger
 * /programs/generate:
 *   post:
 *     tags: [Programs]
 *     summary: Yêu cầu AI sinh giáo án tập luyện
 *     description: |
 *       Enqueue job vào BullMQ. AI sẽ dùng RAG + Gemini để sinh giáo án
 *       dựa trên prompt và profile của Trainer. Trả về jobId để poll trạng thái.
 *
 *       **Yêu cầu role:** TRAINER hoặc ADMIN
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Tôi muốn tập tăng cơ 3 ngày mỗi tuần, không có thiết bị đặc biệt
 *               context:
 *                 type: string
 *                 maxLength: 500
 *                 example: Trainee bị đau gối nhẹ, tránh squat nặng
 *     responses:
 *       202:
 *         description: Job đã được enqueue thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                   example: "1749123456789"
 *       400:
 *         description: Dữ liệu không hợp lệ
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
 *       403:
 *         description: Không có quyền (chỉ TRAINER / ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
programRouter.post(
  '/generate',
  authMiddleware,
  requireRole('TRAINER', 'ADMIN'),
  validate(generateProgramSchema),
  programController.generateProgram,
);

/**
 * @swagger
 * /programs/generate/{jobId}/status:
 *   get:
 *     tags: [Programs]
 *     summary: Kiểm tra trạng thái job sinh giáo án
 *     description: |
 *       Poll endpoint để biết job đã hoàn thành chưa.
 *       Khi status = `completed`, giáo án đã được lưu vào DB và gắn với tài khoản.
 *       Khi status = `failed`, trường `reason` chứa mô tả lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         example: "1749123456789"
 *         description: jobId trả về từ POST /programs/generate
 *     responses:
 *       200:
 *         description: Trạng thái job hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobStatusResponse'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job không tồn tại hoặc đã hết hạn trong Redis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
programRouter.get(
  '/generate/:jobId/status',
  authMiddleware,
  programController.getProgramJobStatus,
);
