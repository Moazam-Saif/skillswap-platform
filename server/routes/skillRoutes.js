import express from 'express';
import { setSkills } from '../controllers/skillController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/set', verifyToken, setSkills);

export default router;
