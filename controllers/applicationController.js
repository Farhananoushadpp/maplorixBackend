import { validationResult } from "express-validator";

import mongoose from "mongoose";

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
    // Clean up uploaded file if validation fails (multer runs before validators)
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }

    return res.status(400).json({
      success: false,
      message: "Please complete all required fields.",
      errorCode: "VALIDATION_ERROR",
    });
  }

  next();
};

// Submit new job application
export const submitApplication = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "nationality",
      "currentlyLocated",
      "visaStatus",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      // Clean up uploaded file if validation fails
      if (req.file?.path) {
        try {
          const fsPromises = (await import("fs")).promises;
          await fsPromises.unlink(req.file.path);
        } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
        errorCode: "VALIDATION_ERROR",
        fields: missingFields,
      });
    }

    // Check CV file is attached
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
        errorCode: "VALIDATION_ERROR",
        fields: ["attachedCv"],
      });
    }

    const {
      firstName,
      lastName,
      email,
      mobile,
      nationality,
      currentlyLocated,
      visaStatus,
      // Optional legacy/extra fields
      job,
      jobRole,
      experience,
      skills,
      currentCompany,
      currentDesignation,
      expectedSalary,
      noticePeriod,
      linkedinProfile,
      portfolio,
      github,
      website,
      source,
      gender,
      dateOfBirth,
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
    } = req.body;

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      if (req.file?.path) {
        try {
          const fsPromises = (await import("fs")).promises;
          await fsPromises.unlink(req.file.path);
        } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Validate currentlyLocated enum
    const validLocations = ["india", "dubai"];
    if (!validLocations.includes(currentlyLocated)) {
      if (req.file?.path) {
        try {
          const fsPromises = (await import("fs")).promises;
          await fsPromises.unlink(req.file.path);
        } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message:
          "Invalid location. Currently located must be either 'india' or 'dubai'.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Validate visaStatus enum
    const validVisaStatuses = ["visitVisa", "residenceVisa", "spouseVisa"];
    if (!validVisaStatuses.includes(visaStatus)) {
      if (req.file?.path) {
        try {
          const fsPromises = (await import("fs")).promises;
          await fsPromises.unlink(req.file.path);
        } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message:
          "Invalid visa status. Must be one of: visitVisa, residenceVisa, spouseVisa.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Process uploaded CV file
    let attachedCvInfo = null;
    try {
      const fsPromises = (await import("fs")).promises;
      const fileStat = await fsPromises.stat(req.file.path);

      if (fileStat.size === 0) {
        await fsPromises.unlink(req.file.path);
        throw new Error("Uploaded file is empty");
      }

      attachedCvInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    } catch (fileError) {
      console.error("Error processing uploaded file:", fileError);
      if (req.file?.path) {
        try {
          const fsPromises = (await import("fs")).promises;
          await fsPromises.unlink(req.file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      }

      return res.status(400).json({
        success: false,
        message: "Failed to process the uploaded file. Please try again.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanMobile = mobile ? mobile.trim() : "";
    const digitsOnlyMobile = cleanMobile.replace(/\s+/g, "");

    // Prepare mobile lookup filters
    const mobileFilters = [];
    if (cleanMobile) {
      mobileFilters.push({ mobile: cleanMobile }, { phone: cleanMobile });
    }
    if (digitsOnlyMobile && digitsOnlyMobile !== cleanMobile) {
      mobileFilters.push({ mobile: digitsOnlyMobile }, { phone: digitsOnlyMobile });
    }

    // Verify job exists (if provided) and check duplicates
    if (job) {
      try {
        const jobExists = await Job.findById(job);
        if (!jobExists) {
          if (req.file?.path) {
            try {
              const fsPromises = (await import("fs")).promises;
              await fsPromises.unlink(req.file.path);
            } catch (e) {}
          }
          return res.status(400).json({
            success: false,
            message: "The specified job does not exist.",
            errorCode: "VALIDATION_ERROR",
          });
        }

        // Check if applicant already applied to this specific job by email or mobile
        const existingApplication = await Application.findOne({
          job: job,
          $or: [
            { email: normalizedEmail },
            ...mobileFilters,
          ],
        });

        if (existingApplication) {
          if (req.file?.path) {
            try {
              const fsPromises = (await import("fs")).promises;
              await fsPromises.unlink(req.file.path);
            } catch (e) {}
          }
          return res.status(409).json({
            success: false,
            message: "You have already applied for this job.",
            errorCode: "ALREADY_APPLIED",
          });
        }
      } catch (jobError) {
        console.error("Error verifying job or application:", jobError);
        if (req.file?.path) {
          try {
            const fsPromises = (await import("fs")).promises;
            await fsPromises.unlink(req.file.path);
          } catch (e) {}
        }
        return res.status(500).json({
          success: false,
          message: "An unexpected error occurred. Please try again.",
          errorCode: "SERVER_ERROR",
        });
      }
    } else {
      // General application duplicate check (no specific job ID)
      try {
        const generalDuplicateConditions = [
          { job: null, email: normalizedEmail },
          { job: { $exists: false }, email: normalizedEmail },
        ];

        if (mobileFilters.length > 0) {
          generalDuplicateConditions.push(
            { job: null, $or: mobileFilters },
            { job: { $exists: false }, $or: mobileFilters }
          );
        }

        const existingGeneralApplication = await Application.findOne({
          $or: generalDuplicateConditions,
        });

        if (existingGeneralApplication) {
          if (req.file?.path) {
            try {
              const fsPromises = (await import("fs")).promises;
              await fsPromises.unlink(req.file.path);
            } catch (e) {}
          }
          return res.status(409).json({
            success: false,
            message: "You have already submitted an application with this email or mobile number.",
            errorCode: "ALREADY_APPLIED",
          });
        }
      } catch (checkError) {
        console.error("Error checking general application duplicate:", checkError);
      }
    }

    // Parse JSON fields safely
    const parseJsonField = (field) => {
      if (!field) return [];
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch (e) {
        return [];
      }
    };

    // Create application data
    const applicationData = {
      // New required fields
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      nationality: nationality.trim(),
      currentlyLocated: currentlyLocated,
      visaStatus: visaStatus,
      attachedCv: attachedCvInfo,
      // Also store in legacy resume field for backward compatibility
      resume: attachedCvInfo,
      // Legacy/optional fields
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      phone: mobile.trim(),
      location: currentlyLocated,
      jobRole: jobRole?.trim(),
      experience: experience || undefined,
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
      ipAddress: req.ip,
      userAgent: req.get("User-Agent") || "",
      status: "submitted",
    };

    const application = new Application(applicationData);

    // Save the application to the database
    try {
      await application.save();
    } catch (saveError) {
      console.error("Error saving application to database:", saveError);

      // Clean up uploaded file if saving to DB fails
      if (attachedCvInfo?.path) {
        try {
          const fsPromises = (await import("fs")).promises;
          await fsPromises.unlink(attachedCvInfo.path);
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
          message: "You have already applied for this job.",
          errorCode: "ALREADY_APPLIED",
        });
      }

      // Handle validation errors
      if (saveError.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Please complete all required fields.",
          errorCode: "VALIDATION_ERROR",
        });
      }

      throw saveError;
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
        message: "Job application submitted successfully.",
        data: {
          application: {
            id: application._id,
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
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
        message: "Job application submitted successfully.",
        data: {
          application: {
            id: application._id,
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            status: application.status,
            submittedAt: application.createdAt,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error in submitApplication:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Get all applications with filtering and pagination

export const getAllApplications = async (req, res) => {
  try {
    console.log("🔍 Getting applications with query:", req.query);
    console.log("🔍 Limit type:", typeof req.query.limit);
    console.log(
      "🔍 Limit value:",
      req.query.limit,
      "parsed:",
      parseInt(req.query.limit),
    );

    const {
      page = 1,
      limit = 0,
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
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { jobRole: new RegExp(search, "i") },
        { skills: new RegExp(search, "i") },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    // Force server to use 10000 regardless of client limit
    const limitNum = 10000;
    const skip = (parseInt(page) - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate("job", "title company location type"),
      Application.countDocuments(filter),
    ]);
    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pageSize: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
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

      limit = 0,

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

    // Search by keyword (searches in skills, firstName, lastName, fullName, email)

    if (keyword) {
      filter.$or = [
        { skills: new RegExp(keyword, "i") },

        { firstName: new RegExp(keyword, "i") },

        { lastName: new RegExp(keyword, "i") },

        { fullName: new RegExp(keyword, "i") },

        { email: new RegExp(keyword, "i") },

        { jobRole: new RegExp(keyword, "i") },
      ];
    }

    // Build sort

    const sort = {};

    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    // Force server to use 10000 regardless of client limit
    const limitNum = 10000;
    const skip = (parseInt(page) - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(limitNum)

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

          pageSize: limitNum,

          total,

          pages: Math.ceil(total / limitNum),
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
