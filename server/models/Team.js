const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true
  },
  college: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true,
    default: 'Uncategorized'
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inviteCode: {
    type: String,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
