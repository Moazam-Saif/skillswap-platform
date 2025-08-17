import Session from '../models/Session.js';
import User from '../models/User.js';
import moment from 'moment-timezone';

// ✅ Get meeting room access
export const getMeetingAccess = async (req, res) => {
  try {
    const { sessionId, slotIndex } = req.params;
    const userId = req.userId;

    console.log(`🎪 Meeting access request: Session ${sessionId}, Slot ${slotIndex}, User ${userId}`);

    // Find session and validate user access
    const session = await Session.findById(sessionId)
      .populate('userA', 'name email')
      .populate('userB', 'name email');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // ✅ Check if user is participant
    const isParticipant = session.userA._id.toString() === userId || 
                         session.userB._id.toString() === userId;

    if (!isParticipant) {
      console.log(`❌ User ${userId} not authorized for session ${sessionId}`);
      return res.status(403).json({ error: 'Not authorized to access this meeting' });
    }

    // ✅ Check if session is active
    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session is not active' });
    }

    // ✅ Validate slot index
    const slotIdx = parseInt(slotIndex);
    if (slotIdx < 0 || slotIdx >= session.scheduledTime.length) {
      return res.status(400).json({ error: 'Invalid time slot' });
    }

    // ✅ Check if meeting is accessible (time-based)
    if (!session.isMeetingAccessible(slotIdx)) {
      const timeSlot = session.scheduledTime[slotIdx];
      return res.status(400).json({ 
        error: 'Meeting is not available at this time',
        timeSlot,
        message: 'You can only join the meeting during the scheduled time slot (5 minutes before to 5 minutes after)'
      });
    }

    // ✅ Generate or get existing room ID
    const roomId = session.generateMeetingRoomId(slotIdx);
    const timeSlot = session.scheduledTime[slotIdx];

    // ✅ Get current user info
    const currentUser = userId === session.userA._id.toString() ? session.userA : session.userB;
    const otherUser = userId === session.userA._id.toString() ? session.userB : session.userA;

    console.log(`✅ Meeting access granted: Room ${roomId}, User ${currentUser.name}`);

    res.json({
      roomId,
      timeSlot,
      sessionId: session._id,
      slotIndex: slotIdx,
      participants: {
        currentUser: {
          id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email
        },
        otherUser: {
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email
        }
      },
      skills: {
        fromCurrentUser: userId === session.userA._id.toString() ? session.skillFromA : session.skillFromB,
        fromOtherUser: userId === session.userA._id.toString() ? session.skillFromB : session.skillFromA
      },
      meetingConfig: {
        domain: 'skillswap-meeting.social',
        roomName: roomId,
        userInfo: {
          displayName: currentUser.name,
          email: currentUser.email
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting meeting access:', error);
    res.status(500).json({ error: 'Failed to get meeting access' });
  }
};

// ✅ Validate meeting access (for frontend to check before redirecting)
export const validateMeetingAccess = async (req, res) => {
  try {
    const { sessionId, slotIndex } = req.params;
    const userId = req.userId;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ valid: false, error: 'Session not found' });
    }

    const isParticipant = session.userA.toString() === userId || 
                         session.userB.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({ valid: false, error: 'Not authorized' });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ valid: false, error: 'Session not active' });
    }

    const slotIdx = parseInt(slotIndex);
    const isAccessible = session.isMeetingAccessible(slotIdx);
    const timeSlot = session.scheduledTime[slotIdx];

    res.json({
      valid: isAccessible,
      timeSlot,
      sessionId: session._id,
      slotIndex: slotIdx,
      message: isAccessible ? 'Meeting is accessible' : 'Meeting not available at this time'
    });

  } catch (error) {
    console.error('❌ Error validating meeting access:', error);
    res.status(500).json({ valid: false, error: 'Validation failed' });
  }
};