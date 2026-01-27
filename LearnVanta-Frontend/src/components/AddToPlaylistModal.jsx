import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthPrompt } from "../context/AuthPromptContext.jsx";
import { useUserPlaylists } from "../hooks/useUserPlaylists.js";

// Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlaylistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15V6" /><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" />
  </svg>
);

const AddToPlaylistModal = ({ isOpen, onClose, video }) => {
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useAuthPrompt();
  const { 
    playlists, 
    createPlaylist, 
    addVideoToPlaylist, 
    removeVideoFromPlaylist,
    isVideoInPlaylist 
  } = useUserPlaylists();
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTogglePlaylist = (playlistId) => {
    if (!isAuthenticated) {
      showLoginPrompt("playlists");
      return;
    }
    
    if (isVideoInPlaylist(playlistId, video.id)) {
      removeVideoFromPlaylist(playlistId, video.id);
    } else {
      addVideoToPlaylist(playlistId, video.id);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    setIsCreating(true);
    const newPlaylist = createPlaylist(newPlaylistName, newPlaylistDesc);
    
    if (newPlaylist && video) {
      addVideoToPlaylist(newPlaylist.id, video.id);
    }
    
    setNewPlaylistName("");
    setNewPlaylistDesc("");
    setShowNewForm(false);
    setIsCreating(false);
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    },
    modal: {
      backgroundColor: "hsl(var(--card))",
      borderRadius: "1rem",
      width: "100%",
      maxWidth: "400px",
      maxHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
      animation: "modalSlideIn 0.2s ease-out",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.25rem 1.5rem",
      borderBottom: "1px solid hsl(var(--border))",
    },
    title: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    closeBtn: {
      padding: "0.5rem",
      borderRadius: "0.5rem",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: "hsl(var(--foreground-secondary))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.15s",
    },
    content: {
      padding: "1rem 1.5rem",
      overflowY: "auto",
      flex: 1,
    },
    videoInfo: {
      display: "flex",
      gap: "0.75rem",
      padding: "0.75rem",
      backgroundColor: "hsl(var(--muted))",
      borderRadius: "0.75rem",
      marginBottom: "1rem",
    },
    videoThumb: {
      width: "80px",
      height: "45px",
      borderRadius: "0.375rem",
      objectFit: "cover",
    },
    videoTitle: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
      lineHeight: 1.3,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    playlistList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    playlistItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.875rem",
      borderRadius: "0.75rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "transparent",
      cursor: "pointer",
      transition: "all 0.15s",
      width: "100%",
      textAlign: "left",
    },
    playlistItemActive: {
      borderColor: "hsl(var(--primary))",
      backgroundColor: "hsl(var(--primary) / 0.1)",
    },
    checkbox: {
      width: "1.25rem",
      height: "1.25rem",
      borderRadius: "0.375rem",
      border: "2px solid hsl(var(--border))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.15s",
    },
    checkboxActive: {
      backgroundColor: "hsl(var(--primary))",
      borderColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
    },
    playlistName: {
      flex: 1,
      fontSize: "0.9375rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
    },
    videoCount: {
      fontSize: "0.75rem",
      color: "hsl(var(--foreground-secondary))",
    },
    emptyState: {
      textAlign: "center",
      padding: "2rem 1rem",
      color: "hsl(var(--foreground-secondary))",
    },
    emptyIcon: {
      width: "48px",
      height: "48px",
      margin: "0 auto 1rem",
      opacity: 0.5,
    },
    newPlaylistBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      width: "100%",
      padding: "0.875rem",
      borderRadius: "0.75rem",
      border: "2px dashed hsl(var(--border))",
      backgroundColor: "transparent",
      color: "hsl(var(--primary))",
      fontSize: "0.9375rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.15s",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      padding: "1rem",
      backgroundColor: "hsl(var(--muted))",
      borderRadius: "0.75rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.9375rem",
    },
    formActions: {
      display: "flex",
      gap: "0.5rem",
      marginTop: "0.25rem",
    },
    cancelBtn: {
      flex: 1,
      padding: "0.625rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    createBtn: {
      flex: 1,
      padding: "0.625rem",
      borderRadius: "0.5rem",
      border: "none",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <PlaylistIcon />
            Save to playlist
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={styles.content}>
          {/* Current Video Info */}
          {video && (
            <div style={styles.videoInfo}>
              <img 
                src={video.thumbnail} 
                alt="" 
                style={styles.videoThumb}
              />
              <p style={styles.videoTitle}>{video.title}</p>
            </div>
          )}

          {/* Playlist List */}
          {playlists.length > 0 ? (
            <div style={styles.playlistList}>
              {playlists.map((playlist) => {
                const isInPlaylist = isVideoInPlaylist(playlist.id, video?.id);
                return (
                  <button
                    key={playlist.id}
                    style={{
                      ...styles.playlistItem,
                      ...(isInPlaylist ? styles.playlistItemActive : {}),
                    }}
                    onClick={() => handleTogglePlaylist(playlist.id)}
                  >
                    <div
                      style={{
                        ...styles.checkbox,
                        ...(isInPlaylist ? styles.checkboxActive : {}),
                      }}
                    >
                      {isInPlaylist && <CheckIcon />}
                    </div>
                    <span style={styles.playlistName}>{playlist.name}</span>
                    <span style={styles.videoCount}>
                      {playlist.videoIds.length} videos
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <PlaylistIcon />
              </div>
              <p>No playlists yet</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Create your first playlist below
              </p>
            </div>
          )}

          {/* New Playlist Form */}
          {showNewForm ? (
            <form style={styles.form} onSubmit={handleCreatePlaylist}>
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                style={styles.input}
                autoFocus
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                style={styles.input}
              />
              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => {
                    setShowNewForm(false);
                    setNewPlaylistName("");
                    setNewPlaylistDesc("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.createBtn}
                  disabled={isCreating || !newPlaylistName.trim()}
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          ) : (
            <button
              style={styles.newPlaylistBtn}
              onClick={() => {
                if (!isAuthenticated) {
                  showLoginPrompt("playlists");
                  return;
                }
                setShowNewForm(true);
              }}
            >
              <PlusIcon />
              Create new playlist
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddToPlaylistModal;
