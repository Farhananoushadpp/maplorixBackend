import axios from 'axios';

const checkJobFields = async () => {
  try {
    console.log('🔍 Checking job fields to understand filtering issue...');
    
    const response = await axios.get('http://localhost:4000/api/jobs?limit=5');
    const jobs = response.data.jobs || response.data || [];
    
    console.log(`📋 Found ${jobs.length} jobs to analyze:`);
    
    jobs.forEach((job, index) => {
      console.log(`\n📋 Job ${index + 1}:`);
      console.log(`  Title: ${job.title || job.jobTitle || 'N/A'}`);
      console.log(`  PostedBy: ${job.postedBy || 'N/A'}`);
      console.log(`  Status: ${job.status || 'N/A'}`);
      console.log(`  IsActive: ${job.isActive || 'N/A'}`);
      console.log(`  Source: ${job.source || 'N/A'}`);
      console.log(`  All fields:`, Object.keys(job));
      
      // Check admin post criteria
      const isAdminPost = job.postedBy === 'admin' && (job.status === 'active' || job.isActive === true);
      console.log(`  Is Admin Post: ${isAdminPost}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking job fields:', error.message);
  }
};

checkJobFields();
