import { validationResult } from "express-validator";
import mongoose from "mongoose";

import Job from "../models/Job.js";

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

// Simple in-memory cache for jobs (for production, use Redis)
const jobsCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

// Get all jobs for Dashboard (GET /api/jobs) - Optimized for concurrency
export const getAllJobsForDashboard = async (req, res) => {
  try {
    console.log("📊 Getting all jobs for Dashboard");

    // Check cache first
    const cacheKey = "jobs-dashboard";
    const cachedJobs = jobsCache.get(cacheKey);

    if (cachedJobs && Date.now() - cachedJobs.timestamp < CACHE_TTL) {
      console.log("📋 Serving jobs from cache");
      return res.json({
        success: true,
        jobs: cachedJobs.data,
        cached: true,
      });
    }

    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 items
    const skip = (page - 1) * limit;

    // Use lean() for better performance and select only needed fields
    const jobs = await Job.find({ isActive: true })
      .select(
        "_id title company location type postedBy description experience requirements salary category createdAt",
      )
      .lean() // Returns plain JavaScript objects, faster
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform jobs to match exact response format
    const transformedJobs = jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      postedBy: job.postedBy,
      description: job.description,
      experience: job.experience,
      requirements: job.requirements,
      salary: job.salary,
      category: job.category,
      createdAt: job.createdAt,
    }));

    // Cache the results (only cache first page for better performance)
    if (page === 1) {
      jobsCache.set(cacheKey, {
        data: transformedJobs,
        timestamp: Date.now(),
      });

      // Clean up old cache entries periodically
      if (jobsCache.size > 10) {
        const now = Date.now();
        for (const [key, value] of jobsCache.entries()) {
          if (now - value.timestamp > CACHE_TTL) {
            jobsCache.delete(key);
          }
        }
      }
    }

    res.json({
      success: true,
      jobs: transformedJobs,
      pagination: {
        page,
        limit,
        total: await Job.countDocuments({ isActive: true }),
      },
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching dashboard jobs:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch jobs",
    });
  }
};

// Get all jobs for Dashboard (simplified version)
export const getDashboardJobs = async (req, res) => {
  try {
    console.log("📊 Getting all jobs for Dashboard");

    // Get all active jobs sorted by creation date (newest first)
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("postedBy", "firstName lastName email");

    // Transform to match the required data model
    const transformedJobs = jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type.toLowerCase().replace("-", ""), // Convert to lowercase without spaces
      postedBy: job.postedBy
        ? {
            _id: job.postedBy._id,
            name: `${job.postedBy.firstName} ${job.postedBy.lastName}`,
            email: job.postedBy.email,
            type: "admin", // Assuming all posters are admin for now
          }
        : {
            _id: null,
            name: "Admin",
            email: "admin@maplorix.com",
            type: "admin",
          },
      createdAt: job.createdAt,
      // Include additional fields that might be useful for Dashboard
      category: job.category,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      isActive: job.isActive,
      applicationCount: job.applicationCount,
    }));

    res.json({
      success: true,
      message: "Dashboard jobs fetched successfully",
      data: transformedJobs,
      total: transformedJobs.length,
    });
  } catch (error) {
    console.error("Error fetching dashboard jobs:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch dashboard jobs",
    });
  }
};

// Get all jobs with filtering and pagination

