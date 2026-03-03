import axios from "axios";

const searchForJob = async () => {
  try {
    console.log('🔍 Searching for job "tytuuiuityiiyyi"...');

    // Test the jobs API endpoint
    const response = await axios.get("http://localhost:4000/api/jobs", {
      params: {
        limit: 200, // Get more jobs
        sortBy: "createdAt",
        sortOrder: "desc",
        _t: Date.now(), // Cache busting
      },
    });

    console.log("📊 Response structure:");
    console.log("Response type:", typeof response.data);
    console.log("Is array:", Array.isArray(response.data));
    console.log("Response keys:", Object.keys(response.data));

    let allJobs = [];

    // Handle different response structures
    if (Array.isArray(response.data)) {
      allJobs = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      allJobs = response.data.data;
    } else if (response.data.jobs && Array.isArray(response.data.jobs)) {
      allJobs = response.data.jobs;
    } else {
      console.log("❌ Unexpected response structure");
      console.log("Response:", response.data);
      return;
    }

    console.log("📊 Total jobs returned:", allJobs.length);

    // Search for the job
    const targetJob = allJobs.find(
      (job) =>
        job.title &&
        job.title.toLowerCase().includes("tytuuiuityiiyyi".toLowerCase()),
    );

    if (targetJob) {
      console.log("✅ Found target job:");
      console.log("Title:", targetJob.title);
      console.log("Company:", targetJob.company);
      console.log("Location:", targetJob.location);
      console.log("Salary:", JSON.stringify(targetJob.salary, null, 2));
      console.log(
        "Requirements:",
        JSON.stringify(targetJob.requirements, null, 2),
      );
      console.log("Experience:", targetJob.experience);
      console.log("Created:", targetJob.createdAt);
    } else {
      console.log("❌ Job not found");

      // Show all job titles for debugging
      console.log("📋 All job titles:");
      allJobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title}`);
      });

      // Search for similar titles
      const similarJobs = allJobs.filter(
        (job) =>
          job.title &&
          (job.title.toLowerCase().includes("tytuui") ||
            job.title.toLowerCase().includes("rtyr")),
      );

      if (similarJobs.length > 0) {
        console.log("🔍 Found similar jobs:");
        similarJobs.forEach((job) => {
          console.log(`- ${job.title} (ID: ${job._id})`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Error searching for job:", error.message);
  }
};

searchForJob();
