import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate =
    useNavigate();

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">
          Welcome Jagadesh 👋
        </h2>

        <div className="row">

          {/* Build Portfolio */}
          <div className="col-md-4 mb-3">

            <div className="card shadow p-4 text-center">

              <h4>
                Build Portfolio
              </h4>

              <p>
                Create your portfolio profile
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/builder")
                }
              >
                Open
              </button>

            </div>
          </div>

          {/* Preview Portfolio */}
          <div className="col-md-4 mb-3">

            <div className="card shadow p-4 text-center">

              <h4>
                Preview Portfolio
              </h4>

              <p>
                View your portfolio
              </p>

              <button
                className="btn btn-success"
                onClick={() =>
                  navigate("/preview")
                }
              >
                Preview
              </button>

            </div>
          </div>

          {/* Analytics */}
          <div className="col-md-4 mb-3">

            <div className="card shadow p-4 text-center">

              <h4>
                Analytics
              </h4>

              <p>
                Track profile views
              </p>

              <button
                className="btn btn-dark"
onClick={() =>
navigate(
"/analytics"
)
}
              >
                View
              </button>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;