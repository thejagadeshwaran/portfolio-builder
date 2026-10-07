const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");

// Create JWT
const createToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET || "secretKey123",
    {
      expiresIn: "1d",
    }
  );
};

// ========================================
// REGISTER
// POST /api/auth/register
// ========================================

router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER REQUEST:", req.body);

    const {
      name,
      fullName,
      email,
      password,
    } = req.body;

    const userName = name || fullName;

    // Validation
    if (!userName || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters",
      });
    }

    // Check existing user
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = new User({
      name: userName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await user.save();

    // Create token
    const token = createToken(user._id);

    console.log(
      "USER REGISTERED:",
      user._id.toString()
    );

    // Response
    return res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      token,
      userId: user._id.toString(),
      message: "Login successful",
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
});

module.exports = router;