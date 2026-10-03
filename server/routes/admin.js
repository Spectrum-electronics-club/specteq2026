const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');
const Submission = require('../models/Submission');

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all teams
router.get('/teams', verifyAdmin, async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('leader', 'fullName email')
      .populate('members', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Get all submissions
router.get('/submissions', verifyAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('teamId', 'teamName college theme')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    // Count students OR anyone who is in a team (like an admin testing the flow)
    const userCount = await User.countDocuments({ 
      $or: [
        { role: 'student' },
        { teamId: { $ne: null } }
      ]
    });
    const teamCount = await Team.countDocuments();
    const submissionCount = await Submission.countDocuments();
    
    res.json({
      students: userCount,
      teams: teamCount,
      submissions: submissionCount
    });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Delete a team
router.delete('/teams/:id', verifyAdmin, async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // Remove teamId from all users in this team
    await User.updateMany({ teamId: req.params.id }, { $set: { teamId: null } });
    // Also delete their submissions
    await Submission.deleteMany({ teamId: req.params.id });

    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Delete a submission
router.delete('/submissions/:id', verifyAdmin, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

module.exports = router;
