const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  evaluations: [{
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    marks: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
