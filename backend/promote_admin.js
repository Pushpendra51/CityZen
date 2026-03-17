const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function promoteToAdmin() {
  const email = 'this.pushpendra@gmail.com';
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`Successfully promoted ${email} to Admin.`);
    } else {
      console.log(`User ${email} not found in database.`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

promoteToAdmin();
