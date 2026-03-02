import axios from 'axios';

const forceFixResumeUpload = async () => {
  try {
    console.log('🔧 Force fixing resume upload...');
    
    // Test basic connection to backend
    console.log('📡 Testing backend connection...');
    const healthCheck = await axios.get('http://localhost:4000/health');
    console.log('✅ Backend health check:', healthCheck.data);
    
    // Test application submission without file first
    console.log('📤 Testing basic application submission...');
    const basicFormData = new FormData();
    basicFormData.append('fullName', 'Test User');
    basicFormData.append('email', 'test@example.com');
    basicFormData.append('phone', '+971506507165');
    basicFormData.append('location', 'Dubai, UAE');
    basicFormData.append('jobRole', 'test developer');
    basicFormData.append('experience', 'Entry Level');
    basicFormData.append('expectedSalary', '50000');
    basicFormData.append('currency', 'AED');
    basicFormData.append('coverLetter', 'Test cover letter');
    basicFormData.append('status', 'pending');
    basicFormData.append('source', 'website');
    basicFormData.append('name', 'Test User');
    basicFormData.append('position', 'test developer');
    
    const response = await axios.post('http://localhost:4000/api/applications', basicFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('✅ Basic application submission successful!');
    console.log('Response:', response.data);
    
    // Test with file
    console.log('📎 Testing application submission with file...');
    const fileFormData = new FormData();
    fileFormData.append('fullName', 'Test User with Resume');
    fileFormData.append('email', 'testresume@example.com');
    fileFormData.append('phone', '+971506507166');
    fileFormData.append('location', 'Dubai, UAE');
    fileFormData.append('jobRole', 'test developer with resume');
    fileFormData.append('experience', 'Entry Level');
    fileFormData.append('expectedSalary', '60000');
    fileFormData.append('currency', 'AED');
    fileFormData.append('coverLetter', 'Test cover letter with resume');
    fileFormData.append('status', 'pending');
    fileFormData.append('source', 'website');
    fileFormData.append('name', 'Test User with Resume');
    fileFormData.append('position', 'test developer with resume');
    
    // Create a simple PDF-like file
    const pdfContent = new Blob(['%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 f \n0000000058 00000 f \n0000000115 00000 f \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF'], { type: 'application/pdf' });
    fileFormData.append('resume', pdfContent, 'test-resume.pdf');
    
    const fileResponse = await axios.post('http://localhost:4000/api/applications', fileFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('✅ Application submission with file successful!');
    console.log('Response:', fileResponse.data);
    
    if (fileResponse.data.success && fileResponse.data.data) {
      console.log('🎯 Application ID:', fileResponse.data.data._id);
      console.log('📋 Resume data:', fileResponse.data.data.resume);
      
      if (fileResponse.data.data.resume && fileResponse.data.data.resume.filename) {
        console.log('🎉 RESUME UPLOAD WORKING!');
        console.log('- Filename:', fileResponse.data.data.resume.filename);
        console.log('- Original Name:', fileResponse.data.data.resume.originalName);
        console.log('- Size:', fileResponse.data.data.resume.size);
      } else {
        console.log('❌ Resume still not saved');
      }
    }
    
  } catch (error) {
    console.error('❌ Error in force fix:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

forceFixResumeUpload();
