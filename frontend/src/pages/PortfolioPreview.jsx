import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";
import {
  useNavigate
} from "react-router-dom";

import Navbar from "../components/Navbar";

function PortfolioPreview() {

  const [data, setData] =
    useState(null);

  const [repos, setRepos] =
    useState([]);

  const navigate =
    useNavigate();

  // Fetch GitHub Repositories
  const fetchGitHubRepos =
    async (username) => {

      try {

        const response =
          await axios.get(
            `https://api.github.com/users/${username}/repos`
          );

        setRepos(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      } catch (error) {

        console.error(error);

        setRepos([]);
      }
    };

  // Fetch Portfolio
  const fetchPortfolio =
    useCallback(async () => {

      try {

        const username =
          localStorage.getItem(
            "portfolioUsername"
          );

        if (!username) {

          alert(
            "No portfolio found"
          );

          navigate(
            "/builder"
          );

          return;
        }

        const response =
          await axios.get(
            `https://portfolio-builder-jxjx.onrender.com/api/portfolio/user/${username}`
          );

        const portfolio =
          response.data || {};

        // Safe projects fix
        portfolio.projects =
          Array.isArray(
            portfolio.projects
          )
            ? portfolio.projects
            : [];

        setData(
          portfolio
        );

        // Fetch GitHub repos
        if (
          portfolio.githubUsername
        ) {

          fetchGitHubRepos(
            portfolio.githubUsername
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          "Portfolio not found"
        );
      }

    }, [navigate]);

  useEffect(() => {

    fetchPortfolio();

  }, [fetchPortfolio]);

  // Theme
  const getThemeClass =
    () => {

      switch (
      data?.theme
      ) {

        case "professional":
          return "bg-light border";

        case "developer":
          return "bg-dark text-white";

        default:
          return "bg-white";
      }
    };

  // Delete Portfolio
  const handleDelete =
    async () => {

      try {

        await axios.delete(
          `https://portfolio-builder-jxjx.onrender.com/api/portfolio/delete/${data?._id}`
        );

        localStorage.removeItem(
          "portfolioUsername"
        );

        alert(
          "Portfolio Deleted Successfully!"
        );

        navigate(
          "/builder"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Error deleting portfolio"
        );
      }
    };

  // Edit Portfolio
  const handleEdit =
    () => {

      localStorage.setItem(
        "editPortfolio",
        JSON.stringify(data)
      );

      navigate(
        "/builder"
      );
    };

  // Loading
  if (!data) {

    return (
      <div className="text-center mt-5">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">

        <div
          className={`card shadow-lg p-4 rounded-4 text-center ${getThemeClass()}`}
        >

          <h2 className="mb-4 fw-bold">
            Portfolio Preview
          </h2>

          {/* Buttons */}
          <div className="mb-4">

            <button
              className="btn btn-warning me-3 px-4"
              onClick={handleEdit}
            >
              ✏️ Edit Portfolio
            </button>

            <button
              className="btn btn-danger px-4"
              onClick={handleDelete}
            >
              🗑 Delete Portfolio
            </button>

          </div>

          {/* Profile Image */}
          {data?.profileImage &&
          !data.profileImage.startsWith("blob:") && (

            <img
              src={data.profileImage}
              alt="Profile"
              width="180"
              height="180"
              className="rounded-circle border shadow mb-3"
              style={{
                objectFit: "cover"
              }}
            />

          )}

          <h2 className="fw-bold">
            {data?.fullName}
          </h2>

          <p className="text-muted">
            @{data?.username}
          </p>

          <hr />

          <div className="text-start">

            <p>
              <strong>📞 Phone:</strong>{" "}
              {data?.phone || "N/A"}
            </p>

            <p>
              <strong>📝 About:</strong>{" "}
              {data?.about || "N/A"}
            </p>

            <p>
              <strong>🛠 Skills:</strong>{" "}
              {data?.skills || "N/A"}
            </p>

            <p>
              <strong>👀 Views:</strong>{" "}
              {data?.views || 0}
            </p>

            <p>
              <strong>💻 GitHub:</strong>{" "}

              <a
                href={data?.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub Profile
              </a>
            </p>

            <p>
              <strong>💼 LinkedIn:</strong>{" "}

              <a
                href={data?.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
            </p>

            <p>
              <strong>📄 Resume:</strong>{" "}

              <a
                href={data?.resume}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            </p>

          </div>

          {/* Projects */}
          <h4 className="mt-4">
            🚀 Projects
          </h4>

          <ul className="list-group mb-4">

            {(Array.isArray(
              data?.projects
            )
              ? data.projects
              : []
            ).map(
              (project, index) => (

                <li
                  key={index}
                  className="list-group-item"
                >
                  {project}
                </li>
              ))}

          </ul>

          {/* GitHub Repositories */}
          <h4>
            💻 GitHub Repositories
          </h4>

          <ul className="list-group">

            {(Array.isArray(
              repos
            )
              ? repos
              : []
            ).map(
              (repo) => (

                <li
                  key={repo.id}
                  className="list-group-item"
                >

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {repo.name}
                  </a>

                </li>
              ))}

          </ul>

        </div>
      </div>
    </>
  );
}

export default PortfolioPreview;