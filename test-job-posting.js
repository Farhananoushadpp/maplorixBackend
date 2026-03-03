import axios from "axios";

const testJobPosting = async () => {
  try {
    console.log("🔧 Testing job posting...");

    const jobData = {
      title: "Test Job Posting",
      company: "Test Company",
      location: "Dubai, UAE",
      type: "Full-time",
      category: "Technology",
      experience: "Mid Level",
      description: "This is a test job posting",
      requirements: "JavaScript, React, Node.js",
      salary: {
        min: 5000,
        max: 8000,
        currency: "AED",
      },
      postedBy: "user",
      isActive: false,
      featured: false,
    };

    console.log("📝 Job data:", jobData);

    const response = await axios.post(
      "http://localhost:4000/api/jobs",
      jobData,
    );

    console.log("✅ Job posted successfully!");
    console.log("📋 Response status:", response.status);
    console.log("📋 Full response:", response.data);

    if (response.data && response.data.data) {
      console.log("📋 Job title:", response.data.data.title);
      console.log("📋 Job ID:", response.data.data._id);
    } else if (response.data && response.data.title) {
      console.log("📋 Job title:", response.data.title);
      console.log("📋 Job ID:", response.data._id);
    } else {
      console.log("📋 Response structure:", Object.keys(response.data));
    }
  } catch (error) {
    console.error("❌ Job posting failed:");
    console.error("Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
  }
};

testJobPosting();
