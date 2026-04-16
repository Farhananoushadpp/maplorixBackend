import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkActiveUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    const activeUsers = await User.find({ isActive: true }).select('email role firstName lastName');
    const adminUsers = await User.find({ role: 'admin', isActive: true }).select('email role firstName lastName');
    
    console.log('=== ACTIVE USERS WHO CAN LOGIN ===');
    if (activeUsers.length === 0) {
      console.log('No active users found');
    } else {
      activeUsers.forEach(user => {
        console.log(`\u2702 Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: Active \u2713`);
        console.log('');
      });
    }
    
    console.log('=== ADMIN USERS ===');
    if (adminUsers.length === 0) {
      console.log('No active admin users found');
    } else {
      adminUsers.forEach(user => {
        console.log(`\ud83d\udd34 Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: Active \u2713`);
        console.log('');
      });
    }
    
    console.log('=== LOGIN CREDENTIALS ===');
    console.log('Default password for most users: "password123"');
    console.log('Admin password: "maplorixDXB" (for maplorixae@gmail.com)');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkActiveUsers();
