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

// Import routes
import jobsRouter from "./routes/jobs.js";
import contactsRouter from "./routes/contacts.js";
import applicationsRouter from "./routes/applications.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:4001",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-Total-Count"],
    preflightContinue: true,
    optionsSuccessStatus: 204,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

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

// API routes
app.use("/api/jobs", jobsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

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

// Database connection
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

    // Connect to MongoDB with explicit options
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully!");
    console.log("🗄️ Database Name:", mongoose.connection.name);
    console.log("🌐 Connection Host:", conn.connection.host);
    console.log("🔌 Connection Port:", conn.connection.port);
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

    // Test database operations
    const db = mongoose.connection.db;
    console.log("📋 Available Collections:");
    const collections = await db.listCollections().toArray();
    collections.forEach((collection) => {
      console.log("   -", collection.name);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.error("🔍 Error Details:", error.message);
    process.exit(1);
  }
};

// Start server with automatic port detection
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

    const availablePort = await findAvailablePort(DEFAULT_PORT);

    if (!availablePort) {
      console.error(
        "No available ports found. Please check your system configuration.",
      );
      process.exit(1);
    }

    app.listen(availablePort, "0.0.0.0", () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${availablePort}`,
      );
      console.log(
        `API documentation available at http://localhost:${availablePort}`,
      );

      if (availablePort !== parseInt(DEFAULT_PORT)) {
        console.log(
          `Note: Port ${DEFAULT_PORT} was in use, using port ${availablePort} instead`,
        );
      }
    });
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
