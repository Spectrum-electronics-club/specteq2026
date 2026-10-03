const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Announcement = require('../models/Announcement');

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all active announcements (Public)
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const activeAnnouncements = await Announcement.find({
      deadline: { $gte: currentDate }
    }).sort({ createdAt: -1 });
    res.json(activeAnnouncements);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Get ALL announcements including expired (Admin only)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Create new announcement (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { text, deadline } = req.body;
    if (!text || !deadline) {
      return res.status(400).json({ message: 'Text and deadline are required' });
    }
    const newAnnouncement = new Announcement({ text, deadline });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Delete an announcement (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

module.exports = router;
