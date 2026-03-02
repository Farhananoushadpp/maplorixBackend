import mongoose from 'mongoose';
import Job from './models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const checkJobData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Find the specific job by title
    const job = await Job.findOne({ title: 'tytuuiuityiiyyi' });
    
    if (job) {
      console.log('📋 Job Found:');
      console.log('Title:', job.title);
      console.log('Company:', job.company);
      console.log('Location:', job.location);
      console.log('Salary:', JSON.stringify(job.salary, null, 2));
      console.log('Requirements:', JSON.stringify(job.requirements, null, 2));
      console.log('Experience:', job.experience);
      console.log('Description:', job.description);
      console.log('Created:', job.createdAt);
    } else {
      console.log('❌ Job not found with title: tytuuiuityiiyyi');
      
      // Search for similar jobs
      const similarJobs = await Job.find({ 
        $or: [
          { title: { $regex: 'tytuuiuityiiyyi', $options: 'i' } },
          { company: { $regex: 'rtyrtyryryrt', $options: 'i' } }
        ]
      });
      
      console.log(`📊 Found ${similarJobs.length} similar jobs:`);
      similarJobs.forEach((job, index) => {
        console.log(`\n--- Job ${index + 1} ---`);
        console.log('Title:', job.title);
        console.log('Company:', job.company);
        console.log('Salary:', JSON.stringify(job.salary, null, 2));
        console.log('Requirements:', JSON.stringify(job.requirements, null, 2));
      });
    }

  } catch (error) {
    console.error('❌ Error checking job data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkJobData();
