import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      const userData = response.data;

      console.log("🔍 FULL RESPONSE FROM SERVER:", userData);

      // Extract userId (from response or JWT)
      let userId = userData.userId;

      if (!userId && userData.token) {
        try {
          const payload = JSON.parse(atob(userData.token.split(".")[1]));
          userId = payload.id || payload._id;
        } catch (e) {
          console.error("Failed to decode JWT");
        }
      }

      console.log("Extracted userId:", userId);

      if (!userId) {
        console.error("No userId found!", userData);
        alert("Login successful but userId is missing. Check console.");
        return;
      }

      // Store token + userId
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userId", userId);

      login(userData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          padding-bottom: 60px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          backdrop-filter: blur(16px);
          overflow: hidden;
        }

        .login-header {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(244, 63, 94, 0.15));
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2.5rem 2rem;
        }

        .form-control-custom {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 1.05rem;
        }

        .form-control-custom::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-control-custom:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.25);
          color: white;
        }

        .btn-login {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 12px;
          padding: 14px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.45);
          color: white;
        }

        .btn-login:disabled {
          opacity: 0.7;
        }

        .link-custom {
          color: #38bdf8;
          font-weight: 600;
          text-decoration: none;
        }

        .link-custom:hover {
          color: #7dd3fc;
          text-decoration: underline;
        }

        .alert-custom {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.3);
          color: #fda4af;
          border-radius: 12px;
        }
      `}</style>

      <Navbar />

      <div className="login-page">
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="login-card shadow-lg"
              >
                {/* Header */}
                <div className="login-header text-center">
                  <h2 className="fw-bold mb-2">Welcome Back 👋</h2>
                  <p className="mb-0 text-secondary">
                    Sign in to manage your portfolios
                  </p>
                </div>

                <div className="p-4 p-md-5">
                  {error && (
                    <div className="alert alert-custom py-3 mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="form-control form-control-custom"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="form-control form-control-custom"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-login w-100 mb-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="mb-0 text-secondary">
                      Don't have an account?{" "}
                      <Link to="/register" className="link-custom">
                        Create one here
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;