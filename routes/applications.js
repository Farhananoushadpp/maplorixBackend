import express from "express";
import { query, body } from "express-validator";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  downloadResume,
  getApplicationStats,
  searchCandidates,
  handleValidationErrors,
} from "../controllers/applicationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes"));
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// POST /api/applications - Submit a new job application
router.post(
  "/",
  upload.single("resume"),
  [
    body("fullName")
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 10, max: 20 })
      .withMessage("Phone number must be between 10 and 20 characters"),
    body("location")
      .notEmpty()
      .withMessage("Location is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Location must be between 2 and 100 characters"),
    body("jobRole")
      .notEmpty()
      .withMessage("Job role is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Job role must be between 2 and 100 characters"),
    body("experience")
      .isIn([
        "fresher",
        "1-3",
        "3-5",
        "5+",
        "10+",
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
      ])
      .withMessage("Invalid experience level"),
    body("skills")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Skills cannot exceed 1000 characters"),
    body("currentCompany")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Current company cannot exceed 100 characters"),
    body("currentDesignation")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Current designation cannot exceed 100 characters"),
    body("expectedSalary.min")
      .optional()
      .isNumeric()
      .withMessage("Minimum expected salary must be a number"),
    body("expectedSalary.max")
      .optional()
      .isNumeric()
      .withMessage("Maximum expected salary must be a number"),
    body("expectedSalary.currency")
      .optional()
      .isIn(["USD", "EUR", "GBP", "CAD", "AUD", "INR"])
      .withMessage("Invalid currency"),
    body("noticePeriod")
      .optional()
      .isIn([
        "immediate",
        "15 days",
        "30 days",
        "60 days",
        "90 days",
        "negotiable",
      ])
      .withMessage("Invalid notice period"),
    body("job").isMongoId().withMessage("Invalid job ID"),
    body("coverLetter")
      .optional()
      .isLength({ max: 5000 })
      .withMessage("Cover letter cannot exceed 5000 characters"),
    body("linkedinProfile")
      .optional()
      .isURL()
      .withMessage("Please enter a valid LinkedIn profile URL"),
    body("portfolio")
      .optional()
      .isURL()
      .withMessage("Please enter a valid portfolio URL"),
    body("github")
      .optional()
      .isURL()
      .withMessage("Please enter a valid GitHub profile URL"),
    body("website")
      .optional()
      .isURL()
      .withMessage("Please enter a valid website URL"),
    body("source")
      .optional()
      .isIn([
        "website",
        "linkedin",
        "referral",
        "job-board",
        "social-media",
        "employee-referral",
        "campus-drive",
        "walk-in",
        "other",
      ])
      .withMessage("Invalid source"),
    body("gender")
      .optional()
      .isIn(["male", "female", "other", "prefer-not-to-say"])
      .withMessage("Invalid gender"),
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Please enter a valid date of birth"),
    body("nationality")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Nationality cannot exceed 100 characters"),
    body("workAuthorization")
      .optional()
      .isIn([
        "citizen",
        "permanent-resident",
        "work-permit",
        "student-visa",
        "tourist-visa",
        "other",
      ])
      .withMessage("Invalid work authorization"),
    body("availability")
      .optional()
      .isIn([
        "immediate",
        "1-week",
        "2-weeks",
        "1-month",
        "2-months",
        "3-months",
        "negotiable",
      ])
      .withMessage("Invalid availability"),
    body("expectedStartDate")
      .optional()
      .isISO8601()
      .withMessage("Please enter a valid expected start date"),
    body("salaryNegotiable")
      .optional()
      .isBoolean()
      .withMessage("Salary negotiable must be a boolean"),
    body("relocation")
      .optional()
      .isBoolean()
      .withMessage("Relocation must be a boolean"),
    body("remoteWork")
      .optional()
      .isBoolean()
      .withMessage("Remote work must be a boolean"),
  ],
  handleValidationErrors,
  submitApplication,
);

// GET /api/applications - Get all applications (protected)
router.get(
  "/",
  auth,
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
      .isIn([
        "submitted",
        "under-review",
        "shortlisted",
        "interview-scheduled",
        "interviewed",
        "rejected",
        "selected",
        "withdrawn",
      ])
      .withMessage("Invalid status"),
    query("jobRole")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Job role must be at least 2 characters"),
    query("experience")
      .optional()
      .isIn([
        "fresher",
        "1-3",
        "3-5",
        "5+",
        "10+",
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
      ])
      .withMessage("Invalid experience level"),
    query("search")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Search term must be at least 2 characters"),
    query("sortBy")
      .optional()
      .isIn([
        "createdAt",
        "fullName",
        "email",
        "jobRole",
        "status",
        "experience",
      ])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  handleValidationErrors,
  getAllApplications,
);

// GET /api/applications/stats - Get application statistics (protected)
router.get("/stats", auth, getApplicationStats);

// GET /api/applications/search - Search candidates with filters (protected)
router.get(
  "/search",
  auth,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("jobRole")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Job role must be at least 2 characters"),
    query("experience")
      .optional()
      .isIn([
        "fresher",
        "1-3",
        "3-5",
        "5+",
        "10+",
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Executive",
      ])
      .withMessage("Invalid experience level"),
    query("keyword")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Keyword must be at least 2 characters"),
    query("status")
      .optional()
      .isIn([
        "submitted",
        "under-review",
        "shortlisted",
        "interview-scheduled",
        "interviewed",
        "rejected",
        "selected",
        "withdrawn",
      ])
      .withMessage("Invalid status"),
    query("location")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Location must be at least 2 characters"),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "fullName", "experience", "jobRole", "status"])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  handleValidationErrors,
  searchCandidates,
);

// GET /api/applications - Get single application (protected)
router.get("/:id", auth, getApplicationById);

// GET /api/applications/:id/resume - Download resume (protected)
router.get("/:id/resume", auth, downloadResume);

// PUT /api/applications/:id - Update application (protected)
router.put(
  "/:id",
  auth,
  [
    body("status")
      .optional()
      .isIn([
        "submitted",
        "under-review",
        "shortlisted",
        "interview-scheduled",
        "interviewed",
        "rejected",
        "selected",
        "withdrawn",
      ])
      .withMessage("Invalid status"),
    body("reviewNotes")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Review notes cannot exceed 1000 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    body("interviewDate")
      .optional()
      .isISO8601()
      .withMessage("Please enter a valid interview date"),
    body("interviewType")
      .optional()
      .isIn(["phone", "video", "in-person", "technical", "panel"])
      .withMessage("Invalid interview type"),
    body("interviewNotes")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Interview notes cannot exceed 1000 characters"),
  ],
  handleValidationErrors,
  updateApplication,
);

// DELETE /api/applications/:id - Delete application (protected)
router.delete("/:id", auth, deleteApplication);

export default router;
