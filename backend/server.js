const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

// Create uploads folder automatically
const uploadDir = path.join(
  __dirname,
  "uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

// Import Routes
const portfolioRoutes =
  require("./routes/portfolioRoutes");

const authRoutes =
  require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Uploads Folder Access
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Portfolio API Route
app.use(
  "/api/portfolio",
  portfolioRoutes
);

// Auth API Route
app.use(
  "/api/auth",
  authRoutes
);

// MongoDB Connection
mongoose.connect(
  process.env.MONGO_URI
)
.then(() =>
  console.log(
    "MongoDB Connected"
  )
)
.catch((err) =>
  console.log(err)
);

// Home Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Port
const PORT =
  process.env.PORT || 5000;

// Server Start
app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});