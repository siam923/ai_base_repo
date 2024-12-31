// middlewares/upload.js
import multer from "multer";

// Use memory storage to get the file buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 20MB
  fileFilter: (req, file, cb) => {
    // Accept only PDF and image files
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

export default upload;
