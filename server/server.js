import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';
import { initializeAllReminders } from './services/reminderService.js';
import { startSessionExpiryWorker } from './services/sessionQueue.js';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected');
  
  // Initialize session reminders after DB connection
  try {
    await initializeAllReminders();
    console.log('✅ Session reminders initialized');
    startSessionExpiryWorker();
    console.log("bullmq session expiry started");
  } catch (error) {
    console.error('❌ Failed to initialize reminders:', error);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});