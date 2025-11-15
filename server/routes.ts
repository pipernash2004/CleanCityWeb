/**
 * Main Routes Configuration
 * 
 * Architectural Pattern: Modular route organization
 * Each domain (auth, reports) has its own route module for better
 * maintainability and scalability.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/authRoutes";
import reportRoutes from "./routes/reportRoutes";
import uploadRoutes from "./routes/image_upload";
import { errorHandler, notFound } from "./middleware/errorHandler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/upload", uploadRoutes);

  // 404 handler for API routes
  app.use("/api/*", notFound);

  // Global error handler (must be last)
  app.use(errorHandler);

  const httpServer = createServer(app);

  return httpServer;
}
