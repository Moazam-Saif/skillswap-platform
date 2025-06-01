export const setSkills = async (req, res) => {
  try {
    const { skills } = req.body; // each skill should include name + category
    const user = await User.findByIdAndUpdate(req.userId, { skills }, { new: true });
    res.json(user.skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
