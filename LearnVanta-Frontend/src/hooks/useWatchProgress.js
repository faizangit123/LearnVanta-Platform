/**
 * Watch Progress Hook
 * 
 * Manages video watch progress with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as videoService from '../services/videoService';

export const useWatchProgress = (videoId) => {
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const lastUpdateRef = useRef(0);

  // 🔧 ADDED: normalize API vs mock shape
  const normalizeProgress = (data = {}) => {
    const currentTime = data.currentTime ?? data.current_time ?? 0;
    const duration = data.duration ?? 0;
    const percentage =
      data.percentage ??
      (duration > 0 ? Math.round((currentTime / duration) * 100) : 0);

    return { currentTime, duration, percentage };
  };

  const loadProgress = useCallback(async () => {
    if (!videoId) return;
    setIsLoading(true);
    try {
      const data = await videoService.getWatchProgress(videoId);
      setProgress(normalizeProgress(data)); // 🔧 CHANGED
    } catch (error) {
      console.error('Failed to load watch progress:', error);
      setProgress({ currentTime: 0, duration: 0, percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Throttled update - only updates every 5 seconds to avoid too many writes
  const updateProgress = useCallback(async (currentTime, duration) => {
    if (!videoId) return;
    
    const now = Date.now();
    if (now - lastUpdateRef.current < 5000) return;
    lastUpdateRef.current = now;

    try {
      const updated = await videoService.updateWatchProgress(videoId, currentTime, duration);
      setProgress(normalizeProgress(updated)); // 🔧 CHANGED
    } catch (error) {
      console.error('Failed to update watch progress:', error);
    }
  }, [videoId]);

  // Force update (for when video ends or user leaves)
  const forceUpdateProgress = useCallback(async (currentTime, duration) => {
    if (!videoId) return;
    try {
      const updated = await videoService.updateWatchProgress(videoId, currentTime, duration);
      setProgress(normalizeProgress(updated)); // 🔧 CHANGED
    } catch (error) {
      console.error('Failed to update watch progress:', error);
    }
  }, [videoId]);

  return {
    progress,
    isLoading,
    loadProgress,
    updateProgress,
    forceUpdateProgress
  };
};

export default useWatchProgress;
