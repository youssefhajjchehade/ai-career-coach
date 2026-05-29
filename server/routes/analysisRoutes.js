const express = require("express");
const {
  analyzeResume,
  getAnalysisHistory,
  deleteAnalysis,
} = require("../controllers/analysisController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze", protect, analyzeResume);
router.get("/history", protect, getAnalysisHistory);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;