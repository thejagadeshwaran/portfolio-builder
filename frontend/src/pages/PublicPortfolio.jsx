import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useParams
} from "react-router-dom";

import Navbar from "../components/Navbar";

function PublicPortfolio() {

  const { username } =
    useParams();

  const [data,
    setData] =
    useState(null);

  const [repos,
    setRepos] =
    useState([]);

  // Fetch GitHub Repositories
  const fetchGitHubRepos =
    async (githubUsername) => {

      try {

        const response =
          await axios.get(
            `https://api.github.com/users/${githubUsername}/repos`
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

  // Load Portfolio + Views
  useEffect(() => {

    const loadPortfolio =
      async () => {

        try {

          const viewed =
            sessionStorage.getItem(
              `viewed-${username}`
            );

          // Increase views only once
          if (!viewed) {

            await axios.put(
              `https://portfolio-builder-jxjx.onrender.com/api/portfolio/view/${username}`
            );

            sessionStorage.setItem(
              `viewed-${username}`,
              "true"
            );
          }

          // Fetch Portfolio
          const response =
            await axios.get(
              `https://portfolio-builder-jxjx.onrender.com/api/portfolio/user/${username}`
            );

          const portfolio =
            response.data || {};

          // Fix projects safely
          portfolio.projects =
            Array.isArray(
              portfolio.projects
            )
              ? portfolio.projects
              : [];

          setData(
            portfolio
          );

          // Load GitHub repos
          if (
            portfolio?.githubUsername
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
      };

    loadPortfolio();

  }, [username]);

  // Loading
  if (!data) {

    return (
      <div className="text-center mt-5">
        <h2>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">

        <div className="card shadow-lg border-0 rounded-4 p-4 text-center">

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

          <p className="text-muted fs-5">
            @{data?.username}
          </p>

          <hr />

          <div className="text-start">

            <p>
              <strong>
                📞 Phone:
              </strong>{" "}
              {data?.phone || "N/A"}
            </p>

            <p>
              <strong>
                📝 About:
              </strong>{" "}
              {data?.about || "N/A"}
            </p>

            <p>
              <strong>
                🛠 Skills:
              </strong>{" "}
              {data?.skills || "N/A"}
            </p>

            <p>
              <strong>
                👀 Views:
              </strong>{" "}
              {data?.views || 0}
            </p>

            <p>
              <strong>
                💻 GitHub:
              </strong>{" "}

              <a
                href={data?.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub Profile
              </a>
            </p>

            <p>
              <strong>
                💼 LinkedIn:
              </strong>{" "}

              <a
                href={data?.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
            </p>

            <p>
              <strong>
                📄 Resume:
              </strong>{" "}

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

export default PublicPortfolio;