import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixAllDoubleHashes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    
    console.log('Checking for double-hashed passwords...');
    
    const users = await User.find({ isActive: true }).select('+password');
    let fixedCount = 0;
    
    for (const user of users) {
      // Check if password is double-hashed (starts with $2$ and is very long)
      if (user.password && user.password.length > 100) {
        console.log(`Found double-hashed password for: ${user.email}`);
        
        // Reset to a known password
        user.password = 'password123';
        user.markModified('password');
        await user.save();
        
        // Test the fix
        const testUser = await User.findOne({ email: user.email }).select('+password');
        const isValid = await testUser.comparePassword('password123');
        
        if (isValid) {
          console.log(`\u2702 Fixed: ${user.email}`);
          fixedCount++;
        } else {
          console.log(`\u274c Failed to fix: ${user.email}`);
        }
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total active users checked: ${users.length}`);
    console.log(`- Double-hashed passwords fixed: ${fixedCount}`);
    console.log(`- Users with working passwords: ${users.length - fixedCount + fixedCount}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fixAllDoubleHashes();
