/**
 * Video Management Service (Admin)
 * 
 * Handles CRUD operations for video content management.
 * Uses real Django REST API.
 */

import { apiRequest } from "../config/api.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

// ============================================
// NORMALIZER (backend → frontend)
// ============================================

const normalizeVideo = (video) => {
  if (!video) return null;

  return {
    id: video.id,
    title: video.title,
    description: video.description || "",
    videoType: video.video_type,
    youtubeId: video.youtube_id,
    youtubeUrl: video.youtube_url,
    thumbnail: video.thumbnail,
    duration: video.duration,
    chapterId: video.chapter?.id || video.chapter_id,
    chapterName: video.chapter?.name || video.chapter_name || "",
    tags: video.tags || [],
    isTrending: video.is_trending || false,
    createdAt: video.created_at,
    updatedAt: video.updated_at,
  };
};

// ============================================
// READ OPERATIONS
// ============================================

export const getAllVideos = async () => {
  const data = await apiRequest("/content/videos/");
  return (data || []).map(normalizeVideo);
};

export const getVideoById = async (videoId) => {
  const data = await apiRequest(`/content/videos/${videoId}/`);
  return normalizeVideo(data);
};

export const searchVideos = async (query) => {
  const data = await apiRequest(
    `/content/videos/?search=${encodeURIComponent(query)}`
  );
  return (data || []).map(normalizeVideo);
};

// ============================================
// CREATE OPERATIONS
// ============================================

export const createVideo = async (videoData) => {
  if (!videoData.title?.trim()) {
    throw new Error("Title is required");
  }
  if (!videoData.chapterId) {
    throw new Error("Chapter is required");
  }

  const response = await apiRequest("/content/admin/videos/create/", {
    method: "POST",
    body: JSON.stringify({
      title: videoData.title.trim(),
      description: videoData.description?.trim() || "",
      video_type: videoData.videoType || "youtube",
      youtube_id: videoData.youtubeId || "",
      youtube_url: videoData.youtubeUrl || "",
      thumbnail: videoData.thumbnail || "",
      duration: videoData.duration || "00:00",
      chapter_id: videoData.chapterId,
      tags: videoData.tags || [],
      is_trending: videoData.isTrending || false,
    }),
  });

  logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
    videoId: response.id,
    videoTitle: response.title,
    chapterName: response.chapter_name,
  });

  return normalizeVideo(response);
};

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updateVideo = async (videoId, videoData) => {
  if (!videoData.title?.trim()) {
    throw new Error("Title is required");
  }

  const response = await apiRequest(
    `/content/admin/videos/${videoId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: videoData.title.trim(),
        description: videoData.description?.trim(),
        video_type: videoData.videoType,
        youtube_id: videoData.youtubeId,
        youtube_url: videoData.youtubeUrl,
        thumbnail: videoData.thumbnail,
        duration: videoData.duration,
        chapter_id: videoData.chapterId,
        tags: videoData.tags,
        is_trending: videoData.isTrending,
      }),
    }
  );

  logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
    videoId: response.id,
    videoTitle: response.title,
    chapterName: response.chapter_name,
  });

  return normalizeVideo(response);
};

export const bulkUpdateVideos = async (videoIds, updates) => {
  return apiRequest("/content/videos/bulk-update/", {
    method: "POST",
    body: JSON.stringify({
      video_ids: videoIds,
      updates: {
        is_trending: updates.isTrending,
      },
    }),
  });
};

// ============================================
// DELETE OPERATIONS
// ============================================

export const deleteVideo = async (videoId) => {
  const video = await getVideoById(videoId);

  // Correct endpoint
  await apiRequest(`/content/admin/videos/${videoId}/delete/`, {
    method: "DELETE",
  });

  if (video) {
    logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
      videoId: video.id,
      videoTitle: video.title,
      chapterName: video.chapterName,
    });
  }

  return { success: true };
};

export const bulkDeleteVideos = async (videoIds) => {
  return apiRequest("/content/videos/bulk-delete/", {
    method: "POST",
    body: JSON.stringify({ video_ids: videoIds }),
  });
};
