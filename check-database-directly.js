import mongoose from 'mongoose';
import Job from './models/Job.js';

const checkDatabaseDirectly = async () => {
  try {
    console.log('🔍 Checking database directly...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to database');
    
    // Find the specific job
    const targetJob = await Job.findOne({ 
      title: 'GYFDSJWFC',
      company: 'fvnengje4hg'
    });
    
    if (targetJob) {
      console.log('📄 Raw Database Document:');
      console.log('- _id:', targetJob._id);
      console.log('- title:', targetJob.title);
      console.log('- company:', targetJob.company);
      console.log('- location:', targetJob.location);
      console.log('- experience:', targetJob.experience);
      console.log('- requirements:', targetJob.requirements);
      console.log('- salary:', targetJob.salary);
      console.log('- type:', targetJob.type);
      console.log('- category:', targetJob.category);
      console.log('- description:', targetJob.description);
      
      console.log('\n🔍 Document Object Keys:');
      console.log(Object.keys(targetJob.toObject()));
      
      console.log('\n🔍 Full Document:');
      console.log(JSON.stringify(targetJob.toObject(), null, 2));
      
    } else {
      console.log('❌ Target job not found');
      
      // Show all jobs
      const allJobs = await Job.find({});
      console.log(`\n📊 Found ${allJobs.length} jobs:`);
      
      allJobs.forEach((job, index) => {
        console.log(`\n${index + 1}. Job: "${job.title}"`);
        console.log(`   - Company: ${job.company}`);
        console.log(`   - Experience: ${job.experience}`);
        console.log(`   - Requirements: ${job.requirements ? 'Has data' : 'No data'}`);
        console.log(`   - Salary: ${job.salary ? JSON.stringify(job.salary) : 'No data'}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

checkDatabaseDirectly();
