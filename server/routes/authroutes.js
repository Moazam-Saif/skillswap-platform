import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser, changePassword, googleAuth } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth); // New Google auth route
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
router.put('/change-password', verifyToken, changePassword);
router.get('/verify-email', verifyEmail);

export default router;