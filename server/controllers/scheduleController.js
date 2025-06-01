import Session from '../models/Session.js';

export const proposeSession = async (req, res) => {
  try {
    const { recipientId, datetime } = req.body;
    const session = await Session.create({
      sender: req.userId,
      recipient: recipientId,
      datetime,
      status: 'pending'
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const respondToSession = async (req, res) => {
  try {
    const { sessionId, response } = req.body; // 'accepted' or 'rejected'
    const session = await Session.findByIdAndUpdate(sessionId, { status: response }, { new: true });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ $or: [{ sender: req.userId }, { recipient: req.userId }] });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
