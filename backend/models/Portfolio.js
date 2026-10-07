const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    // ==================== OWNER ====================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==================== PORTFOLIO ====================

    portfolioTitle: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      default: "",
      trim: true,
    },

    username: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    about: {
      type: String,
      default: "",
    },

    // IMPORTANT:
    // AI Resume Parser sends skills as an array.
    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    githubUsername: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    // ==================== ANALYTICS ====================

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    resumeDownloads: {
      type: Number,
      default: 0,
      min: 0,
    },

    githubClicks: {
      type: Number,
      default: 0,
      min: 0,
    },

    contactMessages: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    // ==================== PROJECTS ====================

    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // ==================== WORK EXPERIENCE ====================

    experience: {
      type: [
        {
          company: {
            type: String,
            default: "",
          },

          role: {
            type: String,
            default: "",
          },

          employmentType: {
            type: String,
            default: "",
          },

          location: {
            type: String,
            default: "",
          },

          startDate: {
            type: String,
            default: "",
          },

          endDate: {
            type: String,
            default: "",
          },

          currentlyWorking: {
            type: Boolean,
            default: false,
          },

          description: {
            type: String,
            default: "",
          },
        },
      ],

      default: [],
    },

    // ==================== EDUCATION ====================

    education: {
      type: [
        {
          institution: {
            type: String,
            default: "",
          },

          degree: {
            type: String,
            default: "",
          },

          fieldOfStudy: {
            type: String,
            default: "",
          },

          startYear: {
            type: String,
            default: "",
          },

          endYear: {
            type: String,
            default: "",
          },

          cgpa: {
            type: String,
            default: "",
          },

          description: {
            type: String,
            default: "",
          },
        },
      ],

      default: [],
    },

    // ==================== CERTIFICATIONS ====================

    certifications: {
      type: [
        {
          name: {
            type: String,
            default: "",
          },

          issuer: {
            type: String,
            default: "",
          },

          issueDate: {
            type: String,
            default: "",
          },

          credentialId: {
            type: String,
            default: "",
          },

          certificateLink: {
            type: String,
            default: "",
          },
        },
      ],

      default: [],
    },

    // ==================== ACHIEVEMENTS ====================

    achievements: {
      type: [
        {
          title: {
            type: String,
            default: "",
          },

          date: {
            type: String,
            default: "",
          },

          description: {
            type: String,
            default: "",
          },
        },
      ],

      default: [],
    },

    // ==================== SEO ====================

    seo: {
      title: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      keywords: {
        type: String,
        default: "",
      },

      ogImage: {
        type: String,
        default: "",
      },
    },

    // ==================== THEME ====================

    theme: {
      type: String,
      default: "modern",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Portfolio",
  portfolioSchema
);