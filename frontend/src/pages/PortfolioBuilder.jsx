// frontend/src/pages/PortfolioBuilder.jsx

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import RichTextEditor from "../components/RichTextEditor";
import { parseResume } from "../services/aiService";

// ========================================
// API URL
// ========================================

const API_URL = "https://portfolio-builder-online.onrender.com/api";

// ========================================
// DEFAULT PORTFOLIO DATA
// ========================================

const defaultData = {
  portfolioTitle: "My Portfolio",

  fullName: "",
  username: "",
  email: "",
  phone: "",
  about: "",
  skills: "",

  github: "",
  githubUsername: "",
  linkedin: "",

  profileImage: "",
  resume: "",

  theme: "modern",

  projects: [
    {
      title: "",
      description: "",
      link: "",
    },
  ],

  experience: [
    {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    },
  ],

  education: [
    {
      institution: "",
      degree: "",
      startYear: "",
      endYear: "",
      cgpa: "",
    },
  ],

  certifications: [
    {
      name: "",
      issuer: "",
      issueDate: "",
    },
  ],

  achievements: [
    {
      title: "",
      date: "",
      description: "",
    },
  ],

  seo: {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  },
};

// ========================================
// PORTFOLIO BUILDER
// ========================================

function PortfolioBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");

  // ========================================
  // STATE
  // ========================================

  const [portfolioData, setPortfolioData] =
    useState(defaultData);

  const [imagePreview, setImagePreview] =
    useState("");

  const [isParsingResume, setIsParsingResume] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [loadingPortfolio, setLoadingPortfolio] =
    useState(false);

  // ========================================
  // LOAD PORTFOLIO FOR EDITING
  // ========================================

  useEffect(() => {
    if (!editId) {
      console.log("🆕 CREATE MODE");
      return;
    }

    const loadPortfolio = async () => {
      setLoadingPortfolio(true);

      try {
        console.log("=================================");
        console.log("✏️ EDIT MODE");
        console.log("Portfolio ID:", editId);
        console.log("=================================");

        const token =
          localStorage.getItem("token");

        // ========================================
        // GET PORTFOLIO
        // ========================================

        const response = await axios.get(
          `${API_URL}/portfolio/${editId}`,
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
          }
        );

        console.log(
          "📦 COMPLETE API RESPONSE:",
          response
        );

        console.log(
          "📦 API RESPONSE DATA:",
          response.data
        );

        // ========================================
        // HANDLE POSSIBLE RESPONSE STRUCTURES
        // ========================================

        const data =
          response.data?.portfolio ||
          response.data?.data ||
          response.data;

        console.log(
          "✅ FINAL PORTFOLIO DATA:",
          data
        );

        // ========================================
        // CHECK DATA
        // ========================================

        if (
          !data ||
          typeof data !== "object"
        ) {
          throw new Error(
            "Portfolio data was not returned by the server."
          );
        }

        // ========================================
        // NORMALIZE SKILLS
        // ========================================

        let normalizedSkills = "";

        if (Array.isArray(data.skills)) {
          normalizedSkills =
            data.skills.join(", ");
        } else if (
          typeof data.skills === "string"
        ) {
          normalizedSkills =
            data.skills;
        }

        // ========================================
        // NORMALIZE SEO
        // ========================================

        const normalizedSeo = {
          ...defaultData.seo,

          ...(data.seo &&
          typeof data.seo === "object"
            ? data.seo
            : {}),
        };

        // ========================================
        // NORMALIZE PROJECTS
        // ========================================

        const normalizedProjects =
          Array.isArray(data.projects)
            ? data.projects
            : defaultData.projects;

        // ========================================
        // NORMALIZE EXPERIENCE
        // ========================================

        const normalizedExperience =
          Array.isArray(data.experience)
            ? data.experience
            : defaultData.experience;

        // ========================================
        // NORMALIZE EDUCATION
        // ========================================

        const normalizedEducation =
          Array.isArray(data.education)
            ? data.education
            : defaultData.education;

        // ========================================
        // NORMALIZE CERTIFICATIONS
        // ========================================

        const normalizedCertifications =
          Array.isArray(data.certifications)
            ? data.certifications
            : defaultData.certifications;

        // ========================================
        // NORMALIZE ACHIEVEMENTS
        // ========================================

        const normalizedAchievements =
          Array.isArray(data.achievements)
            ? data.achievements
            : defaultData.achievements;

        // ========================================
        // CREATE FORM DATA
        // ========================================

        const loadedPortfolio = {
          ...defaultData,

          ...data,

          portfolioTitle:
            data.portfolioTitle ||
            defaultData.portfolioTitle,

          fullName:
            data.fullName || "",

          username:
            data.username || "",

          email:
            data.email || "",

          phone:
            data.phone || "",

          about:
            data.about || "",

          skills:
            normalizedSkills,

          github:
            data.github || "",

          githubUsername:
            data.githubUsername || "",

          linkedin:
            data.linkedin || "",

          profileImage:
            data.profileImage || "",

          resume:
            data.resume || "",

          theme:
            data.theme ||
            defaultData.theme,

          projects:
            normalizedProjects,

          experience:
            normalizedExperience,

          education:
            normalizedEducation,

          certifications:
            normalizedCertifications,

          achievements:
            normalizedAchievements,

          seo:
            normalizedSeo,
        };

        // ========================================
        // LOG DATA GOING INTO FORM
        // ========================================

        console.log(
          "📝 DATA GOING INTO FORM:"
        );

        console.log(
          JSON.stringify(
            loadedPortfolio,
            null,
            2
          )
        );

        // ========================================
        // SET FORM STATE
        // ========================================

        setPortfolioData(
          loadedPortfolio
        );

        // ========================================
        // PROFILE IMAGE
        // ========================================

        if (data.profileImage) {
          setImagePreview(
            data.profileImage
          );
        } else {
          setImagePreview("");
        }

        console.log(
          "🎉 EDIT FORM POPULATED"
        );

      } catch (error) {
        console.error(
          "================================="
        );

        console.error(
          "❌ LOAD PORTFOLIO FAILED"
        );

        console.error(
          "================================="
        );

        console.error(
          "Error:",
          error
        );

        console.error(
          "Message:",
          error?.message
        );

        console.error(
          "Server response:",
          error?.response?.data
        );

        alert(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load portfolio."
        );

      } finally {
        setLoadingPortfolio(false);
      }
    };

    loadPortfolio();
  }, [editId]);

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    // ========================================
    // SEO
    // ========================================

    if (name.startsWith("seo.")) {
      const field =
        name.split(".")[1];

      setPortfolioData((prev) => ({
        ...prev,

        seo: {
          ...prev.seo,

          [field]:
            type === "checkbox"
              ? checked
              : value,
        },
      }));

      return;
    }

    // ========================================
    // NORMAL FIELD
    // ========================================

    setPortfolioData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ========================================
  // PROFILE IMAGE
  // ========================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select a valid image file."
      );

      e.target.value = "";
      return;
    }

    const url =
      URL.createObjectURL(file);

    setImagePreview(url);

    setPortfolioData((prev) => ({
      ...prev,

      profileImage: url,
    }));
  };

  // ========================================
  // RESUME UPLOAD
  // ========================================

  const handleResumeUpload = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf"
    ) {
      alert(
        "Please upload a PDF file."
      );

      e.target.value = "";
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );

    try {
      console.log(
        "📄 Uploading resume..."
      );

      const response =
        await axios.post(
          `${API_URL}/portfolio/upload-resume`,
          formData
        );

      console.log(
        "☁️ Resume upload response:",
        response.data
      );

      setPortfolioData((prev) => ({
        ...prev,

        resume:
          response.data?.resumeUrl ||
          prev.resume ||
          "",
      }));

      alert(
        "✅ Resume uploaded successfully!"
      );

    } catch (error) {
      console.error(
        "❌ Resume upload error:",
        error
      );

      console.error(
        "Server response:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
        "Resume upload failed."
      );

    } finally {
      e.target.value = "";
    }
  };

  // ========================================
  // AI RESUME PARSER
  // ========================================

  const handleAIResumeParse =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      if (
        file.type !== "application/pdf"
      ) {
        alert(
          "Please upload a PDF file."
        );

        e.target.value = "";
        return;
      }

      setIsParsingResume(true);

      try {
        console.log(
          "📄 Sending resume to AI..."
        );

        const result =
          await parseResume(file);

        console.log(
          "🤖 Complete AI response:",
          result
        );

        const parsed =
          result?.data?.data ||
          result?.data ||
          result;

        console.log(
          "✅ Extracted resume data:",
          parsed
        );

        if (
          !parsed ||
          typeof parsed !==
            "object"
        ) {
          throw new Error(
            "AI returned invalid resume data."
          );
        }

        setPortfolioData((prev) => ({
          ...prev,

          fullName:
            parsed.fullName ||
            prev.fullName ||
            "",

          email:
            parsed.email ||
            prev.email ||
            "",

          phone:
            parsed.phone ||
            prev.phone ||
            "",

          about:
            parsed.about ||
            prev.about ||
            "",

          skills:
            Array.isArray(
              parsed.skills
            )
              ? parsed.skills.join(
                  ", "
                )
              : parsed.skills ||
                prev.skills ||
                "",

          github:
            parsed.github ||
            prev.github ||
            "",

          linkedin:
            parsed.linkedin ||
            prev.linkedin ||
            "",
        }));

        alert(
          "✅ Resume parsed successfully! Your form has been auto-filled."
        );

      } catch (error) {
        console.error(
          "❌ AI Resume Parsing Error:",
          error
        );

        console.error(
          "Server response:",
          error?.response?.data
        );

        alert(
          error?.response?.data
            ?.message ||
          error?.message ||
          "⚠️ AI parsing failed. Please fill manually."
        );

      } finally {
        setIsParsingResume(false);
        e.target.value = "";
      }
    };

  // ========================================
  // SUBMIT PORTFOLIO
  // ========================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const userId =
        localStorage.getItem(
          "userId"
        );

      const token =
        localStorage.getItem(
          "token"
        );

      if (!userId || !token) {
        alert(
          "Session expired. Please login again."
        );

        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        // ========================================
        // PREPARE PAYLOAD
        // ========================================

        const payload = {
          ...portfolioData,

          userId,

          username:
            portfolioData.username
              ?.toLowerCase()
              .trim(),

          skills:
            typeof portfolioData.skills ===
            "string"
              ? portfolioData.skills
                  .split(",")
                  .map((skill) =>
                    skill.trim()
                  )
                  .filter(Boolean)
              : portfolioData.skills,
        };

        let portfolioId =
          editId ||
          portfolioData._id;

        // ========================================
        // UPDATE
        // ========================================

        if (portfolioId) {
          console.log(
            "✏️ Updating portfolio:",
            portfolioId
          );

          await axios.put(
            `${API_URL}/portfolio/update/${portfolioId}`,
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          alert(
            "✅ Portfolio Updated!"
          );
        }

        // ========================================
        // CREATE
        // ========================================

        else {
          console.log(
            "🚀 Creating new portfolio..."
          );

          const response =
            await axios.post(
              `${API_URL}/portfolio/save`,
              payload,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          portfolioId =
            response.data
              .portfolioId;

          alert(
            "✅ Portfolio Created!"
          );
        }

        localStorage.removeItem(
          "editPortfolio"
        );

        navigate(
          `/preview/${portfolioId}`
        );

      } catch (error) {
        console.error(
          "❌ Portfolio save error:",
          error
        );

        console.error(
          "Server response:",
          error?.response?.data
        );

        alert(
          "Error saving portfolio: " +
          (
            error?.response?.data
              ?.message ||
            error?.message ||
            "Unknown error"
          )
        );

      } finally {
        setLoading(false);
      }
    };

  // ========================================
  // LOADING EDIT PORTFOLIO
  // ========================================

  if (
    editId &&
    loadingPortfolio
  ) {
    return (
      <>
        <Navbar />

        <div className="container mt-5">
          <div className="text-center p-5">

            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <h5 className="mt-3">
              Loading portfolio...
            </h5>

            <p className="text-muted">
              Please wait while we load
              your portfolio details.
            </p>

          </div>
        </div>
      </>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5">

        <div className="card shadow-lg border-0 rounded-4">

          {/* HEADER */}

          <div className="card-header bg-primary text-white p-5 text-center">

            <h2 className="mb-1 fw-bold">
              {editId
                ? "✏️ Edit Portfolio"
                : "🚀 Build New Portfolio"}
            </h2>

          </div>

          <div className="card-body p-5">

            {/* ========================================
                AI RESUME PARSER
            ======================================== */}

            <div className="mb-5 p-4 border border-primary rounded-4 bg-light text-center">

              <h5 className="fw-bold mb-3">
                ✨ AI Resume Parser
              </h5>

              <p className="text-muted mb-3">
                Upload your resume and let AI
                automatically fill your portfolio details.
              </p>

              <label
                className={`btn ${
                  isParsingResume
                    ? "btn-secondary"
                    : "btn-primary"
                } btn-lg px-5`}
              >
                {isParsingResume
                  ? "🧠 Parsing Resume..."
                  : "📄 Upload Resume for Auto-Fill"}

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="d-none"
                  onChange={
                    handleAIResumeParse
                  }
                  disabled={
                    isParsingResume
                  }
                />
              </label>

              {isParsingResume && (
                <div className="mt-3">

                  <div
                    className="spinner-border text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">
                      Loading...
                    </span>
                  </div>

                  <p className="mt-2 text-muted">
                    AI is reading your resume...
                  </p>

                </div>
              )}

            </div>

            {/* ========================================
                FORM
            ======================================== */}

            <form onSubmit={handleSubmit}>

              {/* PROFILE IMAGE + RESUME */}

              <div className="row g-4">

                {/* PROFILE IMAGE */}

                <div className="col-lg-6">

                  <label className="form-label fw-bold">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={
                      handleImageChange
                    }
                  />

                  {imagePreview && (
                    <div className="mt-3">

                      <p className="text-muted mb-2">
                        {editId
                          ? "Current Profile Image:"
                          : "Image Preview:"}
                      </p>

                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="img-thumbnail"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* RESUME */}

                <div className="col-lg-6">

                  <label className="form-label fw-bold">
                    Resume (PDF)
                  </label>

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="form-control"
                    onChange={
                      handleResumeUpload
                    }
                  />

                  {portfolioData.resume && (
                    <div className="mt-3">

                      <p className="text-muted mb-2">
                        Current Resume:
                      </p>

                      <a
                        href={
                          portfolioData.resume
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                      >
                        📄 View Current Resume
                      </a>

                    </div>
                  )}

                </div>

              </div>

              {/* NAME + USERNAME */}

              <div className="row g-3 mt-4">

                <div className="col-md-6">

                  <input
                    type="text"
                    name="fullName"
                    className="form-control form-control-lg"
                    placeholder="Full Name"
                    value={
                      portfolioData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                <div className="col-md-6">

                  <input
                    type="text"
                    name="username"
                    className="form-control form-control-lg"
                    placeholder="Username (public link)"
                    value={
                      portfolioData.username
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <input
                type="email"
                name="email"
                className="form-control form-control-lg mt-3"
                placeholder="Email"
                value={
                  portfolioData.email
                }
                onChange={
                  handleChange
                }
              />

              {/* PHONE */}

              <input
                type="text"
                name="phone"
                className="form-control form-control-lg mt-3"
                placeholder="Phone"
                value={
                  portfolioData.phone
                }
                onChange={
                  handleChange
                }
              />

              {/* ABOUT */}

              <div className="mt-4">

                <label className="form-label fw-bold">
                  About Me
                </label>

                <RichTextEditor
                  value={
                    portfolioData.about
                  }
                  onChange={(value) =>
                    setPortfolioData(
                      (prev) => ({
                        ...prev,
                        about: value,
                      })
                    )
                  }
                />

              </div>

              {/* SKILLS */}

              <input
                type="text"
                name="skills"
                className="form-control form-control-lg mt-3"
                placeholder="Skills (comma separated)"
                value={
                  portfolioData.skills
                }
                onChange={
                  handleChange
                }
              />

              {/* GITHUB */}

              <input
                type="text"
                name="github"
                className="form-control form-control-lg mt-3"
                placeholder="GitHub URL"
                value={
                  portfolioData.github
                }
                onChange={
                  handleChange
                }
              />

              {/* LINKEDIN */}

              <input
                type="text"
                name="linkedin"
                className="form-control form-control-lg mt-3"
                placeholder="LinkedIn URL"
                value={
                  portfolioData.linkedin
                }
                onChange={
                  handleChange
                }
              />

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-5 rounded-pill shadow"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editId
                  ? "Update Portfolio"
                  : "Save & Preview Portfolio"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </>
  );
}

export default PortfolioBuilder;