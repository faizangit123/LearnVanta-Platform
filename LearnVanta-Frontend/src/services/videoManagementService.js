/**
 * Video Management Service (Admin)
 * 
 * Handles CRUD operations for video content management.
 * Uses real Django REST API.
 */

import { API_CONFIG, API_ENDPOINTS, apiRequest } from "../config/api.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

// ============================================
// READ OPERATIONS
// ============================================

export const getAllVideos = async () => {
  return apiRequest("/api/v1/content/videos/");
};

export const getVideoById = async (videoId) => {
  return apiRequest(`/api/v1/content/videos/${videoId}/`);
};

export const searchVideos = async (query) => {
  return apiRequest(
    `${API_ENDPOINTS.videos.search}?q=${encodeURIComponent(query)}`
  );
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

  const response = await apiRequest("/api/v1/content/admin/videos/", {
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
    }),
  });

  logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
    videoId: response.id,
    videoTitle: response.title,
    chapterName: response.chapter_name,
  });

  return response;
};

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updateVideo = async (videoId, videoData) => {
  if (!videoData.title?.trim()) {
    throw new Error("Title is required");
  }

  const response = await apiRequest(
    `/api/v1/content/admin/videos/${videoId}/`,
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

  return response;
};

export const bulkUpdateVideos = async (videoIds, updates) => {
  return apiRequest("/api/v1/content/videos/bulk-update/", {
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

  await apiRequest(`/api/v1/content/admin/videos/${videoId}/`, {
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
  return apiRequest("/api/v1/content/videos/bulk-delete/", {
    method: "POST",
    body: JSON.stringify({ video_ids: videoIds }),
  });
};
