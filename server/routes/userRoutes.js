import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  setAvailability,
  addRating,getAllUsers,getSkillInfo,sendSwapRequest,getAllSwapRequests,getUserById,getUserImage
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { changePassword } from '../controllers/authController.js';
import { getSkillMatches,getPartialSkillMatches,getCategorySkillMatches } from '../controllers/matchController.js';
import { createSession,getUserSessions } from '../controllers/scheduleController.js';
import { getMeetingAccess, validateMeetingAccess } from '../controllers/meetingController.js';
import { rejectSwapRequest } from '../controllers/userController.js';



const router = express.Router();

router.get('/profile/:id', verifyToken, getUserProfile);
router.put('/profile/:id', verifyToken, updateUserProfile);
router.post('/availability', verifyToken, setAvailability);
router.post('/rating', verifyToken, addRating);
router.post('/change-password', verifyToken, changePassword);
router.post('/swap-request', verifyToken, sendSwapRequest);
router.post('/create-session', verifyToken, createSession);
router.post('/swap-requests/:id/reject', verifyToken, rejectSwapRequest);

router.get('/profile/show/:id', verifyToken, getUserById);

router.get('/all', getAllUsers);
router.get('/:id/image', getUserImage);
router.get('/matches', verifyToken, getSkillMatches);
router.get('/partial-matches', verifyToken, getPartialSkillMatches);
router.get('/category-matches', verifyToken, getCategorySkillMatches);
router.get('/fetchCat/:skillId',getSkillInfo);
router.get('/swap-requests', verifyToken, getAllSwapRequests);
router.get('/sessions', verifyToken, getUserSessions);
router.get('/meeting/:sessionId/:slotIndex', verifyToken, getMeetingAccess);
router.get('/meeting/:sessionId/:slotIndex/validate', verifyToken, validateMeetingAccess);


console.log(router.stack.map(r => r.route && r.route.path).filter(Boolean));

export default router;
