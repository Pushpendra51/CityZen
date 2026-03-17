const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'this.pushpendra@gmail.com'.toLowerCase().trim();
  const newPassword = 'Pushpendra4545';
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
  
  console.log(`Password reset for ${user.email} to: ${newPassword}`);
  process.exit(0);
}
run();
