import axios from 'axios';

const testApplicationsAPI = async () => {
  try {
    console.log('🔍 Testing Applications API directly...');
    
    // Test the applications API endpoint
    const response = await axios.get('http://localhost:4000/api/applications', {
      params: {
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        _t: Date.now() // Cache busting
      }
    });
    
    console.log('📊 Applications API Response structure:');
    console.log('Response type:', typeof response.data);
    console.log('Is array:', Array.isArray(response.data));
    console.log('Response keys:', Object.keys(response.data));
    
    let allApplications = [];
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      allApplications = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      allApplications = response.data.data;
    } else if (response.data.applications && Array.isArray(response.data.applications)) {
      allApplications = response.data.applications;
    } else {
      console.log('❌ Unexpected response structure');
      console.log('Response:', response.data);
      return;
    }
    
    console.log('📊 Total applications returned:', allApplications.length);
    
    // Search for the specific application
    const targetApplication = allApplications.find(app => 
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
      
      // Show all application names for debugging
      console.log('📋 All application names:');
      allApplications.forEach((app, index) => {
        console.log(`${index + 1}. ${app.fullName}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing applications API:', error.message);
  }
};

testApplicationsAPI();
