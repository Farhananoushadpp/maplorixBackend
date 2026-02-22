import axios from 'axios';

const testDataStructure = async () => {
  try {
    console.log('🔍 Testing API data structures...');
    
    // Test applications API
    console.log('\n📋 Testing Applications API...');
    const applicationsResponse = await axios.get('http://localhost:4000/api/applications', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTliMjFiZDA3NWJiYTYxN2I1NzNhZDUiLCJpYXQiOjE3NzE3ODkzNTMsImV4cCI6MTc3MjM5NDE1M30.WRAs_do3Gl4-CGq2TrFLdwzeAfXOzl6RCaFmq_rJ8QA'
      }
    });
    
    console.log('Applications Response Structure:');
    console.log('- Has success field:', !!applicationsResponse.data.success);
    console.log('- Has data field:', !!applicationsResponse.data.data);
    console.log('- Has applications array:', !!(applicationsResponse.data.data?.applications));
    console.log('- Applications count:', applicationsResponse.data.data?.applications?.length || 0);
    
    // Test jobs API
    console.log('\n📋 Testing Jobs API...');
    const jobsResponse = await axios.get('http://localhost:4000/api/jobs');
    
    console.log('Jobs Response Structure:');
    console.log('- Has success field:', !!jobsResponse.data.success);
    console.log('- Has data field:', !!jobsResponse.data.data);
    console.log('- Has jobs array:', !!(jobsResponse.data.data?.jobs));
    console.log('- Jobs count:', jobsResponse.data.data?.jobs?.length || 0);
    
    // Show sample data
    if (applicationsResponse.data.data?.applications?.length > 0) {
      const sampleApp = applicationsResponse.data.data.applications[0];
      console.log('\n📄 Sample Application:');
      console.log('- ID:', sampleApp._id);
      console.log('- Name:', sampleApp.fullName);
      console.log('- Email:', sampleApp.email);
      console.log('- Status:', sampleApp.status);
    }
    
    if (jobsResponse.data.data?.jobs?.length > 0) {
      const sampleJob = jobsResponse.data.data.jobs[0];
      console.log('\n📄 Sample Job:');
      console.log('- ID:', sampleJob._id);
      console.log('- Title:', sampleJob.title);
      console.log('- Company:', sampleJob.company);
      console.log('- Location:', sampleJob.location);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testDataStructure();
