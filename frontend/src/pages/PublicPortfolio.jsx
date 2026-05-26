import {
 useEffect,
 useState
}
from "react";

import axios
from "axios";

import {
 useParams
}
from "react-router-dom";

import Navbar
from "../components/Navbar";

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
  async (
githubUsername
  ) => {

    try {

      const response =
      await axios.get(
`https://api.github.com/users/${githubUsername}/repos`
      );

      setRepos(
response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  // Load Portfolio + Views
  useEffect(() => {

    const loadPortfolio =
    async () => {

      try {

        // Check already viewed
        const viewed =
        sessionStorage.getItem(
`viewed-${username}`
        );

        // Increase only once
        if (!viewed) {

          await axios.put(
`http://localhost:5000/api/portfolio/view/${username}`
          );

          sessionStorage.setItem(
`viewed-${username}`,
"true"
          );
        }

        // Fetch updated profile
        const response =
        await axios.get(
`http://localhost:5000/api/portfolio/user/${username}`
        );

        setData(
response.data
        );

        // GitHub repos
        if (
response.data
?.githubUsername
        ) {

          fetchGitHubRepos(
response.data
.githubUsername
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
          <img
src={data?.profileImage}
alt="Profile"
width="180"
height="180"
className="rounded-circle border shadow mb-3"
style={{
objectFit: "cover"
}}
          />

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
{data?.phone}
            </p>

            <p>
<strong>
📝 About:
</strong>{" "}
{data?.about}
            </p>

            <p>
<strong>
🛠 Skills:
</strong>{" "}
{data?.skills}
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

            {data?.projects?.map(
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

            {repos.map(
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