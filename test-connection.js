// Test script to verify API connection
import axios from 'axios';

const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:4001/health');
    console.log('Health check:', healthResponse.data);
    
    // Test jobs endpoint
    const jobsResponse = await axios.get('http://localhost:4001/api/jobs');
    console.log('Jobs endpoint working:', jobsResponse.data.success);
    console.log('Number of jobs:', jobsResponse.data.jobs?.length || 0);
    
    // Test admin login
    const loginResponse = await axios.post('http://localhost:4001/api/auth/login', {
      email: 'maplorixae@gmail.com',
      password: 'maplorixDXB'
    });
    console.log('Admin login successful:', loginResponse.data.success);
    console.log('User role:', loginResponse.data.data.user.role);
    
    console.log('\nAll API tests passed! Frontend should be able to connect.');
    
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure the backend server is running on localhost:4001');
    }
  }
};

testAPI();
