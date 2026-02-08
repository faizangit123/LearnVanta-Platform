import React, { useState, useEffect } from "react";
import { getChaptersForForm } from "../../services/videoManagementService.js";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
  </svg>
);

const VideoFormModal = ({ isOpen, onClose, onSubmit, video, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoType: "youtube",
    youtubeId: "",
    youtubeUrl: "",
    thumbnail: "",
    duration: "",
    chapterId: "",
    tags: "",
    isTrending: false,
  });
  const [errors, setErrors] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
  let mounted = true;

  const loadChapters = async () => {
    try {
      const data = await getChaptersForForm();
      if (mounted) {
        setChapters(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load chapters", err);
      if (mounted) setChapters([]);
    }
  };

  loadChapters();

  return () => {
    mounted = false;
  };
}, []);


  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || "",
        description: video.description || "",
        videoType: video.videoType || "youtube",
        youtubeId: video.youtubeId || "",
        youtubeUrl: video.youtubeUrl || "",
        thumbnail: video.thumbnail || "",
        duration: video.duration || "",
        chapterId: video.chapterId || "",
        tags: video.tags?.join(", ") || "",
        isTrending: video.isTrending || false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        videoType: "youtube",
        youtubeId: "",
        youtubeUrl: "",
        thumbnail: "",
        duration: "",
        chapterId: "",
        tags: "",
        isTrending: false,
      });
    }
    setErrors({});
  }, [video, isOpen]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.chapterId) newErrors.chapterId = "Chapter is required";
    if (formData.videoType === "youtube" && !formData.youtubeId && !formData.youtubeUrl) {
      newErrors.youtubeId = "YouTube ID or URL is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

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
      maxWidth: "600px",
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
          <h2 style={styles.headerTitle}>{video ? "Edit Video" : "Add New Video"}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={styles.body}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Video title"
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
                placeholder="Video description"
                style={styles.textarea}
              />
            </div>

            {/* Chapter Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Chapter *</label>
              <select
                name="chapterId"
                value={formData.chapterId}
                onChange={handleChange}
                style={{ ...styles.select, ...(errors.chapterId ? styles.inputError : {}) }}
              >
                <option value="">Select a chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.name} - {chapter.subjectName}
                  </option>
                ))}
              </select>
              {errors.chapterId && <span style={styles.error}>{errors.chapterId}</span>}
            </div>

            {/* Video Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Video Type</label>
              <select
                name="videoType"
                value={formData.videoType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="direct">Direct URL</option>
                <option value="embed">Embed</option>
              </select>
            </div>

            {/* YouTube ID/URL */}
            {formData.videoType === "youtube" && (
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>YouTube ID</label>
                  <input
                    type="text"
                    name="youtubeId"
                    value={formData.youtubeId}
                    onChange={handleChange}
                    placeholder="e.g., dQw4w9WgXcQ"
                    style={{ ...styles.input, ...(errors.youtubeId ? styles.inputError : {}) }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>or YouTube URL</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    style={styles.input}
                  />
                </div>
              </div>
            )}
            {errors.youtubeId && <span style={styles.error}>{errors.youtubeId}</span>}

            {/* Duration and Thumbnail */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 45:30"
                  style={styles.input}
                />
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

            {/* Tags */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Class 10, Mathematics, NCERT"
                style={styles.input}
              />
            </div>

            {/* Trending Checkbox */}
            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="isTrending"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="isTrending" style={styles.label}>
                Mark as Trending
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
            {isLoading ? "Saving..." : video ? "Update Video" : "Create Video"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFormModal;
