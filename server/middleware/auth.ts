/**
 * Authentication Middleware
 * 
 * Architectural Decision: JWT-based stateless authentication
 * Trade-off: Stateless tokens mean we can't invalidate them server-side,
 * but this is acceptable for our use case and provides better scalability.
 * 
 * This middleware verifies JWT tokens and attaches user info to the request.
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Middleware to protect routes that require authentication
 */
export function protect(req: Request, res: Response, next: NextFunction): void {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload;

    // Attach user info to request that you don't know it's structure 
    (req as any).user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.status(500).json({ message: "Authentication error" });
  }
}

/**
 * Middleware to restrict access to admin users only
 */
export function adminOnly(req: Request, res: Response, next: NextFunction): void {
  const userRole = (req as any).user?.role;

  if (userRole !== "admin") {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
    return;
  }

  next();
}