export const getAllJobs = async (req, res) => {
  try {
    console.log("🔍 Getting all jobs with query:", req.query);

    const {
      page = 1,

      limit = 0,

      role, // Job Role / Title filter
      title, // Alternative title filter
      minExp, // Experience minimum
      maxExp, // Experience maximum
      minSalary, // Salary minimum
      maxSalary, // Salary maximum
      location, // Job location filter
      jobId, // Job ID filter
      dateFrom, // Date range from
      dateTo, // Date range to
      category,
      type,
      experience,
      search,
      featured,
      active = true,

      sortBy = "createdAt",

      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};

    console.log("🔍 Building filter with active:", active);

    // Job Role / Title filter (case-insensitive)
    if (role || title) {
      const searchTerm = role || title;
      filter.title = new RegExp(searchTerm, "i");
    }

    // Experience range filter
    if (minExp || maxExp) {
      filter.experience = {};
      if (minExp) filter.experience.$gte = minExp;
      if (maxExp) filter.experience.$lte = maxExp;
    } else if (experience) {
      filter.experience = experience;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) {
        // Extract numeric value from salary string
        const minNum = parseInt(minSalary.replace(/[^0-9]/g, ""));
        if (!isNaN(minNum)) filter.salary.$gte = minNum;
      }
      if (maxSalary) {
        // Extract numeric value from salary string
        const maxNum = parseInt(maxSalary.replace(/[^0-9]/g, ""));
        if (!isNaN(maxNum)) filter.salary.$lte = maxNum;
      }
    }

    // Location filter (case-insensitive)
    if (location) {
      filter.location = new RegExp(location, "i");
    }

    // Job ID filter
    if (jobId) {
      filter._id = jobId;
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

    // Legacy filters for backward compatibility
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (featured !== undefined)
      filter.featured = featured === "true" || featured === true;
    if (active !== undefined)
      filter.isActive = active === "true" || active === true;

    // Multi-field search
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { requirements: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
      ];
    }

    // Build sort
    const sort = {};

    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    // Force server to use 10000 regardless of client limit
    const limitNum = 10000;
    const skip = (parseInt(page) - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(limitNum)

        .populate("postedBy", "firstName lastName email"),

      Job.countDocuments(filter),
    ]);
    console.log("🔍 Filter applied:", JSON.stringify(filter, null, 2));
    console.log("🔍 Jobs found:", jobs.length);

    res.json({
      success: true,
      message: "Jobs fetched successfully",
      data: {
        jobs,
        pagination: {
          current: parseInt(page),
          pageSize: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to fetch jobs",
    });
  }
};

// Get featured jobs

export const getFeaturedJobs = async (req, res) => {
  try {
    // Force server to use 10000 regardless of client limit
    const limitNum = 10000;

    const jobs = await Job.find({ featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .populate("postedBy", "firstName lastName email");

    res.json({
      success: true,

      data: {
        jobs,
      },
    });
  } catch (error) {
    console.error("Error fetching featured jobs:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to fetch featured jobs",
    });
  }
};

// Get recent jobs for dashboard
export const getRecentJobs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("postedBy", "firstName lastName email");

    res.json({
      success: true,
      message: "Recent jobs fetched successfully",
      data: {
        jobs,
      },
    });
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch recent jobs",
    });
  }
};

// Get single job by ID

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid job ID format",
      });
    }

    const job = await Job.findById(id).populate(
      "postedBy",

      "firstName lastName email",
    );

    if (!job) {
      return res.status(404).json({
        error: "Not Found",

        message: "Job not found",
      });
    }

    res.json({
      success: true,

      data: {
        job,
      },
    });
  } catch (error) {
    console.error("Error fetching job:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to fetch job",
    });
  }
};

