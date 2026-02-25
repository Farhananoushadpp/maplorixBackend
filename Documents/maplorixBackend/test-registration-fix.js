// Test registration fix for user role
import axios from "axios";

const BASE_URL = "http://localhost:4000";

console.log("🧪 Testing Registration Fix...\n");

async function testUserRegistration() {
  try {
    console.log("📝 Testing user registration with 'user' role...");
    
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "123456",
      role: "user"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    console.log("✅ Registration successful!");
    console.log("📋 Response:", response.data);
    console.log("🎫 Token:", response.data.token ? "Generated" : "Missing");
    
    return true;
  } catch (error) {
    console.log("❌ Registration failed:");
    console.log("📄 Status:", error.response?.status);
    console.log("📝 Message:", error.response?.data?.message || error.message);
    
    if (error.response?.data) {
      console.log("📊 Full error data:", JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

async function testRegistrationWithoutRole() {
  try {
    console.log("\n📝 Testing registration without specifying role (should default to 'user')...");
    
    const userData = {
      firstName: "Test",
      lastName: "User2",
      email: "testuser2@example.com",
      password: "123456"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    console.log("✅ Registration successful!");
    console.log("📋 Response:", response.data);
    console.log("👤 User role:", response.data.user?.role || "Not specified");
    
    return true;
  } catch (error) {
    console.log("❌ Registration failed:");
    console.log("📄 Status:", error.response?.status);
    console.log("📝 Message:", error.response?.data?.message || error.message);
    
    return false;
  }
}

async function testInvalidRole() {
  try {
    console.log("\n📝 Testing registration with invalid role (should fail)...");
    
    const userData = {
      firstName: "Test",
      lastName: "User3",
      email: "testuser3@example.com",
      password: "123456",
      role: "invalid_role"
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    console.log("❌ This should have failed but didn't!");
    console.log("📋 Response:", response.data);
    
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log("✅ Correctly rejected invalid role");
      console.log("📝 Message:", error.response?.data?.message);
      return true;
    } else {
      console.log("❌ Unexpected error:", error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log("🚀 Starting Registration Tests...\n");
  
  const results = [];
  
  results.push(await testUserRegistration());
  results.push(await testRegistrationWithoutRole());
  results.push(await testInvalidRole());
  
  const passedTests = results.filter(r => r === true).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! Registration fix is working!");
    console.log("\n✅ What was fixed:");
    console.log("   - Added 'user' role to validation");
    console.log("   - Added 'General' department to validation");
    console.log("   - Registration now works for regular users");
  } else {
    console.log("⚠️  Some tests failed. Please check the errors above.");
  }
}

// Run tests
runTests().catch(console.error);
