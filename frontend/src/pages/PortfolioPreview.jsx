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

  // Open Public Portfolio
  const openPublicPortfolio =
    () => {

      window.open(
        `/portfolio/${data?.username}`,
        "_blank"
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

        <div className="card shadow-lg p-4 rounded-4 text-center">

          <h2 className="mb-4 fw-bold">
            Portfolio Preview
          </h2>

          {/* Buttons */}
          <div className="mb-4">

            <button
              className="btn btn-success me-3"
              onClick={
                openPublicPortfolio
              }
            >
              🌍 Public Portfolio
            </button>

            <button
              className="btn btn-warning"
              onClick={() =>
                navigate("/builder")
              }
            >
              ✏️ Edit Portfolio
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

          <h2>
            {data?.fullName}
          </h2>

          <p>
            @{data?.username}
          </p>

          <p>
            {data?.about}
          </p>

          <p>
            <strong>
              🛠 Skills:
            </strong>{" "}
            {data?.skills}
          </p>

          {/* Links */}
          <p>
            <strong>
              💻 GitHub:
            </strong>{" "}

            {data?.github && (
              <a
                href={
                  data.github.startsWith("http")
                    ? data.github
                    : `https://${data.github}`
                }
                target="_blank"
                rel="noreferrer"
              >
                GitHub Profile
              </a>
            )}

          </p>

          <p>
            <strong>
              💼 LinkedIn:
            </strong>{" "}

            {data?.linkedin && (
              <a
                href={
                  data.linkedin.startsWith("http")
                    ? data.linkedin
                    : `https://${data.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
            )}

          </p>

          {/* Resume */}
          <p>
            <strong>
              📄 Resume:
            </strong>{" "}

            {data?.resume && (
              <a
                href={
                  data.resume.startsWith("http")
                    ? data.resume
                    : `https://portfolio-builder-jxjx.onrender.com${data.resume}`
                }
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            )}

          </p>

          {/* Projects */}
          <h4>
            🚀 Projects
          </h4>

          <ul className="list-group mb-4">

            {(Array.isArray(
              data?.projects
            )
              ? data.projects
              : []
            ).map(
              (
                project,
                index
              ) => (

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