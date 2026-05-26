import {
 useEffect,
 useState
}
from "react";

import axios
from "axios";

import Navbar
from "../components/Navbar";

function Analytics() {

  const [portfolio,
  setPortfolio] =
  useState(null);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics =
  async () => {

    try {

      const savedPortfolio =
      JSON.parse(
localStorage.getItem(
"editPortfolio"
      ));

      if (
savedPortfolio?.username
      ) {

        const response =
        await axios.get(
`http://https://portfolio-builder-navy-eight.vercel.app//api/portfolio/user/${savedPortfolio.username}`
        );

        setPortfolio(
response.data
        );
      }

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <div className="card shadow-lg p-5 text-center rounded-4">

          <h2 className="fw-bold mb-4">
            📊 Portfolio Analytics
          </h2>

          <div className="card p-4 shadow border-0 rounded-4">

            <h1 className="display-3 fw-bold text-primary">

              {portfolio?.views || 0}

            </h1>

            <p className="lead">
              Total Portfolio Views
            </p>

            <hr />

            <h4>
              👤 {portfolio?.fullName}
            </h4>

            <p>
              @{portfolio?.username}
            </p>

          </div>

        </div>
      </div>
    </>
  );
}

export default Analytics;