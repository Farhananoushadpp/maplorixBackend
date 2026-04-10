// Test frontend API calls to debug the 0 jobs issue
import axios from "axios";

const BASE_URL = "http://localhost:4000";

console.log("🧪 Testing Frontend API Calls...\n");

async function testJobsAPI() {
  try {
    console.log("📡 Testing /api/jobs endpoint...");
    
    // Test 1: Basic jobs API
    const response1 = await axios.get(`${BASE_URL}/api/jobs`);
    console.log("✅ Basic /api/jobs:");
    console.log(`   Status: ${response1.status}`);
    console.log(`   Data type: ${typeof response1.data}`);
    console.log(`   Has jobs array: ${!!response1.data.jobs}`);
    console.log(`   Jobs count: ${response1.data.jobs?.length || 0}`);
    console.log(`   Direct data length: ${Array.isArray(response1.data) ? response1.data.length : 'Not an array'}`);
    
    // Test 2: Jobs with status filter
    const response2 = await axios.get(`${BASE_URL}/api/jobs?status=active`);
    console.log("\n✅ /api/jobs?status=active:");
    console.log(`   Status: ${response2.status}`);
    console.log(`   Data type: ${typeof response2.data}`);
    console.log(`   Has jobs array: ${!!response2.data.jobs}`);
    console.log(`   Jobs count: ${response2.data.jobs?.length || 0}`);
    
    // Test 3: Jobs with limit
    const response3 = await axios.get(`${BASE_URL}/api/jobs?limit=10`);
    console.log("\n✅ /api/jobs?limit=10:");
    console.log(`   Status: ${response3.status}`);
    console.log(`   Jobs count: ${response3.data.jobs?.length || 0}`);
    
    // Test 4: Simulate frontend API service
    console.log("\n🔍 Simulating frontend API service...");
    
    // This is probably what the frontend api.js is doing
    const apiResponse = await axios.get(`${BASE_URL}/api/jobs`);
    
    // Check different ways the frontend might be accessing the data
    console.log("📊 Data access patterns:");
    console.log(`   response.data.jobs: ${apiResponse.data.jobs?.length || 0}`);
    console.log(`   response.data: ${Array.isArray(apiResponse.data) ? apiResponse.data.length : 'Not an array'}`);
    console.log(`   response.data.data: ${apiResponse.data.data?.length || 0}`);
    
    // Test the exact pattern from frontend-integration/api.js
    const frontendData = apiResponse.data?.jobs || apiResponse.data || [];
    console.log(`   Frontend pattern result: ${frontendData.length} jobs`);
    
    // Show sample job structure
    if (frontendData.length > 0) {
      console.log("\n📋 Sample job structure:");
      const sampleJob = frontendData[0];
      Object.keys(sampleJob).forEach(key => {
        console.log(`   ${key}: ${typeof sampleJob[key]} = ${sampleJob[key]}`);
      });
    }
    
    console.log("\n✅ API Tests Complete!");
    console.log("\n💡 If frontend shows 0 jobs, the issue is likely:");
    console.log("1. Frontend is accessing wrong data property");
    console.log("2. Frontend has filtering logic removing all jobs");
    console.log("3. Frontend API service has different endpoint");
    
  } catch (error) {
    console.error("❌ API Test Failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run tests
testJobsAPI().catch(console.error);
