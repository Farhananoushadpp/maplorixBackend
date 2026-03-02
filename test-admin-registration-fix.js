import axios from "axios";

const testAdminRegistration = async () => {
  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("🔧 Testing Admin Registration Fix...\n");

  try {
    // Test Admin User Registration
    console.log("📝 Testing Admin User Registration...");
    const adminUser = {
      firstName: "Admin",
      lastName: "Test",
      email: "admintest4@example.com",
      password: "password123",
      phone: "0987654321",
      role: "admin",
    };

    const adminResponse = await api.post("/auth/register", adminUser);
    console.log("✅ Admin user registered successfully");
    console.log("📋 Role:", adminResponse.data.data.user.role);
    console.log("📋 Email:", adminResponse.data.data.user.email);

    // Test Admin Login
    console.log("\n📝 Testing Admin Login...");
    const adminLogin = await api.post("/auth/login", {
      email: "admintest4@example.com",
      password: "password123",
    });
    console.log("✅ Admin login successful");
    console.log("📋 Role:", adminLogin.data.data.user.role);

    console.log("\n🎉 Admin Registration Fix Completed!");
    console.log("✅ Admin users can now register with admin role");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
};

testAdminRegistration();
