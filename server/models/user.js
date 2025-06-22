// models/User.js
/*Info : each user matches the other based on either the broader 
category they selected or the specific skills the want. 
*/
import mongoose from "mongoose";

export const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true }
}, { _id: false });

const availabilitySlotSchema = new mongoose.Schema({
  day: String,              // e.g., "Monday"
  startTime: String,        // "14:00"
  endTime: String           // "16:00"
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  contact:String,
  bio: String,
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  imageUrl: String,
  skillsHave: [skillSchema],
  skillsWant: [skillSchema],
  categoriesHave: [String],
  categoriesWant: [String],
  skillsLearned: [skillSchema],

  availability: [availabilitySlotSchema], // Public slots user is available for scheduling

  matchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
