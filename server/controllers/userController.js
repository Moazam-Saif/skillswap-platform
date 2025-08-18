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

    // Handle skills enrichment (existing code)
    const skillsHave = req.body.skillsHave || [];
    const skillsWant = req.body.skillsWant || [];

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

    // ✅ ALWAYS process availability if provided - ENSURE UTC + IDs
   // Replace the updateUserProfile availability processing section:

// ✅ ALWAYS process availability if provided - ENSURE UTC + IDs
let processedAvailability = [];

if (req.body.availability && Array.isArray(req.body.availability) && req.body.availability.length > 0) {
  console.log('🔄 BACKEND: Processing availability in updateUserProfile');
  
  // Get user's timezone
  const userTimezone = req.body.timezone || 'UTC';
  console.log('🔄 BACKEND: Using timezone:', userTimezone);

  // ALWAYS convert to UTC format with IDs
  processedAvailability = req.body.availability.map((slot, index) => {
    if (!slot.day || !slot.startTime || !slot.endTime) {
      throw new Error(`Invalid slot at index ${index}: missing required fields`);
    }

    // Create moments in user timezone
    const today = moment.tz(userTimezone);
    
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
    id: slot.id || new mongoose.Types.ObjectId().toString(),
    // ✅ ONLY use the schema field names:
    originalDay: slot.day,
    originalStartTime: slot.startTime,
    originalEndTime: slot.endTime,
    utcDay: startMoment.utc().format('dddd'),
    utcStartTime: startMoment.utc().format('HH:mm'),
    utcEndTime: endMoment.utc().format('HH:mm'),
    userTimezone: userTimezone
  };
});

  console.log('✅ BACKEND: Processed', processedAvailability.length, 'availability slots with UTC + IDs');
}

    // Prepare update payload
    const updatePayload = {
      ...req.body,
      skillsHave: enrichedSkillsHave,
      skillsWant: enrichedSkillsWant,
      categoriesHave: Array.from(categoriesHaveSet),
      categoriesWant: Array.from(categoriesWantSet),
      availability: processedAvailability, // ✅ ALWAYS UTC format with IDs
    };

    if (req.body.timezone) {
      updatePayload.timezone = req.body.timezone;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    await clearSearchCache();
    
    console.log('✅ BACKEND: Profile updated with', processedAvailability.length, 'availability slots');
    res.json(user);
  } catch (err) {
    console.error('❌ BACKEND: Error updating profile:', err);
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ...existing imports...

// Update the setAvailability function only:

// Update the setAvailability function only:

export const setAvailability = async (req, res) => {
  try {
    console.log('🔍 BACKEND: Full request body:', JSON.stringify(req.body, null, 2));
    
    const { availability, timezone } = req.body;

    console.log('🔍 BACKEND: Extracted availability:', availability);
    console.log('🔍 BACKEND: Extracted timezone:', timezone);
    console.log('🔍 BACKEND: Availability type:', typeof availability);
    console.log('🔍 BACKEND: Is availability array?', Array.isArray(availability));

    // VALIDATE
    if (!timezone) {
      console.log('❌ BACKEND: No timezone provided');
      return res.status(400).json({ error: 'Timezone is required' });
    }

    if (!moment.tz.zone(timezone)) {
      console.log('❌ BACKEND: Invalid timezone:', timezone);
      return res.status(400).json({ error: 'Invalid timezone' });
    }

    if (!availability || !Array.isArray(availability) || availability.length === 0) {
      console.log('❌ BACKEND: Invalid availability array:', { availability, isArray: Array.isArray(availability), length: availability?.length });
      return res.status(400).json({ error: 'Availability array is required' });
    }

    console.log('✅ BACKEND: Starting UTC conversion...');

    const utcAvailability = availability.map((slot, index) => {
      console.log(`🔄 BACKEND: Processing slot ${index}:`, slot);

      if (!slot.day || !slot.startTime || !slot.endTime) {
        console.log(`❌ BACKEND: Invalid slot ${index}:`, slot);
        throw new Error(`Invalid slot at index ${index}: missing day, startTime, or endTime`);
      }

      // Create moments in user timezone
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

      // In the setAvailability function, update the return format:

const convertedSlot = {
  id: new mongoose.Types.ObjectId().toString(),
  // ✅ ONLY use the schema field names:
  originalDay: slot.day,
  originalStartTime: slot.startTime,
  originalEndTime: slot.endTime,
  utcDay: startMoment.utc().format('dddd'),
  utcStartTime: startMoment.utc().format('HH:mm'),
  utcEndTime: endMoment.utc().format('HH:mm'),
  userTimezone: timezone
};

      console.log(`✅ BACKEND: Converted slot ${index}:`, convertedSlot);
      return convertedSlot;
    });

    console.log('✅ BACKEND: All slots converted, saving to database...');
    console.log('✅ BACKEND: Final UTC availability:', JSON.stringify(utcAvailability, null, 2));

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        availability: utcAvailability,
        timezone: timezone
      },
      { new: true }
    );

    console.log('✅ BACKEND: User updated, availability saved');

    res.json({
      message: 'Availability updated successfully',
      availability: user.availability,
      debug: {
        slotsProcessed: utcAvailability.length,
        userTimezone: timezone
      }
    });

  } catch (err) {
    console.error('❌ BACKEND: Error setting availability:', err);
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

    console.log(`🔍 Getting user ${req.params.id}, viewer timezone: ${viewerTimezone}`);
    console.log(`📊 User has ${user.availability?.length || 0} availability slots`);

    // ✅ ALWAYS return the full availability data (with UTC fields)
    const userWithFullData = {
      ...user.toObject(),
      // ✅ KEEP FULL AVAILABILITY: Don't convert, let frontend handle it
      availability: user.availability || [],
      swapCount: user.sessions ? user.sessions.filter(session => session.status === 'completed').length : 0
    };

    console.log('✅ Sending user data with availability slots:', userWithFullData.availability.length);

    res.json(userWithFullData);
  } catch (err) {
    console.error('❌ Error getting user:', err);
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