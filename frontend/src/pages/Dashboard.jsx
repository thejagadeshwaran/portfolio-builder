import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    totalPortfolios: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalMessages: 0,
    totalGithubClicks: 0,
  });

  // ========================================
  // FETCH PORTFOLIOS
  // ========================================

  const fetchPortfolios = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/portfolio/my-portfolios?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userPortfolios = response.data || [];
      setPortfolios(userPortfolios);

      // Calculate Analytics
      const totalViews = userPortfolios.reduce(
        (sum, p) => sum + (p.views || 0),
        0
      );
      const totalDownloads = userPortfolios.reduce(
        (sum, p) => sum + (p.resumeDownloads || 0),
        0
      );
      const totalMessages = userPortfolios.reduce(
        (sum, p) => sum + (p.contactMessages || 0),
        0
      );
      const totalGithubClicks = userPortfolios.reduce(
        (sum, p) => sum + (p.githubClicks || 0),
        0
      );

      setAnalytics({
        totalPortfolios: userPortfolios.length,
        totalViews,
        totalDownloads,
        totalMessages,
        totalGithubClicks,
      });
    } catch (error) {
      console.error("❌ Fetch Portfolios Error:", error);
      alert("Failed to load portfolios. Please try logging in again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========================================
  // DUPLICATE PORTFOLIO
  // ========================================

  const duplicatePortfolio = async (id) => {
    if (!window.confirm("Create a copy of this portfolio?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/portfolio/duplicate/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Portfolio duplicated successfully! 🎉");
      fetchPortfolios();
    } catch (error) {
      console.error("❌ Duplicate Error:", error);
      alert(error.response?.data?.message || "Failed to duplicate portfolio.");
    }
  };

  // ========================================
  // DELETE PORTFOLIO
  // ========================================

  const deletePortfolio = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      await axios.delete(`${API_URL}/portfolio/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Portfolio deleted successfully! 🗑️");
      await fetchPortfolios();
    } catch (error) {
      console.error("❌ Delete Error:", error);
      alert(error.response?.data?.message || "Failed to delete portfolio.");
    }
  };

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
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
          <div className="text-center">
            <div
              className="spinner-border text-info"
              style={{ width: "3.5rem", height: "3.5rem" }}
              role="status"
            ></div>
            <h4 className="mt-4 text-white">Loading your workspace...</h4>
          </div>
        </div>
      </>
    );
  }

  // ========================================
  // DASHBOARD UI
  // ========================================

  const metricCards = [
    {
      icon: "📁",
      title: "Total Portfolios",
      value: analytics.totalPortfolios,
      color: "#0ea5e9",
      bg: "rgba(14, 165, 233, 0.12)",
    },
    {
      icon: "👀",
      title: "Total Views",
      value: analytics.totalViews,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
    },
    {
      icon: "📥",
      title: "Resume Downloads",
      value: analytics.totalDownloads,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.12)",
    },
    {
      icon: "💬",
      title: "Messages Received",
      value: analytics.totalMessages,
      color: "#f43f5e",
      bg: "rgba(244, 63, 94, 0.12)",
    },
    {
      icon: "🔗",
      title: "GitHub Clicks",
      value: analytics.totalGithubClicks,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.12)",
    },
  ];

  return (
    <>
      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          padding-bottom: 80px;
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

        .portfolio-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          height: 100%;
        }

        .portfolio-card:hover {
          transform: translateY(-8px);
          border-color: rgba(14, 165, 233, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .btn-create {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 50px;
          padding: 12px 32px;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.35);
          transition: all 0.3s ease;
        }

        .btn-create:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.5);
          color: white;
        }

        .btn-action {
          border-radius: 12px;
          font-weight: 500;
        }
      `}</style>

      <Navbar />

      <div className="dashboard-page">
        <div className="container py-5">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div>
              <h1 className="display-5 fw-bold mb-2">Dashboard</h1>
              <p className="text-secondary fs-5 mb-0">
                Welcome back! Here's how your portfolios are performing.
              </p>
            </div>

            <button
              className="btn btn-create"
              onClick={() => navigate("/builder")}
            >
              + Create New Portfolio
            </button>
          </div>

          {/* Analytics Overview */}
          <div className="mb-5">
            <h4 className="fw-semibold mb-4">📊 Performance Overview</h4>

            <div className="row g-4">
              {metricCards.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="col-6 col-md-4 col-xl"
                >
                  <div className="metric-card p-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: metric.bg,
                        fontSize: "24px",
                      }}
                    >
                      {metric.icon}
                    </div>

                    <h3
                      className="fw-bold mb-1"
                      style={{ color: metric.color, fontSize: "1.8rem" }}
                    >
                      {metric.value}
                    </h3>
                    <p className="text-secondary mb-0 small">{metric.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Portfolios Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">My Portfolios</h3>
            <span className="text-secondary">
              {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Empty State */}
          {portfolios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-5 rounded-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: "4rem" }}>📁</div>
              <h3 className="mt-3 mb-2">No portfolios yet</h3>
              <p className="text-secondary mb-4">
                Create your first professional portfolio to get started
              </p>
              <button
                className="btn btn-create"
                onClick={() => navigate("/builder")}
              >
                Create Your First Portfolio
              </button>
            </motion.div>
          ) : (
            <div className="row g-4">
              {portfolios.map((portfolio, index) => (
                <motion.div
                  key={portfolio._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="col-md-6 col-xl-4"
                >
                  <div className="portfolio-card p-4">
                    {/* Profile Image + Title */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {portfolio.profileImage ? (
                        <img
                          src={portfolio.profileImage}
                          alt="Profile"
                          className="rounded-circle"
                          width="56"
                          height="56"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "56px",
                            height: "56px",
                            background: "rgba(14, 165, 233, 0.2)",
                            fontSize: "1.5rem",
                          }}
                        >
                          👤
                        </div>
                      )}

                      <div>
                        <h5 className="fw-bold mb-0">
                          {portfolio.portfolioTitle || portfolio.fullName}
                        </h5>
                        <p className="text-secondary mb-0 small">
                          @{portfolio.username}
                        </p>
                      </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="d-flex gap-3 text-secondary small mb-4">
                      <span>👀 {portfolio.views || 0}</span>
                      <span>📥 {portfolio.resumeDownloads || 0}</span>
                      <span>💬 {portfolio.contactMessages || 0}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-info btn-action"
                        onClick={() =>
                          navigate(`/preview/${portfolio._id}`)
                        }
                      >
                        👁 Preview
                      </button>

                      <button
                        className="btn btn-warning btn-action text-dark"
                        onClick={() =>
                          navigate(`/builder?edit=${portfolio._id}`)
                        }
                      >
                        ✏ Edit Portfolio
                      </button>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-secondary btn-action flex-fill"
                          onClick={() => duplicatePortfolio(portfolio._id)}
                        >
                          📄 Duplicate
                        </button>

                        <button
                          className="btn btn-outline-danger btn-action flex-fill"
                          onClick={() => deletePortfolio(portfolio._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;