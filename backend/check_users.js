const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log(JSON.stringify(users.map(u => ({ email: u.email, hasPassword: !!u.password, name: u.name })), null, 2));
  process.exit(0);
}
run();
