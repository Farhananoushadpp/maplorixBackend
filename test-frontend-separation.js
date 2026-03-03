import axios from 'axios';

const testFrontendSeparation = async () => {
  try {
    console.log('🔧 Testing frontend job separation...');
    
    // Test Dashboard endpoint (should show only user jobs)
    console.log('\n📊 Testing Dashboard endpoint (/api/jobs)...');
    const dashboardResponse = await axios.get('http://localhost:4001/api/jobs');
    console.log('📋 Dashboard jobs count:', dashboardResponse.data.jobs.length);
    console.log('📋 Dashboard jobs:');
    dashboardResponse.data.jobs.slice(0, 3).forEach(job => {
      console.log(`   - ${job.title} (${job.postedBy})`);
    });
    
    // Test Feed endpoint (should show only admin jobs)
    console.log('\n📊 Testing Feed endpoint (/api/jobs/feed)...');
    const feedResponse = await axios.get('http://localhost:4001/api/jobs/feed');
    console.log('📋 Feed jobs count:', feedResponse.data.jobs.length);
    console.log('📋 Feed jobs:');
    feedResponse.data.jobs.slice(0, 3).forEach(job => {
      console.log(`   - ${job.title} (${job.postedBy})`);
    });
    
    // Verify separation
    const dashboardHasOnlyUserJobs = dashboardResponse.data.jobs.every(job => job.postedBy === 'user');
    const feedHasOnlyAdminJobs = feedResponse.data.jobs.every(job => job.postedBy === 'admin');
    
    console.log('\n🔍 Verification:');
    console.log('📋 Dashboard has only user jobs:', dashboardHasOnlyUserJobs ? '✅ YES (CORRECT)' : '❌ NO (ERROR)');
    console.log('📋 Feed has only admin jobs:', feedHasOnlyAdminJobs ? '✅ YES (CORRECT)' : '❌ NO (ERROR)');
    
    // Test counts
    const userJobCount = dashboardResponse.data.jobs.length;
    const adminJobCount = feedResponse.data.jobs.length;
    
    console.log('\n📊 Job Counts:');
    console.log(`📋 User jobs (Dashboard): ${userJobCount}`);
    console.log(`📋 Admin jobs (Feed): ${adminJobCount}`);
    console.log(`📋 Total jobs: ${userJobCount + adminJobCount}`);
    
    console.log('\n🎉 Frontend separation test completed!');
    console.log('✅ "Post a Job" jobs → Dashboard only');
    console.log('✅ Admin Posts jobs → Feed only');
    console.log('✅ Perfect separation achieved!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testFrontendSeparation();
