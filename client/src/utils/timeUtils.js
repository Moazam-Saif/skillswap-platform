import moment from "moment-timezone";

/**
 * Get the user's current timezone
 */
export const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert UTC time slot to user's local timezone
 * utcSlot - UTC time slot in format "Monday 14:00-15:00" or "Monday 14:00 - 15:00"
 * userTimezone - User's timezone (optional, defaults to browser timezone)
 * Returns converted time slot in user's timezone
 */
export const convertTimeSlotToLocal = (utcSlot, userTimezone = null) => {
    if (!utcSlot) return "No time slot";
    
    const timezone = userTimezone || getUserTimezone();
    
    try {
        // Parse the UTC slot format (e.g., "Monday 14:00-15:00")
        const [dayTime, endTime] = utcSlot.includes(' - ') 
            ? utcSlot.split(' - ') 
            : utcSlot.split('-');
        
        const [day, startTime] = dayTime.trim().split(' ');
        
        // Create moment objects for start and end times
        const utcStart = moment.utc().day(day).hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1]));
        const utcEnd = moment.utc().day(day).hour(Number(endTime.split(':')[0])).minute(Number(endTime.split(':')[1]));
        
        // Convert to user's timezone
        const localStart = utcStart.tz(timezone);
        const localEnd = utcEnd.tz(timezone);
        
        // Format the result
        const localDay = localStart.format('dddd');
        const localTimeRange = `${localStart.format('HH:mm')}-${localEnd.format('HH:mm')}`;
        
        return `${localDay} ${localTimeRange}`;
    } catch (error) {
        console.error('Error converting time slot:', error);
        return utcSlot; // Return original if conversion fails
    }
};

/**
 * Check if a meeting is currently ongoing
 * utcSlot - UTC time slot in format "Monday 14:00-15:00"
 * userTimezone - User's timezone (optional, defaults to browser timezone)
 * bufferMinutes - Buffer time in minutes before/after meeting (default: 5)
 * Returns true if meeting is ongoing
 */
export const isMeetingOngoing = (utcSlot, userTimezone = null, bufferMinutes = 5) => {
    if (!utcSlot) return false;
    
    const timezone = userTimezone || getUserTimezone();
    
    try {
        // Parse the UTC slot
        let dayTime, endTime, day, startTime;
        if (utcSlot.includes(' - ')) {
            [dayTime, endTime] = utcSlot.split(' - ');
            [day, startTime] = dayTime.split(' ');
        } else {
            [dayTime, endTime] = utcSlot.split('-');
            [day, startTime] = dayTime.trim().split(' ');
        }
        
        const now = moment().tz(timezone);
        const slotStart = moment.utc().day(day).hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1])).tz(timezone);
        const slotEnd = moment.utc().day(day).hour(Number(endTime.split(':')[0])).minute(Number(endTime.split(':')[1])).tz(timezone);
        
        return now.isBetween(
            slotStart.clone().subtract(bufferMinutes, 'minutes'), 
            slotEnd.clone().add(bufferMinutes, 'minutes')
        );
    } catch (error) {
        console.error('Error checking if meeting is ongoing:', error);
        return false;
    }
};