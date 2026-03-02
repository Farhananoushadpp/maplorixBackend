import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const findLatestTarahApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the most recent Tarah Advertising application
    const applications = await Application.find({ 
      fullName: 'Tarah Advertising',
      email: 'tarahadvertising@gmail.com'
    }).sort({ createdAt: -1 }).limit(3);
    
    console.log(`📋 Found ${applications.length} Tarah Advertising applications:`);
    
    applications.forEach((app, index) => {
      console.log(`\n${index + 1}. Application ID: ${app._id}`);
      console.log(`   Job Role: ${app.jobRole}`);
      console.log(`   Created: ${app.createdAt}`);
      console.log(`   Resume Data:`, JSON.stringify(app.resume, null, 2));
      
      if (app.resume && app.resume.filename) {
        console.log(`   ✅ Resume exists! File: ${app.resume.filename}`);
        console.log(`   📱 Test resume download: http://localhost:4001/api/applications/${app._id}/resume`);
      } else {
        console.log(`   ❌ No resume found`);
      }
    });
    
    // Find the specific application that was just submitted
    const latestApp = applications[0];
    if (latestApp && latestApp.resume) {
      console.log(`\n🎯 LATEST APPLICATION WITH RESUME:`);
      console.log(`   ID: ${latestApp._id}`);
      console.log(`   Job: ${latestApp.jobRole}`);
      console.log(`   Resume: ${latestApp.resume.originalName}`);
      console.log(`   📱 Download URL: http://localhost:4001/api/applications/${latestApp._id}/resume`);
      
      console.log(`\n🔧 STEPS:`);
      console.log(`   1. Refresh the dashboard`);
      console.log(`   2. Find the application with ID: ${latestApp._id}`);
      console.log(`   3. Click "View Details"`);
      console.log(`   4. Test the resume view/download buttons`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

findLatestTarahApplication();
