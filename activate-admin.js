import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const activateAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find and activate the admin user
    const adminEmail = 'maplorixae@gmail.com';
    const adminPassword = 'maplorixDXB';

    const adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    // Activate the admin user
    adminUser.isActive = true;
    adminUser.password = adminPassword; // Let the model hash it properly
    await adminUser.save();

    console.log('✅ Admin user activated successfully!');
    console.log('📋 Login Details:');
    console.log('  Email:', adminUser.email);
    console.log('  Password:', adminPassword);
    console.log('  Role:', adminUser.role);
    console.log('  Active:', adminUser.isActive);
    console.log('  Department:', adminUser.department);

    // Test login
    const isPasswordValid = await adminUser.comparePassword(adminPassword);
    console.log('🔐 Password Test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

    console.log('\n🌐 Admin is now ready for login!');
    console.log('🔑 Use these credentials to access the admin dashboard.');

  } catch (error) {
    console.error('❌ Error activating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the activation
activateAdminUser();
