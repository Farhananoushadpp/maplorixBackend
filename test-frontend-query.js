import axios from "axios";

const testFrontendQuery = async () => {
  try {
    console.log("🔧 Testing exact frontend query...");

    // This is the exact query the frontend uses for feed
    const feedResponse = await axios.get(
      "http://localhost:4000/api/jobs?status=active&limit=100&sortBy=createdAt&sortOrder=desc",
    );
    console.log("📋 Feed query response status:", feedResponse.status);
    console.log("📋 Feed response structure:", Object.keys(feedResponse.data));
    console.log(
      "📋 Feed jobs count:",
      feedResponse.data.data?.jobs?.length ||
        feedResponse.data.jobs?.length ||
        0,
    );

    // Test without filters
    const allResponse = await axios.get(
      "http://localhost:4000/api/jobs?limit=100",
    );
    console.log("📋 All jobs query response status:", allResponse.status);
    console.log(
      "📋 All jobs response structure:",
      Object.keys(allResponse.data),
    );
    console.log(
      "📋 All jobs count:",
      allResponse.data.data?.jobs?.length || allResponse.data.jobs?.length || 0,
    );

    // Test with active=false to see if admin jobs are there
    const inactiveResponse = await axios.get(
      "http://localhost:4000/api/jobs?active=false&limit=100",
    );
    console.log(
      "📋 Inactive jobs count:",
      inactiveResponse.data.data?.jobs?.length ||
        inactiveResponse.data.jobs?.length ||
        0,
    );

    // Test with no active filter
    const noFilterResponse = await axios.get(
      "http://localhost:4000/api/jobs?&limit=100",
    );
    console.log(
      "📋 No filter jobs count:",
      noFilterResponse.data.data?.jobs?.length ||
        noFilterResponse.data.jobs?.length ||
        0,
    );

    // Look for admin jobs in all responses
    const allJobs = allResponse.data.data?.jobs || allResponse.data.jobs || [];
    if (Array.isArray(allJobs)) {
      const adminJobs = allJobs.filter((job) => job.postedBy === "admin");

      console.log(`\n📋 Admin jobs found in all jobs: ${adminJobs.length}`);
      if (adminJobs.length > 0) {
        adminJobs.forEach((job, index) => {
          console.log(
            `  Admin Job ${index + 1}: ${job.title} (isActive: ${job.isActive})`,
          );
        });
      }
    } else {
      console.log("❌ allJobs is not an array:", typeof allJobs);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
};

testFrontendQuery();
