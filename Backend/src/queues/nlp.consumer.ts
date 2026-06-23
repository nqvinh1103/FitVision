import IORedis from 'ioredis';
import { QueueEvents } from 'bullmq';
import { Prisma } from '@prisma/client';
import { nlpQueue } from './bullmq.client';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';

interface WeekProgression {
  week: number;
  sets: number;
  reps: number;
}

interface ExerciseSlot {
  exercise_id: number;
  day_number: number;
  order_in_session: number;
  sets: number;
  reps: number;
  notes?: string;
  progressions?: WeekProgression[];
}

interface ProgramResult {
  program_name: string;
  description: string;
  duration_weeks: number;
  sessions_per_week: number;
  exercises: ExerciseSlot[];
}

async function persistProgram(userId: number, result: ProgramResult): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const program = await tx.trainingProgram.create({
      data: {
        trainerId: undefined,
        title: result.program_name,
        description: result.description,
        durationWeeks: result.duration_weeks,
        sessionsPerWeek: result.sessions_per_week,
        isAiGenerated: true,
        programType: 'ADAPTIVE',
        status: 'DRAFT',
      },
    });

    await tx.programExercise.createMany({
      data: result.exercises.map((ex) => ({
        programId: program.id,
        exerciseId: ex.exercise_id,
        dayNumber: ex.day_number,
        orderInDay: ex.order_in_session,
        sets: ex.sets,
        reps: ex.reps,
        notes: ex.notes ?? null,
        progressions: ex.progressions != null
          ? (ex.progressions as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      })),
    });

    await tx.userProgram.create({
      data: {
        userId,
        programId: program.id,
        amountPaid: 0,
      },
    });
  });
}

export function startNlpConsumer(): void {
  // QueueEvents dùng pub/sub nên cần connection riêng, không share với redisConnection
  const eventsConnection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  const queueEvents = new QueueEvents('nlp-jobs', { connection: eventsConnection as any });

  queueEvents.on('completed', async ({ jobId }) => {
    try {
      const job = await nlpQueue.getJob(jobId);
      if (!job) {
        console.warn(`[NLP Consumer] Job ${jobId} not found in Redis`);
        return;
      }

      const userId: number = job.data.userId;
      const result: ProgramResult = job.returnvalue;

      await persistProgram(userId, result);
      console.log(`[NLP Consumer] Program saved — userId=${userId}, jobId=${jobId}`);
    } catch (err) {
      console.error(`[NLP Consumer] Failed to persist jobId=${jobId}:`, err);
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`[NLP Consumer] Job failed — jobId=${jobId}, reason=${failedReason}`);
  });

  console.log('[NLP Consumer] Listening for nlp-jobs completions');
}
