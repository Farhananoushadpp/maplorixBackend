import axios from 'axios';

const testJobsAPI = async () => {
  try {
    console.log('🔍 Testing Jobs API directly...');
    
    // Test the jobs API endpoint
    const response = await axios.get('http://localhost:4000/api/jobs', {
      params: {
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        _t: Date.now() // Cache busting
      }
    });
    
    console.log('📊 API Response structure:');
    console.log('Response keys:', Object.keys(response.data));
    console.log('Is array:', Array.isArray(response.data));
    
    // Check if it's the dashboard endpoint or regular endpoint
    if (Array.isArray(response.data)) {
      console.log('✅ Jobs returned as array directly');
      const job = response.data.find(job => job.title === 'tytuuiuityiiyyi');
      
      if (job) {
        console.log('✅ Found job in API response:');
        console.log('Title:', job.title);
        console.log('Salary:', JSON.stringify(job.salary, null, 2));
        console.log('Requirements:', JSON.stringify(job.requirements, null, 2));
        console.log('Experience:', job.experience);
      } else {
        console.log('❌ Job not found in API response');
        console.log('Available jobs:', response.data.map(j => j.title));
      }
    } else {
      console.log('📊 Jobs wrapped in object:', response.data);
      const job = response.data.data?.find(job => job.title === 'tytuuiuityiiyyi');
      
      if (job) {
        console.log('✅ Found job in API response:');
        console.log('Title:', job.title);
        console.log('Salary:', JSON.stringify(job.salary, null, 2));
        console.log('Requirements:', JSON.stringify(job.requirements, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

testJobsAPI();
