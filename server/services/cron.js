import cron from "node-cron";
import Session from "../models/Session.js";
import User from "../models/User.js";

// This job runs every 12 hours (at midnight and noon)
cron.schedule("0 */12 * * *", async () => {
  try {
    const now = new Date();
    
    // Update Sessions collection
    const sessionResult = await Session.updateMany(
      { status: "active", expiresAt: { $lte: now } },
      { $set: { status: "completed" } }
    );
    
    // Update ALL expired sessions in User arrays using $[]
    const userResult = await User.updateMany(
      { 
        sessions: { 
          $elemMatch: { 
            status: "active", 
            expiresAt: { $lte: now } 
          }
        }
      },
      { 
        $set: { 
          "sessions.$[elem].status": "completed" 
        }
      },
      {
        arrayFilters: [{ 
          "elem.status": "active", 
          "elem.expiresAt": { $lte: now } 
        }]
      }
    );
    
    console.log(`[Session Cron] Updated Sessions collection:`, sessionResult.modifiedCount || sessionResult.nModified);
    console.log(`[Session Cron] Updated User sessions:`, userResult.modifiedCount || userResult.nModified);
  } catch (err) {
    console.error("[Session Cron] Error updating sessions:", err);
  }
});