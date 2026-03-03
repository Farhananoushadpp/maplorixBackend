import axios from 'axios';

const testResumeDownload = async () => {
  try {
    console.log('🔍 Testing resume download endpoint...');
    
    // First, login to get a token
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@maplorix.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('✅ Login successful, got token');
      
      // Get applications to find one with a resume
      const applicationsResponse = await axios.get('http://localhost:4000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });
      
      const applications = applicationsResponse.data.data?.applications || [];
      
      // Find an application with a resume
      const applicationWithResume = applications.find(app => 
        app.resume && app.resume.filename
      );
      
      if (applicationWithResume) {
        console.log('✅ Found application with resume:', applicationWithResume.fullName);
        console.log('Resume info:', applicationWithResume.resume);
        
        // Test the download endpoint
        try {
          const downloadResponse = await axios.get(`http://localhost:4000/api/applications/${applicationWithResume._id}/resume`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
          });
          
          console.log('✅ Resume download endpoint working!');
          console.log('Content-Type:', downloadResponse.headers['content-type']);
          console.log('Content-Length:', downloadResponse.headers['content-length']);
          console.log('Content-Disposition:', downloadResponse.headers['content-disposition']);
          
        } catch (downloadError) {
          console.error('❌ Resume download failed:', downloadError.message);
          if (downloadError.response) {
            console.log('Status:', downloadError.response.status);
            console.log('Data:', downloadError.response.data);
          }
        }
        
      } else {
        console.log('❌ No applications with resumes found');
        console.log('Applications checked:', applications.map(app => ({
          name: app.fullName,
          hasResume: !!(app.resume && app.resume.filename)
        })));
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing resume download:', error.message);
  }
};

testResumeDownload();
