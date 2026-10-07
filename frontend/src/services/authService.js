import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      credentials
    );

    return response;
  },

  // Register
  register: async (userData) => {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      userData
    );

    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("portfolioUsername");
  },
};