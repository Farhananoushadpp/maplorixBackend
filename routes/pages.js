import express from "express";
import { checkPageAccess } from "../middleware/roleAuth.js";
import auth from "../middleware/auth.js";
import {
  getPageAccess,
  getNavigation,
  getPublicPages,
} from "../controllers/pageController.js";

const router = express.Router();

// GET /api/pages/access/:pageName - Check if user can access a specific page
router.get("/access/:pageName", auth, checkPageAccess, getPageAccess);

// GET /api/pages/navigation - Get user's accessible navigation pages
router.get("/navigation", auth, getNavigation);

// GET /api/pages/public - Get public pages (no auth required)
router.get("/public", getPublicPages);

export default router;
