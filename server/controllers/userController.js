import User from '../models/User.js';

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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

export const getPartialSkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const pipeline = [
      // 1. Exclude the current user
      {
        $match: {
          _id: { $ne: currentUser._id }
        }
      },
      // 2. Find intersection arrays
      {
        $addFields: {
          skillsTheyOffer: {
            $setIntersection: ["$skillsHave", currentUser.skillsWant]
          },
          skillsTheyWant: {
            $setIntersection: ["$skillsWant", currentUser.skillsHave]
          }
        }
      },
      // 3. Only keep users who have at least one match in either direction,
      //    but NOT both (no mutual matches)
      {
        $match: {
          $or: [
            { skillsTheyOffer: { $ne: [] }, skillsTheyWant: { $eq: [] } },
            { skillsTheyWant: { $ne: [] }, skillsTheyOffer: { $eq: [] } }
          ]
        }
      },
      // 4. Project the relevant fields
      {
        $project: {
          userId: "$_id",
          name: 1,
          imageUrl: 1,
          skillsTheyOffer: 1,
          skillsTheyWant: 1
        }
      }
    ];

    const matches = await User.aggregate(pipeline);
    res.json(matches);
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
