import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkRecentPathuApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the most recent pathu application
    const application = await Application.findOne({ 
      fullName: 'pathu',
      email: 'tarahadvertising@gmail.com'
    }).sort({ createdAt: -1 }); // Get the most recent one
    
    if (application) {
      console.log('📋 Most recent pathu application:');
      console.log('Job Role:', application.jobRole);
      console.log('Created:', application.createdAt);
      console.log('Resume Data:', JSON.stringify(application.resume, null, 2));
      
      if (application.resume && application.resume.filename) {
        console.log('✅ Resume exists in database');
        console.log('File Info:');
        console.log('- Filename:', application.resume.filename);
        console.log('- Original Name:', application.resume.originalName);
        console.log('- Size:', application.resume.size);
        console.log('- MIME Type:', application.resume.mimetype);
        console.log('- Path:', application.resume.path);
      } else {
        console.log('❌ No resume found in database');
        console.log('Resume field is:', application.resume);
      }
      
    } else {
      console.log('❌ No pathu application found');
    }

  } catch (error) {
    console.error('❌ Error checking application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkRecentPathuApplication();
