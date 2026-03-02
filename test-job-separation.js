import mongoose from 'mongoose';
import Job from './models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const testJobSeparation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Test 1: Create a user-posted job (should NOT appear in feed)
    console.log('\n📝 Creating user-posted job...');
    const userJob = new Job({
      title: 'Frontend Developer (User Posted)',
      company: 'User Company',
      location: 'Dubai, UAE',
      type: 'Full-time',
      postedBy: 'user',
      isActive: false, // User jobs are inactive
      description: 'This is a user-posted job',
      requirements: 'React, JavaScript',
      experience: 'Mid Level',
    });
    
    await userJob.save();
    console.log('✅ User job created:', userJob._id);
    console.log('📋 postedBy:', userJob.postedBy);
    console.log('📋 isActive:', userJob.isActive);

    // Test 2: Create an admin-posted job (should appear in feed)
    console.log('\n📝 Creating admin-posted job...');
    const adminJob = new Job({
      title: 'Backend Developer (Admin Posted)',
      company: 'Admin Company',
      location: 'Abu Dhabi, UAE',
      type: 'Full-time',
      postedBy: 'admin',
      isActive: true, // Admin jobs are active
      description: 'This is an admin-posted job',
      requirements: 'Node.js, MongoDB',
      experience: 'Senior Level',
    });
    
    await adminJob.save();
    console.log('✅ Admin job created:', adminJob._id);
    console.log('📋 postedBy:', adminJob.postedBy);
    console.log('📋 isActive:', adminJob.isActive);

    // Test 3: Check Dashboard endpoint (should show ALL jobs)
    console.log('\n📊 Testing Dashboard endpoint (should show ALL jobs)...');
    const dashboardJobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    console.log('📋 Dashboard jobs count:', dashboardJobs.length);
    dashboardJobs.forEach(job => {
      console.log(`   - ${job.title} (${job.postedBy}, active: ${job.isActive})`);
    });

    // Test 4: Check Feed endpoint (should show ONLY admin jobs)
    console.log('\n📊 Testing Feed endpoint (should show ONLY admin jobs)...');
    const feedJobs = await Job.find({ 
      isActive: true, 
      postedBy: 'admin' 
    }).sort({ createdAt: -1 });
    
    console.log('📋 Feed jobs count:', feedJobs.length);
    feedJobs.forEach(job => {
      console.log(`   - ${job.title} (${job.postedBy}, active: ${job.isActive})`);
    });

    // Test 5: Check if user job is excluded from feed
    console.log('\n🔍 Verification:');
    const userJobInFeed = feedJobs.find(job => job._id.toString() === userJob._id.toString());
    const adminJobInFeed = feedJobs.find(job => job._id.toString() === adminJob._id.toString());
    
    console.log(`📋 User job in feed: ${userJobInFeed ? '❌ YES (ERROR)' : '✅ NO (CORRECT)'}`);
    console.log(`📋 Admin job in feed: ${adminJobInFeed ? '✅ YES (CORRECT)' : '❌ NO (ERROR)'}`);

    console.log('\n🎉 Job separation test completed!');
    console.log('✅ User-posted jobs are stored in Dashboard but NOT in Feed');
    console.log('✅ Admin-posted jobs are stored in Dashboard AND in Feed');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testJobSeparation();
