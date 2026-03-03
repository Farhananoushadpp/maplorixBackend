import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkFarhanaResume = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the most recent application (farhana)
    const application = await Application.findOne({ 
      fullName: 'farhana',
      email: 'tarahadvertising@gmail.com',
      jobRole: 'frontend developer'
    }).sort({ createdAt: -1 });
    
    if (application) {
      console.log('📋 Latest application (farhana):');
      console.log('Job Role:', application.jobRole);
      console.log('Created:', application.createdAt);
      console.log('Resume Data:', JSON.stringify(application.resume, null, 2));
      
      if (application.resume && application.resume.filename) {
        console.log('✅ Resume was saved successfully!');
        console.log('File Info:');
        console.log('- Filename:', application.resume.filename);
        console.log('- Original Name:', application.resume.originalName);
        console.log('- Size:', application.resume.size);
        console.log('- MIME Type:', application.resume.mimetype);
        console.log('- Path:', application.resume.path);
      } else {
        console.log('❌ Resume was NOT saved to database');
        console.log('Resume field is:', application.resume);
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

checkFarhanaResume();
