import axios from 'axios';

const testCorrectEmailSubmission = async () => {
  try {
    console.log('🔧 Testing with correct email format...');
    
    // Create form data with correct email
    const formData = new FormData();
    formData.append('fullName', 'Tarah Advertising');
    formData.append('email', 'tarahadvertising@gmail.com'); // Correct email format
    formData.append('phone', '+971506507166');
    formData.append('location', 'Dubai, UAE');
    formData.append('jobRole', 'graphic designer');
    formData.append('experience', 'Entry Level');
    formData.append('expectedSalary', '40000');
    formData.append('currency', 'AED');
    formData.append('coverLetter', 'jhjjhhjjhj');
    formData.append('status', 'pending');
    formData.append('source', 'website');
    formData.append('name', 'Tarah Advertising');
    formData.append('position', 'graphic designer');
    
    // Create a simple PDF file for testing
    const pdfContent = new Blob(['%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT /F1 12 Tf 72 720 Td (Tarah Advertising Resume Test) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 f \n0000000074 00000 f \n0000000120 00000 f \n0000000179 00000 f \n0000000224 00000 f \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n295\n%%EOF'], { type: 'application/pdf' });
    formData.append('resume', pdfContent, 'tarah-resume-correct.pdf');
    
    console.log('📤 Submitting application with correct email...');
    
    const response = await axios.post('http://localhost:4001/api/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('✅ Application submission successful!');
    console.log('Response:', response.data);
    
    if (response.data.success && response.data.data && response.data.data.application.resume) {
      console.log('🎉 RESUME UPLOAD WORKING WITH CORRECT EMAIL!');
      console.log('📋 Resume data:', response.data.data.application.resume);
      
      const appId = response.data.data.application.id;
      console.log('🎯 Application ID:', appId);
      console.log('📱 Now test the resume download with:', `http://localhost:4001/api/applications/${appId}/resume`);
      
    } else {
      console.log('❌ Resume not saved in response');
      console.log('📋 Application data:', response.data.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testCorrectEmailSubmission();
