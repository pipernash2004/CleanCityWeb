/**
 * Validation Middleware
 * 
 * Architectural Decision: Using express-validator for input validation
 * This provides consistent validation across all routes and better
 * error messages for the frontend.
 */

import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check validation results
 */
export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
    return;
  }
  
  next();
}

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for creating a report
 */
export const createReportValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("category")
    .isIn(["waste", "water", "road"])
    .withMessage("Category must be waste, water, or road"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),
  body("imageUrl")
  .optional()
  .custom((value) => {
    if (!value) return true;
    // Accept absolute URL or relative path starting with /
    const isAbsolute = /^(https?:)?\/\//i.test(value);
    const isRelative = typeof value === "string" && value.startsWith("/");
    if (isAbsolute || isRelative) return true;
    throw new Error("imageUrl must be an absolute URL or a path starting with '/'");
  })
];

/**
 * Validation rules for updating report status
 */
export const updateReportValidation = [
  body("status")
    .isIn(["pending", "in-progress", "resolved"])
    .withMessage("Status must be pending, in-progress, or resolved"),
];
