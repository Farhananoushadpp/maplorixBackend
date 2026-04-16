import axios from 'axios';

const testJobFieldMapping = async () => {
  try {
    console.log('🔍 Testing job field mapping...');
    
    const response = await axios.get('http://localhost:4000/api/jobs');
    const jobs = response.data.jobs;
    
    console.log(`📊 Found ${jobs.length} jobs`);
    
    jobs.forEach((job, index) => {
      console.log(`\n📄 Job ${index + 1} - Raw Data:`);
      console.log('- _id:', job._id);
      console.log('- title:', job.title);
      console.log('- company:', job.company);
      console.log('- location:', job.location);
      console.log('- type:', job.type);
      console.log('- description:', job.description);
      console.log('- requirements:', job.requirements);
      console.log('- experience:', job.experience);
      console.log('- salary:', job.salary);
      console.log('- postedDate:', job.postedDate);
      console.log('- createdAt:', job.createdAt);
      console.log('- postedBy:', job.postedBy);
      
      console.log('\n📋 Field Analysis:');
      console.log('- Company exists?', !!job.company);
      console.log('- Location exists?', !!job.location);
      console.log('- Salary exists?', !!job.salary);
      console.log('- Experience exists?', !!job.experience);
      console.log('- Requirements exists?', !!job.requirements);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testJobFieldMapping();
