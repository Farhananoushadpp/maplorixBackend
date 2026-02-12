import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testPostJobAPI = async () => {
  try {
    console.log("🔍 Testing Post Job API...");

    // Step 1: Login to get token
    console.log("\n📝 Step 1: Login to get token...");
    const loginResponse = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "maplorixae@gmail.com",
        password: "maplorixDXB",
      }),
    });

    const loginResult = await loginResponse.json();
    console.log("Login Status:", loginResponse.status);
    console.log("Login Response:", loginResult);

    if (!loginResult.success) {
      console.error("❌ Login failed:", loginResult.message);
      return;
    }

    const token = loginResult.data.token;
    console.log("✅ Token obtained:", token.substring(0, 50) + "...");

    // Step 2: Test Post Job with valid data
    console.log("\n📝 Step 2: Testing Post Job...");

    const jobData = {
      title: "Senior Software Engineer",
      company: "Maplorix Company",
      location: "Dubai, UAE",
      type: "Full-time",
      category: "Technology",
      experience: "Senior Level",
      jobRole: "Senior Software Developer", // ← ADD THIS REQUIRED FIELD
      description:
        "We are looking for a Senior Software Engineer to join our dynamic team. This role involves developing scalable web applications, mentoring junior developers, and contributing to architectural decisions. The ideal candidate will have strong experience in modern web technologies and a passion for creating innovative solutions that solve real business problems.",
      requirements:
        "Bachelor's degree in Computer Science or related field, 5+ years of software development experience, strong proficiency in JavaScript/TypeScript, experience with React and Node.js, knowledge of cloud platforms (AWS/Azure), excellent problem-solving skills, and strong communication abilities.",
      salary: {
        min: 8000,
        max: 12000,
        currency: "USD",
      },
      applicationDeadline: "2024-03-15",
      featured: true,
      active: true,
    };

    console.log("Job Data:", JSON.stringify(jobData, null, 2));

    const jobResponse = await fetch("http://localhost:4000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    const jobResult = await jobResponse.json();
    console.log("Job Post Status:", jobResponse.status);
    console.log("Job Post Response:", JSON.stringify(jobResult, null, 2));

    if (jobResult.success) {
      console.log("✅ Job posted successfully!");
      console.log("Job ID:", jobResult.data.job._id);
    } else {
      console.error("❌ Job posting failed:", jobResult.message);

      // Test with minimal data if validation fails
      console.log("\n📝 Step 3: Testing with minimal data...");

      const minimalJobData = {
        title: "Software Engineer",
        company: "Maplorix",
        location: "Dubai",
        type: "Full-time",
        category: "Technology",
        experience: "Entry Level",
        jobRole: "Software Developer",
        description:
          "This is a test job description with exactly fifty characters to meet the validation requirements for posting a job on the platform.",
        requirements:
          "Bachelor degree and 2+ years experience in software development.",
      };

      const minimalResponse = await fetch("http://localhost:4000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(minimalJobData),
      });

      const minimalResult = await minimalResponse.json();
      console.log("Minimal Job Post Status:", minimalResponse.status);
      console.log(
        "Minimal Job Post Response:",
        JSON.stringify(minimalResult, null, 2),
      );

      if (minimalResult.success) {
        console.log("✅ Minimal job posted successfully!");
      } else {
        console.error(
          "❌ Even minimal job posting failed:",
          minimalResult.message,
        );
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Run the test
testPostJobAPI();
