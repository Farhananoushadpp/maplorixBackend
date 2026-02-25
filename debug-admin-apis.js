import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const debugAdminAPIs = async () => {
  try {
    console.log('🔍 Debugging Admin APIs...');

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
    console.log('Login Result:', JSON.stringify(loginResult, null, 2));

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

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

debugAdminAPIs();
