import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const debugJobPost = async () => {
  try {
    console.log('🔍 Debugging Job Post Issue...');
    
    // Step 1: Test login
    console.log('\n📝 Step 1: Testing login...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'maplorixae@gmail.com',
        password: 'maplorixDXB'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.message);
      return;
    }
    
    const token = loginResult.data.token;
    console.log('✅ Token obtained');
    
    // Step 2: Test job post with detailed error logging
    console.log('\n📝 Step 2: Testing job post...');
    
    const jobData = {
      title: "Software Engineer",
      company: "Maplorix Company",
      location: "Dubai, UAE",
      type: "Full-time",
      category: "Technology",
      experience: "Entry Level",
      jobRole: "Software Developer",
      description: "We are looking for a talented software engineer to join our growing team. This role involves developing innovative web applications using modern technologies like React and Node.js. The ideal candidate will have experience with full-stack development and be passionate about creating amazing user experiences.",
      requirements: "Bachelor degree in Computer Science and 2+ years of experience with web development.",
      salary: {
        min: 5000,
        max: 8000,
        currency: "USD"
      },
      applicationDeadline: "2024-03-15",
      featured: true,
      active: true
    };
    
    console.log('Job Data:', JSON.stringify(jobData, null, 2));
    
    const jobResponse = await fetch('http://localhost:4000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    
    console.log('Job Post Status:', jobResponse.status);
    console.log('Job Post Headers:', Object.fromEntries(jobResponse.headers.entries()));
    
    const jobResult = await jobResponse.json();
    console.log('Job Post Response:', JSON.stringify(jobResult, null, 2));
    
    if (jobResult.success) {
      console.log('✅ Job posted successfully!');
    } else {
      console.error('❌ Job posting failed:', jobResult.message);
      
      // Step 3: Test with minimal data
      console.log('\n📝 Step 3: Testing with minimal data...');
      const minimalJobData = {
        title: "Software Engineer",
        company: "Maplorix",
        location: "Dubai",
        type: "Full-time",
        category: "Technology",
        experience: "Entry Level",
        jobRole: "Developer",
        description: "We are looking for a software engineer to join our team and develop web applications using modern technologies.",
        requirements: "Bachelor degree and 2+ years experience in software development."
      };
      
      const minimalResponse = await fetch('http://localhost:4000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(minimalJobData)
      });
      
      const minimalResult = await minimalResponse.json();
      console.log('Minimal Job Status:', minimalResponse.status);
      console.log('Minimal Job Response:', JSON.stringify(minimalResult, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

debugJobPost();
