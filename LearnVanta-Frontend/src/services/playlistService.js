/**
 * Playlist Management Service
 * 
 * Handles CRUD operations for video playlists.
 */

import { API_CONFIG, apiRequest, } from "../config/api.js";
import { logActivity, ACTIVITY_TYPES } from "./activityLogService.js";

const PLAYLISTS_KEY = "edustream_playlists";


// ============================================
// READ OPERATIONS
// ============================================

export const getAllPlaylists = async () => {
  // Backend endpoint exists
  return apiRequest("/content/playlists/");
};

export const getPlaylistById = async (playlistId) => {
  return apiRequest(`/content/playlists/${playlistId}/`);
};

// export const getPlaylistForVideo = async (videoId) => {
//   if (!API_CONFIG.useMock) {
//     const playlists = await getAllPlaylists();
//     return playlists.find((p) => p.video_ids?.includes(videoId)) || null;
//   }

//   await mockDelay(100);
//   const playlists = initializePlaylists();
//   return playlists.find((p) => p.videoIds.includes(videoId)) || null;
// };

// export const getPlaylistVideos = async (playlistId) => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest(`/content/playlists/${playlistId}/videos/`);
//   }

//   await mockDelay(100);
//   const playlists = initializePlaylists();
//   const playlist = playlists.find((p) => p.id === playlistId);

//   if (!playlist) return [];

//   return playlist.videoIds
//     .map(videoId => videos.find(v => v.id === videoId))
//     .filter(Boolean);
// };

export const getPlaylistsByChapter = async (chapterId) => {
  return apiRequest(`/content/playlists/?chapter_id=${chapterId}`);
};


// ============================================
// CREATE OPERATIONS
// ============================================

export const createPlaylist = async (playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

 const response = await apiRequest("/content/playlists/", {
    method: "POST",
    body: JSON.stringify({
      title: playlistData.title.trim(),
      description: playlistData.description?.trim() || "",
      thumbnail: playlistData.thumbnail || "",
      chapter_id: playlistData.chapterId || null,
      is_public: playlistData.isPublic !== false,
    }),
  });

    logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
      videoId: response.id,
      videoTitle: `Playlist: ${response.title}`,
      chapterName: "N/A",
    });

    return response;
  }

//   // Mock implementation
//   await mockDelay(300);

//   const playlists = initializePlaylists();
//   const chapter = chapters.find(c => c.id === playlistData.chapterId);

//   const newPlaylist = {
//     id: "pl-" + Date.now(),
//     title: playlistData.title.trim(),
//     description: playlistData.description?.trim() || "",
//     thumbnail: playlistData.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
//     chapterId: playlistData.chapterId || null,
//     videoIds: playlistData.videoIds || [],
//     createdAt: new Date().toISOString().split("T")[0],
//     isPublic: playlistData.isPublic !== false,
//   };

//   const updated = [newPlaylist, ...playlists];
//   localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updated));

//   logActivity(ACTIVITY_TYPES.VIDEO_CREATED, {
//     videoId: newPlaylist.id,
//     videoTitle: `Playlist: ${newPlaylist.title}`,
//     chapterName: chapter?.name || "N/A",
//   });

