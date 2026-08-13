import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication Error",
        message: "No token provided, authorization denied",
        errorCode: "UNAUTHORIZED",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Find user directly from database without global cache interference
    const user = await User.findById(decoded.userId).select("-password -__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication Error",
        message: "Token is valid but user not found",
        errorCode: "UNAUTHORIZED",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Authentication Error",
        message: "Your account has been deactivated",
        errorCode: "ACCOUNT_DEACTIVATED",
      });
    }

    // Attach user document to isolated request object
    req.user = user;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Authentication middleware error:", error);
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Authentication Error",
        message: "Invalid token",
        errorCode: "INVALID_TOKEN",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Authentication Error",
        message: "Token expired",
        errorCode: "TOKEN_EXPIRED",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Authentication server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

export default auth;
