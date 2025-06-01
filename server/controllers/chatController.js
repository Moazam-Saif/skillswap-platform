import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { to, content } = req.body;
    const message = await Message.create({ from: req.userId, to, content });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { from: req.userId, to: otherUserId },
        { from: otherUserId, to: req.userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
