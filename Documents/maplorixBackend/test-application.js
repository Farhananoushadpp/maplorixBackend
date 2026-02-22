import axios from 'axios';

// First login to get token
const loginAndGetToken = async () => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'maplorixae@gmail.com',
      password: 'maplorixDXB'
    });
    return response.data.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test application submission
const testApplicationSubmission = async () => {
  try {
    console.log('🔍 Testing application submission...');
    
    // Get auth token
    const token = await loginAndGetToken();
    console.log('✅ Got auth token');
    
    // Prepare application data
    const applicationData = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      jobRole: 'Software Developer',
      experience: 'Entry Level',
      expectedSalary: '5000',
      currency: 'AED',
      coverLetter: 'Test cover letter',
      status: 'pending',
      source: 'website',
      location: 'Dubai, UAE'
    };
    
    // Submit application
    const response = await axios.post('http://localhost:4000/api/applications', applicationData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Application submitted successfully!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Application submission failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testApplicationSubmission();
