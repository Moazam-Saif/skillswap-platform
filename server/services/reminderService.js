import cron from 'node-cron';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { sendSessionReminderEmail } from './emailService.js';
import moment from 'moment-timezone';

// Store active reminder jobs
const activeReminders = new Map();

// ✅ FIXED: Proper UTC cron expression creation
const createReminderCron = (timeSlot) => {
  console.log(`⏰ Processing UTC time slot: "${timeSlot}"`);
  
  // Handle format: "Monday 14:00-15:00" (UTC from availability)
  let dayTime, endTime, day, startTime;
  
  if (timeSlot.includes(' - ')) {
    [dayTime, endTime] = timeSlot.split(' - ');
    [day, startTime] = dayTime.split(' ');
  } else {
    [dayTime, endTime] = timeSlot.split('-');
    [day, startTime] = dayTime.trim().split(' ');
  }

  const dayMap = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
    'Friday': 5, 'Saturday': 6, 'Sunday': 0
  };

  // Parse UTC time and subtract 5 minutes for reminder
  const [hours, minutes] = startTime.split(':').map(Number);
  const reminderMoment = moment.utc().hour(hours).minute(minutes).subtract(5, 'minutes');
  
  const targetDay = dayMap[day];
  const reminderHours = reminderMoment.hour();
  const reminderMinutes = reminderMoment.minute();

  console.log(`✅ Reminder scheduled: ${day} ${startTime} UTC -> reminder at ${reminderMoment.format('dddd HH:mm')} UTC`);

  return `${reminderMinutes} ${reminderHours} * * ${targetDay}`;
};

export const scheduleSessionReminders = async (sessionId, timezone = 'UTC') => {
  try {
    const session = await Session.findById(sessionId)
      .populate('userA', 'name email timezone')
      .populate('userB', 'name email timezone');

    if (!session || session.status !== 'active') {
      console.log(`⚠️ Session ${sessionId} not found or not active, skipping reminders`);
      return;
    }

    // Clear existing reminders first
    clearSessionReminders(sessionId);

    console.log(`📅 Scheduling reminders for session ${sessionId} with ${session.scheduledTime.length} UTC time slots`);

    session.scheduledTime.forEach((timeSlot, index) => {
      try {
        const cronExpression = createReminderCron(timeSlot);
        const reminderKey = `${sessionId}_${index}`;
        
        console.log(`⏰ Creating cron job: "${cronExpression}" for UTC slot: "${timeSlot}"`);
        
        const task = cron.schedule(cronExpression, async () => {
          console.log(`🔔 Reminder triggered for session ${sessionId}, UTC slot: ${timeSlot}`);
          await sendSessionReminder(session, timeSlot);
        }, {
          scheduled: true,
          timezone: "UTC" // Always UTC
        });

        activeReminders.set(reminderKey, task);
        console.log(`✅ Reminder scheduled for session ${sessionId}, UTC slot: ${timeSlot}`);
      } catch (error) {
        console.error(`❌ Error scheduling reminder for ${timeSlot}:`, error);
      }
    });

    console.log(`✅ Total reminders scheduled: ${session.scheduledTime.length} for session ${sessionId}`);
  } catch (error) {
    console.error('❌ Error scheduling session reminders:', error);
  }
};

// ✅ FIXED: Send reminder with proper timezone conversion for users
const sendSessionReminder = async (session, timeSlot) => {
  try {
    console.log(`🔔 Sending reminder for session ${session._id}, slot: ${timeSlot}`);

    const userA = session.userA;
    const userB = session.userB;

    // Convert UTC time slot to each user's timezone for display in email
    const convertedSlotA = convertTimeSlotToUserTimezone(timeSlot, userA.timezone || 'UTC');
    const convertedSlotB = convertTimeSlotToUserTimezone(timeSlot, userB.timezone || 'UTC');

    // Send reminder to both users with their local times
    await Promise.all([
      sendSessionReminderEmail(userA.email, userA.name, session, convertedSlotA, userA.timezone),
      sendSessionReminderEmail(userB.email, userB.name, session, convertedSlotB, userB.timezone)
    ]);

    console.log(`✅ Reminders sent for session ${session._id}`);

  } catch (error) {
    console.error('❌ Error sending session reminder:', error);
  }
};

