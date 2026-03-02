import axios from 'axios';

const checkAdminJobInFeed = async () => {
  try {
    console.log('🔍 Checking if admin job appears in feed...');
    
    // Get all jobs
    const allJobsResponse = await axios.get('http://localhost:4000/api/jobs?limit=30');
    const allJobs = allJobsResponse.data.jobs || allJobsResponse.data || [];
    
    console.log(`📋 Total jobs in database: ${allJobs.length}`);
    
    // Find admin jobs
    const adminJobs = allJobs.filter(job => job.postedBy === 'admin');
    console.log(`📋 Admin jobs found: ${adminJobs.length}`);
    
    // Check feed criteria (what PostsFeed uses)
    const feedJobs = allJobs.filter(job => {
      return job.postedBy === 'admin' && (job.status === 'active' || job.isActive === true);
    });
    console.log(`📋 Jobs that should appear in feed: ${feedJobs.length}`);
    
    if (adminJobs.length > 0) {
      console.log('\n📋 Admin jobs details:');
      adminJobs.forEach((job, index) => {
        console.log(`  Admin Job ${index + 1}:`);
        console.log(`    Title: ${job.title}`);
        console.log(`    PostedBy: ${job.postedBy}`);
        console.log(`    Status: ${job.status}`);
        console.log(`    IsActive: ${job.isActive}`);
        console.log(`    Should appear in feed: ${job.postedBy === 'admin' && (job.status === 'active' || job.isActive === true)}`);
      });
    }
    
    // Check specifically for our test job
    const testJob = allJobs.find(job => job.title.includes('Test Admin Job'));
    if (testJob) {
      console.log('\n📋 Test admin job found:');
      console.log(`  Title: ${testJob.title}`);
      console.log(`  PostedBy: ${testJob.postedBy}`);
      console.log(`  Status: ${testJob.status}`);
      console.log(`  IsActive: ${testJob.isActive}`);
      console.log(`  Meets feed criteria: ${testJob.postedBy === 'admin' && (testJob.status === 'active' || testJob.isActive === true)}`);
    } else {
      console.log('\n❌ Test admin job not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin job in feed:', error.message);
  }
};

checkAdminJobInFeed();
