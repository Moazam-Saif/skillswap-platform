import { Queue, Worker } from 'bullmq';
import redis from './redisClient.js'; // Use your existing Redis client
import Session from '../models/Session.js';

export const sessionQueue = new Queue('session-expiry', { connection: redis });

// In scheduleSessionExpiry
export async function scheduleSessionExpiry(sessionId, expiresAt) {
  const delay = new Date(expiresAt) - Date.now();
  console.log('Scheduling expiry for', sessionId, 'at', expiresAt, 'delay:', delay);
  await sessionQueue.add(
    'expire-session',
    { sessionId },
    { delay }
  );
}

// In startSessionExpiryWorker
export function startSessionExpiryWorker() {
  console.log('Session expiry worker started');
  const worker = new Worker('session-expiry', async job => {
    console.log('Processing job:', job.id, job.data);
    if (job.name === 'expire-session') {
      await Session.findByIdAndUpdate(job.data.sessionId, { status: 'completed' });
      console.log(`Session ${job.data.sessionId} marked as completed by BullMQ`);
      clearSessionReminders(job.data.sessionId);
    }
  }, { connection: redis });
}