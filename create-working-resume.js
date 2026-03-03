import mongoose from "mongoose";
import Application from "./models/Application.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const createWorkingResumeApplication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("🔗 Connected to MongoDB");

    // Create a test application with resume
    const applicationData = {
      fullName: "Working Resume Test",
      email: "working@example.com",
      phone: "+971506507165",
      location: "Dubai, UAE",
      jobRole: "Full Stack Developer",
      experience: "Mid Level",
      expectedSalary: {
        min: 8000,
        max: 12000,
        currency: "AED",
      },
      coverLetter:
        "This is a test cover letter for a working resume demonstration.",
      resume: {
        filename: "working-resume-test.pdf",
        originalName: "Working_Resume_Test.pdf",
        mimetype: "application/pdf",
        size: 2048,
        path: "C:\\Users\\USER-ID\\CascadeProjects\\maplorixBackend\\uploads\\resumes\\working-resume-test.pdf",
      },
      status: "submitted",
      source: "website",
    };

    console.log("📤 Creating application with working resume...");
    const application = new Application(applicationData);
    await application.save();

    console.log("✅ Application created successfully!");
    console.log("🆔 Application ID:", application._id);
    console.log("📋 Resume data:", JSON.stringify(application.resume, null, 2));

    // Create the actual file
    // Ensure uploads directory exists
    const uploadsDir = path.dirname(application.resume.path);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("📁 Created uploads directory:", uploadsDir);
    }

    // Create a simple PDF file
    const pdfContent = Buffer.from(
      "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT /F1 12 Tf 72 720 Td (Working Resume Test) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 f \n0000000074 00000 f \n0000000120 00000 f \n0000000179 00000 f \n0000000224 00000 f \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n295\n%%EOF",
    );

    fs.writeFileSync(application.resume.path, pdfContent);
    console.log("✅ Resume file created on server!");

    console.log("🎉 WORKING RESUME APPLICATION CREATED!");
    console.log(
      "📱 Now you can test the resume view/download with application ID:",
      application._id,
    );
    console.log("📄 Resume file path:", application.resume.path);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createWorkingResumeApplication();
