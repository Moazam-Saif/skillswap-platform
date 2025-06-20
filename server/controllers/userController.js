import User from '../models/User.js';
import { fetchSkill } from '../services/lightcast.js';

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

    // Fetch categories for each skill in skillsHave and skillsWant
    const skillsHave = req.body.skillsHave || [];
    const skillsWant = req.body.skillsWant || [];

    // Fetch categories for skillsHave
    const categoriesHave = await Promise.all(
      skillsHave.map(async (skill) => {
        const skillInfo = await fetchSkill(skill.id);
        console.log(skill);
        console.log("1."+skill.id);
        console.log("2."+skillInfo)
        // Adjust the path below if your skillInfo structure is different
        return skillInfo;
      })
    );

    // Fetch categories for skillsWant
    const categoriesWant = await Promise.all(
      skillsWant.map(async (skill) => {
        const skillInfo = await fetchSkill(skill.id);
        return skillInfo;
      })
    );

    // Add categories to the update payload
    const updatePayload = {
      ...req.body,
      categoriesHave,
      categoriesWant,
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

export const getSkillInfo = async (req, res) => {
  try {
    const skilllId = req.params.skillId;
    console.log(skilllId,"recieved")
    const skillInfo = await fetchSkill(skilllId);
    res.json(skillInfo);
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
}