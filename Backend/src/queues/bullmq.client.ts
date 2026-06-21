import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { env } from '../config/env';

// maxRetriesPerRequest: null và enableReadyCheck: false là bắt buộc cho BullMQ
export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// @ts-ignore - version mismatch between ioredis and bullmq's bundled version
export const cvQueue = new Queue('cv-jobs', { connection: redisConnection });
// @ts-ignore - version mismatch between ioredis and bullmq's bundled version
export const nlpQueue = new Queue('nlp-jobs', { connection: redisConnection });
