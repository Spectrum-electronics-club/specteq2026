const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Team = require('./models/Team');

async function createTeams() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/specteq');

  const students = await User.find({ role: 'student', teamId: null });
  console.log(`Found ${students.length} students without a team.`);

  let teamCount = 0;
  
  // Group by 4
  for (let i = 0; i < students.length; i += 4) {
    const group = students.slice(i, i + 4);
    if (group.length === 0) continue;

    const leader = group[0];
    
    const teamName = `Team Alpha ${i / 4 + 1}`;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newTeam = new Team({
      teamName,
      college: 'Tech University',
      theme: 'Space Exploration',
      leader: leader._id,
      members: [leader._id],
      inviteCode
    });

    // Add other members if any
    for (let j = 1; j < group.length; j++) {
      newTeam.members.push(group[j]._id);
    }

    const savedTeam = await newTeam.save();

    // Update user models
    for (let j = 0; j < group.length; j++) {
      group[j].teamId = savedTeam._id;
      await group[j].save();
    }
    
    teamCount++;
  }

  console.log(`Successfully created ${teamCount} teams.`);
  mongoose.disconnect();
}

createTeams().catch(err => {
  console.error("Error creating teams:", err);
  mongoose.disconnect();
});
