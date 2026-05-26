import { useState }
from "react";

import axios
from "axios";

import Navbar
from "../components/Navbar";

import { useNavigate }
from "react-router-dom";

function Register() {

  const navigate =
  useNavigate();

  const [formData,
    setFormData] =
    useState({
      name: "",
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
"http://https://portfolio-builder-jxjx.onrender.com//api/auth/register",
        formData
      );

      alert(
response.data.message
      );

      navigate("/login");

    } catch (error) {

      alert(
error.response?.data?.message
||
"Registration Failed"
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
            Register
          </h2>

          <form
onSubmit={handleSubmit}
          >

            <div className="mb-3">

              <label>
Name
              </label>

              <input
type="text"
name="name"
className="form-control"
placeholder="Enter name"
onChange={
handleChange
}
required
              />

            </div>

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
className="btn btn-primary w-100"
>
  Register
</button>

<p className="text-center mt-3">
  Already have an account?{" "}

  <span
style={{
color: "blue",
cursor: "pointer",
fontWeight: "bold"
}}
onClick={() =>
navigate("/login")
}
  >
    Sign In
  </span>
</p>
            
          </form>

        </div>
      </div>
    </>
  );
}

export default Register;