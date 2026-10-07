import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [scrolled, setScrolled] = useState(false);

  // Add shadow when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <style>{`
        .main-navbar {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
          z-index: 1050;
        }

        .main-navbar.scrolled {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .navbar-brand {
          background: linear-gradient(90deg, #38bdf8, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .nav-link-custom {
          color: #e2e8f0 !important;
          font-weight: 500;
          padding: 8px 14px !important;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .nav-link-custom:hover {
          color: #38bdf8 !important;
          background: rgba(56, 189, 248, 0.1);
        }

        .btn-nav {
          border-radius: 50px;
          font-weight: 500;
          padding: 8px 20px;
        }

        .btn-logout {
          background: #ef4444;
          border: none;
          color: white;
        }

        .btn-logout:hover {
          background: #dc2626;
          color: white;
        }

        .btn-getstarted {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: none;
          color: white;
        }

        .btn-getstarted:hover {
          background: linear-gradient(135deg, #0284c7, #0369a1);
          color: white;
        }
      `}</style>

      <nav className={`navbar navbar-expand-lg sticky-top main-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            🚀 Portfolio Builder
          </Link>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-1">

              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/search">
                  🔍 Search
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/portfolio/demo">
                  🎨 Demo
                </Link>
              </li>

              {token && (
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              )}

              {/* Auth Buttons */}
              {!token ? (
                <>
                  <li className="nav-item ms-lg-2">
                    <Link className="btn btn-outline-light btn-nav" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-getstarted btn-nav" to="/register">
                      Get Started
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-logout btn-nav" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;