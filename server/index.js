import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db";

config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
