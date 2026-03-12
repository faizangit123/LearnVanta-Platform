import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest, safeArray } from "../config/api";
import { getAllUsers, updateUserRole, deleteUser } from "../services/authService.js";
import { getAllVideos, createVideo, updateVideo, deleteVideo as deleteVideoService, bulkDeleteVideos, bulkUpdateVideos } from "../services/videoManagementService.js";
import { getRecentActivities, getActivityMeta, ACTIVITY_TYPES, clearActivityLogs } from "../services/activityLogService.js";
import VideoFormModal from "../components/admin/VideoFormModal.jsx";
import PlaylistFormModal from "../components/admin/PlaylistFormModal.jsx";
import DeleteConfirmModal from "../components/admin/DeleteConfirmModal.jsx";
import ChapterResourcesManager from "../components/admin/ChapterResourcesManager.jsx";
import { getAllPlaylists, createPlaylist, updatePlaylist, deletePlaylist as deletePlaylistService } from "../services/playlistService.js";
// Icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z"></path>
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
  </svg>
);

const TrendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
    <path d="m15 5 4 4"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const CheckboxIcon = ({ checked }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={checked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    {checked && <polyline points="9 11 12 14 22 4" stroke="white" strokeWidth="2"></polyline>}
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);

const TrendingDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
    <polyline points="16 17 22 17 22 11"></polyline>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
    <path d="M16 16h5v5"></path>
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M19 8v6"></path>
    <path d="M22 11h-6"></path>
  </svg>
);

const LogInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const UserXIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="17" y1="8" x2="22" y2="13"></line>
    <line x1="22" y1="8" x2="17" y2="13"></line>
  </svg>
);

const VideoPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z"></path>
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
    <path d="M9 10v4"></path>
    <path d="M7 12h4"></path>
  </svg>
);

const getActivityIcon = (type) => {
  switch (type) {
    case ACTIVITY_TYPES.USER_REGISTERED:
      return <UserPlusIcon />;
    case ACTIVITY_TYPES.USER_LOGIN:
      return <LogInIcon />;
    case ACTIVITY_TYPES.ROLE_CHANGED:
      return <ShieldIcon />;
    case ACTIVITY_TYPES.USER_DELETED:
      return <UserXIcon />;
    case ACTIVITY_TYPES.VIDEO_CREATED:
      return <VideoPlusIcon />;
    case ACTIVITY_TYPES.VIDEO_UPDATED:
      return <EditIcon />;
    case ACTIVITY_TYPES.VIDEO_DELETED:
      return <TrashIcon />;
    default:
      return <ActivityIcon />;
  }
};