//   return newPlaylist;
// };

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updatePlaylist = async (playlistId, playlistData) => {
  if (!playlistData.title?.trim()) {
    throw new Error("Playlist title is required");
  }

  const response = await apiRequest(
    `/content/playlists/${playlistId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: playlistData.title.trim(),
        description: playlistData.description?.trim(),
        thumbnail: playlistData.thumbnail,
        chapter_id: playlistData.chapterId,
        video_ids: playlistData.videoIds, 
        is_public: playlistData.isPublic,
      }),
    }
  );

    logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
      videoId: response.id,
      videoTitle: `Playlist: ${response.title}`,
      chapterName: "Playlist Updated",
    });

    return response;
  }

//   // Mock implementation (unchanged)
//   await mockDelay(300);

//   const playlists = initializePlaylists();
//   const index = playlists.findIndex((p) => p.id === playlistId);

//   if (index === -1) {
//     throw new Error("Playlist not found");
//   }

//   const updatedPlaylist = {
//     ...playlists[index],
//     title: playlistData.title.trim(),
//     description: playlistData.description?.trim() || playlists[index].description,
//     thumbnail: playlistData.thumbnail || playlists[index].thumbnail,
//     chapterId: playlistData.chapterId ?? playlists[index].chapterId,
//     isPublic: playlistData.isPublic ?? playlists[index].isPublic,
//   };

//   playlists[index] = updatedPlaylist;
//   localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

//   logActivity(ACTIVITY_TYPES.VIDEO_UPDATED, {
//     videoId: updatedPlaylist.id,
//     videoTitle: `Playlist: ${updatedPlaylist.title}`,
//     chapterName: "Playlist Updated",
//   });

//   return updatedPlaylist;
// };


// export const addVideoToPlaylist = async (playlistId, videoId) => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest(`/content/playlists/${playlistId}/add-video/`, {
//       method: 'POST',
//       body: JSON.stringify({ video_id: videoId }),
//     });
//   }};

export const addVideoHelper = async (playlistId, videoId) => {
  const playlist = await getPlaylistById(playlistId);
  return updatePlaylist(playlistId, {
    ...playlist,
    videoIds: [...playlist.videoIds, videoId],
  });
};



  // await mockDelay(200);

  // const playlists = initializePlaylists();
  // const index = playlists.findIndex((p) => p.id === playlistId);

  // if (index === -1) {
  //   throw new Error("Playlist not found");
  // }

  // if (!playlists[index].videoIds.includes(videoId)) {
  //   playlists[index].videoIds.push(videoId);
  //   localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  // }

  // return playlists[index];
// };

// export const removeVideoFromPlaylist = async (playlistId, videoId) => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest(`/content/playlists/${playlistId}/remove-video/`, {
//       method: 'POST',
//       body: JSON.stringify({ video_id: videoId }),
//     });
//   }};


  export const removeVideoHelper = async (playlistId, videoId) => {
  const playlist = await getPlaylistById(playlistId);
  return updatePlaylist(playlistId, {
    ...playlist,
    videoIds: playlist.videoIds.filter(id => id !== videoId),
  });
};

  // await mockDelay(200);

  // const playlists = initializePlaylists();
  // const index = playlists.findIndex((p) => p.id === playlistId);

  // if (index === -1) {
  //   throw new Error("Playlist not found");
  // }

  // playlists[index].videoIds = playlists[index].videoIds.filter(id => id !== videoId);
  // localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  // return playlists[index];
// };

// export const reorderPlaylistVideos = async (playlistId, newVideoIds) => {
//   if (!API_CONFIG.useMock) {
//     return apiRequest(`/content/playlists/${playlistId}/reorder/`, {
//       method: 'POST',
//       body: JSON.stringify({ video_ids: newVideoIds }),
//     });
//   }

  // await mockDelay(200);

  // const playlists = initializePlaylists();
  // const index = playlists.findIndex((p) => p.id === playlistId);

  // if (index === -1) {
  //   throw new Error("Playlist not found");
  // }

  // playlists[index].videoIds = newVideoIds;
  // localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  // return playlists[index];
// };

// ============================================
// DELETE OPERATIONS
// ============================================

export const deletePlaylist = async (playlistId) => {
  const playlist = await getPlaylistById(playlistId);

  await apiRequest(`/content/playlists/${playlistId}/`, {
    method: "DELETE",
  });

    if (playlist) {
      logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
        videoId: playlist.id,
        videoTitle: `Playlist: ${playlist.title}`,
        chapterName: "Playlist Deleted",
      });
    }

    return { success: true };
  }

  // Mock implementation unchanged
  // await mockDelay(300);

  // const playlists = initializePlaylists();
  // const index = playlists.findIndex((p) => p.id === playlistId);

  // if (index === -1) {
  //   throw new Error("Playlist not found");
  // }

  // const deletedPlaylist = playlists[index];
  // playlists.splice(index, 1);
  // localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));

  // logActivity(ACTIVITY_TYPES.VIDEO_DELETED, {
  //   videoId: deletedPlaylist.id,
  //   videoTitle: `Playlist: ${deletedPlaylist.title}`,
  //   chapterName: "Playlist Deleted",
  // });

  // return { success: true };
// };

// ============================================
// UTILITY FUNCTIONS
// ============================================

// export const resetPlaylists = async () => {
//   await mockDelay(200);
//   localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(initialPlaylists));
//   return initialPlaylists;
// };
