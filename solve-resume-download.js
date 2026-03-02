import axios from 'axios';

const solveResumeDownloadIssue = async () => {
  try {
    console.log('🔧 Solving resume download issue...');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:4001/api/auth/login', {
      email: 'admin@maplorix.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('✅ Login successful');
      
      // Test resume download with authentication
      const appId = '699be8e27fa3307b98cead5a';
      console.log('🔽 Testing authenticated resume download for:', appId);
      
      try {
        const downloadResponse = await axios.get(`http://localhost:4001/api/applications/${appId}/resume`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob',
          timeout: 30000,
        });
        
        console.log('✅ Resume download working with authentication!');
        console.log('📄 File size:', downloadResponse.data.size);
        console.log('📄 Content type:', downloadResponse.headers['content-type']);
        console.log('📄 Content disposition:', downloadResponse.headers['content-disposition']);
        
        // Create a test download
        const url = window.URL.createObjectURL(downloadResponse.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'test_resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('🎉 RESUME DOWNLOAD WORKING!');
        
      } catch (downloadError) {
        console.log('❌ Resume download failed:', downloadError.message);
        console.log('Status:', downloadError.response?.status);
        console.log('Data:', downloadError.response?.data);
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

solveResumeDownloadIssue();
