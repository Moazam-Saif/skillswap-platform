import express from 'express';
import { setSkills } from '../controllers/skillController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { findSkills } from '../controllers/skillfinderController.js';

const router = express.Router();

router.post('/set', verifyToken, setSkills);
router.get("/find", verifyToken,findSkills);

export default router;
