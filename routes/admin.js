import express from "express";
import { query, param } from "express-validator";
import {
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
} from "../controllers/jobController.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// GET /api/admin/jobs - Get all jobs with admin controls (admin only)
router.get(
  "/jobs",
  adminAuth, // Admin authentication required
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
      .isIn(["all", "active", "inactive", "featured"])
      .withMessage("Invalid status filter"),

    query("category")
      .optional()
      .isIn([
        "Technology",
        "Healthcare",
        "Finance",
        "Marketing",
        "Sales",
        "Education",
        "Engineering",
        "Design",
        "Customer Service",
        "Human Resources",
        "Operations",
        "Legal",
        "Other",
      ])
      .withMessage("Invalid category"),

    query("type")
      .optional()
      .isIn([
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Remote",
        "Hybrid",
      ])
      .withMessage("Invalid job type"),
  ],
  getAllJobs,
);

// GET /api/admin/jobs/stats - Get job statistics (admin only)
router.get("/jobs/stats", adminAuth, getJobStats);

// GET /api/admin/jobs/:id - Get specific job by ID (admin only)
router.get(
  "/jobs/:id",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid job ID"),
  ],
  getJobById,
);

// PUT /api/admin/jobs/:id - Update job (admin only)
router.put(
  "/jobs/:id",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid job ID"),

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
      .isIn([
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Remote",
        "Hybrid",
      ])
      .withMessage("Invalid job type"),

    body("category")
      .optional()
      .isIn([
        "Technology",
        "Healthcare",
        "Finance",
        "Marketing",
        "Sales",
        "Education",
        "Engineering",
        "Design",
        "Customer Service",
        "Human Resources",
        "Operations",
        "Legal",
        "Other",
      ])
      .withMessage("Invalid category"),

    body("experience")
      .optional()
      .isIn([
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
        "Fresher",
      ])
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

    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("Active status must be a boolean"),
  ],
  updateJob,
);

// DELETE /api/admin/jobs/:id - Delete job (admin only)
router.delete(
  "/jobs/:id",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid job ID"),
  ],
  deleteJob,
);

// POST /api/admin/jobs/:id/toggle-featured - Toggle featured status (admin only)
router.post(
  "/jobs/:id/toggle-featured",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid job ID"),
  ],
  async (req, res) => {
    try {
      const Job = await import("../models/Job.js").then(m => m.default);
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found",
        });
      }

      job.featured = !job.featured;
      await job.save();

      res.status(200).json({
        success: true,
        message: `Job ${job.featured ? "featured" : "unfeatured"} successfully`,
        data: {
          job,
        },
      });
    } catch (error) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to toggle featured status",
      });
    }
  },
);

// POST /api/admin/jobs/:id/toggle-active - Toggle active status (admin only)
router.post(
  "/jobs/:id/toggle-active",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid job ID"),
  ],
  async (req, res) => {
    try {
      const Job = await import("../models/Job.js").then(m => m.default);
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          error: "Not Found",
          message: "Job not found",
        });
      }

      job.isActive = !job.isActive;
      await job.save();

      res.status(200).json({
        success: true,
        message: `Job ${job.isActive ? "activated" : "deactivated"} successfully`,
        data: {
          job,
        },
      });
    } catch (error) {
      console.error("Error toggling active status:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to toggle active status",
      });
    }
  },
);

// DELETE /api/admin/jobs/bulk - Bulk delete jobs (admin only)
router.delete(
  "/jobs/bulk",
  adminAuth,
  [
    body("jobIds")
      .isArray({ min: 1 })
      .withMessage("Job IDs must be an array"),
  ],
  async (req, res) => {
    try {
      const Job = await import("../models/Job.js").then(m => m.default);
      const { jobIds } = req.body;

      const result = await Job.deleteMany({ _id: { $in: jobIds } });

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} jobs deleted successfully`,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      console.error("Error bulk deleting jobs:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to delete jobs",
      });
    }
  },
);

export default router;
