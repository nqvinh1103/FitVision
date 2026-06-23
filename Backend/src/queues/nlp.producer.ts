import { nlpQueue } from './bullmq.client';

export interface NlpUserProfile {
  fitness_level: string;
  has_pull_up_bar: boolean;
  has_parallel_bars: boolean;
  injuries: string[];
  goal: string;
}

export interface NlpJobPayload {
  userId: number;
  prompt: string;
  context?: string;
  user_profile?: NlpUserProfile;
}

export const addNlpJob = (userId: number, payload: NlpJobPayload) => {
  return nlpQueue.add(`nlp-user-${userId}`, payload, {
    attempts: 2,
    backoff: { type: 'fixed', delay: 2000 },
    removeOnComplete: 50,
    removeOnFail: 25,
  });
};
