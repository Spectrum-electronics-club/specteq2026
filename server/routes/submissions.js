const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Submission = require('../models/Submission');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Append timestamp
  }
});
const upload = multer({ storage: storage });

// Upload a submission
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { taskName } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.teamId) {
      return res.status(400).json({ message: 'You must be in a team to submit a task' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const newSubmission = new Submission({
      teamId: user.teamId,
      taskName: taskName || 'Task 1: Concept & Simulation',
      fileUrl: '/uploads/' + req.file.filename
    });

    const savedSubmission = await newSubmission.save();
    res.json(savedSubmission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Get team's submissions
router.get('/my-submissions', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.teamId) {
      return res.json([]);
    }

    const submissions = await Submission.find({ teamId: user.teamId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

module.exports = router;
