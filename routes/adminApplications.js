import express from "express";
import { query, param } from "express-validator";
import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} from "../controllers/applicationController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// GET /api/admin/applications - Get all applications with admin controls (admin only)
router.get(
  "/applications",
  adminAuth,
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
      .isIn(["all", "pending", "reviewed", "shortlisted", "rejected", "hired"])
      .withMessage("Invalid status filter"),

    query("jobId")
      .optional()
      .isMongoId()
      .withMessage("Invalid job ID"),

    query("search")
      .optional()
      .isLength({ min: 1 })
      .withMessage("Search term cannot be empty"),
  ],
  getAllApplications,
);

// GET /api/admin/applications/stats - Get application statistics (admin only)
router.get("/applications/stats", adminAuth, getApplicationStats);

// GET /api/admin/applications/:id - Get specific application by ID (admin only)
router.get(
  "/applications/:id",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid application ID"),
  ],
  getApplicationById,
);

// PUT /api/admin/applications/:id - Update application status (admin only)
router.put(
  "/applications/:id",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid application ID"),

    body("status")
      .isIn(["pending", "reviewed", "shortlisted", "rejected", "hired"])
      .withMessage("Invalid status"),

    body("notes")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Notes cannot exceed 1000 characters"),
  ],
  updateApplicationStatus,
);

// DELETE /api/admin/applications/:id - Delete application (admin only)
router.delete(
  "/applications/:id",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid application ID"),
  ],
  deleteApplication,
);

// POST /api/admin/applications/:id/shortlist - Shortlist application (admin only)
router.post(
  "/applications/:id/shortlist",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid application ID"),
  ],
  async (req, res) => {
    try {
      const Application = await import("../models/Application.js").then(m => m.default);
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({
          error: "Not Found",
          message: "Application not found",
        });
      }

      application.status = "shortlisted";
      await application.save();

      res.status(200).json({
        success: true,
        message: "Application shortlisted successfully",
        data: {
          application,
        },
      });
    } catch (error) {
      console.error("Error shortlisting application:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to shortlist application",
      });
    }
  },
);

// POST /api/admin/applications/:id/reject - Reject application (admin only)
router.post(
  "/applications/:id/reject",
  adminAuth,
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid application ID"),
  ],
  async (req, res) => {
    try {
      const Application = await import("../models/Application.js").then(m => m.default);
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({
          error: "Not Found",
          message: "Application not found",
        });
      }

      application.status = "rejected";
      await application.save();

      res.status(200).json({
        success: true,
        message: "Application rejected successfully",
        data: {
          application,
        },
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to reject application",
      });
    }
  },
);

// DELETE /api/admin/applications/bulk - Bulk delete applications (admin only)
router.delete(
  "/applications/bulk",
  adminAuth,
  [
    body("applicationIds")
      .isArray({ min: 1 })
      .withMessage("Application IDs must be an array"),
  ],
  async (req, res) => {
    try {
      const Application = await import("../models/Application.js").then(m => m.default);
      const { applicationIds } = req.body;

      const result = await Application.deleteMany({ _id: { $in: applicationIds } });

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} applications deleted successfully`,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      console.error("Error bulk deleting applications:", error);
      res.status(500).json({
        error: "Server Error",
        message: "Failed to delete applications",
      });
    }
  },
);

export default router;
