import cron from "node-cron";
import Session from "../models/Session.js";


// This job runs every 12 hours (at midnight and noon)
cron.schedule("0 */12 * * *", async () => {
  try {
    const now = new Date();
    const result = await Session.updateMany(
      { status: "active", expiresAt: { $lte: now } },
      { $set: { status: "completed" } }
    );
    console.log(`[Session Cron] Updated sessions:`, result.modifiedCount || result.nModified);
  } catch (err) {
    console.error("[Session Cron] Error updating sessions:", err);
  }
});