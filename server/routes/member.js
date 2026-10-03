const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Submission = require('../models/Submission');

// Middleware to verify member/professional token
const verifyMember = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    
    // Check if user is professional (member)
    const user = await User.findById(req.user.id);
    if (user.role !== 'professional' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Evaluator Members only.' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Submit evaluation for a submission
router.post('/submissions/:id/evaluate', verifyMember, async (req, res) => {
  try {
    const { marks } = req.body;
    const submissionId = req.params.id;
    const memberId = req.user.id;

    if (marks === undefined || marks < 0 || marks > 100) {
      return res.status(400).json({ message: 'Invalid marks. Must be between 0 and 100.' });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Check if evaluator already evaluated
    const existingEvalIndex = submission.evaluations.findIndex(
      ev => ev.memberId.toString() === memberId
    );

    if (existingEvalIndex >= 0) {
      submission.evaluations[existingEvalIndex].marks = marks;
      submission.markModified('evaluations');
    } else {
      submission.evaluations.push({ memberId, marks });
    }

    await submission.save();
    res.json({ message: 'Evaluation saved successfully', submission });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Get all submissions grouped or just as a list for members to see
router.get('/submissions', verifyMember, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('teamId', 'teamName college theme')
      .sort({ taskName: 1, createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

module.exports = router;
