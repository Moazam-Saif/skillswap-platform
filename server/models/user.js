import mongoose from "mongoose";

export const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  category: { type: String }
}, { _id: false });

const availabilitySlotSchema = new mongoose.Schema({
  id: { type: String, required: true }, // ✅ Keep as required
  originalDay: { type: String, required: true },
  originalStartTime: { type: String, required: true },
  originalEndTime: { type: String, required: true },
  utcDay: { type: String, required: true },
  utcStartTime: { type: String, required: true },
  utcEndTime: { type: String, required: true },
  userTimezone: { type: String, required: true },
}, { _id: false });

// ✅ ADD: Pre-save middleware to ensure all availability slots have unique IDs
availabilitySlotSchema.pre('validate', function() {
  if (!this.id) {
    this.id = new mongoose.Types.ObjectId().toString();
  }
});

const swapRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offerSkill: { 
    type: mongoose.Schema.Types.Mixed,
    required: true 
  },
  wantSkill: { 
    type: mongoose.Schema.Types.Mixed,
    required: true 
  },
  days: { type: Number, required: true },
  timeSlots: [{ type: String }],
  selectedAvailabilityIds: [{ type: String }],
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  timezone: { type: String, default: 'UTC' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { 
    type: String, 
    required: function() {
      return !this.isGoogleUser;
    }
  },

  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String },
  imageUrl: { type: String },
  contact: { type: String }, // ✅ ADD THIS FIELD
  bio: { type: String }, // ✅ ADD THIS FIELD TOO (if not already there)
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  
  skills: [String],
  availability: [availabilitySlotSchema], // ✅ Uses updated schema with ID validation
  timezone: { type: String, default: 'UTC' },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  skillsHave: [skillSchema],
  skillsWant: [skillSchema],
  categoriesHave: [String],
  categoriesWant: [String],
  swapRequests: [swapRequestSchema],
  requestsSent: [swapRequestSchema],
  ratings: [{ type: Number, min: 1, max: 5 }],
  
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// ✅ UPDATED: Enhanced pre-save middleware
userSchema.pre('save', function (next) {
  // Auto-sync verification fields
  if (this.isEmailVerified !== undefined) {
    this.isVerified = this.isEmailVerified;
  }
  
  // For Google users
  if (this.isGoogleUser) {
    this.isEmailVerified = true;
    this.isVerified = true;
    this.passwordHash = null;
  }
  
  
  next();
});

export default mongoose.model("User", userSchema);