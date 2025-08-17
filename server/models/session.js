import mongoose from 'mongoose';
import moment from 'moment-timezone'; // ✅ Add missing import

const sessionSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillFromA: { type: mongoose.Schema.Types.Mixed, required: true },
  skillFromB: { type: mongoose.Schema.Types.Mixed, required: true },
  scheduledTime: [{ type: String }], // UTC times
  duration: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled', 'expired'], 
    default: 'active' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  meetingRooms: [{
    slotIndex: { type: Number, required: true },
    roomId: { type: String, required: true },
    timeSlot: { type: String, required: true },
    isActive: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// ✅ Method to generate meeting room ID
sessionSchema.methods.generateMeetingRoomId = function(slotIndex) {
  return `skillswap_session_${this._id}_slot_${slotIndex}`;
};

// ✅ FIXED: Method to check if meeting is accessible
sessionSchema.methods.isMeetingAccessible = function(slotIndex, currentTime = new Date()) {
  const slot = this.scheduledTime[slotIndex];
  if (!slot) return false;

  // Parse slot: "Monday 14:00-15:00" (UTC)
  const [dayTime, endTime] = slot.split('-');
  const [day, startTime] = dayTime.trim().split(' ');

  const dayMap = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
    'Friday': 5, 'Saturday': 6, 'Sunday': 0
  };

  const targetDayOfWeek = dayMap[day];
  const now = moment.utc(currentTime);
  
  // ✅ FIXED: Find the next occurrence of this day+time
  const nextOccurrence = this.getNextSlotOccurrence(day, startTime, endTime, now);
  
  if (!nextOccurrence) return false;

  // Allow access 5 minutes before and after
  const accessStart = nextOccurrence.start.clone().subtract(5, 'minutes');
  const accessEnd = nextOccurrence.end.clone().add(5, 'minutes');

  const isAccessible = now.isBetween(accessStart, accessEnd);
  
  console.log(`🕐 Checking slot "${slot}":`, {
    now: now.format('dddd YYYY-MM-DD HH:mm UTC'),
    slotStart: nextOccurrence.start.format('dddd YYYY-MM-DD HH:mm UTC'),
    slotEnd: nextOccurrence.end.format('dddd YYYY-MM-DD HH:mm UTC'),
    accessWindow: `${accessStart.format('HH:mm')} - ${accessEnd.format('HH:mm')}`,
    isAccessible
  });

  return isAccessible;
};

// ✅ NEW: Helper method to find next occurrence of a time slot
sessionSchema.methods.getNextSlotOccurrence = function(day, startTime, endTime, fromTime = moment.utc()) {
  const dayMap = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
    'Friday': 5, 'Saturday': 6, 'Sunday': 0
  };

  const targetDayOfWeek = dayMap[day];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Start from beginning of current day
  let candidate = fromTime.clone().startOf('day');
  
  // Find the next occurrence of target day
  while (candidate.day() !== targetDayOfWeek) {
    candidate.add(1, 'day');
  }
  
  // Set the start time
  const slotStart = candidate.clone().hour(startHour).minute(startMinute).second(0);
  const slotEnd = candidate.clone().hour(endHour).minute(endMinute).second(0);
  
  // If this occurrence is in the past, get next week's occurrence
  if (slotEnd.isBefore(fromTime)) {
    const nextWeekStart = slotStart.clone().add(7, 'days');
    const nextWeekEnd = slotEnd.clone().add(7, 'days');
    
    return {
      start: nextWeekStart,
      end: nextWeekEnd
    };
  }
  
  return {
    start: slotStart,
    end: slotEnd
  };
};

export default mongoose.model('Session', sessionSchema);