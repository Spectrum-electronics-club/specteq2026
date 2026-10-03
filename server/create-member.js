const mongoose = require('mongoose');
const User = require('./models/User');

async function createMember() {
  await mongoose.connect('mongodb://127.0.0.1:27017/specteq');
  
  const email = 'member@specteq.com';
  let member = await User.findOne({ email });
  
  if (!member) {
    member = new User({
      fullName: 'Evaluator Member',
      email: email,
      password: 'memberpassword', // Will be hashed via schema hook
      role: 'professional' // Using professional as the member role
    });
    await member.save();
    console.log(`Member account created: ${email} / memberpassword`);
  } else {
    // Ensure role is professional
    member.role = 'professional';
    await member.save();
    console.log(`Member account already exists, ensured role: ${email}`);
  }

  mongoose.disconnect();
}

createMember().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
