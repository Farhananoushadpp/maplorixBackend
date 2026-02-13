import express from "express";
import { query, body } from "express-validator";
import Job from "../models/Job.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Authentication required"
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: "Authorization Error",
        message: "Admin access required"
      });
    }

    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Authorization check failed"
    });
  }
};

// GET /api/admin/jobs - Get all jobs (admin only)
router.get(
  "/jobs",
  adminAuth,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),

    query("status")
      .optional()
      .isIn(["all", "active", "inactive", "expired"])
      .withMessage("Invalid status filter"),

    query("category")
      .optional()
      .isIn([
        "Technology", "Healthcare", "Finance", "Marketing", "Sales", 
        "Education", "Engineering", "Design", "Customer Service", 
        "Human Resources", "Operations", "Legal", "Other"
      ])
      .withMessage("Invalid category filter"),

    query("type")
      .optional()
      .isIn(["Full-time", "Part-time", "Contract", "Internship", "Remote", "Hybrid"])
      .withMessage("Invalid job type filter"),

    query("search")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Search query cannot exceed 100 characters"),
  ],
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status = "all",
        category,
        type,
        search
      } = req.query;

      // Build query
      let query = {};
      
      // Status filter
      if (status === "active") {
        query.isActive = true;
        query.applicationDeadline = { $gt: new Date() };
      } else if (status === "inactive") {
        query.isActive = false;
      } else if (status === "expired") {
        query.applicationDeadline = { $lt: new Date() };
      }

      // Category filter
      if (category) {
        query.category = category;
      }

      // Type filter
      if (type) {
        query.type = type;
      }

      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ];
      }

      // Calculate skip
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const jobs = await Job.find(query)
        .populate("postedBy", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const total = await Job.countDocuments(query);

      // Get statistics
      const stats = await Job.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ["$isActive", true] }, 1, 0]
              }
            },
            featured: {
              $sum: {
                $cond: [{ $eq: ["$featured", true] }, 1, 0]
              }
            },
            expired: {
              $sum: {
                $cond: [{ $lt: ["$applicationDeadline", new Date()] }, 1, 0]
              }
            }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          jobs,
          pagination: {
            current: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          },
          statistics: stats[0] || {
            total: 0,
            active: 0,
            featured: 0,
            expired: 0
          }
        }
      });
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to fetch jobs"
      });
    }
  }
);

// GET /api/admin/jobs/:id - Get specific job (admin only)
router.get(
  "/jobs/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid job ID format"
        });
      }

      const job = await Job.findById(id)
        .populate("postedBy", "firstName lastName email")
        .populate({
          path: "applications",
          populate: {
            path: "applicant",
            select: "firstName lastName email phone"
          }
        });

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found"
        });
      }

      res.status(200).json({
        success: true,
        data: {
          job
        }
      });
    } catch (error) {
      console.error("Error fetching admin job:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to fetch job"
      });
    }
  }
);

// PUT /api/admin/jobs/:id - Update job (admin only)
router.put(
  "/jobs/:id",
  adminAuth,
  [
    body("title")
      .optional()
      .isLength({ min: 3, max: 200 })
      .withMessage("Title must be between 3 and 200 characters"),

    body("company")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company must be between 2 and 100 characters"),

    body("location")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Location must be between 2 and 100 characters"),

    body("type")
      .optional()
      .isIn(["Full-time", "Part-time", "Contract", "Internship", "Remote", "Hybrid"])
      .withMessage("Invalid job type"),

    body("category")
      .optional()
      .isIn([
        "Technology", "Healthcare", "Finance", "Marketing", "Sales", 
        "Education", "Engineering", "Design", "Customer Service", 
        "Human Resources", "Operations", "Legal", "Other"
      ])
      .withMessage("Invalid category"),

    body("experience")
      .optional()
      .isIn(["Entry Level", "Mid Level", "Senior Level", "Executive", "Fresher"])
      .withMessage("Invalid experience level"),

    body("jobRole")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Job role must be between 2 and 100 characters"),

    body("description")
      .optional()
      .isLength({ min: 50 })
      .withMessage("Description must be at least 50 characters"),

    body("requirements")
      .optional()
      .isLength({ min: 20 })
      .withMessage("Requirements must be at least 20 characters"),

    body("salary.min")
      .optional()
      .isNumeric()
      .withMessage("Minimum salary must be a number"),

    body("salary.max")
      .optional()
      .isNumeric()
      .withMessage("Maximum salary must be a number"),

    body("salary.currency")
      .optional()
      .isIn(["USD", "EUR", "GBP", "CAD", "AUD", "INR"])
      .withMessage("Invalid currency"),

    body("applicationDeadline")
      .optional()
      .isISO8601()
      .withMessage("Invalid deadline date"),

    body("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be a boolean"),

    body("active")
      .optional()
      .isBoolean()
      .withMessage("Active must be a boolean"),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid job ID format"
        });
      }

      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found"
        });
      }

      // Update job with new data
      const updatedJob = await Job.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      ).populate("postedBy", "firstName lastName email");

      res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: {
          job: updatedJob
        }
      });
    } catch (error) {
      console.error("Error updating admin job:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to update job"
      });
    }
  }
);

