/**
 * Authentication Service
 * 
 * Handles all authentication operations.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import {
  API_CONFIG,
  apiRequest,
  mockDelay,
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
   ===============================
    */
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    name: user.first_name || user.username || user.email,
    isAdmin: user.is_admin ?? user.is_staff ?? user.is_superuser ?? false
  };
};

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
    const response = await apiRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      }),
    });

    // Django returns token or access/refresh
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.access) {
      setAuthToken(response.access);
      setRefreshToken(response.refresh);
    }

    const user = normalizeUser(response.user);

    logActivity(ACTIVITY_TYPES.USER_LOGIN, {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    });

    return user;
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

  const {
    password: _,
    ...safeUser
  } = user;
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
    const response = await apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password
      }),
    });

    return {
      ...normalizeUser(response.user),
      verificationPending: true
    };
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

  const {
    password: _,
    ...safeUser
  } = newUser;
  return {
    ...safeUser,
    verificationPending: true
  };
};

// ============================================
// EMAIL VERIFICATION
// ============================================

export const verifyEmail = async (token) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/auth/verify-email/", {
      method: "POST",
      body: JSON.stringify({
        token
      }),
    });
  }

  await mockDelay(800);
  return {
    success: true
  };
};

export const resendVerificationEmail = async (email) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/auth/resend-verification/", {
      method: "POST",
      body: JSON.stringify({
        email
      }),
    });
  }

  await mockDelay(800);
  return {
    success: true
  };
};

// ============================================
// PASSWORD RESET
// ============================================

export const requestPasswordReset = async (email) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/auth/password-reset/", {
      method: "POST",
      body: JSON.stringify({
        email
      }),
    });
  }

  await mockDelay(1000);
  return {
    success: true
  };
};


export const validateResetToken = async () => {
  return { valid: true }; 
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

export const updateUserProfile = async (userId, updates) => {
  if (!API_CONFIG.useMock) {
    const response = await apiRequest("/auth/profile/", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });

    return normalizeUser(response);   

  }


  await mockDelay(500);
  return updates;
};

// ============================================
// ROLES
// ============================================

export const getUserRole = async () => {
  if (!API_CONFIG.useMock) {
    const profile = await apiRequest("/auth/profile/");
    const user = normalizeUser(profile);   
    return user.isAdmin ? "admin" : "user";
  }

  await mockDelay(100);
  return "user";
};

export const isAdmin = (user) => {
  return user?.isAdmin === true;
};

// ============================================
// SESSION
// ============================================

export const validateSession = async () => {
  if (!API_CONFIG.useMock) {
    try {
      const token = getAuthToken();
      if (!token) return false;

      await apiRequest("/auth/profile/");
      return true;
    } catch {
      return false;
    }
  }

  await mockDelay(100);
  return false;
};

// ============================================
// ADMIN USERS
// ============================================

// export const getAllUsers = async () => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest("/auth/admin/users/");
//   }

//   await mockDelay(300);
//   return getMockUsers();
// };

export const getAllUsers = async () => {
  throw new Error("Admin users API not implemented on backend");
};


// export const updateUserRole = async (userId, newRole) => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest(`/auth/admin/users/${userId}/role/`, {
//       method: "PATCH",
//       body: JSON.stringify({
//         role: newRole
//       }),
//     });
//   }

//   await mockDelay(500);
//   return {
//     success: true
//   };
// };

export const updateUserRole = async () => {
  throw new Error("Admin users API not implemented on backend");
};

// export const deleteUser = async (userId) => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest(`/auth/admin/users/${userId}/`, {
//       method: "DELETE",
//     });
//   }

//   await mockDelay(500);
//   return {
//     success: true
//   };
// };

export const deleteUser = async () => {
  throw new Error("Admin users API not implemented on backend");
};

// ============================================
// LOGOUT
// ============================================

export const logoutUser = async () => {
  if (!API_CONFIG.useMock) {
    try {
      await apiRequest("/auth/logout/", {
        method: "POST",
      });
    } catch {}
  }

  clearAllTokens();
  return {
    success: true
  };
};