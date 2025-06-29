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
          category: skillInfo || null
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
          category: skillInfo || null
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
    const skillInfo = await fetchSkill(skilllId);
    res.json(skillInfo);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const sendSwapRequest = async (req, res) => {
  try {
    const { toUserId, offerSkill, wantSkill, days, timeSlots } = req.body;
    const fromUserId = req.userId;


    const swapRequest = {
      from: fromUserId,
      to: toUserId,
      offerSkill,
      wantSkill,
      days,
      timeSlots,
      status: "pending",
      createdAt: new Date()
    };

    // Add to recipient's swapRequests
    const updatedRecipient = await User.findByIdAndUpdate(
      toUserId,
      { $push: { swapRequests: swapRequest } },
      { new: true }
    );
 

    // Add to sender's requestsSent
    const updatedSender = await User.findByIdAndUpdate(
      fromUserId,
      { $push: { requestsSent: swapRequest } },
      { new: true }
    );


    res.json({ message: "Swap request sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSwapRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('swapRequests requestsSent')
      .populate('swapRequests.from swapRequests.to requestsSent.from requestsSent.to', 'name imageUrl');
    res.json({
      received: user.swapRequests || [],
      sent: user.requestsSent || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};