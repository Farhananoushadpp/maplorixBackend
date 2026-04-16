import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    const users = await User.find({}).select('email role firstName lastName isActive');
    
    console.log('Available users:');
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach(user => {
        console.log(`- Email: ${user.email}, Name: ${user.firstName} ${user.lastName}, Role: ${user.role}, Active: ${user.isActive}`);
      });
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkUsers();