// Create new job
export const createJob = async (req, res) => {
  try {
    console.log("🔧 CREATE JOB - Starting job creation process");
    console.log("📊 Database Name:", mongoose.connection.name);
    console.log("🔗 Database State:", mongoose.connection.readyState);
    console.log("📝 Request Body:", req.body);

    // Validate required fields as per requirements
    const { title, location, postedBy } = req.body;

    if (!title || title.trim() === "") {
      console.log("❌ Validation failed: Job title is required");
      return res.status(400).json({
        error: "Validation Error",
        message: "Job title is required",
      });
    }

    if (!location || location.trim() === "") {
      console.log("❌ Validation failed: Job location is required");
      return res.status(400).json({
        error: "Validation Error",
        message: "Job location is required",
      });
    }

    if (!postedBy || (postedBy !== "user" && postedBy !== "admin")) {
      console.log("❌ Validation failed: Invalid postedBy value:", postedBy);
      return res.status(400).json({
        error: "Validation Error",
        message: "postedBy must be either 'user' or 'admin'",
      });
    }

    console.log("✅ Validation passed");

    // Create job with exact data model
    const jobData = {
      title: title.trim(),
      company: req.body.company?.trim() || "Maplorix",
      location: location.trim(),
      type: req.body.type || "Full-time",
      postedBy: postedBy, // Store as string: "user" or "admin"
      description: req.body.description?.trim() || "",
      requirements: req.body.requirements?.trim() || "",
      salary: (() => {
        // Handle salary object from frontend
        if (req.body.salary && typeof req.body.salary === "object") {
          const salaryObj = { ...req.body.salary };

          // Clean and convert min value
          if (salaryObj.min !== undefined) {
            const minStr = String(salaryObj.min)
              .replace(/[^\d.]/g, "")
              .trim();
            salaryObj.min =
              minStr && !isNaN(minStr) ? Number(minStr) : undefined;
          }

          // Clean and convert max value
          if (salaryObj.max !== undefined) {
            const maxStr = String(salaryObj.max)
              .replace(/[^\d.]/g, "")
              .trim();
            salaryObj.max =
              maxStr && !isNaN(maxStr) ? Number(maxStr) : undefined;
          }

          // Ensure currency is valid
          salaryObj.currency = salaryObj.currency || "AED";

          return salaryObj;
        }
        // Handle flat salary fields (salaryMin, salaryMax)
        else if (
          req.body.salaryMin !== undefined ||
          req.body.salaryMax !== undefined
        ) {
          return {
            min: req.body.salaryMin
              ? Number(String(req.body.salaryMin).replace(/[^\d.]/g, ""))
              : undefined,
            max: req.body.salaryMax
              ? Number(String(req.body.salaryMax).replace(/[^\d.]/g, ""))
              : undefined,
            currency: req.body.currency || "AED",
          };
        }
        // Default empty salary object
        return {};
      })(),
      experience: req.body.experience || "Entry Level",
      category: req.body.category || "Other",
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      featured: req.body.featured || false,
    };

    console.log("💼 Creating job with data:", jobData);

    const job = new Job(jobData);

    console.log("💾 Saving job to database...");
    console.log("📊 Model:", job.constructor.modelName);
    console.log("🗄️ Collection:", job.collection.name);

    const startTime = Date.now();
    await job.save();
    const saveTime = Date.now() - startTime;

    console.log("✅ Job saved successfully!");
    console.log("🆔 Job ID:", job._id);
    console.log("⏱️ Save time:", saveTime, "ms");
    console.log("📊 Collection:", job.constructor.modelName);
    console.log("🗄️ Database:", mongoose.connection.name);

    // Verify the job was actually saved by trying to retrieve it
    console.log("🔍 Verifying job in database...");
    const verifyJob = await Job.findById(job._id);
    if (verifyJob) {
      console.log("✅ Verification successful: Job found in database");
      console.log("📝 Verified title:", verifyJob.title);
      console.log("🏢 Verified company:", verifyJob.company);
    } else {
      console.log(
        "❌ Verification failed: Job not found in database after save",
      );
      console.log(
        "🚨 CRITICAL: Save operation appeared successful but document not found!",
      );
    }

    // Additional verification - count documents in collection
    const jobCount = await Job.countDocuments();
    console.log("📊 Total jobs in database after save:", jobCount);

    console.log("🎉 Job creation process completed successfully");

    // Return response in exact format specified
    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        postedBy: job.postedBy,
        description: job.description,
        requirements: job.requirements,
        salary: job.salary,
        experience: job.experience,
        category: job.category,
        isActive: job.isActive,
        featured: job.featured,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error creating job:", error);
    console.error("🔍 Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log("⚠️ Duplicate key error detected");
      return res.status(400).json({
        error: "Duplicate Error",
        message: "A similar job already exists",
      });
    }
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      }));
      console.log("⚠️ Validation errors:", errors);
      return res.status(400).json({
        error: "Validation Error",
        message: errors.map((err) => err.message).join(", "),
        details: errors,
      });
    }

    res.status(500).json({
      error: "Server Error",
      message: "Failed to post job",
    });
  }
};

// Update job

