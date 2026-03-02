import axios from 'axios';

const createTestAdminJob = async () => {
  try {
    console.log('🔧 Creating test admin job...');
    
    const adminJobData = {
      title: 'Test Admin Job (Should appear in Feed)',
      location: 'Dubai, UAE',
      experience: 'Mid Level',
      salary: {
        min: 8000,
        max: 12000,
        currency: 'AED'
      },
      requirements: 'React, Node.js, MongoDB',
      description: 'This is a test admin job that should appear in the feed',
      postedDate: new Date().toISOString(),
      type: 'Full-time',
      postedBy: 'admin', // This should make it appear in feed
      status: 'active', // This should make it appear in feed
    };
    
    console.log('📝 Admin job data:', adminJobData);
    
    const response = await axios.post('http://localhost:4000/api/jobs', adminJobData);
    
    console.log('✅ Admin job created successfully!');
    console.log('📋 Response status:', response.status);
    console.log('📋 Job ID:', response.data.job?._id || response.data._id);
    console.log('📋 PostedBy:', response.data.job?.postedBy || response.data.postedBy);
    console.log('📋 Status:', response.data.job?.status || response.data.status);
    console.log('📋 IsActive:', response.data.job?.isActive || response.data.isActive);
    
  } catch (error) {
    console.error('❌ Failed to create admin job:');
    console.error('Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
};

createTestAdminJob();
