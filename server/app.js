import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import searchRoutes from './routes/searchRoutes.js';



const app = express();

// Global Middlewares
const corsOptions = {
  origin: [
    'http://localhost:5173',                    // Local development
    'https://client-x83y.onrender.com'         // Production
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search',searchRoutes);


// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server Error' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'skillswap-api'
  });
});

export default app;
