import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    const user = await User.findOne({ email: 'farhananoushad1212@gmail.com' }).select('+password');
    
    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Name:', user.firstName, user.lastName);
      console.log('Role:', user.role);
      console.log('Active:', user.isActive);
      console.log('Has password:', !!user.password);
      console.log('Password hash length:', user.password ? user.password.length : 0);
      
      // Check if password is the default hash or properly hashed
      if (user.password && user.password.length < 30) {
        console.log('Password appears to be plain text or weakly hashed');
      } else if (user.password && user.password.startsWith('$2')) {
        console.log('Password is properly bcrypt hashed');
      }
    } else {
      console.log('User not found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkUserPassword();