export const updateJob = async (req, res) => {
  try {
    console.log("🔧 UPDATE JOB - Starting job update process");
    console.log("📊 Database Name:", mongoose.connection.name);
    console.log("🔗 Database State:", mongoose.connection.readyState);
    console.log("🆔 Job ID to update:", req.params.id);
    console.log("📝 Update Data:", req.body);

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Validation failed: Invalid job ID format:", id);
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid job ID format",
      });
    }

    console.log("🔍 Finding job to update...");
    const job = await Job.findById(id);

    if (!job) {
      console.log("❌ Job not found with ID:", id);
      return res.status(404).json({
        error: "Not Found",

        message: "Job not found",
      });
    }

    console.log("✅ Job found:", job.title);

    // Check permissions (simplified for now - you may need to adjust based on your auth)
    // Note: This section might need adjustment based on your authentication setup

    // Update job
    console.log("💾 Updating job with new data...");

    // Transform salary fields if present
    const updateData = { ...req.body };

    // Handle salary object from frontend
    if (updateData.salary && typeof updateData.salary === "object") {
      // Extract numeric values from salary object, handling malformed data
      const salaryObj = { ...updateData.salary };

      // Clean and convert min value
      if (salaryObj.min !== undefined) {
        const minStr = String(salaryObj.min)
          .replace(/[^\d.]/g, "")
          .trim();
        salaryObj.min = minStr && !isNaN(minStr) ? Number(minStr) : undefined;
      }

      // Clean and convert max value
      if (salaryObj.max !== undefined) {
        const maxStr = String(salaryObj.max)
          .replace(/[^\d.]/g, "")
          .trim();
        salaryObj.max = maxStr && !isNaN(maxStr) ? Number(maxStr) : undefined;
      }

      // Ensure currency is valid
      salaryObj.currency = salaryObj.currency || "AED";

      updateData.salary = salaryObj;
    }
    // Handle flat salary fields (salaryMin, salaryMax)
    else if (
      updateData.salaryMin !== undefined ||
      updateData.salaryMax !== undefined
    ) {
      updateData.salary = {
        min: updateData.salaryMin
          ? Number(String(updateData.salaryMin).replace(/[^\d.]/g, ""))
          : undefined,
        max: updateData.salaryMax
          ? Number(String(updateData.salaryMax).replace(/[^\d.]/g, ""))
          : undefined,
        currency: updateData.currency || "AED",
      };
      // Remove the flat salary fields
      delete updateData.salaryMin;
      delete updateData.salaryMax;
    }

    Object.assign(job, updateData);

    await job.save();

    console.log("✅ Job updated successfully!");
    console.log("🆔 Updated Job ID:", job._id);
    console.log("📊 Collection:", job.constructor.modelName);
    console.log("🗄️ Database:", mongoose.connection.name);

    // Verify the update
    const verifyJob = await Job.findById(id);
    if (verifyJob) {
      console.log("✅ Verification successful: Updated job found in database");
    } else {
      console.log("❌ Verification failed: Updated job not found in database");
    }

    // Populate user information if needed
    await job.populate("postedBy", "firstName lastName email");

    res.json({
      success: true,

      message: "Job updated successfully",

      data: {
        job,
      },
    });
  } catch (error) {
    console.error("Error updating job:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to update job",
    });
  }
};

// Delete job

export const deleteJob = async (req, res) => {
  try {
    console.log("🔧 DELETE JOB - Starting job deletion process");
    console.log("📊 Database Name:", mongoose.connection.name);
    console.log("🔗 Database State:", mongoose.connection.readyState);
    console.log("🆔 Job ID to delete:", req.params.id);

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Validation failed: Invalid job ID format:", id);
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid job ID format",
      });
    }

    console.log("🔍 Finding job to delete...");
    const job = await Job.findById(id);

    if (!job) {
      console.log("❌ Job not found with ID:", id);
      return res.status(404).json({
        error: "Not Found",

        message: "Job not found",
      });
    }

    console.log("✅ Job found for deletion:", job.title);

    // Check permissions (simplified for now)
    // Note: This section might need adjustment based on your authentication setup

    console.log("🗑️ Deleting job from database...");
    const deletedJob = await Job.findByIdAndDelete(id);

    console.log("✅ Job deleted successfully!");
    console.log("🆔 Deleted Job ID:", deletedJob._id);
    console.log("📊 Collection:", deletedJob.constructor.modelName);
    console.log("🗄️ Database:", mongoose.connection.name);
    console.log("📝 Deleted Job Title:", deletedJob.title);

    // Verify the deletion
    const verifyDeletion = await Job.findById(id);
    if (verifyDeletion) {
      console.log(
        "❌ Verification failed: Job still exists in database after deletion",
      );
    } else {
      console.log(
        "✅ Verification successful: Job successfully deleted from database",
      );
    }

    res.json({
      success: true,

      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    console.error("🔍 Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    res.status(500).json({
      error: "Server Error",

      message: "Failed to delete job",
    });
  }
};

// Get job statistics

export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: null,

          totalJobs: { $sum: 1 },

          activeJobs: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },

          featuredJobs: {
            $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] },
          },

          expiredJobs: {
            $sum: {
              $cond: [{ $lt: ["$applicationDeadline", new Date()] }, 1, 0],
            },
          },
        },
      },
    ]);

    const categoryStats = await Job.aggregate([
      {
        $group: {
          _id: "$category",

          count: { $sum: 1 },
        },
      },

      {
        $sort: { count: -1 },
      },
    ]);

    const typeStats = await Job.aggregate([
      {
        $group: {
          _id: "$type",

          count: { $sum: 1 },
        },
      },

      {
        $sort: { count: -1 },
      },
    ]);

    const result = stats[0] || {
      totalJobs: 0,

      activeJobs: 0,

      featuredJobs: 0,

      expiredJobs: 0,
    };

    res.json({
      success: true,

      data: {
        ...result,

        categoryStats,

        typeStats,
      },
    });
  } catch (error) {
    console.error("Error fetching job statistics:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to fetch job statistics",
    });
  }
};

export { handleValidationErrors };
