import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setUser({
        _id: userId,
        token,
      });
    }

    setLoading(false);
  }, []);

  // Login / Register
  const login = (userData) => {
    if (!userData || !userData.token) {
      console.error("Invalid authentication response:", userData);
      return;
    }

    let userId = userData.userId || userData._id;

    // Get user ID from JWT if backend didn't return userId
    if (!userId && userData.token) {
      try {
        const payload = JSON.parse(
          atob(userData.token.split(".")[1])
        );

        userId = payload.id || payload._id || payload.userId;
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }

    if (!userId) {
      console.error("User ID not found in authentication response");
      return;
    }

    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userId);

    setUser({
      _id: userId,
      token: userData.token,
    });
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};