// DELETE /api/admin/jobs/:id - Delete job (admin only)
router.delete(
  "/jobs/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid job ID format"
        });
      }

      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found"
        });
      }

      // Delete the job
      await Job.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Job deleted successfully",
        data: {
          job: {
            _id: job._id,
            title: job.title,
            company: job.company
          }
        }
      });
    } catch (error) {
      console.error("Error deleting admin job:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to delete job"
      });
    }
  }
);

// POST /api/admin/jobs/:id/toggle-featured - Toggle featured status (admin only)
router.post(
  "/jobs/:id/toggle-featured",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid job ID format"
        });
      }

      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found"
        });
      }

      // Toggle featured status
      job.featured = !job.featured;
      await job.save();

      res.status(200).json({
        success: true,
        message: `Job ${job.featured ? 'unfeatured' : 'featured'} successfully`,
        data: {
          job: {
            _id: job._id,
            title: job.title,
            featured: job.featured
          }
        }
      });
    } catch (error) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to toggle featured status"
      });
    }
  }
);

// POST /api/admin/jobs/:id/toggle-active - Toggle active status (admin only)
router.post(
  "/jobs/:id/toggle-active",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid job ID format"
        });
      }

      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found"
        });
      }

      // Toggle active status
      job.isActive = !job.isActive;
      await job.save();

      res.status(200).json({
        success: true,
        message: `Job ${job.isActive ? 'deactivated' : 'activated'} successfully`,
        data: {
          job: {
            _id: job._id,
            title: job.title,
            isActive: job.isActive
          }
        }
      });
    } catch (error) {
      console.error("Error toggling active status:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to toggle active status"
      });
    }
  }
);

// GET /api/admin/jobs/statistics - Get job statistics (admin only)
router.get(
  "/jobs/statistics",
  adminAuth,
  async (req, res) => {
    try {
      // Get comprehensive statistics
      const stats = await Job.aggregate([
        {
          $group: {
            _id: null,
            totalJobs: { $sum: 1 },
            activeJobs: {
              $sum: {
                $cond: [{ $eq: ["$isActive", true] }, 1, 0]
              }
            },
            featuredJobs: {
              $sum: {
                $cond: [{ $eq: ["$featured", true] }, 1, 0]
              }
            },
            expiredJobs: {
              $sum: {
                $cond: [{ $lt: ["$applicationDeadline", new Date()] }, 1, 0]
              }
            }
          }
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ["$isActive", true] }, 1, 0]
              }
            }
          }
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ["$isActive", true] }, 1, 0]
              }
            }
          }
        },
        {
          $group: {
            _id: "$experience",
            count: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ["$isActive", true] }, 1, 0]
              }
            }
          }
        }
      ]);

      // Get recent jobs
      const recentJobs = await Job.find()
        .populate("postedBy", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(5);

      // Get jobs expiring soon
      const expiringSoon = await Job.find({
        applicationDeadline: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        isActive: true
      })
        .populate("postedBy", "firstName lastName email")
        .sort({ applicationDeadline: 1 })
        .limit(5);

      res.status(200).json({
        success: true,
        data: {
          overview: stats[0] || {
            totalJobs: 0,
            activeJobs: 0,
            featuredJobs: 0,
            expiredJobs: 0
          },
          byCategory: stats[1] || [],
          byType: stats[2] || [],
          byExperience: stats[3] || [],
          recentJobs,
          expiringSoon
        }
      });
    } catch (error) {
      console.error("Error fetching job statistics:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to fetch job statistics"
      });
    }
  }
);

// POST /api/admin/jobs/bulk-operations - Bulk operations (admin only)
router.post(
  "/jobs/bulk-operations",
  adminAuth,
  [
    body("operation")
      .isIn(["delete", "activate", "deactivate", "feature", "unfeature"])
      .withMessage("Invalid operation"),

    body("jobIds")
      .isArray({ min: 1 })
      .withMessage("Job IDs must be an array with at least one ID"),
  ],
  async (req, res) => {
    try {
      const { operation, jobIds } = req.body;

      // Validate job IDs
      const validIds = jobIds.filter(id => id.match(/^[0-9a-fA-F]{24}$/));
      
      if (validIds.length !== jobIds.length) {
        return res.status(400).json({
          error: "Validation Error",
          message: "One or more invalid job IDs"
        });
      }

      let result;
      switch (operation) {
        case "delete":
          result = await Job.deleteMany({ _id: { $in: validIds } });
          break;
        case "activate":
          result = await Job.updateMany(
            { _id: { $in: validIds } },
            { isActive: true }
          );
          break;
        case "deactivate":
          result = await Job.updateMany(
            { _id: { $in: validIds } },
            { isActive: false }
          );
          break;
        case "feature":
          result = await Job.updateMany(
            { _id: { $in: validIds } },
            { featured: true }
          );
          break;
        case "unfeature":
          result = await Job.updateMany(
            { _id: { $in: validIds } },
            { featured: false }
          );
          break;
      }

      res.status(200).json({
        success: true,
        message: `Bulk ${operation} completed successfully`,
        data: {
          operation,
          processedCount: validIds.length,
          ...(operation === "delete" ? { deletedCount: result.deletedCount } : { modifiedCount: result.modifiedCount })
        }
      });
    } catch (error) {
      console.error("Error performing bulk operation:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to perform bulk operation"
      });
    }
  }
);

export default router;
