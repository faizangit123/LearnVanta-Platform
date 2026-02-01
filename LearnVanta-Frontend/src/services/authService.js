/**
 * Authentication Service
 * 
 * Handles all authentication operations.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { 
  API_CONFIG, 
  API_ENDPOINTS, 
  apiRequest, 
  mockDelay,
  setAuthToken,
  setRefreshToken,
  clearAllTokens,
  getAuthToken
} from "../config/api.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

// ============================================
// MOCK DATA
// ============================================

const getMockUsers = () => {
  const registered = JSON.parse(localStorage.getItem("edustream_registered_users") || "[]");
  return registered;
};

// ============================================
// LOGIN
// ============================================

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!API_CONFIG.useMock) {
    const response = await apiRequest("/api/v1/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Django returns token or access/refresh
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.access) {
      setAuthToken(response.access);
      setRefreshToken(response.refresh);
    }

    logActivity(ACTIVITY_TYPES.USER_LOGIN, {
      userId: response.user.id,
      userName: response.user.name,
      userEmail: response.user.email,
    });

    return response.user;
  }

  // MOCK
  await mockDelay(800);

  const registeredUsers = getMockUsers();
  const user = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) throw new Error("User not found");
  if (user.password !== password) throw new Error("Invalid credentials");
  if (user.emailVerified === false) throw new Error("Please verify your email");

  const { password: _, ...safeUser } = user;
  return safeUser;
};

// ============================================
// REGISTER
// ============================================

export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (!API_CONFIG.useMock) {
    const response = await apiRequest("/api/v1/auth/register/", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    return { ...response.user, verificationPending: true };
  }

  // MOCK (unchanged)
  await mockDelay(1000);

  const registeredUsers = getMockUsers();
  const existingUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) throw new Error("Email already registered");

  const newUser = {
    id: "user_" + Date.now(),
    email,
    password,
    name,
    role: "user",
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);
  localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));

  const { password: _, ...safeUser } = newUser;
  return { ...safeUser, verificationPending: true };
};

// ============================================
// EMAIL VERIFICATION
// ============================================

export const verifyEmail = async (token) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/verify-email/", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  await mockDelay(800);
  return { success: true };
};

export const resendVerificationEmail = async (email) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/resend-verification/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  await mockDelay(800);
  return { success: true };
};

// ============================================
// PASSWORD RESET
// ============================================

export const requestPasswordReset = async (email) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/password-reset/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  await mockDelay(1000);
  return { success: true };
};

export const validateResetToken = async (token) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/password-reset/validate/", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  await mockDelay(300);
  return { valid: true };
};

export const resetPassword = async (token, newPassword) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/password-reset/confirm/", {
      method: "POST",
      body: JSON.stringify({ token, password: newPassword }),
    });
  }

  await mockDelay(800);
  return { success: true };
};

// ============================================
// PROFILE
// ============================================

export const updateUserProfile = async (userId, updates) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/profile/", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  await mockDelay(500);
  return updates;
};

// ============================================
// ROLES
// ============================================

export const getUserRole = async () => {
  if (!API_CONFIG.useMock) {
    const profile = await apiRequest("/api/v1/auth/profile/");
    return profile.role || "user";
  }

  await mockDelay(100);
  return "user";
};

// export const isAdmin = (user) => {
//   return user?.is_staff === true || user?.is_superuser === true;
// };
export const isAdmin = (user) => {
  if (!user) return false;

  // Django compatible
  if (user.is_superuser) return true;
  if (user.is_staff) return true;

  // Fallback for mock mode
  if (user.role === "admin") return true;

  return false;
};


// ============================================
// SESSION
// ============================================

export const validateSession = async (user) => {
  if (!API_CONFIG.useMock) {
    try {
      const token = getAuthToken();
      if (!token) return false;

      await apiRequest("/api/v1/auth/validate-token/", {
        method: "POST",
      });
      return true;
    } catch {
      return false;
    }
  }

  await mockDelay(100);
  return !!user;
};

// ============================================
// ADMIN USERS
// ============================================

export const getAllUsers = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/auth/admin/users/");
  }

  await mockDelay(300);
  return getMockUsers();
};

export const updateUserRole = async (userId, newRole) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/auth/admin/users/${userId}/role/`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
  }

  await mockDelay(500);
  return { success: true };
};

export const deleteUser = async (userId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/auth/admin/users/${userId}/`, {
      method: "DELETE",
    });
  }

  await mockDelay(500);
  return { success: true };
};

// ============================================
// LOGOUT
// ============================================

export const logoutUser = async () => {
  if (!API_CONFIG.useMock) {
    try {
      await apiRequest("/api/v1/auth/logout/", {
        method: "POST",
      });
    } catch {}
  }

  clearAllTokens();
  return { success: true };
};
