import Session from '../models/Session.js';
import User from '../models/User.js';

export const createSession = async (req, res) => {
  try {
    const { requestId, duration } = req.body;

    // Find the request in the recipient's swapRequests
    const recipient = await User.findById(req.userId);
    const request = recipient.swapRequests.find(req => req._id.toString() === requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    // Create a new session
    const session = await Session.create({
      userA: request.from,
      userB: request.to,
      skillFromA: request.offerSkill,
      skillFromB: request.wantSkill,
      duration,
      expiresAt,
      status: 'active',

    });

    // Add the session to both users
    await User.findByIdAndUpdate(request.from, { $push: { sessions: session._id } });
    await User.findByIdAndUpdate(request.to, { $push: { sessions: session._id } });

    // Remove the request from the recipient's swapRequests
    recipient.swapRequests = recipient.swapRequests.filter(req => req._id.toString() !== requestId);
    await recipient.save();

    res.json({ message: 'Session created successfully', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ userA: req.userId }, { userB: req.userId }]
    })
    .populate('userA', 'name')
    .populate('userB', 'name');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
