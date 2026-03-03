import axios from 'axios';

const testJobsAPIRateLimit = async () => {
  try {
    console.log('🔧 Testing jobs API with rate limit handling...');
    
    // Test the feed endpoint
    const response = await axios.get('http://localhost:4000/api/jobs?status=active&limit=100&sortBy=createdAt&sortOrder=desc');
    
    console.log('✅ Jobs API working!');
    console.log('📋 Response status:', response.status);
    console.log('📋 Jobs count:', response.data.jobs?.length || response.data.length || 0);
    
    if (response.data.jobs) {
      console.log('📋 First job:', response.data.jobs[0]?.title);
    } else if (response.data.length > 0) {
      console.log('📋 First job:', response.data[0]?.title);
    }
    
  } catch (error) {
    console.error('❌ Jobs API failed:');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
};

testJobsAPIRateLimit();
