import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("Registration response:", response.data);

      const userData = response.data;

      // Automatically login after registration
      login(userData);

      // Optional: also store token/userId if your authService doesn't do it
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }
      if (userData.userId) {
        localStorage.setItem("userId", userData.userId);
      }

      alert("Registration Successful! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "Registration failed"
        );
      } else if (err.request) {
        setError(
          "Cannot connect to the server. Make sure the backend is running."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          padding-bottom: 60px;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          backdrop-filter: blur(16px);
          overflow: hidden;
        }

        .register-header {
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

        .btn-register {
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

        .btn-register:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.45);
          color: white;
        }

        .btn-register:disabled {
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

      <div className="register-page">
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="register-card shadow-lg"
              >
                {/* Header */}
                <div className="register-header text-center">
                  <h2 className="fw-bold mb-2">Create Account 🚀</h2>
                  <p className="mb-0 text-secondary">
                    Join and start building your portfolio
                  </p>
                </div>

                <div className="p-4 p-md-5">
                  {error && (
                    <div className="alert alert-custom py-3 mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        className="form-control form-control-custom"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
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

                    {/* Password */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="At least 6 characters"
                        className="form-control form-control-custom"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        className="form-control form-control-custom"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        minLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-register w-100 mb-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="mb-0 text-secondary">
                      Already have an account?{" "}
                      <Link to="/login" className="link-custom">
                        Sign in here
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

export default Register;