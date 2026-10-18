require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// ============================================================
//  ADD YOUR EVALUATORS HERE
//  Format: { name, email, password }
// ============================================================
const EVALUATORS = [
  { fullName: 'Renish', email: 'doshirenish@gmail.com', password: 'Ilovemyself' },
  { fullName: 'Evaluator 2', email: 'evaluator2@specteq.com', password: 'Eval@1234' },
  { fullName: 'Evaluator 3', email: 'evaluator3@specteq.com', password: 'Eval@1234' },
  // Add more evaluators below:
  // { fullName: 'Prof. John Doe', email: 'johndoe@ddu.ac.in', password: 'SecurePass123' },
];

async function createEvaluators() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...\n');

  for (const evaluator of EVALUATORS) {
    const existing = await User.findOne({ email: evaluator.email });

    if (existing) {
      console.log(`⚠️  Already exists: ${evaluator.email}`);
      continue;
    }

    const user = new User({
      fullName: evaluator.fullName,
      email: evaluator.email,
      password: evaluator.password,
      role: 'professional',
    });

    await user.save();
    console.log(`✅ Created: ${evaluator.fullName} | ${evaluator.email} | Password: ${evaluator.password}`);
  }

  console.log('\n📋 All evaluator accounts:');
  const all = await User.find({ role: 'professional' }, 'fullName email');
  all.forEach(e => console.log(`  - ${e.fullName} | ${e.email}`));

  mongoose.disconnect();
  console.log('\nDone!');
}

createEvaluators().catch(console.error);
