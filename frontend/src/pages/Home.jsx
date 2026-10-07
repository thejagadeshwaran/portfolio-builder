import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #0ea5e9;
          --primary-dark: #0284c7;
          --accent: #f43f5e;
          --bg-dark: #0f172a;
          --bg-card: rgba(255, 255, 255, 0.06);
        }

        body {
          background: #0f172a;
        }

        .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .hero-bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
          z-index: 0;
        }

        .glow-1 {
          background: #0ea5e9;
          top: -100px;
          left: -100px;
        }

        .glow-2 {
          background: #f43f5e;
          bottom: -150px;
          right: -100px;
        }

        .gradient-text {
          background: linear-gradient(90deg, #38bdf8, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: none;
          color: white;
          font-weight: 600;
          padding: 14px 36px;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.35);
        }

        .btn-primary-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.5);
          color: white;
        }

        .btn-outline-custom {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 600;
          padding: 14px 36px;
          border-radius: 50px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .btn-outline-custom:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          color: white;
          transform: translateY(-3px);
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          height: 100%;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(14, 165, 233, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(244, 63, 94, 0.15));
          margin-bottom: 1.25rem;
        }

        .badge-custom {
          background: rgba(14, 165, 233, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(14, 165, 233, 0.3);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .mockup-img {
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.5s ease;
        }

        .mockup-img:hover {
          transform: scale(1.03);
        }

        .check-item {
          color: #94a3b8;
          font-weight: 500;
        }

        .check-item span {
          color: #34d399;
          margin-right: 6px;
        }

        @media (max-width: 991.98px) {
          .hero-content {
            text-align: center;
          }
          .hero-buttons {
            justify-content: center;
          }
          .check-list {
            justify-content: center;
          }
        }
      `}</style>

      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section d-flex align-items-center position-relative">
        <div className="hero-bg-glow glow-1"></div>
        <div className="hero-bg-glow glow-2"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center py-5">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-lg-7 hero-content"
            >
              <div className="badge-custom d-inline-block mb-4">
                ✨ Professional Portfolios in Minutes
              </div>

              <h1 className="display-3 fw-bold text-white mb-4" style={{ lineHeight: 1.15 }}>
                Build a <span className="gradient-text">Stunning</span>
                <br />
                Portfolio That Gets You Hired
              </h1>

              <p className="lead text-secondary mb-5" style={{ maxWidth: "540px", fontSize: "1.25rem" }}>
                Create beautiful, responsive, and professional portfolios with
                AI assistance, real-time preview, and one-click sharing.
              </p>

              <div className="d-flex flex-wrap gap-3 hero-buttons mb-5">
                <button onClick={handleGetStarted} className="btn btn-primary-custom btn-lg">
                  🚀 Get Started Free
                </button>

                <button
                  onClick={() => navigate("/portfolio/demo")}
                  className="btn btn-outline-custom btn-lg"
                >
                  👀 Live Demo
                </button>
              </div>

              <div className="d-flex flex-wrap gap-4 check-list">
                <div className="check-item">
                  <span>✔</span> Export as PDF
                </div>
                <div className="check-item">
                  <span>✔</span> GitHub Sync
                </div>
                <div className="check-item">
                  <span>✔</span> Contact Form
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-lg-5 mt-5 mt-lg-0 text-center"
            >
              <img
                src="https://picsum.photos/id/1015/800/600"
                alt="Portfolio Preview"
                className="img-fluid mockup-img"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-5" style={{ background: "#0f172a" }}>
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold text-white mb-3">
              Everything You Need
            </h2>
            <p className="lead text-secondary">
              Powerful tools to showcase your best work effortlessly.
            </p>
          </motion.div>

          <div className="row g-4">
            {[
              {
                icon: "🤖",
                title: "AI Resume Parser",
                desc: "Upload your resume and auto-fill everything in seconds",
              },
              {
                icon: "📊",
                title: "Real-time Preview",
                desc: "See every change instantly as you build your portfolio",
              },
              {
                icon: "🌍",
                title: "Public Portfolio",
                desc: "Share a unique live link that anyone can visit",
              },
              {
                icon: "📄",
                title: "PDF Export",
                desc: "One-click professional resume download",
              },
              {
                icon: "🔗",
                title: "GitHub Sync",
                desc: "Auto-pull your latest repositories and track clicks",
              },
              {
                icon: "📩",
                title: "Contact Form",
                desc: "Visitors can message you directly from your portfolio",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="col-md-6 col-lg-4"
              >
                <div className="feature-card p-4 p-lg-5">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="fw-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-secondary mb-0" style={{ fontSize: "1.05rem" }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;