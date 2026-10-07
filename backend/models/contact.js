const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({

  // Visitor Name
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Visitor Email
  email: {
    type: String,
    required: true,
    trim: true
  },

  // Subject
  subject: {
    type: String,
    required: true,
    trim: true
  },

  // Message
  message: {
    type: String,
    required: true,
    trim: true
  },

  // Portfolio Owner
  portfolioOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Portfolio
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Contact",
  contactSchema
);