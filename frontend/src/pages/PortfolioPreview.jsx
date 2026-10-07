import {
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function PortfolioPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);

  // Contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");

  // =========================================================
  // FETCH GITHUB REPOS
  // =========================================================
  const fetchGitHubRepos = async (username) => {
    if (!username) {
      setRepos([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
      );
      setRepos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Failed to fetch GitHub repositories:", error);
      setRepos([]);
    }
  };

  // =========================================================
  // TRACKING
  // =========================================================
  const trackResumeDownload = async (portfolioId) => {
    if (!portfolioId) return;
    try {
      await axios.put(`http://localhost:5000/api/portfolio/download/${portfolioId}`);
    } catch (error) {
      console.error("❌ Failed to track resume download:", error);
    }
  };

  const trackGitHubClick = async (portfolioId) => {
    if (!portfolioId) return;
    try {
      await axios.put(`http://localhost:5000/api/portfolio/github/${portfolioId}`);
    } catch (error) {
      console.error("❌ Failed to track GitHub click:", error);
    }
  };

  // =========================================================
  // CONTACT FORM
  // =========================================================
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!data?._id) {
      setMessageStatus("❌ Portfolio information is missing.");
      return;
    }

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setMessageStatus("❌ Please fill in all fields.");
      return;
    }

    try {
      setSendingMessage(true);
      setMessageStatus("");

      await axios.post(
        `http://localhost:5000/api/portfolio/contact/${data._id}`,
        {
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          message: contactForm.message.trim(),
        }
      );

      setMessageStatus("✅ Message sent successfully!");
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("❌ Failed to send contact message:", error);
      setMessageStatus(
        error?.response?.data?.message || "❌ Failed to send message. Please try again."
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // =========================================================
  // FETCH PORTFOLIO
  // =========================================================
  const fetchPortfolio = useCallback(async () => {
    try {
      let portfolioId = id || localStorage.getItem("previewPortfolioId");

      if (!portfolioId) {
        alert("No portfolio selected. Please select one from My Portfolios.");
        navigate("/dashboard");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/portfolio/${portfolioId}`
      );

      const portfolio = response.data || {};

      // Safe normalization
      portfolio.projects = Array.isArray(portfolio.projects) ? portfolio.projects : [];
      portfolio.experience = Array.isArray(portfolio.experience) ? portfolio.experience : [];
      portfolio.education = Array.isArray(portfolio.education) ? portfolio.education : [];
      portfolio.certifications = Array.isArray(portfolio.certifications) ? portfolio.certifications : [];
      portfolio.achievements = Array.isArray(portfolio.achievements) ? portfolio.achievements : [];

      if (Array.isArray(portfolio.skills)) {
        portfolio.skills = portfolio.skills
          .filter((s) => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (typeof portfolio.skills === "string") {
        portfolio.skills = portfolio.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        portfolio.skills = [];
      }

      portfolio.seo = portfolio.seo || { title: "", description: "", keywords: "", ogImage: "" };

      setData(portfolio);

      if (portfolio.githubUsername) {
        fetchGitHubRepos(portfolio.githubUsername);
      } else {
        setRepos([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch portfolio:", error);
      alert("Portfolio not found");
      navigate("/dashboard");
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const openPublicPortfolio = () => {
    if (data?.username) {
      window.open(`/portfolio/${data.username}`, "_blank");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (!data) {
    return (
      <>
        <Navbar />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: "80vh",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          }}
        >
          <div className="text-center text-white">
            <div className="spinner-border text-info" style={{ width: "3rem", height: "3rem" }} />
            <h4 className="mt-3">Loading Portfolio...</h4>
          </div>
        </div>
      </>
    );
  }

  const portfolioId = id || data._id;

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      <style>{`
        .preview-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          padding-bottom: 80px;
        }

        .preview-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(12px);
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #e2e8f0;
        }

        .btn-action {
          border-radius: 12px;
          font-weight: 500;
          padding: 10px 20px;
        }

        .skill-badge {
          background: rgba(14, 165, 233, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(14, 165, 233, 0.3);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.9rem;
        }

        .form-control-dark {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 12px;
        }

        .form-control-dark:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.25);
          color: white;
        }

        .form-control-dark::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <Navbar />

      <div className="preview-page">
        <div className="container py-5">

          {/* Header Actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3"
          >
            <h1 className="fw-bold mb-0">
              {data.portfolioTitle || "Portfolio Preview"}
            </h1>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-success btn-action"
                onClick={openPublicPortfolio}
              >
                🌍 View Public Portfolio
              </button>
              <button
                className="btn btn-warning btn-action text-dark"
                onClick={() => navigate(`/builder?edit=${portfolioId}`)}
              >
                ✏️ Edit Portfolio
              </button>
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="preview-card p-4 p-md-5"
          >
            {/* Profile */}
            <div className="text-center mb-5">
              {data.profileImage && !data.profileImage.startsWith("blob:") && (
                <img
                  src={data.profileImage}
                  alt="Profile"
                  width="140"
                  height="140"
                  className="rounded-circle border border-3 border-info shadow mb-3"
                  style={{ objectFit: "cover" }}
                />
              )}

              <h2 className="fw-bold">{data.fullName || "Your Name"}</h2>
              {data.username && (
                <p className="text-info fs-5">@{data.username}</p>
              )}

              {data.about && (
                <div
                  className="mt-3 text-secondary"
                  style={{ maxWidth: "700px", margin: "0 auto" }}
                  dangerouslySetInnerHTML={{ __html: data.about }}
                />
              )}

              {/* Skills */}
              {Array.isArray(data.skills) && data.skills.length > 0 && (
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              {data.github && (
                <a
                  href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark btn-action"
                  onClick={() => trackGitHubClick(portfolioId)}
                >
                  💻 GitHub
                </a>
              )}
              {data.linkedin && (
                <a
                  href={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-action"
                >
                  💼 LinkedIn
                </a>
              )}
              {data.resume && (
                <a
                  href={data.resume.startsWith("http") ? data.resume : `http://localhost:5000${data.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-danger btn-action"
                  onClick={() => trackResumeDownload(portfolioId)}
                >
                  📄 Resume
                </a>
              )}
            </div>

            {/* Projects */}
            <div className="mb-5">
              <h3 className="section-title">🚀 Projects</h3>
              {data.projects.length > 0 ? (
                <div className="row g-3">
                  {data.projects.map((project, index) => (
                    <div className="col-md-6" key={index}>
                      <div className="preview-card p-3 h-100">
                        <h5 className="fw-bold">
                          {typeof project === "string" ? project : project.title || "Untitled"}
                        </h5>
                        {typeof project === "object" && project.description && (
                          <p className="text-secondary small mb-2">{project.description}</p>
                        )}
                        {typeof project === "object" && project.link && (
                          <a
                            href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-info"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary">No projects added yet.</p>
              )}
            </div>

            {/* Experience */}
            <div className="mb-5">
              <h3 className="section-title">💼 Work Experience</h3>
              {data.experience.length > 0 ? (
                data.experience.map((exp, index) => (
                  <div key={index} className="preview-card p-3 mb-3">
                    <h5 className="fw-bold mb-1">{exp.role || "Role"}</h5>
                    <h6 className="text-info">{exp.company || "Company"}</h6>
                    <p className="text-secondary small mb-2">
                      {exp.startDate || ""} - {exp.currentlyWorking ? "Present" : exp.endDate || ""}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    {exp.description && (
                      <div
                        className="small"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-secondary">No work experience added yet.</p>
              )}
            </div>

            {/* Education */}
            <div className="mb-5">
              <h3 className="section-title">🎓 Education</h3>
              {data.education.length > 0 ? (
                data.education.map((edu, index) => (
                  <div key={index} className="preview-card p-3 mb-3">
                    <h5 className="fw-bold mb-1">{edu.degree || "Degree"}</h5>
                    <h6 className="text-info">{edu.institution || "Institution"}</h6>
                    <p className="text-secondary small">
                      {edu.startYear || ""} - {edu.endYear || "Present"}
                      {edu.cgpa && ` • CGPA: ${edu.cgpa}`}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-secondary">No education details added yet.</p>
              )}
            </div>

            {/* Certifications */}
            <div className="mb-5">
              <h3 className="section-title">🏆 Certifications</h3>
              {data.certifications.length > 0 ? (
                data.certifications.map((cert, index) => (
                  <div key={index} className="preview-card p-3 mb-3">
                    <h5 className="fw-bold mb-1">{cert.name || "Certification"}</h5>
                    {cert.issuer && <h6 className="text-info">{cert.issuer}</h6>}
                    {cert.issueDate && (
                      <p className="text-secondary small">Issued: {cert.issueDate}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-secondary">No certifications added yet.</p>
              )}
            </div>

            {/* Achievements */}
            <div className="mb-5">
              <h3 className="section-title">🌟 Achievements</h3>
              {data.achievements.length > 0 ? (
                data.achievements.map((ach, index) => (
                  <div key={index} className="preview-card p-3 mb-3">
                    <h5 className="fw-bold mb-1">{ach.title || "Achievement"}</h5>
                    {ach.date && <p className="text-secondary small">Date: {ach.date}</p>}
                    {ach.description && (
                      <div
                        className="small"
                        dangerouslySetInnerHTML={{ __html: ach.description }}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-secondary">No achievements added yet.</p>
              )}
            </div>

            {/* GitHub Repos */}
            {repos.length > 0 && (
              <div className="mb-5">
                <h3 className="section-title">💻 GitHub Repositories</h3>
                <div className="row g-3">
                  {repos.map((repo) => (
                    <div className="col-md-6" key={repo.id}>
                      <div className="preview-card p-3 h-100">
                        <h6 className="fw-bold">{repo.name}</h6>
                        {repo.description && (
                          <p className="text-secondary small mb-2">{repo.description}</p>
                        )}
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-light"
                        >
                          View Repo
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="preview-card p-4 mt-4">
              <h3 className="section-title">📩 Contact Me</h3>
              <p className="text-secondary mb-4">
                Have a question or want to work together? Send a message.
              </p>

              <form onSubmit={handleSendMessage}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-dark"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-dark"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control form-control-dark"
                      rows="4"
                      placeholder="Write your message..."
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>

                {messageStatus && (
                  <div className="mt-3">{messageStatus}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-info btn-action mt-3"
                  disabled={sendingMessage}
                >
                  {sendingMessage ? "Sending..." : "📨 Send Message"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default PortfolioPreview;