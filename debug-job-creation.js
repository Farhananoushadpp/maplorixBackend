import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import models
import Job from "./models/Job.js";

const debugJobCreation = async () => {
  try {
    console.log("🔍 Debugging Job Creation...");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("✅ MongoDB Connected");

    // Test creating a job directly
    console.log("\n📝 Testing direct job creation...");

    const jobData = {
      title: "Software Engineer",
      company: "Maplorix",
      location: "Dubai",
      type: "Full-time",
      category: "Technology",
      experience: "Entry Level",
      jobRole: "Software Developer", // ← ADD THIS REQUIRED FIELD
      description:
        "This is a test job description with exactly fifty characters to meet the validation requirements.",
      requirements: "Bachelor degree and 2+ years experience.",
      postedBy: "698dc77a619cbd7acfed9aba", // Admin user ID
    };

    console.log("Job Data:", JSON.stringify(jobData, null, 2));

    try {
      const job = new Job(jobData);
      await job.save();
      console.log("✅ Job created successfully:", job._id);

      // Clean up
      await Job.findByIdAndDelete(job._id);
      console.log("🧹 Test job cleaned up");
    } catch (error) {
      console.error("❌ Direct job creation failed:", error);
      console.error("Error details:", error.message);

      if (error.name === "ValidationError") {
        console.error("Validation errors:", Object.keys(error.errors));
        Object.keys(error.errors).forEach((key) => {
          console.error(`  ${key}: ${error.errors[key].message}`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Debug failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the debug
debugJobCreation();
