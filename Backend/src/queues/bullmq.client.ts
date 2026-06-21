import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { env } from '../config/env';

// maxRetriesPerRequest: null và enableReadyCheck: false là bắt buộc cho BullMQ
export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Cast needed: BullMQ v5 types expect its internal ConnectionOptions, not raw IORedis
export const cvQueue = new Queue('cv-jobs', { connection: redisConnection as any });
export const nlpQueue = new Queue('nlp-jobs', { connection: redisConnection as any });
