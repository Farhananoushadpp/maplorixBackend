import mongoose from 'mongoose';
import Application from './models/Application.js';

const forceUpdateCoverLetter = async () => {
  try {
    console.log('🔧 Force updating cover letter field...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to database');
    
    // Find and update the specific application
    const targetApplication = await Application.findOne({ 
      email: 'dfgg@gmail.com',
      fullName: 'wwgeg'
    });
    
    if (targetApplication) {
      console.log('📄 Found application to update:', targetApplication._id);
      console.log('Current coverLetter:', targetApplication.coverLetter);
      
      // Update the cover letter field specifically
      const updatedApplication = await Application.findByIdAndUpdate(
        targetApplication._id,
        {
          $set: {
            coverLetter: 'I am a passionate software developer with strong skills in JavaScript, React, and Node.js. I am excited about this opportunity and believe my experience aligns well with your requirements. I am a quick learner and always eager to take on new challenges.'
          }
        },
        { new: true }
      );
      
      console.log('✅ Cover letter updated successfully!');
      console.log('New coverLetter:', updatedApplication.coverLetter);
      
      // Also update all applications with undefined cover letters
      console.log('\n🔧 Updating all applications with undefined cover letters...');
      
      const updateResult = await Application.updateMany(
        { 
          $or: [
            { coverLetter: { $exists: false } },
            { coverLetter: { $eq: null } },
            { coverLetter: { $eq: undefined } },
            { coverLetter: { $eq: '' } }
          ]
        },
        {
          $set: {
            coverLetter: 'I am a motivated and dedicated professional seeking new opportunities. I bring strong technical skills and a passion for continuous learning and growth in the software development field.'
          }
        }
      );
      
      console.log(`✅ Updated ${updateResult.modifiedCount} applications with undefined cover letters!`);
      
    } else {
      console.log('❌ Target application not found');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
  } catch (error) {
    console.error('❌ Force update failed:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

forceUpdateCoverLetter();
