import {
 useEffect,
 useState
}
from "react";

import axios
from "axios";

import Navbar
from "../components/Navbar";

import {
 useNavigate
}
from "react-router-dom";

function Login() {

  const navigate =
  useNavigate();

  // Redirect if already logged in
  useEffect(() => {

    const token =
    localStorage.getItem(
      "token"
    );

    if (token) {

navigate(
"/dashboard"
);
    }

  }, [navigate]);

  const [formData,
    setFormData] =
    useState({
      email: "",
      password: ""
    });

  const handleChange =
  (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
      e.target.value
    });
  };

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      const response =
      await axios.post(
"http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
response.data.token
      );

      alert(
"Login Successful!"
      );

      navigate(
"/builder"
      );

    } catch (error) {

      alert(
error.response?.data?.message
||
"Login Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div
className="container mt-5"
style={{
maxWidth: "400px"
}}
      >

        <div
className="card shadow p-4"
        >

          <h2
className="text-center mb-4"
          >
            Login
          </h2>

          <form
onSubmit={handleSubmit}
          >

            <div className="mb-3">

              <label>
Email
              </label>

              <input
type="email"
name="email"
className="form-control"
placeholder="Enter email"
onChange={
handleChange
}
required
              />

            </div>

            <div className="mb-3">

              <label>
Password
              </label>

              <input
type="password"
name="password"
className="form-control"
placeholder="Enter password"
onChange={
handleChange
}
required
              />

            </div>

            <button
className="btn btn-success w-100"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default Login;