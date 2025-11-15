/**
 * Report Routes
 * 
 * RESTful API Design:
 * GET /api/reports - Get all reports (with optional filters)
 * POST /api/reports - Create new report (protected)
 * GET /api/reports/stats - Get statistics (admin only)
 * GET /api/reports/my - Get user's own reports (protected)
 * GET /api/reports/:id - Get single report
 * PUT /api/reports/:id - Update report status (admin only)
 * DELETE /api/reports/:id - Delete report (protected, own reports or admin)
 */

import { Router } from "express";
import * as reportController from "../controllers/reportController";
import { createReportValidation, updateReportValidation, validate } from "../middleware/validation";
import { protect, adminOnly } from "../middleware/auth";
import imageUploader from "./image_upload";

const router = Router();

// Public routes
router.get("/", reportController.getAllReports);
router.get("/:id", reportController.getReportById);

// Protected routes - require authentication
router.post("/", protect, createReportValidation, validate, reportController.createReport);
router.get("/my/reports", protect, reportController.getMyReports);
router.delete("/:id", protect, reportController.deleteReport);
router.use("/image", imageUploader); // Image upload routes

// Admin only routes
router.put("/:id", protect, adminOnly, updateReportValidation, validate, reportController.updateReport);
router.get("/admin/stats", protect, adminOnly, reportController.getReportStats);

export default router;
