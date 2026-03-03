import axios from 'axios';

const testRegistration = async () => {
  try {
    console.log('🔧 Testing registration with port 4000...');
    
    const registrationData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser5@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'user'
    };
    
    console.log('📝 Registration data:', registrationData);
    
    const response = await axios.post('http://localhost:4000/api/auth/register', registrationData);
    
    console.log('✅ Registration successful!');
    console.log('📋 Response status:', response.status);
    console.log('📋 User role:', response.data.data.user.role);
    console.log('📋 User email:', response.data.data.user.email);
    
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
};

testRegistration();
