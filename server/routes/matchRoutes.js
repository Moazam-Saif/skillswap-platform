import express from 'express';
import { getSkillMatches } from '../controllers/matchController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getSkillMatches);

export default router;
