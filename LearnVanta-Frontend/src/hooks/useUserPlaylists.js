/**
 * Personal User Playlists Hook
 *
 * Manages user-created playlists using Django REST API.
 * Mock code is kept only for non-critical UI helpers.
 * Production always uses real backend.
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_ENDPOINTS, apiRequest } from "../config/api.js";
// Only used for UI preview, not data source

// ============================================
// SAFE ENDPOINT FALLBACK (CRITICAL FIX)
// ============================================
// This prevents: "Cannot read properties of undefined (reading 'list')"

const USER_PLAYLIST_ENDPOINTS = {
  list: "/userdata/playlists/",
  detail: (id) => `/userdata/playlists/${id}/`,
  addVideo: (id) => `/userdata/playlists/${id}/add-video/`,
  removeVideo: (id) => `/userdata/playlists/${id}/remove-video/`,
  reorder: (id) => `/userdata/playlists/${id}/reorder/`,
};


// ============================================
// NORMALIZER (DO NOT REMOVE THIS EVER)
// ============================================
// This is what makes frontend immune to backend changes

const normalizePlaylist = (playlist) => ({
  id: playlist.id,
  name: playlist.name || playlist.title,
  description: playlist.description || "",
  videoIds: Array.isArray(playlist.videoIds)
  ? playlist.videoIds
  : Array.isArray(playlist.video_ids)
  ? playlist.video_ids
  : [],
  createdAt:
    playlist.createdAt ||
    playlist.created_at ||
    new Date().toISOString(),
  updatedAt:
    playlist.updatedAt ||
    playlist.updated_at ||
    new Date().toISOString(),
});

// ============================================
// MAIN HOOK
// ============================================

export const useUserPlaylists = () => {
  const { user, isAuthenticated } = useAuth();

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // LOAD PLAYLISTS
  // ============================================
  // FIXES:
  // - 401 spam when logged out
  // - infinite errors on home page
  // - API calls without token

  const loadPlaylists = useCallback(async () => {
    if (!isAuthenticated) {
      setPlaylists([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest(USER_PLAYLIST_ENDPOINTS.list);
      const normalized = (data || []).map(normalizePlaylist);
      setPlaylists(normalized);
    } catch (error) {
      console.error("Failed to load user playlists:", error);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);


 useEffect(() => {
  setPlaylists([]);   //  clears old/mock/cached data
  loadPlaylists();   //  loads fresh data from backend
}, [loadPlaylists]);


  // ============================================
  // CREATE PLAYLIST
  // ============================================

const createPlaylist = useCallback(
  async ({ title, description = "" }) => {
    if (!isAuthenticated || !title?.trim()) return null;

    const newPlaylist = await apiRequest(
      USER_PLAYLIST_ENDPOINTS.list,
      {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      }
    );

    const normalized = normalizePlaylist(newPlaylist);
    setPlaylists((prev) => [normalized, ...prev]);
    return normalized;
  },
  [isAuthenticated]
);


  // ============================================
  // UPDATE PLAYLIST
  // ============================================

 const updatePlaylist = useCallback(async () => {
  throw new Error("Playlist update not supported yet");
}, []);

  // ============================================
  // DELETE PLAYLIST
  // ============================================

  const deletePlaylist = useCallback(
    async (playlistId) => {
      if (!isAuthenticated) return false;

      await apiRequest(
        USER_PLAYLIST_ENDPOINTS.detail(playlistId),
        { method: "DELETE" }
      );

      setPlaylists((prev) =>
        prev.filter((p) => p.id !== playlistId)
      );
      return true;
    },
    [isAuthenticated]
  );

  // ============================================
  // ADD VIDEO
  // ============================================

  const addVideoToPlaylist = useCallback(
    async (playlistId, videoId) => {
      if (!isAuthenticated) return false;

      await apiRequest(
        USER_PLAYLIST_ENDPOINTS.addVideo(playlistId),
        {
          method: "POST",
          body: JSON.stringify({ video_id: videoId }),
        }
      );

      await loadPlaylists();
      return true;
    },
    [loadPlaylists, isAuthenticated]
  );

  // ============================================
  // REMOVE VIDEO
  // ============================================

  const removeVideoFromPlaylist = useCallback(
    async (playlistId, videoId) => {
      if (!isAuthenticated) return false;

      await apiRequest(
        USER_PLAYLIST_ENDPOINTS.removeVideo(playlistId),
        {
          method: "POST",
          body: JSON.stringify({ video_id: videoId }),
        }
      );

      await loadPlaylists();
      return true;
    },
    [loadPlaylists, isAuthenticated]
  );

  // ============================================
  // REORDER
  // ============================================

  const reorderVideos = useCallback(
    async (playlistId, newVideoIds) => {
      if (!isAuthenticated) return false;

      await apiRequest(
        USER_PLAYLIST_ENDPOINTS.reorder(playlistId),
        {
          method: "POST",
          body: JSON.stringify({ video_ids: newVideoIds }),
        }
      );

      await loadPlaylists();
      return true;
    },
    [loadPlaylists, isAuthenticated]
  );

  // ============================================
  // UI HELPERS (SAFE)
  // ============================================

  const isVideoInPlaylist = (playlistId, videoId) =>
    playlists.find((p) => p.id === playlistId)?.videoIds.includes(videoId) ||
    false;

  const getPlaylistsForVideo = (videoId) =>
    playlists.filter((p) => p.videoIds.includes(videoId));

  const getPlaylistWithVideos = (playlistId) => {
  const playlist = playlists.find((p) => p.id === playlistId);
  if (!playlist) return null;

  return {
    ...playlist,
    videos: [],
    videoCount: playlist.videoIds.length,
  };
};


  // ============================================
  // EXPORT
  // ============================================

  return {
    playlists,
    isLoading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    reorderVideos,
    isVideoInPlaylist,
    getPlaylistsForVideo,
    getPlaylistWithVideos,
    refreshPlaylists: loadPlaylists,
  };
};

export default useUserPlaylists;
