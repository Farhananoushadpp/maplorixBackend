import axios from 'axios';

const testJobsResponse = async () => {
  try {
    console.log('🔍 Testing Jobs API response...');
    
    const jobsResponse = await axios.get('http://localhost:4000/api/jobs');
    
    console.log('Full Jobs Response:');
    console.log(JSON.stringify(jobsResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testJobsResponse();
