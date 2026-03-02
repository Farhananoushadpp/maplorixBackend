import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixPathuApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific application by name
    const application = await Application.findOne({ fullName: 'pathu' });
    
    if (application) {
      console.log('📋 Found Application (pathu):');
      console.log('Current Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('Cover Letter:', application.coverLetter);
      
      // Update the salary with proper min/max structure
      application.expectedSalary = {
        min: 40000,
        max: 60000,
        currency: 'USD'
      };
      
      await application.save();
      
      console.log('✅ Application salary updated successfully!');
      console.log('New Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      
    } else {
      console.log('❌ Application not found with name: pathu');
    }

  } catch (error) {
    console.error('❌ Error updating application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

fixPathuApplication();
