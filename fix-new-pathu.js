import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixNewPathuApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the newer pathu application (created on 2026-02-23)
    const application = await Application.findOne({ 
      fullName: 'pathu',
      email: 'john.doe@company.com'
    });
    
    if (application) {
      console.log('📋 Found newer pathu application:');
      console.log('Current Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('Current Cover Letter:', JSON.stringify(application.coverLetter, null, 2));
      console.log('Created:', application.createdAt);
      
      // Update the salary with proper min/max structure
      application.expectedSalary = {
        min: 40000,
        max: 60000,
        currency: 'USD'
      };
      
      await application.save();
      
      console.log('✅ Newer pathu application updated successfully!');
      console.log('New Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      
    } else {
      console.log('❌ Newer pathu application not found');
    }

  } catch (error) {
    console.error('❌ Error updating application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

fixNewPathuApplication();
