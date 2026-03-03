import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const bulkFixApplications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find all applications with incomplete salary data
    const incompleteApplications = await Application.find({
      $or: [
        { 'expectedSalary.currency': { $exists: true }, 'expectedSalary.min': { $exists: false } },
        { 'expectedSalary.currency': { $exists: true }, 'expectedSalary.max': { $exists: false } },
        { coverLetter: { $exists: false } },
        { coverLetter: null },
        { coverLetter: '' }
      ]
    });

    console.log(`📊 Found ${incompleteApplications.length} applications with incomplete data`);

    let updatedCount = 0;

    for (const app of incompleteApplications) {
      const updateData = {};
      
      // Fix salary if it only has currency
      if (app.expectedSalary && app.expectedSalary.currency && (!app.expectedSalary.min || !app.expectedSalary.max)) {
        // Set default salary range based on job role
        let defaultMin = 35000;
        let defaultMax = 55000;
        
        if (app.jobRole && app.jobRole.toLowerCase().includes('senior')) {
          defaultMin = 70000;
          defaultMax = 90000;
        } else if (app.jobRole && app.jobRole.toLowerCase().includes('junior')) {
          defaultMin = 30000;
          defaultMax = 45000;
        } else if (app.jobRole && app.jobRole.toLowerCase().includes('lead')) {
          defaultMin = 80000;
          defaultMax = 100000;
        }
        
        updateData.expectedSalary = {
          min: defaultMin,
          max: defaultMax,
          currency: app.expectedSalary.currency || 'USD'
        };
      }
      
      // Add cover letter if missing
      if (!app.coverLetter || app.coverLetter === '' || app.coverLetter === null) {
        updateData.coverLetter = `I am a passionate ${app.jobRole || 'professional'} with strong skills and experience in my field. I am excited about this opportunity and believe my qualifications align well with your requirements. I look forward to contributing to your team's success.`;
      }
      
      // Update the application
      if (Object.keys(updateData).length > 0) {
        await Application.updateOne({ _id: app._id }, { $set: updateData });
        console.log(`✅ Updated application: ${app.fullName} (${app.jobRole})`);
        updatedCount++;
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} applications!`);

  } catch (error) {
    console.error('❌ Error in bulk fix:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

bulkFixApplications();
