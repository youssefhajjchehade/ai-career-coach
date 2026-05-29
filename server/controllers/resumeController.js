const pdfParse = require("pdf-parse");

const MAX_EXTRACTED_TEXT_CHARS =
  Number(process.env.MAX_EXTRACTED_TEXT_CHARS) || 27000;

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = (pdfData.text || "").trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract readable text from this PDF",
      });
    }

    const limitedText =
      extractedText.length > MAX_EXTRACTED_TEXT_CHARS
        ? extractedText.slice(0, MAX_EXTRACTED_TEXT_CHARS)
        : extractedText;

    res.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      fileName: req.file.originalname,
      textLength: limitedText.length,
      truncated: extractedText.length > MAX_EXTRACTED_TEXT_CHARS,
      extractedText: limitedText,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error parsing resume PDF",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

module.exports = { uploadResume };
