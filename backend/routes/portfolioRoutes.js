const express = require("express");
const router = express.Router();

const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

// =====================================================
// MULTER - MEMORY STORAGE
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// =====================================================
// HELPERS
// =====================================================

const isObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const findPortfolioByIdentifier = async (identifier) => {
  if (isObjectId(identifier)) {
    return Portfolio.findById(identifier);
  }

  return Portfolio.findOne({
    username: {
      $regex: `^${identifier}$`,
      $options: "i",
    },
  });
};

// =====================================================
// SAVE PORTFOLIO
// =====================================================

router.post("/save", async (req, res) => {
  try {
    console.log("========================================");
    console.log("📥 SAVE PORTFOLIO REQUEST");
    console.log("========================================");

    console.log(
      "Received portfolio data:",
      JSON.stringify(req.body, null, 2)
    );

    // ---------------------------------------------
    // COPY REQUEST DATA
    // ---------------------------------------------

    const data = { ...req.body };

    // ---------------------------------------------
    // USER ID
    // ---------------------------------------------

    if (data.userId !== undefined && data.userId !== null) {
      if (data.userId === "") {
        delete data.userId;
      } else if (!isObjectId(data.userId)) {
        console.error("❌ Invalid userId:", data.userId);

        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }
    }

    // ---------------------------------------------
    // USERNAME
    // ---------------------------------------------

    if (data.username) {
      data.username = String(data.username)
        .trim()
        .toLowerCase();
    }

    // ---------------------------------------------
    // PORTFOLIO TITLE
    // ---------------------------------------------

    if (data.portfolioTitle !== undefined) {
      data.portfolioTitle = String(
        data.portfolioTitle
      ).trim();
    }

    // ---------------------------------------------
    // DEFAULT ANALYTICS
    // ---------------------------------------------

    data.views = Number.isFinite(Number(data.views))
      ? Number(data.views)
      : 0;

    data.resumeDownloads = Number.isFinite(
      Number(data.resumeDownloads)
    )
      ? Number(data.resumeDownloads)
      : 0;

    data.githubClicks = Number.isFinite(
      Number(data.githubClicks)
    )
      ? Number(data.githubClicks)
      : 0;

    data.contactMessages = Number.isFinite(
      Number(data.contactMessages)
    )
      ? Number(data.contactMessages)
      : 0;

    data.lastUpdated = new Date();

    // ---------------------------------------------
    // ARRAYS
    // ---------------------------------------------

    if (!Array.isArray(data.projects)) {
      data.projects = [];
    }

    if (!Array.isArray(data.experience)) {
      data.experience = [];
    }

    if (!Array.isArray(data.education)) {
      data.education = [];
    }

    if (!Array.isArray(data.certifications)) {
      data.certifications = [];
    }

    if (!Array.isArray(data.achievements)) {
      data.achievements = [];
    }

    // ---------------------------------------------
    // SEO
    // ---------------------------------------------

    if (
      !data.seo ||
      typeof data.seo !== "object" ||
      Array.isArray(data.seo)
    ) {
      data.seo = {};
    }

    // ---------------------------------------------
    // THEME
    // ---------------------------------------------

    if (!data.theme) {
      data.theme = "modern";
    }

    // ---------------------------------------------
    // CREATE PORTFOLIO
    // ---------------------------------------------

    const portfolio = new Portfolio(data);

    console.log("📝 Portfolio model created");

    // ---------------------------------------------
    // VALIDATE
    // ---------------------------------------------

    try {
      await portfolio.validate();
    } catch (validationError) {
      console.error(
        "❌ Portfolio validation failed:",
        validationError
      );

      return res.status(400).json({
        success: false,
        message: "Portfolio validation failed",
        error: validationError.message,
      });
    }

    // ---------------------------------------------
    // SAVE
    // ---------------------------------------------

    const savedPortfolio = await portfolio.save();

    console.log(
      "✅ Portfolio saved successfully:",
      savedPortfolio._id
    );

    // ---------------------------------------------
    // ADD PORTFOLIO TO USER
    // ---------------------------------------------

    if (data.userId) {
      try {
        await User.findByIdAndUpdate(
          data.userId,
          {
            $addToSet: {
              portfolios: savedPortfolio._id,
            },
          },
          {
            new: true,
          }
        );

        console.log("✅ Portfolio added to user");
      } catch (userError) {
        console.error(
          "⚠️ Portfolio saved, but user update failed:",
          userError.message
        );
      }
    }

    // ---------------------------------------------
    // SUCCESS
    // ---------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Portfolio saved successfully",
      portfolioId: savedPortfolio._id,
      portfolio: savedPortfolio,
    });
  } catch (error) {
    console.error("========================================");
    console.error("❌ SAVE PORTFOLIO FAILED");
    console.error("========================================");

    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate portfolio data",
        error: error.message,
      });
    }

    // Mongoose validation
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Portfolio validation failed",
        error: error.message,
      });
    }

    // Mongoose ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio data",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save portfolio",
      error: error.message,
    });
  }
});

