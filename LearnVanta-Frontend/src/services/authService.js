/**
 * Authentication Service
 * 
 * Handles all authentication operations.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 * 
 * Django endpoints:
 * - POST /api/v1/auth/login/
 * - POST /api/v1/auth/register/
 * - POST /api/v1/auth/logout/
 * - GET /api/v1/auth/profile/
 * - POST /api/v1/auth/verify-email/
 * - POST /api/v1/auth/password-reset/
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
// MOCK DATA (Only used when useMock: true)
// ============================================

// Note: In production, admin users are created via Django admin
// and roles are stored in the user_roles table
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
    // Real API call to Django
    const response = await apiRequest(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store tokens
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.access) {
      setAuthToken(response.access);
      setRefreshToken(response.refresh);
    }
    
    // Log activity
    logActivity(ACTIVITY_TYPES.USER_LOGIN, {
      userId: response.user.id,
      userName: response.user.name,
      userEmail: response.user.email,
    });
    
    return response.user;
  }

  // Mock implementation
  await mockDelay(800);

  const registeredUsers = getMockUsers();
  const user = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    throw new Error("User not found. Please register first.");
  }

  if (user.password !== password) {
    throw new Error("Invalid credentials");
  }

  if (user.emailVerified === false) {
    throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
  }

  const { password: _, ...userWithoutPassword } = user;

  logActivity(ACTIVITY_TYPES.USER_LOGIN, {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
  });

  return userWithoutPassword;
};

// ============================================
// REGISTER
// ============================================

export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!email.includes("@")) {
    throw new Error("Invalid email address");
  }

  if (!API_CONFIG.useMock) {
    // Real API call to Django
    const response = await apiRequest(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    logActivity(ACTIVITY_TYPES.USER_REGISTERED, {
      userId: response.user?.id,
      userName: name,
      userEmail: email,
      emailVerified: false,
    });
    
    return { ...response.user, verificationPending: true };
  }

  // Mock implementation
  await mockDelay(1000);

  const registeredUsers = getMockUsers();
  const existingUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    if (!existingUser.emailVerified) {
      throw new Error("Email already registered. Please check your inbox for verification link.");
    }
    throw new Error("Email already registered");
  }

  const newUser = {
    id: "user_" + Date.now(),
    email,
    password,
    name,
    role: "user",
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  // Generate verification token
  const verificationToken = btoa(`verify:${email}:${Date.now()}:${Math.random().toString(36).substring(7)}`);

  const verificationTokens = JSON.parse(localStorage.getItem("edustream_verification_tokens") || "{}");
  verificationTokens[verificationToken] = {
    userId: newUser.id,
    email: email.toLowerCase(),
    expiresAt: Date.now() + 86400000,
    used: false,
  };
  localStorage.setItem("edustream_verification_tokens", JSON.stringify(verificationTokens));

  registeredUsers.push(newUser);
  localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));

  console.log("=== MOCK EMAIL VERIFICATION ===");
  console.log("Email:", email);
  console.log("Verification URL:", `${window.location.origin}/verify-email?token=${verificationToken}`);
  console.log("Token expires in 24 hours");
  console.log("===============================");

  logActivity(ACTIVITY_TYPES.USER_REGISTERED, {
    userId: newUser.id,
    userName: newUser.name,
    userEmail: newUser.email,
    emailVerified: false,
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return { ...userWithoutPassword, verificationPending: true };
};

// ============================================
// EMAIL VERIFICATION
// ============================================

export const verifyEmail = async (token) => {
  if (!token) {
    throw new Error("Invalid verification token");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.auth.verifyEmail, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Mock implementation
  await mockDelay(800);

  const verificationTokens = JSON.parse(localStorage.getItem("edustream_verification_tokens") || "{}");
  const tokenData = verificationTokens[token];

  if (!tokenData) {
    throw new Error("Invalid or expired verification link. Please register again.");
  }

  if (tokenData.used) {
    throw new Error("This verification link has already been used.");
  }

  if (Date.now() > tokenData.expiresAt) {
    throw new Error("This verification link has expired. Please register again.");
  }

  const registeredUsers = getMockUsers();
  const userIndex = registeredUsers.findIndex((u) => u.id === tokenData.userId);

  if (userIndex === -1) {
    throw new Error("User not found. Please register again.");
  }

  registeredUsers[userIndex].emailVerified = true;
  localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));

  tokenData.used = true;
  verificationTokens[token] = tokenData;
  localStorage.setItem("edustream_verification_tokens", JSON.stringify(verificationTokens));

  return { success: true };
};

export const resendVerificationEmail = async (email) => {
  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.auth.resendVerification, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Mock implementation
  await mockDelay(800);

  const registeredUsers = getMockUsers();
  const user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: true }; // Don't reveal if email exists
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified. You can sign in.");
  }

  const verificationToken = btoa(`verify:${email}:${Date.now()}:${Math.random().toString(36).substring(7)}`);

  const verificationTokens = JSON.parse(localStorage.getItem("edustream_verification_tokens") || "{}");
  verificationTokens[verificationToken] = {
    userId: user.id,
    email: email.toLowerCase(),
    expiresAt: Date.now() + 86400000,
    used: false,
  };
  localStorage.setItem("edustream_verification_tokens", JSON.stringify(verificationTokens));

  console.log("=== MOCK EMAIL VERIFICATION (RESEND) ===");
  console.log("Email:", email);
  console.log("Verification URL:", `${window.location.origin}/verify-email?token=${verificationToken}`);
  console.log("=========================================");

  return { success: true };
};

// ============================================
// PASSWORD RESET
// ============================================

export const requestPasswordReset = async (email) => {
  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.auth.passwordReset, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Mock implementation
  await mockDelay(1000);

  const mockToken = btoa(`${email}:${Date.now()}:${Math.random().toString(36).substring(7)}`);

  const resetTokens = JSON.parse(localStorage.getItem("edustream_reset_tokens") || "{}");
  resetTokens[mockToken] = {
    email: email.toLowerCase(),
    expiresAt: Date.now() + 3600000,
    used: false,
  };
  localStorage.setItem("edustream_reset_tokens", JSON.stringify(resetTokens));

  console.log("=== MOCK PASSWORD RESET ===");
  console.log("Email:", email);
  console.log("Reset URL:", `${window.location.origin}/reset-password?token=${mockToken}`);
  console.log("Token expires in 1 hour");
  console.log("===========================");

  return { success: true };
};

export const validateResetToken = async (token) => {
  if (!token) {
    throw new Error("Invalid reset token");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(`${API_ENDPOINTS.auth.passwordReset}validate/`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Mock implementation
  await mockDelay(300);

  const resetTokens = JSON.parse(localStorage.getItem("edustream_reset_tokens") || "{}");
  const tokenData = resetTokens[token];

  if (!tokenData) {
    throw new Error("Invalid or expired reset link. Please request a new one.");
  }

  if (tokenData.used) {
    throw new Error("This reset link has already been used. Please request a new one.");
  }

  if (Date.now() > tokenData.expiresAt) {
    throw new Error("This reset link has expired. Please request a new one.");
  }

  return { valid: true, email: tokenData.email };
};

export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error("Token and new password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.auth.passwordResetConfirm, {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  }

  // Mock implementation
  await mockDelay(800);

  const resetTokens = JSON.parse(localStorage.getItem("edustream_reset_tokens") || "{}");
  const tokenData = resetTokens[token];

  if (!tokenData || tokenData.used || Date.now() > tokenData.expiresAt) {
    throw new Error("Invalid or expired reset link. Please request a new one.");
  }

  const email = tokenData.email;

  const registeredUsers = getMockUsers();
  const userIndex = registeredUsers.findIndex(
    (u) => u.email.toLowerCase() === email
  );

  if (userIndex !== -1) {
    registeredUsers[userIndex].password = newPassword;
    localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));
  }

  tokenData.used = true;
  resetTokens[token] = tokenData;
  localStorage.setItem("edustream_reset_tokens", JSON.stringify(resetTokens));

  return { success: true };
};

// ============================================
// PROFILE MANAGEMENT
// ============================================

export const updateUserProfile = async (userId, updates) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.auth.profile, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Mock implementation
  await mockDelay(500);

  const registeredUsers = getMockUsers();
  const userIndex = registeredUsers.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  if (updates.name) {
    registeredUsers[userIndex].name = updates.name;
  }

  if (updates.avatar !== undefined) {
    registeredUsers[userIndex].avatar = updates.avatar;
  }

  if (updates.newPassword) {
    if (registeredUsers[userIndex].password !== updates.currentPassword) {
      throw new Error("Current password is incorrect");
    }
    if (updates.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }
    registeredUsers[userIndex].password = updates.newPassword;
  }

  localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));

  const { password, ...userWithoutPassword } = registeredUsers[userIndex];
  return userWithoutPassword;
};

// ============================================
// ROLE & PERMISSION HELPERS
// ============================================

export const getUserRole = async (userId) => {
  if (!API_CONFIG.useMock) {
    // In real API, role comes from user_roles table
    const profile = await apiRequest(API_ENDPOINTS.auth.profile);
    return profile.role || 'user';
  }

  // Mock implementation
  await mockDelay(100);

  const registeredUsers = getMockUsers();
  const user = registeredUsers.find((u) => u.id === userId);
  return user?.role || "user";
};

export const isAdmin = (user) => {
  return user?.role === "admin";
};

export const validateSession = async (user) => {
  if (!API_CONFIG.useMock) {
    try {
      const token = getAuthToken();
      if (!token) return false;
      
      await apiRequest(API_ENDPOINTS.auth.validateToken, {
        method: 'POST',
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
// ADMIN: USER MANAGEMENT
// ============================================

export const getAllUsers = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.users.list);
  }

  // Mock implementation
  await mockDelay(300);

  const registeredUsers = getMockUsers();
  return registeredUsers.map(({ password, ...user }) => user);
};

export const updateUserRole = async (userId, newRole) => {
  if (!["user", "admin"].includes(newRole)) {
    throw new Error("Invalid role");
  }

  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.users.role(userId), {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });
  }

  // Mock implementation
  await mockDelay(500);

  const registeredUsers = getMockUsers();
  const userIndex = registeredUsers.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const previousRole = registeredUsers[userIndex].role;
  registeredUsers[userIndex].role = newRole;
  localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));

  logActivity(ACTIVITY_TYPES.ROLE_CHANGED, {
    userId: registeredUsers[userIndex].id,
    userName: registeredUsers[userIndex].name,
    userEmail: registeredUsers[userIndex].email,
    previousRole,
    newRole,
  });

  const { password, ...userWithoutPassword } = registeredUsers[userIndex];
  return userWithoutPassword;
};

export const deleteUser = async (userId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.users.delete(userId), {
      method: 'DELETE',
    });
  }

  // Mock implementation
  await mockDelay(500);

  const registeredUsers = getMockUsers();
  const userIndex = registeredUsers.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const deletedUser = registeredUsers[userIndex];
  registeredUsers.splice(userIndex, 1);
  localStorage.setItem("edustream_registered_users", JSON.stringify(registeredUsers));

  logActivity(ACTIVITY_TYPES.USER_DELETED, {
    userId: deletedUser.id,
    userName: deletedUser.name,
    userEmail: deletedUser.email,
  });

  return { success: true };
};

// ============================================
// LOGOUT
// ============================================

export const logoutUser = async () => {
  if (!API_CONFIG.useMock) {
    try {
      await apiRequest(API_ENDPOINTS.auth.logout, {
        method: 'POST',
      });
    } catch {
      // Ignore logout errors
    }
  }
  
  clearAllTokens();
  return { success: true };
};
