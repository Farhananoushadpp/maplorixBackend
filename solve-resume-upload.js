import axios from 'axios';

const solveResumeUploadIssue = async () => {
  try {
    console.log('🔧 Solving resume upload issue...');
    
    // Test with exact same data as frontend
    const formData = new FormData();
    formData.append('fullName', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('phone', '+971506507165');
    formData.append('location', 'Dubai, UAE');
    formData.append('jobRole', 'web developer');
    formData.append('experience', 'Entry Level');
    formData.append('expectedSalary', '40000');
    formData.append('currency', 'AED');
    formData.append('coverLetter', 'Test cover letter');
    formData.append('status', 'pending');
    formData.append('source', 'website');
    formData.append('name', 'Test User');
    formData.append('position', 'web developer');
    
    // Create a PDF file
    const pdfContent = new Blob(['%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT /F1 12 Tf 72 720 Td (Test Resume) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 f \n0000000074 00000 f \n0000000120 00000 f \n0000000179 00000 f \n0000000224 00000 f \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n295\n%%EOF'], { type: 'application/pdf' });
    formData.append('resume', pdfContent, 'test_resume.pdf');
    
    console.log('📤 Submitting test application with resume...');
    
    const response = await axios.post('http://localhost:4001/api/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('✅ Application submitted successfully!');
    console.log('Response:', response.data);
    
    if (response.data.success && response.data.data && response.data.data.application.resume) {
      console.log('🎉 RESUME UPLOAD WORKING!');
      console.log('📋 Resume data:', response.data.data.application.resume);
      
      // Test resume download
      const appId = response.data.data.application.id;
      console.log('🔽 Testing resume download for:', appId);
      
      try {
        const downloadResponse = await axios.get(`http://localhost:4001/api/applications/${appId}/resume`, {
          responseType: 'blob',
          timeout: 30000,
        });
        
        console.log('✅ Resume download working!');
        console.log('📄 File size:', downloadResponse.data.size);
        console.log('📄 Content type:', downloadResponse.headers['content-type']);
        
      } catch (downloadError) {
        console.log('❌ Resume download failed:', downloadError.message);
      }
      
    } else {
      console.log('❌ Resume not saved in response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

solveResumeUploadIssue();
