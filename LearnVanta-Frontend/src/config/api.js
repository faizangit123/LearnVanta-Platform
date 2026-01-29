//Centralized API Configuration


// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  // Django backend base URL
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Toggle between mock (localStorage) and real API
  // Set VITE_USE_MOCK=false in environment to connect to Django
  useMock: import.meta.env.VITE_USE_MOCK !== 'false',
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // API version prefix
  apiPrefix: '/api/v1',
};

// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  // Authentication
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
  
  // User Management (Admin)
  users: {
    list: '/admin/users/',
    detail: (id) => `/admin/users/${id}/`,
    role: (id) => `/admin/users/${id}/role/`,
    delete: (id) => `/admin/users/${id}/`,
  },
  
  // Content - Classes, Subjects, Chapters
  classes: {
    list: '/classes/',
    detail: (id) => `/classes/${id}/`,
  },
  subjects: {
    list: '/subjects/',
    detail: (id) => `/subjects/${id}/`,
    byClass: (classId) => `/classes/${classId}/subjects/`,
  },
  chapters: {
    list: '/chapters/',
    detail: (id) => `/chapters/${id}/`,
    bySubject: (subjectId) => `/subjects/${subjectId}/chapters/`,
  },
  
  // Videos
  videos: {
    list: '/videos/',
    detail: (id) => `/videos/${id}/`,
    search: '/videos/search/',
    trending: '/videos/trending/',
    recent: '/videos/recent/',
    byChapter: (chapterId) => `/chapters/${chapterId}/videos/`,
  },
  
  // Playlists (Admin-managed)
  playlists: {
    list: '/playlists/',
    detail: (id) => `/playlists/${id}/`,
    videos: (id) => `/playlists/${id}/videos/`,
    addVideo: (id) => `/playlists/${id}/add-video/`,
    removeVideo: (id) => `/playlists/${id}/remove-video/`,
    reorder: (id) => `/playlists/${id}/reorder/`,
  },
  
  // User Playlists (User-created)
  userPlaylists: {
    list: '/user/playlists/',
    detail: (id) => `/user/playlists/${id}/`,
    addVideo: (id) => `/user/playlists/${id}/add-video/`,
    removeVideo: (id) => `/user/playlists/${id}/remove-video/`,
    reorder: (id) => `/user/playlists/${id}/reorder/`,
  },
  
  // Watch History
  history: {
    list: '/user/history/',
    add: '/user/history/',
    remove: (videoId) => `/user/history/${videoId}/`,
    clear: '/user/history/clear/',
  },
  
  // Watch Progress
  progress: {
    get: (videoId) => `/user/progress/${videoId}/`,
    update: (videoId) => `/user/progress/${videoId}/`,
  },
  
  // Favorites
  favorites: {
    list: '/user/favorites/',
    add: '/user/favorites/',
    remove: (videoId) => `/user/favorites/${videoId}/`,
    toggle: (videoId) => `/user/favorites/${videoId}/toggle/`,
    check: (videoId) => `/user/favorites/${videoId}/check/`,
  },
  
  // Notes
  notes: {
    list: '/user/notes/',
    byVideo: (videoId) => `/user/notes/video/${videoId}/`,
    detail: (id) => `/user/notes/${id}/`,
    create: '/user/notes/',
    update: (id) => `/user/notes/${id}/`,
    delete: (id) => `/user/notes/${id}/`,
  },
  
  // Resources (PDFs)
  resources: {
    list: '/resources/',
    byChapter: (chapterId) => `/chapters/${chapterId}/resources/`,
    detail: (id) => `/resources/${id}/`,
    upload: '/resources/',
    download: (id) => `/resources/${id}/download/`,
    trackDownload: (id) => `/resources/${id}/track-download/`,
  },
  
  // Activity Logs (Admin)
  activities: {
    list: '/admin/activities/',
    recent: '/admin/activities/recent/',
    stats: '/admin/activities/stats/',
    clear: '/admin/activities/clear/',
  },
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

// const TOKEN_KEY = 'edustream_auth_token';
// const REFRESH_TOKEN_KEY = 'edustream_refresh_token';

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

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  // If using mock mode, return null (handled by service layer)
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
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
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
    
    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        // Retry the original request with new token
        return apiRequest(endpoint, options);
      }
      // Refresh failed - clear tokens and throw
      clearAllTokens();
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle other error responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.message || `Request failed with status ${response.status}`);
    }
    
    // Handle empty responses (204 No Content)
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

/**
 * Attempt to refresh the auth token
 * @returns {Promise<boolean>} - Whether refresh was successful
 */
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
      if (data.refresh) {
        setRefreshToken(data.refresh);
      }
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if currently using mock mode
 */
export const isMockMode = () => API_CONFIG.useMock;

/**
 * Simulate network delay for mock mode
 */
export const mockDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get full API URL for an endpoint
 */
export const getApiUrl = (endpoint) => `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}${endpoint}`;

/**
 * Format API error for display
 */
export const formatApiError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
