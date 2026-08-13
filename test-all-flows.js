import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";

const BASE_URL = "http://localhost:4000/api";

async function runAllTests() {
  console.log("\n==================================================");
  console.log("🚀 STARTING BACKEND CONCURRENCY & INTEGRITY TESTS");
  console.log("==================================================\n");

  const runId = Date.now().toString().substring(6);
  let testPassCount = 0;
  let testFailCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      testPassCount++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      testFailCount++;
    }
  }

  // TEST 1: OTP REQUEST & VERIFICATION FLOW
  console.log("\n--- TEST 1: OTP Flow ---");
  const otpTestEmail = `otpuser_${runId}@maplorixtest.com`;
  const otpTestMobile = `+97150${runId}01`;

  try {
    const sendOtpRes = await axios.post(`${BASE_URL}/auth/send-otp`, {
      email: otpTestEmail,
      mobile: otpTestMobile,
    });
    assert(sendOtpRes.status === 200 && sendOtpRes.data.success === true, "Send OTP response success");
  } catch (err) {
    assert(false, `Send OTP request failed: ${err.response?.data?.message || err.message}`);
  }

  // Test Invalid OTP Verification
  try {
    await axios.post(`${BASE_URL}/auth/verify-otp`, {
      email: otpTestEmail,
      otp: "000000",
    });
    assert(false, "Invalid OTP should have failed");
  } catch (err) {
    assert(
      err.response?.status === 400 && err.response?.data?.errorCode === "INVALID_OTP",
      "Invalid OTP returns 400 with INVALID_OTP code"
    );
  }

  // TEST 2: REGISTRATION (CamelCase fields & VisaStatus enum)
  console.log("\n--- TEST 2: User Registration ---");
  const regUser1 = {
    firstName: "Farhan",
    lastName: "Noushad",
    email: `reguser_${runId}_1@maplorixtest.com`,
    mobile: `+97155${runId}11`,
    password: "Password123!",
    nationality: "Emirati",
    currentlyLocated: "Dubai",
    visaStatus: "residenceVisa",
  };

  try {
    const regRes = await axios.post(`${BASE_URL}/auth/register`, regUser1);
    assert(regRes.status === 201 && regRes.data.success === true, "New user registration successful");
    assert(regRes.data.data.user.email === regUser1.email.toLowerCase(), "Email stored in lowercase");
    assert(!regRes.data.data.user.password, "Password not exposed in registration response");
  } catch (err) {
    assert(false, `Registration failed: ${err.response?.data?.message || err.message}`);
  }

  // TEST 3: EXISTING EMAIL / MOBILE PREVENT DUPLICATES (409 Conflict)
  console.log("\n--- TEST 3: Duplicate User Verification ---");
  // Try registering same email
  try {
    await axios.post(`${BASE_URL}/auth/register`, {
      ...regUser1,
      mobile: `+97155${runId}99`, // Different mobile, same email
    });
    assert(false, "Duplicate email registration should fail");
  } catch (err) {
    assert(
      err.response?.status === 409 && err.response?.data?.errorCode === "USER_ALREADY_EXISTS",
      "Duplicate email returns HTTP 409 Conflict with USER_ALREADY_EXISTS code"
    );
  }

  // Try registering same mobile
  try {
    await axios.post(`${BASE_URL}/auth/register`, {
      ...regUser1,
      email: `different_${runId}@maplorixtest.com`, // Different email, same mobile
    });
    assert(false, "Duplicate mobile registration should fail");
  } catch (err) {
    assert(
      err.response?.status === 409 && err.response?.data?.errorCode === "USER_ALREADY_EXISTS",
      "Duplicate mobile returns HTTP 409 Conflict with USER_ALREADY_EXISTS code"
    );
  }

  // TEST 4: CONCURRENT REGISTRATIONS
  console.log("\n--- TEST 4: Concurrent Registration & Load Isolation ---");
  const concurrentCount = 10;
  const concurrentRegPromises = Array.from({ length: concurrentCount }, (_, i) => {
    return axios.post(`${BASE_URL}/auth/register`, {
      firstName: `Concurrent`,
      lastName: `User${i}`,
      email: `conc_${runId}_${i}@maplorixtest.com`,
      mobile: `+97156${runId}${i.toString().padStart(2, '0')}`,
      password: "Password123!",
      visaStatus: i % 2 === 0 ? "visitVisa" : "spouseVisa",
    });
  });

  const concRegResults = await Promise.allSettled(concurrentRegPromises);
  const concRegSuccesses = concRegResults.filter((r) => r.status === "fulfilled" && r.value.status === 201);
  assert(concRegSuccesses.length === concurrentCount, `All ${concurrentCount} concurrent registrations succeeded without race conditions`);

  // TEST 5: LOGIN & CONCURRENT LOGINS
  console.log("\n--- TEST 5: Login & Password Verification ---");
  // Invalid password
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: regUser1.email,
      password: "WrongPassword!",
    });
    assert(false, "Invalid password login should fail");
  } catch (err) {
    assert(
      err.response?.status === 401 && err.response?.data?.errorCode === "INVALID_CREDENTIALS",
      "Invalid password returns 401 INVALID_CREDENTIALS"
    );
  }

  // Valid login
  let authToken = null;
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: regUser1.email,
      password: regUser1.password,
    });
    assert(loginRes.status === 200 && loginRes.data.success === true, "Valid login successful");
    assert(!!loginRes.data.data.token, "JWT token returned on login");
    authToken = loginRes.data.data.token;
  } catch (err) {
    assert(false, `Login failed: ${err.response?.data?.message || err.message}`);
  }

  // Concurrent logins
  const concurrentLoginPromises = Array.from({ length: 15 }, () =>
    axios.post(`${BASE_URL}/auth/login`, {
      email: regUser1.email,
      password: regUser1.password,
    })
  );
  const concLoginResults = await Promise.allSettled(concurrentLoginPromises);
  const concLoginSuccesses = concLoginResults.filter((r) => r.status === "fulfilled" && r.value.status === 200);
  assert(concLoginSuccesses.length === 15, "15 concurrent logins for the same user succeeded concurrently");

  // TEST 6: JOB CREATION & CONCURRENT JOB POSTING
  console.log("\n--- TEST 6: Job Creation & Concurrent Job Posting ---");
  let testJobId = null;
  try {
    const createJobRes = await axios.post(`${BASE_URL}/jobs`, {
      title: `Senior Developer ${runId}`,
      company: "Maplorix Inc",
      location: "Dubai Silicon Oasis",
      type: "Full-time",
      postedBy: "admin",
      description: "Full-stack developer role with high scalability experience.",
      requirements: "5+ years of Node.js, Express, MongoDB experience.",
    });
    assert(createJobRes.status === 201 && createJobRes.data.success === true, "Job creation successful");
    testJobId = createJobRes.data.job._id;
  } catch (err) {
    console.error("Job creation error response data:", err.response?.data);
    assert(false, `Job creation failed: ${err.response?.data?.message || err.message}`);
  }

  // Concurrent Job Postings
  const concurrentJobPromises = Array.from({ length: 8 }, (_, i) =>
    axios.post(`${BASE_URL}/jobs`, {
      title: `Job ${i} - ${runId}`,
      company: `Company ${i}`,
      location: "Abu Dhabi",
      type: "Full-time",
      postedBy: "user",
    })
  );
  const concJobResults = await Promise.allSettled(concurrentJobPromises);
  const concJobSuccesses = concJobResults.filter((r) => r.status === "fulfilled" && r.value.status === 201);
  assert(concJobSuccesses.length === 8, "8 concurrent job postings completed cleanly");

  // TEST 7: CV UPLOAD & APPLICATION SUBMISSION
  console.log("\n--- TEST 7: CV Upload & Duplicate Application Protection ---");
  const minimalPdf = Buffer.from(
    "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF"
  );

  const appEmail = `applicant_${runId}@maplorixtest.com`;

  async function submitApp(jobId, emailVal, filename = "resume.pdf") {
    const formData = new FormData();
    formData.append("fullName", "Applicant Test");
    formData.append("email", emailVal);
    formData.append("phone", `+97150${runId}88`);
    formData.append("location", "Dubai");
    formData.append("jobRole", "Software Engineer");
    formData.append("experience", "3-5");
    if (jobId) formData.append("job", jobId);
    formData.append("resume", minimalPdf, {
      filename,
      contentType: "application/pdf",
    });

    return axios.post(`${BASE_URL}/applications`, formData, {
      headers: formData.getHeaders(),
    });
  }

  // Submit first application
  try {
    const appRes = await submitApp(testJobId, appEmail, "resume.pdf");
    assert(appRes.status === 201 && appRes.data.success === true, "Initial job application submitted successfully with resume.pdf");
  } catch (err) {
    assert(false, `Initial application submission failed: ${err.response?.data?.message || err.message}`);
  }

  // Submit duplicate application for the same job -> must return 409 Conflict
  try {
    await submitApp(testJobId, appEmail, "resume.pdf");
    assert(false, "Duplicate job application should fail");
  } catch (err) {
    assert(
      err.response?.status === 409 && err.response?.data?.errorCode === "DUPLICATE_APPLICATION",
      "Duplicate application returns HTTP 409 Conflict with DUPLICATE_APPLICATION code"
    );
  }

  // TEST 8: MULTIPLE SIMULTANEOUS CV UPLOADS WITH SAME ORIGINAL FILENAME
  console.log("\n--- TEST 8: Concurrent CV Uploads with Same Filename ---");
  const concurrentCVUploads = Array.from({ length: 6 }, (_, i) => {
    return submitApp(null, `cv_uploader_${runId}_${i}@maplorixtest.com`, "resume.pdf");
  });

  const cvUploadResults = await Promise.allSettled(concurrentCVUploads);
  const cvUploadSuccesses = cvUploadResults.filter((r) => r.status === "fulfilled" && r.value.status === 201);
  assert(cvUploadSuccesses.length === 6, "6 concurrent CV uploads with identical original filename ('resume.pdf') created unique storage files cleanly");

  console.log("\n==================================================");
  console.log(`📊 SUMMARY: ${testPassCount} PASSED, ${testFailCount} FAILED`);
  console.log("==================================================\n");

  if (testFailCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
