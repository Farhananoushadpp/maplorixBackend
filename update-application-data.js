import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const updateApplicationData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific application by name
    const application = await Application.findOne({ fullName: 'farhanatyyu' });
    
    if (application) {
      console.log('📋 Found Application:');
      console.log('Current Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('Current Cover Letter:', JSON.stringify(application.coverLetter, null, 2));
      
      // Update the application with proper data
      application.expectedSalary = {
        currency: 'USD',
        amount: 75000
      };
      
      application.coverLetter = 'I am a passionate frontend developer with strong skills in React, JavaScript, and modern web technologies. I am excited about this opportunity and believe my experience aligns well with your requirements.';
      
      await application.save();
      
      console.log('✅ Application updated successfully!');
      console.log('New Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('New Cover Letter:', application.coverLetter);
      
    } else {
      console.log('❌ Application not found with name: farhanatyyu');
    }

  } catch (error) {
    console.error('❌ Error updating application data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

updateApplicationData();
