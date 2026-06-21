import { cvQueue } from './bullmq.client';

export interface CvJobPayload {
  sessionId: number;
  userId: number;
  exerciseId: number;
  keypoints: number[][]; // [frame][33 joints * 4 coords]
  startTime: string;
  endTime: string;
  hmacSignature: string;
}

export const addCvJob = (sessionId: number, payload: CvJobPayload) => {
  return cvQueue.add(`cv-session-${sessionId}`, payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
};
