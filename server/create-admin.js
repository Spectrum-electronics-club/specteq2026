const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/specteq');
  
  let admin = await User.findOne({ email: 'admin@specteq.com' });
  if (!admin) {
    admin = new User({
      fullName: 'System Admin',
      email: 'admin@specteq.com',
      password: 'adminpassword',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created.');
  } else {
    console.log('Admin already exists.');
  }

  const studentCount = await User.countDocuments({ role: 'student' });
  console.log(`Verified Student Count in DB: ${studentCount}`);

  mongoose.disconnect();
}

createAdmin();
