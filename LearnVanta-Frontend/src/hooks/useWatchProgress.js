/**
 * Watch Progress Hook
 * 
 * Manages video watch progress with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as videoService from '../services/videoService';
import { useAuth } from '../contexts/AuthContext'; 


export const useWatchProgress = (videoId) => {
  const { isAuthenticated } = useAuth(); 


  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const lastUpdateRef = useRef(0);

  //  normalize backend shape
  const normalizeProgress = (data = {}) => {
    return {
      currentTime: data.current_time ?? data.currentTime ?? 0,
      duration: data.duration ?? 0,
      percentage: data.percentage ?? 0,
    };
  };

  const loadProgress = useCallback(async () => {
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
      console.error('Failed to load watch progress:', error);
      setProgress({ currentTime: 0, duration: 0, percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [videoId, isAuthenticated]); 


  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Throttled update
  const updateProgress = useCallback(async (currentTime, duration) => {
    if (!videoId || !isAuthenticated) return; 


    const now = Date.now();
    if (now - lastUpdateRef.current < 5000) return;
    lastUpdateRef.current = now;

    try {
      const updated = await videoService.updateWatchProgress(videoId, currentTime, duration);
      setProgress(normalizeProgress(updated)); 
    } catch (error) {
      console.error('Failed to update watch progress:', error);
    }
  }, [videoId, isAuthenticated]); 


  // Force update
  const forceUpdateProgress = useCallback(async (currentTime, duration) => {
    if (!videoId || !isAuthenticated) return; 

    try {
      const updated = await videoService.updateWatchProgress(videoId, currentTime, duration);
      setProgress(normalizeProgress(updated)); 
    } catch (error) {
      console.error('Failed to update watch progress:', error);
    }
  }, [videoId, isAuthenticated]); 

  return {
    progress,
    isLoading,
    loadProgress,
    updateProgress,
    forceUpdateProgress
  };
};

export default useWatchProgress;
