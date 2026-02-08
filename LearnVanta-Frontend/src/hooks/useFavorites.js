/**
 * Favorites Hook
 *
 * Manages video favorites using Django REST API.
 * Never calls API when user is logged out.
 * Fully normalized to backend serializer.
 */

import { useState, useEffect, useCallback } from 'react';
import * as videoService from '../services/videoService';
import { useAuth } from '../context/AuthContext.jsx'; 

// ============================================
// NORMALIZER (CRITICAL)
// ============================================
// Makes frontend immune to backend shape changes

const normalizeFavorites = (data = []) => {
  return data.map(item => ({
    videoId: item.video_id || item.videoId,
    title: item.title,
    thumbnail: item.thumbnail,
    duration: item.duration,
    chapterName: item.chapter_name || item.chapterName,
  }));
};

// ============================================
// MAIN HOOK
// ============================================

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // LOAD FAVORITES
  // ============================================
  // FIXES:
  // - 401 spam on homepage
  // - "Session expired" errors
  // - API calls without token

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await videoService.getFavorites();
      const normalized = normalizeFavorites(data);
      setFavorites(normalized);
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

  // ============================================
  // ADD FAVORITE
  // ============================================

  const addFavorite = useCallback(async (video) => {
    if (!isAuthenticated) return false;

    try {
      const data = await videoService.addToFavorites(video);
      const normalized = normalizeFavorites(data);
      setFavorites(normalized);
      return true;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      return false;
    }
  }, [isAuthenticated]);

  // ============================================
  // REMOVE FAVORITE
  // ============================================

  const removeFavorite = useCallback(async (videoId) => {
    if (!isAuthenticated) return false;

    try {
      const data = await videoService.removeFromFavorites(videoId);
      const normalized = normalizeFavorites(data);
      setFavorites(normalized);
      return true;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      return false;
    }
  }, [isAuthenticated]);

  // ============================================
  // TOGGLE FAVORITE
  // ============================================
  // Backend returns ONLY list → we compute state ourselves

  const toggleFavorite = useCallback(async (video) => {
    if (!isAuthenticated) {
      return { favorites: [], isFavorite: false };
    }

    try {
      const data = await videoService.toggleFavorite(video);
      const normalized = normalizeFavorites(data);
      setFavorites(normalized);

      const isFav = normalized.some(f => f.videoId === video.id);
      return { favorites: normalized, isFavorite: isFav };
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return { favorites: [], isFavorite: false };
    }
  }, [isAuthenticated]);

  

  // ============================================
  // CHECK FAVORITE
  // ============================================

  const checkIsFavorite = useCallback((videoId) => {
    return favorites.some(item => item.videoId === videoId);
  }, [favorites]);

  // ============================================
  // EXPORT
  // ============================================

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
