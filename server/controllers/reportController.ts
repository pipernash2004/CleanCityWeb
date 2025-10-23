/**
 * Report Controller
 * 
 * Architectural Pattern: Controller handles business logic for reports
 * All CRUD operations are centralized here for better maintainability.
 * 
 * Performance Consideration: Using lean() for read operations and
 * selective population to minimize data transfer.
 */

import { Request, Response } from "express";
import Report from "../models/Report";
import mongoose from "mongoose";

/**
 * Create a new report
 * POST /api/reports
 */
export async function createReport(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, category, location, imageUrl } = req.body;
    const userId = (req as any).user.userId;

    const report = await Report.create({
      title,
      description,
      category,
      location,
      imageUrl,
      userId,
      status: "pending", // All new reports start as pending
    });

    // Populate user information for response
    await report.populate("userId", "name email");

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error: any) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Server error creating report", error: error.message });
  }
}

/**
 * Get all reports with optional filtering
 * GET /api/reports?category=waste&status=pending&search=text
 */
export async function getAllReports(req: Request, res: Response): Promise<void> {
  try {
    const { category, status, search } = req.query;

    // Build query object dynamically
    const query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      // Search in title, description, or location
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Performance optimization: Use lean() for faster queries
    const reports = await Report.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error: any) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Server error fetching reports", error: error.message });
  }
}

/**
 * Get single report by ID
 * GET /api/reports/:id
 */
export async function getReportById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid report ID" });
      return;
    }

    const report = await Report.findById(id)
      .populate("userId", "name email")
      .lean();

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    res.status(200).json({ report });
  } catch (error: any) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Server error fetching report", error: error.message });
  }
}

/**
 * Update report (status change - admin only)
 * PUT /api/reports/:id
 */
export async function updateReport(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = (req as any).user.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid report ID" });
      return;
    }

    // Only admins can update report status
    if (userRole !== "admin") {
      res.status(403).json({ message: "Only administrators can update report status" });
      return;
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    res.status(200).json({
      message: "Report updated successfully",
      report,
    });
  } catch (error: any) {
    console.error("Update report error:", error);
    res.status(500).json({ message: "Server error updating report", error: error.message });
  }
}

/**
 * Delete report
 * DELETE /api/reports/:id
 */
export async function deleteReport(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid report ID" });
      return;
    }

    const report = await Report.findById(id);

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    // Users can only delete their own reports, admins can delete any
    if (userRole !== "admin" && report.userId.toString() !== userId) {
      res.status(403).json({ message: "You can only delete your own reports" });
      return;
    }

    await Report.findByIdAndDelete(id);

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error: any) {
    console.error("Delete report error:", error);
    res.status(500).json({ message: "Server error deleting report", error: error.message });
  }
}

/**
 * Get user's own reports
 * GET /api/reports/my
 */
export async function getMyReports(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user.userId;

    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error: any) {
    console.error("Get my reports error:", error);
    res.status(500).json({ message: "Server error fetching reports", error: error.message });
  }
}

/**
 * Get report statistics (for admin dashboard)
 * GET /api/reports/stats
 */
export async function getReportStats(req: Request, res: Response): Promise<void> {
  try {
    const userRole = (req as any).user.role;

    if (userRole !== "admin") {
      res.status(403).json({ message: "Only administrators can view statistics" });
      return;
    }

    // Aggregate statistics
    const stats = await Report.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Report.countDocuments();

    // Format response
    const formattedStats = {
      total,
      pending: stats.find((s) => s._id === "pending")?.count || 0,
      inProgress: stats.find((s) => s._id === "in-progress")?.count || 0,
      resolved: stats.find((s) => s._id === "resolved")?.count || 0,
    };

    res.status(200).json({ stats: formattedStats });
  } catch (error: any) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error fetching statistics", error: error.message });
  }
}
