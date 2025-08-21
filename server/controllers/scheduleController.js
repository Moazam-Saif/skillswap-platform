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

    // ✅ APPROACH 2: Times are already in UTC from availability lookup!
    const utcTimeSlots = request.timeSlots; // Already UTC from sendSwapRequest lookup
    console.log(`✅ Using UTC time slots from availability lookup:`, utcTimeSlots);

    // ✅ Process expiry calculation in UTC
    const expiresAt = getLastSlotDate(utcTimeSlots, duration, 'UTC');

    // Create session with UTC times
    const session = await Session.create({
      userA: request.from,
      userB: request.to,
      skillFromA: request.offerSkill,
      skillFromB: request.wantSkill,
      scheduledTime: utcTimeSlots, // ✅ Pure UTC times from availability database
      duration,
      expiresAt,
      status: 'active',
    });

    console.log(`✅ Session created with ${utcTimeSlots.length} UTC time slots`);

    // ✅ Schedule reminders in UTC (no timezone conversion needed)
    try {
      if (session.scheduledTime && session.scheduledTime.length > 0) {
        console.log("Scheduling reminders for UTC time slots");
        await scheduleSessionReminders(session._id, 'UTC'); // ✅ Pure UTC processing
        console.log(`✅ Reminders scheduled for session ${session._id}`);
      } else {
        console.log(`⚠️ No time slots provided for session ${session._id}, no reminders scheduled`);
      }
    } catch (reminderError) {
      console.error('❌ Failed to schedule reminders:', reminderError);
    }

    // Update users (unchanged)
    await User.updateOne(
      { _id: request.from },
      { $push: { sessions: session._id } }
    );

    await User.updateOne(
      { _id: request.to },
      { $push: { sessions: session._id } }
    );

    await User.updateOne(
      { _id: req.userId },
      { $pull: { swapRequests: { _id: requestId } } }
    );

    console.log('✅ Removed from User A swapRequests');

    // Update status in User B's requestsSent
    const updateResult = await User.updateOne(
      { _id: request.from, "requestsSent._id": requestId },
      { $set: { "requestsSent.$.status": "accepted" } }
    );
    console.log('🔍 Update result for User B requestsSent:', updateResult);


    await scheduleSessionExpiry(session._id, session.expiresAt);



    res.json({
      message: 'Session created successfully',
      session,
      remindersScheduled: session.scheduledTime?.length || 0,
      debug: {
        utcSlots: utcTimeSlots,
        selectedAvailabilityIds: request.selectedAvailabilityIds
      }
    });
  } catch (err) {
    console.error("Error in createSession:", err);
    res.status(500).json({ error: err.message });
  }
};

// getUserSessions unchanged
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