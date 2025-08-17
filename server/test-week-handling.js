import mongoose from 'mongoose';
import Session from './models/Session.js';
import moment from 'moment-timezone';
import dotenv from 'dotenv';

dotenv.config();

async function testWeekHandling() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test session
    const testSession = new Session({
      userA: new mongoose.Types.ObjectId(),
      userB: new mongoose.Types.ObjectId(),
      skillFromA: 'Test Skill A',
      skillFromB: 'Test Skill B',
      scheduledTime: ['Monday 14:00-15:00', 'Wednesday 10:00-11:00', 'Friday 16:00-17:00'],
      duration: 60,
      expiresAt: moment().add(1, 'week').toDate(),
      status: 'active'
    });

    console.log('\n🧪 Testing Week Handling:\n');

    // Test scenarios
    const testCases = [
      { day: 'Monday', time: '13:00', desc: 'Monday before slot (should be accessible - 5min grace)' },
      { day: 'Monday', time: '14:30', desc: 'Monday during slot (should be accessible)' },
      { day: 'Monday', time: '16:00', desc: 'Monday after slot (should NOT be accessible)' },
      { day: 'Tuesday', time: '14:00', desc: 'Tuesday (next Monday slot should be next week)' },
      { day: 'Friday', time: '10:00', desc: 'Friday (Monday slot should be next week)' },
      { day: 'Sunday', time: '14:00', desc: 'Sunday (Monday slot should be tomorrow)' }
    ];

    testCases.forEach((testCase, index) => {
      // Create a test moment for this scenario
      const testMoment = moment.utc().day(testCase.day).hour(parseInt(testCase.time.split(':')[0])).minute(parseInt(testCase.time.split(':')[1]));
      
      console.log(`\n${index + 1}. ${testCase.desc}`);
      console.log(`   Testing from: ${testMoment.format('dddd YYYY-MM-DD HH:mm UTC')}`);
      
      testSession.scheduledTime.forEach((slot, slotIndex) => {
        const isAccessible = testSession.isMeetingAccessible(slotIndex, testMoment.toDate());
        const nextOccurrence = testSession.getNextSlotOccurrence(
          slot.split(' ')[0], 
          slot.split(' ')[1].split('-')[0], 
          slot.split(' ')[1].split('-')[1], 
          testMoment
        );
        
        console.log(`   Slot ${slotIndex} (${slot}): ${isAccessible ? '✅ Accessible' : '❌ Not accessible'}`);
        if (nextOccurrence) {
          console.log(`     Next occurrence: ${nextOccurrence.start.format('dddd YYYY-MM-DD HH:mm UTC')}`);
        }
      });
    });

    console.log('\n🎯 Test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testWeekHandling();