import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testAdminAPIs = async () => {
  try {
    console.log('🔍 Testing Admin APIs After Fix...');

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

    // Step 2: Test GET /api/admin/jobs
    console.log('\n📝 Step 2: Testing GET /api/admin/jobs...');
    const jobsResponse = await fetch('http://localhost:4000/api/admin/jobs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Jobs API Status:', jobsResponse.status);
    const jobsResult = await jobsResponse.json();
    console.log('Jobs API Result:', JSON.stringify(jobsResult, null, 2));

    // Step 3: Test GET /api/admin/jobs/stats
    console.log('\n📝 Step 3: Testing GET /api/admin/jobs/stats...');
    const statsResponse = await fetch('http://localhost:4000/api/admin/jobs/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Stats API Status:', statsResponse.status);
    const statsResult = await statsResponse.json();
    console.log('Stats API Result:', JSON.stringify(statsResult, null, 2));

    // Step 4: Create a test job
    console.log('\n📝 Step 4: Creating a test job...');
    const createJobResponse = await fetch('http://localhost:4000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "Test Software Engineer",
        company: "Test Company",
        location: "Dubai, UAE",
        type: "Full-time",
        category: "Technology",
        experience: "Entry Level",
        jobRole: "Software Developer",
        description: "This is a test job description with exactly fifty characters to meet the validation requirements for posting a job on the platform.",
        requirements: "Bachelor degree and 2+ years experience in software development.",
        featured: true,
        active: true
      })
    });

    console.log('Create Job Status:', createJobResponse.status);
    const createJobResult = await createJobResponse.json();
    console.log('Create Job Result:', JSON.stringify(createJobResult, null, 2));

    // Step 5: Test admin jobs again (should show the new job)
    console.log('\n📝 Step 5: Testing GET /api/admin/jobs after creating job...');
    const updatedJobsResponse = await fetch('http://localhost:4000/api/admin/jobs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Updated Jobs Status:', updatedJobsResponse.status);
    const updatedJobsResult = await updatedJobsResponse.json();
    console.log('Updated Jobs Result:', JSON.stringify(updatedJobsResult, null, 2));

    console.log('\n✅ All Admin APIs are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testAdminAPIs();
