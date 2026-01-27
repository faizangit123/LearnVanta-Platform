import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { formatViews, formatDate } from "../data/mockData.js";

// Icons
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const VideoCard = ({ 
  video, 
  chapter, 
  isFavorite, 
  onFavoriteClick, 
  progress = 0,
  index = 0,
  showPreview = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const previewIntervalRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (showPreview) {
      let progress = 0;
      previewIntervalRef.current = setInterval(() => {
        progress += 2;
        if (progress > 100) progress = 0;
        setPreviewProgress(progress);
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPreviewProgress(0);
    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(video);
  };

  const isWatched = progress >= 90;

  return (
    <Link
      to={`/video/${video.id}`}
      className="group card card-interactive video-card animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div className="video-thumbnail">
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{ 
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.5s ease"
          }}
        />
        
        {/* Hover overlay with gradient */}
        <div 
          className="video-overlay"
          style={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Preview progress indicator */}
        {showPreview && isHovered && (
          <div style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            right: "3rem",
            height: "4px",
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "9999px",
            overflow: "hidden"
          }}>
            <div 
              style={{ 
                height: "100%", 
                background: "hsl(var(--primary))",
                transition: "all 100ms",
                width: `${previewProgress}%`
              }}
            />
          </div>
        )}
        
        {/* Play button on hover */}
        <div 
          className="video-play-btn"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <div 
            className="video-play-icon"
            style={{ transform: isHovered ? "scale(1)" : "scale(0.75)" }}
          >
            <PlayIcon />
          </div>
        </div>
        {/* Duration badge */}
        <span className="video-duration">
          {video.duration}
        </span>

        {/* Trending badge */}
        {video.isTrending && !isWatched && (
          <span style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "var(--radius-sm)",
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            fontSize: "0.75rem",
            fontWeight: 500
          }}>
            🔥 Trending
          </span>
        )}
        
        {/* Watched badge */}
        {isWatched && (
          <span style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "var(--radius-sm)",
            background: "hsl(var(--success))",
            color: "hsl(var(--success-foreground))",
            fontSize: "0.75rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            <CheckCircleIcon />
            Watched
          </span>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms",
            background: isFavorite ? "#ef4444" : "rgba(0, 0, 0, 0.5)",
            color: "#fff",
            opacity: isFavorite || isHovered ? 1 : 0,
            border: "none",
            cursor: "pointer"
          }}
        >
          <HeartIcon filled={isFavorite} />
        </button>
        
        {/* Watch Progress Bar */}
        {progress > 0 && (
          <div className="video-progress-bar">
            <div 
              className="video-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="video-content">
        <h3 className="video-title">
          {video.title}
        </h3>
        <p style={{ 
          fontSize: "0.875rem", 
          color: "hsl(var(--foreground-secondary))",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: "0.75rem"
        }}>
          {video.description}
        </p>
        <div className="video-meta">
          <span className="video-meta-item">
            <EyeIcon />
            {formatViews(video.views)}
          </span>
          <span className="video-meta-item">
            <ClockIcon />
            {formatDate(video.publishedAt)}
          </span>
        </div>
        <div className="video-tags">
          <span className="badge badge-primary">
            {chapter?.name || video.chapterName}
          </span>
          {video.videoType && (
            <span style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "9999px",
              background: "hsl(var(--secondary))",
              color: "hsl(var(--secondary-foreground))",
              fontSize: "0.75rem",
              textTransform: "capitalize"
            }}>
              {video.videoType}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;