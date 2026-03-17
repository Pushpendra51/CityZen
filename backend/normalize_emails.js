const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  let count = 0;
  for (let u of users) {
    if (u.email !== u.email.toLowerCase().trim()) {
      u.email = u.email.toLowerCase().trim();
      await u.save();
      count++;
    }
  }
  console.log(`Updated ${count} users emails to lowercase`);
  process.exit(0);
}
run();
