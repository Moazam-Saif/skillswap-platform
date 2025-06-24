import User from '../models/User.js';

export const getSkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const pipeline = [
      // 1. Skip the current user
      {
        $match: {
          _id: { $ne: currentUser._id }
        }
      },

      // 2. Find common skills between:
      // - their skillsHave vs your skillsWant
      // - their skillsWant vs your skillsHave
      {
        $addFields: {
          matchedSkillTheyOffer: {
            $setIntersection: ["$skillsHave", currentUser.skillsWant]
          },
          matchedSkillTheyWant: {
            $setIntersection: ["$skillsWant", currentUser.skillsHave]
          }
        }
      },

      // 3. Only keep users with mutual interest
      {
        $match: {
          matchedSkillTheyOffer: { $ne: [] },
          matchedSkillTheyWant: { $ne: [] }
        }
      },

      // 4. Project full match arrays
      {
        $project: {
          userId: "$_id",
          name: 1,
          imageUrl: 1,
          skillsTheyOffer: "$matchedSkillTheyOffer",
          skillsTheyWant: "$matchedSkillTheyWant",
          availability:1
        }
      }
    ];

    const matches = await User.aggregate(pipeline);
    res.json(matches);
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
          skillsTheyWant: 1,
          availability:1
        }
      }
    ];

    const matches = await User.aggregate(pipeline);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategorySkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const wantCategories = currentUser.categoriesWant || [];
    const haveCategories = currentUser.categoriesHave || [];

    const pipeline = [
      // Exclude the current user
      { $match: { _id: { $ne: currentUser._id } } },

      // Filter users who:
      // - Have at least one category that current user wants
      // - Want at least one category that current user offers
      {
        $match: {
          $expr: {
            $and: [
              { $gt: [{ $size: { $setIntersection: ["$categoriesHave", wantCategories] } }, 0] },
              { $gt: [{ $size: { $setIntersection: ["$categoriesWant", haveCategories] } }, 0] }
            ]
          }
        }
      },

      // Filter the skills to only return relevant ones (optional)
      {
        $project: {
          userId: "$_id",
          name: 1,
          imageUrl: 1,
          skillsTheyOffer: {
            $filter: {
              input: "$skillsHave",
              as: "skill",
              cond: { $in: ["$$skill.category", wantCategories] }
            }
          },
          skillsTheyWant: {
            $filter: {
              input: "$skillsWant",
              as: "skill",
              cond: { $in: ["$$skill.category", haveCategories] }
            }
          },
          availability:1
        }
      }
    ];

    const matches = await User.aggregate(pipeline);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
