/**
 * Playlist Management Service
 * 
 * Handles CRUD operations for video playlists.
 */

import { API_CONFIG, apiRequest } from "../config/api.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

const PLAYLISTS_KEY = "edustream_playlists";

// ============================================
// NORMALIZER (backend -> frontend shape)
// ============================================

const normalizePlaylist = (playlist) => ({
  id: playlist.id,
  title: playlist.title,
  description: playlist.description || "",
  thumbnail: playlist.thumbnail || "",
  chapterId: playlist.chapter_id || null,
  videoIds: playlist.video_ids || [],
  isPublic: playlist.is_public ?? true,
  createdAt: playlist.created_at,
});

// ============================================
// READ OPERATIONS
// ============================================

export const getAllPlaylists = async () => {
  const data = await apiRequest("/content/playlists/");
  return (data || []).map(normalizePlaylist);
};

export const getPlaylistById = async (playlistId) => {
  const data = await apiRequest(`/content/playlists/${playlistId}/`);
  return normalizePlaylist(data);
};

export const getPlaylistsByChapter = async (chapterId) => {
  const data = await apiRequest(`/content/playlists/?chapter_id=${chapterId}`);
  return (data || []).map(normalizePlaylist);
};

// ============================================
// CREATE OPERATIONS
// ============================================

export const createPlaylist = async (playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

  const response = await apiRequest("/content/playlists/", {
    method: "POST",
    body: JSON.stringify({
      title: playlistData.title.trim(),
      description: playlistData.description?.trim() || "",
      thumbnail: playlistData.thumbnail || "",
      chapter_id: playlistData.chapterId || null,
      is_public: playlistData.isPublic !== false,
    }),
  });

  const normalized = normalizePlaylist(response);

  logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
    videoId: normalized.id,
    videoTitle: `Playlist: ${normalized.title}`,
    chapterName: "N/A",
  });

  return normalized;
};

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updatePlaylist = async (playlistId, playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

  const response = await apiRequest(
    `/content/playlists/${playlistId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: playlistData.title.trim(),
        description: playlistData.description?.trim(),
        thumbnail: playlistData.thumbnail,
        chapter_id: playlistData.chapterId,
        video_ids: playlistData.videoIds,
        is_public: playlistData.isPublic,
      }),
    }
  );

  const normalized = normalizePlaylist(response);

  logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
    videoId: normalized.id,
    videoTitle: `Playlist: ${normalized.title}`,
    chapterName: "Playlist Updated",
  });

  return normalized;
};

// ============================================
// VIDEO HELPERS (safe + backend compatible)
// ============================================

export const addVideoHelper = async (playlistId, videoId) => {
  const playlist = await getPlaylistById(playlistId);

  if (playlist.videoIds.includes(videoId)) {
    return playlist;
  }

  return updatePlaylist(playlistId, {
    ...playlist,
    videoIds: [...playlist.videoIds, videoId],
  });
};

export const removeVideoHelper = async (playlistId, videoId) => {
  const playlist = await getPlaylistById(playlistId);

  return updatePlaylist(playlistId, {
    ...playlist,
    videoIds: playlist.videoIds.filter(id => id !== videoId),
  });
};

export const reorderPlaylistVideos = async (playlistId, newVideoIds) => {
  const response = await apiRequest(
    `/content/playlists/${playlistId}/reorder/`,
    {
      method: "POST",
      body: JSON.stringify({ video_ids: newVideoIds }),
    }
  );

  return normalizePlaylist(response);
};

// ============================================
// DELETE OPERATIONS
// ============================================

export const deletePlaylist = async (playlistId) => {
  const playlist = await getPlaylistById(playlistId);

  await apiRequest(`/content/playlists/${playlistId}/`, {
    method: "DELETE",
  });

  if (playlist) {
    logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
      videoId: playlist.id,
      videoTitle: `Playlist: ${playlist.title}`,
      chapterName: "Playlist Deleted",
    });
  }

  return { success: true };
};

// ============================================
// MOCK UTILITIES (never used in prod)
// ============================================

// kept only for future dev/testing
// because VITE_USE_MOCK=false they never execute

// export const resetPlaylists = async () => {
//   localStorage.setItem(PLAYLISTS_KEY, JSON.stringify([]));
//   return [];
// };
