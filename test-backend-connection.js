import axios from 'axios';

const testBackendConnection = async () => {
  try {
    console.log('🔧 Testing backend connection...');
    
    // Test Dashboard endpoint
    console.log('\n📊 Testing Dashboard endpoint...');
    const dashboardResponse = await axios.get('http://localhost:4001/api/jobs');
    console.log('✅ Dashboard endpoint working!');
    console.log('📋 Dashboard jobs count:', dashboardResponse.data.jobs.length);
    
    // Test Feed endpoint
    console.log('\n📊 Testing Feed endpoint...');
    const feedResponse = await axios.get('http://localhost:4001/api/jobs/feed');
    console.log('✅ Feed endpoint working!');
    console.log('📋 Feed jobs count:', feedResponse.data.jobs.length);
    
    // Check separation
    const dashboardUserJobs = dashboardResponse.data.jobs.filter(job => job.postedBy === 'user');
    const dashboardAdminJobs = dashboardResponse.data.jobs.filter(job => job.postedBy === 'admin');
    const feedUserJobs = feedResponse.data.jobs.filter(job => job.postedBy === 'user');
    const feedAdminJobs = feedResponse.data.jobs.filter(job => job.postedBy === 'admin');
    
    console.log('\n📊 Job Separation Analysis:');
    console.log('📋 Dashboard - User jobs:', dashboardUserJobs.length);
    console.log('📋 Dashboard - Admin jobs:', dashboardAdminJobs.length);
    console.log('📋 Feed - User jobs:', feedUserJobs.length);
    console.log('📋 Feed - Admin jobs:', feedAdminJobs.length);
    
    console.log('\n🔍 Verification:');
    console.log('📋 Dashboard should have only user jobs:', dashboardUserJobs.length > 0 && dashboardAdminJobs.length === 0 ? '✅ CORRECT' : '❌ ERROR');
    console.log('📋 Feed should have only admin jobs:', feedAdminJobs.length > 0 && feedUserJobs.length === 0 ? '✅ CORRECT' : '❌ ERROR');
    
    console.log('\n🎉 Frontend separation test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testBackendConnection();
