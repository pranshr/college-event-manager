// server/scripts/addUser.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
async function run() {
  // Mongoose v6+ does not require useNewUrlParser / useUnifiedTopology options
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college-event-manager';
  await mongoose.connect(uri);

  const user = new User({
    name: 'Alice Student',
    email: 'alice.student@example.com',
    password: 'password123',   // will be hashed automatically by the model pre-save hook
    role: 'student',
    isVerified: true
  });

  await user.save();
  console.log('Created user:', { id: user._id, email: user.email, name: user.name });
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});