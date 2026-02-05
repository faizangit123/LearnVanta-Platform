/**
 * Authentication Service
 * 
 * Handles all authentication operations.
 * Calls Django REST API only (NO MOCK).
 */

import {
  apiRequest,
  setAuthToken,
  setRefreshToken,
  clearAllTokens,
  getAuthToken
} from "../config/api.js";

import {
  logActivity,
  ACTIVITY_TYPES
} from "./activityLogService.js";


/* ===============================
   Normalizer
   =============================== */
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    name: user.first_name || user.username || user.email,
    isAdmin: user.is_admin ?? user.is_staff ?? user.is_superuser ?? false
  };
};

// ============================================
// LOGIN
// ============================================

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await apiRequest("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Token handling (DRF token or JWT)
  if (response.token) {
    setAuthToken(response.token);
    localStorage.setItem("token", response.token);
  }

  if (response.access) {
    setAuthToken(response.access);
    setRefreshToken(response.refresh);
    localStorage.setItem("token", response.access);
  }

  const user = normalizeUser(response.user);

  logActivity(ACTIVITY_TYPES.USER_LOGIN, {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
  });

  return user;
};

// ============================================
// REGISTER
// ============================================

export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const response = await apiRequest("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  return {
    ...normalizeUser(response.user),
    verificationPending: true
  };
};

// ============================================
// EMAIL VERIFICATION
// ============================================

export const verifyEmail = async (token) => {
  return apiRequest("/auth/verify-email/", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

export const resendVerificationEmail = async (email) => {
  return apiRequest("/auth/resend-verification/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// ============================================
// PASSWORD RESET
// ============================================

export const requestPasswordReset = async (email) => {
  return apiRequest("/auth/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token, newPassword) => {
  return apiRequest("/auth/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify({ token, password: newPassword }),
  });
};

// ============================================
// PROFILE
// ============================================

export const updateUserProfile = async (updates) => {
  const response = await apiRequest("/auth/profile/", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return normalizeUser(response);
};

// ============================================
// ROLES
// ============================================

export const getUserRole = async () => {
  const profile = await apiRequest("/auth/profile/");
  const user = normalizeUser(profile);
  return user.isAdmin ? "admin" : "user";
};

export const isAdmin = (user) => {
  return user?.isAdmin === true;
};

// ============================================
// SESSION
// ============================================

export const validateSession = async () => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    await apiRequest("/auth/profile/");
    return true;
  } catch {
    return false;
  }
};

// ============================================
// ADMIN USERS (not implemented in backend)
// ============================================

export const getAllUsers = async () => {
  throw new Error("Admin users API not implemented on backend");
};

export const updateUserRole = async () => {
  throw new Error("Admin users API not implemented on backend");
};

export const deleteUser = async () => {
  throw new Error("Admin users API not implemented on backend");
};

// ============================================
// LOGOUT
// ============================================

export const logoutUser = async () => {
  try {
    await apiRequest("/auth/logout/", {
      method: "POST",
    });
  } catch {}

  clearAllTokens();
  localStorage.removeItem("token");
  return { success: true };
};
