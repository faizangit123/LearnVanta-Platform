/**
 * Personal User Playlists Hook
 * 
 * Manages user-created playlists with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_CONFIG, API_ENDPOINTS, apiRequest } from "../config/api.js";
import { getVideoById } from "../data/mockData.js";

const USER_PLAYLISTS_KEY = "edustream_user_playlists";


/* ADDED: safe endpoint fallback (prevents undefined crash) */
const USER_PLAYLIST_ENDPOINTS = {
  list: API_ENDPOINTS?.userPlaylists?.list || "/user/playlists/",
  detail: (id) =>
    API_ENDPOINTS?.userPlaylists?.detail
      ? API_ENDPOINTS.userPlaylists.detail(id)
      : `/user/playlists/${id}/`,
  addVideo: (id) =>
    API_ENDPOINTS?.userPlaylists?.addVideo
      ? API_ENDPOINTS.userPlaylists.addVideo(id)
      : `/user/playlists/${id}/add-video/`,
  removeVideo: (id) =>
    API_ENDPOINTS?.userPlaylists?.removeVideo
      ? API_ENDPOINTS.userPlaylists.removeVideo(id)
      : `/user/playlists/${id}/remove-video/`,
  reorder: (id) =>
    API_ENDPOINTS?.userPlaylists?.reorder
      ? API_ENDPOINTS.userPlaylists.reorder(id)
      : `/user/playlists/${id}/reorder/`,
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const getLocalPlaylists = (userId) => {
  try {
    const key = `${USER_PLAYLISTS_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalPlaylists = (userId, playlists) => {
  const key = `${USER_PLAYLISTS_KEY}_${userId}`;
  localStorage.setItem(key, JSON.stringify(playlists));
};

// ============================================
// Normalizer
// ============================================

const normalizePlaylist = (playlist) => ({
  id: playlist.id,
  name: playlist.name || playlist.title,
  description: playlist.description || "",
  videoIds: playlist.videoIds || playlist.video_ids || [],
  createdAt: playlist.createdAt || playlist.created_at || new Date().toISOString(),
  updatedAt: playlist.updatedAt || playlist.updated_at || new Date().toISOString(),
});

// ============================================
// MAIN HOOK
// ============================================

export const useUserPlaylists = () => {
  const { user, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

   // Load playlists
  const loadPlaylists = useCallback(async () => {
    /* never call API if logged out */
    if (!isAuthenticated || !user?.id) {
      setPlaylists([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (!API_CONFIG.useMock) {
        const data = await apiRequest(USER_PLAYLIST_ENDPOINTS.list);
        const normalized = (data || []).map(normalizePlaylist);
        setPlaylists(normalized);
      } else {
        setPlaylists(getLocalPlaylists(user.id));
      }
    } catch (error) {
      console.error("Failed to load user playlists:", error);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  // Load on mount and when user changes
  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // Save to localStorage (mock mode)
  const savePlaylists = useCallback((updatedPlaylists) => {
    if (!user?.id) return;
    if (API_CONFIG.useMock) {
      saveLocalPlaylists(user.id, updatedPlaylists);
    }
    setPlaylists(updatedPlaylists);
  }, [user?.id]);

  // Create a new playlist
  const createPlaylist = useCallback(async (name, description = "") => {
    if (!isAuthenticated || !name?.trim()) return null;

    if (!API_CONFIG.useMock) {
      const newPlaylist = await apiRequest(API_ENDPOINTS.userPlaylists.list, {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const normalized = normalizePlaylist(newPlaylist);
      setPlaylists(prev => [normalized, ...prev]);
      return normalized;
    }

    // Mock implementation
    const newPlaylist = {
      id: `upl-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      videoIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPlaylist, ...playlists];
    savePlaylists(updated);
    return newPlaylist;
  }, [isAuthenticated, playlists, savePlaylists]);

  // Update playlist details
  const updatePlaylist = useCallback(async (playlistId, updates) => {
    if (!isAuthenticated) return null;
    if (!API_CONFIG.useMock) {
      const updated = await apiRequest(USER_PLAYLIST_ENDPOINTS.detail(playlistId), {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const normalized = normalizePlaylist(updated);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? normalized : p));
      return normalized;
    }

    const index = playlists.findIndex(p => p.id === playlistId);
    if (index === -1) return null;

    const updatedPlaylist = {
      ...playlists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updated = [...playlists];
    updated[index] = updatedPlaylist;
    savePlaylists(updated);
    return updatedPlaylist;
  }, [playlists, savePlaylists, isAuthenticated]);

  // Delete a playlist
  const deletePlaylist = useCallback(async (playlistId) => {
    if (!isAuthenticated) return false;
    if (!API_CONFIG.useMock) {
      await apiRequest(USER_PLAYLIST_ENDPOINTS.detail(playlistId), {
        method: 'DELETE',
      });
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      return true;
    }

    const updated = playlists.filter(p => p.id !== playlistId);
    savePlaylists(updated);
    return true;
  }, [playlists, savePlaylists, isAuthenticated]);

  // Add video to playlist
  const addVideoToPlaylist = useCallback(async (playlistId, videoId) => {
    if (!isAuthenticated) return false;

    if (!API_CONFIG.useMock) {
      await apiRequest(USER_PLAYLIST_ENDPOINTS.addVideo(playlistId), {
        method: 'POST',
        body: JSON.stringify({ video_id: videoId }),
      });
      await loadPlaylists();
      return true;
    }

    const index = playlists.findIndex(p => p.id === playlistId);
    if (index === -1) return false;

    const playlist = playlists[index];
    if (playlist.videoIds.includes(videoId)) return true;

    const updatedPlaylist = {
      ...playlist,
      videoIds: [...playlist.videoIds, videoId],
      updatedAt: new Date().toISOString(),
    };

    const updated = [...playlists];
    updated[index] = updatedPlaylist;
    savePlaylists(updated);
    return true;
  }, [playlists, savePlaylists, loadPlaylists, isAuthenticated]);

  // Remove video from playlist
  const removeVideoFromPlaylist = useCallback(async (playlistId, videoId) => {
    if (!isAuthenticated) return false;
    if (!API_CONFIG.useMock) {
      await apiRequest(USER_PLAYLIST_ENDPOINTS.removeVideo(playlistId), {
        method: 'POST',
        body: JSON.stringify({ video_id: videoId }),
      });
      await loadPlaylists();
      return true;
    }

    const index = playlists.findIndex(p => p.id === playlistId);
    if (index === -1) return false;

    const updatedPlaylist = {
      ...playlists[index],
      videoIds: playlists[index].videoIds.filter(id => id !== videoId),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...playlists];
    updated[index] = updatedPlaylist;
    savePlaylists(updated);
    return true;
  }, [playlists, savePlaylists, loadPlaylists, isAuthenticated]);

  // // Check if video is in any playlist
  // const isVideoInPlaylist = useCallback((playlistId, videoId) => {
  //   const playlist = playlists.find(p => p.id === playlistId);
  //   return playlist?.videoIds.includes(videoId) || false;
  // }, [playlists]);

  // // Get playlists containing a specific video
  // const getPlaylistsForVideo = useCallback((videoId) => {
  //   return playlists.filter(p => p.videoIds.includes(videoId));
  // }, [playlists]);

  // // Get playlist by ID with full video data
  // const getPlaylistWithVideos = useCallback((playlistId) => {
  //   const playlist = playlists.find(p => p.id === playlistId);
  //   if (!playlist) return null;

  //   const videos = playlist.videoIds
  //     .map(id => getVideoById(id))
  //     .filter(Boolean);

  //   return {
  //     ...playlist,
  //     videos,
  //     videoCount: videos.length,
  //   };
  // }, [playlists]);

  // Reorder videos in playlist
  const reorderVideos = useCallback(async (playlistId, newVideoIds) => {
    if (!isAuthenticated) return false;
    if (!API_CONFIG.useMock) {
      await apiRequest(USER_PLAYLIST_ENDPOINTS.reorder(playlistId), {
        method: 'POST',
        body: JSON.stringify({ video_ids: newVideoIds }),
      });
      await loadPlaylists();
      return true;
    }

    const index = playlists.findIndex(p => p.id === playlistId);
    if (index === -1) return false;

    const updatedPlaylist = {
      ...playlists[index],
      videoIds: newVideoIds,
      updatedAt: new Date().toISOString(),
    };

    const updated = [...playlists];
    updated[index] = updatedPlaylist;
    savePlaylists(updated);
    return true;
  }, [playlists, savePlaylists, loadPlaylists, isAuthenticated]);

  return {
    playlists,
    isLoading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    isVideoInPlaylist: (pid, vid) =>
      playlists.find(p => p.id === pid)?.videoIds.includes(vid) || false,
    getPlaylistsForVideo: (vid) =>
      playlists.filter(p => p.videoIds.includes(vid)),
    getPlaylistWithVideos: (pid) => {
      const playlist = playlists.find(p => p.id === pid);
      if (!playlist) return null;
      const videos = playlist.videoIds.map(id => getVideoById(id)).filter(Boolean);
      return { ...playlist, videos, videoCount: videos.length };
    },
    reorderVideos,
    refreshPlaylists: loadPlaylists,
  };
};

export default useUserPlaylists;
