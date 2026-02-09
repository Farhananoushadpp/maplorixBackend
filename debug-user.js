import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const debugUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('Connected to MongoDB');
    
    // Check all users
    const users = await User.find({});
    console.log('\n=== All Users ===');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Has password: ${!!user.password}`);
      if (user.password) {
        console.log(`  Password length: ${user.password.length}`);
        console.log(`  Password starts with $2b$: ${user.password.startsWith('$2b$')}`);
      }
      console.log('');
    });
    
    // Test password comparison for john.doe@company.com
    const testUser = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
    if (testUser) {
      console.log('=== Testing Password Comparison ===');
      console.log('User:', testUser.email);
      
      // Test with common passwords
      const testPasswords = ['password', '123456', 'password123', 'admin', 'john.doe@company.com'];
      
      for (const testPwd of testPasswords) {
        try {
          const isValid = await testUser.comparePassword(testPwd);
          console.log(`Password "${testPwd}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
        } catch (error) {
          console.log(`Password "${testPwd}": ❌ Error - ${error.message}`);
        }
      }
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

debugUser();
