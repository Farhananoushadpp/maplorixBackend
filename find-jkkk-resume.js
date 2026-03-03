import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const findJkkkResume = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the jkkk application
    const application = await Application.findOne({ 
      fullName: 'jkkk',
      email: 'tarahadvertising@gmail.com',
      jobRole: 'graphic designer'
    }).sort({ createdAt: -1 });
    
    if (application) {
      console.log('📋 Found jkkk application:');
      console.log('Job Role:', application.jobRole);
      console.log('Created:', application.createdAt);
      console.log('Application ID:', application._id);
      console.log('Resume Data:', JSON.stringify(application.resume, null, 2));
      
      if (application.resume && application.resume.filename) {
        console.log('✅ Your uploaded file is stored at:');
        console.log('📁 Full Path:', application.resume.path);
        console.log('📄 File Name:', application.resume.filename);
        console.log('📄 Original Name:', application.resume.originalName);
        console.log('📊 File Size:', application.resume.size, 'bytes');
        console.log('📋 MIME Type:', application.resume.mimetype);
        
        console.log('🎯 SUCCESS! Your file is properly stored!');
        console.log('📱 You can access it through the dashboard or directly at the path above');
        
      } else {
        console.log('❌ Resume not found in database');
      }
      
    } else {
      console.log('❌ jkkk application not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

findJkkkResume();
