import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

async function testAjmalRegistration() {
  try {
    console.log('🧪 Testing Registration with "ajmal km"...');
    
    // Test registration with your exact data
    const testData = {
      firstName: 'ajmal',
      lastName: 'km',
      email: 'ajmal.km@example.com',
      password: 'password123',
      phone: '+1234567890',
      message: 'Test registration for ajmal km'
    };

    console.log('📤 Sending registration request...');
    console.log('Data:', JSON.stringify(testData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/auth/register`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful!');
    console.log('User ID:', response.data.data.user._id);
    console.log('Contact ID:', response.data.data.contact.id);
    console.log('User Role:', response.data.data.user.role);
    console.log('User Department:', response.data.data.user.department);
    
    // Test login to verify user is stored
    console.log('\n🔑 Testing login to verify database storage...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testData.email,
      password: testData.password
    });
    
    console.log('✅ Login successful!');
    console.log('Login User ID:', loginResponse.data.data.user._id);
    console.log('Login Email:', loginResponse.data.data.user.email);
    
    // Test profile endpoint
    console.log('\n👤 Testing profile endpoint...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.data.token}`
      }
    });
    
    console.log('✅ Profile retrieved successfully!');
    console.log('Profile User:', profileResponse.data.data.user.firstName, profileResponse.data.data.user.lastName);
    console.log('Profile Email:', profileResponse.data.data.user.email);
    console.log('Profile Role:', profileResponse.data.data.user.role);

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAjmalRegistration();
