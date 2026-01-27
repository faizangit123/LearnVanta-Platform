import React, { useState, useEffect } from "react";
import { getChaptersForForm, getAllVideos } from "../../services/videoManagementService.js";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
  </svg>
);

const GripIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);

const PlaylistFormModal = ({ isOpen, onClose, onSubmit, playlist, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    chapterId: "",
    videoIds: [],
    isPublic: true,
  });
  const [errors, setErrors] = useState({});
  const [chapters, setChapters] = useState([]);
  const [availableVideos, setAvailableVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");

  useEffect(() => {
    setChapters(getChaptersForForm());
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const videos = await getAllVideos();
    setAvailableVideos(videos);
  };

  useEffect(() => {
    if (playlist) {
      setFormData({
        title: playlist.title || "",
        description: playlist.description || "",
        thumbnail: playlist.thumbnail || "",
        chapterId: playlist.chapterId || "",
        videoIds: playlist.videoIds || [],
        isPublic: playlist.isPublic !== false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        chapterId: "",
        videoIds: [],
        isPublic: true,
      });
    }
    setErrors({});
    setSelectedVideoId("");
  }, [playlist, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddVideo = () => {
    if (selectedVideoId && !formData.videoIds.includes(selectedVideoId)) {
      setFormData(prev => ({
        ...prev,
        videoIds: [...prev.videoIds, selectedVideoId],
      }));
      setSelectedVideoId("");
    }
  };

  const handleRemoveVideo = (videoId) => {
    setFormData(prev => ({
      ...prev,
      videoIds: prev.videoIds.filter(id => id !== videoId),
    }));
  };

  const handleMoveVideo = (index, direction) => {
    const newVideoIds = [...formData.videoIds];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newVideoIds.length) return;
    
    [newVideoIds[index], newVideoIds[newIndex]] = [newVideoIds[newIndex], newVideoIds[index]];
    setFormData(prev => ({ ...prev, videoIds: newVideoIds }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Playlist title is required";
    if (formData.videoIds.length === 0) newErrors.videos = "Add at least one video";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const getVideoTitle = (videoId) => {
    const video = availableVideos.find(v => v.id === videoId);
    return video?.title || videoId;
  };

  const videosNotInPlaylist = availableVideos.filter(
    v => !formData.videoIds.includes(v.id)
  );

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    },
    modal: {
      backgroundColor: "hsl(var(--card))",
      borderRadius: "0.75rem",
      width: "100%",
      maxWidth: "700px",
      maxHeight: "90vh",
      overflow: "auto",
      border: "1px solid hsl(var(--border))",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.25rem 1.5rem",
      borderBottom: "1px solid hsl(var(--border))",
    },
    headerTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
    },
    closeBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "hsl(var(--muted-foreground))",
      padding: "0.25rem",
      borderRadius: "0.375rem",
      display: "flex",
    },
    body: {
      padding: "1.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
    },
    input: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      outline: "none",
    },
    inputError: {
      borderColor: "hsl(var(--destructive))",
    },
    textarea: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      outline: "none",
      resize: "vertical",
      minHeight: "80px",
    },
    select: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      outline: "none",
      flex: 1,
    },
    error: {
      fontSize: "0.75rem",
      color: "hsl(var(--destructive))",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    checkbox: {
      width: "1rem",
      height: "1rem",
      accentColor: "hsl(var(--primary))",
    },
    videoSection: {
      backgroundColor: "hsl(var(--muted))",
      borderRadius: "0.5rem",
      padding: "1rem",
    },
    videoAddRow: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    addBtn: {
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "none",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    videoList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      maxHeight: "200px",
      overflow: "auto",
    },
    videoItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.5rem 0.75rem",
      backgroundColor: "hsl(var(--background))",
      borderRadius: "0.375rem",
      border: "1px solid hsl(var(--border))",
    },
    videoOrder: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    orderBtn: {
      padding: "2px 4px",
      background: "none",
      border: "1px solid hsl(var(--border))",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "0.625rem",
      color: "hsl(var(--muted-foreground))",
    },
    videoNumber: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      fontWeight: 600,
      flexShrink: 0,
    },
    videoTitle: {
      flex: 1,
      fontSize: "0.8125rem",
      color: "hsl(var(--foreground))",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    removeBtn: {
      padding: "0.25rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "hsl(var(--destructive))",
      display: "flex",
    },
    emptyList: {
      textAlign: "center",
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
      padding: "1rem",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.75rem",
      padding: "1.25rem 1.5rem",
      borderTop: "1px solid hsl(var(--border))",
    },
    cancelBtn: {
      padding: "0.75rem 1.25rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    submitBtn: {
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: "pointer",
      opacity: isLoading ? 0.6 : 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>{playlist ? "Edit Playlist" : "Create Playlist"}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={styles.body}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Playlist Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Trigonometry Complete Series"
                style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
              />
              {errors.title && <span style={styles.error}>{errors.title}</span>}
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this playlist..."
                style={styles.textarea}
              />
            </div>

            {/* Chapter & Thumbnail */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Chapter (optional)</label>
                <select
                  name="chapterId"
                  value={formData.chapterId}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">No specific chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.name} - {chapter.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={styles.input}
                />
              </div>
            </div>

            {/* Videos in Playlist */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Videos in Playlist *</label>
              <div style={styles.videoSection}>
                <div style={styles.videoAddRow}>
                  <select
                    value={selectedVideoId}
                    onChange={(e) => setSelectedVideoId(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select a video to add...</option>
                    {videosNotInPlaylist.map((video) => (
                      <option key={video.id} value={video.id}>
                        {video.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    style={styles.addBtn}
                    onClick={handleAddVideo}
                    disabled={!selectedVideoId}
                  >
                    <PlusIcon />
                  </button>
                </div>

                <div style={styles.videoList}>
                  {formData.videoIds.length > 0 ? (
                    formData.videoIds.map((videoId, index) => (
                      <div key={videoId} style={styles.videoItem}>
                        <div style={styles.videoOrder}>
                          <button
                            type="button"
                            style={styles.orderBtn}
                            onClick={() => handleMoveVideo(index, -1)}
                            disabled={index === 0}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            style={styles.orderBtn}
                            onClick={() => handleMoveVideo(index, 1)}
                            disabled={index === formData.videoIds.length - 1}
                          >
                            ▼
                          </button>
                        </div>
                        <span style={styles.videoNumber}>{index + 1}</span>
                        <span style={styles.videoTitle}>{getVideoTitle(videoId)}</span>
                        <button
                          type="button"
                          style={styles.removeBtn}
                          onClick={() => handleRemoveVideo(videoId)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={styles.emptyList}>No videos added yet. Add videos above.</p>
                  )}
                </div>
                {errors.videos && <span style={styles.error}>{errors.videos}</span>}
              </div>
            </div>

            {/* Public Checkbox */}
            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="isPublic" style={styles.label}>
                Make playlist public
              </label>
            </div>
          </form>
        </div>

        <div style={styles.footer}>
          <button type="button" style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : playlist ? "Update Playlist" : "Create Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistFormModal;
