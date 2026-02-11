const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const users = await User.find({}, 'name email role');
    
    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('Please register a user first through the app.\n');
    } else {
      console.log('📋 Existing users:');
      console.log('─────────────────────────────────────────');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('─────────────────────────────────────────');
      });
      console.log('\nTo make a user admin, run:');
      console.log('node scripts/makeAdmin.js <email>\n');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log('\n✅ User updated to admin successfully!');
      console.log('─────────────────────────────────────────');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('─────────────────────────────────────────\n');
      console.log('You can now login with this account to access the admin dashboard!\n');
    } else {
      console.log(`\n❌ User not found with email: ${email}`);
      console.log('Run "node scripts/makeAdmin.js" to see all users.\n');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
  }
};

// Check if email argument provided
const userEmail = process.argv[2];

if (!userEmail) {
  listUsers();
} else {
  makeAdmin(userEmail);
}
