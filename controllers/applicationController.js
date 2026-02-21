import { validationResult } from "express-validator";

import Application from "../models/Application.js";

import Job from "../models/Job.js";

import {
  sendApplicationEmail,
  sendInterviewEmail,
} from "../services/emailService.js";

import fs from "fs";

import path from "path";

// Validation middleware

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation Error",

      message: errors

        .array()

        .map((err) => err.msg)

        .join(", "),
    });
  }

  next();
};

// Submit new job application
export const submitApplication = async (req, res) => {
  // Log the incoming request for debugging
  console.log(
    "🔧 SUBMIT APPLICATION - Starting application submission process",
  );
  console.log("📊 Database Name:", mongoose.connection.name);
  console.log("🔗 Database State:", mongoose.connection.readyState);
  console.log("📝 Request Body Fields:", Object.keys(req.body));
  console.log("📎 Uploaded File:", req.file ? req.file : "No file uploaded");

  try {
    // Validate required fields
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "location",
      "jobRole",
      "experience",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      console.log(
        "❌ Validation failed: Missing required fields:",
        missingFields,
      );
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: `Missing required fields: ${missingFields.join(", ")}`,
        fields: missingFields,
      });
    }

    const {
      fullName,
      email,
      phone,
      location,
      jobRole,
      experience,
      skills,
      currentCompany,
      currentDesignation,
      expectedSalary,
      noticePeriod,
      job,
      linkedinProfile,
      portfolio,
      github,
      website,
      source,
      gender,
      dateOfBirth,
      nationality,
      workAuthorization,
      languages,
      education,
      workHistory,
      certifications,
      references,
      availability,
      expectedStartDate,
      salaryNegotiable,
      relocation,
      remoteWork,
      captchaToken, // CAPTCHA token from frontend
    } = req.body;

    // Verify CAPTCHA token (for production, use your actual secret key)
    if (process.env.NODE_ENV === "production") {
      if (
        !captchaToken ||
        captchaToken === "undefined" ||
        captchaToken === ""
      ) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message:
            "CAPTCHA verification is required. Please complete the CAPTCHA challenge.",
        });
      }

      // In production, verify the CAPTCHA token with Google's API
      try {
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`;
        const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
          method: "POST",
        });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
          return res.status(400).json({
            success: false,
            error: "Validation Error",
            message: "CAPTCHA verification failed. Please try again.",
          });
        }
      } catch (captchaError) {
        console.error("CAPTCHA verification error:", captchaError);
        return res.status(500).json({
          success: false,
          error: "Server Error",
          message: "Failed to verify CAPTCHA. Please try again.",
        });
      }
    } else {
      console.log("Development mode: Skipping CAPTCHA verification");
    }

    // Process uploaded file if present
    let resumeInfo = null;
    if (req.file) {
      try {
        // Verify the file was saved correctly
        const fs = await import("fs").then((mod) => mod.promises);
        const fileStat = await fs.stat(req.file.path);

        if (fileStat.size === 0) {
          console.error("Uploaded file is empty:", req.file.path);
          // Clean up the empty file
          await fs.unlink(req.file.path);
          throw new Error("Uploaded file is empty");
        }

        resumeInfo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
        };

        console.log("File uploaded successfully:", resumeInfo);
      } catch (fileError) {
        console.error("Error processing uploaded file:", fileError);
        // Clean up the file if it exists
        if (req.file?.path) {
          try {
            await fs.unlink(req.file.path);
          } catch (cleanupError) {
            console.error("Error cleaning up file:", cleanupError);
          }
        }

        return res.status(400).json({
          success: false,
          error: "File Upload Error",
          message: "Failed to process the uploaded file. Please try again.",
          details:
            process.env.NODE_ENV === "development"
              ? fileError.message
              : undefined,
        });
      }
    }

    // Verify job exists (optional)
    let jobExists = null;

    if (job) {
      try {
        jobExists = await Job.findById(job);
        if (!jobExists) {
          return res.status(400).json({
            success: false,
            error: "Validation Error",
            message: "The specified job does not exist",
          });
        }
      } catch (jobError) {
        console.error("Error verifying job:", jobError);
        return res.status(500).json({
          success: false,
          error: "Server Error",
          message: "Failed to verify job information",
          details:
            process.env.NODE_ENV === "development"
              ? jobError.message
              : undefined,
        });
      }
    }

    // Parse JSON fields safely
    const parseJsonField = (field) => {
      if (!field) return [];
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch (e) {
        console.error(`Error parsing field: ${field}`, e);
        return [];
      }
    };

    // Create application
    const applicationData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      location: location.trim(),
      jobRole: jobRole.trim(),
      experience: experience,
      skills: Array.isArray(skills) ? skills.join(", ") : skills || "",
      currentCompany: currentCompany?.trim(),
      currentDesignation: currentDesignation?.trim(),
      expectedSalary: expectedSalary
        ? typeof expectedSalary === "string"
          ? JSON.parse(expectedSalary)
          : expectedSalary
        : {},
      noticePeriod: noticePeriod?.trim(),
      job: job || null,
      linkedinProfile: linkedinProfile?.trim(),
      portfolio: portfolio?.trim(),
      github: github?.trim(),
      website: website?.trim(),
      source: (source || "website").trim(),
      gender: gender?.trim(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      nationality: nationality?.trim(),
      workAuthorization: workAuthorization?.trim(),
      languages: parseJsonField(languages),
      education: parseJsonField(education),
      workHistory: parseJsonField(workHistory),
      certifications: parseJsonField(certifications),
      references: parseJsonField(references),
      availability: availability?.trim(),
      expectedStartDate: expectedStartDate ? new Date(expectedStartDate) : null,
      salaryNegotiable:
        salaryNegotiable !== undefined
          ? typeof salaryNegotiable === "string"
            ? salaryNegotiable === "true"
            : Boolean(salaryNegotiable)
          : true,
      relocation:
        relocation !== undefined
          ? typeof relocation === "string"
            ? relocation === "true"
            : Boolean(relocation)
          : false,
      remoteWork:
        remoteWork !== undefined
          ? typeof remoteWork === "string"
            ? remoteWork === "true"
            : Boolean(remoteWork)
          : false,
      resume: resumeInfo,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent") || "",
      status: "submitted", // Use 'submitted' instead of 'new'
    };

    console.log("📋 Creating application with data:", {
      ...applicationData,
      resume: resumeInfo ? "[File info available]" : "No resume",
    });

    const application = new Application(applicationData);

    // Save the application to the database
    try {
      console.log("💾 Saving application to database...");
      console.log("📊 Model:", application.constructor.modelName);
      console.log("🗄️ Collection:", application.collection.name);

      const startTime = Date.now();
      await application.save();
      const saveTime = Date.now() - startTime;

      console.log("✅ Application saved successfully!");
      console.log("🆔 Application ID:", application._id);
      console.log("⏱️ Save time:", saveTime, "ms");
      console.log("📊 Collection:", application.constructor.modelName);
      console.log("🗄️ Database:", mongoose.connection.name);
      console.log("👤 Applicant:", application.fullName);
      console.log("📧 Email:", application.email);

      // Verify the application was actually saved by trying to retrieve it
      console.log("🔍 Verifying application in database...");
      const verifyApplication = await Application.findById(application._id);
      if (verifyApplication) {
        console.log(
          "✅ Verification successful: Application found in database",
        );
        console.log("👤 Verified name:", verifyApplication.fullName);
        console.log("📧 Verified email:", verifyApplication.email);
      } else {
        console.log(
          "❌ Verification failed: Application not found in database after save",
        );
        console.log(
          "🚨 CRITICAL: Save operation appeared successful but document not found!",
        );
      }

      // Additional verification - count documents in collection
      const applicationCount = await Application.countDocuments();
      console.log(
        "📊 Total applications in database after save:",
        applicationCount,
      );

      console.log("🎉 Application submission process completed successfully");
    } catch (saveError) {
      console.error("❌ Error saving application to database:", saveError);
      console.error("🔍 Save Error Details:", {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        stack: saveError.stack,
      });

      // Clean up uploaded file if saving to DB fails
      if (resumeInfo?.path) {
        try {
          const fs = await import("fs").then((mod) => mod.promises);
          await fs.unlink(resumeInfo.path);
        } catch (cleanupError) {
          console.error(
            "Error cleaning up file after DB save error:",
            cleanupError,
          );
        }
      }

      // Handle duplicate key errors (e.g., duplicate email for the same job)
      if (saveError.code === 11000) {
        return res.status(409).json({
          success: false,
          error: "Duplicate Application",
          message: "You have already applied to this position",
          details:
            process.env.NODE_ENV === "development"
              ? saveError.message
              : undefined,
        });
      }

      // Handle validation errors
      if (saveError.name === "ValidationError") {
        const errors = Object.values(saveError.errors).map((err) => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Please correct the following errors",
          errors,
        });
      }

      throw saveError; // Let the catch block handle other errors
    }

    try {
      // Populate job information for response
      await application.populate("job", "title company location type");

      // Send confirmation email (async, don't wait for it)
      sendApplicationEmail(application).catch((emailError) => {
        console.error("Error sending application email:", emailError);
      });

      // Return success response
      return res.status(201).json({
        success: true,
        message:
          "Your application has been submitted successfully. We will review your profile and contact you soon.",
        data: {
          application: {
            id: application._id,
            fullName: application.fullName,
            email: application.email,
            jobRole: application.jobRole,
            job: application.job,
            status: application.status,
            submittedAt: application.createdAt,
          },
        },
      });
    } catch (populateError) {
      console.error("Error populating job data:", populateError);
      // Even if population fails, we still return success since the application was saved
      return res.status(201).json({
        success: true,
        message:
          "Your application has been submitted successfully. We will review your profile and contact you soon.",
        data: {
          application: {
            id: application._id,
            fullName: application.fullName,
            email: application.email,
            jobRole: application.jobRole,
            status: application.status,
            submittedAt: application.createdAt,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error in submitApplication:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      requestBody: req.body,
      file: req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : "No file uploaded",
    });

    // Determine the appropriate status code
    const statusCode = error.name === "ValidationError" ? 400 : 500;

    // Prepare error response
    const errorResponse = {
      success: false,
      error: error.name || "Server Error",
      message: error.message || "An unexpected error occurred",
    };

    // Add more details in development
    if (process.env.NODE_ENV === "development") {
      errorResponse.stack = error.stack;
      if (error.errors) {
        errorResponse.errors = Object.entries(error.errors).reduce(
          (acc, [key, value]) => {
            acc[key] = value.message;
            return acc;
          },
          {},
        );
      }
    }

    return res.status(statusCode).json(errorResponse);
  }
};

// Get all applications with filtering and pagination

export const getAllApplications = async (req, res) => {
  try {
    console.log("🔍 Getting applications with query:", req.query);

    const {
      page = 1,
      limit = 10,
      status,
      jobRole,
      minExp,
      maxExp,
      minSalary,
      maxSalary,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      applicationId,
      dateFrom,
      dateTo,
    } = req.query;

    // Build filter
    const filter = {};

    // Status filter
    if (status) filter.status = status;

    // Job Role filter (case-insensitive)
    if (jobRole) filter.jobRole = new RegExp(jobRole, "i");

    // Experience range filter
    if (minExp || maxExp) {
      filter.experience = {};
      if (minExp) filter.experience.$gte = minExp;
      if (maxExp) filter.experience.$lte = maxExp;
    } else if (req.query.experience) {
      filter.experience = req.query.experience;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filter.expectedSalary = {};
      if (minSalary) {
        // Extract numeric value from salary string (e.g., "$80,000" -> 80000)
        const minNum = parseInt(minSalary.replace(/[^0-9]/g, ""));
        if (!isNaN(minNum)) filter.expectedSalary.$gte = minNum;
      }
      if (maxSalary) {
        // Extract numeric value from salary string
        const maxNum = parseInt(maxSalary.replace(/[^0-9]/g, ""));
        if (!isNaN(maxNum)) filter.expectedSalary.$lte = maxNum;
      }
    }

    // Application ID filter
    if (applicationId) {
      filter._id = applicationId;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (!isNaN(fromDate.getTime())) filter.createdAt.$gte = fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        if (!isNaN(toDate.getTime())) filter.createdAt.$lte = toDate;
      }
    }

    // Search filter (multiple fields)
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { jobRole: new RegExp(search, "i") },
        { skills: new RegExp(search, "i") },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("job", "title company location type"),
      Application.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
        filters: {
          applied: {
            status,
            jobRole,
            minExp,
            maxExp,
            minSalary,
            maxSalary,
            search,
            sortBy,
            sortOrder,
            applicationId,
            dateFrom,
            dateTo,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch applications",
    });
  }
};

// Get single application by ID

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid application ID format",
      });
    }

    const application = await Application.findById(id).populate(
      "job",

      "title company location type description requirements",
    );

    if (!application) {
      return res.status(404).json({
        error: "Not Found",

        message: "Application not found",
      });
    }

    res.json({
      success: true,

      data: {
        application,
      },
    });
  } catch (error) {
    console.error("Error fetching application:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to fetch application",
    });
  }
};

// Update application

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid application ID format",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        error: "Not Found",

        message: "Application not found",
      });
    }

    // Update application

    const allowedUpdates = ["status", "notes", "reviewedBy", "reviewedAt"];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Add review information if status is being updated

    if (updates.status && updates.status !== application.status) {
      updates.reviewedBy = req.user._id;

      updates.reviewedAt = new Date();
    }

    Object.assign(application, updates);

    await application.save();

    // Populate job information

    await application.populate("job", "title company location type");

    res.json({
      success: true,

      message: "Application updated successfully",

      data: {
        application,
      },
    });
  } catch (error) {
    console.error("Error updating application:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to update application",
    });
  }
};

// Delete application

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid application ID format",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        error: "Not Found",

        message: "Application not found",
      });
    }

    // Delete resume file if exists

    if (application.resume && application.resume.path) {
      try {
        fs.unlinkSync(application.resume.path);
      } catch (fileError) {
        console.error("Error deleting resume file:", fileError);
      }
    }

    await Application.findByIdAndDelete(id);

    res.json({
      success: true,

      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to delete application",
    });
  }
};

// Download resume

export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid application ID format",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        error: "Not Found",

        message: "Application not found",
      });
    }

    if (!application.resume || !application.resume.path) {
      return res.status(404).json({
        error: "Not Found",

        message: "Resume file not found",
      });
    }

    // Check if file exists

    if (!fs.existsSync(application.resume.path)) {
      return res.status(404).json({
        error: "Not Found",

        message: "Resume file not found on server",
      });
    }

    // Set headers for file download

    res.setHeader(
      "Content-Disposition",

      `attachment; filename="${application.resume.originalName}"`,
    );

    res.setHeader("Content-Type", application.resume.mimetype);

    // Send file

    res.sendFile(path.resolve(application.resume.path));
  } catch (error) {
    console.error("Error downloading resume:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to download resume",
    });
  }
};

// Get application statistics

export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: null,

          totalApplications: { $sum: 1 },

          submittedApplications: {
            $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] },
          },

          underReviewApplications: {
            $sum: { $cond: [{ $eq: ["$status", "under-review"] }, 1, 0] },
          },

          shortlistedApplications: {
            $sum: { $cond: [{ $eq: ["$status", "shortlisted"] }, 1, 0] },
          },

          rejectedApplications: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
    ]);

    const jobRoleStats = await Application.aggregate([
      {
        $group: {
          _id: "$jobRole",

          count: { $sum: 1 },
        },
      },

      {
        $sort: { count: -1 },
      },
    ]);

    const experienceStats = await Application.aggregate([
      {
        $group: {
          _id: "$experience",

          count: { $sum: 1 },
        },
      },

      {
        $sort: { count: -1 },
      },
    ]);

    const result = stats[0] || {
      totalApplications: 0,

      submittedApplications: 0,

      underReviewApplications: 0,

      shortlistedApplications: 0,

      rejectedApplications: 0,
    };

    res.json({
      success: true,

      data: {
        ...result,

        jobRoleStats,

        experienceStats,
      },
    });
  } catch (error) {
    console.error("Error fetching application statistics:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to fetch application statistics",
    });
  }
};

// Search candidates with filters

export const searchCandidates = async (req, res) => {
  try {
    const {
      page = 1,

      limit = 10,

      jobRole,

      experience,

      keyword,

      status,

      location,

      sortBy = "createdAt",

      sortOrder = "desc",
    } = req.query;

    // Build filter object

    const filter = {};

    // Filter by jobRole

    if (jobRole) {
      filter.jobRole = new RegExp(jobRole, "i");
    }

    // Filter by experience

    if (experience) {
      filter.experience = experience;
    }

    // Filter by status

    if (status) {
      filter.status = status;
    }

    // Filter by location

    if (location) {
      filter.location = new RegExp(location, "i");
    }

    // Search by keyword (searches in skills, fullName, email)

    if (keyword) {
      filter.$or = [
        { skills: new RegExp(keyword, "i") },

        { fullName: new RegExp(keyword, "i") },

        { email: new RegExp(keyword, "i") },

        { jobRole: new RegExp(keyword, "i") },
      ];
    }

    // Build sort

    const sort = {};

    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(parseInt(limit))

        .populate("job", "title company location type experience jobRole"),

      Application.countDocuments(filter),
    ]);

    res.json({
      success: true,

      message: "Candidates search completed successfully",

      data: {
        candidates: applications,

        pagination: {
          current: parseInt(page),

          pageSize: parseInt(limit),

          total,

          pages: Math.ceil(total / parseInt(limit)),
        },

        filters: {
          jobRole: jobRole || null,

          experience: experience || null,

          keyword: keyword || null,

          status: status || null,

          location: location || null,
        },
      },
    });
  } catch (error) {
    console.error("Error searching candidates:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to search candidates",
    });
  }
};

export { handleValidationErrors };
