import { validationResult } from "express-validator";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Contact from "../models/Contact.js";

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

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, message } = req.body;

    console.log("🔍 Registration attempt:");
    console.log("  First Name:", firstName);
    console.log("  Last Name:", lastName);
    console.log("  Email:", email);
    console.log("  Phone:", phone);
    console.log("  Request body:", JSON.stringify(req.body));

    // Check database connection
    console.log("  DB state:", mongoose.connection.readyState);
    console.log("  DB host:", mongoose.connection.host);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("  Existing user found:", !!existingUser);

    if (existingUser) {
      console.log("  User already exists with email:", email);
      return res.status(400).json({
        error: "Registration Error",
        message: "User with this email already exists",
      });
    }

    // Step 1: Save basic details to Contacts collection
    console.log("  Step 1: Creating contact...");
    const contact = new Contact({
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone || "",
      subject: "User Registration",
      message: message || "New user registration",
      category: "general",
      status: "pending",
    });

    console.log("  Contact object created:", !!contact);
    await contact.save();
    console.log("  Contact saved successfully. ID:", contact._id);

    // Step 2: Create login credentials in Users collection
    console.log("  Step 2: Creating user...");
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: "user", // Default role as per requirements
      department: "General",
      phone: phone || "",
    });

    console.log("  User object created:", !!user);
    await user.save();
    console.log("  User saved successfully. ID:", user._id);

    // Step 3: Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
        },
        routing: {
          redirectTo: user.role === "admin" ? "/admin/dashboard" : "/website",
          role: user.role,
          isAdmin: user.role === "admin",
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to register user",
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Login attempt:");
    console.log("  Email:", email);
    console.log("  Password provided:", !!password);
    console.log("  Request body:", JSON.stringify(req.body));

    // Check database connection
    console.log("  DB state:", mongoose.connection.readyState);
    console.log("  DB host:", mongoose.connection.host);

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    console.log("  User found:", !!user);

    if (user) {
      console.log("  User email:", user.email);
      console.log("  User active:", user.isActive);
      console.log("  Password exists:", !!user.password);
    } else {
      // Try to find all users to see what's in DB
      const allUsers = await User.find({});
      console.log("  All users in DB:", allUsers.length);
      allUsers.forEach((u) => console.log("    -", u.email));
    }

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        error: "Authentication Error",
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log("❌ User is not active");
      return res.status(401).json({
        error: "Authentication Error",
        message: "Your account has been deactivated",
      });
    }

    // Compare password
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
      console.log("  Password valid:", isPasswordValid);
    } catch (error) {
      console.error("  Password comparison error:", error);
      return res.status(500).json({
        error: "Server Error",
        message: "Password verification failed",
      });
    }

    if (!isPasswordValid) {
      console.log("❌ Password comparison failed");
      return res.status(401).json({
        error: "Authentication Error",
        message: "Invalid email or password",
      });
    }

    console.log("✅ Login successful for:", user.email);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
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
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);

    // Check for specific error types
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid Data",
        message: "Invalid email format",
      });
    }

    res.status(500).json({
      error: "Server Error",
      message: "Failed to login",
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Invalid token or user not found",
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Invalid or expired token",
      });
    }
    res.status(500).json({
      error: "Server Error",
      message: "Failed to refresh token",
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    // Get user from database using _id from JWT token
    const user = await User.findById(req.user._id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "User not found",
      });
    }

    // Get user permissions
    const permissions = user.getPermissions();

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          phone: user.phone,
          isActive: user.isActive,
          permissions: user.permissions,
          profile: user.profile,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          fullName: user.fullName,
          timeSinceLastLogin: user.timeSinceLastLogin,
          id: user._id,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch user profile",
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "User not found",
      });
    }

    // Update user
    const updates = req.body;
    Object.assign(user, updates);
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to update profile",
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "User not found",
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to change password",
    });
  }
};

export { handleValidationErrors };