// =====================================================
// DUPLICATE
// =====================================================

router.post("/duplicate/:id", async (req, res) => {
  try {
    const originalPortfolio =
      await Portfolio.findById(req.params.id);

    if (!originalPortfolio) {
      return res.status(404).json({
        message: "Original portfolio not found",
      });
    }

    const portfolioData =
      originalPortfolio.toObject();

    delete portfolioData._id;
    delete portfolioData.createdAt;
    delete portfolioData.updatedAt;

    portfolioData.views = 0;
    portfolioData.resumeDownloads = 0;
    portfolioData.githubClicks = 0;
    portfolioData.contactMessages = 0;
    portfolioData.lastUpdated = new Date();

    portfolioData.portfolioTitle =
      portfolioData.portfolioTitle
        ? `${portfolioData.portfolioTitle} (Copy)`
        : "Portfolio (Copy)";

    const userId =
      originalPortfolio.userId ||
      req.body.userId;

    const newPortfolio =
      new Portfolio(portfolioData);

    const savedPortfolio =
      await newPortfolio.save();

    if (
      userId &&
      isObjectId(userId)
    ) {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            portfolios: savedPortfolio._id,
          },
        }
      );
    }

    res.status(201).json({
      message:
        "Portfolio duplicated successfully",
      portfolioId: savedPortfolio._id,
      portfolioTitle:
        savedPortfolio.portfolioTitle,
    });
  } catch (error) {
    console.error(
      "Duplicate error:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// MY PORTFOLIOS
// =====================================================

router.get("/my-portfolios", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!isObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user =
      await User.findById(userId).populate({
        path: "portfolios",
        select:
          "portfolioTitle fullName username theme createdAt views resumeDownloads githubClicks contactMessages profileImage",
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(
      user.portfolios || []
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// VIEW
// =====================================================

router.put(
  "/view/:identifier",
  async (req, res) => {
    try {
      const portfolio =
        await findPortfolioByIdentifier(
          req.params.identifier
        );

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      portfolio.views =
        (portfolio.views || 0) + 1;

      portfolio.lastUpdated =
        new Date();

      await portfolio.save();

      res.status(200).json({
        views: portfolio.views,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// DOWNLOAD
// =====================================================

router.put(
  "/download/:id",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findByIdAndUpdate(
          req.params.id,
          {
            $inc: {
              resumeDownloads: 1,
            },
            $set: {
              lastUpdated: new Date(),
            },
          },
          {
            new: true,
          }
        );

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json({
        resumeDownloads:
          portfolio.resumeDownloads,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// GITHUB
// =====================================================

router.put(
  "/github/:id",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findByIdAndUpdate(
          req.params.id,
          {
            $inc: {
              githubClicks: 1,
            },
            $set: {
              lastUpdated: new Date(),
            },
          },
          {
            new: true,
          }
        );

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json({
        githubClicks:
          portfolio.githubClicks,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// ANALYTICS
// =====================================================

router.get(
  "/analytics/:id",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findById(
          req.params.id
        ).select(
          "views resumeDownloads githubClicks contactMessages fullName username portfolioTitle"
        );

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json(
        portfolio
      );
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// SEARCH
// =====================================================

router.get(
  "/search/:username",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findOne({
          username: {
            $regex:
              `^${req.params.username}$`,
            $options: "i",
          },
        });

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json(
        portfolio
      );
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// USER PORTFOLIO
// =====================================================

router.get(
  "/user/:username",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findOne({
          username: {
            $regex:
              `^${req.params.username}$`,
            $options: "i",
          },
        });

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json(
        portfolio
      );
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// CONTACT PORTFOLIO OWNER
// =====================================================

router.post("/contact/:id", async (req, res) => {
  try {
    console.log("========================================");
    console.log("📩 CONTACT MESSAGE REQUEST");
    console.log("========================================");

    const { name, email, message } = req.body;

    // ---------------------------------------------
    // VALIDATE INPUT
    // ---------------------------------------------

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    // ---------------------------------------------
    // VALIDATE PORTFOLIO ID
    // ---------------------------------------------

    if (!isObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    // ---------------------------------------------
    // FIND PORTFOLIO
    // ---------------------------------------------

    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // ---------------------------------------------
    // FIND PORTFOLIO OWNER
    // ---------------------------------------------

    let ownerEmail = null;

    if (portfolio.userId) {
      const owner = await User.findById(
        portfolio.userId
      ).select("name email");

      if (owner?.email) {
        ownerEmail = owner.email;
      }
    }

    // Fallback to portfolio email
    if (!ownerEmail && portfolio.email) {
      ownerEmail = portfolio.email;
    }

    if (!ownerEmail) {
      return res.status(400).json({
        success: false,
        message: "Portfolio owner email not found",
      });
    }

    // ---------------------------------------------
    // CHECK SMTP CONFIGURATION
    // ---------------------------------------------

    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return res.status(500).json({
        success: false,
        message:
          "SMTP configuration is missing. Check backend .env",
      });
    }

    // ---------------------------------------------
    // CREATE SMTP TRANSPORTER
    // ---------------------------------------------

    const smtpPort = Number(
      process.env.SMTP_PORT || 587
    );

    const transporter =
      nodemailer.createTransport({
        host:
          process.env.SMTP_HOST ||
          "smtp.gmail.com",

        port: smtpPort,

        secure: smtpPort === 465,

        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    // ---------------------------------------------
    // SEND EMAIL
    // ---------------------------------------------

    await transporter.sendMail({
      from:
        process.env.CONTACT_FROM ||
        process.env.SMTP_USER,

      to: ownerEmail,

      replyTo: email,

      subject:
        `New Portfolio Message from ${name}`,

      text: `
You received a new message from your portfolio.

Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    // ---------------------------------------------
    // UPDATE CONTACT COUNT
    // ---------------------------------------------

    portfolio.contactMessages =
      (portfolio.contactMessages || 0) + 1;

    portfolio.lastUpdated = new Date();

    await portfolio.save();

    console.log(
      "✅ Contact message sent successfully"
    );

    console.log(
      "📩 Sent to:",
      ownerEmail
    );

    // ---------------------------------------------
    // SUCCESS
    // ---------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      contactMessages:
        portfolio.contactMessages,
    });

  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "❌ CONTACT MESSAGE FAILED"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send message",
      error: error.message,
    });
  }
});

// =====================================================
// GET BY ID
// =====================================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findById(
          req.params.id
        );

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json(
        portfolio
      );
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/update/:id",
  async (req, res) => {
    try {
      if (req.body.username) {
        req.body.username =
          String(req.body.username)
            .trim()
            .toLowerCase();
      }

      req.body.lastUpdated =
        new Date();

      const updatedPortfolio =
        await Portfolio.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedPortfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      res.status(200).json({
        success: true,
        portfolio:
          updatedPortfolio,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE
// =====================================================

router.delete(
  "/delete/:id",
  async (req, res) => {
    try {
      const portfolio =
        await Portfolio.findByIdAndDelete(
          req.params.id
        );

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      if (portfolio.userId) {
        await User.findByIdAndUpdate(
          portfolio.userId,
          {
            $pull: {
              portfolios:
                portfolio._id,
            },
          }
        );
      }

      res.status(200).json({
        message:
          "Portfolio deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================================================
// CLOUDINARY UPLOAD HELPER
// =====================================================

const uploadToCloudinary = (
  buffer,
  options = {}
) => {
  return new Promise((resolve, reject) => {

    console.log("========================================");
    console.log("☁️ CLOUDINARY SDK UPLOAD");
    console.log("========================================");
    console.log("Options:", options);
    console.log(
      "Buffer size:",
      buffer ? buffer.length : 0
    );

    if (
      !buffer ||
      !Buffer.isBuffer(buffer) ||
      buffer.length === 0
    ) {
      return reject(
        new Error("Invalid or empty file buffer")
      );
    }

    const stream =
      cloudinary.uploader.upload_stream(
        options,

        (error, result) => {

          if (error) {
            console.error("========================================");
            console.error("❌ CLOUDINARY SDK ERROR");
            console.error("========================================");

            console.error("Message:", error.message);
            console.error("HTTP Code:", error.http_code);
            console.error("Name:", error.name);

            console.error("Error keys:", Object.keys(error));

            console.error("Response:", error.response);

            if (error.response) {
              console.error(
                "Response headers:",
                error.response.headers
              );

              console.error(
                "Response body:",
                error.response.body
              );
            }

            console.error(
              "Full error:",
              JSON.stringify(error, null, 2)
            );

            console.error("========================================");

            return reject(error);
          }

          console.log(
            "========================================"
          );

          console.log(
            "✅ CLOUDINARY SDK UPLOAD SUCCESS"
          );

          console.log(
            "========================================"
          );

          console.log(
            "Public ID:",
            result.public_id
          );

          console.log(
            "URL:",
            result.secure_url
          );

          console.log(
            "Resource Type:",
            result.resource_type
          );

          console.log(
            "Format:",
            result.format
          );

          console.log(
            "========================================"
          );

          resolve(result);
        }
      );

    stream.on("error", (streamError) => {

      console.error(
        "========================================"
      );

      console.error(
        "❌ CLOUDINARY STREAM ERROR"
      );

      console.error(
        "========================================"
      );

      console.error(
        "Message:",
        streamError.message
      );

      console.error(
        "HTTP Code:",
        streamError.http_code
      );

      console.error(
        "Name:",
        streamError.name
      );

      console.error(
        "Full Error:",
        streamError
      );

      console.error(
        "========================================"
      );

      reject(streamError);
    });

    stream.end(buffer);
  });
};

// =====================================================
// UPLOAD RESUME - CLOUDINARY
// =====================================================

router.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No resume uploaded",
        });
      }

      console.log("========================================");
      console.log("☁️ RESUME UPLOAD STARTED");
      console.log("========================================");

      console.log(
        "File:",
        req.file.originalname
      );

      console.log(
        "Size:",
        req.file.size
      );

      console.log(
        "Mimetype:",
        req.file.mimetype
      );

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          {
            folder:
              "portfolio-builder/resumes",

            resource_type: "raw",
          }
        );

      console.log(
        "✅ RESUME UPLOAD SUCCESS"
      );

      console.log(
        "URL:",
        result.secure_url
      );

      console.log(
        "Public ID:",
        result.public_id
      );

      return res.status(200).json({
        success: true,

        resumeUrl:
          result.secure_url,

        publicId:
          result.public_id,

        message:
          "Resume uploaded successfully",
      });
    } catch (error) {
      console.error("========================================");
      console.error(
        "❌ CLOUDINARY RESUME UPLOAD FAILED"
      );
      console.error("========================================");

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "HTTP Code:",
        error.http_code
      );

      console.error(
        "Name:",
        error.name
      );

      console.error(
        "Full Error:",
        error
      );

      return res.status(
        error.http_code || 500
      ).json({
        success: false,

        message:
          "Resume upload failed",

        error:
          error.message,

        http_code:
          error.http_code || 500,
      });
    }
  }
);

// =====================================================
// UPLOAD PROFILE - CLOUDINARY
// =====================================================

router.post(
  "/upload-profile",
  upload.single("profile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No profile image uploaded",
        });
      }

      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedImageTypes.includes(
          req.file.mimetype
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid profile image type. Use JPG, JPEG, PNG, or WEBP.",
        });
      }

      console.log(
        "========================================"
      );

      console.log(
        "☁️ PROFILE UPLOAD STARTED"
      );

      console.log(
        "========================================"
      );

      console.log(
        "File:",
        req.file.originalname
      );

      console.log(
        "Size:",
        req.file.size
      );

      console.log(
        "Mimetype:",
        req.file.mimetype
      );

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          {
            folder:
              "portfolio-builder/profiles",

            resource_type:
              "image",
          }
        );

      console.log(
        "========================================"
      );

      console.log(
        "✅ PROFILE UPLOAD SUCCESS"
      );

      console.log(
        "URL:",
        result.secure_url
      );

      console.log(
        "Public ID:",
        result.public_id
      );

      console.log(
        "========================================"
      );

      return res.status(200).json({
        success: true,

        profileUrl:
          result.secure_url,

        publicId:
          result.public_id,

        message:
          "Profile image uploaded successfully",
      });
    } catch (error) {
      console.error(
        "========================================"
      );

      console.error(
        "❌ CLOUDINARY PROFILE UPLOAD FAILED"
      );

      console.error(
        "========================================"
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "HTTP Code:",
        error.http_code
      );

      console.error(
        "Name:",
        error.name
      );

      console.error(
        "Full Error:",
        error
      );

      console.error(
        "========================================"
      );

      return res.status(
        error.http_code || 500
      ).json({
        success: false,

        message:
          "Profile upload failed",

        error:
          error.message,

        http_code:
          error.http_code || 500,
      });
    }
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;