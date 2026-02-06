/**
 * Playlist Management Service
 * 
 * Handles CRUD operations for video playlists.
 */

import { apiRequest } from "../config/api.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

// const PLAYLISTS_KEY = "edustream_playlists";

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
  const data = await apiRequest("/userdata/playlists/");
  return (data || []).map(normalizePlaylist);
};

export const getPlaylistById = async (playlistId) => {
  const data = await apiRequest(`/userdata/playlists/${playlistId}/`);
  return normalizePlaylist(data);
};

// export const getPlaylistsByChapter = async (chapterId) => {
//   const data = await apiRequest(`/userdata/playlists/?chapter_id=${chapterId}`);
//   return (data || []).map(normalizePlaylist);
// };

// ============================================
// CREATE OPERATIONS
// ============================================

export const createPlaylist = async (playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

  const response = await apiRequest("/userdata/playlists/", {
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

// export const updatePlaylist = async (playlistId, playlistData) => {
//   if (!playlistData.title?.trim()) {
//     throw new Error("Playlist title is required");
//   }

//   const response = await apiRequest(
//     `/userdata/playlists/${playlistId}/`,
//     {
//       method: "PATCH",
//       body: JSON.stringify({
//         title: playlistData.title.trim(),
//         description: playlistData.description?.trim(),
//         thumbnail: playlistData.thumbnail,
//         chapter_id: playlistData.chapterId,
//         video_ids: playlistData.videoIds,
//         is_public: playlistData.isPublic,
//       }),
//     }
//   );

//   const normalized = normalizePlaylist(response);

//   logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
//     videoId: normalized.id,
//     videoTitle: `Playlist: ${normalized.title}`,
//     chapterName: "Playlist Updated",
//   });

//   return normalized;
// };

export const updatePlaylist = async () => {
  throw new Error("Playlist update not supported yet");
};


// ============================================
// VIDEO HELPERS (safe + backend compatible)
// ============================================

export const addVideoHelper = async (playlistId, videoId) => {
  const response = await apiRequest(
    `/userdata/playlists/${playlistId}/add-video/`,
    {
      method: "POST",
      body: JSON.stringify({ video_id: videoId }),
    }
  );
  return normalizePlaylist(response);
};

export const removeVideoHelper = async (playlistId, videoId) => {
  const response = await apiRequest(
    `/userdata/playlists/${playlistId}/remove-video/`,
    {
      method: "POST",
      body: JSON.stringify({ video_id: videoId }),
    }
  );
  return normalizePlaylist(response);
};


export const reorderPlaylistVideos = async (playlistId, newVideoIds) => {
  const response = await apiRequest(
    `/userdata/playlists/${playlistId}/reorder/`,
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

  await apiRequest(`/userdata/playlists/${playlistId}/`, {
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
