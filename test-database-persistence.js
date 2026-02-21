import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Import models for direct database testing
import Job from './models/Job.js';
import Application from './models/Application.js';

const API_BASE_URL = 'http://localhost:4000/api';

const testDatabasePersistence = async () => {
  console.log("🧪 MongoDB Persistence Testing Tool");
  console.log("=====================================\n");

  try {
    // Test 1: Database Connection
    console.log("1️⃣ Testing Database Connection");
    console.log("📍 Connection URI:", process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("🗄️ Database Name:", mongoose.connection.name);
    console.log("🔗 Connection State:", mongoose.connection.readyState);
    console.log("");

    // Test 2: Direct Database Operations
    console.log("2️⃣ Testing Direct Database Operations");
    
    // Clean up any test data
    await Job.deleteMany({ title: { $regex: /Test Job/i } });
    await Application.deleteMany({ fullName: { $regex: /Test Applicant/i } });
    
    // Create a test job directly in database
    const testJob = new Job({
      title: "Test Job for Persistence",
      company: "Test Company",
      location: "Test Location",
      type: "Full-time",
      postedBy: "admin",
      description: "This is a test job to verify database persistence",
      requirements: "Test requirements"
    });
    
    console.log("💾 Saving test job directly to database...");
    await testJob.save();
    console.log("✅ Test job saved directly. ID:", testJob._id);
    
    // Verify the job exists
    const verifyJob = await Job.findById(testJob._id);
    if (verifyJob) {
      console.log("✅ Direct database save verified: Job found in database");
    } else {
      console.log("❌ Direct database save failed: Job not found");
    }
    console.log("");

    // Test 3: API Operations
    console.log("3️⃣ Testing API Operations");
    
    // Test API Job Creation
    console.log("🔧 Testing API Job Creation...");
    try {
      const apiJobResponse = await axios.post(`${API_BASE_URL}/jobs`, {
        title: "API Test Job",
        company: "API Test Company", 
        location: "API Test Location",
        type: "Part-time",
        postedBy: "admin",
        description: "This job was created via API to test persistence"
      });
      
      console.log("✅ API job creation successful");
      console.log("🆔 API Job ID:", apiJobResponse.data.job._id);
      
      // Verify API job exists in database
      const apiJobInDB = await Job.findById(apiJobResponse.data.job._id);
      if (apiJobInDB) {
        console.log("✅ API job verified in database");
      } else {
        console.log("❌ API job NOT found in database - PERSISTENCE ISSUE!");
      }
      
    } catch (apiError) {
      console.error("❌ API job creation failed:", apiError.message);
    }
    console.log("");

    // Test 4: Application Submission
    console.log("4️⃣ Testing Application Submission");
    
    try {
      const applicationData = {
        fullName: "Test Applicant",
        email: "test@example.com",
        phone: "+1234567890",
        location: "Test City",
        jobRole: "Test Role",
        experience: "Mid Level",
        skills: "JavaScript, React, Node.js",
        currentCompany: "Test Current Company",
        currentDesignation: "Test Position"
      };
      
      const appResponse = await axios.post(`${API_BASE_URL}/applications`, applicationData);
      console.log("✅ Application submission successful");
      console.log("🆔 Application ID:", appResponseResponse?.data?._id || 'No ID returned');
      
      // Verify application exists in database
      if (appResponse.data._id) {
        const appInDB = await Application.findById(appResponse.data._id);
        if (appInDB) {
          console.log("✅ Application verified in database");
        } else {
          console.log("❌ Application NOT found in database - PERSISTENCE ISSUE!");
        }
      }
      
    } catch (appError) {
      console.error("❌ Application submission failed:", appError.message);
    }
    console.log("");

    // Test 5: Data Persistence After Restart Simulation
    console.log("5️⃣ Testing Data Persistence (Simulating Restart)");
    
    // Close and reopen connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    
    // Reconnect
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Database connection reopened");
    console.log("🗄️ Database Name:", mongoose.connection.name);
    
    // Check if data still exists
    const jobsAfterReconnect = await Job.find({
      $or: [
        { title: { $regex: /Test Job/i } },
        { title: { $regex: /API Test Job/i } }
      ]
    });
    
    const applicationsAfterReconnect = await Application.find({
      fullName: { $regex: /Test Applicant/i }
    });
    
    console.log("📊 Jobs found after reconnect:", jobsAfterReconnect.length);
    console.log("📊 Applications found after reconnect:", applicationsAfterReconnect.length);
    
    jobsAfterReconnect.forEach(job => {
      console.log(`   💼 ${job.title} (${job._id})`);
    });
    
    applicationsAfterReconnect.forEach(app => {
      console.log(`   📝 ${app.fullName} - ${app.email} (${app._id})`);
    });
    
    if (jobsAfterReconnect.length > 0 && applicationsAfterReconnect.length > 0) {
      console.log("✅ Data persistence test PASSED");
    } else {
      console.log("❌ Data persistence test FAILED");
    }
    console.log("");

    // Test 6: MongoDB Compass Verification
    console.log("6️⃣ MongoDB Compass Verification Instructions");
    console.log("📋 To verify in MongoDB Compass:");
    console.log("   1. Open MongoDB Compass");
    console.log("   2. Connect to: mongodb://localhost:27017");
    console.log("   3. Select database:", mongoose.connection.name);
    console.log("   4. Check collections:");
    console.log("      - jobs (should contain test jobs)");
    console.log("      - applications (should contain test applications)");
    console.log("   5. Look for documents with:");
    console.log("      - 'Test Job for Persistence'");
    console.log("      - 'API Test Job'");
    console.log("      - 'Test Applicant'");
    console.log("");

    // Test 7: Collection Statistics
    console.log("7️⃣ Collection Statistics");
    const db = mongoose.connection.db;
    
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    
    console.log("💼 Total Jobs in Database:", jobCount);
    console.log("📝 Total Applications in Database:", applicationCount);
    
    const collections = await db.listCollections().toArray();
    console.log("📚 Available Collections:");
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    console.log("");

    // Cleanup test data
    console.log("8️⃣ Cleaning Up Test Data");
    await Job.deleteMany({ title: { $regex: /Test Job/i } });
    await Application.deleteMany({ fullName: { $regex: /Test Applicant/i } });
    console.log("🧹 Test data cleaned up");
    console.log("");

    console.log("🎉 Database Persistence Testing Complete!");
    console.log("=====================================");
    
    if (jobsAfterReconnect.length > 0 && applicationsAfterReconnect.length > 0) {
      console.log("✅ ALL TESTS PASSED - Your database persistence is working correctly!");
    } else {
      console.log("❌ TESTS FAILED - There are persistence issues that need to be addressed");
    }

  } catch (error) {
    console.error("❌ Testing failed:", error);
    console.error("🔍 Error Details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Run the test
testDatabasePersistence();
