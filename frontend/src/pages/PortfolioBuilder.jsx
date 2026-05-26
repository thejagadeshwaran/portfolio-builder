import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function PortfolioBuilder() {

  const navigate = useNavigate();

  // Get edit data safely
  const savedPortfolio =
    JSON.parse(
      localStorage.getItem(
        "editPortfolio"
      )
    );

  // Fix old bad data
  if (
    savedPortfolio &&
    !Array.isArray(
      savedPortfolio.projects
    )
  ) {
    savedPortfolio.projects = [""];
  }

  // State
  const [portfolioData,
    setPortfolioData] =
    useState(

      savedPortfolio || {

        fullName: "",
        username: "",
        about: "",
        skills: "",
        github: "",
        githubUsername: "",
        linkedin: "",
        phone: "",
        profileImage: "",
        resume: "",
        projects: [""],
        theme: "modern",
        views: 0
      });

  // Handle Input Change
  const handleChange =
    (e) => {

      setPortfolioData({

        ...portfolioData,

        [e.target.name]:
          e.target.value
      });
    };

  // Profile Image Upload
  const handleImageChange =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const imageURL =
        URL.createObjectURL(file);

      setPortfolioData({

        ...portfolioData,

        profileImage:
          imageURL
      });
    };

  // Resume Upload
  const handleResumeUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );

      try {

        const response =
          await axios.post(

            "https://portfolio-builder-jxjx.onrender.com/api/portfolio/upload-resume",

            formData
          );

        setPortfolioData({

          ...portfolioData,

          resume:
            response.data.resumeUrl
        });

        alert(
          "Resume Uploaded Successfully!"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Resume upload failed"
        );
      }
    };

  // Project Change
  const handleProjectChange =
    (index, value) => {

      const updatedProjects =
        Array.isArray(
          portfolioData.projects
        )
          ? [...portfolioData.projects]
          : [];

      updatedProjects[index] =
        value;

      setPortfolioData({

        ...portfolioData,

        projects:
          updatedProjects
      });
    };

  // Add Project
  const addProjectField =
    () => {

      setPortfolioData({

        ...portfolioData,

        projects: [
          ...(Array.isArray(
            portfolioData.projects
          )
            ? portfolioData.projects
            : []),
          ""
        ]
      });
    };

  // Save / Update Portfolio
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        localStorage.setItem(
          "portfolioUsername",
          portfolioData.username
            .toLowerCase()
        );

        // Update Portfolio
        if (
          savedPortfolio?._id
        ) {

          await axios.put(

            `https://portfolio-builder-jxjx.onrender.com/api/portfolio/update/${savedPortfolio._id}`,

            portfolioData
          );

          alert(
            "Portfolio Updated Successfully!"
          );

        } else {

          // Create Portfolio
          await axios.post(

            "https://portfolio-builder-jxjx.onrender.com/api/portfolio/save",

            portfolioData
          );

          alert(
            "Portfolio Saved Successfully!"
          );
        }

        localStorage.removeItem(
          "editPortfolio"
        );

        navigate(
          "/preview"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Error saving portfolio"
        );
      }
    };

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">

        <div className="card shadow-lg border-0 rounded-4 p-5">

          <h2 className="text-center fw-bold mb-4">

            {savedPortfolio
              ? "✏️ Edit Portfolio"
              : "🚀 Build Portfolio"}

          </h2>

          <form
            onSubmit={handleSubmit}
          >

            {/* Profile Image */}
            <div className="mb-3">

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
            </div>

            {/* Resume Upload */}
            <div className="mb-3">

              <label className="form-label fw-bold">
                Upload Resume
              </label>

              <input
                type="file"
                accept=".pdf"
                className="form-control"
                onChange={
                  handleResumeUpload
                }
              />
            </div>

            {/* Theme */}
            <div className="mb-3">

              <label className="form-label fw-bold">
                Select Template
              </label>

              <select
                name="theme"
                className="form-control"
                value={
                  portfolioData.theme
                }
                onChange={
                  handleChange
                }
              >

                <option value="modern">
                  Modern
                </option>

                <option value="professional">
                  Professional
                </option>

                <option value="developer">
                  Developer
                </option>

              </select>
            </div>

            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="form-control mb-3"
              value={
                portfolioData.fullName
              }
              onChange={
                handleChange
              }
              required
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control mb-3"
              value={
                portfolioData.username
              }
              onChange={(e) =>

                setPortfolioData({

                  ...portfolioData,

                  username:
                    e.target.value
                      .toLowerCase()

                })
              }
              required
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="form-control mb-3"
              value={
                portfolioData.phone
              }
              onChange={
                handleChange
              }
            />

            {/* About */}
            <textarea
              name="about"
              placeholder="About Me"
              className="form-control mb-3"
              rows="4"
              value={
                portfolioData.about
              }
              onChange={
                handleChange
              }
            />

            {/* Skills */}
            <input
              type="text"
              name="skills"
              placeholder="Skills"
              className="form-control mb-3"
              value={
                portfolioData.skills
              }
              onChange={
                handleChange
              }
            />

            {/* Projects */}
            <h5 className="fw-bold">
              🚀 Projects
            </h5>

            {(Array.isArray(
              portfolioData.projects
            )
              ? portfolioData.projects
              : []
            ).map(
              (project, index) => (

                <input
                  key={index}
                  type="text"
                  placeholder={`Project ${index + 1}`}
                  className="form-control mb-2"
                  value={project}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      e.target.value
                    )
                  }
                />
              ))}

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={
                addProjectField
              }
            >
              + Add Project
            </button>

            {/* GitHub */}
            <input
              type="text"
              name="github"
              placeholder="GitHub URL"
              className="form-control mb-3"
              value={
                portfolioData.github
              }
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="githubUsername"
              placeholder="GitHub Username"
              className="form-control mb-3"
              value={
                portfolioData.githubUsername
              }
              onChange={
                handleChange
              }
            />

            {/* LinkedIn */}
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn URL"
              className="form-control mb-4"
              value={
                portfolioData.linkedin
              }
              onChange={
                handleChange
              }
            />

            <button
              className="btn btn-primary btn-lg w-100 rounded-pill shadow"
            >
              {savedPortfolio
                ? "Update Portfolio"
                : "Save Portfolio"}
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default PortfolioBuilder;