import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAndFixResumeFile = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the application with the resume issue
    const application = await Application.findById('699be005752bb129dbb45c1c');
    
    if (application) {
      console.log('📋 Found application:');
      console.log('Name:', application.fullName);
      console.log('Job Role:', application.jobRole);
      console.log('Resume Path:', application.resume?.path);
      
      if (application.resume && application.resume.path) {
        // Check if file exists
        const filePath = application.resume.path;
        console.log('🔍 Checking file:', filePath);
        
        if (fs.existsSync(filePath)) {
          console.log('✅ Resume file exists on server');
        } else {
          console.log('❌ Resume file NOT found on server');
          console.log('📁 Expected path:', filePath);
          
          // Create a dummy resume file for testing
          const uploadsDir = path.dirname(filePath);
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('📁 Created uploads directory:', uploadsDir);
          }
          
          // Create a simple text file as a dummy resume
          const dummyContent = `Resume for ${application.fullName}\nJob Role: ${application.jobRole}\nEmail: ${application.email}\nPhone: ${application.phone}\n\nThis is a test resume file created for demonstration purposes.`;
          fs.writeFileSync(filePath, dummyContent, 'utf8');
          console.log('✅ Created dummy resume file for testing');
        }
      } else {
        console.log('❌ No resume data found in application');
      }
      
    } else {
      console.log('❌ Application not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkAndFixResumeFile();
