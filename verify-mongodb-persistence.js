import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Import models
import Job from './models/Job.js';
import Application from './models/Application.js';

const comprehensiveVerification = async () => {
  console.log("🔍 COMPREHENSIVE MONGODB VERIFICATION");
  console.log("====================================\n");

  let verificationResults = {
    mongoServiceRunning: false,
    databaseConnection: false,
    correctDatabase: false,
    collectionsExist: false,
    dataPersistence: false,
    controllerLogging: false,
    sessionStorageFree: false
  };

  try {
    // 1. Check MongoDB Service Status
    console.log("1️⃣ Checking MongoDB Service Status");
    try {
      // This will work if MongoDB is accessible
      const testConnection = await mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 2000
      });
      await mongoose.connection.close();
      console.log("✅ MongoDB service is running and accessible");
      verificationResults.mongoServiceRunning = true;
    } catch (error) {
      console.log("❌ MongoDB service not accessible:", error.message);
      return;
    }

    // 2. Connect to maplorix database
    console.log("\n2️⃣ Connecting to maplorix database");
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix";
    console.log("📍 Connection URI:", mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB");
    console.log("🗄️ Database Name:", mongoose.connection.name);
    verificationResults.databaseConnection = true;

    // 3. Verify correct database
    const expectedDb = mongoURI.split("/").pop().split("?")[0];
    if (mongoose.connection.name === expectedDb) {
      console.log("✅ Connected to correct database:", mongoose.connection.name);
      verificationResults.correctDatabase = true;
    } else {
      console.log("❌ Database mismatch! Expected:", expectedDb, "Got:", mongoose.connection.name);
    }

    // 4. Check collections exist
    console.log("\n3️⃣ Checking Collections");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const hasJobsCollection = collections.some(c => c.name === 'jobs');
    const hasApplicationsCollection = collections.some(c => c.name === 'applications');
    
    console.log("📋 Available Collections:");
    collections.forEach(collection => {
      console.log("   -", collection.name);
    });
    
    if (hasJobsCollection && hasApplicationsCollection) {
      console.log("✅ Required collections exist");
      verificationResults.collectionsExist = true;
    } else {
      console.log("❌ Missing required collections");
    }

    // 5. Test data persistence with direct save
    console.log("\n4️⃣ Testing Data Persistence");
    
    // Clean up any existing test data
    await Job.deleteMany({ title: { $regex: /PERSISTENCE_TEST/i } });
    await Application.deleteMany({ fullName: { $regex: /PERSISTENCE_TEST/i } });
    
    // Create test job
    const testJob = new Job({
      title: "PERSISTENCE_TEST Job",
      company: "Test Company",
      location: "Test Location",
      type: "Full-time",
      postedBy: "admin",
      description: "Test job for persistence verification"
    });
    
    console.log("💾 Saving test job...");
    const savedJob = await testJob.save();
    console.log("✅ Job saved. ID:", savedJob._id);
    
    // Verify job exists immediately
    const verifyJob = await Job.findById(savedJob._id);
    if (verifyJob) {
      console.log("✅ Job verified in database");
    } else {
      console.log("❌ Job not found after save!");
      return;
    }
    
    // Test application persistence
    const testApp = new Application({
      fullName: "PERSISTENCE_TEST Applicant",
      email: "test@persistence.com",
      phone: "+1234567890",
      location: "Test City",
      jobRole: "Test Role",
      experience: "Entry Level"
    });
    
    console.log("💾 Saving test application...");
    const savedApp = await testApp.save();
    console.log("✅ Application saved. ID:", savedApp._id);
    
    // Verify application exists immediately
    const verifyApp = await Application.findById(savedApp._id);
    if (verifyApp) {
      console.log("✅ Application verified in database");
    } else {
      console.log("❌ Application not found after save!");
      return;
    }
    
    // 6. Test persistence across connection reset
    console.log("\n5️⃣ Testing Persistence Across Connection Reset");
    
    // Close connection
    await mongoose.connection.close();
    console.log("🔌 Connection closed");
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reconnect
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔌 Connection reopened");
    
    // Check if data still exists
    const jobsAfterReset = await Job.find({ title: { $regex: /PERSISTENCE_TEST/i } });
    const appsAfterReset = await Application.find({ fullName: { $regex: /PERSISTENCE_TEST/i } });
    
    console.log("📊 Jobs found after reset:", jobsAfterReset.length);
    console.log("📊 Applications found after reset:", appsAfterReset.length);
    
    if (jobsAfterReset.length > 0 && appsAfterReset.length > 0) {
      console.log("✅ Data persists across connection resets");
      verificationResults.dataPersistence = true;
    } else {
      console.log("❌ Data does not persist across connection resets!");
      console.log("🚨 This indicates MongoDB might be running in-memory mode");
    }

    // 7. Check controller logging implementation
    console.log("\n6️⃣ Checking Controller Logging");
    
    const jobControllerPath = './controllers/jobController.js';
    const appControllerPath = './controllers/applicationController.js';
    
    try {
      const jobControllerContent = fs.readFileSync(jobControllerPath, 'utf8');
      const appControllerContent = fs.readFileSync(appControllerPath, 'utf8');
      
      const hasJobLogging = jobControllerContent.includes('console.log') && 
                           jobControllerContent.includes('mongoose.connection.name');
      const hasAppLogging = appControllerContent.includes('console.log') && 
                           appControllerContent.includes('mongoose.connection.name');
      
      if (hasJobLogging && hasAppLogging) {
        console.log("✅ Controllers have comprehensive logging");
        verificationResults.controllerLogging = true;
      } else {
        console.log("❌ Controllers missing comprehensive logging");
      }
    } catch (error) {
      console.log("❌ Could not read controller files");
    }

    // 8. Check for sessionStorage usage in frontend
    console.log("\n7️⃣ Checking for SessionStorage Usage");
    
    const frontendDirs = [
      './frontend/src',
      './src',
      './client/src',
      './app/src'
    ];
    
    let sessionStorageFound = false;
    
    for (const dir of frontendDirs) {
      if (fs.existsSync(dir)) {
        console.log("🔍 Checking frontend directory:", dir);
        
        const checkDirectory = (currentDir) => {
          const files = fs.readdirSync(currentDir);
          
          for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
              checkDirectory(filePath);
            } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
              try {
                const content = fs.readFileSync(filePath, 'utf8');
                if (content.includes('sessionStorage')) {
                  console.log("❌ Found sessionStorage usage in:", filePath);
                  sessionStorageFound = true;
                }
              } catch (error) {
                // Skip files that can't be read
              }
            }
          }
        };
        
        checkDirectory(dir);
      }
    }
    
    if (!sessionStorageFound) {
      console.log("✅ No sessionStorage usage found");
      verificationResults.sessionStorageFree = true;
    }

    // 9. Final database statistics
    console.log("\n8️⃣ Final Database Statistics");
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    console.log("💼 Total Jobs:", totalJobs);
    console.log("📝 Total Applications:", totalApplications);
    
    // Show sample data
    const sampleJobs = await Job.find().limit(3);
    const sampleApps = await Application.find().limit(3);
    
    console.log("\n📋 Sample Jobs:");
    sampleJobs.forEach((job, index) => {
      console.log(`   ${index + 1}. ${job.title} - ${job.company}`);
    });
    
    console.log("\n📋 Sample Applications:");
    sampleApps.forEach((app, index) => {
      console.log(`   ${index + 1}. ${app.fullName} - ${app.email}`);
    });

  } catch (error) {
    console.error("❌ Verification failed:", error);
    console.error("🔍 Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    // Cleanup test data
    console.log("\n🧹 Cleaning up test data...");
    try {
      await Job.deleteMany({ title: { $regex: /PERSISTENCE_TEST/i } });
      await Application.deleteMany({ fullName: { $regex: /PERSISTENCE_TEST/i } });
      console.log("✅ Test data cleaned up");
    } catch (error) {
      console.log("❌ Cleanup failed:", error.message);
    }
    
    await mongoose.connection.close();
    
    // Results Summary
    console.log("\n🎯 VERIFICATION RESULTS");
    console.log("========================");
    Object.entries(verificationResults).forEach(([test, passed]) => {
      const status = passed ? "✅ PASS" : "❌ FAIL";
      const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`${status} ${testName}`);
    });
    
    const passedTests = Object.values(verificationResults).filter(r => r === true).length;
    const totalTests = Object.keys(verificationResults).length;
    console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log("🎉 ALL VERIFICATIONS PASSED - MongoDB persistence is working perfectly!");
    } else {
      console.log("⚠️  Some verifications failed - Address the issues above");
      
      if (!verificationResults.dataPersistence) {
        console.log("\n🚨 CRITICAL: Data persistence issue detected!");
        console.log("Possible causes:");
        console.log("- MongoDB running in-memory mode");
        console.log("- Docker container without volume mounting");
        console.log("- Test database configuration");
        console.log("\nSolutions:");
        console.log("- Check MongoDB configuration");
        console.log("- Ensure persistent storage is configured");
        console.log("- Verify you're not using a test/in-memory database");
      }
    }
    
    process.exit(0);
  }
};

// Run verification
comprehensiveVerification();
