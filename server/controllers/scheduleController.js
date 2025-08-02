import Session from '../models/Session.js';
import User from '../models/User.js';
import { scheduleSessionReminders, clearSessionReminders } from '../services/reminderService.js';
import { getLastSlotDate } from '../services/sessionsService.js';
import { scheduleSessionExpiry } from '../services/sessionQueue.js';
import moment from 'moment-timezone';

export const createSession = async (req, res) => {
  try {
    const { requestId, duration } = req.body;

    // Find the request in the recipient's swapRequests
    const recipient = await User.findById(req.userId);
    const request = recipient.swapRequests.find(req => req._id.toString() === requestId);

    if (!request) {
      console.log("Request not found in swapRequests");
      return res.status(404).json({ error: "Swap request not found" });
    }

    const requester = await User.findById(request.from);
    const expiresAt = getLastSlotDate(request.timeSlots, duration, requester.timezone);

    // Create a new session
    const session = await Session.create({
      userA: request.from,
      userB: request.to,
      skillFromA: request.offerSkill,
      skillFromB: request.wantSkill,
      scheduledTime: request.timeSlots || [],
      duration,
      expiresAt,
      status: 'active',
    });

    // ✅ Schedule reminders
    try {
      if (session.scheduledTime && session.scheduledTime.length > 0) {
        console.log("Calling await schedule session reminder");
        await scheduleSessionReminders(session._id, requester.timezone);
        console.log(`✅ Reminders scheduled for session ${session._id}`);
      } else {
        console.log(`⚠️ No time slots provided for session ${session._id}, no reminders scheduled`);
      }
    } catch (reminderError) {
      console.error('❌ Failed to schedule reminders:', reminderError);
    }

    // ✅ FIXED: Use updateOne with specific operations to avoid full document validation
    await User.updateOne(
      { _id: request.from },
      { $push: { sessions: session._id } }
    );

    await User.updateOne(
      { _id: request.to },
      { $push: { sessions: session._id } }
    );

    // ✅ FIXED: Remove the swap request using updateOne
    await User.updateOne(
      { _id: req.userId },
      { $pull: { swapRequests: { _id: requestId } } }
    );

    await scheduleSessionExpiry(session._id, session.expiresAt);

    res.json({ 
      message: 'Session created successfully', 
      session,
      remindersScheduled: session.scheduledTime?.length || 0
    });
  } catch (err) {
    console.error("Error in createSession:", err);
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
