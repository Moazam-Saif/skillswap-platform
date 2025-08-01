// models/User.js
/*Info : each user matches the other based on either the broader 
category they selected or the specific skills the want. 
*/
import mongoose from "mongoose";

export const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  category: { type: String } // <-- Add this line
}, { _id: false });

const availabilitySlotSchema = new mongoose.Schema({
  day: String,              // e.g., "Monday"
  startTime: String,        // "14:00"
  endTime: String           // "16:00"
}, { _id: false });

const swapRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offerSkill: { type: Object, required: true }, // { name, id, category }
  wantSkill: { type: Object, required: true },  // { name, id, category }
  days: { type: Number, required: true },
  timeSlots: [{ type: String }], // e.g. ["Monday 09:00 - 10:00"]
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
    googleId: {
    type: String,
    sparse: true, // Allows multiple null values
    unique: true
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
   passwordHash: {
    type: String,
    required: false // Changed from required: true
  },
    isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  contact:String,
  bio: String,
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  imageUrl: String,
  skillsHave: [skillSchema],
  skillsWant: [skillSchema],
  skillsLearned: [skillSchema],
  categoriesHave: [String], // <-- add this
  categoriesWant: [String],
  swapRequests: [swapRequestSchema], // requests received
  requestsSent: [swapRequestSchema],

  availability: [availabilitySlotSchema], // Public slots user is available for scheduling

  matchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (this.isGoogleUser && !this.passwordHash) {
    // Google users don't need password hash
    next();
  } else if (!this.isGoogleUser && !this.passwordHash) {
    // Non-Google users must have password
    return next(new Error('Password is required for non-Google users'));
  } else {
    next();
  }
});

export default mongoose.model("User", userSchema);
