import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("blinkit_token");
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user info
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token and fetch user data
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Token is invalid, clear it
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post("/user/login", credentials, {
        withCredentials: true,
      });

      if (response.data.success && response.data.accessToken) {
        const accessToken = response.data.accessToken;
        
        // Store token in localStorage
        localStorage.setItem("blinkit_token", accessToken);
        setToken(accessToken);

        // Fetch user profile
        const userResponse = await api.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userResponse.data.success) {
          setUser(userResponse.data.data);
        }

        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem("blinkit_token");
      setToken(null);
      setUser(null);

      // Optionally call logout endpoint to invalidate token on server
      // await api.post("/user/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

