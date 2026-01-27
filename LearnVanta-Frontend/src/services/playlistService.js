/**
 * Playlist Management Service
 * 
 * Handles CRUD operations for video playlists.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { API_CONFIG, API_ENDPOINTS, apiRequest, mockDelay } from "../config/api.js";
import { playlists as initialPlaylists, videos, chapters } from "../data/mockData.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

const PLAYLISTS_KEY = "edustream_playlists";

// Initialize with mock data if not exists
const initializePlaylists = () => {
  const stored = localStorage.getItem(PLAYLISTS_KEY);
  if (!stored) {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(initialPlaylists));
    return initialPlaylists;
  }
  return JSON.parse(stored);
};

// ============================================
// READ OPERATIONS
// ============================================

export const getAllPlaylists = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.playlists.list);
  }

  await mockDelay(200);
  return initializePlaylists();
};

export const getPlaylistById = async (playlistId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.playlists.detail(playlistId));
  }

  await mockDelay(100);
  const playlists = initializePlaylists();
  return playlists.find((p) => p.id === playlistId) || null;
};

export const getPlaylistForVideo = async (videoId) => {
  if (!API_CONFIG.useMock) {
    const playlists = await getAllPlaylists();
    return playlists.find((p) => p.videoIds?.includes(videoId)) || null;
  }

  await mockDelay(100);
  const playlists = initializePlaylists();
  return playlists.find((p) => p.videoIds.includes(videoId)) || null;
};

export const getPlaylistVideos = async (playlistId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.playlists.videos(playlistId));
  }

  await mockDelay(100);
  const playlists = initializePlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return [];

  return playlist.videoIds
    .map(videoId => videos.find(v => v.id === videoId))
    .filter(Boolean);
};

export const getPlaylistsByChapter = async (chapterId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`${API_ENDPOINTS.playlists.list}?chapter_id=${chapterId}`);
  }

  await mockDelay(100);
  const playlists = initializePlaylists();
  return playlists.filter(p => p.chapterId === chapterId);
};

// ============================================
// CREATE OPERATIONS
// ============================================

export const createPlaylist = async (playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

  if (!API_CONFIG.useMock) {
    const response = await apiRequest(API_ENDPOINTS.playlists.list, {
      method: 'POST',
      body: JSON.stringify({
        title: playlistData.title.trim(),
        description: playlistData.description?.trim() || "",
        thumbnail: playlistData.thumbnail || "",
        chapter_id: playlistData.chapterId || null,
        video_ids: playlistData.videoIds || [],
        is_public: playlistData.isPublic !== false,
      }),
    });

    logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
      videoId: response.id,
      videoTitle: `Playlist: ${response.title}`,
      chapterName: "N/A",
    });

    return response;
  }

  // Mock implementation
  await mockDelay(300);

  const playlists = initializePlaylists();
  const chapter = chapters.find(c => c.id === playlistData.chapterId);

  const newPlaylist = {
    id: "pl-" + Date.now(),
    title: playlistData.title.trim(),
    description: playlistData.description?.trim() || "",
    thumbnail: playlistData.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    chapterId: playlistData.chapterId || null,
    videoIds: playlistData.videoIds || [],
    createdAt: new Date().toISOString().split("T")[0],
    isPublic: playlistData.isPublic !== false,
  };

  const updated = [newPlaylist, ...playlists];
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updated));

  logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
    videoId: newPlaylist.id,
    videoTitle: `Playlist: ${newPlaylist.title}`,
    chapterName: chapter?.name || "N/A",
  });

  return newPlaylist;
};

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updatePlaylist = async (playlistId, playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

  if (!API_CONFIG.useMock) {
    const response = await apiRequest(API_ENDPOINTS.playlists.detail(playlistId), {
      method: 'PATCH',
      body: JSON.stringify({
        title: playlistData.title.trim(),
        description: playlistData.description?.trim(),
        thumbnail: playlistData.thumbnail,
        chapter_id: playlistData.chapterId,
        video_ids: playlistData.videoIds,
        is_public: playlistData.isPublic,
      }),
    });

    logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
      videoId: response.id,
      videoTitle: `Playlist: ${response.title}`,
      chapterName: "Playlist Updated",
    });

    return response;
  }

  // Mock implementation
  await mockDelay(300);

  const playlists = initializePlaylists();
  const index = playlists.findIndex((p) => p.id === playlistId);

  if (index === -1) {
    throw new Error("Playlist not found");
  }

  const updatedPlaylist = {
    ...playlists[index],
    title: playlistData.title.trim(),
    description: playlistData.description?.trim() || playlists[index].description,
    thumbnail: playlistData.thumbnail || playlists[index].thumbnail,
    chapterId: playlistData.chapterId ?? playlists[index].chapterId,
    videoIds: playlistData.videoIds ?? playlists[index].videoIds,
    isPublic: playlistData.isPublic ?? playlists[index].isPublic,
  };

  playlists[index] = updatedPlaylist;
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
    videoId: updatedPlaylist.id,
    videoTitle: `Playlist: ${updatedPlaylist.title}`,
    chapterName: "Playlist Updated",
  });

  return updatedPlaylist;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.playlists.addVideo(playlistId), {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId }),
    });
  }

  await mockDelay(200);

  const playlists = initializePlaylists();
  const index = playlists.findIndex((p) => p.id === playlistId);

  if (index === -1) {
    throw new Error("Playlist not found");
  }

  if (!playlists[index].videoIds.includes(videoId)) {
    playlists[index].videoIds.push(videoId);
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }

  return playlists[index];
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.playlists.removeVideo(playlistId), {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId }),
    });
  }

  await mockDelay(200);

  const playlists = initializePlaylists();
  const index = playlists.findIndex((p) => p.id === playlistId);

  if (index === -1) {
    throw new Error("Playlist not found");
  }

  playlists[index].videoIds = playlists[index].videoIds.filter(id => id !== videoId);
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  return playlists[index];
};

export const reorderPlaylistVideos = async (playlistId, newVideoIds) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.playlists.reorder(playlistId), {
      method: 'POST',
      body: JSON.stringify({ video_ids: newVideoIds }),
    });
  }

  await mockDelay(200);

  const playlists = initializePlaylists();
  const index = playlists.findIndex((p) => p.id === playlistId);

  if (index === -1) {
    throw new Error("Playlist not found");
  }

  playlists[index].videoIds = newVideoIds;
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  return playlists[index];
};

// ============================================
// DELETE OPERATIONS
// ============================================

export const deletePlaylist = async (playlistId) => {
  if (!API_CONFIG.useMock) {
    const playlist = await getPlaylistById(playlistId);
    await apiRequest(API_ENDPOINTS.playlists.detail(playlistId), {
      method: 'DELETE',
    });

    if (playlist) {
      logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
        videoId: playlist.id,
        videoTitle: `Playlist: ${playlist.title}`,
        chapterName: "Playlist Deleted",
      });
    }

    return { success: true };
  }

  // Mock implementation
  await mockDelay(300);

  const playlists = initializePlaylists();
  const index = playlists.findIndex((p) => p.id === playlistId);

  if (index === -1) {
    throw new Error("Playlist not found");
  }

  const deletedPlaylist = playlists[index];
  playlists.splice(index, 1);
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
    videoId: deletedPlaylist.id,
    videoTitle: `Playlist: ${deletedPlaylist.title}`,
    chapterName: "Playlist Deleted",
  });

  return { success: true };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const resetPlaylists = async () => {
  await mockDelay(200);
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(initialPlaylists));
  return initialPlaylists;
};
