//Centralized API Configuration

// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  useMock: String(import.meta.env.VITE_USE_MOCK) === 'true',
  timeout: 30000,
  apiPrefix: '/api/v1',
};

// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {

  // =========================
  // AUTH (CORRECT)
  // =========================
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    logout: '/auth/logout/',
    profile: '/auth/profile/',
    verifyEmail: '/auth/verify-email/',
    resendVerification: '/auth/resend-verification/',
    passwordReset: '/auth/password-reset/',
    passwordResetConfirm: '/auth/password-reset/confirm/',
    tokenRefresh: '/auth/token/refresh/',
    validateToken: '/auth/token/validate/',
  },

  // =========================
  // CONTENT
  // =========================
  classes: {
    list: '/content/classes/',
    detail: (id) => `/content/classes/${id}/`,
  },

  subjects: {
    byClass: (classId) => `/content/subjects/${classId}/`,
  },

  chapters: {
    bySubject: (subjectId) => `/content/chapters/${subjectId}/`,
  },

  // =========================
  // VIDEOS (FIXED)
  // =========================
  videos: {
    list: '/content/videos/',
    byChapter: (chapterId) => `/content/videos/chapter/${chapterId}/`,
    detail: (id) => `/content/videos/${id}/`,
    trending: '/content/videos/trending/',
  },

  // =========================
  // USER DATA
  // =========================
  history: {
    list: '/user/history/',
    add: '/user/history/',
    remove: (videoId) => `/user/history/${videoId}/`,
    clear: '/user/history/clear/',
  },

  progress: {
    get: (videoId) => `/user/progress/${videoId}/`,
    update: (videoId) => `/user/progress/${videoId}/`,
  },

  favorites: {
    list: '/user/favorites/',
    toggle: (videoId) => `/user/favorites/${videoId}/toggle/`,
  },

  notes: {
    byVideo: (videoId) => `/user/notes/${videoId}/`,
  },

  // =========================
  // RESOURCES (FIXED)
  // =========================
  resources: {
    list: '/resources/resources/',
    byChapter: (chapterId) => `/resources/chapters/${chapterId}/resources/`,
    detail: (id) => `/resources/resources/${id}/`,
    download: (id) => `/resources/resources/${id}/download/`,
    trackDownload: (id) => `/resources/resources/${id}/track-download/`,
  },

  // =========================
  // ACTIVITIES (FIXED)
  // =========================
  activities: {
    list: '/activities/activities/',
    recent: '/activities/activities/recent/',
    clear: '/activities/activities/clear/',
    stats: '/activities/activities/stats/',
  },

  // =========================
  // ADMIN USERS
  // =========================
  users: {
    list: '/auth/admin/users/',
    role: (id) => `/auth/admin/users/${id}/role/`,
    delete: (id) => `/auth/admin/users/${id}/`,
  },
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const clearRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

export const clearAllTokens = () => {
  clearAuthToken();
  clearRefreshToken();
};

// ============================================
// API REQUEST HELPER
// ============================================

export const apiRequest = async (endpoint, options = {}) => {
  if (API_CONFIG.useMock) {
    return null;
  }

  const url = `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) return apiRequest(endpoint, options);
      clearAllTokens();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.message || `Request failed (${response.status})`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
};

// ============================================
// TOKEN REFRESH
// ============================================

const attemptTokenRefresh = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}${API_ENDPOINTS.auth.tokenRefresh}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!response.ok) return false;

    const data = await response.json();
    if (data.access) {
      setAuthToken(data.access);
      if (data.refresh) setRefreshToken(data.refresh);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

// ============================================
// UTILITIES
// ============================================

export const isMockMode = () => API_CONFIG.useMock;
export const mockDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));
export const getApiUrl = (endpoint) => `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}${endpoint}`;

export const formatApiError = (error) => {
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};
