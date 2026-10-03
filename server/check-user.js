const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
  await mongoose.connect('mongodb://127.0.0.1:27017/specteq');
  const user = await User.findOne({ email: 'admin@ngnd.com' });
  console.log(user);
  mongoose.disconnect();
}
checkUser();
