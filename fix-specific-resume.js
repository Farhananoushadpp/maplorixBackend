import mongoose from 'mongoose';
import Application from './models/Application.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const addResumeToSpecificApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific application that's causing 404 errors
    const application = await Application.findById('699be14f0566009c86ec75ee');
    
    if (application) {
      console.log('📋 Found application causing 404 errors:');
      console.log('Name:', application.fullName);
      console.log('Job Role:', application.jobRole);
      console.log('Current Resume:', JSON.stringify(application.resume, null, 2));
      
      // Create a resume file for this application
      const resumePath = 'C:\\Users\\USER-ID\\CascadeProjects\\maplorixBackend\\uploads\\resumes\\resume-' + application._id + '.txt';
      const uploadsDir = path.dirname(resumePath);
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('📁 Created uploads directory:', uploadsDir);
      }
      
      // Create a resume file
      const resumeContent = `Resume for ${application.fullName}

Job Role: ${application.jobRole}
Email: ${application.email}
Phone: ${application.phone}
Experience: ${application.experience}

Cover Letter:
${application.coverLetter || 'No cover letter provided'}

Skills: ${application.skills || 'Not specified'}

This resume was generated automatically for demonstration purposes.
Submitted: ${application.createdAt}
Application ID: ${application._id}`;
      
      fs.writeFileSync(resumePath, resumeContent, 'utf8');
      console.log('✅ Created resume file:', resumePath);
      
      // Update the application with resume data
      application.resume = {
        filename: 'resume-' + application._id + '.txt',
        originalName: `${application.fullName.replace(/\s+/g, '_')}_Resume.txt`,
        mimetype: 'text/plain',
        size: Buffer.byteLength(resumeContent, 'utf8'),
        path: resumePath
      };
      
      await application.save();
      console.log('✅ Application updated with resume data');
      console.log('New Resume Info:', JSON.stringify(application.resume, null, 2));
      
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

addResumeToSpecificApplication();
