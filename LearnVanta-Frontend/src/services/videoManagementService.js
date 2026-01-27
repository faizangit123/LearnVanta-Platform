/**
 * Video Management Service (Admin)
 * 
 * Handles CRUD operations for video content management.
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { API_CONFIG, API_ENDPOINTS, apiRequest, mockDelay } from "../config/api.js";
import { videos as initialVideos, subjects, chapters } from "../data/mockData.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

const VIDEOS_KEY = "edustream_videos";

// Initialize with mock data if not exists
const initializeVideos = () => {
  const stored = localStorage.getItem(VIDEOS_KEY);
  if (!stored) {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(initialVideos));
    return initialVideos;
  }
  return JSON.parse(stored);
};

// ============================================
// READ OPERATIONS
// ============================================

export const getAllVideos = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.videos.list);
  }

  await mockDelay(300);
  return initializeVideos();
};

export const getVideoById = async (videoId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.videos.detail(videoId));
  }

  await mockDelay(200);
  const videos = initializeVideos();
  return videos.find((v) => v.id === videoId) || null;
};

export const searchVideos = async (query) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`${API_ENDPOINTS.videos.search}?q=${encodeURIComponent(query)}`);
  }

  await mockDelay(200);
  const videos = initializeVideos();
  const lowerQuery = query.toLowerCase();

  return videos.filter(
    (v) =>
      v.title.toLowerCase().includes(lowerQuery) ||
      v.chapterName.toLowerCase().includes(lowerQuery) ||
      v.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
};

// ============================================
// CREATE OPERATIONS
// ============================================

export const createVideo = async (videoData) => {
  // Validate required fields
  if (!videoData.title?.trim()) {
    throw new Error("Title is required");
  }
  if (!videoData.chapterId) {
    throw new Error("Chapter is required");
  }

  if (!API_CONFIG.useMock) {
    const response = await apiRequest(API_ENDPOINTS.videos.list, {
      method: 'POST',
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
  }

  // Mock implementation
  await mockDelay(500);

  const videos = initializeVideos();
  const chapter = chapters.find((c) => c.id === videoData.chapterId);
  const subject = subjects.find((s) => s.id === chapter?.subjectId);

  const newVideo = {
    id: "vid-" + Date.now(),
    title: videoData.title.trim(),
    description: videoData.description?.trim() || "",
    videoType: videoData.videoType || "youtube",
    youtubeId: videoData.youtubeId || "",
    youtubeUrl: videoData.youtubeUrl || "",
    thumbnail: videoData.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    duration: videoData.duration || "00:00",
    views: 0,
    likes: 0,
    subjectId: chapter?.subjectId || "",
    chapterId: videoData.chapterId,
    chapterName: chapter?.name || "",
    tags: videoData.tags || [],
    publishedAt: new Date().toISOString().split("T")[0],
    isTrending: false,
    isRecent: true,
    resources: videoData.resources || [],
  };

  const updated = [newVideo, ...videos];
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated));

  logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
    videoId: newVideo.id,
    videoTitle: newVideo.title,
    chapterName: newVideo.chapterName,
  });

  return newVideo;
};

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updateVideo = async (videoId, videoData) => {
  if (!videoData.title?.trim()) {
    throw new Error("Title is required");
  }

  if (!API_CONFIG.useMock) {
    const response = await apiRequest(API_ENDPOINTS.videos.detail(videoId), {
      method: 'PATCH',
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
    });

    logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
      videoId: response.id,
      videoTitle: response.title,
      chapterName: response.chapter_name,
    });

    return response;
  }

  // Mock implementation
  await mockDelay(500);

  const videos = initializeVideos();
  const videoIndex = videos.findIndex((v) => v.id === videoId);

  if (videoIndex === -1) {
    throw new Error("Video not found");
  }

  let chapterName = videos[videoIndex].chapterName;
  if (videoData.chapterId && videoData.chapterId !== videos[videoIndex].chapterId) {
    const chapter = chapters.find((c) => c.id === videoData.chapterId);
    chapterName = chapter?.name || chapterName;
  }

  const updatedVideo = {
    ...videos[videoIndex],
    title: videoData.title.trim(),
    description: videoData.description?.trim() || videos[videoIndex].description,
    videoType: videoData.videoType || videos[videoIndex].videoType,
    youtubeId: videoData.youtubeId ?? videos[videoIndex].youtubeId,
    youtubeUrl: videoData.youtubeUrl ?? videos[videoIndex].youtubeUrl,
    thumbnail: videoData.thumbnail || videos[videoIndex].thumbnail,
    duration: videoData.duration || videos[videoIndex].duration,
    chapterId: videoData.chapterId || videos[videoIndex].chapterId,
    chapterName,
    tags: videoData.tags || videos[videoIndex].tags,
    isTrending: videoData.isTrending ?? videos[videoIndex].isTrending,
  };

  videos[videoIndex] = updatedVideo;
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));

  logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
    videoId: updatedVideo.id,
    videoTitle: updatedVideo.title,
    chapterName: updatedVideo.chapterName,
  });

  return updatedVideo;
};

export const bulkUpdateVideos = async (videoIds, updates) => {
  if (!API_CONFIG.useMock) {
    return apiRequest('/videos/bulk-update/', {
      method: 'POST',
      body: JSON.stringify({
        video_ids: videoIds,
        updates: {
          is_trending: updates.isTrending,
        },
      }),
    });
  }

  // Mock implementation
  await mockDelay(500);

  const videos = initializeVideos();
  const updatedVideos = [];

  videoIds.forEach(videoId => {
    const videoIndex = videos.findIndex((v) => v.id === videoId);
    if (videoIndex !== -1) {
      videos[videoIndex] = { ...videos[videoIndex], ...updates };
      updatedVideos.push(videos[videoIndex]);
    }
  });

  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));

  updatedVideos.forEach(video => {
    logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
      videoId: video.id,
      videoTitle: video.title,
      chapterName: video.chapterName,
    });
  });

  return { success: true, updatedCount: updatedVideos.length };
};

// ============================================
// DELETE OPERATIONS
// ============================================

export const deleteVideo = async (videoId) => {
  if (!API_CONFIG.useMock) {
    const video = await getVideoById(videoId);
    await apiRequest(API_ENDPOINTS.videos.detail(videoId), {
      method: 'DELETE',
    });

    if (video) {
      logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
        videoId: video.id,
        videoTitle: video.title,
        chapterName: video.chapterName,
      });
    }

    return { success: true };
  }

  // Mock implementation
  await mockDelay(500);

  const videos = initializeVideos();
  const videoIndex = videos.findIndex((v) => v.id === videoId);

  if (videoIndex === -1) {
    throw new Error("Video not found");
  }

  const deletedVideo = videos[videoIndex];
  videos.splice(videoIndex, 1);
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));

  logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
    videoId: deletedVideo.id,
    videoTitle: deletedVideo.title,
    chapterName: deletedVideo.chapterName,
  });

  return { success: true };
};

export const bulkDeleteVideos = async (videoIds) => {
  if (!API_CONFIG.useMock) {
    return apiRequest('/videos/bulk-delete/', {
      method: 'POST',
      body: JSON.stringify({ video_ids: videoIds }),
    });
  }

  // Mock implementation
  await mockDelay(500);

  const videos = initializeVideos();
  const deletedVideos = [];

  videoIds.forEach(videoId => {
    const videoIndex = videos.findIndex((v) => v.id === videoId);
    if (videoIndex !== -1) {
      deletedVideos.push(videos[videoIndex]);
      videos.splice(videoIndex, 1);
    }
  });

  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));

  deletedVideos.forEach(video => {
    logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
      videoId: video.id,
      videoTitle: video.title,
      chapterName: video.chapterName,
    });
  });

  return { success: true, deletedCount: deletedVideos.length };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getChaptersForForm = () => {
  return chapters.map((chapter) => {
    const subject = subjects.find((s) => s.id === chapter.subjectId);
    return {
      id: chapter.id,
      name: chapter.name,
      subjectName: subject?.name || "",
      classId: subject?.classId || "",
    };
  });
};

export const resetVideos = async () => {
  await mockDelay(300);
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(initialVideos));
  return initialVideos;
};
