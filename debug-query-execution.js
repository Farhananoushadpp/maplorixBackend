import axios from "axios";

const debugQueryExecution = async () => {
  try {
    console.log("🔧 Debugging query execution...");

    // Test with no filters at all
    console.log("\n📋 Test 1: No filters");
    const response1 = await axios.get("http://localhost:4000/api/jobs");
    console.log(`Status: ${response1.status}`);
    console.log(
      `Jobs count: ${response1.data.data?.jobs?.length || response1.data.jobs?.length || 0}`,
    );

    // Test with empty filters
    console.log("\n📋 Test 2: Empty filters");
    const response2 = await axios.get(
      "http://localhost:4000/api/jobs?active=true&limit=100",
    );
    console.log(`Status: ${response2.status}`);
    console.log(
      `Jobs count: ${response2.data.data?.jobs?.length || response2.data.jobs?.length || 0}`,
    );

    // Test with limit only
    console.log("\n📋 Test 3: Limit only");
    const response3 = await axios.get(
      "http://localhost:4000/api/jobs?limit=100",
    );
    console.log(`Status: ${response3.status}`);
    console.log(
      `Jobs count: ${response3.data.data?.jobs?.length || response3.data.jobs?.length || 0}`,
    );

    // Check response structure
    console.log("\n📋 Response structure check:");
    const sampleResponse = response3.data;
    console.log("Response keys:", Object.keys(sampleResponse));
    console.log("Jobs count:", sampleResponse.jobs?.length || 0);

    if (sampleResponse.jobs && sampleResponse.jobs.length > 0) {
      console.log("First job postedBy:", sampleResponse.jobs[0]?.postedBy);
      console.log("Job postedBy values:", [
        ...new Set(sampleResponse.jobs.map((j) => j.postedBy)),
      ]);

      const adminJobs = sampleResponse.jobs.filter(
        (job) => job.postedBy === "admin",
      );
      console.log(`Admin jobs in response: ${adminJobs.length}`);

      if (adminJobs.length > 0) {
        console.log(
          "Admin job titles:",
          adminJobs.map((j) => j.title),
        );
      }
    }
  } catch (error) {
    console.error("❌ Debug failed:", error.response?.data || error.message);
  }
};

debugQueryExecution();
