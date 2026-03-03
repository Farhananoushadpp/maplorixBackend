import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixLatestPathuApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the latest pathu application (created on 2026-02-23 8:21pm)
    const application = await Application.findOne({ 
      fullName: 'pathu',
      email: 'john.doe@company.com',
      phone: '+971506507165' // Use phone to identify the specific application
    });
    
    if (application) {
      console.log('📋 Found latest pathu application:');
      console.log('Current Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('Current Cover Letter:', JSON.stringify(application.coverLetter, null, 2));
      console.log('Created:', application.createdAt);
      
      // Update the salary with proper min/max structure (user entered AED 4500)
      application.expectedSalary = {
        min: 4500,
        max: 4500,
        currency: 'AED'
      };
      
      await application.save();
      
      console.log('✅ Latest pathu application updated successfully!');
      console.log('New Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      
    } else {
      console.log('❌ Latest pathu application not found');
    }

  } catch (error) {
    console.error('❌ Error updating application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

fixLatestPathuApplication();
