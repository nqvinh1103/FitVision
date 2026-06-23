import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { generateProgramSchema } from '../schemas/program.schema';
import * as programController from '../controllers/program.controller';

export const programRouter = Router();

programRouter.post(
  '/generate',
  authMiddleware,
  requireRole('TRAINER', 'ADMIN'),
  validate(generateProgramSchema),
  programController.generateProgram,
);

programRouter.get(
  '/generate/:jobId/status',
  authMiddleware,
  programController.getProgramJobStatus,
);
