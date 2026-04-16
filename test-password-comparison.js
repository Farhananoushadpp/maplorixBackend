import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testPasswordComparison = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    const user = await User.findOne({ email: 'farhananoushad1212@gmail.com' }).select('+password');
    
    if (user) {
      console.log('Testing password comparison for:', user.email);
      
      // Test the password comparison
      const isValid = await user.comparePassword('password123');
      console.log('Password "password123" valid:', isValid);
      
      // Test with different passwords
      const testPasswords = ['password123', '123456', 'password', 'farhana', 'test'];
      
      for (const testPwd of testPasswords) {
        const valid = await user.comparePassword(testPwd);
        if (valid) {
          console.log(`\u2702 Found working password: "${testPwd}"`);
        }
      }
      
      if (!isValid) {
        console.log('None of the test passwords worked. The password might be something else.');
        console.log('You may need to reset this user or use a different account.');
      }
    } else {
      console.log('User not found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testPasswordComparison();
