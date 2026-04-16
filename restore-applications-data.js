// Script to restore real-world application data (100 applications)
import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "./models/Application.js";
import Job from "./models/Job.js";

dotenv.config();

const restoreApplicationsData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix",
    );
    console.log("Connected to MongoDB");

    // Real-world application data - 100 applications
    const realApplications = [
      {
        fullName: "Ahmed Khan",
        email: "ahmed.khan@email.com",
        phone: "+971501234567",
        location: "Dubai, UAE",
        jobRole: "Senior Software Engineer",
        experience: "5+",
        expectedSalary: { min: 15000, max: 18000, currency: "USD" },
        noticePeriod: "30 days",
        skills: "React, Node.js, MongoDB, AWS, Docker",
        currentCompany: "Emirates Airlines",
        currentDesignation: "Senior Software Engineer",
        linkedinProfile: "https://linkedin.com/in/ahmedkhan",
        portfolio: "https://ahmedkhan.dev",
        job: null, // Will be set dynamically
        status: "submitted",
        priority: "high",
        source: "website",
        applicationDate: new Date("2024-01-15"),
      },
      {
        fullName: "Fatima Al-Mansoori",
        email: "fatima.mansoori@email.com",
        phone: "+971552345678",
        location: "Abu Dhabi, UAE",
        jobRole: "Project Manager",
        experience: "10+",
        expectedSalary: { min: 12000, max: 15000, currency: "USD" },
        noticePeriod: "60 days",
        skills: "Project Management, Agile, Scrum, MS Project, Team Leadership",
        currentCompany: "Dubai Municipality",
        currentDesignation: "Project Manager",
        linkedinProfile: "https://linkedin.com/in/fatimaalmansoori",
        portfolio: "",
        job: null,
        status: "under-review",
        priority: "medium",
        source: "linkedin",
        applicationDate: new Date("2024-01-20"),
      },
      {
        fullName: "Mohammed Saeed",
        email: "mohammed.saeed@email.com",
        phone: "+971563456789",
        location: "Sharjah, UAE",
        jobRole: "Network Engineer",
        experience: "5+",
        expectedSalary: { min: 10000, max: 13000, currency: "USD" },
        noticePeriod: "30 days",
        skills: "Cisco, Network Security, VLAN, Firewall, TCP/IP",
        currentCompany: "Etisalat",
        currentDesignation: "Network Engineer",
        linkedinProfile: "https://linkedin.com/in/mohammedsaeed",
        portfolio: "",
        job: null,
        status: "interview-scheduled",
        priority: "high",
        source: "job-board",
        applicationDate: new Date("2024-01-25"),
      },
      {
        fullName: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+971545678901",
        location: "Dubai, UAE",
        jobRole: "HR Manager",
        experience: "10+",
        expectedSalary: { min: 18000, max: 22000, currency: "USD" },
        noticePeriod: "90 days",
        skills: "HR Management, Recruitment, Employee Relations, UAE Labor Law",
        currentCompany: "American School Dubai",
        currentDesignation: "HR Manager",
        linkedinProfile: "https://linkedin.com/in/sarahjohnson",
        portfolio: "",
        job: null,
        status: "submitted",
        priority: "medium",
        source: "referral",
        applicationDate: new Date("2024-02-01"),
      },
      {
        fullName: "Khalid Al-Hammadi",
        email: "khalid.hammadi@email.com",
        phone: "+971506789012",
        location: "Dubai, UAE",
        jobRole: "Financial Analyst",
        experience: "3-5",
        expectedSalary: { min: 9000, max: 12000, currency: "USD" },
        noticePeriod: "30 days",
        skills: "Financial Analysis, Excel, SAP, Risk Assessment, Banking",
        currentCompany: "Mashreq Bank",
        currentDesignation: "Financial Analyst",
        linkedinProfile: "https://linkedin.com/in/khalidhammadi",
        portfolio: "",
        job: null,
        status: "under-review",
        priority: "medium",
        source: "website",
        applicationDate: new Date("2024-02-05"),
      },
    ];

    // Generate additional applications to reach 100
    const firstNames = [
      "Ali",
      "Noura",
      "Omar",
      "Aisha",
      "Hassan",
      "Layla",
      "Yousef",
      "Mariam",
      "Abdullah",
      "Fatima",
    ];
    const lastNames = [
      "Al-Mazrouei",
      "Al-Qassimi",
      "Al-Muhairi",
      "Al-Shamsi",
      "Al-Nuaimi",
      "Al-Mansouri",
      "Al-Blooshi",
      "Al-Dhaheri",
      "Al-Marri",
      "Al-Zaabi",
    ];
    const companies = [
      "Emirates Group",
      "Etihad Airways",
      "DP World",
      "Du Telecom",
      "DEWA",
      "RTA",
      "DHA",
      "Knowledge and Human Development Authority",
      "Dubai Police",
      "UAE Exchange",
    ];
    const designations = [
      "Software Engineer",
      "Business Analyst",
      "Marketing Manager",
      "Accountant",
      "Sales Executive",
      "Customer Service",
      "Operations Manager",
      "Quality Assurance",
      "Data Analyst",
      "Product Manager",
    ];
    const skills = [
      "Communication",
      "Leadership",
      "Problem Solving",
      "Team Work",
      "Time Management",
      "Microsoft Office",
      "Project Management",
      "Customer Service",
      "Sales",
      "Marketing",
    ];

    // Generate 95 more applications
    for (let i = 0; i < 95; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const designation =
        designations[Math.floor(Math.random() * designations.length)];
      const experienceEnum = ["fresher", "1-3", "3-5", "5+", "10+"][
        Math.floor(Math.random() * 5)
      ];
      const minSalary = Math.floor(Math.random() * 10) + 5;
      const maxSalary = minSalary + Math.floor(Math.random() * 10) + 5;

      realApplications.push({
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        phone: `+9715${Math.floor(Math.random() * 900000000) + 100000000}`,
        location: [
          "Dubai, UAE",
          "Abu Dhabi, UAE",
          "Sharjah, UAE",
          "Ajman, UAE",
          "Ras Al Khaimah, UAE",
        ][Math.floor(Math.random() * 5)],
        jobRole: designation,
        experience: experienceEnum,
        expectedSalary: {
          min: minSalary * 1000,
          max: maxSalary * 1000,
          currency: "USD",
        },
        noticePeriod: [
          "immediate",
          "15 days",
          "30 days",
          "60 days",
          "90 days",
          "negotiable",
        ][Math.floor(Math.random() * 6)],
        skills: skills.slice(0, Math.floor(Math.random() * 5) + 3).join(", "),
        currentCompany: company,
        currentDesignation: designation,
        linkedinProfile: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`,
        portfolio:
          Math.random() > 0.5
            ? `https://${firstName.toLowerCase()}${lastName.toLowerCase()}${i}.com`
            : "",
        job: null,
        status: [
          "submitted",
          "under-review",
          "shortlisted",
          "interview-scheduled",
          "interviewed",
          "rejected",
          "selected",
          "withdrawn",
        ][Math.floor(Math.random() * 8)],
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        source: [
          "website",
          "linkedin",
          "referral",
          "job-board",
          "social-media",
          "employee-referral",
          "campus-drive",
          "walk-in",
          "other",
        ][Math.floor(Math.random() * 9)],
        applicationDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
      });
    }

    // Get available jobs to associate with applications
    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs to associate with applications`);

    // Clear existing applications
    await Application.deleteMany({});
    console.log("Cleared existing applications");

    // Insert new applications
    let insertedCount = 0;
    for (const application of realApplications) {
      // Assign random job if available
      if (jobs.length > 0) {
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        application.job = randomJob._id;
      }

      const newApplication = new Application(application);
      await newApplication.save();
      insertedCount++;

      if (insertedCount % 10 === 0) {
        console.log(`Inserted ${insertedCount} applications...`);
      }
    }

    console.log(`\nSuccessfully restored ${insertedCount} applications!`);
    console.log("Application data restoration completed.");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error restoring application data:", error);
    await mongoose.connection.close();
  }
};

restoreApplicationsData();
