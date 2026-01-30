/**
 * AuthContext - Provides authentication state globally
 * 
 * Supports both mock localStorage auth and Django API auth.
 * Token management is handled by src/config/api.js
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  isAdmin as checkIsAdmin,
  validateSession
} from "../services/authService.js";
import { 
  API_CONFIG, 
  getAuthToken, 
  clearAllTokens 
} from "../config/api.js";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
useEffect(() => {
  const initAuth = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setUser(null);
        return;
      }

      const res = await fetch(
        "https://learnvanta-platform.onrender.com/api/v1/auth/profile/",
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      if (!res.ok) throw new Error("Session invalid");

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem("edustream_user", JSON.stringify(userData));
    } catch (e) {
      console.error("Auth init error:", e);
      setUser(null);
      clearAllTokens();
      localStorage.removeItem("edustream_user");
    } finally {
      setIsLoading(false);
    }
  };

  initAuth();
}, []);


  // Login function
  const login = useCallback(async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    localStorage.setItem("edustream_user", JSON.stringify(userData));
    return userData;
  }, []);

  // Signup function
  const signup = useCallback(async (name, email, password) => {
    const userData = await registerUser(name, email, password);
    // Don't auto-login if verification is pending
    if (!userData.verificationPending) {
      setUser(userData);
      localStorage.setItem("edustream_user", JSON.stringify(userData));
    }
    return userData;
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignore logout errors
    }
    setUser(null);
    localStorage.removeItem("edustream_user");
    clearAllTokens();
  }, []);

  // Update user data (after profile changes)
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("edustream_user", JSON.stringify(updatedUser));
  }, []);

  // Refresh user data from server (for real API mode)
  const refreshUser = useCallback(async () => {
    if (API_CONFIG.useMock || !user) return;
    
    try {
      // In real API, fetch fresh user data
      // const freshUser = await apiRequest(API_ENDPOINTS.auth.profile);
      // updateUser(freshUser);
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
  }, [user]);

  // Check if current user is admin
  // IMPORTANT: In production, this should be validated server-side
  // The role comes from the user_roles table, not client storage
  const isAdmin = checkIsAdmin(user);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
