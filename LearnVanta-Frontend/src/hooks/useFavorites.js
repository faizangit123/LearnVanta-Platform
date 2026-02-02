/**
 * Favorites Hook
 * 
 * Manages video favorites with localStorage (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useEffect, useCallback } from 'react';
import * as videoService from '../services/videoService';
import { useAuth } from '../contexts/AuthContext'; //  ADDED: we need auth state to avoid calling API when logged out

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    // ADDED: hard guard
    if (!isAuthenticated) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }
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
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (video) => {
    if (!isAuthenticated) return false;
    try {
      const updated = await videoService.addToFavorites(video);
      setFavorites(updated || []);
      return true;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      return false;
    }
  }, [isAuthenticated]); 

    const removeFavorite = useCallback(async (videoId) => {
    if (!isAuthenticated) return false;
    try {
      const updated = await videoService.removeFromFavorites(videoId);
      setFavorites(updated || []);
      return true;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      return false;
    }
  }, [isAuthenticated]);

   const toggleFavorite = useCallback(async (video) => {
    if (!isAuthenticated) {
      return { favorites: [], isFavorite: false }; 
    }
    try {
      const result = await videoService.toggleFavorite(video);
      setFavorites(result.favorites || []);
      return result.isFavorite;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return null;
    }
  }, [isAuthenticated]); 

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
