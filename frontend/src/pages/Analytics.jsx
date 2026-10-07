import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function Analytics() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const savedPortfolio = JSON.parse(
        localStorage.getItem("editPortfolio")
      );

      if (!savedPortfolio?.username) {
        setError("No portfolio found. Please edit a portfolio first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://https://portfolio-builder-online.onrender.com/api/portfolio/user/${savedPortfolio.username}`
      );

      setPortfolio(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      title: "Total Views",
      value: portfolio?.views || 0,
      icon: "👁️",
      color: "#0ea5e9",
      bg: "rgba(14, 165, 233, 0.12)",
    },
    {
      title: "Resume Downloads",
      value: portfolio?.resumeDownloads || 0,
      icon: "📄",
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.12)",
    },
    {
      title: "GitHub Clicks",
      value: portfolio?.githubClicks || 0,
      icon: "🔗",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
    },
    {
      title: "Contact Messages",
      value: portfolio?.contactMessages || 0,
      icon: "📩",
      color: "#f43f5e",
      bg: "rgba(244, 63, 94, 0.12)",
    },
  ];

  return (
    <>
      <style>{`
        .analytics-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          padding-bottom: 60px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          height: 100%;
        }

        .metric-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .header-card {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          backdrop-filter: blur(12px);
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Navbar />

      <div className="analytics-page">
        <div className="container py-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-5"
          >
            <h1 className="display-5 fw-bold mb-2">📊 Portfolio Analytics</h1>
            <p className="text-secondary fs-5">
              Track how people are engaging with your portfolio
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
              <div className="loading-spinner"></div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-5">
              <div className="header-card p-5 d-inline-block">
                <h4 className="text-danger mb-3">⚠️ {error}</h4>
                <button
                  onClick={fetchAnalytics}
                  className="btn btn-primary rounded-pill px-4"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && portfolio && (
            <>
              {/* Portfolio Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="header-card p-4 p-md-5 mb-5 text-center"
              >
                <h2 className="fw-bold mb-1">
                  {portfolio.portfolioTitle || "My Portfolio"}
                </h2>
                <p className="text-secondary mb-0 fs-5">
                  👤 {portfolio.fullName} &nbsp;•&nbsp; @{portfolio.username}
                </p>
              </motion.div>

              {/* Metrics Grid */}
              <div className="row g-4">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="col-sm-6 col-lg-3"
                  >
                    <div className="metric-card p-4">
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div
                          className="metric-icon"
                          style={{ background: metric.bg }}
                        >
                          {metric.icon}
                        </div>
                      </div>

                      <h3
                        className="display-5 fw-bold mb-1"
                        style={{ color: metric.color }}
                      >
                        {metric.value}
                      </h3>
                      <p className="text-secondary mb-0 fw-medium">
                        {metric.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Extra Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-5 text-secondary"
              >
                <small>
                  Last updated:{" "}
                  {portfolio.lastUpdated
                    ? new Date(portfolio.lastUpdated).toLocaleString()
                    : "N/A"}
                </small>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Analytics;