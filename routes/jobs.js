import express from "express";

import { query, body } from "express-validator";

import {
  getAllJobs,
  getFeaturedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  handleValidationErrors,
} from "../controllers/jobController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/jobs - Get all jobs with filtering and pagination

router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),

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

    query("experience")
      .optional()
      .isIn([
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
        "Fresher",
      ])
      .withMessage("Invalid experience level"),

    query("location")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Location must be at least 2 characters"),

    query("search")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Search term must be at least 2 characters"),

    query("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be a boolean"),

    query("active")
      .optional()
      .isBoolean()
      .withMessage("Active must be a boolean"),

    query("sortBy")
      .optional()
      .isIn(["createdAt", "title", "company", "location", "salary.min"])
      .withMessage("Invalid sort field"),

    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  handleValidationErrors,
  getAllJobs,
);

// GET /api/jobs/featured - Get featured jobs

router.get(
  "/featured",
  [
    query("limit")
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage("Limit must be between 1 and 20"),
  ],
  handleValidationErrors,
  getFeaturedJobs,
);

// GET /api/jobs/stats - Get job statistics (protected)

router.get("/stats", auth, getJobStats);

// GET /api/jobs/:id - Get single job by ID

router.get("/:id", getJobById);

// POST /api/jobs - Create new job (protected)

router.post(
  "/",
  auth,
  [
    body("title")
      .notEmpty()
      .withMessage("Job title is required")
      .isLength({ min: 3, max: 200 })
      .withMessage("Title must be between 3 and 200 characters"),

    body("company")
      .notEmpty()
      .withMessage("Company name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Company must be between 2 and 100 characters"),

    body("location")
      .notEmpty()
      .withMessage("Location is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Location must be between 2 and 100 characters"),

    body("type")
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
      .isIn([
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
        "Fresher",
      ])
      .withMessage("Invalid experience level"),

    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 50 })
      .withMessage("Description must be at least 50 characters"),

    body("requirements")
      .notEmpty()
      .withMessage("Requirements are required")
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

    body("salaryMin")
      .optional()
      .isNumeric()
      .withMessage("Minimum salary must be a number"),

    body("salaryMax")
      .optional()
      .isNumeric()
      .withMessage("Maximum salary must be a number"),

    body("currency")
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
  handleValidationErrors,
  createJob,
);

// PUT /api/jobs/:id - Update job (protected)

router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .notEmpty()
      .withMessage("Job title cannot be empty")
      .isLength({ min: 3, max: 200 })
      .withMessage("Title must be between 3 and 200 characters"),

    body("company")
      .optional()
      .notEmpty()
      .withMessage("Company name cannot be empty")
      .isLength({ min: 2, max: 100 })
      .withMessage("Company must be between 2 and 100 characters"),

    body("location")
      .optional()
      .notEmpty()
      .withMessage("Location cannot be empty")
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

    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty")
      .isLength({ min: 50 })
      .withMessage("Description must be at least 50 characters"),

    body("requirements")
      .optional()
      .notEmpty()
      .withMessage("Requirements cannot be empty")
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
  handleValidationErrors,
  updateJob,
);

// DELETE /api/jobs/:id - Delete job (protected)

router.delete("/:id", auth, deleteJob);

export default router;