const AdminDashboard = () => {
  const { user: currentUser, isLoading } = useAuth();
  const isAdmin = currentUser?.isAdmin === true;
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [roleChangeLoading, setRoleChangeLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Videos state
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState("");
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFormLoading, setVideoFormLoading] = useState(false);
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const [deleteVideoLoading, setDeleteVideoLoading] = useState(false);
  
  // Bulk selection state
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Activity logs state
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  
  // Playlists state
  const [playlists, setPlaylists] = useState([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState("");
  const [isPlaylistFormOpen, setIsPlaylistFormOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [playlistFormLoading, setPlaylistFormLoading] = useState(false);
  const [deletePlaylistId, setDeletePlaylistId] = useState(null);
  const [deletePlaylistLoading, setDeletePlaylistLoading] = useState(false);
  
  // Notification
  const [notification, setNotification] = useState(null);

  // Load users when switching to users tab
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  useEffect(() => {
  apiRequest("/content/classes/")
    .then((data) => setClasses(data || []))
    .catch(() => setClasses([]));

  apiRequest("/content/subjects/")
    .then((data) => setSubjects(data || []))
    .catch(() => setSubjects([]));
  }, []);

  // Load videos when switching to videos or overview tab
  useEffect(() => {
    if (activeTab === "videos" || activeTab === "overview") {
      loadVideos();
    }
  }, [activeTab]);

  // Load activity logs when switching to activity tab
  useEffect(() => {
    if (activeTab === "activity" || activeTab === "overview") {
      loadActivityLogs();
    }
  }, [activeTab]);

  // Load playlists when switching to playlists tab
  useEffect(() => {
    if (activeTab === "playlists") {
      loadPlaylists();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      showNotification("Failed to load users: ", `${error}`);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadVideos = async () => {
    setVideosLoading(true);
    try {
      const allVideos = await getAllVideos();
      setVideos(allVideos);
    } catch (error) {
      
      showNotification("Failed to load videos", `${error}`);
    } finally {
      setVideosLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    setActivityLoading(true);
    try {
      const logs = await getRecentActivities(50);
      setActivityLogs(safeArray(logs));
    } catch (error) {
      showNotification("Failed to load activity logs: ", `${error}`);
    } finally {
      setActivityLoading(false);
    }
  };
  
  const handleClearActivityLogs = async () => {
  try {
    await clearActivityLogs();   // backend / service call
    setActivityLogs([]);         // THIS is the missing piece
    showNotification("All activity logs cleared");
  } catch (error) {
    showNotification("Failed to clear logs: ", `${error}`);
  }
};
  const loadPlaylists = async () => {
    setPlaylistsLoading(true);
    try {
      const allPlaylists = await getAllPlaylists();
      setPlaylists(allPlaylists);
    } catch (error) {
      showNotification("Failed to load playlists: ", `${error}`);
    } finally {
      setPlaylistsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRoleChange = async (userId, newRole) => {
    setRoleChangeLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showNotification(`Role updated to ${newRole}`);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setRoleChangeLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleteLoading(userId);
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
      showNotification("User deleted successfully");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
    video.chapterName.toLowerCase().includes(videoSearchQuery.toLowerCase())
  );

  const filteredActivities = activityFilter === "all" 
    ? activityLogs 
    : activityLogs.filter(log => {
        if (activityFilter === "users") {
          return [ACTIVITY_TYPES.USER_REGISTERED, ACTIVITY_TYPES.USER_LOGIN, ACTIVITY_TYPES.ROLE_CHANGED, ACTIVITY_TYPES.USER_DELETED].includes(log.type);
        }
        if (activityFilter === "videos") {
          return [ACTIVITY_TYPES.VIDEO_CREATED, ACTIVITY_TYPES.VIDEO_UPDATED, ACTIVITY_TYPES.VIDEO_DELETED].includes(log.type);
        }
        return true;
      });

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.title.toLowerCase().includes(playlistSearchQuery.toLowerCase()) ||
    (playlist.description || "").toLowerCase().includes(playlistSearchQuery.toLowerCase())
  );

  // Video CRUD handlers
  const handleOpenVideoForm = (video = null) => {
    setEditingVideo(video);
    setIsVideoFormOpen(true);
  };

  const handleCloseVideoForm = () => {
    setIsVideoFormOpen(false);
    setEditingVideo(null);
  };

  const handleVideoFormSubmit = async (formData) => {
    setVideoFormLoading(true);
    try {
      if (editingVideo) {
        const updated = await updateVideo(editingVideo.id, formData);
        setVideos(videos.map(v => v.id === updated.id ? updated : v));
        showNotification("Video updated successfully");
      } else {
        const newVideo = await createVideo(formData);
        setVideos([newVideo, ...videos]);
        showNotification("Video created successfully");
      }
      handleCloseVideoForm();
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setVideoFormLoading(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!deleteVideoId) return;
    setDeleteVideoLoading(true);
    try {
      await deleteVideoService(deleteVideoId);
      setVideos(videos.filter(v => v.id !== deleteVideoId));
      setDeleteVideoId(null);
      showNotification("Video deleted successfully");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeleteVideoLoading(false);
    }
  };

  // Bulk selection handlers
  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectAllVideos = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(v => v.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedVideos([]);
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    setBulkActionLoading(true);
    try {
      const result = await bulkDeleteVideos(selectedVideos);
      setVideos(videos.filter(v => !selectedVideos.includes(v.id)));
      setSelectedVideos([]);
      setShowBulkDeleteConfirm(false);
      showNotification(`${result.deletedCount} video(s) deleted successfully`);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkMarkTrending = async (isTrending) => {
    if (selectedVideos.length === 0) return;
    setBulkActionLoading(true);
    try {
      await bulkUpdateVideos(selectedVideos, { isTrending });
      setVideos(videos.map(v => 
        selectedVideos.includes(v.id) ? { ...v, isTrending } : v
      ));
      setSelectedVideos([]);
      showNotification(`${selectedVideos.length} video(s) ${isTrending ? 'marked as trending' : 'unmarked from trending'}`);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Playlist CRUD handlers
  const handleOpenPlaylistForm = (playlist = null) => {
    setEditingPlaylist(playlist);
    setIsPlaylistFormOpen(true);
  };

  const handleClosePlaylistForm = () => {
    setIsPlaylistFormOpen(false);
    setEditingPlaylist(null);
  };

  const handlePlaylistFormSubmit = async (formData) => {
    setPlaylistFormLoading(true);
    try {
      if (editingPlaylist) {
        const updated = await updatePlaylist(editingPlaylist.id, formData);
        setPlaylists(playlists.map(p => p.id === updated.id ? updated : p));
        showNotification("Playlist updated successfully");
      } else {
        const newPlaylist = await createPlaylist(formData);
        setPlaylists([newPlaylist, ...playlists]);
        showNotification("Playlist created successfully");
      }
      handleClosePlaylistForm();
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setPlaylistFormLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!deletePlaylistId) return;
    setDeletePlaylistLoading(true);
    try {
      await deletePlaylistService(deletePlaylistId);
      setPlaylists(playlists.filter(p => p.id !== deletePlaylistId));
      setDeletePlaylistId(null);
      showNotification("Playlist deleted successfully");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeletePlaylistLoading(false);
    }
  };

  const adminStats = {
    totalVideos: videos.length,
    totalViews: videos.reduce((acc, v) => acc + v.views, 0),
    totalSubjects: subjects.length,
    totalClasses: classes.length,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(timestamp);
  };

  const getActivityDescription = (log) => {
  const { type, details } = log;
  switch (type) {
    case ACTIVITY_TYPES.USER_REGISTERED:
      return `New user "${details.user_email}" registered`;
    case ACTIVITY_TYPES.USER_LOGIN:
      return `"${details.user_email}" logged in`;
    case ACTIVITY_TYPES.VIDEO_CREATED:
      return `Video "${details.videoTitle}" was added`;
    case ACTIVITY_TYPES.VIDEO_UPDATED:
      return `Video "${details.videoTitle}" was updated`;
    case ACTIVITY_TYPES.VIDEO_DELETED:
      return `Video "${details.videoTitle}" was deleted`;
    case ACTIVITY_TYPES.PROFILE_UPDATED:
      return `"${details.user_email}" updated profile`;
    default:
      return "System activity";
  }
};


  const getActivityColor = (type) => {
    const meta = getActivityMeta(type);
    switch (meta.color) {
      case "success": return "hsl(var(--accent))";
      case "error": return "hsl(var(--destructive))";
      case "warning": return "hsl(var(--warning, 38 92% 50%))";
      case "primary": return "hsl(var(--primary))";
      case "accent": return "hsl(var(--accent))";
      default: return "hsl(var(--foreground-secondary))";
    }
  };

  const statsCards = [
    { label: "Total Users", value: users.length || "—", icon: <UsersIcon />, color: "primary", change: "Live data" },
    { label: "Total Videos", value: adminStats.totalVideos, icon: <VideoIcon />, color: "accent", change: "+5" },
    { label: "Total Views", value: formatNumber(adminStats.totalViews), icon: <EyeIcon />, color: "success", change: "+18%" },
    { label: "Active Classes", value: adminStats.totalClasses, icon: <BookIcon />, color: "warning", change: "0" },
  ];

  if (!isLoading && !isAdmin) {
  return (
    <MainLayout>
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>You are not allowed to view this page.</p>
      </div>
    </MainLayout>
  );
}

  return (
    <MainLayout>
      <div className="admin-dashboard">
        <div className="container">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage your educational platform</p>
            </div>
            <div className="admin-header-actions">
              <button className="btn btn-outline btn-md" onClick={loadVideos}>
                <RefreshIcon />
                Refresh
              </button>
              <button className="btn btn-primary btn-md" onClick={() => handleOpenVideoForm()}>
                <PlusIcon />
                Add Video
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="admin-stats-grid">
            {statsCards.map((stat, index) => (
              <div key={index} className={`admin-stat-card stat-${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-change ${stat.change.startsWith("+") ? "positive" : ""}`}>
                    {stat.change} this month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`admin-tab ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveTab("videos")}
            >
              Videos
            </button>
            <button
              className={`admin-tab ${activeTab === "playlists" ? "active" : ""}`}
              onClick={() => setActiveTab("playlists")}
            >
              Playlists
            </button>
            <button
              className={`admin-tab ${activeTab === "resources" ? "active" : ""}`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </button>
            {isAdmin && (
              <button className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}>
              Users
              </button>
              )}
            <button
              className={`admin-tab ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </button>
          </div>

          {/* Tab Content */}
          <div className="admin-content">
            {activeTab === "overview" && (
              <div className="admin-overview">
                {/* Recent Activity */}
                <div className="admin-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ marginBottom: 0 }}>Recent Activity</h2>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveTab("activity")}
                    >
                      View All
                    </button>
                  </div>
                  {activityLoading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "hsl(var(--foreground-secondary))" }}>Loading...</div>
                  ) : activityLogs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "hsl(var(--foreground-secondary))" }}>
                      No activity yet. Activities will appear as users interact with the platform.
                    </div>
                  ) : (
                    <div className="recent-activity-list">
                      {activityLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="recent-activity-item">
                          <div 
                            className="recent-activity-icon"
                            style={{ 
                              backgroundColor: `${getActivityColor(log.type)}20`,
                              color: getActivityColor(log.type),
                            }}
                          >
                            {getActivityIcon(log.type)}
                          </div>
                          <div className="recent-activity-content">
                            <p className="recent-activity-text">{getActivityDescription(log)}</p>
                            <span className="recent-activity-time">{formatRelativeTime(log.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Videos */}
                <div className="admin-section">
                  <h2>Recent Videos</h2>
                  {videosLoading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "hsl(var(--foreground-secondary))" }}>Loading...</div>
                  ) : (
                    <div className="admin-video-list">
                      {videos.slice(0, 5).map((video) => (
                        <div key={video.id} className="admin-video-item">
                          <img src={video.thumbnail} alt={video.title} className="admin-video-thumb" />
                          <div className="admin-video-info">
                            <h4>{video.title}</h4>
                            <p>{video.chapterName} • {formatNumber(video.views)} views</p>
                          </div>
                          <div className="admin-video-actions">
                            <button className="icon-btn-sm" onClick={() => handleOpenVideoForm(video)}>
                              <EditIcon />
                            </button>
                            <button className="icon-btn-sm danger" onClick={() => setDeleteVideoId(video.id)}>
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="admin-section">
                  <h2>Class Distribution</h2>
                  <div className="class-distribution">
                    {safeArray(classes).map((cls) => (
                      <div key={cls.id} className="class-bar">
                        <div className="class-bar-label">
                          <span>{cls.name}</span>
                          <span>{formatNumber(cls.studentCount)}</span>
                        </div>
                        <div className="class-bar-track">
                          <div
                            className="class-bar-fill"
                            style={{ width: `${(cls.studentCount / 3500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="admin-videos">
                <div className="admin-table-header">
                  <h2>All Videos ({filteredVideos.length})</h2>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Search videos..."
                      className="input"
                      style={{ maxWidth: "300px" }}
                      value={videoSearchQuery}
                      onChange={(e) => setVideoSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenVideoForm()}>
                      <PlusIcon /> Add
                    </button>
                  </div>
                </div>

                {/* Bulk Action Bar */}
                {selectedVideos.length > 0 && (
                  <div className="bulk-action-bar">
                    <div className="bulk-action-info">
                      <span className="bulk-count">{selectedVideos.length} selected</span>
                      <button 
                        className="bulk-clear-btn"
                        onClick={handleClearSelection}
                      >
                        <XIcon /> Clear
                      </button>
                    </div>
                    <div className="bulk-action-buttons">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleBulkMarkTrending(true)}
                        disabled={bulkActionLoading}
                      >
                        <TrendingUpIcon /> Mark Trending
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleBulkMarkTrending(false)}
                        disabled={bulkActionLoading}
                      >
                        <TrendingDownIcon /> Unmark Trending
                      </button>
                      <button 
                        className="btn btn-sm"
                        style={{ backgroundColor: "hsl(var(--destructive))", color: "white" }}
                        onClick={() => setShowBulkDeleteConfirm(true)}
                        disabled={bulkActionLoading}
                      >
                        <TrashIcon /> Delete Selected
                      </button>
                    </div>
                  </div>
                )}

                {videosLoading ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    Loading videos...
                  </div>
                ) : filteredVideos.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    {videoSearchQuery ? "No videos found matching your search" : "No videos yet. Add your first video!"}
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>
                            <button 
                              className="checkbox-btn"
                              onClick={handleSelectAllVideos}
                              style={{ 
                                color: selectedVideos.length === filteredVideos.length ? "hsl(var(--primary))" : "hsl(var(--foreground-secondary))"
                              }}
                            >
                              <CheckboxIcon checked={selectedVideos.length === filteredVideos.length && filteredVideos.length > 0} />
                            </button>
                          </th>
                          <th>Video</th>
                          <th>Chapter</th>
                          <th>Views</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVideos.map((video) => (
                          <tr key={video.id} className={selectedVideos.includes(video.id) ? "selected-row" : ""}>
                            <td>
                              <button 
                                className="checkbox-btn"
                                onClick={() => handleSelectVideo(video.id)}
                                style={{ 
                                  color: selectedVideos.includes(video.id) ? "hsl(var(--primary))" : "hsl(var(--foreground-secondary))"
                                }}
                              >
                                <CheckboxIcon checked={selectedVideos.includes(video.id)} />
                              </button>
                            </td>
                            <td>
                              <div className="table-video-cell">
                                <img src={video.thumbnail} alt="" />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span>{video.title.length > 35 ? video.title.substring(0, 35) + "..." : video.title}</span>
                                  <span style={{ fontSize: "0.7rem", color: "hsl(var(--foreground-muted))" }}>{video.duration} • {video.publishedAt}</span>
                                </div>
                              </div>
                            </td>
                            <td>{video.chapterName}</td>
                            <td>{formatNumber(video.views)}</td>
                            <td>
                              {video.isTrending ? (
                                <span className="status-badge active">Trending</span>
                              ) : (
                                <span className="status-badge inactive">Normal</span>
                              )}
                            </td>
                            <td>
                              <div className="table-actions">
                                <Link to={`/video/${video.id}`} className="icon-btn-sm">
                                  <EyeIcon />
                                </Link>
                                <button className="icon-btn-sm" onClick={() => handleOpenVideoForm(video)}>
                                  <EditIcon />
                                </button>
                                <button className="icon-btn-sm danger" onClick={() => setDeleteVideoId(video.id)}>
                                  <TrashIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "playlists" && (
              <div className="admin-playlists">
                <div className="admin-table-header">
                  <h2>Manage Playlists ({filteredPlaylists.length})</h2>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Search playlists..."
                      className="input"
                      style={{ maxWidth: "300px" }}
                      value={playlistSearchQuery}
                      onChange={(e) => setPlaylistSearchQuery(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={loadPlaylists}
                      disabled={playlistsLoading}
                    >
                      <RefreshIcon /> Refresh
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenPlaylistForm()}>
                      <PlusIcon /> Add Playlist
                    </button>
                  </div>
                </div>

                {playlistsLoading ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    Loading playlists...
                  </div>
                ) : filteredPlaylists.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    {playlistSearchQuery ? "No playlists found matching your search" : "No playlists yet. Create your first playlist!"}
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Playlist</th>
                          <th>Videos</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlaylists.map((playlist) => (
                          <tr key={playlist.id}>
                            <td>
                              <div className="table-video-cell">
                                <img 
                                  src={playlist.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&q=80"} 
                                  alt="" 
                                  style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "0.375rem" }}
                                />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: 500 }}>{playlist.title.length > 40 ? playlist.title.substring(0, 40) + "..." : playlist.title}</span>
                                  <span style={{ fontSize: "0.7rem", color: "hsl(var(--foreground-muted))" }}>
                                    {playlist.description ? (playlist.description.length > 50 ? playlist.description.substring(0, 50) + "..." : playlist.description) : "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ 
                                display: "inline-flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                minWidth: "2rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "1rem",
                                backgroundColor: "hsl(var(--primary) / 0.15)",
                                color: "hsl(var(--primary))",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                              }}>
                                {playlist.videoIds?.length || 0}
                              </span>
                            </td>
                            <td>
                              {playlist.isPublic !== false ? (
                                <span className="status-badge active">Public</span>
                              ) : (
                                <span className="status-badge inactive">Private</span>
                              )}
                            </td>
                            <td>{formatDate(playlist.createdAt)}</td>
                            <td>
                              <div className="table-actions">
                                <button className="icon-btn-sm" onClick={() => handleOpenPlaylistForm(playlist)}>
                                  <EditIcon />
                                </button>
                                <button className="icon-btn-sm danger" onClick={() => setDeletePlaylistId(playlist.id)}>
                                  <TrashIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="admin-users">
                <div className="admin-table-header">
                  <h2>Registered Users ({filteredUsers.length})</h2>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="input"
                      style={{ maxWidth: "300px" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={loadUsers}
                      disabled={usersLoading}
                    >
                      <RefreshIcon /> Refresh
                    </button>
                  </div>
                </div>
                
                {usersLoading ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    {searchQuery ? "No users found matching your search" : "No registered users yet"}
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="table-user-cell">
                                <div className="table-user-avatar" style={{ 
                                  backgroundColor: user.role === "admin" ? "hsl(var(--primary))" : "hsl(var(--secondary))"
                                }}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{user.name}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                  disabled={roleChangeLoading === user.id || user.id === "admin_001"}
                                  className="role-select"
                                  style={{
                                    padding: "0.35rem 0.5rem",
                                    borderRadius: "0.375rem",
                                    border: "1px solid hsl(var(--border))",
                                    backgroundColor: "hsl(var(--card))",
                                    color: "hsl(var(--foreground))",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    cursor: user.id === "admin_001" ? "not-allowed" : "pointer",
                                    opacity: user.id === "admin_001" ? 0.6 : 1,
                                  }}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                {user.role === "admin" && (
                                  <span style={{ color: "hsl(var(--primary))" }}><ShieldIcon /></span>
                                )}
                                {roleChangeLoading === user.id && (
                                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--foreground-secondary))" }}>Saving...</span>
                                )}
                              </div>
                            </td>
                            <td>{formatDate(user.created_at)}</td>
                            <td>
                              <div className="table-actions">
                                {user.id === "admin_001" ? (
                                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--foreground-secondary))" }}>Primary Admin</span>
                                ) : deleteConfirm === user.id ? (
                                  <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.75rem", color: "hsl(var(--destructive))" }}>Delete?</span>
                                    <button 
                                      className="icon-btn-sm danger"
                                      onClick={() => handleDeleteUser(user.id)}
                                      disabled={deleteLoading === user.id}
                                    >
                                      {deleteLoading === user.id ? "..." : "Yes"}
                                    </button>
                                    <button 
                                      className="icon-btn-sm"
                                      onClick={() => setDeleteConfirm(null)}
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    className="icon-btn-sm danger"
                                    onClick={() => setDeleteConfirm(user.id)}
                                  >
                                    <TrashIcon />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "resources" && (
              <ChapterResourcesManager />
            )}

            {activeTab === "activity" && (
              <div className="admin-activity">
                <div className="admin-table-header">
                  <h2>Activity Logs ({filteredActivities.length})</h2>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <select
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                      className="input"
                      style={{ maxWidth: "150px" }}
                    >
                      <option value="all">All Activities</option>
                      <option value="users">User Activities</option>
                      <option value="videos">Video Activities</option>
                    </select>
                    <button 
                    className="btn btn-outline btn-sm"
                    onClick={handleClearActivityLogs}
                    >
                    Clear All
                    </button>
                    <button 
                      className="btn btn-outline btn-sm" 
                      onClick={loadActivityLogs}
                      disabled={activityLoading}
                    >
                      <RefreshIcon /> Refresh
                    </button>
                  </div>
                </div>
                
                {activityLoading ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    Loading activity logs...
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--foreground-secondary))" }}>
                    No activity logs yet. Activities will appear here as users interact with the platform.
                  </div>
                ) : (
                  <div className="activity-log-list">
                    {filteredActivities.map((log) => (
                      <div key={log.id} className="activity-log-item">
                        <div 
                          className="activity-icon"
                          style={{ 
                            backgroundColor: `${getActivityColor(log.type)}20`,
                            color: getActivityColor(log.type),
                          }}
                        >
                          {getActivityIcon(log.type)}
                        </div>
                        <div className="activity-content">
                          <p className="activity-description">{getActivityDescription(log)}</p>
                          <div className="activity-meta">
                            <span className="activity-type">{getActivityMeta(log.type).label}</span>
                            <span className="activity-time">{formatRelativeTime(log.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Notification Toast */}
          {notification && (
            <div 
              style={{
                position: "fixed",
                bottom: "1.5rem",
                right: "1.5rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: notification.type === "error" ? "hsl(var(--destructive))" : "hsl(var(--primary))",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 100,
                animation: "slideIn 0.2s ease-out",
              }}
            >
              {notification.message}
            </div>
          )}

          {/* Video Form Modal */}
          <VideoFormModal
            isOpen={isVideoFormOpen}
            onClose={handleCloseVideoForm}
            onSubmit={handleVideoFormSubmit}
            video={editingVideo}
            isLoading={videoFormLoading}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={!!deleteVideoId}
            onClose={() => setDeleteVideoId(null)}
            onConfirm={handleDeleteVideo}
            title="Delete Video"
            message="Are you sure you want to delete this video? This action cannot be undone and will remove the video from all lists."
            isLoading={deleteVideoLoading}
          />

          {/* Bulk Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={showBulkDeleteConfirm}
            onClose={() => setShowBulkDeleteConfirm(false)}
            onConfirm={handleBulkDelete}
            title="Delete Selected Videos"
            message={`Are you sure you want to delete ${selectedVideos.length} selected video(s)? This action cannot be undone.`}
            isLoading={bulkActionLoading}
          />

          {/* Playlist Form Modal */}
          <PlaylistFormModal
            isOpen={isPlaylistFormOpen}
            onClose={handleClosePlaylistForm}
            onSubmit={handlePlaylistFormSubmit}
            playlist={editingPlaylist}
            isLoading={playlistFormLoading}
          />

          {/* Delete Playlist Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={!!deletePlaylistId}
            onClose={() => setDeletePlaylistId(null)}
            onConfirm={handleDeletePlaylist}
            title="Delete Playlist"
            message="Are you sure you want to delete this playlist? Videos in the playlist will not be deleted."
            isLoading={deletePlaylistLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
