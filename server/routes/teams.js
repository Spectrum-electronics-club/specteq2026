const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const User = require('../models/User');

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

// Create a team
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { teamName, college, theme } = req.body;
    
    // Check if user is already in a team
    const user = await User.findById(req.user.id);
    if (user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    // Check if team name exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already taken' });
    }

    // Create unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newTeam = new Team({
      teamName,
      college,
      theme: theme || 'Uncategorized',
      leader: req.user.id,
      members: [req.user.id],
      inviteCode
    });

    const savedTeam = await newTeam.save();

    // Update user with teamId
    user.teamId = savedTeam._id;
    await user.save();

    res.json(savedTeam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Join a team
router.post('/join', verifyToken, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const user = await User.findById(req.user.id);
    if (user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    const team = await Team.findOne({ inviteCode });
    if (!team) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (team.members.length >= 4) {
      return res.status(400).json({ message: 'Team is already full (max 4 members)' });
    }

    team.members.push(req.user.id);
    await team.save();

    user.teamId = team._id;
    await user.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Get user's team
router.get('/my-team', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.teamId) {
      return res.status(404).json({ message: 'No team found for user' });
    }

    const team = await Team.findById(user.teamId).populate('members', 'fullName email').populate('leader', 'fullName email');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

module.exports = router;
