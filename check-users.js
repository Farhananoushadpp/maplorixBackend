import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('Connected to MongoDB');
    
    // Check existing users
    const users = await User.find({});
    console.log('Existing users:', users.length);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Active: ${user.isActive}`);
    });
    
    // Create test user if none exist
    if (users.length === 0) {
      console.log('Creating test user...');
      const testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
        department: 'IT'
      });
      
      await testUser.save();
      console.log('Test user created: test@example.com / password123');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

checkUsers();
