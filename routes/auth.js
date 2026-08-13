import express from "express";
import { body } from "express-validator";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  handleValidationErrors,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { verifyRecaptcha } from "../middleware/recaptcha.js";

const router = express.Router();

// POST /api/auth/send-otp - Request OTP for registration
router.post(
  "/send-otp",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("mobile")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Mobile number cannot exceed 20 characters"),
  ],
  handleValidationErrors,
  sendOtp
);

// POST /api/auth/verify-otp - Verify OTP for registration
router.post(
  "/verify-otp",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("otp")
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  handleValidationErrors,
  verifyOtp
);

// POST /api/auth/register - Register a new user
router.post(
  "/register",
  verifyRecaptcha,
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

    body("mobile")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Mobile number cannot exceed 20 characters"),

    body("phone")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Phone number cannot exceed 20 characters"),

    body("visaStatus")
      .optional()
      .isIn(["visitVisa", "residenceVisa", "spouseVisa"])
      .withMessage("visaStatus must be visitVisa, residenceVisa, or spouseVisa"),

    body("nationality")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Nationality cannot exceed 100 characters"),

    body("currentlyLocated")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Currently located cannot exceed 100 characters"),

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
  ],
  handleValidationErrors,
  register
);

// POST /api/auth/login - Login user
router.post(
  "/login",
  verifyRecaptcha,
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  login
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

    body("mobile")
      .optional()
      .isLength({ max: 20 })
      .withMessage("Mobile number cannot exceed 20 characters"),

    body("visaStatus")
      .optional()
      .isIn(["visitVisa", "residenceVisa", "spouseVisa"])
      .withMessage("visaStatus must be visitVisa, residenceVisa, or spouseVisa"),

    body("profile.bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),

    body("profile.linkedin")
      .optional()
      .isURL()
      .withMessage("Please enter a valid LinkedIn URL"),
  ],
  handleValidationErrors,
  updateProfile
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
  changePassword
);

export default router;
