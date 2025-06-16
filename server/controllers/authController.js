import User from '../models/User.js';
import RefreshToken from '../models/Refreshtoken.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// Access token expires in 15 minutes
function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await argon2.hash(password);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await argon2.verify(user.passwordHash, password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000);

    await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt });

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 86400000,
      })
      .json({ accessToken,userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: 'No refresh token provided' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.expiresAt < new Date())
      return res.status(401).json({ message: 'Invalid or expired refresh token' });

    const user = await User.findById(stored.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken,userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user || !(await argon2.verify(user.passwordHash, currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = await argon2.hash(newPassword);
    await user.save();

    // Invalidate all existing refresh tokens
    await RefreshToken.deleteMany({ userId: user._id });

    res
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
      .status(200)
      .json({ message: 'Password changed. All sessions have been logged out.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

