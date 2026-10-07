import {
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "https://portfolio-builder-online.onrender.com/api";

// =========================================================
// BUILT-IN DEMO PORTFOLIO DATA
// =========================================================
const DEMO_PORTFOLIO = {
  _id: "demo",
  fullName: "Alex Rivera",
  username: "demo",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 123-4567",
  about: `<p>Passionate Full Stack Developer with 4+ years of experience building modern web applications. 
  Specialized in React, Node.js, and cloud technologies. I love turning complex problems into simple, 
  beautiful, and intuitive solutions.</p>
  <p>Currently open to exciting opportunities where I can contribute and grow.</p>`,
  skills: [
    "React", "Node.js", "Express", "MongoDB", "TypeScript",
    "Next.js", "Tailwind CSS", "AWS", "Docker", "Git",
    "REST APIs", "GraphQL", "Firebase", "Framer Motion"
  ],
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  resume: "",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  projects: [
    {
      title: "Portfolio Builder",
      description: "A full-stack application that lets users create stunning portfolios with real-time preview, AI resume parsing, and analytics.",
      link: "https://github.com"
    },
    {
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with Stripe payments, inventory management, and admin dashboard.",
      link: "https://github.com"
    },
    {
      title: "Task Management App",
      description: "Collaborative task manager with real-time updates using Socket.io and beautiful drag-and-drop UI.",
      link: "https://github.com"
    }
  ],
  experience: [
    {
      role: "Senior Full Stack Developer",
      company: "TechNova Solutions",
      startDate: "2022",
      currentlyWorking: true,
      location: "Remote",
      description: "<p>Leading development of multiple client projects using React, Node.js and AWS. Mentoring junior developers and improving code quality.</p>"
    },
    {
      role: "Frontend Developer",
      company: "Digital Craft Studio",
      startDate: "2020",
      endDate: "2022",
      location: "Bangalore, India",
      description: "<p>Built responsive web applications and improved performance by 40% through code optimization and lazy loading.</p>"
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology",
      institution: "National Institute of Technology",
      fieldOfStudy: "Computer Science & Engineering",
      startYear: "2016",
      endYear: "2020",
      cgpa: "8.7"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2023"
    },
    {
      name: "Meta Front-End Developer",
      issuer: "Meta",
      issueDate: "2022"
    }
  ],
  achievements: [
    {
      title: "Winner - Smart India Hackathon 2019",
      date: "2019",
      description: "<p>Built an AI-powered solution for agricultural crop prediction that won the national finals.</p>"
    }
  ],
  seo: {
    title: "Alex Rivera | Full Stack Developer",
    description: "Portfolio of Alex Rivera - Full Stack Developer specializing in React, Node.js and modern web technologies.",
    keywords: "full stack developer, react, nodejs, portfolio"
  }
};

function PublicPortfolio() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // =======================================================
  // HELPERS
  // =======================================================

  const normalizeUrl = (url) => {
    if (!url) return "";
    const value = String(url).trim();
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return `https://${value}`;
  };

  const getResumeUrl = useCallback(() => {
    if (!data?.resume) return "";
    const resume = String(data.resume).trim();
    if (resume.startsWith("http://") || resume.startsWith("https://")) {
      return resume;
    }
    return `https://portfolio-builder-online.onrender.com${resume.startsWith("/") ? "" : "/"}${resume}`;
  }, [data]);

  const getGitHubUrl = useCallback(() => {
    if (!data?.github) return "";
    return normalizeUrl(data.github);
  }, [data]);

  const getLinkedInUrl = useCallback(() => {
    if (!data?.linkedin) return "";
    return normalizeUrl(data.linkedin);
  }, [data]);

  // =======================================================
  // SEARCH HANDLER
  // =======================================================

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchInput.trim().toLowerCase();
    if (!value) return;

    // Navigate to the searched portfolio
    navigate(`/portfolio/${value}`);
  };

  // =======================================================
  // GITHUB REPOS
  // =======================================================

  const fetchGitHubRepos = useCallback(async (githubUsername) => {
    if (!githubUsername) {
      setRepos([]);
      return;
    }

    try {
      const cleanUsername = String(githubUsername)
        .trim()
        .replace(/^@/, "")
        .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
        .replace(/\/$/, "");

      if (!cleanUsername) {
        setRepos([]);
        return;
      }

      const response = await axios.get(
        `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos`,
        {
          params: { sort: "updated", per_page: 6 },
        }
      );

      setRepos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ GitHub repositories error:", error);
      setRepos([]);
    }
  }, []);

  // =======================================================
  // TRACKING
  // =======================================================

  const trackPortfolioView = useCallback(async (portfolioIdentifier) => {
    if (!portfolioIdentifier || portfolioIdentifier === "demo") return;

    try {
      await axios.put(
        `${API_URL}/portfolio/view/${encodeURIComponent(portfolioIdentifier)}`
      );
    } catch (error) {
      console.error("❌ View tracking failed:", error);
    }
  }, []);

  const trackResumeDownload = useCallback(async (portfolioId) => {
    if (!portfolioId || portfolioId === "demo") return;
    try {
      await axios.put(`${API_URL}/portfolio/download/${portfolioId}`);
    } catch (error) {
      console.error("❌ Download tracking failed:", error);
    }
  }, []);

  const trackGitHubClick = useCallback(async (portfolioId) => {
    if (!portfolioId || portfolioId === "demo") return;
    try {
      await axios.put(`${API_URL}/portfolio/github/${portfolioId}`);
    } catch (error) {
      console.error("❌ GitHub tracking failed:", error);
    }
  }, []);

  // =======================================================
  // NORMALIZE DATA
  // =======================================================

  const normalizePortfolioData = (portfolio) => {
    const normalized = { ...portfolio };

    normalized.projects = Array.isArray(normalized.projects) ? normalized.projects : [];
    normalized.experience = Array.isArray(normalized.experience) ? normalized.experience : [];
    normalized.education = Array.isArray(normalized.education) ? normalized.education : [];
    normalized.certifications = Array.isArray(normalized.certifications) ? normalized.certifications : [];
    normalized.achievements = Array.isArray(normalized.achievements) ? normalized.achievements : [];

    if (Array.isArray(normalized.skills)) {
      normalized.skills = normalized.skills
        .filter((s) => typeof s === "string")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (typeof normalized.skills === "string") {
      normalized.skills = normalized.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      normalized.skills = [];
    }

    normalized.seo = normalized.seo || {};
    return normalized;
  };

  // =======================================================
  // FETCH PORTFOLIO
  // =======================================================

  const fetchPortfolio = useCallback(async () => {
    if (!username) {
      setErrorMessage("Username is missing from the URL.");
      setData(null);
      setLoading(false);
      return;
    }

    // ========== DEMO MODE ==========
    if (username.toLowerCase() === "demo") {
      console.log("🎨 Loading built-in Demo Portfolio");
      setData(DEMO_PORTFOLIO);
      setRepos([]);
      setLoading(false);
      setErrorMessage("");
      return;
    }

    // ========== REAL PORTFOLIO ==========
    try {
      setLoading(true);
      setErrorMessage("");
      setData(null);

      const cleanUsername = String(username).trim();

      const response = await axios.get(
        `${API_URL}/portfolio/user/${encodeURIComponent(cleanUsername)}`,
        { timeout: 10000 }
      );

      let portfolio =
        response.data?.portfolio ||
        response.data?.data ||
        response.data;

      if (!portfolio || Array.isArray(portfolio) || typeof portfolio !== "object") {
        throw new Error("Invalid portfolio response from server.");
      }

      portfolio = normalizePortfolioData(portfolio);
      setData(portfolio);

      if (portfolio._id) {
        await trackPortfolioView(portfolio._id);
      }

      if (portfolio.githubUsername || portfolio.github) {
        const ghUser = portfolio.githubUsername || portfolio.github;
        await fetchGitHubRepos(ghUser);
      } else {
        setRepos([]);
      }
    } catch (error) {
      console.error("❌ PUBLIC PORTFOLIO ERROR:", error);

      setData(null);

      if (error?.response?.status === 404) {
        setErrorMessage(`No public portfolio found for username "${username}".`);
      } else if (error?.response?.status === 500) {
        setErrorMessage("Server error while loading the portfolio.");
      } else if (error?.code === "ECONNABORTED") {
        setErrorMessage("The server took too long to respond.");
      } else if (!error?.response) {
        setErrorMessage("Cannot connect to the backend server. Make sure it is running on port 5000.");
      } else {
        setErrorMessage("Unable to load the portfolio. Please try again.");
      }

      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, [username, trackPortfolioView, fetchGitHubRepos]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // =======================================================
  // SEO
  // =======================================================

  useEffect(() => {
    if (!data) return;

    const title =
      data?.seo?.title ||
      data?.portfolioTitle ||
      `${data?.fullName || "Portfolio"} | Portfolio`;

    document.title = title;

    return () => {
      document.title = "Portfolio Builder";
    };
  }, [data]);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <div className="card shadow-lg rounded-4 p-5 text-center">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            />
            <h4 className="mt-4">Loading Portfolio...</h4>
            <p className="text-muted mb-0">Fetching @{username}</p>
          </div>
        </div>
      </>
    );
  }

  // =======================================================
  // NOT FOUND
  // =======================================================

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          {/* Search Box even on error page */}
          <div className="card shadow-sm rounded-4 p-4 mb-4">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search any portfolio by username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-lg px-4">
                🔍 Search
              </button>
            </form>
          </div>

          <div className="card shadow-lg rounded-4 p-5 text-center">
            <div style={{ fontSize: "4rem" }}>❌</div>
            <h2 className="fw-bold mt-3">Portfolio Not Found</h2>
            <p className="text-muted">
              {errorMessage || "The requested portfolio could not be found."}
            </p>
            <p className="small text-muted">
              Username requested: <strong>{username || "unknown"}</strong>
            </p>

            <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                🏠 Go Home
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/portfolio/demo")}
              >
                👀 View Demo Portfolio
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // =======================================================
  // RENDER PORTFOLIO
  // =======================================================

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5">

        {/* ===================== SEARCH BAR ===================== */}
        <div className="card shadow-sm rounded-4 p-3 p-md-4 mb-4">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="🔍 Search any public portfolio by username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="col-md-auto">
              <button type="submit" className="btn btn-primary btn-lg w-100 px-4">
                Search
              </button>
            </div>
            {username !== "demo" && (
              <div className="col-md-auto">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => navigate("/portfolio/demo")}
                >
                  View Demo
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ===================== MAIN CARD ===================== */}
        <div className="card shadow-lg rounded-4">
          <div className="card-body p-4 p-md-5">

            {/* PROFILE IMAGE */}
            {data.profileImage && !data.profileImage.startsWith("blob:") && (
              <div className="text-center mb-4">
                <img
                  src={data.profileImage}
                  alt={data.fullName || "Profile"}
                  width="160"
                  height="160"
                  className="rounded-circle border shadow"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            {/* NAME + CONTACT */}
            <div className="text-center">
              <h1 className="fw-bold">{data.fullName || "Your Name"}</h1>
              {data.username && (
                <p className="text-muted fs-5">@{data.username}</p>
              )}
              {data.email && (
                <p className="mb-1">
                  📧{" "}
                  <a href={`mailto:${data.email}`} className="text-decoration-none">
                    {data.email}
                  </a>
                </p>
              )}
              {data.phone && (
                <p>
                  📱{" "}
                  <a href={`tel:${data.phone}`} className="text-decoration-none">
                    {data.phone}
                  </a>
                </p>
              )}
            </div>

            {/* ABOUT */}
            {data.about && (
              <div className="mt-5">
                <h3 className="fw-bold mb-3">👨‍💻 About Me</h3>
                <div
                  className="about-section"
                  dangerouslySetInnerHTML={{ __html: data.about }}
                />
              </div>
            )}

            {/* SKILLS */}
            {Array.isArray(data.skills) && data.skills.length > 0 && (
              <div className="mt-5">
                <h3 className="fw-bold mb-3">🛠 Skills</h3>
                <div className="d-flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="badge bg-primary"
                      style={{ fontSize: "0.95rem", padding: "8px 14px" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL LINKS */}
            {(data.github || data.linkedin || data.resume) && (
              <div className="mt-5">
                <h3 className="fw-bold mb-3">🔗 Links</h3>
                <div className="d-flex flex-wrap gap-3">
                  {data.github && (
                    <a
                      href={getGitHubUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-dark"
                      onClick={() => trackGitHubClick(data._id)}
                    >
                      💻 GitHub
                    </a>
                  )}
                  {data.linkedin && (
                    <a
                      href={getLinkedInUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                  {data.resume && (
                    <a
                      href={getResumeUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-danger"
                      onClick={() => trackResumeDownload(data._id)}
                    >
                      📄 Resume
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            <div className="mt-5">
              <h3 className="fw-bold mb-3">🚀 Projects</h3>
              {Array.isArray(data.projects) && data.projects.length > 0 ? (
                <div className="row g-4">
                  {data.projects.map((project, index) => {
                    if (typeof project === "string") {
                      return (
                        <div className="col-md-6" key={index}>
                          <div className="card h-100 shadow-sm">
                            <div className="card-body">
                              <h5 className="fw-bold">{project}</h5>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (typeof project === "object" && project !== null) {
                      return (
                        <div className="col-md-6" key={index}>
                          <div className="card h-100 shadow-sm">
                            <div className="card-body">
                              <h5 className="fw-bold">
                                {project.title || "Untitled Project"}
                              </h5>
                              {project.description && (
                                <p className="mt-2">{project.description}</p>
                              )}
                              {project.link && (
                                <a
                                  href={normalizeUrl(project.link)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-outline-primary btn-sm mt-2"
                                >
                                  🔗 View Project
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                <p className="text-muted">No projects added yet.</p>
              )}
            </div>

            {/* EXPERIENCE */}
            <div className="mt-5">
              <h3 className="fw-bold mb-3">💼 Work Experience</h3>
              {Array.isArray(data.experience) && data.experience.length > 0 ? (
                data.experience.map((exp, index) => (
                  <div key={index} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold">{exp.role || "Role"}</h5>
                      <h6 className="text-primary">{exp.company || "Company"}</h6>
                      {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                        <p className="text-muted mb-1">
                          {exp.startDate || ""} -{" "}
                          {exp.currentlyWorking ? "Present" : exp.endDate || ""}
                        </p>
                      )}
                      {exp.location && (
                        <p className="text-muted">📍 {exp.location}</p>
                      )}
                      {exp.description && (
                        <div
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No work experience added yet.</p>
              )}
            </div>

            {/* EDUCATION */}
            <div className="mt-5">
              <h3 className="fw-bold mb-3">🎓 Education</h3>
              {Array.isArray(data.education) && data.education.length > 0 ? (
                data.education.map((edu, index) => (
                  <div key={index} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold">{edu.degree || "Degree"}</h5>
                      <h6 className="text-primary">
                        {edu.institution || "Institution"}
                      </h6>
                      {(edu.startYear || edu.endYear || edu.cgpa) && (
                        <p className="text-muted">
                          {edu.startYear || ""} - {edu.endYear || "Present"}
                          {edu.cgpa && ` • CGPA: ${edu.cgpa}`}
                        </p>
                      )}
                      {edu.fieldOfStudy && <p>{edu.fieldOfStudy}</p>}
                      {edu.description && (
                        <div
                          dangerouslySetInnerHTML={{ __html: edu.description }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No education details added yet.</p>
              )}
            </div>

            {/* CERTIFICATIONS */}
            <div className="mt-5">
              <h3 className="fw-bold mb-3">🏆 Certifications</h3>
              {Array.isArray(data.certifications) &&
              data.certifications.length > 0 ? (
                data.certifications.map((cert, index) => (
                  <div key={index} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold">{cert.name || "Certification"}</h5>
                      {cert.issuer && (
                        <h6 className="text-primary">{cert.issuer}</h6>
                      )}
                      {cert.issueDate && (
                        <p className="text-muted">Issued: {cert.issueDate}</p>
                      )}
                      {cert.certificateLink && (
                        <a
                          href={normalizeUrl(cert.certificateLink)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          🔗 View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No certifications added yet.</p>
              )}
            </div>

            {/* ACHIEVEMENTS */}
            <div className="mt-5">
              <h3 className="fw-bold mb-3">🌟 Achievements</h3>
              {Array.isArray(data.achievements) &&
              data.achievements.length > 0 ? (
                data.achievements.map((achievement, index) => (
                  <div key={index} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold">
                        {achievement.title || "Achievement"}
                      </h5>
                      {achievement.date && (
                        <p className="text-muted">Date: {achievement.date}</p>
                      )}
                      {achievement.description && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: achievement.description,
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No achievements added yet.</p>
              )}
            </div>

            {/* GITHUB REPOSITORIES */}
            {repos.length > 0 && (
              <div className="mt-5">
                <h3 className="fw-bold mb-3">💻 GitHub Repositories</h3>
                <div className="row g-3">
                  {repos.map((repo) => (
                    <div key={repo.id} className="col-md-6">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5 className="fw-bold">{repo.name}</h5>
                          {repo.description && (
                            <p className="text-muted">{repo.description}</p>
                          )}
                          <div className="mb-2">
                            {repo.language && (
                              <span className="badge bg-secondary me-2">
                                {repo.language}
                              </span>
                            )}
                            <span className="badge bg-light text-dark">
                              ⭐ {repo.stargazers_count || 0}
                            </span>
                          </div>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-dark"
                          >
                            View Repository
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default PublicPortfolio; 