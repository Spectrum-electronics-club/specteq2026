const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOtpEmail, sendRegistrationEmail } = require('../utils/mailer');

const router = express.Router();

// ─── Helper: generate 6-digit OTP ────────────────────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
// Called when user enters email on register form — sends OTP, creates pending user
router.post('/send-otp', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if a *verified* user already exists with this email
    const existingVerified = await User.findOne({ email, isVerified: true });
    if (existingVerified) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash OTP before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Upsert: if an unverified record exists (re-send), update it; otherwise create new
    let user = await User.findOne({ email, isVerified: false });
    if (user) {
      user.fullName = fullName;
      user.password = password; // will be hashed by pre-save hook
      user.otp = hashedOtp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = new User({ fullName, email, password, otp: hashedOtp, otpExpiry, isVerified: false });
      await user.save();
    }

    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to your email. It expires in 10 minutes.' });
  } catch (err) {
    console.error('send-otp error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
// Verifies OTP, marks user as verified, sends welcome email, returns JWT
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).json({ message: 'No pending registration found for this email.' });
    }

    // Check expiry
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Mark verified, clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Send welcome email (non-blocking)
    sendRegistrationEmail(user.email, user.fullName).catch((e) =>
      console.error('Failed to send welcome email:', e.message)
    );

    // Issue JWT
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified successfully!',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('verify-otp error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── POST /api/auth/resend-otp ────────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).json({ message: 'No pending registration found for this email.' });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);
    user.otpExpiry = otpExpiry;
    // Avoid re-hashing password on resend
    user.$locals = user.$locals || {};
    user.$locals.skipPasswordHash = true;
    await user.save();

    await sendOtpEmail(email, otp);
    res.json({ message: 'A new OTP has been sent to your email.' });
  } catch (err) {
    console.error('resend-otp error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, loginRole } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified. Please complete OTP verification first.',
        needsVerification: true,
      });
    }

    // Validate requested role
    if (loginRole && user.role !== loginRole && user.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── POST /api/auth/register (legacy — kept for admin scripts) ────────────────
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ fullName, email, password, isVerified: true });
    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ─── GET /api/auth/users (dev only) ──────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
