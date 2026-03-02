import axios from 'axios';

const testEndToEndFix = async () => {
  try {
    console.log('🔧 Testing end-to-end admin job fix...');
    
    // Test the exact query the frontend uses for feed
    const feedResponse = await axios.get('http://localhost:4000/api/jobs?status=active&limit=100&sortBy=createdAt&sortOrder=desc');
    
    // Extract jobs the way the frontend does
    const jobs = feedResponse.data.data?.jobs || feedResponse.data.jobs || [];
    
    console.log(`📋 Total jobs returned: ${jobs.length}`);
    
    // Filter for admin jobs (same logic as PostsFeed)
    const adminJobs = jobs.filter(job => job.postedBy === 'admin' && (job.status === 'active' || job.isActive === true));
    
    console.log(`📋 Admin jobs that should appear in feed: ${adminJobs.length}`);
    
    if (adminJobs.length > 0) {
      console.log('\n🎉 SUCCESS! Admin jobs found:');
      adminJobs.forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.title} (${job.postedBy}, isActive: ${job.isActive})`);
      });
      
      console.log('\n✅ The admin job feed issue has been FIXED!');
      console.log('✅ Admin posts should now appear in the frontend feed page');
    } else {
      console.log('\n❌ Still no admin jobs found in feed');
      
      // Check if admin jobs exist but don't meet criteria
      const allAdminJobs = jobs.filter(job => job.postedBy === 'admin');
      console.log(`📋 Total admin jobs in database: ${allAdminJobs.length}`);
      
      if (allAdminJobs.length > 0) {
        console.log('📋 Admin job details (first 3):');
        allAdminJobs.slice(0, 3).forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - postedBy: ${job.postedBy}, status: ${job.status}, isActive: ${job.isActive}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testEndToEndFix();
