import moment from 'moment-timezone';

export function getLastSlotDate(timeSlots, weeks) {
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  const now = moment.tz('Asia/Karachi');
  let maxDate = null;

  timeSlots.forEach(slot => {
    const [dayTime, endTime] = slot.split(' - ');
    const [day, startTime] = dayTime.split(' ');
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // Find the next occurrence of this slot
    const currentDay = now.day();
    let daysUntil = dayMap[day] - currentDay;
    if (daysUntil < 0) daysUntil += 7;

    // For each week, calculate the slot's date in Asia/Karachi
    for (let w = 0; w < weeks; w++) {
      const slotDate = now.clone().add(daysUntil + w * 7, 'days').hour(endHour).minute(endMinute).second(0).millisecond(0);
      if (!maxDate || slotDate.isAfter(maxDate)) maxDate = slotDate;
    }
  });

  // Return as a JS Date in UTC
  return maxDate ? maxDate.toDate() : null;
}