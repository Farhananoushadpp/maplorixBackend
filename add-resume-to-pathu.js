import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const addResumeToPathuApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific pathu application (hospital administrator)
    const application = await Application.findOne({ 
      fullName: 'pathu',
      email: 'tarahadvertising@gmail.com',
      jobRole: 'hospital administrator'
    });
    
    if (application) {
      console.log('📋 Found pathu application (hospital administrator):');
      console.log('Current Resume:', JSON.stringify(application.resume, null, 2));
      
      // Add a resume to this application
      application.resume = {
        filename: 'resume-hospital-admin.doc',
        originalName: 'Hospital_Administrator_CV.doc',
        mimetype: 'application/msword',
        size: 51200,
        path: 'C:\\Users\\USER-ID\\CascadeProjects\\maplorixBackend\\uploads\\resumes\\resume-hospital-admin.doc'
      };
      
      await application.save();
      
      console.log('✅ Resume added to pathu application successfully!');
      console.log('New Resume:', JSON.stringify(application.resume, null, 2));
      
    } else {
      console.log('❌ pathu application (hospital administrator) not found');
    }

  } catch (error) {
    console.error('❌ Error adding resume:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

addResumeToPathuApplication();
