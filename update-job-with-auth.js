import axios from 'axios';

const updateJobWithAuth = async () => {
  try {
    console.log('🔧 Updating job with authentication...');
    
    // Login to get token
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'maplorixae@gmail.com',
      password: 'maplorixDXB'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful');
    
    // Find the specific job
    const jobsResponse = await axios.get('http://localhost:4000/api/jobs');
    const jobs = jobsResponse.data.jobs;
    const targetJob = jobs.find(job => job.title === 'faRR' && job.company === 'Tarah');
    
    if (targetJob) {
      console.log('📄 Found job to update:', targetJob._id);
      
      // Update the job with complete data
      const updateData = {
        title: targetJob.title,
        company: targetJob.company,
        location: targetJob.location,
        type: targetJob.type,
        description: targetJob.description,
        requirements: "Bachelor's degree in Computer Science or related field. 3+ years of experience in software development. Strong knowledge of JavaScript, React, and Node.js.",
        experience: "Mid Level",
        salary: {
          min: 60000,
          max: 85000,
          currency: "USD"
        }
      };
      
      const updateResponse = await axios.put(
        `http://localhost:4000/api/jobs/${targetJob._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('✅ Job updated successfully!');
      console.log('Updated data:', updateResponse.data);
      
      // Verify the update
      console.log('\n🔍 Verifying updated job...');
      const verifyResponse = await axios.get(`http://localhost:4000/api/jobs/${targetJob._id}`);
      const updatedJob = verifyResponse.data;
      
      console.log('📄 Updated Job Details:');
      console.log('- Title:', updatedJob.title);
      console.log('- Company:', updatedJob.company);
      console.log('- Location:', updatedJob.location);
      console.log('- Experience:', updatedJob.experience);
      console.log('- Requirements:', updatedJob.requirements);
      console.log('- Salary:', updatedJob.salary);
      
    } else {
      console.log('❌ Target job not found');
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data || error.message);
  }
};

updateJobWithAuth();
