import moment from 'moment-timezone';

export function getLastSlotDate(timeSlots, weeks, timezone = 'UTC') {
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  
  const now = moment.utc(); // ✅ Process in UTC since slots are UTC
  let maxDate = null;

  timeSlots.forEach(slot => {
    // ✅ UPDATED: Handle both formats consistently
    let dayTime, endTime, day, startTime;
    
    if (slot.includes(' - ')) {
      // Old format: "Thursday 17:30 - 18:30"
      [dayTime, endTime] = slot.split(' - ');
      [day, startTime] = dayTime.split(' ');
    } else {
      // New format: "Thursday 17:30-18:30" (from availability)
      [dayTime, endTime] = slot.split('-');
      [day, startTime] = dayTime.trim().split(' ');
    }

    const [endHour, endMinute] = endTime.split(':').map(Number);

    // ✅ Process as UTC since slots are now stored in UTC
    const slotMoment = moment.utc()
      .day(dayMap[day])
      .hour(endHour)
      .minute(endMinute)
      .second(0)
      .millisecond(0);

    // If this slot is in the past this week, move to next week
    if (slotMoment.isBefore(now)) {
      slotMoment.add(1, 'week');
    }

    // For each week, calculate the slot's date
    for (let w = 0; w < weeks; w++) {
      const weekSlot = slotMoment.clone().add(w, 'weeks');
      if (!maxDate || weekSlot.isAfter(maxDate)) {
        maxDate = weekSlot;
      }
    }
  });

  console.log(`📅 Session will expire at: ${maxDate ? maxDate.format('YYYY-MM-DD HH:mm UTC') : 'null'} (${weeks} weeks)`);

  // Return as UTC Date object
  return maxDate ? maxDate.toDate() : null;
}