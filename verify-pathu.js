import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyPathuApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific application by name
    const application = await Application.findOne({ fullName: 'pathu' });
    
    if (application) {
      console.log('📋 Current Application Data (pathu):');
      console.log('Full Name:', application.fullName);
      console.log('Email:', application.email);
      console.log('Phone:', application.phone);
      console.log('Job Role:', application.jobRole);
      console.log('Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('Cover Letter:', JSON.stringify(application.coverLetter, null, 2));
      console.log('Experience:', application.experience);
      console.log('Created:', application.createdAt);
    } else {
      console.log('❌ Application not found with name: pathu');
    }

  } catch (error) {
    console.error('❌ Error verifying application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

verifyPathuApplication();
