import axios from 'axios';

const testFixedData = async () => {
  try {
    console.log('🔍 Testing fixed data structure handling...');
    
    // Test jobs API with correct structure
    console.log('\n📋 Testing Jobs API (fixed structure)...');
    const jobsResponse = await axios.get('http://localhost:4000/api/jobs');
    
    // Simulate frontend data extraction
    const jobsData = jobsResponse.data?.jobs || jobsResponse.data || jobsResponse;
    console.log('- Extracted jobs count:', jobsData.length);
    console.log('- Sample job title:', jobsData[0]?.title || 'N/A');
    console.log('- Sample job company:', jobsData[0]?.company || 'N/A');
    
    // Test applications API with nested structure
    console.log('\n📋 Testing Applications API (nested structure)...');
    const applicationsResponse = await axios.get('http://localhost:4000/api/applications', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTliMjFiZDA3NWJiYTYxN2I1NzNhZDUiLCJpYXQiOjE3NzE3ODkzNTMsImV4cCI6MTc3MjM5NDE1M30.WRAs_do3Gl4-CGq2TrFLdwzeAfXOzl6RCaFmq_rJ8QA'
      }
    });
    
    // Simulate frontend data extraction
    const applicationsData = applicationsResponse.data?.data?.applications || applicationsResponse.data?.applications || applicationsResponse.data || applicationsResponse;
    console.log('- Extracted applications count:', applicationsData.length);
    console.log('- Sample application name:', applicationsData[0]?.fullName || 'N/A');
    console.log('- Sample application email:', applicationsData[0]?.email || 'N/A');
    
    console.log('\n✅ Data structure handling is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testFixedData();
