import User from '../models/User.js';

export const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const matchUsers = await User.find({
      _id: { $ne: req.userId },
      'skills.category': { $in: currentUser.skills.map(s => s.category) }
    });

    res.json(matchUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
