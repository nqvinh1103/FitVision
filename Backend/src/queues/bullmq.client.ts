import { Queue } from 'bullmq';
import { env } from '../config/env';

// Queue instances sử dụng REDIS_URL connection string
// maxRetriesPerRequest: null và enableReadyCheck: false là bắt buộc cho BullMQ
const connection = {
  host: new URL(env.REDIS_URL).hostname || 'localhost',
  port: parseInt(new URL(env.REDIS_URL).port || '6379'),
  password: new URL(env.REDIS_URL).password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const cvQueue = new Queue('cv-jobs', { connection });
export const nlpQueue = new Queue('nlp-jobs', { connection });
