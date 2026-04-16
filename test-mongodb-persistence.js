import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Import models for direct database testing
import Job from './models/Job.js';
import Application from './models/Application.js';

const API_BASE_URL = 'http://localhost:4000/api';

const testMongoDBPersistence = async () => {
  console.log("🧪 MongoDB Persistence Test Suite");
  console.log("================================\n");

  const results = {
    databaseConnection: false,
    directJobSave: false,
    directApplicationSave: false,
    apiJobCreation: false,
    apiApplicationSubmission: false,
    dataPersistence: false
  };

  try {
    // Test 1: Database Connection
    console.log("1️⃣ Testing Database Connection");
    console.log("📍 Connection URI:", process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("🗄️ Database Name:", mongoose.connection.name);
    console.log("🔗 Connection State:", mongoose.connection.readyState);
    
    results.databaseConnection = true;
    console.log("");

    // Test 2: Direct Model Operations
    console.log("2️⃣ Testing Direct Model Operations");
    
    // Clean up test data
    await Job.deleteMany({ title: { $regex: /TEST/i } });
    await Application.deleteMany({ fullName: { $regex: /TEST/i } });
    
    // Test direct job save
    const testJob = new Job({
      title: "TEST Job - Direct Save",
      company: "Test Company",
      location: "Test Location",
      type: "Full-time",
      postedBy: "admin",
      description: "Test job description",
      requirements: "Test requirements"
    });
    
    console.log("💾 Testing direct job save...");
    await testJob.save();
    console.log("✅ Job saved directly. ID:", testJob._id);
    
    const verifyJob = await Job.findById(testJob._id);
    if (verifyJob) {
      console.log("✅ Direct job save verified");
      results.directJobSave = true;
    }
    
    // Test direct application save
    const testApp = new Application({
      fullName: "TEST Applicant",
      email: "test@example.com",
      phone: "+1234567890",
      location: "Test City",
      jobRole: "Test Role",
      experience: "Mid Level"
    });
    
    console.log("💾 Testing direct application save...");
    await testApp.save();
    console.log("✅ Application saved directly. ID:", testApp._id);
    
    const verifyApp = await Application.findById(testApp._id);
    if (verifyApp) {
      console.log("✅ Direct application save verified");
      results.directApplicationSave = true;
    }
    console.log("");

    // Test 3: API Operations
    console.log("3️⃣ Testing API Operations");
    
    try {
      // Test API job creation
      console.log("📤 Testing API job creation...");
      const apiJobResponse = await axios.post(`${API_BASE_URL}/jobs`, {
        title: "TEST Job - API Creation",
        company: "API Test Company",
        location: "API Test Location",
        type: "Part-time",
        postedBy: "admin",
        description: "API test job description"
      }, { timeout: 10000 });
      
      console.log("✅ API job creation successful");
      console.log("🆔 Job ID:", apiJobResponse.data.job?._id);
      results.apiJobCreation = true;
      
      // Test API application submission
      console.log("📤 Testing API application submission...");
      const appResponse = await axios.post(`${API_BASE_URL}/applications`, {
        fullName: "TEST Applicant - API",
        email: "apitest@example.com",
        phone: "+1234567891",
        location: "API Test City",
        jobRole: "API Test Role",
        experience: "Entry Level"
      }, { timeout: 10000 });
      
      console.log("✅ API application submission successful");
      console.log("🆔 Application ID:", appResponse.data._id);
      results.apiApplicationSubmission = true;
      
    } catch (apiError) {
      console.error("❌ API operation failed:", apiError.message);
      if (apiError.response) {
        console.error("📄 API Response:", apiError.response.status, apiError.response.data);
      }
    }
    console.log("");

    // Test 4: Data Persistence
    console.log("4️⃣ Testing Data Persistence");
    
    // Close and reopen connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Database connection reopened");
    
    // Check if data persists
    const jobsAfterReset = await Job.find({ title: { $regex: /TEST/i } });
    const applicationsAfterReset = await Application.find({ fullName: { $regex: /TEST/i } });
    
    console.log("📊 Jobs found after reset:", jobsAfterReset.length);
    console.log("📊 Applications found after reset:", applicationsAfterReset.length);
    
    if (jobsAfterReset.length >= 2 && applicationsAfterReset.length >= 2) {
      console.log("✅ Data persistence test passed");
      results.dataPersistence = true;
    } else {
      console.log("❌ Data persistence test failed");
    }
    console.log("");

    // Test 5: Final Database Stats
    console.log("5️⃣ Final Database Statistics");
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    console.log("💼 Total Jobs in Database:", totalJobs);
    console.log("📝 Total Applications in Database:", totalApplications);
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("📚 Available Collections:");
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("🔍 Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    // Cleanup
    console.log("\n🧹 Cleaning up test data...");
    try {
      await Job.deleteMany({ title: { $regex: /TEST/i } });
      await Application.deleteMany({ fullName: { $regex: /TEST/i } });
      console.log("✅ Test data cleaned up");
    } catch (cleanupError) {
      console.error("❌ Cleanup failed:", cleanupError.message);
    }
    
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    
    // Results Summary
    console.log("\n🎯 TEST RESULTS");
    console.log("================");
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? "✅ PASS" : "❌ FAIL";
      const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`${status} ${testName}`);
    });
    
    const passedTests = Object.values(results).filter(r => r === true).length;
    const totalTests = Object.keys(results).length;
    console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log("🎉 ALL TESTS PASSED - MongoDB persistence is working perfectly!");
    } else {
      console.log("⚠️  Some tests failed - Check the logs above for details");
    }
    
    process.exit(0);
  }
};

// Run the test
testMongoDBPersistence();
