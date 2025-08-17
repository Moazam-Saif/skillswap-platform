import User from '../models/User.js';
import { fetchSkill } from '../services/lightcast.js';
import { clearSearchCache } from './searchController.js';
import moment from 'moment-timezone';
import mongoose from 'mongoose'

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

    // Fetch categories and add to each skill object
    const skillsHave = req.body.skillsHave || [];
    const skillsWant = req.body.skillsWant || [];

    // Use Set to avoid duplicate categories
    const categoriesHaveSet = new Set();
    const enrichedSkillsHave = await Promise.all(
      skillsHave.map(async (skill) => {
        const skillInfo = await fetchSkill(skill.id);
        if (skillInfo) categoriesHaveSet.add(skillInfo);
        return {
          ...skill,
          category: skillInfo || null
        };
      })
    );

    const categoriesWantSet = new Set();
    const enrichedSkillsWant = await Promise.all(
      skillsWant.map(async (skill) => {
        const skillInfo = await fetchSkill(skill.id);
        if (skillInfo) categoriesWantSet.add(skillInfo);
        return {
          ...skill,
          category: skillInfo || null
        };
      })
    );

    // Prepare the update payload
    const updatePayload = {
      ...req.body,
      skillsHave: enrichedSkillsHave,
      skillsWant: enrichedSkillsWant,
      categoriesHave: Array.from(categoriesHaveSet),
      categoriesWant: Array.from(categoriesWantSet),
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    await clearSearchCache();
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ...existing imports...

// Update the setAvailability function only:

// Update the setAvailability function only:

export const setAvailability = async (req, res) => {
  try {
    const { availability, timezone } = req.body;

    // Validate timezone
    if (!moment.tz.zone(timezone)) {
      return res.status(400).json({ error: 'Invalid timezone' });
    }

    // Convert user's local time to UTC while preserving context + ADD REAL MongoDB ObjectIds
    const utcAvailability = availability.map((slot, index) => {
      const today = moment.tz(timezone);

      const startMoment = today.clone()
        .day(slot.day)
        .hour(moment(slot.startTime, 'HH:mm').hour())
        .minute(moment(slot.startTime, 'HH:mm').minute())
        .second(0)
        .millisecond(0);

      const endMoment = today.clone()
        .day(slot.day)
        .hour(moment(slot.endTime, 'HH:mm').hour())
        .minute(moment(slot.endTime, 'HH:mm').minute())
        .second(0)
        .millisecond(0);

      return {
        // ✅ FIXED: Use proper MongoDB ObjectId instead of timestamp-based ID
        id: slot.id || new mongoose.Types.ObjectId().toString(),

        // Original user input (semantic meaning)
        originalDay: slot.day,
        originalStartTime: slot.startTime,
        originalEndTime: slot.endTime,

        // UTC representation (for calculations)
        utcDay: startMoment.utc().format('dddd'),
        utcStartTime: startMoment.utc().format('HH:mm'),
        utcEndTime: endMoment.utc().format('HH:mm'),

        // Context preservation
        userTimezone: timezone,

       
      };
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        availability: utcAvailability,
        timezone: timezone
      },
      { new: true }
    );

    console.log(`✅ Availability updated with ${utcAvailability.length} slots with MongoDB ObjectIds`);

    res.json({
      message: 'Availability updated successfully',
      availability: user.availability
    });
  } catch (err) {
    console.error('Error setting availability:', err);
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


export const getAllUsers = async (req, res) => {
  try {
    // Only select fields you need for the dashboard
    const users = await User.find({}, 'name imageUrl');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSkillInfo = async (req, res) => {
  try {
    const skilllId = req.params.skillId;
    const skillInfo = await fetchSkill(skilllId);
    res.json(skillInfo);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ...existing functions...

export const sendSwapRequest = async (req, res) => {
  try {
    const { toUserId, offerSkill, wantSkill, days, selectedAvailabilityIds } = req.body; // ✅ CHANGED: selectedAvailabilityIds instead of timeSlots
    const fromUserId = req.userId;

    // ✅ UPDATED: Validate required fields
    if (!toUserId || !offerSkill || !wantSkill || !days || !selectedAvailabilityIds || !Array.isArray(selectedAvailabilityIds)) {
      return res.status(400).json({
        error: 'Missing required fields: toUserId, offerSkill, wantSkill, days, selectedAvailabilityIds (array)'
      });
    }

    // ✅ Validate that users are different
    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'Cannot send swap request to yourself' });
    }

    // ✅ STEP 1: Look up recipient's availability to get real UTC times
    const recipient = await User.findById(toUserId).select('availability');
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    // ✅ STEP 2: Find selected availability slots by ID
    const selectedSlots = recipient.availability.filter(slot =>
      selectedAvailabilityIds.includes(slot.id)
    );

    // ✅ STEP 3: Validate all slot IDs were found
    if (selectedSlots.length !== selectedAvailabilityIds.length) {
      const foundIds = selectedSlots.map(slot => slot.id);
      const missingIds = selectedAvailabilityIds.filter(id => !foundIds.includes(id));
      return res.status(400).json({
        error: 'Some availability slots not found',
        missingIds
      });
    }

    // ✅ STEP 4: Extract UTC times from availability database (single source of truth)
    const utcTimeSlots = selectedSlots.map(slot =>
      `${slot.utcDay} ${slot.utcStartTime}-${slot.utcEndTime}`
    );

    console.log(`✅ Found ${selectedSlots.length} availability slots for UTC conversion:`);
    selectedSlots.forEach((slot, index) => {
      console.log(`  ${index + 1}. Original: ${slot.originalDay} ${slot.originalStartTime}-${slot.originalEndTime} (${slot.userTimezone})`);
      console.log(`     UTC: ${utcTimeSlots[index]}`);
    });

    // ✅ STEP 5: Create swap request with UTC times from availability lookup
    const swapRequest = {
      from: fromUserId,
      to: toUserId,
      offerSkill,
      wantSkill,
      days: Number(days),
      timeSlots: utcTimeSlots, // ✅ UTC times from availability database
      selectedAvailabilityIds, // ✅ Keep reference to original availability
      status: "pending",
      timezone: selectedSlots[0]?.userTimezone || 'UTC', // ✅ Use recipient's timezone for context
      createdAt: new Date()
    };

    // Add to recipient's swapRequests
    const updatedRecipient = await User.findByIdAndUpdate(
      toUserId,
      { $push: { swapRequests: swapRequest } },
      { new: true }
    );

    if (!updatedRecipient) {
      return res.status(404).json({ error: 'Failed to update recipient' });
    }

    // Add to sender's requestsSent
    const updatedSender = await User.findByIdAndUpdate(
      fromUserId,
      { $push: { requestsSent: swapRequest } },
      { new: true }
    );

    if (!updatedSender) {
      return res.status(404).json({ error: 'Failed to update sender' });
    }

    console.log(`✅ Swap request created with ${utcTimeSlots.length} UTC time slots from availability lookup`);

    res.json({
      message: "Swap request sent successfully!",
      debug: {
        utcTimeSlots,
        selectedSlots: selectedSlots.length,
        originalTimezone: selectedSlots[0]?.userTimezone
      }
    });
  } catch (err) {
    console.error('❌ Error in sendSwapRequest:', err);
    res.status(500).json({ error: err.message });
  }
};



export const getAllSwapRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('swapRequests requestsSent')
      .populate('swapRequests.from swapRequests.to requestsSent.from requestsSent.to', 'name imageUrl');
    res.json({
      received: user.swapRequests || [],
      sent: user.requestsSent || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    const { viewerTimezone } = req.query;
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert availability to viewer's timezone
    const convertedAvailability = user.availability.map(slot => {
      // Get the original timezone (fallback to user's stored timezone or UTC)
      const originalTimezone = slot.userTimezone || user.timezone || 'UTC';

      // If no viewer timezone provided, use original
      const targetTimezone = viewerTimezone || originalTimezone;

      // Use original data if available, fallback to old format
      const originalDay = slot.originalDay || slot.day;
      const originalStartTime = slot.originalStartTime || slot.startTime;
      const originalEndTime = slot.originalEndTime || slot.endTime;

      // Recreate the original moment
      const today = moment.tz(originalTimezone);
      const originalStartMoment = today.clone()
        .day(originalDay)
        .hour(moment(originalStartTime, 'HH:mm').hour())
        .minute(moment(originalStartTime, 'HH:mm').minute())
        .second(0)
        .millisecond(0);

      const originalEndMoment = today.clone()
        .day(originalDay)
        .hour(moment(originalEndTime, 'HH:mm').hour())
        .minute(moment(originalEndTime, 'HH:mm').minute())
        .second(0)
        .millisecond(0);

      // Convert to viewer's timezone
      const viewerStartMoment = originalStartMoment.clone().tz(targetTimezone);
      const viewerEndMoment = originalEndMoment.clone().tz(targetTimezone);

      return {
        day: viewerStartMoment.format('dddd'),
        startTime: viewerStartMoment.format('HH:mm'),
        endTime: viewerEndMoment.format('HH:mm')
      };
    });

    const userWithConvertedTimes = {
      ...user.toObject(),
      availability: convertedAvailability,
      swapCount: user.sessions ? user.sessions.filter(session => session.status === 'completed').length : 0
    };

    res.json(userWithConvertedTimes);
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ message: err.message });
  }
};


export const getUserImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('imageUrl');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ imageUrl: user.imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};