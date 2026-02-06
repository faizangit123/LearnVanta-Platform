/**
 * Watch History Hook
 * 
 * Manages video watch history using Django API.
 */

import { useState, useEffect, useCallback } from "react";
import * as videoService from "../services/videoService";
import { useAuth } from "../context/AuthContext.jsx"; 

export const useWatchHistory = () => {
  const { isAuthenticated } = useAuth();   // auth guard

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // LOAD HISTORY
  // ============================================
  const loadHistory = useCallback(async () => {
    // HARD GUARD: never call backend if logged out
    if (!isAuthenticated) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await videoService.getWatchHistory();
      setHistory(data || []);
    } catch (error) {
      console.error("Failed to load watch history:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load on mount & when auth changes
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ============================================
  // ADD TO HISTORY
  // ============================================
  const addToHistory = useCallback(async (video) => {
    if (!isAuthenticated || !video?.id) return;

    try {
      const updated = await videoService.addToWatchHistory(video);
      setHistory(updated || []);
    } catch (error) {
      console.error("Failed to add to watch history:", error);
    }
  }, [isAuthenticated]);

  // ============================================
  // REMOVE FROM HISTORY
  // ============================================
  const removeFromHistory = useCallback(async (videoId) => {
    if (!isAuthenticated || !videoId) return;

    try {
      const updated = await videoService.removeFromWatchHistory(videoId);
      setHistory(updated || []);
    } catch (error) {
      console.error("Failed to remove from watch history:", error);
    }
  }, [isAuthenticated]);

  // ============================================
  // CLEAR HISTORY
  // ============================================
  const clearHistory = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await videoService.clearWatchHistory();
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear watch history:", error);
    }
  }, [isAuthenticated]);

  // ============================================
  // PUBLIC API
  // ============================================
  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    refresh: loadHistory,
  };
};

export default useWatchHistory;
