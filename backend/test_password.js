const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'this.pushpendra@gmail.com'.toLowerCase().trim();
  const passwordToTest = '12345678';
  
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(passwordToTest, user.password);
  
  console.log(`Password match for ${passwordToTest}: ${isMatch}`);
  process.exit(0);
}
run();
