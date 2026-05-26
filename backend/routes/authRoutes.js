const express =
require("express");

const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

const router =
express.Router();

const User =
require("../models/User");

// =======================
// Register
// =======================

router.post(
"/register",
async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
    await User.findOne({
      email
    });

    if (existingUser) {

      return res
      .status(400)
      .json({
message:
"User already exists"
      });
    }

    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

    const user =
    new User({

      name,
      email,

password:
hashedPassword

    });

    await user.save();

    res.status(201)
    .json({

message:
"User registered successfully"

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
// Login
// =======================

router.post(
"/login",
async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
    await User.findOne({
      email
    });

    if (!user) {

      return res
      .status(400)
      .json({
message:
"User not found"
      });
    }

    const isMatch =
    await bcrypt.compare(

      password,

      user.password
    );

    if (!isMatch) {

      return res
      .status(400)
      .json({
message:
"Wrong password"
      });
    }

    const token =
    jwt.sign(

      {
id: user._id
      },

      "secretKey",

      {
expiresIn: "1d"
      }
    );

    res.status(200)
    .json({

      token,

message:
"Login successful"

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