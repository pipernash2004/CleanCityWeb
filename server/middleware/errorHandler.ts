/**
 * Error Handling Middleware
 * 
 * Architectural Decision: Centralized error handling
 * All errors are caught and formatted consistently here,
 * providing better debugging and user experience.
 */

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

/**
 * Global error handler middleware
 * Must have all 4 parameters for Express to recognize it as error handler
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", err);

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      message: "Validation error",
      errors: messages,
    });
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    res.status(400).json({
      message: `${field} already exists`,
    });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: "Invalid ID format",
    });
    return;
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
}

/**
 * 404 Not Found handler
 */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
}
