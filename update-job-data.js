import mongoose from 'mongoose';
import Job from './models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const updateJobData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find all jobs with empty salary objects or empty requirements
    const jobsToUpdate = await Job.find({
      $or: [
        { salary: { $eq: {} } },
        { salary: { $exists: false } },
        { requirements: { $eq: '' } },
        { requirements: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${jobsToUpdate.length} jobs to update`);

    // Update each job
    for (const job of jobsToUpdate) {
      const updateData = {};
      
      // Update salary if empty
      if (!job.salary || Object.keys(job.salary).length === 0) {
        updateData.salary = {
          min: null,
          max: null,
          currency: 'AED'
        };
      }
      
      // Update requirements if empty
      if (!job.requirements || job.requirements === '') {
        updateData.requirements = 'No specific requirements listed for this position.';
      }
      
      if (Object.keys(updateData).length > 0) {
        await Job.findByIdAndUpdate(job._id, updateData);
        console.log(`✅ Updated job: ${job.title}`);
      }
    }

    console.log('🎉 Job data update completed!');
    
    // Verify the updates
    const updatedJobs = await Job.find({
      $or: [
        { salary: { $eq: {} } },
        { salary: { $exists: false } },
        { requirements: { $eq: '' } },
        { requirements: { $exists: false } }
      ]
    });
    
    console.log(`📊 Remaining jobs with empty data: ${updatedJobs.length}`);

  } catch (error) {
    console.error('❌ Error updating job data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

updateJobData();
