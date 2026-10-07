import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://portfolio-builder-online.onrender.com/api";

export const portfolioService = {
  getById: (id) =>
    axios.get(`${API_URL}/portfolio/${id}`),

  getByUsername: (username) =>
    axios.get(`${API_URL}/portfolio/user/${username}`),

  save: async (data) => {
    try {
      console.log("📤 Saving portfolio...");
      console.log("📦 Portfolio data:", data);

      const response = await axios.post(
        `${API_URL}/portfolio/save`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "✅ Portfolio saved:",
        response.data
      );

      return response;
    } catch (error) {
      console.error(
        "❌ Portfolio save error:",
        error
      );

      console.error(
        "❌ Backend response:",
        error?.response?.data
      );

      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(
        `${API_URL}/portfolio/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response;
    } catch (error) {
      console.error(
        "❌ Portfolio update error:",
        error
      );

      console.error(
        "❌ Backend response:",
        error?.response?.data
      );

      throw error;
    }
  },

  incrementView: (id) =>
    axios.put(`${API_URL}/portfolio/view/${id}`),

  trackDownload: (id) =>
    axios.put(
      `${API_URL}/portfolio/download/${id}`
    ),

  trackGithubClick: (id) =>
    axios.put(
      `${API_URL}/portfolio/github/${id}`
    ),
};