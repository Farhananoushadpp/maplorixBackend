import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const findApplicationsWithResumes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find applications that have resumes
    const applicationsWithResumes = await Application.find({
      'resume.filename': { $exists: true, $ne: null }
    }).limit(10);

    console.log(`📊 Found ${applicationsWithResumes.length} applications with resumes:`);
    
    applicationsWithResumes.forEach((app, index) => {
      console.log(`${index + 1}. ${app.fullName} - ${app.resume.originalName || app.resume.filename} (${Math.round(app.resume.size / 1024)} KB)`);
      console.log(`   Email: ${app.email}`);
      console.log(`   Job Role: ${app.jobRole}`);
      console.log(`   Submitted: ${app.createdAt}`);
      console.log('---');
    });

    if (applicationsWithResumes.length === 0) {
      console.log('❌ No applications with resumes found');
    }

  } catch (error) {
    console.error('❌ Error finding applications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

findApplicationsWithResumes();
