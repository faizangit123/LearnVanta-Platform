


/**
 * Watch Progress Hook
 * 
 * Manages video watch progress using Django API.
 * (Mock mode effectively disabled in production)
 */

import { useState, useCallback, useRef, useEffect } from "react";
import * as videoService from "../services/videoService";
import { useAuth } from "../context/AuthContext.jsx"; 

export const useWatchProgress = (videoId) => {
  const { isAuthenticated } = useAuth();

  const [progress, setProgress] = useState({
    currentTime: 0,
    duration: 0,
    percentage: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const lastUpdateRef = useRef(0);

  // ============================================
  // NORMALIZER (backend → frontend)
  // ============================================
  const normalizeProgress = (data = {}) => {
    const currentTime = data.current_time ?? data.currentTime ?? 0;
    const duration = data.duration ?? 0;
    const percentage =
      data.percentage ??
      (duration > 0 ? Math.round((currentTime / duration) * 100) : 0);

    return { currentTime, duration, percentage };
  };

  // ============================================
  // LOAD PROGRESS
  // ============================================
  const loadProgress = useCallback(async () => {
    // HARD GUARD
    if (!videoId || !isAuthenticated) {
      setProgress({ currentTime: 0, duration: 0, percentage: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await videoService.getWatchProgress(videoId);
      setProgress(normalizeProgress(data));
    } catch (error) {
      console.error("Failed to load watch progress:", error);
      setProgress({ currentTime: 0, duration: 0, percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [videoId, isAuthenticated]);

  // Load on mount & when auth/video changes
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // ============================================
  // THROTTLED UPDATE (every 5s)
  // ============================================
  const updateProgress = useCallback(
    async (currentTime, duration) => {
      if (!videoId || !isAuthenticated) return;

      const now = Date.now();
      if (now - lastUpdateRef.current < 5000) return;
      lastUpdateRef.current = now;

      try {
        const updated = await videoService.updateWatchProgress(
          videoId,
          currentTime,
          duration
        );
        setProgress(normalizeProgress(updated));
      } catch (error) {
        console.error("Failed to update watch progress:", error);
      }
    },
    [videoId, isAuthenticated]
  );

  // ============================================
  // FORCE UPDATE (on exit/end)
  // ============================================
  const forceUpdateProgress = useCallback(
    async (currentTime, duration) => {
      if (!videoId || !isAuthenticated) return;

      try {
        const updated = await videoService.updateWatchProgress(
          videoId,
          currentTime,
          duration
        );
        setProgress(normalizeProgress(updated));
      } catch (error) {
        console.error("Failed to update watch progress:", error);
      }
    },
    [videoId, isAuthenticated]
  );

  // ============================================
  // PUBLIC API
  // ============================================
  return {
    progress,
    isLoading,
    loadProgress,
    updateProgress,
    forceUpdateProgress,
  };
};

export default useWatchProgress;
