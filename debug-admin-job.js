import axios from 'axios';

const debugAdminJobCreation = async () => {
  try {
    console.log('🔧 Debugging admin job creation step by step...');
    
    // First, check current job count
    const beforeResponse = await axios.get('http://localhost:4000/api/jobs?limit=50');
    const beforeJobs = beforeResponse.data.jobs || beforeResponse.data || [];
    console.log(`📋 Jobs before creation: ${beforeJobs.length}`);
    
    // Create admin job with minimal required fields
    const minimalAdminJob = {
      title: 'Debug Admin Job',
      location: 'Dubai',
      postedBy: 'admin',
      isActive: true
    };
    
    console.log('📝 Creating minimal admin job:', minimalAdminJob);
    
    const createResponse = await axios.post('http://localhost:4000/api/jobs', minimalAdminJob);
    console.log('✅ Admin job created!');
    console.log('📋 Response:', createResponse.data);
    
    // Check jobs after creation
    const afterResponse = await axios.get('http://localhost:4000/api/jobs?limit=50');
    const afterJobs = afterResponse.data.jobs || afterResponse.data || [];
    console.log(`📋 Jobs after creation: ${afterJobs.length}`);
    
    // Look for our new job
    const newJob = afterJobs.find(job => job.title === 'Debug Admin Job');
    if (newJob) {
      console.log('🎉 Found new admin job!');
      console.log('📋 Job details:', {
        id: newJob._id,
        title: newJob.title,
        postedBy: newJob.postedBy,
        isActive: newJob.isActive,
        status: newJob.status
      });
    } else {
      console.log('❌ New admin job not found in database');
      console.log('📋 All job titles:', afterJobs.map(j => j.title));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
};

debugAdminJobCreation();
