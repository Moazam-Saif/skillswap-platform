import express from 'express';
import {
  sendMessage,
  getConversation,
} from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', verifyToken, sendMessage);
router.get('/conversation/:otherUserId', verifyToken, getConversation);

export default router;
