// models/Session.js
import mongoose from "mongoose";
import { skillSchema } from "./User.js";

const sessionSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  skillFromA: skillSchema,
  skillFromB: skillSchema,

  scheduledTime: [{ type: String }],

  isConfirmed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration:Number,
  expiresAt: { type: Date, required: true }, // <-- add this
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);
