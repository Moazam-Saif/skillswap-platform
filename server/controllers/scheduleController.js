import Session from '../models/Session.js';
import User from '../models/User.js';
import { scheduleSessionReminders, clearSessionReminders } from '../services/reminderService.js';
import { getLastSlotDate } from '../services/sessionsService.js';
import { scheduleSessionExpiry } from '../services/sessionQueue.js';
import moment from 'moment-timezone';

export const createSession = async (req, res) => {
  try {
    const { requestId, duration } = req.body;

    console.log("Looking for requestId:", requestId);

    // Find the request in the recipient's swapRequests
    const recipient = await User.findById(req.userId);
    console.log("Recipient ID:", req.userId);
    console.log("Number of swapRequests:", recipient.swapRequests.length);
    console.log("Request IDs:", recipient.swapRequests.map(r => r._id?.toString()));

    const request = recipient.swapRequests.find(req => req._id.toString() === requestId);

    if (!request) {
      console.log("Request not found in swapRequests");
      return res.status(404).json({ error: "Swap request not found" });
    }

   const expiresAt = getLastSlotDate(request.timeSlots, duration);

    
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

    // ✅ NEW: Schedule reminders for the new session
    try {
      if (session.scheduledTime && session.scheduledTime.length > 0) {
        console.log("Calling await schedule session reminder");
        await scheduleSessionReminders(session._id);
        console.log(`✅ Reminders scheduled for session ${session._id}`);
      } else {
        console.log(`⚠️ No time slots provided for session ${session._id}, no reminders scheduled`);
      }
    } catch (reminderError) {
      console.error('❌ Failed to schedule reminders:', reminderError);
      // Don't fail the session creation if reminder scheduling fails
    }

    // Add the session to both users
    await User.findByIdAndUpdate(request.from, { $push: { sessions: session._id } });
    await User.findByIdAndUpdate(request.to, { $push: { sessions: session._id } });

    // Remove the request from the recipient's swapRequests
    recipient.swapRequests = recipient.swapRequests.filter(req => req._id.toString() !== requestId);
    await recipient.save();
    await scheduleSessionExpiry(session._id, session.expiresAt);

    res.json({ 
      message: 'Session created successfully', 
      session,
      remindersScheduled: session.scheduledTime?.length || 0  // ✅ NEW: Info about reminders
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
