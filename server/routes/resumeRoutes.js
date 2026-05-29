const express = require("express");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume } = require("../controllers/resumeController");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === "application/pdf";
  const isPdfName = file.originalname.toLowerCase().endsWith(".pdf");

  if (isPdfMime && isPdfName) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/upload", protect, upload.single("resume"), uploadResume);

module.exports = router;
