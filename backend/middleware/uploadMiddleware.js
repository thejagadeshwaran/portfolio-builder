const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio-builder",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  },
});

// Multer upload
const upload = multer({
  storage: storage,
});

module.exports = upload;