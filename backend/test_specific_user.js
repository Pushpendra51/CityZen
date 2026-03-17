const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'this.pushpendra@gmail.com'.toLowerCase().trim();
  const user = await User.findOne({ email });
  
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  
  console.log(`User found: ${user.email}`);
  console.log(`Has password: ${!!user.password}`);
  console.log(`Google ID: ${user.googleId || 'None'}`);
  
  if (!user.password) {
    console.log('REASON FOR FAILURE: User has no password set (likely created via Google Login).');
  }
  
  process.exit(0);
}
run();
