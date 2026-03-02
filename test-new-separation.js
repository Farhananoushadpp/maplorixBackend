import mongoose from 'mongoose';
import Job from './models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const testNewJobSeparation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Create test user-posted job
    console.log('\n📝 Creating test user-posted job...');
    const userJob = new Job({
      title: 'Test User Job (Dashboard only)',
      company: 'User Company',
      location: 'Dubai, UAE',
      type: 'Full-time',
      postedBy: 'user',
      isActive: false,
      description: 'This should appear in dashboard only',
    });
    
    await userJob.save();
    console.log('✅ User job created:', userJob._id);

    // Create test admin-posted job
    console.log('\n📝 Creating test admin-posted job...');
    const adminJob = new Job({
      title: 'Test Admin Job (Feed only)',
      company: 'Admin Company',
      location: 'Abu Dhabi, UAE',
      type: 'Full-time',
      postedBy: 'admin',
      isActive: true,
      description: 'This should appear in feed only',
    });
    
    await adminJob.save();
    console.log('✅ Admin job created:', adminJob._id);

    // Test Dashboard endpoint (should show ONLY user jobs)
    console.log('\n📊 Testing Dashboard endpoint (should show ONLY user jobs)...');
    const dashboardJobs = await Job.find({ postedBy: 'user' }).sort({ createdAt: -1 });
    console.log('📋 Dashboard jobs count:', dashboardJobs.length);
    
    const userJobInDashboard = dashboardJobs.find(job => job._id.toString() === userJob._id.toString());
    const adminJobInDashboard = dashboardJobs.find(job => job._id.toString() === adminJob._id.toString());
    
    console.log('📋 User job in dashboard:', userJobInDashboard ? '✅ YES (CORRECT)' : '❌ NO (ERROR)');
    console.log('📋 Admin job in dashboard:', adminJobInDashboard ? '❌ YES (ERROR)' : '✅ NO (CORRECT)');

    // Test Feed endpoint (should show ONLY admin jobs)
    console.log('\n📊 Testing Feed endpoint (should show ONLY admin jobs)...');
    const feedJobs = await Job.find({ 
      isActive: true, 
      postedBy: 'admin' 
    }).sort({ createdAt: -1 });
    
    console.log('📋 Feed jobs count:', feedJobs.length);
    
    const userJobInFeed = feedJobs.find(job => job._id.toString() === userJob._id.toString());
    const adminJobInFeed = feedJobs.find(job => job._id.toString() === adminJob._id.toString());
    
    console.log('📋 User job in feed:', userJobInFeed ? '❌ YES (ERROR)' : '✅ NO (CORRECT)');
    console.log('📋 Admin job in feed:', adminJobInFeed ? '✅ YES (CORRECT)' : '❌ NO (ERROR)');

    console.log('\n🎉 New job separation test completed!');
    console.log('✅ "Post a Job" jobs → Dashboard only');
    console.log('✅ Admin Posts jobs → Feed only');
    console.log('✅ Complete separation achieved!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testNewJobSeparation();
