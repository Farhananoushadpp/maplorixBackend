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

// Send OTP to user's email (Check Duplicates & Send Email OTP)
export const sendOtp = async (req, res) => {
  try {
    const { email, mobile, phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        errorCode: "VALIDATION_ERROR",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const rawMobile = mobile || phone;
    const cleanMobile = rawMobile ? normalizeMobile(rawMobile) : null;

    // 1. Check if user already exists with Email or Mobile
    const existingEmail = await User.findOne({ email: normalizedEmail });
    const existingMobile = cleanMobile
      ? await User.findOne({ $or: [{ mobile: cleanMobile }, { phone: cleanMobile }] })
      : null;

    if (existingEmail && existingMobile) {
      return res.status(409).json({
        success: false,
        errorCode: "USER_ALREADY_EXISTS",
        message: "Both this email and mobile number are already registered",
      });
    }

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        errorCode: "EMAIL_ALREADY_EXISTS",
        message: "This email address is already registered",
      });
    }

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        errorCode: "MOBILE_ALREADY_EXISTS",
        message: "This mobile number is already registered",
      });
    }

    // 2. Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // 3. Save OTP in DB / OTP collection
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        otp,
        otpHash,
        mobile: cleanMobile || "",
        expiresAt: otpExpires,
        attempts: 0,
        isVerified: false,
        verificationToken: null,
      },
      { upsert: true, new: true }
    );

    // 4. Send Email containing the OTP
    await sendOtpEmail({
      to: normalizedEmail,
      subject: "Maplorix - Your Email Verification Code",
      text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
      html: `<h2>Maplorix Verification Code</h2><p>Your 6-digit code is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      errorCode: "SERVER_ERROR",
    });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
        errorCode: "VALIDATION_ERROR",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const cleanOtp = String(otp).trim();

    const record = await Otp.findOne({ email: normalizedEmail });

    if (!record) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_OTP",
        message: "Invalid OTP code. Please check and try again.",
      });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({
        success: false,
        errorCode: "OTP_EXPIRED",
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.attempts >= 5) {
      return res.status(400).json({
        success: false,
        errorCode: "MAX_OTP_ATTEMPTS_EXCEEDED",
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      });
    }

    const providedHash = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    const isMatch =
      (record.otp && record.otp === cleanOtp) ||
      (record.otpHash && record.otpHash === providedHash);

    if (!isMatch) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_OTP",
        message: "Invalid OTP code. Please check and try again.",
      });
    }

    // OTP is valid - mark verified and issue temporary token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    record.isVerified = true;
    record.verificationToken = verificationToken;
    await record.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        verificationToken,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
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
    const rawMobile = mobile || phone;
    const normalizedMobile = rawMobile ? normalizeMobile(rawMobile) : null;

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
        errorCode: "VALIDATION_ERROR",
      });
    }

    // Check if user already exists by email or mobile
    const existingEmail = await User.findOne({ email: normalizedEmail });
    const existingMobile = normalizedMobile
      ? await User.findOne({ $or: [{ mobile: normalizedMobile }, { phone: normalizedMobile }] })
      : null;

    if (existingEmail && existingMobile) {
      return res.status(409).json({
        success: false,
        errorCode: "USER_ALREADY_EXISTS",
        message: "Both this email and mobile number are already registered",
      });
    }

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        errorCode: "EMAIL_ALREADY_EXISTS",
        message: "This email address is already registered",
      });
    }

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        errorCode: "MOBILE_ALREADY_EXISTS",
        message: "This mobile number is already registered",
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
      const field = Object.keys(error.keyPattern || {})[0] || "";
      if (field === "email") {
        return res.status(409).json({
          success: false,
          errorCode: "EMAIL_ALREADY_EXISTS",
          message: "This email address is already registered",
        });
      }
      if (field === "mobile" || field === "phone") {
        return res.status(409).json({
          success: false,
          errorCode: "MOBILE_ALREADY_EXISTS",
          message: "This mobile number is already registered",
        });
      }
      return res.status(409).json({
        success: false,
        errorCode: "USER_ALREADY_EXISTS",
        message: "User already exists with this email or mobile",
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
