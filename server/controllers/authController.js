import User from '../models/User.js';
import RefreshToken from '../models/Refreshtoken.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

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

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.expiresAt < new Date())
      return res.status(401).json({ message: 'Invalid or expired refresh token' });

    const user = await User.findById(stored.userId);
    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
