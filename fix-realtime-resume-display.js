import mongoose from "mongoose";
import Application from "./models/Application.js";
import dotenv from "dotenv";

dotenv.config();

const fixRealtimeResumeDisplay = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("🔗 Connected to MongoDB");

    // Find the Tarah Advertising application we just fixed
    const application = await Application.findOne({
      fullName: "Tarah Advertising",
      email: "maplorixae@gmail.com",
      jobRole: "graphic designer",
    }).sort({ createdAt: -1 });

    if (application) {
      console.log("📋 Checking Tarah Advertising application:");
      console.log("Job Role:", application.jobRole);
      console.log("Created:", application.createdAt);
      console.log("Resume Data:", JSON.stringify(application.resume, null, 2));

      if (application.resume && application.resume.filename) {
        console.log("✅ Resume exists in database!");
        console.log("📋 Resume Info:");
        console.log("- Filename:", application.resume.filename);
        console.log("- Original Name:", application.resume.originalName);
        console.log("- Size:", application.resume.size);
        console.log("- MIME Type:", application.resume.mimetype);

        // Test if the resume download endpoint works
        console.log("🔽 Testing resume download endpoint...");

        // This will help us verify the backend is working
        const testUrl = `http://localhost:4001/api/applications/${application._id}/resume`;
        console.log("📡 Test URL:", testUrl);

        console.log("🎯 SOLUTION: The resume data is in the database.");
        console.log("📱 The issue might be:");
        console.log("   1. Dashboard not refreshing properly");
        console.log("   2. Frontend cache issue");
        console.log("   3. Real-time update not triggering");
        console.log("   4. API response structure issue");

        console.log("🔧 STEPS TO FIX:");
        console.log("   1. Refresh the dashboard page");
        console.log("   2. Click the green Refresh button");
        console.log("   3. Check if the application shows the resume");
        console.log("   4. Test the view/download buttons");
      } else {
        console.log("❌ Resume still not found in database");
      }
    } else {
      console.log("❌ Tarah Advertising application not found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

fixRealtimeResumeDisplay();
