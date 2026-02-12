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
  try {
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
      coverLetter,
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
    } = req.body;

    // Check if resume file was uploaded (optional)
    let resumePath = null;
    if (req.file) {
      resumePath = req.file.path;
    }

    // Verify job exists (optional)
    let jobExists = null;
    if (job) {
      jobExists = await Job.findById(job);
      if (!jobExists) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid job ID",
        });
      }
    }

    // Helper function to safely parse JSON
    const safeJSONParse = (value) => {
      if (!value) return [];
      if (typeof value === "object") return value;
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error("JSON parse error:", error);
        return [];
      }
    };

    // Create application
    const application = new Application({
      fullName,
      email,
      phone,
      location,
      jobRole,
      experience,
      skills,
      currentCompany,
      currentDesignation,
      expectedSalary: expectedSalary
        ? typeof expectedSalary === "string"
          ? safeJSONParse(expectedSalary)
          : expectedSalary
        : {},
      noticePeriod,
      job,
      coverLetter,
      linkedinProfile,
      portfolio,
      github,
      website,
      source: source || "website",
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      nationality,
      workAuthorization,
      languages: safeJSONParse(languages),
      education: safeJSONParse(education),
      workHistory: safeJSONParse(workHistory),
      certifications: safeJSONParse(certifications),
      references: safeJSONParse(references),
      availability,
      expectedStartDate: expectedStartDate
        ? new Date(expectedStartDate)
        : undefined,
      salaryNegotiable:
        salaryNegotiable !== undefined
          ? salaryNegotiable === "true" || salaryNegotiable === true
          : true,
      relocation:
        relocation !== undefined
          ? relocation === "true" || relocation === true
          : false,
      remoteWork:
        remoteWork !== undefined
          ? remoteWork === "true" || remoteWork === true
          : false,
      resume:
        resumePath && req.file
          ? {
              filename: req.file.filename,
              originalName: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              path: req.file.path,
            }
          : null,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    await application.save();

    // Populate job information for response
    await application.populate("job", "title company location type");

    // Send confirmation email (async, don't wait for it)
    sendApplicationEmail(application).catch((error) => {
      console.error("Error sending application email:", error);
    });

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
        },
      },
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to submit application",
    });
  }
};

// Get all applications with filtering and pagination
export const getAllApplications = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
        message: "Only admin users can view candidate applications",
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      jobRole,
      experience,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};

    if (status) filter.status = status;
    if (jobRole) filter.jobRole = new RegExp(jobRole, "i");
    if (experience) filter.experience = experience;

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
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
        message: "Only admin users can search candidates",
      });
    }

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
