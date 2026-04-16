import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createNewTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'farhana.test@maplorix.com' });
    
    // Create new test user with guaranteed working password
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const newUser = new User({
      firstName: 'Farhana',
      lastName: 'Test',
      email: 'farhana.test@maplorix.com',
      password: hashedPassword,
      role: 'user',
      department: 'General',
      phone: '+1234567890',
      isActive: true,
    });
    
    await newUser.save();
    
    console.log('New test user created successfully:');
    console.log('Email: farhana.test@maplorix.com');
    console.log('Password: password123');
    console.log('Name: Farhana Test');
    console.log('Role: user');
    console.log('Status: Active');
    
    // Test the password immediately
    const testUser = await User.findOne({ email: 'farhana.test@maplorix.com' }).select('+password');
    const isValid = await testUser.comparePassword('password123');
    console.log('Password verification test:', isValid ? 'PASSED' : 'FAILED');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

createNewTestUser();
