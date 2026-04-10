import axios from 'axios';

const updateJobWithData = async () => {
  try {
    console.log('🔧 Updating job with missing data...');
    
    // Find the specific job
    const response = await axios.get('http://localhost:4000/api/jobs');
    const jobs = response.data.jobs;
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
        updateData
      );
      
      console.log('✅ Job updated successfully!');
      console.log('Updated data:', updateResponse.data);
      
    } else {
      console.log('❌ Target job not found');
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data || error.message);
  }
};

updateJobWithData();
