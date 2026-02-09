import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('Connected to MongoDB');
    
    // Delete existing test users
    await User.deleteMany({ email: { $in: ['test@maplorix.com', 'admin@maplorix.com'] } });
    console.log('Cleaned up existing test users');
    
    // Create new test users
    const testUsers = [
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@maplorix.com',
        password: 'password123',
        role: 'recruiter',
        department: 'HR'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@maplorix.com',
        password: 'admin123',
        role: 'admin',
        department: 'IT'
      }
    ];
    
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.email} / ${userData.password}`);
      
      // Test the password immediately
      const testUser = await User.findOne({ email: userData.email }).select('+password');
      const isValid = await testUser.comparePassword(userData.password);
      console.log(`   Password verification: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
    }
    
    console.log('\n=== Test Login Credentials ===');
    console.log('1. Email: test@maplorix.com');
    console.log('   Password: password123');
    console.log('2. Email: admin@maplorix.com');
    console.log('   Password: admin123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

createTestUser();
