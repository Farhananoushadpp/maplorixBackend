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

// Submit new job application - Simplified version
export const submitApplication = async (req, res) => {
  console.log(
    "🚀 APPLICATION REQUEST RECEIVED - Starting simplified application submission",
  );
  console.log(" Request Body Fields:", Object.keys(req.body));
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
      coverLetter,
    } = req.body;

    // Create simplified application data
    const applicationData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      location: location.trim(),
      jobRole: jobRole.trim(),
      experience: experience,
      skills: skills || "",
      currentCompany: currentCompany?.trim(),
      currentDesignation: currentDesignation?.trim(),
      expectedSalary: expectedSalary || "",
      noticePeriod: noticePeriod?.trim(),
      job: job || null,
      linkedinProfile: linkedinProfile?.trim(),
      portfolio: portfolio?.trim(),
      github: github?.trim(),
      website: website?.trim(),
      source: (source || "website").trim(),
      coverLetter: coverLetter || "",
      resume: req.file
        ? {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
          }
        : null,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent") || "",
      status: "submitted",
    };

    // Process expectedSalary to ensure proper structure
    if (expectedSalary && typeof expectedSalary === "string") {
      // If expectedSalary is just a string amount, convert to proper object
      const salaryAmount = parseInt(expectedSalary.replace(/[^0-9]/g, ""));
      if (!isNaN(salaryAmount) && salaryAmount > 0) {
        applicationData.expectedSalary = {
          min: salaryAmount,
          max: salaryAmount,
          currency: req.body.currency || "USD",
        };
      } else {
        applicationData.expectedSalary = {
          min: null,
          max: null,
          currency: req.body.currency || "USD",
        };
      }
    } else if (expectedSalary && typeof expectedSalary === "object") {
      // If it's already an object, ensure it has the correct structure
      applicationData.expectedSalary = {
        min: expectedSalary.min || null,
        max: expectedSalary.max || null,
        currency: expectedSalary.currency || req.body.currency || "USD",
      };
    } else {
      // Default empty salary object
      applicationData.expectedSalary = {
        min: null,
        max: null,
        currency: req.body.currency || "USD",
      };
    }

    console.log("� Saving application to database...");
    const application = new Application(applicationData);

    // Save without extra verification steps
    await application.save();

    console.log("✅ Application saved successfully!");
    console.log("🆔 Application ID:", application._id);

    // Return success response
    res.status(201).json({
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
          resume: application.resume, // Include resume data in response
        },
      },
    });
  } catch (error) {
    console.error("Error in submitApplication:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate Application",
        message: "You have already applied to this position",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
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

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: "Server Error",
      message: "An unexpected error occurred",
    });
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
