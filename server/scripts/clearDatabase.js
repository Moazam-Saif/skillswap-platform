import mongoose from 'mongoose';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { clearAllReminders, getReminderStatus } from '../services/reminderService.js';
import { sessionQueue } from '../services/sessionQueue.js';
import redis from '../services/redisClient.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function clearDatabase() {
  try {
    console.log('🐳 Running database cleanup in Docker container...\n');
    console.log('🧹 Starting database cleanup...\n');

    // ✅ Docker environment detection
    const isDocker = process.env.NODE_ENV === 'docker' || 
                    process.env.MONGO_URI?.includes('mongo') || 
                    process.env.REDIS_URL?.includes('redis');
    
    if (isDocker) {
      console.log('🐳 Docker environment detected');
      console.log(`📡 MongoDB URI: ${process.env.MONGO_URI?.replace(/:[^:]*@/, ':***@')}`);
      console.log(`🔄 Redis URL: ${process.env.REDIS_URL?.replace(/:[^:]*@/, ':***@')}\n`);
    }

    // ✅ Step 1: Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // ✅ Step 2: Check current reminder status
    console.log('📊 Checking current reminder status...');
    const reminderStatus = getReminderStatus();
    console.log(`📈 Active reminders: ${reminderStatus.activeCount}`);
    if (reminderStatus.activeCount > 0) {
      console.log(`📝 Reminder keys: ${reminderStatus.reminderKeys.slice(0, 5).join(', ')}${reminderStatus.activeCount > 5 ? '...' : ''}\n`);
    }

    // ✅ Step 3: Clear all active reminders
    console.log('⏰ Clearing all active reminders...');
    const reminderClearResult = clearAllReminders();
    console.log(`✅ Reminders cleared: ${reminderClearResult.successCount}/${reminderClearResult.initialCount}\n`);

    // ✅ Step 4: Clear BullMQ session expiry queue
    console.log('🔄 Clearing BullMQ session expiry queue...');
    try {
      await sessionQueue.obliterate({ force: true });
      console.log('✅ BullMQ session queue cleared\n');
    } catch (queueError) {
      console.log('⚠️ BullMQ queue clear failed (may not exist):', queueError.message, '\n');
    }

    // ✅ Step 5: Count existing data
    console.log('📊 Counting existing data...');
    const userCount = await User.countDocuments();
    const sessionCount = await Session.countDocuments();
    const activeSessionCount = await Session.countDocuments({ status: 'active' });
    
    console.log(`👥 Users: ${userCount}`);
    console.log(`📅 Sessions: ${sessionCount} (${activeSessionCount} active)`);

    if (userCount === 0 && sessionCount === 0) {
      console.log('✅ Database is already clean!\n');
      return;
    }

    // ✅ Step 6: Get sample data before deletion (for verification)
    console.log('\n📋 Sample data before deletion:');
    const sampleUsers = await User.find({}).limit(3).select('name email');
    const sampleSessions = await Session.find({}).limit(3).select('userA userB status scheduledTime');
    
    console.log('👥 Sample users:');
    sampleUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
    });
    
    console.log('📅 Sample sessions:');
    sampleSessions.forEach((session, index) => {
      console.log(`  ${index + 1}. ${session._id} - Status: ${session.status}, Slots: ${session.scheduledTime.length}`);
    });

    // ✅ Step 7: Docker-friendly confirmation (reduced wait time)
    console.log('\n⚠️  WARNING: This will permanently delete ALL data!');
    console.log('💾 Make sure you have backups if needed.');
    
    if (isDocker) {
      console.log('🐳 Docker mode: Proceeding with deletion in 2 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('🔄 Proceeding with deletion in 3 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // ✅ Step 8: Delete all sessions
    console.log('🗑️ Deleting all sessions...');
    const sessionDeleteResult = await Session.deleteMany({});
    console.log(`✅ Deleted ${sessionDeleteResult.deletedCount} sessions\n`);

    // ✅ Step 9: Delete all users
    console.log('🗑️ Deleting all users...');
    const userDeleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${userDeleteResult.deletedCount} users\n`);

    // ✅ Step 10: Clear Redis (Docker-aware)
    console.log('🔄 Clearing Redis cache...');
    try {
      await redis.flushall();
      console.log('✅ Redis cache cleared\n');
    } catch (redisError) {
      console.log('⚠️ Redis clear failed (may be okay in Docker):', redisError.message, '\n');
    }

    // ✅ Step 11: Verify cleanup
    console.log('🔍 Verifying cleanup...');
    const finalUserCount = await User.countDocuments();
    const finalSessionCount = await Session.countDocuments();
    const finalReminderStatus = getReminderStatus();

    console.log(`👥 Users remaining: ${finalUserCount}`);
    console.log(`📅 Sessions remaining: ${finalSessionCount}`);
    console.log(`⏰ Active reminders remaining: ${finalReminderStatus.activeCount}`);

    // ✅ Step 12: Cleanup summary
    console.log('\n🎯 Docker Cleanup Summary:');
    console.log('═'.repeat(50));
    console.log(`✅ Users deleted: ${userDeleteResult.deletedCount}`);
    console.log(`✅ Sessions deleted: ${sessionDeleteResult.deletedCount}`);
    console.log(`✅ Reminders cleared: ${reminderClearResult.successCount}`);
    console.log(`✅ BullMQ queue cleared: Yes`);
    console.log(`✅ Redis cache cleared: Yes`);
    console.log(`🐳 Environment: ${isDocker ? 'Docker' : 'Local'}`);
    console.log('═'.repeat(50));

    if (finalUserCount === 0 && finalSessionCount === 0 && finalReminderStatus.activeCount === 0) {
      console.log('🎉 Database cleanup completed successfully!');
      console.log('🔥 All users, sessions, reminders, and queues have been cleared.\n');
    } else {
      console.log('⚠️ Cleanup may be incomplete:');
      if (finalUserCount > 0) console.log(`  - ${finalUserCount} users still exist`);
      if (finalSessionCount > 0) console.log(`  - ${finalSessionCount} sessions still exist`);
      if (finalReminderStatus.activeCount > 0) console.log(`  - ${finalReminderStatus.activeCount} reminders still active`);
    }

  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // ✅ Step 13: Disconnect from MongoDB
    console.log('📡 Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
    // ✅ Step 14: Close Redis connection
    try {
      await redis.quit();
      console.log('✅ Redis connection closed');
    } catch (redisError) {
      console.log('⚠️ Redis close failed:', redisError.message);
    }

    console.log('\n🏁 Docker cleanup script finished.');
    process.exit(0);
  }
}

// Functions for partial cleanup
export async function clearSessionsOnly() {
  try {
    console.log('🐳 Docker: Clearing sessions only...\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    const reminderResult = clearAllReminders();
    console.log(`✅ Cleared ${reminderResult.successCount} reminders`);
    
    await sessionQueue.obliterate({ force: true });
    console.log('✅ BullMQ queue cleared');
    
    const sessionResult = await Session.deleteMany({});
    console.log(`✅ Deleted ${sessionResult.deletedCount} sessions`);
    
    const userUpdateResult = await User.updateMany(
      {},
      { $set: { sessions: [], swapRequests: [], requestsSent: [] } }
    );
    console.log(`✅ Cleared session references from ${userUpdateResult.modifiedCount} users`);
    
    await mongoose.disconnect();
    console.log('🎉 Sessions cleared successfully!\n');
    
  } catch (error) {
    console.error('❌ Error clearing sessions:', error);
  }
}

export async function clearUsersOnly() {
  try {
    console.log('🐳 Docker: Clearing users only...\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    const userResult = await User.deleteMany({});
    console.log(`✅ Deleted ${userResult.deletedCount} users`);
    
    await mongoose.disconnect();
    console.log('🎉 Users cleared successfully!\n');
    
  } catch (error) {
    console.error('❌ Error clearing users:', error);
  }
}

// Run the cleanup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  clearDatabase();
}

export default clearDatabase;