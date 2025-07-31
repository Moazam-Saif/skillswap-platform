import cron from 'node-cron';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { sendSessionReminderEmail } from './emailService.js';

// Store active reminder jobs
const activeReminders = new Map();

// Function to parse time slot and get next occurrence
const getNextReminderTime = (timeSlot) => {
  // Example timeSlot: "Thursday 17:30 - 18:30"
  const [dayTime, endTime] = timeSlot.split(' - ');
  const [day, startTime] = dayTime.split(' ');

  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };

  const [hours, minutes] = startTime.split(':').map(Number);
  const targetDay = dayMap[day];

  const now = new Date();
  const nextOccurrence = new Date(now);

  // Set to target time
  nextOccurrence.setHours(hours, minutes, 0, 0);

  // Calculate days until target day
  const currentDay = now.getDay();
  let daysUntil = targetDay - currentDay;

  if (daysUntil < 0) {
    // Target day is in the future (next week)
    daysUntil += 7;
  }

  nextOccurrence.setDate(now.getDate() + daysUntil);

  // If today is the target day and the target time is still in the future, use today
  // If today is the target day and the target time has passed, schedule for next week
  if (daysUntil === 0 && now.getTime() > nextOccurrence.getTime()) {
    nextOccurrence.setDate(nextOccurrence.getDate() + 7);
  }

  return nextOccurrence;
};

// Function to create cron expression for reminder (5 minutes before)
const createReminderCron = (timeSlot) => {
  const [dayTime] = timeSlot.split(' - ');
  const [day, startTime] = dayTime.split(' ');

  const dayMap = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
    'Friday': 5, 'Saturday': 6, 'Sunday': 0
  };

  const [hours, minutes] = startTime.split(':').map(Number);

  // Calculate reminder time (5 minutes before)
  let reminderHours = hours;
  let reminderMinutes = minutes - 5;

  if (reminderMinutes < 0) {
    reminderMinutes += 60;
    reminderHours -= 1;
  }

  if (reminderHours < 0) {
    reminderHours += 24;
  }

  const targetDay = dayMap[day];

  // Cron format: minute hour day-of-month month day-of-week
  // For weekly recurring: minute hour * * day-of-week
  return `${reminderMinutes} ${reminderHours} * * ${targetDay}`;
};

// Function to schedule reminders for a session
export const scheduleSessionReminders = async (sessionId) => {
  try {
    const session = await Session.findById(sessionId)
      .populate('userA', 'name email')
      .populate('userB', 'name email');

    if (!session || session.status !== 'active') {
      console.log(`⚠️ Session ${sessionId} not found or not active`);
      return;
    }

    console.log(`📅 Scheduling reminders for session: ${sessionId}`);

    // Clear existing reminders for this session
    clearSessionReminders(sessionId);

    // Schedule reminder for each time slot
    session.scheduledTime.forEach((timeSlot, index) => {
      try {
     
        // Existing cron job for future weeks
        const cronExpression = createReminderCron(timeSlot);
        const reminderKey = `${sessionId}_${index}`;
        console.log(`⏰ Setting reminder for ${timeSlot} with cron: ${cronExpression}`);
        const task = cron.schedule(cronExpression, async () => {
          await sendSessionReminder(session, timeSlot);
        }, {
          scheduled: true,
          timezone: "Asia/Karachi" // Adjust to your timezone
        });

        activeReminders.set(reminderKey, task);
        console.log(`✅ Reminder scheduled for session ${sessionId}, slot: ${timeSlot}`);
      } catch (error) {
        console.error(`❌ Error scheduling reminder for ${timeSlot}:`, error);
      }
    });
  } catch (error) {
    console.error('❌ Error scheduling session reminders:', error);
  }
};

// Function to send session reminder
const sendSessionReminder = async (session, timeSlot) => {
  try {
    console.log(`🔔 Sending reminder for session ${session._id}, slot: ${timeSlot}`);

    const userA = session.userA;
    const userB = session.userB;

    // Send reminder to both users
    await Promise.all([
      sendSessionReminderEmail(userA.email, userA.name, session, timeSlot),
      sendSessionReminderEmail(userB.email, userB.name, session, timeSlot)
    ]);

    console.log(`✅ Reminders sent for session ${session._id}`);

  } catch (error) {
    console.error('❌ Error sending session reminder:', error);
  }
};

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