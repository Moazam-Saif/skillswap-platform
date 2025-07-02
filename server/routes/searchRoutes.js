import express from 'express';
import { searchBySkill,searchByCategory,searchByName } from '../controllers/searchController';

const router = express.Router();

router.get('/search/skill/:skillName', searchBySkill);
router.get('/search/category/:category', searchByCategory);
router.get('/search/name/:name', searchByName);

export default router;