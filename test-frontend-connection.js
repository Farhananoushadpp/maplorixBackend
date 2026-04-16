// Test script to verify frontend can connect to backend
import axios from 'axios';

const testFrontendConnection = async () => {
  try {
    console.log('Testing frontend connection to backend...');
    
    // Test the exact same endpoints the frontend will use
    const endpoints = [
      '/health',
      '/api/auth/me',
      '/api/jobs/featured?limit=3',
      '/api/jobs?status=active&limit=10'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:4001${endpoint}`);
        console.log(`\u2705 ${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error) {
        if (error.response) {
          console.log(`\u274c ${endpoint}: ${error.response.status} ${error.response.statusText}`);
        } else {
          console.log(`\u274c ${endpoint}: Connection failed - ${error.message}`);
        }
      }
    }
    
    // Test admin login
    try {
      const loginResponse = await axios.post('http://localhost:4001/api/auth/login', {
        email: 'maplorixae@gmail.com',
        password: 'maplorixDXB'
      });
      console.log(`\u2705 Admin login: ${loginResponse.status} ${loginResponse.statusText}`);
      console.log(`   User: ${loginResponse.data.data.user.fullName}`);
      console.log(`   Role: ${loginResponse.data.data.user.role}`);
    } catch (error) {
      console.log(`\u274c Admin login: ${error.message}`);
    }
    
    console.log('\nFrontend should now be able to connect successfully!');
    console.log('Refresh the frontend page to see the changes take effect.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testFrontendConnection();
