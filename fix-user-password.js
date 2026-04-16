import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    const user = await User.findOne({ email: 'farhananoushad1212@gmail.com' });
    
    if (user) {
      // Hash the new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
      
      console.log('Password updated successfully for:');
      console.log('Email:', user.email);
      console.log('Name:', user.firstName, user.lastName);
      console.log('New password: password123');
      console.log('Status: Active');
    } else {
      console.log('User not found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fixUserPassword();
