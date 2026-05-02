import axios from "axios";
import FormData from "form-data";

// Test concurrent user load
async function testConcurrentUsers() {
  console.log("Testing concurrent user load...");

  const BASE_URL = "http://localhost:4000/api";
  const concurrentUsers = 50;
  const requestsPerUser = 5;

  // Create test users data
  const testUsers = Array.from({ length: concurrentUsers }, (_, i) => ({
    email: `user${i}@test.com`,
    password: "password123",
    fullName: `Test User ${i}`,
    phone: `+97150${1000000 + i}`,
    location: "Dubai, UAE",
  }));

  console.log(
    `Testing with ${concurrentUsers} concurrent users, ${requestsPerUser} requests each`,
  );

  const results = {
    successful: 0,
    failed: 0,
    errors: [],
    responseTimes: [],
  };

  const startTime = Date.now();

  // Test concurrent requests
  const promises = testUsers.flatMap((user, userIndex) =>
    Array.from({ length: requestsPerUser }, async (_, requestIndex) => {
      try {
        const requestStart = Date.now();

        // Test different endpoints
        const endpoints = ["/jobs", "/health", "/auth/login"];

        const endpoint = endpoints[requestIndex % endpoints.length];
        let response;

        if (endpoint === "/auth/login") {
          // Test login
          response = await axios.post(`${BASE_URL}${endpoint}`, {
            email: user.email,
            password: user.password,
          });
        } else if (endpoint === "/jobs") {
          // Test jobs endpoint
          response = await axios.get(`${BASE_URL}${endpoint}`);
        } else {
          // Test health endpoint
          response = await axios.get(`${BASE_URL}${endpoint}`);
        }

        const requestTime = Date.now() - requestStart;
        results.responseTimes.push(requestTime);
        results.successful++;

        console.log(
          `User ${userIndex}, Request ${requestIndex}: ${endpoint} - ${response.status} (${requestTime}ms)`,
        );
      } catch (error) {
        results.failed++;
        results.errors.push({
          user: userIndex,
          request: requestIndex,
          error: error.response?.data?.message || error.message,
          status: error.response?.status,
        });

        console.log(
          `User ${userIndex}, Request ${requestIndex}: FAILED - ${error.response?.status || "Network Error"}`,
        );
      }
    }),
  );

  // Wait for all requests to complete
  await Promise.allSettled(promises);

  const totalTime = Date.now() - startTime;

  // Calculate statistics
  const avgResponseTime =
    results.responseTimes.length > 0
      ? results.responseTimes.reduce((a, b) => a + b, 0) /
        results.responseTimes.length
      : 0;

  const maxResponseTime =
    results.responseTimes.length > 0 ? Math.max(...results.responseTimes) : 0;

  const minResponseTime =
    results.responseTimes.length > 0 ? Math.min(...results.responseTimes) : 0;

  console.log("\n=== LOAD TEST RESULTS ===");
  console.log(`Total Requests: ${concurrentUsers * requestsPerUser}`);
  console.log(`Successful: ${results.successful}`);
  console.log(`Failed: ${results.failed}`);
  console.log(
    `Success Rate: ${((results.successful / (concurrentUsers * requestsPerUser)) * 100).toFixed(2)}%`,
  );
  console.log(`Total Time: ${totalTime}ms`);
  console.log(
    `Requests/Second: ${((concurrentUsers * requestsPerUser) / (totalTime / 1000)).toFixed(2)}`,
  );
  console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`Min Response Time: ${minResponseTime}ms`);
  console.log(`Max Response Time: ${maxResponseTime}ms`);

  if (results.errors.length > 0) {
    console.log("\n=== ERRORS ===");
    results.errors.slice(0, 10).forEach((error) => {
      console.log(
        `User ${error.user}, Request ${error.request}: ${error.error} (${error.status})`,
      );
    });

    if (results.errors.length > 10) {
      console.log(`... and ${results.errors.length - 10} more errors`);
    }
  }

  // Test application submission under load
  console.log("\n=== TESTING APPLICATION SUBMISSIONS ===");
  await testApplicationSubmissions();
}

async function testApplicationSubmissions() {
  const concurrentApplications = 10;
  const BASE_URL = "http://localhost:4000/api";

  const applications = Array.from(
    { length: concurrentApplications },
    (_, i) => ({
      fullName: `Applicant ${i}`,
      email: `applicant${i}@test.com`,
      phone: `+97150${2000000 + i}`,
      location: "Dubai, UAE",
      jobRole: "Software Developer",
      experience: "Entry Level",
      expectedSalary: "5000",
      currency: "AED",
      coverLetter: `I am interested in this position. Application ${i}.`,
      source: "website",
    }),
  );

  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  const promises = applications.map(async (app, index) => {
    try {
      const formData = new FormData();

      // Add all application fields
      Object.keys(app).forEach((key) => {
        formData.append(key, app[key]);
      });

      // Create a minimal PDF for testing
      const minimalPdf = Buffer.from(
        "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF",
      );

      formData.append("resume", minimalPdf, {
        filename: `resume-${index}.pdf`,
        contentType: "application/pdf",
      });

      const response = await axios.post(`${BASE_URL}/applications`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000,
      });

      results.successful++;
      console.log(`Application ${index}: SUCCESS - ${response.status}`);
    } catch (error) {
      results.failed++;
      results.errors.push({
        application: index,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      });

      console.log(
        `Application ${index}: FAILED - ${error.response?.status || "Network Error"}`,
      );
    }
  });

  await Promise.allSettled(promises);

  console.log(`\nApplication Submissions:`);
  console.log(`Successful: ${results.successful}`);
  console.log(`Failed: ${results.failed}`);
  console.log(
    `Success Rate: ${((results.successful / concurrentApplications) * 100).toFixed(2)}%`,
  );

  if (results.errors.length > 0) {
    console.log("\nApplication Errors:");
    results.errors.forEach((error) => {
      console.log(
        `Application ${error.application}: ${error.error} (${error.status})`,
      );
    });
  }
}

// Run the test
testConcurrentUsers().catch(console.error);
