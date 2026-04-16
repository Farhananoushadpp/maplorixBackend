import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    // Create a test user with known password
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@maplorix.com',
      password: 'password123', // Will be hashed automatically
      role: 'user',
      department: 'General',
      phone: '+1234567890',
      isActive: true,
    });
    
    await testUser.save();
    
    console.log('Test user created successfully:');
    console.log('Email: testuser@maplorix.com');
    console.log('Password: password123');
    console.log('Role: user');
    console.log('Status: Active');
    
    await mongoose.connection.close();
  } catch (error) {
    if (error.code === 11000) {
      console.log('Test user already exists. You can use:');
      console.log('Email: testuser@maplorix.com');
      console.log('Password: password123');
    } else {
      console.error('Error:', error.message);
    }
    await mongoose.connection.close();
  }
};

createTestUser();
