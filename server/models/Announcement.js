const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
