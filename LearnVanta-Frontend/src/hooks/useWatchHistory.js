/**
 * Watch History Hook
 * 
 * Manages video watch history with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useEffect, useCallback } from 'react';
import * as videoService from '../services/videoService';

export const useWatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeHistory = (data = []) => {
    return data.map(item => ({
      ...item,
      videoId: item.video?.id ?? item.videoId,
      title: item.video?.title ?? item.title,
      thumbnail: item.video?.thumbnail ?? item.thumbnail,
      duration: item.video?.duration ?? item.duration,
      chapterName: item.video?.chapter?.name ?? item.chapterName,
      progress: item.progress ?? 0,
    }));
  };

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await videoService.getWatchHistory();
      setHistory(normalizeHistory(data));
    } catch (error) {
      console.error('Failed to load watch history:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (video) => {
    try {
      const updated = await videoService.addToWatchHistory(video);
      setHistory(normalizeHistory(updated));
    } catch (error) {
      console.error('Failed to add to watch history:', error);
    }
  }, []);

  const removeFromHistory = useCallback(async (videoId) => {
    try {
      const updated = await videoService.removeFromWatchHistory(videoId);
      setHistory(normalizeHistory(updated));
    } catch (error) {
      console.error('Failed to remove from watch history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await videoService.clearWatchHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear watch history:', error);
    }
  }, []);

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
