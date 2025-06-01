import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
