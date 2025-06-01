// models/Session.js
import mongoose from "mongoose";
import { skillSchema } from "./User.js";

const sessionSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  skillFromA: skillSchema,
  skillFromB: skillSchema,

  scheduledTime: {
    date: { type: String, required: true }, // e.g. "2025-06-03"
    start: { type: String, required: true }, // e.g. "14:00"
    end: { type: String, required: true }
  },

  isConfirmed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);
