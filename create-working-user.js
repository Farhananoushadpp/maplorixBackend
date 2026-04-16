import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createWorkingUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'working.user@maplorix.com' });
    
    // Create new user WITHOUT pre-hashing (let the model handle it)
    const newUser = new User({
      firstName: 'Working',
      lastName: 'User',
      email: 'working.user@maplorix.com',
      password: 'password123', // Plain text - model will hash it
      role: 'user',
      department: 'General',
      phone: '+1234567890',
      isActive: true,
    });
    
    await newUser.save();
    
    console.log('Working user created successfully:');
    console.log('Email: working.user@maplorix.com');
    console.log('Password: password123');
    console.log('Name: Working User');
    console.log('Role: user');
    console.log('Status: Active');
    
    // Test the password immediately
    const testUser = await User.findOne({ email: 'working.user@maplorix.com' }).select('+password');
    const isValid = await testUser.comparePassword('password123');
    console.log('Password verification test:', isValid ? 'PASSED \u2702' : 'FAILED \u274c');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

createWorkingUser();
