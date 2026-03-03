import axios from 'axios';

const testFrontendRegistration = async () => {
  try {
    console.log('🔧 Testing frontend registration flow...');
    
    // Use the same configuration as the frontend
    const api = axios.create({
      baseURL: 'http://localhost:4001/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const registrationData = {
      firstName: 'Frontend',
      lastName: 'Test',
      email: 'frontendtest@example.com',
      password: 'password123',
      phone: '9876543210'
    };
    
    console.log('📝 Registration data:', registrationData);
    
    const response = await api.post('/auth/register', registrationData);
    
    console.log('✅ Frontend registration successful!');
    console.log('📋 Response status:', response.status);
    console.log('📋 Response data:', response.data);
    
  } catch (error) {
    console.error('❌ Frontend registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
};

testFrontendRegistration();
