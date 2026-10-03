const mongoose = require('mongoose');
const User = require('./models/User');
const Submission = require('./models/Submission');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/specteq');
  console.log('Connected');

  const admin = await User.findOne({ role: 'admin' });
  const sub = await Submission.findOne();

  console.log('Before:', sub.evaluations);

  const memberId = admin._id.toString();
  const marks = 85;

  const existingEvalIndex = sub.evaluations.findIndex(
    ev => ev.memberId.toString() === memberId
  );

  if (existingEvalIndex >= 0) {
    sub.evaluations[existingEvalIndex].marks = marks;
  } else {
    sub.evaluations.push({ memberId, marks });
  }

  await sub.save();

  const verify = await Submission.findById(sub._id);
  console.log('After:', verify.evaluations);

  process.exit(0);
}

test();
