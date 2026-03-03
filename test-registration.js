import axios from 'axios';

const testRegistration = async () => {
  try {
    console.log('🔧 Testing registration endpoint...');
    
    const registrationData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      phone: '1234567890'
    };
    
    console.log('📝 Registration data:', registrationData);
    
    const response = await axios.post('http://localhost:4001/api/auth/register', registrationData);
    
    console.log('✅ Registration successful!');
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
};

testRegistration();
