// Diagnose feed issue - check job data structure and admin posts
import axios from "axios";

const BASE_URL = "http://localhost:4000";

console.log("🔍 Diagnosing Feed Issue...\n");

async function diagnoseJobsData() {
  try {
    console.log("📡 Fetching jobs from backend...");
    const response = await axios.get(`${BASE_URL}/api/jobs`);
    
    const jobs = response.data?.jobs || response.data || [];
    console.log(`📊 Found ${jobs.length} jobs total\n`);
    
    if (jobs.length === 0) {
      console.log("❌ No jobs found in database");
      return;
    }
    
    // Analyze each job
    console.log("🔍 Analyzing job data structure:\n");
    
    jobs.forEach((job, index) => {
      console.log(`📋 Job ${index + 1}:`);
      console.log(`   ID: ${job._id}`);
      console.log(`   Title: ${job.title || 'No title'}`);
      console.log(`   Company: ${job.company || 'No company'}`);
      console.log(`   Posted By: ${job.postedBy || 'Not specified'}`);
      console.log(`   Status: ${job.status || 'Not specified'}`);
      console.log(`   Created: ${job.createdAt || 'Not specified'}`);
      console.log(`   Source: ${job.source || 'Not specified'}`);
      console.log(`   ---`);
    });
    
    // Check for admin posts
    console.log("\n🔍 Checking for admin posts:");
    
    const adminPosts = jobs.filter(job => {
      // Different ways to identify admin posts
      return (
        job.postedBy === 'admin' ||
        job.postedBy === 'Admin' ||
        job.source === 'admin' ||
        job.source === 'Admin' ||
        job.createdBy === 'admin' ||
        job.createdBy === 'Admin' ||
        (job.postedBy && job.postedBy.toLowerCase().includes('admin'))
      );
    });
    
    console.log(`📊 Found ${adminPosts.length} admin posts out of ${jobs.length} total jobs`);
    
    if (adminPosts.length > 0) {
      console.log("\n👑 Admin Posts Details:");
      adminPosts.forEach((job, index) => {
        console.log(`   Admin Post ${index + 1}: ${job.title} (Posted by: ${job.postedBy})`);
      });
    } else {
      console.log("\n❌ No admin posts found");
      console.log("🔍 This might be the issue - all jobs might be posted by users or have no postedBy field");
    }
    
    // Check job status
    console.log("\n📊 Job Status Analysis:");
    const activeJobs = jobs.filter(job => job.status === 'active' || !job.status);
    const inactiveJobs = jobs.filter(job => job.status === 'inactive');
    const draftJobs = jobs.filter(job => job.status === 'draft');
    
    console.log(`   Active jobs: ${activeJobs.length}`);
    console.log(`   Inactive jobs: ${inactiveJobs.length}`);
    console.log(`   Draft jobs: ${draftJobs.length}`);
    
    // Check what fields are available
    console.log("\n🔍 Available Job Fields:");
    if (jobs.length > 0) {
      const sampleJob = jobs[0];
      const fields = Object.keys(sampleJob);
      console.log("   Fields:", fields.join(", "));
      
      // Check for postedBy field specifically
      if (fields.includes('postedBy')) {
        console.log("\n📊 postedBy field values:");
        const postedByValues = [...new Set(jobs.map(job => job.postedBy).filter(Boolean))];
        console.log("   Values:", postedByValues);
      }
    }
    
    // Simulate the filtering logic that might be causing issues
    console.log("\n🔍 Simulating Feed Filtering Logic:");
    
    // This is likely what's happening in the frontend
    const filteredByAdmin = jobs.filter(job => {
      // This might be the problematic logic
      return job.postedBy === 'admin'; // Only show admin posts
    });
    
    console.log(`   Jobs with postedBy='admin': ${filteredByAdmin.length}`);
    
    // Correct logic should be:
    const correctFiltered = jobs.filter(job => {
      // Show all active jobs regardless of who posted them
      return job.status === 'active' || !job.status;
    });
    
    console.log(`   All active jobs: ${correctFiltered.length}`);
    
    console.log("\n✅ Diagnosis Complete!");
    console.log("\n💡 Recommendations:");
    console.log("1. Check if jobs have postedBy field set correctly");
    console.log("2. Update frontend to show all active jobs, not just admin posts");
    console.log("3. Ensure job status is properly set");
    
  } catch (error) {
    console.error("❌ Error diagnosing jobs:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run diagnosis
diagnoseJobsData().catch(console.error);
