import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";

// Import routes
import jobsRouter from "./routes/jobs.js";
import contactsRouter from "./routes/contacts.js";
import applicationsRouter from "./routes/applications.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import pagesRouter from "./routes/pages.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Initialize Express app
const app = express();

app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allowed origins for both production and development
      const allowedOrigins = [
        "https://maplorix.ae", // Production domain
        "http://localhost:3000", // Local development
        "http://localhost:4001", // Backend fallback
        "http://localhost:5173", // Vite dev server
        "http://localhost:5174", // Alternative port
        "http://localhost:5175", // Alternative port
        "http://localhost:5176", // Alternative port
      ];
      // Allow environment-specific frontend URL
      if (
        process.env.FRONTEND_URL &&
        process.env.FRONTEND_URL !== "https://maplorix.ae"
      ) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-Total-Count"],
    preflightContinue: true,
    optionsSuccessStatus: 204,
  }),
);

// Rate limiting optimized for concurrent users
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5000, // Increased for concurrent users
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for development and health checks
    return (
      (process.env.NODE_ENV === "development" &&
        req.path.startsWith("/health")) ||
      req.path === "/api/jobs" // Allow more frequent job fetching
    );
  },
  // Add more granular rate limiting for sensitive endpoints
  keyGenerator: (req) => {
    // Use IP + user ID if available for more precise limiting
    return req.user ? `${req.ip}-${req.user._id}` : req.ip;
  },
  // Add concurrency-friendly options
  skipSuccessfulRequests: false, // Count successful requests
  skipFailedRequests: false, // Count failed requests
  // Add queue management for high traffic
  queueSize: 100, // Allow 100 requests to queue
  queueTimeout: 30 * 1000, // 30 seconds queue timeout
});
// General API rate limiting
app.use("/api/", limiter);

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs (increased for development)
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
// Rate limiting for application submissions (increased for multiple users)
const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 applications per hour (increased for concurrent users)
  message: {
    error: "Too many application submissions, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP + email for more precise limiting
    const email = req.body?.email || req.user?.email;
    return email ? `${req.ip}-${email}` : req.ip;
  },
});

// Request timeout middleware to prevent hanging requests
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    console.log("⏰ Request timeout for:", req.url);
    if (!res.headersSent) {
      res.status(408).json({
        error: "Request Timeout",
        message: "Request took too long to process",
      });
    }
  });
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes with specific rate limiting
app.use("/api/jobs", jobsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/applications", applicationLimiter, applicationsRouter);
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/pages", pagesRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Production: Serve frontend static build
if (process.env.NODE_ENV === "production") {
  // Serve static files from the frontend dist folder (Vite build output)
  const frontendDistPath = path.join(__dirname, "..", "maplorix", "dist");
  app.use(express.static(frontendDistPath));

  // Handle React routing, return index.html for all non-API routes
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api/") && !req.path.startsWith("/uploads/")) {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    }
  });
} else {
  // Development: Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Maplorix Backend API",
      version: "1.0.0",
      status: "running",
      environment: "development",
      endpoints: {
        jobs: "/api/jobs",
        contacts: "/api/contacts",
        applications: "/api/applications",
        auth: "/api/auth",
        admin: "/api/admin",
        health: "/health",
      },
    });
  });

  // Development: 404 handler for API routes only
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "Route not found",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Validation Error",
      message: errors.join(", "),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: "Duplicate Error",
      message: "Resource already exists",
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Authentication Error",
      message: "Invalid token",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

// MongoDB connection event listeners
mongoose.connection.on("connected", () => {
  console.log("🔌 Mongoose connected to MongoDB");
  console.log("🗄️ Active Database:", mongoose.connection.name);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected from MongoDB");
});

// Handle application termination
process.on("SIGINT", async () => {
  console.log("\n🛑 Application termination detected");
  console.log("🗄️ Closing database connection...");
  await mongoose.connection.close();
  console.log("✅ Database connection closed");
  process.exit(0);
});

// MongoDB connection - Updated for MongoDB v4 compatibility
const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variables
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix";

    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("📍 Connection URI:", mongoURI);

    // Extract database name from URI for logging
    const dbName = mongoURI.split("/").pop().split("?")[0];
    console.log("🎯 Target Database Name:", dbName);

    // Connect to MongoDB with connection pooling for concurrent users
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      // Enhanced connection pooling for high concurrency
      maxPoolSize: 100, // Increased for concurrent users
      minPoolSize: 10, // Maintain minimum connections
      maxIdleTimeMS: 30000, // Keep connections open for 30 seconds
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
      connectTimeoutMS: 10000, // How long to try connecting
      heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
      retryWrites: true, // Retry write operations
      retryReads: true, // Retry read operations
      family: 4, // Use IPv4, skip trying IPv6
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log("✅ MongoDB Connected Successfully!");
    console.log("🗄️ Database Name:", mongoose.connection.name);
    console.log("🌐 Connection Host:", conn.host || "localhost");
    console.log("🔌 Connection Port:", conn.port || 27017);
    console.log("📊 Connection State:", mongoose.connection.readyState);

    // Verify we're connected to the right database
    if (mongoose.connection.name === dbName) {
      console.log(
        "✅ Connected to correct database:",
        mongoose.connection.name,
      );
    } else {
      console.log("⚠️  Database name mismatch!");
      console.log("   Expected:", dbName);
      console.log("   Actual:", mongoose.connection.name);
    }

    // Test database operations - simplified for MongoDB v4 compatibility
    console.log("📋 Database connection verified");
    console.log("🎯 Ready to handle API requests!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.error("🔍 Error Details:", error.message);
    process.exit(1);
  }
};

// Start server with fixed port for development
const DEFAULT_PORT = process.env.PORT || 4000;

const findAvailablePort = async (startPort) => {
  const net = await import("net").then((mod) => mod.default);

  const tryPort = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.listen(port, "0.0.0.0", () => {
        const foundPort = server.address().port;
        server.close(() => resolve(foundPort));
      });

      server.on("error", () => {
        server.close(() => resolve(null));
      });
    });
  };

  // Try ports from startPort to startPort + 100
  for (let port = startPort; port < startPort + 100; port++) {
    const availablePort = await tryPort(port);
    if (availablePort) {
      return availablePort;
    }
  }

  return null; // No port available
};
const startServer = async () => {
  try {
    await connectDB();

    // Use fixed port 4000 for development, or environment variable for production
    const port =
      process.env.NODE_ENV === "production"
        ? await findAvailablePort(DEFAULT_PORT)
        : 4000;

    // HTTPS options (self-signed) - only for production
    let httpsOptions = null;
    if (process.env.NODE_ENV === "production") {
      try {
        httpsOptions = {
          key: fs.readFileSync("/etc/ssl/private/maplorix.key"),
          cert: fs.readFileSync("/etc/ssl/certs/maplorix.crt"),
        };
      } catch (error) {
        console.log("⚠️ SSL certificates not found, running HTTP only");
      }
    }
    // Create HTTPS server (production only) or HTTP server (development)
    if (httpsOptions && process.env.NODE_ENV === "production") {
      https.createServer(httpsOptions, app).listen(port, "0.0.0.0", () => {
        console.log(
          `🔒 HTTPS Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`,
        );
        console.log(`API documentation available at https://localhost:${port}`);
      });
    } else {
      // HTTP server for development
      app.listen(port, "0.0.0.0", () => {
        console.log(
          `🌐 HTTP Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`,
        );
        console.log(`API documentation available at http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err);
  // Don't exit the process, just log the error
  console.error("Promise:", promise);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Don't exit the process immediately, try to continue
  console.error("Server will continue running despite the error");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
