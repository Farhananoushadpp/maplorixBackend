import axios from 'axios';

// Test with authentication token (you'll need to get this from browser localStorage)
const testApplicationsAPI = async () => {
  try {
    console.log('🔍 Testing Applications API with authentication...');
    
    // First, try to login to get a token
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@maplorix.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('✅ Login successful, got token');
      
      // Now test the applications API with the token
      const applicationsResponse = await axios.get('http://localhost:4000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          _t: Date.now()
        }
      });
      
      console.log('📊 Applications API Response structure:');
      console.log('Response type:', typeof applicationsResponse.data);
      console.log('Response keys:', Object.keys(applicationsResponse.data));
      
      const applicationsData = applicationsResponse.data.data?.applications || [];
      console.log('📊 Total applications returned:', applicationsData.length);
      
      // Search for the specific application
      const targetApplication = applicationsData.find(app => 
        app.fullName && app.fullName.toLowerCase().includes('farhanatyyu'.toLowerCase())
      );
      
      if (targetApplication) {
        console.log('✅ Found target application:');
        console.log('Full Name:', targetApplication.fullName);
        console.log('Email:', targetApplication.email);
        console.log('Phone:', targetApplication.phone);
        console.log('Job Role:', targetApplication.jobRole);
        console.log('Expected Salary:', JSON.stringify(targetApplication.expectedSalary, null, 2));
        console.log('Cover Letter:', JSON.stringify(targetApplication.coverLetter, null, 2));
        console.log('Experience:', targetApplication.experience);
        console.log('Created:', targetApplication.createdAt);
      } else {
        console.log('❌ Application not found');
        console.log('📋 All application names:');
        applicationsData.forEach((app, index) => {
          console.log(`${index + 1}. ${app.fullName}`);
        });
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing applications API:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
};

testApplicationsAPI();
