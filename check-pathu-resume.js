import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkPathuResume = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific pathu application
    const application = await Application.findOne({ 
      fullName: 'pathu',
      email: 'ajmalkm@gmail.com',
      phone: '+971581929900'
    });
    
    if (application) {
      console.log('📋 Found pathu application:');
      console.log('Full Name:', application.fullName);
      console.log('Email:', application.email);
      console.log('Phone:', application.phone);
      console.log('Job Role:', application.jobRole);
      console.log('Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      console.log('Cover Letter:', application.coverLetter);
      console.log('Resume Data:', JSON.stringify(application.resume, null, 2));
      console.log('Created:', application.createdAt);
      
      if (application.resume && application.resume.filename) {
        console.log('✅ Resume exists in database');
        console.log('Filename:', application.resume.filename);
        console.log('Original Name:', application.resume.originalName);
        console.log('File Path:', application.resume.path);
        console.log('File Size:', application.resume.size);
        console.log('MIME Type:', application.resume.mimetype);
      } else {
        console.log('❌ No resume found in database for this application');
      }
      
    } else {
      console.log('❌ pathu application not found');
    }

  } catch (error) {
    console.error('❌ Error checking application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkPathuResume();
