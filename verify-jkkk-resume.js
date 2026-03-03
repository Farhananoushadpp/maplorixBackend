import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyJkkkResumeInDB = async () => {
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
      console.log('📋 Verifying jkkk application in database:');
      console.log('Job Role:', application.jobRole);
      console.log('Created:', application.createdAt);
      console.log('Application ID:', application._id);
      console.log('Resume Data:', JSON.stringify(application.resume, null, 2));
      
      if (application.resume && application.resume.filename) {
        console.log('✅ Resume IS in the database!');
        console.log('📋 Resume Info:');
        console.log('- Filename:', application.resume.filename);
        console.log('- Original Name:', application.resume.originalName);
        console.log('- Size:', application.resume.size);
        console.log('- MIME Type:', application.resume.mimetype);
        console.log('- Path:', application.resume.path);
        
        // Check if file exists
        const fs = require('fs');
        if (fs.existsSync(application.resume.path)) {
          console.log('✅ Resume file exists on server!');
          console.log('🎯 SOLUTION: The resume is properly stored in database and file system!');
          console.log('📱 The issue is that the dashboard is not fetching the updated data.');
          console.log('🔧 STEPS TO FIX:');
          console.log('   1. Refresh the dashboard page (F5)');
          console.log('   2. Click the "Refresh Data" button in the resume section');
          console.log('   3. The dashboard should now show the resume');
          
        } else {
          console.log('❌ Resume file NOT found on server');
        }
        
      } else {
        console.log('❌ Resume NOT found in database');
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

verifyJkkkResumeInDB();
