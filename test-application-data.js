import axios from 'axios';

const testApplicationData = async () => {
  try {
    console.log('🔍 Testing application data structure...');
    
    const response = await axios.get('http://localhost:4000/api/applications', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTliMjFiZDA3NWJiYTYxN2I1NzNhZDUiLCJpYXQiOjE3NzE3ODkzNTMsImV4cCI6MTc3MjM5NDE1M30.WRAs_do3Gl4-CGq2TrFLdwzeAfXOzl6RCaFmq_rJ8QA'
      }
    });
    
    const applications = response.data.data.applications;
    
    if (applications.length > 0) {
      const sampleApp = applications[0];
      console.log('📄 Sample Application Data:');
      console.log('- fullName:', sampleApp.fullName);
      console.log('- email:', sampleApp.email);
      console.log('- phone:', sampleApp.phone);
      console.log('- jobRole:', sampleApp.jobRole);
      console.log('- experience:', sampleApp.experience);
      console.log('- expectedSalary:', sampleApp.expectedSalary);
      console.log('- expectedSalary type:', typeof sampleApp.expectedSalary);
      console.log('- coverLetter:', sampleApp.coverLetter);
      console.log('- status:', sampleApp.status);
      console.log('- createdAt:', sampleApp.createdAt);
      
      // Test salary formatting
      if (typeof sampleApp.expectedSalary === 'object') {
        console.log('💰 Salary Object Details:');
        console.log('- min:', sampleApp.expectedSalary.min);
        console.log('- max:', sampleApp.expectedSalary.max);
        console.log('- currency:', sampleApp.expectedSalary.currency);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testApplicationData();
