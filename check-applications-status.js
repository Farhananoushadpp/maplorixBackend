import axios from 'axios';

const checkApplicationsStatus = async () => {
  try {
    console.log('🔍 Checking applications API status...');
    
    // Login to get token
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@maplorix.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('✅ Login successful');
      
      // Test applications API
      const applicationsResponse = await axios.get('http://localhost:4000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });
      
      const applications = applicationsResponse.data.data?.applications || [];
      console.log(`📊 Found ${applications.length} applications in database`);
      
      if (applications.length > 0) {
        console.log('📋 Sample applications:');
        applications.slice(0, 5).forEach((app, index) => {
          console.log(`${index + 1}. ${app.fullName} - ${app.jobRole} - ${app.status}`);
        });
        console.log('✅ Applications API is working correctly');
      } else {
        console.log('❌ No applications found in database');
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error checking applications:', error.message);
  }
};

checkApplicationsStatus();
