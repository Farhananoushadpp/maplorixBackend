import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Enhanced in-memory cache for user sessions (for production, use Redis)
const userCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // Increased to 10 minutes for better performance
const MAX_CACHE_SIZE = 2000; // Increased cache size for concurrent users

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "No token provided, authorization denied",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with async-friendly options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Check cache first for better performance
    const cacheKey = `user-${decoded.userId}`;
    const cachedUser = userCache.get(cacheKey);

    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_TTL) {
      // Use cached user data
      req.user = cachedUser.data;
      return next();
    }

    // Find user with optimized lean query and projection
    const user = await User.findById(decoded.userId, {
      password: 0, // Exclude password field
      __v: 0, // Exclude version field
    })
      .lean()
      .exec();

    if (!user) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Token is valid but user not found",
      });
    }

    // Check if user is active (early return to avoid unnecessary operations)
    if (!user.isActive) {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Your account has been deactivated",
      });
    }

    // Cache the user data with memory management
    if (userCache.size >= MAX_CACHE_SIZE) {
      // Clean up oldest entries when cache is full
      const now = Date.now();
      const entries = Array.from(userCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      // Remove oldest 25% of entries
      const toRemove = Math.floor(MAX_CACHE_SIZE * 0.25);
      for (let i = 0; i < toRemove; i++) {
        userCache.delete(entries[i][0]);
      }
    }

    userCache.set(cacheKey, {
      data: user,
      timestamp: Date.now(),
    });

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    // Reduce console logging in production to avoid log spam
    if (process.env.NODE_ENV === "development") {
      console.error("Authentication middleware error:", error);
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Authentication Error",
        message: "Token expired",
      });
    }

    res.status(500).json({
      error: "Server Error",
      message: "Authentication server error",
    });
  }
};

export default auth;
