import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixPathuApplicationComplete = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find and update the application with both salary and cover letter
    const result = await Application.updateOne(
      { fullName: 'pathu' },
      { 
        $set: {
          expectedSalary: {
            min: 40000,
            max: 60000,
            currency: 'USD'
          },
          coverLetter: 'I am a creative graphic designer with strong skills in Adobe Creative Suite, visual design, and brand development. I am passionate about creating compelling visual designs that communicate effectively and drive results.'
        }
      }
    );
    
    console.log('📊 Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Application updated successfully!');
      
      // Verify the update
      const updatedApplication = await Application.findOne({ fullName: 'pathu' });
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

fixPathuApplicationComplete();
