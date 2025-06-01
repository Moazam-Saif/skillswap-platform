import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  setAvailability,
  addRating,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile/:id', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.post('/availability', verifyToken, setAvailability);
router.post('/rating', verifyToken, addRating);

export default router;
