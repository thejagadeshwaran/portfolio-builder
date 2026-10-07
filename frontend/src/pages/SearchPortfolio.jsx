import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function SearchPortfolio() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e?.preventDefault();

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    setLoading(true);

    // Simply navigate — PublicPortfolio will handle fetching + error states
    setTimeout(() => {
      navigate(`/portfolio/${username.trim().toLowerCase()}`);
      setLoading(false);
    }, 400);
  };

  return (
    <>
      <style>{`
        .search-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
        }

        .search-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          backdrop-filter: blur(16px);
          max-width: 520px;
          width: 100%;
        }

        .form-control-custom {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 50px;
          padding: 16px 24px;
          font-size: 1.1rem;
        }

        .form-control-custom::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-control-custom:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.25);
          color: white;
        }

        .btn-search {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 50px;
          padding: 16px;
          font-size: 1.15rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.35);
        }

        .btn-search:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.5);
          color: white;
        }

        .btn-search:disabled {
          opacity: 0.7;
        }

        .btn-demo {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 50px;
          padding: 12px 24px;
          transition: all 0.3s ease;
        }

        .btn-demo:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
      `}</style>

      <Navbar />

      <div className="search-page d-flex align-items-center">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="search-card shadow-lg p-4 p-md-5 mx-auto"
              >
                <div className="text-center mb-5">
                  <div style={{ fontSize: "3.5rem" }}>🔍</div>
                  <h1 className="fw-bold mt-3 mb-2">Search Portfolio</h1>
                  <p className="text-secondary fs-5 mb-0">
                    Find any public portfolio by username
                  </p>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      placeholder="Enter username (e.g. thejagadeshwaran)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-search w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Searching...
                      </>
                    ) : (
                      "Search Portfolio"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-secondary mb-3">or try the demo</p>
                  <button
                    className="btn btn-demo"
                    onClick={() => navigate("/portfolio/demo")}
                  >
                    👀 View Demo Portfolio
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPortfolio;