import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { useAuth } from "../context/AuthContext.jsx";
import { useUserPlaylists } from "../hooks/useUserPlaylists.js";
import VideoCard from "../components/VideoCard.jsx";

// Icons
const PlaylistIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15V6" /><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const UserPlaylistsPage = () => {
  const { isAuthenticated } = useAuth();
  const { 
    playlists, 
    createPlaylist, 
    updatePlaylist, 
    deletePlaylist, 
    getPlaylistWithVideos,
    removeVideoFromPlaylist 
  } = useUserPlaylists();
  
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const selectedPlaylist = selectedPlaylistId 
    ? getPlaylistWithVideos(selectedPlaylistId) 
    : null;

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    
    createPlaylist(formName, formDesc);
    setFormName("");
    setFormDesc("");
    setShowCreateModal(false);
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setFormName(playlist.name);
    setFormDesc(playlist.description || "");
  };

  const handleUpdatePlaylist = (e) => {
    e.preventDefault();
    if (!formName.trim() || !editingPlaylist) return;
    
    updatePlaylist(editingPlaylist.id, { name: formName, description: formDesc });
    setEditingPlaylist(null);
    setFormName("");
    setFormDesc("");
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm("Delete this playlist? Videos won't be deleted.")) {
      deletePlaylist(playlistId);
      if (selectedPlaylistId === playlistId) {
        setSelectedPlaylistId(null);
      }
    }
  };

  const handleRemoveVideo = (videoId) => {
    if (selectedPlaylistId) {
      removeVideoFromPlaylist(selectedPlaylistId, videoId);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "hsl(var(--background))",
    },
    header: {
      padding: "2rem 0",
      borderBottom: "1px solid hsl(var(--border))",
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    titleIcon: {
      width: "3rem",
      height: "3rem",
      borderRadius: "0.75rem",
      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "hsl(var(--foreground))",
    },
    subtitle: {
      color: "hsl(var(--foreground-secondary))",
      fontSize: "0.9375rem",
    },
    createBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem 1.25rem",
      borderRadius: "0.75rem",
      border: "none",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      fontSize: "0.9375rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "transform 0.15s",
    },
    content: {
      padding: "2rem 0",
    },
    layout: {
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: "2rem",
      minHeight: "500px",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    playlistCard: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem",
      borderRadius: "0.75rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--card))",
      cursor: "pointer",
      transition: "all 0.15s",
    },
    playlistCardActive: {
      borderColor: "hsl(var(--primary))",
      backgroundColor: "hsl(var(--primary) / 0.1)",
    },
    playlistInfo: {
      flex: 1,
      minWidth: 0,
    },
    playlistName: {
      fontWeight: 500,
      color: "hsl(var(--foreground))",
      marginBottom: "0.125rem",
    },
    playlistMeta: {
      fontSize: "0.8125rem",
      color: "hsl(var(--foreground-secondary))",
    },
    playlistActions: {
      display: "flex",
      gap: "0.25rem",
    },
    actionBtn: {
      padding: "0.375rem",
      borderRadius: "0.375rem",
      border: "none",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground-secondary))",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    mainArea: {
      backgroundColor: "hsl(var(--card))",
      borderRadius: "1rem",
      border: "1px solid hsl(var(--border))",
      padding: "1.5rem",
    },
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      textAlign: "center",
      color: "hsl(var(--foreground-secondary))",
    },
    emptyIcon: {
      width: "4rem",
      height: "4rem",
      marginBottom: "1rem",
      opacity: 0.4,
    },
    videoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
    },
    playlistHeader: {
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid hsl(var(--border))",
    },
    playlistHeaderTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
    },
    playlistHeaderMeta: {
      fontSize: "0.875rem",
      color: "hsl(var(--foreground-secondary))",
      marginTop: "0.25rem",
    },
    // Modal styles
    modalOverlay: {
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
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    },
    modalHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.25rem 1.5rem",
      borderBottom: "1px solid hsl(var(--border))",
    },
    modalTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
    },
    modalCloseBtn: {
      padding: "0.5rem",
      borderRadius: "0.5rem",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: "hsl(var(--foreground-secondary))",
      display: "flex",
    },
    modalBody: {
      padding: "1.5rem",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.375rem",
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
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
    textarea: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.9375rem",
      minHeight: "80px",
      resize: "vertical",
    },
    modalActions: {
      display: "flex",
      gap: "0.75rem",
      marginTop: "1.5rem",
    },
    cancelBtn: {
      flex: 1,
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
      fontSize: "0.9375rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    submitBtn: {
      flex: 1,
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "none",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      fontSize: "0.9375rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    videoCardWrapper: {
      position: "relative",
    },
    removeVideoBtn: {
      position: "absolute",
      top: "0.5rem",
      right: "0.5rem",
      padding: "0.5rem",
      borderRadius: "0.5rem",
      backgroundColor: "hsl(var(--destructive))",
      color: "white",
      border: "none",
      cursor: "pointer",
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0,
      transition: "opacity 0.15s",
    },
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <section className="section" style={{ paddingTop: "8rem", textAlign: "center" }}>
          <div className="container">
            <h1 style={{ marginBottom: "1rem" }}>My Playlists</h1>
            <p style={{ color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem" }}>
              Please log in to create and manage your personal playlists.
            </p>
            <Link to="/login" className="btn btn-primary btn-md">
              Log In
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={styles.page}>
        {/* Header */}
        <section style={styles.header}>
          <div className="container">
            <div style={styles.headerContent}>
              <div style={styles.titleRow}>
                <div style={styles.titleIcon}>
                  <PlaylistIcon />
                </div>
                <div>
                  <h1 style={styles.title}>My Playlists</h1>
                  <p style={styles.subtitle}>
                    {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button 
                style={styles.createBtn}
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon />
                New Playlist
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={styles.content}>
          <div className="container">
            {playlists.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <PlaylistIcon />
                </div>
                <h3 style={{ marginBottom: "0.5rem", color: "hsl(var(--foreground))" }}>
                  No playlists yet
                </h3>
                <p style={{ marginBottom: "1.5rem" }}>
                  Create your first playlist to organize your favorite videos.
                </p>
                <button
                  style={styles.createBtn}
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon />
                  Create Playlist
                </button>
              </div>
            ) : (
              <div style={styles.layout}>
                {/* Sidebar - Playlist List */}
                <div style={styles.sidebar}>
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      style={{
                        ...styles.playlistCard,
                        ...(selectedPlaylistId === playlist.id ? styles.playlistCardActive : {}),
                      }}
                      onClick={() => setSelectedPlaylistId(playlist.id)}
                    >
                      <div style={styles.playlistInfo}>
                        <p style={styles.playlistName}>{playlist.name}</p>
                        <p style={styles.playlistMeta}>
                          {playlist.videoIds.length} video{playlist.videoIds.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div style={styles.playlistActions}>
                        <button
                          style={styles.actionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPlaylist(playlist);
                          }}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          style={styles.actionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlaylist(playlist.id);
                          }}
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  ))}
                </div>

                {/* Main Area - Selected Playlist Videos */}
                <div style={styles.mainArea}>
                  {selectedPlaylist ? (
                    <>
                      <div style={styles.playlistHeader}>
                        <h2 style={styles.playlistHeaderTitle}>
                          {selectedPlaylist.name}
                        </h2>
                        {selectedPlaylist.description && (
                          <p style={styles.playlistHeaderMeta}>
                            {selectedPlaylist.description}
                          </p>
                        )}
                        <p style={styles.playlistHeaderMeta}>
                          {selectedPlaylist.videoCount} video{selectedPlaylist.videoCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {selectedPlaylist.videos.length > 0 ? (
                        <div style={styles.videoGrid}>
                          {selectedPlaylist.videos.map((video) => (
                            <div 
                              key={video.id} 
                              style={styles.videoCardWrapper}
                              className="video-card-wrapper"
                            >
                              <button
                                style={styles.removeVideoBtn}
                                className="remove-video-btn"
                                onClick={() => handleRemoveVideo(video.id)}
                                title="Remove from playlist"
                              >
                                <CloseIcon />
                              </button>
                              <VideoCard video={video} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={styles.emptyState}>
                          <p>This playlist is empty</p>
                          <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                            Add videos from any video page
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={styles.emptyState}>
                      <p>Select a playlist to view its videos</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPlaylist) && (
        <div 
          style={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setEditingPlaylist(null);
              setFormName("");
              setFormDesc("");
            }
          }}
        >
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingPlaylist ? "Edit Playlist" : "Create Playlist"}
              </h3>
              <button
                style={styles.modalCloseBtn}
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPlaylist(null);
                  setFormName("");
                  setFormDesc("");
                }}
              >
                <CloseIcon />
              </button>
            </div>
            <form 
              style={styles.modalBody}
              onSubmit={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
            >
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="My awesome playlist"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description (optional)</label>
                <textarea
                  style={styles.textarea}
                  placeholder="What's this playlist about?"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPlaylist(null);
                    setFormName("");
                    setFormDesc("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={!formName.trim()}
                >
                  {editingPlaylist ? "Save Changes" : "Create Playlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .video-card-wrapper:hover .remove-video-btn {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .video-card-wrapper .remove-video-btn {
            opacity: 1;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default UserPlaylistsPage;
