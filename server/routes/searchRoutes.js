import express from 'express';
import { searchBySkill,searchByCategory,searchByName } from '../controllers/searchController.js';

const router = express.Router();

router.get('/skill/:skillName', searchBySkill);
router.get('/category/:category', searchByCategory);
router.get('/name/:name', searchByName);

export default router;