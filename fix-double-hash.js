import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixDoubleHash = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    const user = await User.findOne({ email: 'farhananoushad1212@gmail.com' }).select('+password');
    
    if (user) {
      console.log('Fixing double hash for:', user.email);
      console.log('Current password hash length:', user.password.length);
      
      // Set the password to plain text - the pre-save middleware will hash it correctly
      user.password = 'password123';
      
      // Mark the password as modified so pre-save middleware runs
      user.markModified('password');
      
      await user.save();
      
      console.log('Password reset successfully');
      
      // Test the new password
      const testUser = await User.findOne({ email: 'farhananoushad1212@gmail.com' }).select('+password');
      const isValid = await testUser.comparePassword('password123');
      console.log('Password verification test:', isValid ? 'PASSED \u2702' : 'FAILED \u274c');
      
      if (isValid) {
        console.log('\nUser can now login with:');
        console.log('Email: farhananoushad1212@gmail.com');
        console.log('Password: password123');
      }
    } else {
      console.log('User not found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fixDoubleHash();
