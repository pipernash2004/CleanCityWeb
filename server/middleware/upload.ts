// middleware/upload.ts
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // store file in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const valid = allowedTypes.test(file.mimetype);
    if (valid) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});
