import User from '../models/User.js';
<<<<<<< HEAD
import { fetchSkillTitles } from "../services/lightcast.js"
=======
import { fetchSkill } from '../services/lightcast.js';
>>>>>>> temp-main

export const getUserProfile = async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      const err = new Error('Forbidden: Not your profile');
      err.status = 403;
      throw err;
    }
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      const err = new Error('Forbidden: Not your profile');
      err.status = 403;
      throw err;
    }

<<<<<<< HEAD
    // Get skillsHave and skillsWant from the request
    const { skillsHave = [], skillsWant = [] } = req.body;

    // Fetch titles for each skill in skillsHave and skillsWant
    const titlesHave = await Promise.all(
      skillsHave.map(async (skill) => {
        if (!skill.id) return [];
        return await fetchSkillTitles(skill.id);
      })
    );
    const titlesWant = await Promise.all(
      skillsWant.map(async (skill) => {
        if (!skill.id) return [];
        return await fetchSkillTitles(skill.id);
      })
    );
    console.log(titlesHave,titlesWant);

    // Add titlesHave and titlesWant to the update payload
    const updatePayload = {
      ...req.body,
      titlesHave,
      titlesWant,
=======
    // Fetch categories and add to each skill object
    const skillsHave = req.body.skillsHave || [];
    const skillsWant = req.body.skillsWant || [];

    // Use Set to avoid duplicate categories
    const categoriesHaveSet = new Set();
    const enrichedSkillsHave = await Promise.all(
      skillsHave.map(async (skill) => {
        const skillInfo = await fetchSkill(skill.id);
        if (skillInfo) categoriesHaveSet.add(skillInfo);
        return {
          ...skill,
          category: skillInfo||null
        };
      })
    );

    const categoriesWantSet = new Set();
    const enrichedSkillsWant = await Promise.all(
      skillsWant.map(async (skill) => {
        const skillInfo = await fetchSkill(skill.id);
        if (skillInfo) categoriesWantSet.add(skillInfo);
        return {
          ...skill,
          category: skillInfo||null
        };
      })
    );

    // Prepare the update payload
    const updatePayload = {
      ...req.body,
      skillsHave: enrichedSkillsHave,
      skillsWant: enrichedSkillsWant,
      categoriesHave: Array.from(categoriesHaveSet),
      categoriesWant: Array.from(categoriesWantSet),
>>>>>>> temp-main
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const setAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { availability }, { new: true });
    res.json(user.availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addRating = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const user = await User.findById(userId);
    user.ratings.push(rating);
    await user.save();
    res.json({ avgRating: user.ratings.reduce((a, b) => a + b) / user.ratings.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Only select fields you need for the dashboard
    const users = await User.find({}, 'name imageUrl');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

<<<<<<< HEAD
export const getTitles= async (req, res) => {
  try {
    const titles = await fetchSkillTitles(req.params.skillId);
    res.json(titles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
=======
export const getSkillInfo = async (req, res) => {
  try {
    const skilllId = req.params.skillId;
    const skillInfo = await fetchSkill(skilllId);
    res.json(skillInfo);
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
}
>>>>>>> temp-main
