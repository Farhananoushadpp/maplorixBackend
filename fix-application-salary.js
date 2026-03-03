import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixApplicationSalary = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific application by name
    const application = await Application.findOne({ fullName: 'farhanatyyu' });
    
    if (application) {
      console.log('📋 Found Application:');
      console.log('Current Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      
      // Update the salary with proper amount
      application.expectedSalary = {
        currency: 'USD',
        amount: 75000
      };
      
      await application.save();
      
      console.log('✅ Application salary updated successfully!');
      console.log('New Expected Salary:', JSON.stringify(application.expectedSalary, null, 2));
      
    } else {
      console.log('❌ Application not found with name: farhanatyyu');
    }

  } catch (error) {
    console.error('❌ Error updating application salary:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

fixApplicationSalary();
