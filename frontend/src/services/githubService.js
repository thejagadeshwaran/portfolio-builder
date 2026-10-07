// frontend/src/services/githubService.js
import axios from "axios";

export const githubService = {
  getUserRepos: async (username) => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("GitHub API Error:", error);
      return [];
    }
  }
};