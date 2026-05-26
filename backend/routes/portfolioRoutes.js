const express =
require("express");

const router =
express.Router();

const Portfolio =
require("../models/Portfolio");

const multer =
require("multer");

// =======================
// Multer Storage
// =======================

const storage =
multer.diskStorage({

  destination:
  (req, file, cb) => {

    cb(
      null,
      "uploads/"
    );
  },

  filename:
  (req, file, cb) => {

    cb(
      null,

      Date.now() +
      "-" +
      file.originalname
    );
  }
});

const upload =
multer({
storage
});

// =======================
// Save Portfolio
// =======================

router.post(
"/save",
async (req, res) => {

  try {

    // Username lowercase
    req.body.username =
    req.body.username
    ?.toLowerCase();

    // Default views
    req.body.views =
    req.body.views || 0;

    const portfolio =
    new Portfolio(
      req.body
    );

    await portfolio.save();

    res.status(201)
    .json({

message:
"Portfolio saved successfully"

    });

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

// =======================
// Search Portfolio
// =======================

router.get(
"/search/:username",
async (req, res) => {

  try {

    const portfolio =
    await Portfolio.findOne({

      username: {

$regex:
`^${req.params.username}$`,

$options:
"i"

      }

    });

    if (!portfolio) {

      return res
      .status(404)
      .json({

message:
"Portfolio not found"

      });
    }

    res.status(200)
    .json(portfolio);

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

// =======================
// Get Public Portfolio
// =======================

router.get(
"/user/:username",
async (req, res) => {

  try {

    const portfolio =
    await Portfolio.findOne({

      username: {

$regex:
`^${req.params.username}$`,

$options:
"i"

      }

    });

    if (!portfolio) {

      return res
      .status(404)
      .json({

message:
"Portfolio not found"

      });
    }

    res.status(200)
    .json(portfolio);

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

// =======================
// Increase Views
// =======================

router.put(
"/view/:username",
async (req, res) => {

  try {

    const portfolio =
    await Portfolio.findOneAndUpdate(

      {

        username: {

$regex:
`^${req.params.username}$`,

$options:
"i"

        }

      },

      {

$inc: {
views: 1
        }

      },

      {

returnDocument:
"after"

      }
    );

    if (!portfolio) {

      return res
      .status(404)
      .json({

message:
"Portfolio not found"

      });
    }

    res.status(200)
    .json({

views:
portfolio.views

    });

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

// =======================
// Update Portfolio
// =======================

router.put(
"/update/:id",
async (req, res) => {

  try {

    req.body.username =
    req.body.username
    ?.toLowerCase();

    const updatedPortfolio =
    await Portfolio.findByIdAndUpdate(

      req.params.id,

      req.body,

      {

returnDocument:
"after"

      }
    );

    res.status(200)
    .json(
updatedPortfolio
    );

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

// =======================
// Delete Portfolio
// =======================

router.delete(
"/delete/:id",
async (req, res) => {

  try {

    await Portfolio.findByIdAndDelete(
      req.params.id
    );

    res.status(200)
    .json({

message:
"Portfolio deleted successfully"

    });

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

// =======================
// Resume Upload
// =======================

router.post(
"/upload-resume",

upload.single(
"resume"
),

(req, res) => {

  try {

    res.status(200)
    .json({

resumeUrl:
`http://https://portfolio-builder-navy-eight.vercel.app//uploads/${req.file.filename}`

    });

  } catch (error) {

    res.status(500)
    .json({
error:
error.message
    });
  }
});

module.exports =
router;