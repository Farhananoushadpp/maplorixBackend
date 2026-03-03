import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkPathu11Resume = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the most recent application (pathu11)
    const application = await Application.findOne({ 
      fullName: 'pathu11',
      email: 'john.doe@company.com',
      jobRole: 'graphic designer'
    }).sort({ createdAt: -1 });
    
    if (application) {
      console.log('📋 Latest application (pathu11):');
      console.log('Job Role:', application.jobRole);
      console.log('Created:', application.createdAt);
      console.log('Resume Data:', JSON.stringify(application.resume, null, 2));
      
      if (application.resume && application.resume.filename) {
        console.log('✅ Resume was saved successfully!');
        console.log('🎉 REAL-TIME RESUME UPLOAD IS WORKING!');
        console.log('📋 Resume Info:');
        console.log('- Filename:', application.resume.filename);
        console.log('- Original Name:', application.resume.originalName);
        console.log('- Size:', application.resume.size);
        console.log('- MIME Type:', application.resume.mimetype);
        console.log('- Path:', application.resume.path);
        
        console.log('🎯 SOLUTION: The resume is now in the database!');
        console.log('📱 The dashboard should show the resume after the refresh!');
        
      } else {
        console.log('❌ Resume was NOT saved to database');
        console.log('Resume field is:', application.resume);
        console.log('🔧 This means the backend is not processing the resume file properly');
      }
      
    } else {
      console.log('❌ Latest application not found');
    }

  } catch (error) {
    console.error('❌ Error checking application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkPathu11Resume();
