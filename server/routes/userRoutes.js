import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  setAvailability,
  addRating,getAllUsers
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { changePassword } from '../controllers/authController.js';

const router = express.Router();

router.get('/profile/:id', verifyToken, getUserProfile);
router.put('/profile/:id', verifyToken, updateUserProfile);
router.post('/availability', verifyToken, setAvailability);
router.post('/rating', verifyToken, addRating);
router.post('/change-password', verifyToken, changePassword);
router.get('/all', getAllUsers);

export default router;
