// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

require("dotenv").config({
  override: true,
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// SHOW ACTUAL ENVIRONMENT VALUES
// =====================================================

console.log("========================================");
console.log("🔍 ENVIRONMENT CHECK");
console.log("========================================");

console.log(
  "Cloudinary Cloud Name:",
  process.env.CLOUDINARY_CLOUD_NAME || "MISSING ❌"
);

console.log(
  "Cloudinary API Key:",
  process.env.CLOUDINARY_API_KEY
    ? "Loaded ✅"
    : "Missing ❌"
);

console.log(
  "Cloudinary API Secret:",
  process.env.CLOUDINARY_API_SECRET
    ? "Loaded ✅"
    : "Missing ❌"
);

console.log("========================================");

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// VERIFY CLOUDINARY CONFIGURATION
// =====================================================

console.log("========================================");
console.log("☁️ CLOUDINARY CONFIGURATION");
console.log("========================================");

const cloudinaryConfig = cloudinary.config();

console.log(
  "Cloud Name:",
  cloudinaryConfig.cloud_name || "Missing ❌"
);

console.log(
  "API Key:",
  cloudinaryConfig.api_key
    ? "Loaded ✅"
    : "Missing ❌"
);

console.log(
  "API Secret:",
  cloudinaryConfig.api_secret
    ? "Loaded ✅"
    : "Missing ❌"
);

console.log("========================================");

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// OLD LOCAL UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// ROUTES
// =====================================================

// -----------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------

const authRoutes =
  require("./routes/authRoutes");

console.log(
  "Auth routes:",
  typeof authRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

// -----------------------------------------------------
// PORTFOLIO
// -----------------------------------------------------

const portfolioRoutes =
  require("./routes/portfolioRoutes");

console.log(
  "Portfolio routes:",
  typeof portfolioRoutes
);

app.use(
  "/api/portfolio",
  portfolioRoutes
);

// -----------------------------------------------------
// AI
// -----------------------------------------------------

const aiRoutes =
  require("./routes/aiRoutes");

console.log(
  "AI routes:",
  typeof aiRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

// =====================================================
// ROOT TEST
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "🚀 Portfolio Builder API is running",
  });
});

// =====================================================
// CLOUDINARY CONNECTION TEST
// =====================================================

app.get(
  "/api/cloudinary-test",
  async (req, res) => {
    console.log("========================================");
    console.log("☁️ TESTING CLOUDINARY");
    console.log("========================================");

    try {
      const cloudName =
        process.env.CLOUDINARY_CLOUD_NAME;

      const apiKey =
        process.env.CLOUDINARY_API_KEY;

      const apiSecret =
        process.env.CLOUDINARY_API_SECRET;

      // ---------------------------------------------
      // CHECK CREDENTIALS
      // ---------------------------------------------

      console.log(
        "Cloud Name:",
        cloudName || "Missing ❌"
      );

      console.log(
        "API Key:",
        apiKey
          ? "Loaded ✅"
          : "Missing ❌"
      );

      console.log(
        "API Secret:",
        apiSecret
          ? "Loaded ✅"
          : "Missing ❌"
      );

      // ---------------------------------------------
      // CHECK MISSING VALUES
      // ---------------------------------------------

      if (
        !cloudName ||
        !apiKey ||
        !apiSecret
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Cloudinary credentials are missing",
          cloudName:
            !!cloudName,
          apiKey:
            !!apiKey,
          apiSecret:
            !!apiSecret,
        });
      }

      // ---------------------------------------------
      // TEST CLOUDINARY
      // ---------------------------------------------

      console.log(
        "Sending request to Cloudinary..."
      );

      const result =
        await cloudinary.api.ping();

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      console.log("========================================");
      console.log(
        "✅ CLOUDINARY CONNECTION SUCCESSFUL"
      );
      console.log("========================================");

      console.log(
        "Cloudinary response:",
        result
      );

      return res.status(200).json({
        success: true,
        message:
          "Cloudinary connection successful",
        result: result,
      });

    } catch (error) {
      // -------------------------------------------
      // ERROR
      // -------------------------------------------

      console.log("========================================");
      console.log(
        "❌ CLOUDINARY CONNECTION FAILED"
      );
      console.log("========================================");

      console.log(
        "Full error:",
        error
      );

      console.log(
        "Nested error:",
        error?.error
      );

      console.log(
        "Error message:",
        error?.error?.message ||
          error?.message ||
          "Unknown error"
      );

      console.log(
        "HTTP code:",
        error?.error?.http_code ||
          error?.http_code ||
          "Unknown"
      );

      return res.status(500).json({
        success: false,

        message:
          "Cloudinary connection failed",

        error:
          error?.error?.message ||
          error?.message ||
          "Unknown Cloudinary error",

        http_code:
          error?.error?.http_code ||
          error?.http_code ||
          null,
      });
    }
  }
);

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "✅ MongoDB Connected"
    );
  })
  .catch((error) => {
    console.error(
      "❌ MongoDB Connection Error:",
      error
    );
  });

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "========================================"
    );

    console.error(
      "❌ GLOBAL SERVER ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Error:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {
    console.log("========================================");

    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );

    console.log("========================================");
  }
);