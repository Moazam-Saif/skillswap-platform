import User from '../models/User.js';
import RefreshToken from '../models/Refreshtoken.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail, generateVerificationToken } from '../services/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Access token expires in 15 minutes
function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Generate tokens and set cookie
async function generateTokensAndCookie(user, res) {
  const accessToken = generateAccessToken(user);
  const refreshToken = uuidv4();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000);

  await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 86400000,
  });

  return { accessToken, userId: user._id };
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await argon2.hash(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // FIRST: Try to send verification email BEFORE creating user
    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again later or contact support.',
        error: 'EMAIL_SEND_FAILED'
      });
    }

    // ONLY create user if email was sent successfully
    const user = await User.create({
      name,
      email,
      passwordHash,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    res.status(201).json({
      message: 'Account created! Please check your email to verify your account.',
      requiresVerification: true
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: 'Registration failed. Please try again.',
      error: err.message
    });
  }
};

// Add the verifyEmail function
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification token. Please sign up again.'
      });
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      verified: true
    });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

// Update loginUser to check verification
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await argon2.verify(user.passwordHash, password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // Check if email is verified (skip for Google users)
    if (!user.isGoogleUser && !user.isEmailVerified) {
      return res.status(400).json({
        message: 'Please verify your email before logging in. Check your inbox.',
        requiresVerification: true
      });
    }

    const tokens = await generateTokensAndCookie(user, res);
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update googleAuth to auto-verify
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true; // Auto-verify Google users
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        imageUrl: picture,
        passwordHash: null,
        isGoogleUser: true,
        isEmailVerified: true  // Google users are auto-verified
      });
    }

    const tokens = await generateTokensAndCookie(user, res);
    res.json(tokens);
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
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
    res.json({ accessToken, userId: user._id });
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is Google user
    if (user.isGoogleUser && !user.passwordHash) {
      return res.status(400).json({ message: 'Google users cannot change password. Please use Google account settings.' });
    }

    if (!(await argon2.verify(user.passwordHash, currentPassword))) {
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