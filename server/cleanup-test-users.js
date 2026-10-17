require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Team = require('./models/Team');

async function cleanupTestUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas...');

  // Delete users with test email patterns
  const result = await User.deleteMany({
    $or: [
      { email: /@example\.com$/ },
      { email: /@test\.com$/ },
      { fullName: /^Test Student/ },
      { fullName: /^LoadTest User/ },
    ]
  });

  console.log(`✅ Deleted ${result.deletedCount} test users.`);

  // Also delete the test team
  const teamResult = await Team.deleteMany({
    name: 'jnsdkjvckjv'
  });
  console.log(`✅ Deleted ${teamResult.deletedCount} test teams.`);

  // Show remaining users
  const remaining = await User.find({}, 'fullName email role');
  console.log(`\n📋 Remaining users (${remaining.length}):`);
  remaining.forEach(u => console.log(`  - ${u.fullName} | ${u.email} | ${u.role}`));

  mongoose.disconnect();
}

cleanupTestUsers().catch(console.error);
