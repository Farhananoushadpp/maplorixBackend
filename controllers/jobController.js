import { validationResult } from "express-validator";

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

// Get all jobs with filtering and pagination

export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,

      limit = 10,

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
    if (featured !== undefined) filter.featured = featured === "true";
    if (active !== undefined) filter.active = active === "true";

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
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(parseInt(limit))

        .populate("postedBy", "firstName lastName email"),

      Job.countDocuments(filter),
    ]);

    res.json({
      success: true,

      data: {
        jobs,

        pagination: {
          current: parseInt(page),

          pageSize: parseInt(limit),

          total,

          pages: Math.ceil(total / parseInt(limit)),
        },
        filters: {
          applied: {
            role,
            title,
            minExp,
            maxExp,
            minSalary,
            maxSalary,
            location,
            jobId,
            dateFrom,
            dateTo,
            search,
            sortBy,
            sortOrder,
          },
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
    const { limit = 6 } = req.query;

    const jobs = await Job.find({ featured: true, active: true })

      .sort({ createdAt: -1 })

      .limit(parseInt(limit))

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
    const jobData = {
      ...req.body,

      // Map frontend 'active' to backend 'isActive'
      isActive: req.body.active !== false, // Default to true if not explicitly false

      postedBy: req.user._id,
    };

    const job = new Job(jobData);

    await job.save();

    // Populate user information

    await job.populate("postedBy", "firstName lastName email");

    res.status(201).json({
      success: true,

      message: "Job created successfully",

      data: {
        job,
      },
    });
  } catch (error) {
    console.error("Error creating job:", error);

    res.status(500).json({
      error: "Server Error",

      message: "Failed to create job",
    });
  }
};

// Update job

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid job ID format",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        error: "Not Found",

        message: "Job not found",
      });
    }

    // Check permissions

    if (
      !req.user.hasPermission("manage_all_jobs") &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "Forbidden",

        message: "You can only update your own jobs",
      });
    }

    // Update job

    Object.assign(job, req.body);

    await job.save();

    // Populate user information

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
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Validation Error",

        message: "Invalid job ID format",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        error: "Not Found",

        message: "Job not found",
      });
    }

    // Check permissions

    if (
      !req.user.hasPermission("manage_all_jobs") &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "Forbidden",

        message: "You can only delete your own jobs",
      });
    }

    await Job.findByIdAndDelete(id);

    res.json({
      success: true,

      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);

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
            $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] },
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
