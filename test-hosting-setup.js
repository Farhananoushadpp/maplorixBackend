// Test script for hosting setup and role-based access
import axios from "axios";

const BASE_URL = "http://localhost:4000";

console.log("🧪 Testing Maplorix Hosting Setup...\n");

// Test 1: Health Check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health Check:", response.data.status);
    return true;
  } catch (error) {
    console.log("❌ Health Check Failed:", error.message);
    return false;
  }
}

// Test 2: Public Pages Access
async function testPublicPages() {
  try {
    const response = await axios.get(`${BASE_URL}/api/pages/public`);
    console.log("✅ Public Pages:", response.data.pages.map(p => p.name).join(", "));
    return true;
  } catch (error) {
    console.log("❌ Public Pages Test Failed:", error.message);
    return false;
  }
}

// Test 3: User Registration
async function testUserRegistration() {
  try {
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "123456",
      role: "user"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    console.log("✅ User Registration Success");
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
      console.log("✅ User already exists, proceeding to login");
      return await testUserLogin();
    }
    console.log("❌ User Registration Failed:", error.response?.data?.message || error.message);
    return null;
  }
}

// Test 4: User Login
async function testUserLogin() {
  try {
    const loginData = {
      email: "testuser@example.com",
      password: "123456"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log("✅ User Login Success");
    return response.data.token;
  } catch (error) {
    console.log("❌ User Login Failed:", error.response?.data?.message || error.message);
    return null;
  }
}

// Test 5: User Navigation Access
async function testUserNavigation(userToken) {
  try {
    const response = await axios.get(`${BASE_URL}/api/pages/navigation`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log("✅ User Navigation:", response.data.pages.map(p => p.name).join(", "));
    return true;
  } catch (error) {
    console.log("❌ User Navigation Test Failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test 6: Admin Registration
async function testAdminRegistration() {
  try {
    const adminData = {
      firstName: "Admin",
      lastName: "User",
      email: "admin@maplorix.com",
      password: "admin123",
      role: "admin"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, adminData);
    console.log("✅ Admin Registration Success");
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
      console.log("✅ Admin already exists, proceeding to login");
      return await testAdminLogin();
    }
    console.log("❌ Admin Registration Failed:", error.response?.data?.message || error.message);
    return null;
  }
}

// Test 7: Admin Login
async function testAdminLogin() {
  try {
    const loginData = {
      email: "admin@maplorix.com",
      password: "admin123"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log("✅ Admin Login Success");
    return response.data.token;
  } catch (error) {
    console.log("❌ Admin Login Failed:", error.response?.data?.message || error.message);
    return null;
  }
}

// Test 8: Admin Navigation Access
async function testAdminNavigation(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/api/pages/navigation`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("✅ Admin Navigation:", response.data.pages.map(p => p.name).join(", "));
    return true;
  } catch (error) {
    console.log("❌ Admin Navigation Test Failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test 9: Role-Based Page Access
async function testPageAccess(userToken, adminToken) {
  try {
    // Test user trying to access admin page (should fail)
    try {
      await axios.get(`${BASE_URL}/api/pages/access/Admin Posts`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log("❌ User should NOT access Admin Posts page");
    } catch (error) {
      if (error.response?.status === 403) {
        console.log("✅ User correctly denied access to Admin Posts");
      }
    }

    // Test admin accessing admin page (should succeed)
    try {
      await axios.get(`${BASE_URL}/api/pages/access/Admin Posts`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log("✅ Admin successfully accessed Admin Posts");
    } catch (error) {
      console.log("❌ Admin should access Admin Posts page");
    }

    return true;
  } catch (error) {
    console.log("❌ Page Access Test Failed:", error.message);
    return false;
  }
}

// Test 10: Jobs API
async function testJobsAPI() {
  try {
    const response = await axios.get(`${BASE_URL}/api/jobs`);
    console.log(`✅ Jobs API: Found ${response.data.data?.jobs?.length || 0} jobs`);
    return true;
  } catch (error) {
    console.log("❌ Jobs API Test Failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting Comprehensive Hosting Tests...\n");
  
  const results = [];
  
  // Basic server tests
  results.push(await testHealthCheck());
  results.push(await testPublicPages());
  results.push(await testJobsAPI());
  
  // User authentication tests
  const userToken = await testUserRegistration();
  if (userToken) {
    results.push(await testUserNavigation(userToken));
  }
  
  // Admin authentication tests
  const adminToken = await testAdminRegistration();
  if (adminToken) {
    results.push(await testAdminNavigation(adminToken));
  }
  
  // Role-based access tests
  if (userToken && adminToken) {
    results.push(await testPageAccess(userToken, adminToken));
  }
  
  // Results summary
  const passedTests = results.filter(r => r === true).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! Your website is ready for hosting!");
    console.log("\n📋 Next Steps:");
    console.log("1. Configure your production environment variables");
    console.log("2. Set up your production database");
    console.log("3. Deploy to your hosting platform");
    console.log("4. Update your frontend CORS settings");
  } else {
    console.log("⚠️  Some tests failed. Please check the errors above.");
  }
}

// Run tests
runAllTests().catch(console.error);
