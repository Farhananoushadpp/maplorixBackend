import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const removeLoggedInUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear all user sessions by setting lastLogin to null
    const result = await User.updateMany(
      {},
      {
        $unset: { lastLogin: 1 },
        $set: { isActive: false }
      }
    );

    console.log(`🔓 Cleared sessions for ${result.modifiedCount} users`);

    // Get list of all users
    const allUsers = await User.find({}, 'email role isActive lastLogin');
    console.log('\n📋 All Users Status:');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Active: ${user.isActive}, Last Login: ${user.lastLogin || 'Never'}`);
    });

    console.log('\n✅ All user sessions have been cleared!');
    console.log('🔒 Users will need to login again to access the system.');

  } catch (error) {
    console.error('❌ Error removing logged-in users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
removeLoggedInUsers();
