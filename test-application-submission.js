import axios from 'axios';

const testApplicationSubmission = async () => {
  try {
    console.log('🔍 Testing application submission to port 4001...');
    
    // Create form data similar to what the frontend sends
    const formData = new FormData();
    formData.append('fullName', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('phone', '+971506507165');
    formData.append('location', 'Dubai, UAE');
    formData.append('jobRole', 'test developer');
    formData.append('experience', 'Entry Level');
    formData.append('expectedSalary', '50000');
    formData.append('currency', 'AED');
    formData.append('coverLetter', 'Test cover letter');
    formData.append('status', 'pending');
    formData.append('source', 'website');
    formData.append('name', 'Test User');
    formData.append('position', 'test developer');
    
    // Create a dummy file for testing
    const dummyFile = new Blob(['test resume content'], { type: 'text/plain' });
    formData.append('resume', dummyFile, 'test-resume.txt');
    
    console.log('📤 Submitting test application...');
    
    const response = await axios.post('http://localhost:4001/api/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('✅ Application submission successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error submitting application:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testApplicationSubmission();
