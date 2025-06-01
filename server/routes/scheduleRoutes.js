import express from 'express';
import {
  proposeSession,
  respondToSession,
  getUserSessions,
} from '../controllers/scheduleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/propose', verifyToken, proposeSession);
router.post('/respond', verifyToken, respondToSession);
router.get('/my-sessions', verifyToken, getUserSessions);

export default router;
