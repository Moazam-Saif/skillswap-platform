import moment from 'moment-timezone';

export function getLastSlotDate(timeSlots, weeks, userTimezone = 'UTC') {
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  
  const now = moment.tz(userTimezone);
  let maxDate = null;

  timeSlots.forEach(slot => {
    const [dayTime, endTime] = slot.split(' - ');
    const [day, startTime] = dayTime.split(' ');
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // Create the slot time in user's timezone
    const slotMoment = moment.tz(userTimezone)
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

  // Return as UTC Date object
  return maxDate ? maxDate.utc().toDate() : null;
}