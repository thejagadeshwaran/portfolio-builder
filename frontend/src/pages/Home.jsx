import Navbar
from "../components/Navbar";

import {
 useNavigate
}
from "react-router-dom";

function Home() {

  const navigate =
  useNavigate();

  const handleGetStarted =
  () => {

    const token =
    localStorage.getItem(
      "token"
    );

    // Logged in
    if (token) {

      navigate(
"/dashboard"
      );

    } else {

      // Not logged in
      navigate(
"/register"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div
className="container py-5"
      >

        <div className="row align-items-center">

          {/* Left Side */}
          <div className="col-lg-6 text-center text-lg-start">

            <h1
className="display-3 fw-bold mb-4"
            >
              Build Your
              <span className="text-primary">
{" "}Professional Portfolio
              </span>
            </h1>

            <p
className="lead text-muted mb-4"
            >
              Create, customize,
              and share your
              professional portfolio
              in minutes 🚀
            </p>

            <div>

              <button
className="btn btn-primary btn-lg rounded-pill px-4 me-3 shadow"
onClick={
handleGetStarted
}
              >
                🚀 Get Started
              </button>

              <button
className="btn btn-outline-dark btn-lg rounded-pill px-4"
onClick={() =>
navigate("/search")
}
              >
                🔍 Explore Portfolios
              </button>

            </div>

          </div>

          {/* Right Side */}
          <div className="col-lg-6 text-center mt-5 mt-lg-0">

            <img
src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
alt="Portfolio"
className="img-fluid"
style={{
maxWidth: "400px"
}}
            />

          </div>

        </div>

        {/* Features */}
        <div className="row mt-5 text-center">

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 rounded-4 p-4 h-100">

              <h3>
                🎨
              </h3>

              <h5 className="fw-bold">
                Beautiful Templates
              </h5>

              <p className="text-muted">
                Choose from modern
                and professional
                portfolio templates.
              </p>

            </div>
          </div>

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 rounded-4 p-4 h-100">

              <h3>
                🚀
              </h3>

              <h5 className="fw-bold">
                Fast Portfolio Builder
              </h5>

              <p className="text-muted">
                Build your portfolio
                quickly with a simple
                and easy interface.
              </p>

            </div>
          </div>

          <div className="col-md-4 mb-4">

            <div className="card shadow border-0 rounded-4 p-4 h-100">

              <h3>
                🌍
              </h3>

              <h5 className="fw-bold">
                Share Anywhere
              </h5>

              <p className="text-muted">
                Share your portfolio
                publicly with one link.
              </p>

            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default Home;