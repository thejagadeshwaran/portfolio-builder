const mongoose =
  require("mongoose");

const portfolioSchema =
  new mongoose.Schema({

    fullName: String,

    username: String,

    about: String,

    skills: String,

    github: String,

    githubUsername:
      String,

    linkedin: String,

    phone: String,

    profileImage:
      String,

    resume: String,

    // New Analytics Fields
    views: {
      type: Number,
      default: 0
    },

    resumeDownloads: {
      type: Number,
      default: 0
    },

    projects: [String],

    theme: String

  });

module.exports =
  mongoose.model(
    "Portfolio",
    portfolioSchema
  );