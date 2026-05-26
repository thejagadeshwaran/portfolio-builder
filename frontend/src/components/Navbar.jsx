import { Link, useNavigate }
from "react-router-dom";

function Navbar() {

  const navigate =
  useNavigate();

  const toggleTheme =
  () => {

    document.body.classList.toggle(
      "bg-dark"
    );

    document.body.classList.toggle(
      "text-white"
    );
  };

  const token =
  localStorage.getItem(
    "token"
  );

  const handleLogout =
  () => {

    localStorage.removeItem(
      "token"
    );

    alert(
      "Logout Successful!"
    );

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav
className="navbar navbar-expand-lg navbar-dark bg-dark px-4"
    >

      <Link
className="navbar-brand"
to="/"
      >
        Portfolio Builder
      </Link>

      <div className="ms-auto">

        <Link
to="/search"
className="btn btn-info me-2"
        >
          Search
        </Link>

        <button
className="btn btn-warning me-2"
onClick={toggleTheme}
        >
          🌙 Theme
        </button>

        {!token ? (
          <>
            <Link
to="/login"
className="btn btn-outline-light me-2"
            >
              Login
            </Link>

            <Link
to="/register"
className="btn btn-primary"
            >
              Register
            </Link>
          </>
        ) : (
          <button
className="btn btn-danger"
onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;