import axios from 'axios';

const updateJobAdminEndpoint = async () => {
  try {
    console.log('🔧 Using admin endpoint to update job...');
    
    // Create axios instance for auth
    const authAPI = axios.create({
      baseURL: "http://localhost:4000/api",
    });
    
    // Login to get fresh token
    const loginResponse = await authAPI.post('/auth/login', {
      email: 'maplorixae@gmail.com',
      password: 'maplorixDXB'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Fresh token obtained');
    
    // Create authenticated admin API instance
    const adminAPI = axios.create({
      baseURL: "http://localhost:4000/api/admin",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Find the specific job
    const jobsResponse = await axios.get('http://localhost:4000/api/jobs');
    const jobs = jobsResponse.data.jobs;
    const targetJob = jobs.find(job => job.title === 'faRR' && job.company === 'Tarah');
    
    if (targetJob) {
      console.log('📄 Found job to update:', targetJob._id);
      
      // Update the job with complete data using admin endpoint
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
      
      const updateResponse = await adminAPI.put(`/jobs/${targetJob._id}`, updateData);
      
      console.log('✅ Job updated successfully!');
      console.log('Updated data:', updateResponse.data);
      
      // Verify the update by fetching fresh data
      console.log('\n🔍 Verifying updated job...');
      const verifyResponse = await axios.get('http://localhost:4000/api/jobs');
      const updatedJobs = verifyResponse.data.jobs;
      const updatedJob = updatedJobs.find(job => job._id === targetJob._id);
      
      if (updatedJob) {
        console.log('📄 Updated Job Details:');
        console.log('- Title:', updatedJob.title);
        console.log('- Company:', updatedJob.company);
        console.log('- Location:', updatedJob.location);
        console.log('- Experience:', updatedJob.experience);
        console.log('- Requirements:', updatedJob.requirements);
        console.log('- Salary:', updatedJob.salary);
        
        console.log('\n🎉 Now the job details view should show:');
        console.log('- Company: Tarah');
        console.log('- Location: INDIA');
        console.log('- Experience: Mid Level');
        console.log('- Requirements: Bachelor\'s degree...');
        console.log('- Salary: $60,000 - $85,000');
        console.log('\n✅ Refresh your frontend to see the updated data!');
      }
      
    } else {
      console.log('❌ Target job not found');
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data || error.message);
  }
};

updateJobAdminEndpoint();
