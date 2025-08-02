import mongoose from "mongoose";

export const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  category: { type: String }
}, { _id: false });

const availabilitySlotSchema = new mongoose.Schema({
  originalDay: { type: String, required: true },
  originalStartTime: { type: String, required: true },
  originalEndTime: { type: String, required: true },
  utcDay: { type: String, required: true },
  utcStartTime: { type: String, required: true },
  utcEndTime: { type: String, required: true },
  userTimezone: { type: String, required: true },
  day: String,
  startTime: String,
  endTime: String
}, { _id: false });

const swapRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offerSkill: { 
    type: mongoose.Schema.Types.Mixed, // ✅ Allow both object and string
    required: true 
  },
  wantSkill: { 
    type: mongoose.Schema.Types.Mixed, // ✅ Allow both object and string
    required: true 
  },
  days: { type: Number, required: true },
  timeSlots: [{ type: String }],
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  timezone: { type: String, default: 'UTC' }, // ✅ Add timezone
  createdAt: { type: Date, default: Date.now }
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { 
    type: String, 
    required: function() {
      return !this.isGoogleUser; // Only required for non-Google users
    }
  },
  // ✅ Match the controller field names
  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String },
  imageUrl: { type: String },
  isEmailVerified: { type: Boolean, default: false }, // ✅ Changed from isVerified
  emailVerificationToken: { type: String }, // ✅ Added
  emailVerificationExpires: { type: Date }, // ✅ Added
  
  skills: [String],
  availability: [availabilitySlotSchema],
  timezone: { type: String, default: 'UTC' },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  // Keep existing fields if they exist
  skillsHave: [skillSchema],
  skillsWant: [skillSchema],
  categoriesHave: [String],
  categoriesWant: [String],
  swapRequests: [swapRequestSchema],
  requestsSent: [swapRequestSchema],
  ratings: [{ type: Number, min: 1, max: 5 }],
  
  // Old verification fields (for backward compatibility)
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// ✅ UPDATED: Better pre-save middleware
userSchema.pre('save', function (next) {
  // Auto-sync old and new verification fields
  if (this.isEmailVerified !== undefined) {
    this.isVerified = this.isEmailVerified;
  }
  
  // For Google users, ensure proper setup
  if (this.isGoogleUser) {
    this.isEmailVerified = true;
    this.isVerified = true;
    this.passwordHash = null; // Explicitly set to null for Google users
  }
  
  next();
});

export default mongoose.model("User", userSchema);