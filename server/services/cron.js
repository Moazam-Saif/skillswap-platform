import cron from "node-cron";
import Session from "../models/Session.js";

console.log("🔍 Cron module loaded!");

// Function to update expired sessions
const updateExpiredSessions = async () => {
  try {
    console.log("🔄 updateExpiredSessions started...");
    const now = new Date();
    
    // First, find expired sessions to see what we're working with
    const expiredSessions = await Session.find({ 
      status: "active", 
      expiresAt: { $lte: now } 
    });
    
    if (expiredSessions.length === 0) {
      console.log("[Session Cron] No expired sessions found");
      return;
    }
    
    console.log(`[Session Cron] Found ${expiredSessions.length} expired sessions`);
    
    // Update Sessions collection only - User.sessions references will automatically reflect the change
    const sessionResult = await Session.updateMany(
      { status: "active", expiresAt: { $lte: now } },
      { $set: { status: "completed" } }
    );
    
    console.log(`[Session Cron] Updated ${sessionResult.modifiedCount || sessionResult.nModified} sessions to 'completed' status`);
    
    // Log the IDs of updated sessions for debugging
    const updatedSessionIds = expiredSessions.map(s => s._id);
    console.log(`[Session Cron] Updated session IDs:`, updatedSessionIds);
    
  } catch (err) {
    console.error("[Session Cron] Error updating sessions:", err);
  }
};

// IIFE to run immediately when module loads
(async () => {
  console.log("🚀 IIFE started - running initial session cleanup...");
  await updateExpiredSessions();
  
  // Schedule to run every 12 hours
  cron.schedule("0 */12 * * *", () => {
    console.log("[Session Cron] Running scheduled session cleanup...");
    updateExpiredSessions();
  });
  
  console.log("✅ Cron job scheduled to run every 12 hours");
})();