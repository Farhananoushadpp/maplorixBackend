import { validationResult } from "express-validator";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../services/emailService.js";

// Helper normalizers
const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : "");
const normalizeMobile = (mobile) => (mobile ? String(mobile).trim().replace(/\s+/g, "") : "");

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: errors
        .array()
        .map((err) => err.msg)
        .join(", "),
      errorCode: "VALIDATION_ERROR",
    });
  }
  next();
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Send OTP to user's email
export const sendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const mobile = normalizeMobile(req.body.mobile || req.body.phone);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Check if user already exists by email or mobile
    const existingUserFilter = [{ email }];
    if (mobile) {
      existingUserFilter.push({ mobile }, { phone: mobile });
    }

    const existingUser = await User.findOne({ $or: existingUserFilter });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
        errorCode: "USER_ALREADY_EXISTS",
      });
    }

    // Generate 6-digit numeric OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash("sha256").update(rawOtp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

    // Remove any existing OTP for this email
    await Otp.deleteMany({ email });

    // Create new OTP document
    const otpDoc = new Otp({
      email,
      mobile: mobile || "",
      otpHash,
      expiresAt,
      attempts: 0,
      isVerified: false,
    });

    await otpDoc.save();

    // Dispatch OTP via email (do NOT log or return raw OTP)
    await sendOtpEmail(email, rawOtp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const rawOtp = req.body.otp ? String(req.body.otp).trim() : "";

    if (!email || !rawOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.isVerified || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or is invalid.",
        errorCode: "INVALID_OTP",
      });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
        errorCode: "MAX_OTP_ATTEMPTS_EXCEEDED",
      });
    }

    otpRecord.attempts += 1;

    const providedHash = crypto.createHash("sha256").update(rawOtp).digest("hex");
    if (providedHash !== otpRecord.otpHash) {
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
        errorCode: "INVALID_OTP",
      });
    }

    // OTP is valid - mark verified and issue temporary token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    otpRecord.isVerified = true;
    otpRecord.verificationToken = verificationToken;
    await otpRecord.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      data: {
        verificationToken,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      phone,
      nationality,
      currentlyLocated,
      visaStatus,
      attachedCv,
      message,
    } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedMobile = normalizeMobile(mobile || phone);

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Check if user already exists by email or mobile
    const existingUserFilter = [{ email: normalizedEmail }];
    if (normalizedMobile) {
      existingUserFilter.push({ mobile: normalizedMobile }, { phone: normalizedMobile });
    }

    const existingUser = await User.findOne({ $or: existingUserFilter });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
        errorCode: "USER_ALREADY_EXISTS",
      });
    }

    // Validate visaStatus enum if provided
    const validVisaStatuses = ["visitVisa", "residenceVisa", "spouseVisa"];
    if (visaStatus && !validVisaStatuses.includes(visaStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visaStatus. Must be visitVisa, residenceVisa, or spouseVisa.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Optional: Save contact entry
    try {
      const contact = new Contact({
        name: `${firstName} ${lastName}`,
        email: normalizedEmail,
        phone: normalizedMobile || "",
        subject: "User Registration",
        message: message || "New user registration",
        category: "general",
        status: "pending",
      });
      await contact.save();
    } catch (contactErr) {
      console.warn("Contact entry creation warning:", contactErr.message);
    }

    // Create user document
    const user = new User({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: normalizedEmail,
      mobile: normalizedMobile || undefined,
      phone: normalizedMobile || "",
      password,
      nationality: nationality?.trim(),
      currentlyLocated: currentlyLocated?.trim(),
      visaStatus: visaStatus || undefined,
      attachedCv: attachedCv || undefined,
      role: req.body.role || "user",
      department: req.body.department || "General",
    });

    await user.save();

    // Clean up OTP document if one existed for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // Generate JWT token
    const token = generateToken(user._id);

    // Omit password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      data: {
        user: userResponse,
        token,
        routing: {
          redirectTo: user.role === "admin" ? "/admin/dashboard" : "/website",
          role: user.role,
          isAdmin: user.role === "admin",
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
        errorCode: "USER_ALREADY_EXISTS",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
        errorCode: "VALIDATION_ERROR",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register user.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated.",
        errorCode: "ACCOUNT_DEACTIVATED",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: userResponse,
        token,
        routing: {
          redirectTo: user.role === "admin" ? "/admin/dashboard" : "/website",
          role: user.role,
          isAdmin: user.role === "admin",
        },
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
        errorCode: "UNAUTHORIZED",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user not found.",
        errorCode: "UNAUTHORIZED",
      });
    }

    const newToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      errorCode: "UNAUTHORIZED",
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
        errorCode: "UNAUTHORIZED",
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          ...userResponse,
          permissions: user.getPermissions(),
          fullName: user.fullName,
          timeSinceLastLogin: user.timeSinceLastLogin,
          id: user._id,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
        errorCode: "UNAUTHORIZED",
      });
    }

    const updates = req.body;
    delete updates.password; // Don't allow password update via profile endpoint
    delete updates.role; // Don't allow role escalation

    Object.assign(user, updates);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: userResponse,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
        errorCode: "UNAUTHORIZED",
      });
    }

    const { currentPassword, newPassword } = req.body;
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
      errorCode: "SERVER_ERROR",
    });
  }
};

export { handleValidationErrors };
