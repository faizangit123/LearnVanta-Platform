/**
 * Video Service Layer
 * 
 * Handles watch history, favorites, and progress tracking.
 * Uses real Django REST API.
 */

import { apiRequest } from "../config/api.js";

// ============================================
// NORMALIZERS
// ============================================

const normalizeHistory = (item) => ({
  id: item.id,
  videoId: item.video?.id,
  title: item.video?.title,
  thumbnail: item.video?.thumbnail,
  duration: item.video?.duration,
  chapterName: item.video?.chapter?.name,
  watchedAt: item.watched_at,
  progress: item.progress_percentage ?? 0,
});

const normalizeProgress = (data) => ({
  currentTime: data.current_time ?? 0,
  duration: data.duration ?? 0,
  percentage: data.percentage ?? 0,
});

const normalizeFavorite = (item) => ({
  id: item.id,
  videoId: item.video?.id,
  title: item.video?.title,
  thumbnail: item.video?.thumbnail,
  duration: item.video?.duration,
  chapterName: item.video?.chapter?.name,
  addedAt: item.added_at,
});

// ============================================
// WATCH HISTORY
// ============================================

export const getWatchHistory = async () => {
  const data = await apiRequest("/user/history/");
  return (data || []).map(normalizeHistory);
};

export const addToWatchHistory = async (video) => {
  const data = await apiRequest("/user/history/", {
    method: "POST",
    body: JSON.stringify({
      video_id: video.id,   // correct key
    }),
  });

  return (data || []).map(normalizeHistory);
};

export const removeFromWatchHistory = async (videoId) => {
  await apiRequest(`/user/history/${videoId}/`, {
    method: "DELETE",
  });

  return getWatchHistory();
};

export const clearWatchHistory = async () => {
  // backend doesn't have bulk delete yet
  return [];
};

// ============================================
// WATCH PROGRESS
// ============================================

export const getWatchProgress = async (videoId) => {
  try {
    const data = await apiRequest(`/user/progress/${videoId}/`);
    return normalizeProgress(data);
  } catch {
    return { currentTime: 0, duration: 0, percentage: 0 };
  }
};

export const updateWatchProgress = async (videoId, currentTime, duration) => {
  const data = await apiRequest(`/user/progress/${videoId}/`, {
    method: "POST",
    body: JSON.stringify({
      current_time: currentTime,   //  correct key
      duration: duration,
    }),
  });

  return normalizeProgress(data);
};

// ============================================
// FAVORITES
// ============================================

export const getFavorites = async () => {
  const data = await apiRequest("/user/favorites/");
  return (data || []).map(normalizeFavorite);
};

export const toggleFavorite = async (video) => {
  const data = await apiRequest(
    `/user/favorites/${video.id}/toggle/`,
    { method: "POST" }
  );

  return (data || []).map(normalizeFavorite);
};

export const addToFavorites = async (video) => {
  return toggleFavorite(video);
};

export const removeFromFavorites = async (videoId) => {
  await apiRequest(`/user/favorites/${videoId}/toggle/`, {
    method: "POST",
  });

  return getFavorites();
};

