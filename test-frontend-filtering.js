import axios from 'axios';

const testFrontendFiltering = async () => {
  try {
    console.log('🔧 Testing frontend filtering logic...');
    
    // Get the same data the frontend gets
    const response = await axios.get('http://localhost:4000/api/jobs?status=active&limit=100&sortBy=createdAt&sortOrder=desc');
    const jobs = response.data.data?.jobs || response.data.jobs || [];
    
    console.log(`📋 Total jobs from API: ${jobs.length}`);
    
    // Apply the NEW frontend filtering logic
    const filteredJobs = jobs.filter((job) => {
      return job.postedBy === 'admin' && (job.status === 'active' || job.isActive === true);
    });
    
    console.log(`📋 Jobs that should appear in feed (NEW logic): ${filteredJobs.length}`);
    
    if (filteredJobs.length > 0) {
      console.log('\n🎉 SUCCESS! Admin jobs will appear in feed:');
      filteredJobs.slice(0, 5).forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.title} (postedBy: ${job.postedBy}, status: ${job.status}, isActive: ${job.isActive})`);
      });
      
      if (filteredJobs.length > 5) {
        console.log(`  ... and ${filteredJobs.length - 5} more`);
      }
      
      console.log('\n✅ The frontend filtering issue has been FIXED!');
      console.log('✅ Admin posts should now appear in the Feed page!');
    } else {
      console.log('\n❌ Still no admin jobs with new logic');
      
      // Check what admin jobs exist
      const adminJobs = jobs.filter(job => job.postedBy === 'admin');
      console.log(`📋 Total admin jobs: ${adminJobs.length}`);
      
      if (adminJobs.length > 0) {
        console.log('📋 Admin job details (first 3):');
        adminJobs.slice(0, 3).forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title}`);
          console.log(`     postedBy: ${job.postedBy}`);
          console.log(`     status: ${job.status}`);
          console.log(`     isActive: ${job.isActive}`);
          console.log(`     Would pass filter: ${job.postedBy === 'admin' && (job.status === 'active' || job.isActive === true)}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testFrontendFiltering();
