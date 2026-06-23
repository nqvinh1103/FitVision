import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GenerateProgramInput } from '../schemas/program.schema';
import { addNlpJob } from '../queues/nlp.producer';
import { nlpQueue } from '../queues/bullmq.client';
import { prisma } from '../lib/prisma';

const GOAL_MAP: Record<string, string> = {
  STRENGTH: 'strength',
  FAT_LOSS: 'fat_loss',
  ENDURANCE: 'endurance',
  GENERAL_FITNESS: 'general_fitness',
};

export const generateProgram = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { prompt, context } = req.body as GenerateProgramInput;

    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { experienceLevel: true } }),
      prisma.userProfile.findUnique({ where: { userId } }),
    ]);

    const userProfile = {
      fitness_level: user?.experienceLevel ?? 'INTERMEDIATE',
      has_pull_up_bar: profile?.hasPullUpBar ?? false,
      has_parallel_bars: profile?.hasParallelBars ?? false,
      injuries: (profile?.injuries as string[]) ?? [],
      goal: GOAL_MAP[profile?.goal ?? 'GENERAL_FITNESS'] ?? 'general_fitness',
    };

    const job = await addNlpJob(userId, { userId, prompt, context, user_profile: userProfile });

    res.status(202).json({ jobId: job.id });
  } catch (err) {
    next(err);
  }
};

export const getProgramJobStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jobId = req.params.jobId as string;
    const job = await nlpQueue.getJob(jobId);

    if (!job) {
      res.status(404).json({ error: 'Job không tồn tại hoặc đã hết hạn' });
      return;
    }

    const state = await job.getState();

    if (state === 'failed') {
      res.status(200).json({ status: 'failed', reason: job.failedReason });
      return;
    }

    res.status(200).json({ status: state });
  } catch (err) {
    next(err);
  }
};
