const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public route to get a setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    res.json(setting ? setting.value : null);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route to update a setting
router.post('/:key', auth, isAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    let setting = await Settings.findOne({ key: req.params.key });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = new Settings({ key: req.params.key, value });
      await setting.save();
    }
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
