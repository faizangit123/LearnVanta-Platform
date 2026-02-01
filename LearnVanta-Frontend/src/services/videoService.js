/**
 * Video Service Layer
 * 
 * Handles watch history, favorites, and progress tracking.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { API_CONFIG, apiRequest, mockDelay } from "../config/api.js";

// Mock storage keys
const WATCH_HISTORY_KEY = 'video_watch_history';
const FAVORITES_KEY = 'video_favorites';
const WATCH_PROGRESS_KEY = 'video_watch_progress';

// ============================================
// WATCH HISTORY
// ============================================

export const getWatchHistory = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/history/");
  }

  await mockDelay();
  const history = localStorage.getItem(WATCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToWatchHistory = async (video) => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/history/add/", {
      method: 'POST',
      body: JSON.stringify({
        video_id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        chapter_name: video.chapterName,
      }),
    });
  }

  await mockDelay();
  const history = await getWatchHistory();
  
  const filtered = history.filter(item => item.videoId !== video.id);
  
  const historyItem = {
    videoId: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    chapterName: video.chapterName,
    watchedAt: new Date().toISOString(),
    progress: 0
  };
  
  const updated = [historyItem, ...filtered].slice(0, 50);
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const removeFromWatchHistory = async (videoId) => {
  if (!API_CONFIG.useMock) {
    await apiRequest(`/api/v1/history/${videoId}/remove/`, {
      method: 'DELETE',
    });
    return getWatchHistory();
  }

  await mockDelay();
  const history = await getWatchHistory();
  const updated = history.filter(item => item.videoId !== videoId);
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const clearWatchHistory = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/history/clear/", {
      method: 'POST',
    });
  }

  await mockDelay();
  localStorage.removeItem(WATCH_HISTORY_KEY);
  return [];
};

// ============================================
// WATCH PROGRESS
// ============================================

export const getWatchProgress = async (videoId) => {
  if (!API_CONFIG.useMock) {
    try {
      return await apiRequest(`/api/v1/progress/${videoId}/`);
    } catch {
      return { currentTime: 0, duration: 0, percentage: 0 };
    }
  }

  await mockDelay();
  const progress = localStorage.getItem(WATCH_PROGRESS_KEY);
  const allProgress = progress ? JSON.parse(progress) : {};
  return allProgress[videoId] || { currentTime: 0, duration: 0, percentage: 0 };
};

export const updateWatchProgress = async (videoId, currentTime, duration) => {
  const progressData = {
    currentTime,
    duration,
    percentage: duration > 0 ? Math.round((currentTime / duration) * 100) : 0,
  };

  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/progress/${videoId}/update/`, {
      method: 'POST',
      body: JSON.stringify({
        current_time: currentTime,
        duration: duration,
      }),
    });
  }

  await mockDelay();
  const progress = localStorage.getItem(WATCH_PROGRESS_KEY);
  const allProgress = progress ? JSON.parse(progress) : {};
  
  allProgress[videoId] = {
    ...progressData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(WATCH_PROGRESS_KEY, JSON.stringify(allProgress));
  
  const history = await getWatchHistory();
  const historyItem = history.find(item => item.videoId === videoId);
  if (historyItem) {
    historyItem.progress = allProgress[videoId].percentage;
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  }
  
  return allProgress[videoId];
};

// ============================================
// FAVORITES
// ============================================

export const getFavorites = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/favorites/");
  }

  await mockDelay();
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = async (video) => {
  if (!API_CONFIG.useMock) {
    await apiRequest("/api/v1/favorites/add/", {
      method: 'POST',
      body: JSON.stringify({
        video_id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        chapter_name: video.chapterName,
      }),
    });
    return getFavorites();
  }

  await mockDelay();
  const favorites = await getFavorites();
  
  if (favorites.some(item => item.videoId === video.id)) {
    return favorites;
  }
  
  const favoriteItem = {
    videoId: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    chapterName: video.chapterName,
    addedAt: new Date().toISOString()
  };
  
  const updated = [favoriteItem, ...favorites];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const removeFromFavorites = async (videoId) => {
  if (!API_CONFIG.useMock) {
    await apiRequest(`/api/v1/favorites/${videoId}/remove/`, {
      method: 'DELETE',
    });
    return getFavorites();
  }

  await mockDelay();
  const favorites = await getFavorites();
  const updated = favorites.filter(item => item.videoId !== videoId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const isFavorite = async (videoId) => {
  if (!API_CONFIG.useMock) {
    try {
      const result = await apiRequest(`/api/v1/favorites/${videoId}/check/`);
      return result.is_favorite;
    } catch {
      return false;
    }
  }

  await mockDelay();
  const favorites = await getFavorites();
  return favorites.some(item => item.videoId === videoId);
};

export const toggleFavorite = async (video) => {
  if (!API_CONFIG.useMock) {
    const result = await apiRequest(`/api/v1/favorites/${video.id}/toggle/`, {
      method: 'POST',
    });
    const favorites = await getFavorites();
    return { favorites, isFavorite: result.is_favorite };
  }

  const isCurrentlyFavorite = await isFavorite(video.id);
  if (isCurrentlyFavorite) {
    return { favorites: await removeFromFavorites(video.id), isFavorite: false };
  } else {
    return { favorites: await addToFavorites(video), isFavorite: true };
  }
};
