import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  handleValidationErrors,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post(
  "/register",
  [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .optional()
      .isIn(["admin", "hr", "recruiter", "manager", "user"])
      .withMessage("Invalid role"),
    body("department")
      .optional()
      .isIn([
        "IT",
        "HR",
        "Sales",
        "Marketing",
        "Operations",
        "Finance",
        "Legal",
        "General",
      ])
      .withMessage("Invalid department"),
    body("phone")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Phone number cannot exceed 20 characters"),
    body("message")
      .optional()
      .isLength({ max: 2000 })
      .withMessage("Message cannot exceed 2000 characters"),
  ],
  handleValidationErrors,
  register,
);

// POST /api/auth/login - Login user
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  login,
);

// POST /api/auth/refresh - Refresh token
router.post("/refresh", refreshToken);

// GET /api/auth/me - Get current user profile
router.get("/me", auth, getProfile);

// PUT /api/auth/me - Update current user profile
router.put(
  "/me",
  auth,
  [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name cannot be empty")
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .optional()
      .notEmpty()
      .withMessage("Last name cannot be empty")
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("phone")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Phone number cannot exceed 20 characters"),
    body("profile.bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("profile.linkedin")
      .optional()
      .isURL()
      .withMessage("Please enter a valid LinkedIn URL"),
  ],
  updateProfile,
);

// POST /api/auth/change-password - Change password
router.post(
  "/change-password",
  auth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  handleValidationErrors,
  changePassword,
);

export default router;
