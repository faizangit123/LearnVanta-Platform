/**
 * AuthContext - Provides authentication state globally
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  isAdmin as checkIsAdmin,
} from "../services/authService.js";
import { 
  API_CONFIG, 
  getAuthToken, 
  clearAllTokens,
  apiRequest
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

  
// Validate token on mount
useEffect(() => {
  const initAuth = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setUser(null);
        return;
      }

      const userData = await apiRequest("/auth/profile/");

      
      userData.isAdmin = userData.is_admin; 

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


  // Login
  const login = useCallback(async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    localStorage.setItem("edustream_user", JSON.stringify(userData));
    return userData;
  }, []);

  // Signup
  const signup = useCallback(async (name, email, password) => {
    const userData = await registerUser(name, email, password);
    if (!userData.verificationPending) {
      setUser(userData);
      localStorage.setItem("edustream_user", JSON.stringify(userData));
    }
    return userData;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {}
    setUser(null);
    localStorage.removeItem("edustream_user");
    clearAllTokens();
  }, []);

  // Update user
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("edustream_user", JSON.stringify(updatedUser));
  }, []);

  // REAL admin check (Django flags)
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
  };

  // THIS PREVENTS WHITE SCREENS
  if (isLoading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
