import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const updateApplicationWithCorrectSchema = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find and update the application with correct schema structure
    const result = await Application.updateOne(
      { fullName: 'farhanatyyu' },
      { 
        $set: {
          expectedSalary: {
            min: 60000,
            max: 80000,
            currency: 'USD'
          },
          coverLetter: 'I am a passionate frontend developer with strong skills in React, JavaScript, and modern web technologies. I am excited about this opportunity and believe my experience aligns well with your requirements.'
        }
      }
    );
    
    console.log('📊 Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Application updated successfully!');
      
      // Verify the update
      const updatedApplication = await Application.findOne({ fullName: 'farhanatyyu' });
      console.log('📋 Updated Application:');
      console.log('Expected Salary:', JSON.stringify(updatedApplication.expectedSalary, null, 2));
      console.log('Cover Letter:', updatedApplication.coverLetter);
      
    } else {
      console.log('❌ No application was updated');
    }

  } catch (error) {
    console.error('❌ Error updating application:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

updateApplicationWithCorrectSchema();
