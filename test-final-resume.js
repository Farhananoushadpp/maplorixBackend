import axios from 'axios';

const testApplicationSubmission = async () => {
  try {
    console.log('🔧 Testing application submission...');
    
    // Create form data exactly like the frontend
    const formData = new FormData();
    formData.append('fullName', 'pathu');
    formData.append('email', 'john.doe@company.com');
    formData.append('phone', '+971506507166');
    formData.append('location', 'Dubai, UAE');
    formData.append('jobRole', 'graphic designer');
    formData.append('experience', 'Entry Level');
    formData.append('expectedSalary', '5000');
    formData.append('currency', 'AED');
    formData.append('coverLetter', 'uyyu');
    formData.append('status', 'pending');
    formData.append('source', 'website');
    formData.append('name', 'pathu');
    formData.append('position', 'graphic designer');
    
    // Create a simple DOC file for testing
    const docContent = new Blob(['Test resume content for pathu'], { type: 'application/msword' });
    formData.append('resume', docContent, 'CORE_CV_template_2.doc');
    
    console.log('📤 Submitting application...');
    
    const response = await axios.post('http://localhost:4000/api/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('✅ Application submission successful!');
    console.log('Response:', response.data);
    
    if (response.data.success && response.data.data) {
      console.log('🎯 Application ID:', response.data.data.application.id);
      console.log('📋 Resume data:', response.data.data.application.resume);
      
      if (response.data.data.application.resume && response.data.data.application.resume.filename) {
        console.log('🎉 RESUME UPLOAD WORKING!');
        console.log('- Filename:', response.data.data.application.resume.filename);
        console.log('- Original Name:', response.data.data.application.resume.originalName);
        console.log('- Size:', response.data.data.application.resume.size);
        console.log('- MIME Type:', response.data.data.application.resume.mimetype);
      } else {
        console.log('❌ Resume still not saved');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testApplicationSubmission();
