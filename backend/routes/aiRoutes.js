const express = require("express");
const multer = require("multer");

const {
  parseResume,
} = require("../services/aiService");

const router = express.Router();

// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF files are supported"
        )
      );
    }
  },
});

// ========================================
// TEST AI ROUTE
// GET /api/ai/test
// ========================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI route is working",
  });
});

// ========================================
// PARSE RESUME
// POST /api/ai/parse-resume
// ========================================

router.post(
  "/parse-resume",
  upload.single("resume"),

  async (req, res) => {
    try {
      console.log(
        "========================================"
      );

      console.log(
        "📄 RESUME PARSING REQUEST"
      );

      console.log(
        "========================================"
      );

      // ========================================
      // CHECK FILE
      // ========================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload a PDF resume.",
        });
      }

      // ========================================
      // LOG FILE DETAILS
      // ========================================

      console.log(
        "📄 File:",
        req.file.originalname
      );

      console.log(
        "📦 File size:",
        req.file.size,
        "bytes"
      );

      console.log(
        "📋 MIME type:",
        req.file.mimetype
      );

      // ========================================
      // PARSE PDF + AI
      // ========================================

      console.log(
        "🧠 Sending resume to AI service..."
      );

      const parsedResume =
        await parseResume(
          req.file.buffer
        );

      // ========================================
      // CHECK AI RESPONSE
      // ========================================

      if (
        !parsedResume ||
        typeof parsedResume !==
          "object"
      ) {
        throw new Error(
          "AI returned invalid resume data."
        );
      }

      console.log(
        "✅ Resume parsed successfully"
      );

      console.log(
        "🤖 Parsed data:",
        parsedResume
      );

      // ========================================
      // SUCCESS RESPONSE
      // ========================================

      return res.status(200).json({
        success: true,

        message:
          "Resume parsed successfully",

        data: parsedResume,
      });

    } catch (error) {

      // ========================================
      // ERROR
      // ========================================

      console.error(
        "========================================"
      );

      console.error(
        "❌ RESUME PARSING ERROR"
      );

      console.error(
        "========================================"
      );

      console.error(
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to parse resume",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.stack
            : undefined,
      });
    }
  }
);

// ========================================
// MULTER ERROR HANDLER
// ========================================

router.use(
  (error, req, res, next) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Resume file must be smaller than 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    if (
      error &&
      error.message ===
        "Only PDF files are supported"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only PDF files are supported.",
      });
    }

    next(error);
  }
);

// ========================================
// EXPORT
// ========================================

module.exports = router;