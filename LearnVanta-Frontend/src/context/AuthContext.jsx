/**
 * AuthContext - Provides authentication state globally
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  isAdmin as checkIsAdmin,
} from "../services/authService.js";

import {
  getAuthToken,
  clearAllTokens,
  apiRequest,
} from "../config/api.js";

const AuthContext = createContext(undefined);

// ============================================
// HOOK
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ============================================
// PROVIDER
// ============================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // INIT AUTH (ON APP LOAD)
  // ============================================
  useEffect(() => {
    const initAuth = async () => {
      setUser(null); // prevents stale/mock flashes
      try {
        const token = getAuthToken();
        
        // No token → not logged in
        if (!token) {
          setUser(null);
          return;
        }

        // Validate token via backend
        const userData = await apiRequest("/auth/profile/");

        // DO NOT mutate backend fields
        // Backend already gives: is_admin, is_staff, etc

        // setUser(userData);
        // localStorage.setItem("edustream_user", JSON.stringify(userData));
        const normalizedUser = {...userData,
          name: userData.first_name || userData.username || userData.email,
          isAdmin: userData.is_admin ?? userData.is_staff ?? userData.is_superuser ?? false,
        };
        setUser(normalizedUser);
        localStorage.setItem("edustream_user",JSON.stringify(normalizedUser));
      } catch (e) {
        console.error("Auth init error:", e);

        // Hard reset on any auth failure
        setUser(null);
        clearAllTokens();
        localStorage.removeItem("edustream_user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = useCallback(async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    localStorage.setItem("edustream_user", JSON.stringify(userData));
    return userData;
  }, []);

  // ============================================
  // SIGNUP
  // ============================================
  const signup = useCallback(async (name, email, password) => {
    const userData = await registerUser(name, email, password);

    if (!userData.verificationPending) {
      setUser(userData);
      localStorage.setItem("edustream_user", JSON.stringify(userData));
    }

    return userData;
  }, []);

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors
    }

    setUser(null);
    clearAllTokens();
    localStorage.removeItem("edustream_user");
  }, []);

  // ============================================
  // UPDATE USER (PROFILE)
  // ============================================
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("edustream_user", JSON.stringify(updatedUser));
  }, []);

  // ============================================
  // ADMIN CHECK (REAL)
  // ============================================
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

  // ============================================
  // PREVENT WHITE SCREEN
  // ============================================
  if (isLoading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
