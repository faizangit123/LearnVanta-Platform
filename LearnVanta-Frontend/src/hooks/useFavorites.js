/**
 * Favorites Hook
 * 
 * Manages video favorites with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useEffect, useCallback } from 'react';
import * as videoService from '../services/videoService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await videoService.getFavorites();
      setFavorites(data || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (video) => {
    try {
      const updated = await videoService.addToFavorites(video);
      setFavorites(updated || []);
      return true;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      return false;
    }
  }, []);

  const removeFavorite = useCallback(async (videoId) => {
    try {
      const updated = await videoService.removeFromFavorites(videoId);
      setFavorites(updated || []);
      return true;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (video) => {
    try {
      const result = await videoService.toggleFavorite(video);
      setFavorites(result.favorites || []);
      return result;   //  return full object
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return { favorites: [], isFavorite: false };
    }
  }, []);

  // Django-compatible favorite check
  const checkIsFavorite = useCallback((videoId) => {
    return favorites.some(item =>
      item.video?.id === videoId ||   // Django
      item.videoId === videoId        // mock
    );
  }, [favorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite: checkIsFavorite,
    refresh: loadFavorites
  };
};

export default useFavorites;
