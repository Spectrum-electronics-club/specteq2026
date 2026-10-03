const mongoose = require('mongoose');
require('dotenv').config();

const Team = require('./models/Team');
const Submission = require('./models/Submission');

async function createSubmissions() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/specteq');

  const teams = await Team.find();
  console.log(`Found ${teams.length} teams.`);

  let submissionCount = 0;
  
  for (const team of teams) {
    // Create 1 or 2 submissions per team
    const numSubmissions = Math.floor(Math.random() * 2) + 1; // 1 or 2
    
    for (let i = 1; i <= numSubmissions; i++) {
      const taskName = i === 1 ? 'Task 1: Concept & Simulation' : 'Task 2: Hardware Prototype';
      
      const newSubmission = new Submission({
        teamId: team._id,
        taskName: taskName,
        fileUrl: `/uploads/test_submission_${team._id}_${i}.pdf`, // Dummy file URL
        status: 'pending'
      });
      
      await newSubmission.save();
      submissionCount++;
    }
  }

  console.log(`Successfully created ${submissionCount} submissions.`);
  mongoose.disconnect();
}

createSubmissions().catch(err => {
  console.error("Error creating submissions:", err);
  mongoose.disconnect();
});
