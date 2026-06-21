import { nlpQueue } from './bullmq.client';

export interface NlpJobPayload {
  userId: number;
  prompt: string;
  context?: string;
}

export const addNlpJob = (userId: number, payload: NlpJobPayload) => {
  return nlpQueue.add(`nlp-user-${userId}`, payload, {
    attempts: 2,
    backoff: { type: 'fixed', delay: 2000 },
    removeOnComplete: 50,
    removeOnFail: 25,
  });
};
