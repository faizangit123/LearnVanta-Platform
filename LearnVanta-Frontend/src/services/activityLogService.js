/**
 * Activity Log Service
 * 
 * Tracks user activities like registrations, logins, role changes, and video management.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { API_CONFIG, apiRequest } from "../config/api.js";

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

export const getActivityLogs = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/activities/activities/");
  }

  return getLocalLogs();
};

export const logActivity = (type, details = {}) => {
  if (!API_CONFIG.useMock) {
    apiRequest("/api/v1/activities/activities/create/", {
      method: 'POST',
      body: JSON.stringify({ type, details }),
    }).catch(() => {});
    return;
  }

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

export const getRecentActivities = async (limit = 20) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/activities/activities/?limit=${limit}`);
  }

  const logs = getLocalLogs();
  return logs.slice(0, limit);
};

export const getActivitiesByType = async (type, limit = 20) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/activities/activities/?type=${type}&limit=${limit}`);
  }

  const logs = getLocalLogs();
  return logs.filter(log => log.type === type).slice(0, limit);
};

export const getUserActivities = async (userId, limit = 20) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/activities/activities/?user_id=${userId}&limit=${limit}`);
  }

  const logs = getLocalLogs();
  return logs.filter(log => log.details.userId === userId).slice(0, limit);
};

export const clearActivityLogs = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/activities/activities/clear/", {
      method: 'POST',
    });
  }

  localStorage.removeItem(ACTIVITY_LOG_KEY);
  return { success: true };
};

export const getActivityStats = async () => {
  if (!API_CONFIG.useMock) {
    // backend does not have stats endpoint
    return apiRequest("/api/v1/activities/activities/");
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
