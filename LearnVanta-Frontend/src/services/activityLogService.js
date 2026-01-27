/**
 * Activity Log Service
 * 
 * Tracks user activities like registrations, logins, role changes, and video management.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { API_CONFIG, API_ENDPOINTS, apiRequest, mockDelay } from "../config/api.js";

const ACTIVITY_LOG_KEY = "edustream_activity_logs";
const MAX_LOGS = 100;

// Activity types
export const ACTIVITY_TYPES = {
  USER_REGISTERED: "user_registered",
  USER_LOGIN: "user_login",
  ROLE_CHANGED: "role_changed",
  USER_DELETED: "user_deleted",
  VIDEO_CREATED: "video_created",
  VIDEO_UPDATED: "video_updated",
  VIDEO_DELETED: "video_deleted",
  PROFILE_UPDATED: "profile_updated",
};

// Get activity icon and color based on type
export const getActivityMeta = (type) => {
  switch (type) {
    case ACTIVITY_TYPES.USER_REGISTERED:
      return { icon: "user-plus", color: "success", label: "New Registration" };
    case ACTIVITY_TYPES.USER_LOGIN:
      return { icon: "log-in", color: "primary", label: "User Login" };
    case ACTIVITY_TYPES.ROLE_CHANGED:
      return { icon: "shield", color: "warning", label: "Role Changed" };
    case ACTIVITY_TYPES.USER_DELETED:
      return { icon: "user-x", color: "error", label: "User Deleted" };
    case ACTIVITY_TYPES.VIDEO_CREATED:
      return { icon: "video-plus", color: "success", label: "Video Added" };
    case ACTIVITY_TYPES.VIDEO_UPDATED:
      return { icon: "video-edit", color: "accent", label: "Video Updated" };
    case ACTIVITY_TYPES.VIDEO_DELETED:
      return { icon: "video-x", color: "error", label: "Video Deleted" };
    case ACTIVITY_TYPES.PROFILE_UPDATED:
      return { icon: "user-edit", color: "accent", label: "Profile Updated" };
    default:
      return { icon: "activity", color: "muted", label: "Activity" };
  }
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const getLocalLogs = () => {
  const stored = localStorage.getItem(ACTIVITY_LOG_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalLogs = (logs) => {
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
};

// ============================================
// LOG OPERATIONS
// ============================================

/**
 * Get all activity logs
 */
export const getActivityLogs = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.activities.list);
  }

  return getLocalLogs();
};

/**
 * Add a new activity log
 * Note: This is called internally by other services
 */
export const logActivity = (type, details = {}) => {
  // For API mode, we'd typically send this to the server
  // But most activities are logged server-side automatically
  if (!API_CONFIG.useMock) {
    // Fire and forget - don't await
    apiRequest(API_ENDPOINTS.activities.list, {
      method: 'POST',
      body: JSON.stringify({ type, details }),
    }).catch(() => {
      // Silently fail - activity logging shouldn't break the app
    });
    return;
  }

  // Mock implementation
  const logs = getLocalLogs();

  const newLog = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
    type,
    details,
    timestamp: new Date().toISOString(),
  };

  const updatedLogs = [newLog, ...logs].slice(0, MAX_LOGS);
  saveLocalLogs(updatedLogs);

  return newLog;
};

/**
 * Get recent activity logs with optional limit
 */
export const getRecentActivities = async (limit = 20) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`${API_ENDPOINTS.activities.recent}?limit=${limit}`);
  }

  const logs = getLocalLogs();
  return logs.slice(0, limit);
};

/**
 * Get activities filtered by type
 */
export const getActivitiesByType = async (type, limit = 20) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`${API_ENDPOINTS.activities.list}?type=${type}&limit=${limit}`);
  }

  const logs = getLocalLogs();
  return logs.filter(log => log.type === type).slice(0, limit);
};

/**
 * Get activities for a specific user
 */
export const getUserActivities = async (userId, limit = 20) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`${API_ENDPOINTS.activities.list}?user_id=${userId}&limit=${limit}`);
  }

  const logs = getLocalLogs();
  return logs.filter(log => log.details.userId === userId).slice(0, limit);
};

/**
 * Clear all activity logs (admin only)
 */
export const clearActivityLogs = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.activities.clear, {
      method: 'POST',
    });
  }

  localStorage.removeItem(ACTIVITY_LOG_KEY);
  return { success: true };
};

/**
 * Get activity statistics
 */
export const getActivityStats = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.activities.stats);
  }

  const logs = getLocalLogs();
  const now = new Date();
  const last24h = new Date(now - 24 * 60 * 60 * 1000);
  const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const recentLogs = logs.filter(log => new Date(log.timestamp) > last24h);
  const weeklyLogs = logs.filter(log => new Date(log.timestamp) > last7d);

  return {
    total: logs.length,
    last24h: recentLogs.length,
    last7d: weeklyLogs.length,
    byType: Object.values(ACTIVITY_TYPES).reduce((acc, type) => {
      acc[type] = logs.filter(log => log.type === type).length;
      return acc;
    }, {}),
  };
};
