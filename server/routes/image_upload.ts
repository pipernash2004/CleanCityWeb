// server/routes/image_upload.ts
import { Router } from "express";
import { upload } from "../middleware/upload";
import { gridFSBucket } from "../config/database";
import { ObjectId } from "mongodb";

const router = Router();

/**
 * POST /       (upload)
 * Returns full URL to the uploaded image using req.baseUrl so the URL matches
 * wherever this router is mounted.
 */
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const { originalname, buffer, mimetype } = req.file;

    // Create a safer filename (optional)
    const filename = `${Date.now()}-${originalname}`;

    const uploadStream = gridFSBucket.openUploadStream(filename, {
      contentType: mimetype,
      metadata: { uploadedAt: new Date() },
    });

    uploadStream.end(buffer);

    uploadStream.on("finish", () => {
      const id = uploadStream.id ? uploadStream.id.toString() : null;
      if (!id) {
        console.error("Upload finished but uploadStream.id is missing");
        return res.status(500).json({ message: "Upload completed but file id not available" });
      }

      // Use req.baseUrl so returned URL matches mounting point
      // e.g. if you mounted this router at '/api/reports/images', baseUrl === '/api/reports/images'
      const base = req.baseUrl || "";
      const imageUrl = `${req.protocol}://${req.get("host")}${base}/${id}`;

      console.info("Image uploaded successfully:", imageUrl);
      return res.status(201).json({ imageUrl });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      if (!res.headersSent) return res.status(500).json({ message: "Error uploading image", error: err.message });
    });
  } catch (err: any) {
    console.error("Server error in upload handler:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /:id (download)
 * Serves files stored in GridFS by file id.
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid image id" });
  }

  try {
    const fileId = new ObjectId(id);

    // Optionally fetch file document to set Content-Type
    const filesCursor = gridFSBucket.find({ _id: fileId }).limit(1);
    const fileDoc = await filesCursor.next();

    if (!fileDoc) return res.status(404).json({ message: "Image not found" });

    if (fileDoc.contentType) res.setHeader("Content-Type", fileDoc.contentType);

    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("GridFS download error:", err);
      if (!res.headersSent) res.sendStatus(404);
    });

    downloadStream.pipe(res);
  } catch (err: any) {
    console.error("Server error fetching image:", err);
    return res.status(500).json({ message: "Error fetching image", error: err.message });
  }
});

export default router;
