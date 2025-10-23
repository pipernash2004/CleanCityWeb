/**
 * Authentication Routes
 * 
 * Architectural Pattern: Separation of concerns - routes only handle
 * HTTP routing, validation, and middleware application. Business logic
 * is delegated to controllers.
 * 
 * RESTful API Design:
 * POST /api/auth/register - Register new user
 * POST /api/auth/login - Login user
 * GET /api/auth/me - Get current user (protected)
 */

import { Router } from "express";
import * as authController from "../controllers/authController";
import { registerValidation, loginValidation, validate } from "../middleware/validation";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);

// Protected routes
router.get("/me", protect, authController.getCurrentUser);

export default router;
