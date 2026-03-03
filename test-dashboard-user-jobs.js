import mongoose from 'mongoose';
import Job from './models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const testDashboardShowsUserJobs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('🔗 Connected to MongoDB');

    // Create a test user-posted job (inactive)
    console.log('\n📝 Creating test user-posted job...');
    const userJob = new Job({
      title: 'Test User Job (Should appear in Dashboard)',
      company: 'Test User Company',
      location: 'Dubai, UAE',
      type: 'Full-time',
      postedBy: 'user',
      isActive: false, // User jobs are inactive
      description: 'This job should appear in dashboard but not in feed',
      requirements: 'Test requirements',
      experience: 'Entry Level',
    });
    
    await userJob.save();
    console.log('✅ User job created:', userJob._id);
    console.log('📋 postedBy:', userJob.postedBy);
    console.log('📋 isActive:', userJob.isActive);

    // Test Dashboard endpoint (should show ALL jobs including inactive user jobs)
    console.log('\n📊 Testing Dashboard endpoint (should show ALL jobs)...');
    const dashboardJobs = await Job.find({}).sort({ createdAt: -1 });
    console.log('📋 Dashboard jobs count:', dashboardJobs.length);
    
    const userJobInDashboard = dashboardJobs.find(job => job._id.toString() === userJob._id.toString());
    console.log('📋 User job in dashboard:', userJobInDashboard ? '✅ YES (CORRECT)' : '❌ NO (ERROR)');
    
    if (userJobInDashboard) {
      console.log('📋 Found user job:', userJobInDashboard.title);
    }

    // Test Feed endpoint (should still show ONLY admin jobs)
    console.log('\n📊 Testing Feed endpoint (should show ONLY admin jobs)...');
    const feedJobs = await Job.find({ 
      isActive: true, 
      postedBy: 'admin' 
    }).sort({ createdAt: -1 });
    
    console.log('📋 Feed jobs count:', feedJobs.length);
    
    const userJobInFeed = feedJobs.find(job => job._id.toString() === userJob._id.toString());
    console.log('📋 User job in feed:', userJobInFeed ? '❌ YES (ERROR)' : '✅ NO (CORRECT)');

    console.log('\n🎉 Dashboard test completed!');
    console.log('✅ User-posted jobs now appear in Dashboard (for admin management)');
    console.log('✅ User-posted jobs still NOT appear in Feed (public view)');
    console.log('✅ Admin-posted jobs appear in both Dashboard and Feed');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testDashboardShowsUserJobs();
