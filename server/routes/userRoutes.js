import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  setAvailability,
  addRating,getAllUsers,getSkillInfo,sendSwapRequest,getAllSwapRequests
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { changePassword } from '../controllers/authController.js';
import { getSkillMatches,getPartialSkillMatches,getCategorySkillMatches } from '../controllers/matchController.js';


const router = express.Router();

router.get('/profile/:id', verifyToken, getUserProfile);
router.put('/profile/:id', verifyToken, updateUserProfile);
router.post('/availability', verifyToken, setAvailability);
router.post('/rating', verifyToken, addRating);
router.post('/change-password', verifyToken, changePassword);
router.post('/swap-request', verifyToken, sendSwapRequest);

router.get('/all', getAllUsers);
router.get('/matches', verifyToken, getSkillMatches);
router.get('/partial-matches', verifyToken, getPartialSkillMatches);
router.get('/category-matches', verifyToken, getCategorySkillMatches);
router.get('/fetchCat/:skillId',getSkillInfo);
router.get('/swap-requests/:id', verifyToken, getAllSwapRequests);

export default router;
