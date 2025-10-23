/**
 * Upload Routes
 * 
 * Architectural Decision: Local file storage for simplicity
 * Trade-off: Using local storage instead of cloud storage (like Cloudinary)
 * reduces complexity and external dependencies for MVP. In production,
 * this should be migrated to cloud storage for scalability.
 * 
 * POST /api/upload - Upload single image file
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Store in client/public/uploads so Vite can serve them
    cb(null, "client/public/uploads");
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to only allow images
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

/**
 * Upload single image
 * Protected route - requires authentication
 */
router.post("/", protect, upload.single("image"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Return the URL path to the uploaded file
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
});

export default router;
