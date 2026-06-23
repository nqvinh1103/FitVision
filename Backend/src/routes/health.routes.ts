import { Router } from 'express';

export const healthRouter = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Kiểm tra trạng thái server
 *     responses:
 *       200:
 *         description: Server đang hoạt động
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
