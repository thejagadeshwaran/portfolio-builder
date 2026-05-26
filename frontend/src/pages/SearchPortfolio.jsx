import { useState }
from "react";

import axios
from "axios";

import {
 useNavigate
}
from "react-router-dom";

import Navbar
from "../components/Navbar";

function SearchPortfolio() {

  const [username,
  setUsername] =
  useState("");

  const [loading,
  setLoading] =
  useState(false);

  const navigate =
  useNavigate();

  const handleSearch =
  async () => {

    if (!username.trim()) {

      alert(
"Please enter username"
      );

      return;
    }

    setLoading(true);

    try {

      const response =
      await axios.get(
`https://portfolio-builder-jxjx.onrender.com/api/portfolio/search/${username}`
      );

      if (response.data) {

        navigate(
`/portfolio/${username}`
        );

      } else {

        alert(
"Portfolio not found"
        );
      }

    } catch (error) {

      console.error(error);

      alert(
"User not found"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
className="container d-flex justify-content-center align-items-center"
style={{
minHeight: "80vh"
}}
      >

        <div
className="card shadow-lg border-0 rounded-4 p-5"
style={{
maxWidth: "500px",
width: "100%"
}}
        >

          <div className="text-center">

            <h1 className="fw-bold mb-3">
              🔍 Search Portfolio
            </h1>

            <p className="text-muted mb-4">
              Find portfolios by username
            </p>

          </div>

          <input
type="text"
className="form-control form-control-lg rounded-pill mb-4 shadow-sm"
placeholder="Enter username..."
value={username}
onChange={(e) =>
setUsername(
e.target.value
)}
          />

          <button
className="btn btn-primary btn-lg w-100 rounded-pill shadow"
onClick={handleSearch}
disabled={loading}
          >

            {loading
              ? "Searching..."
              : "Search Portfolio"}

          </button>

        </div>
      </div>
    </>
  );
}

export default SearchPortfolio;