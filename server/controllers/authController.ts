/**
 * Authentication Controller
 * 
 * Architectural Pattern: Controller layer for separation of concerns
 * This controller handles all authentication-related business logic,
 * keeping routes thin and testable.
 * 
 * Trade-off: More files and indirection vs better organization
 * and testability. We chose organization for long-term maintainability.
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { jwtConfig } from "../config/jwt";


/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  // casting Request as a class to avoid Ts complaint

  const log = (req as any).log;
  log.info("Register endpoint hit");
  


  try {
    const { email, password, name } = req.body;
  
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      log.error("User already exists with this email!!")
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({
      email,
      password,
      name,
      role: "user", // Default role
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      jwtConfig.secret as string,
      { expiresIn: jwtConfig.expiresIn }
    );
    log.db("Saving user to Db...");
    log.info("User registration successful");
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
     log.error("Error in registration:", error.message);
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  const log = (req as any).log;
  log.info("Login endpoint hit");
  

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      log.error("Invalid email or password during login");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      log.error("Invalid email or password during login");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      jwtConfig.secret as string,
      { expiresIn: jwtConfig.expiresIn }
    );
    log.info("User login successful");
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    log.error("Error in login:", error.message);
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
}

/**
 * Get current user info
 * GET /api/auth/me
 */
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const log = (req as any).log;
  log.info("Current user endpoint hit");


  try {
    // req.user is set by auth middleware
    const user = await User.findById((req as any).user.userId).select("-password");
    
    if (!user) {
      log.error("User not found in getCurrentUser");
      res.status(404).json({ message: "User not found" });
      return;
    }
    log.info("Fetched current user successfully");
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    log.error("Error in getCurrentUser:", error.message);
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
