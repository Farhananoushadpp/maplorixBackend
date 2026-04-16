import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('🔍 Testing admin login on port 4000...');
    
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'maplorixae@gmail.com',
      password: 'maplorixDXB'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin();