// ✅ NEW: Helper function to convert UTC time slot to user's timezone
const convertTimeSlotToUserTimezone = (utcTimeSlot, userTimezone) => {
  try {
    // Parse: "Monday 14:00-15:00"
    let dayTime, endTime, day, startTime;
    
    if (utcTimeSlot.includes(' - ')) {
      [dayTime, endTime] = utcTimeSlot.split(' - ');
      [day, startTime] = dayTime.split(' ');
    } else {
      [dayTime, endTime] = utcTimeSlot.split('-');
      [day, startTime] = dayTime.trim().split(' ');
    }

    // Create UTC moment
    const utcMoment = moment.utc().day(day).hour(
      parseInt(startTime.split(':')[0])
    ).minute(
      parseInt(startTime.split(':')[1])
    );

    // Convert to user's timezone
    const localMoment = utcMoment.tz(userTimezone);
    const localEndMoment = moment.utc().day(day).hour(
      parseInt(endTime.split(':')[0])
    ).minute(
      parseInt(endTime.split(':')[1])
    ).tz(userTimezone);

    return `${localMoment.format('dddd HH:mm')} - ${localEndMoment.format('HH:mm')} (${userTimezone})`;
  } catch (error) {
    console.error('Error converting time slot:', error);
    return `${utcTimeSlot} (UTC)`;
  }
};

// ...rest of your reminderService functions remain unchanged

// Function to clear reminders for a session
export const clearSessionReminders = (sessionId) => {
  const keysToDelete = [];

  for (const [key, task] of activeReminders.entries()) {
    if (key.startsWith(sessionId)) {
      task.stop();
      task.destroy();
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => activeReminders.delete(key));
  console.log(`🗑️ Cleared ${keysToDelete.length} reminders for session ${sessionId}`);
};

// Function to initialize reminders for all active sessions
export const initializeAllReminders = async () => {
  try {
    console.log('🚀 Initializing reminders for all active sessions...');

    const activeSessions = await Session.find({ status: 'active' });

    for (const session of activeSessions) {
      await scheduleSessionReminders(session._id);
    }

    console.log(`✅ Initialized reminders for ${activeSessions.length} active sessions`);

  } catch (error) {
    console.error('❌ Error initializing reminders:', error);
  }
};

// Function to handle session status change
export const handleSessionStatusChange = async (sessionId, newStatus) => {
  if (newStatus === 'completed') {
    clearSessionReminders(sessionId);
    console.log(`✅ Cleared reminders for completed session: ${sessionId}`);
  } else if (newStatus === 'active') {
    await scheduleSessionReminders(sessionId);
  }
};

// Add these functions to your existing reminderService.js file

export const clearAllReminders = () => {
  const initialCount = activeReminders.size;
  console.log(`🗑️ Clearing ${initialCount} active reminders...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [key, task] of activeReminders.entries()) {
    try {
      if (task && typeof task.stop === 'function') {
        task.stop();
      }
      if (task && typeof task.destroy === 'function') {
        task.destroy();
      }
      console.log(`✅ Cleared reminder: ${key}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error clearing reminder ${key}:`, error);
      errorCount++;
    }
  }

  activeReminders.clear();
  console.log(`✅ Reminder clearing complete: ${successCount} cleared, ${errorCount} errors`);
  
  return {
    initialCount,
    successCount,
    errorCount,
    finalCount: activeReminders.size
  };
};

export const getReminderStatus = () => {
  return {
    activeCount: activeReminders.size,
    reminderKeys: Array.from(activeReminders.keys())
  };
};