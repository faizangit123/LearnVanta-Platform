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
// MAIN HOOK
// ============================================

export const useUserPlaylists = () => {
  const { user, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load playlists
  const loadPlaylists = useCallback(async () => {
    if (!user?.id) {
      setPlaylists([]);
      return;
    }

    setIsLoading(true);
    try {
      if (!API_CONFIG.useMock) {
        const data = await apiRequest(API_ENDPOINTS.userPlaylists.list);
        setPlaylists(data || []);
      } else {
        setPlaylists(getLocalPlaylists(user.id));
      }
    } catch (error) {
      console.error("Failed to load user playlists:", error);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

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
      setPlaylists(prev => [newPlaylist, ...prev]);
      return newPlaylist;
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
    if (!API_CONFIG.useMock) {
      const updated = await apiRequest(API_ENDPOINTS.userPlaylists.detail(playlistId), {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updated : p));
      return updated;
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
  }, [playlists, savePlaylists]);

  // Delete a playlist
  const deletePlaylist = useCallback(async (playlistId) => {
    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.userPlaylists.detail(playlistId), {
        method: 'DELETE',
      });
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      return true;
    }

    const updated = playlists.filter(p => p.id !== playlistId);
    savePlaylists(updated);
    return true;
  }, [playlists, savePlaylists]);

  // Add video to playlist
  const addVideoToPlaylist = useCallback(async (playlistId, videoId) => {
    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.userPlaylists.addVideo(playlistId), {
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
  }, [playlists, savePlaylists, loadPlaylists]);

  // Remove video from playlist
  const removeVideoFromPlaylist = useCallback(async (playlistId, videoId) => {
    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.userPlaylists.removeVideo(playlistId), {
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
  }, [playlists, savePlaylists, loadPlaylists]);

  // Check if video is in any playlist
  const isVideoInPlaylist = useCallback((playlistId, videoId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist?.videoIds.includes(videoId) || false;
  }, [playlists]);

  // Get playlists containing a specific video
  const getPlaylistsForVideo = useCallback((videoId) => {
    return playlists.filter(p => p.videoIds.includes(videoId));
  }, [playlists]);

  // Get playlist by ID with full video data
  const getPlaylistWithVideos = useCallback((playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return null;

    const videos = playlist.videoIds
      .map(id => getVideoById(id))
      .filter(Boolean);

    return {
      ...playlist,
      videos,
      videoCount: videos.length,
    };
  }, [playlists]);

  // Reorder videos in playlist
  const reorderVideos = useCallback(async (playlistId, newVideoIds) => {
    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.userPlaylists.reorder(playlistId), {
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
  }, [playlists, savePlaylists, loadPlaylists]);

  return {
    playlists,
    isLoading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    isVideoInPlaylist,
    getPlaylistsForVideo,
    getPlaylistWithVideos,
    reorderVideos,
    refreshPlaylists: loadPlaylists,
  };
};

export default useUserPlaylists;
