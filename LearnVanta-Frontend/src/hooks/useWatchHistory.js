/**
 * Watch History Hook
 * 
 * Manages video watch history with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useEffect, useCallback } from 'react';
import * as videoService from '../services/videoService';
import { useAuth } from '../contexts/AuthContext'; 


export const useWatchHistory = () => {
  const { isAuthenticated } = useAuth(); 


  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    // ADDED: prevent 401 spam
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
      console.error('Failed to load watch history:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); 


  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (video) => {
    if (!isAuthenticated) return; 

    try {
      const updated = await videoService.addToWatchHistory(video);
      setHistory(updated || []);
    } catch (error) {
      console.error('Failed to add to watch history:', error);
    }
  }, [isAuthenticated]); 


  const removeFromHistory = useCallback(async (videoId) => {
    if (!isAuthenticated) return; 

    try {
      const updated = await videoService.removeFromWatchHistory(videoId);
      setHistory(updated || []);
    } catch (error) {
      console.error('Failed to remove from watch history:', error);
    }
  }, [isAuthenticated]); 


  const clearHistory = useCallback(async () => {
    if (!isAuthenticated) return; 

    try {
      await videoService.clearWatchHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear watch history:', error);
    }
  }, [isAuthenticated]); 

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    refresh: loadHistory
  };
};

export default useWatchHistory;
