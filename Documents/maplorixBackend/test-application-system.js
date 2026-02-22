import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testApplicationSystem = async () => {
  try {
    console.log('🔍 Testing Complete Application System...');

    // Step 1: Test admin login
    console.log('\n📝 Step 1: Testing admin login...');
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
      console.error('❌ Admin login failed:', loginResult.message);
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Admin token obtained');

    // Step 2: Test GET /api/admin/applications
    console.log('\n📝 Step 2: Testing GET /api/admin/applications...');
    const applicationsResponse = await fetch('http://localhost:4000/api/admin/applications?limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Applications API Status:', applicationsResponse.status);
    const applicationsResult = await applicationsResponse.json();
    console.log('Applications API Result:', JSON.stringify(applicationsResult, null, 2));

    // Step 3: Test GET /api/admin/applications/stats
    console.log('\n📝 Step 3: Testing GET /api/admin/applications/stats...');
    const statsResponse = await fetch('http://localhost:4000/api/admin/applications/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Stats API Status:', statsResponse.status);
    const statsResult = await statsResponse.json();
    console.log('Stats API Result:', JSON.stringify(statsResult, null, 2));

    // Step 4: Get a job to test application submission
    console.log('\n📝 Step 4: Getting a job for application test...');
    const jobsResponse = await fetch('http://localhost:4000/api/jobs?limit=1');
    const jobsResult = await jobsResponse.json();
    
    if (!jobsResult.success || !jobsResult.data.jobs.length) {
      console.log('❌ No jobs found to test application');
      return;
    }

    const testJob = jobsResult.data.jobs[0];
    console.log('✅ Found test job:', testJob.title);

    // Step 5: Test application submission (without file upload for simplicity)
    console.log('\n📝 Step 5: Testing application submission...');
    
    // Create FormData for application
    const formData = new FormData();
    formData.append('fullName', 'Test Candidate');
    formData.append('email', 'testcandidate@example.com');
    formData.append('phone', '+1 234 567 8900');
    formData.append('experience', '5 years of software development experience with modern web technologies.');
    formData.append('education', 'Bachelor of Science in Computer Science');
    formData.append('skills', 'JavaScript, React, Node.js, Python, MongoDB');
    formData.append('coverLetter', 'I am very interested in this position as it aligns perfectly with my skills and experience. I have been working in software development for over 5 years and have extensive experience with the technologies mentioned in the job description. I believe I would be a great addition to your team and can contribute significantly to your projects.');
    formData.append('jobId', testJob._id);

    const submitApplicationResponse = await fetch('http://localhost:4000/api/applications', {
      method: 'POST',
      body: formData
      // No Content-Type header for FormData
    });

    console.log('Submit Application Status:', submitApplicationResponse.status);
    const submitApplicationResult = await submitApplicationResponse.json();
    console.log('Submit Application Result:', JSON.stringify(submitApplicationResult, null, 2));

    // Step 6: Test admin applications again (should show the new application)
    console.log('\n📝 Step 6: Testing GET /api/admin/applications after submission...');
    const updatedApplicationsResponse = await fetch('http://localhost:4000/api/admin/applications?limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Updated Applications Status:', updatedApplicationsResponse.status);
    const updatedApplicationsResult = await updatedApplicationsResponse.json();
    console.log('Updated Applications Result:', JSON.stringify(updatedApplicationsResult, null, 2));

    console.log('\n✅ Application System Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testApplicationSystem();
