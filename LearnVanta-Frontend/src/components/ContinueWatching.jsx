import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../config/api.js";

// Icons (unchanged)
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ContinueWatching = ({ history, onRemove }) => {
  const [videos, setVideos] = useState([]);
  const [chapters, setChapters] = useState([]);

  // 🔧 FIX: Load from API in real mode
 useEffect(() => {
  const loadData = async () => {
    try {
      const v = await apiRequest("/content/videos/");
      const ch = await apiRequest("/content/chapters/");
      setVideos(v || []);
      setChapters(ch || []);
    } catch {
      setVideos([]);
      setChapters([]);
    }
  };

  loadData();
}, []);


  const continueWatchingItems = history.slice(0, 6);
  if (continueWatchingItems.length === 0) return null;

  const getVideoDetails = (historyItem) =>
    videos.find(v => v.id === historyItem.videoId);

  const formatTimeRemaining = (duration, progress) => {
    if (progress >= 95) return "Completed";
    const parts = duration.split(':');
    let totalSeconds = parts.length === 3
      ? parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
      : parseInt(parts[0]) * 60 + parseInt(parts[1]);
    if (progress === 0) return `${Math.floor(totalSeconds / 60)} min`;
    const remaining = Math.round(totalSeconds * (1 - progress / 100));
    return `${Math.floor(remaining / 60)} min left`;
  };

  return (
    <section className="continue-watching-section">
      <div className="container">
        <div className="continue-watching-header">
          <div className="continue-watching-header-left">
            <div className="continue-watching-icon"><PlayIcon /></div>
            <div>
              <h2>Continue Watching</h2>
              <p>Pick up where you left off</p>
            </div>
          </div>
          <Link to="/continue-watching" className="view-all-link">
            View all <ChevronRightIcon />
          </Link>
        </div>

        <div className="continue-watching-scroll">
          {continueWatchingItems.map((item) => {
            const video = getVideoDetails(item);
            if (!video) return null;
            const chapter = chapters.find(c => c.id === video.chapter?.id || c.id === video.chapterId);

            return (
              <div key={item.videoId} className="group continue-watching-item">
                <Link to={`/video/${item.videoId}`}>
                  <div className="continue-watching-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="continue-watching-overlay">
                      <div className="continue-watching-play-btn"><PlayIcon /></div>
                    </div>

                    <div style={{
                      position: "absolute",
                      bottom: "0.5rem",
                      left: "0.5rem",
                      display: "flex",
                      gap: "0.25rem",
                      color: "#fff",
                      fontSize: "0.75rem",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "var(--radius)"
                    }}>
                      <ClockIcon />
                      {formatTimeRemaining(video.duration, item.progress)}
                    </div>

                    <div className="continue-watching-progress">
                      <div
                        className="continue-watching-progress-bar"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="continue-watching-content">
                    <h4 className="continue-watching-title">{video.title}</h4>
                    <p style={{ fontSize: "0.75rem", color: "hsl(var(--foreground-muted))" }}>
                      {chapter?.name || video.chapterName}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove?.(item.videoId);
                  }}
                  className="continue-watching-remove"
                >
                  <XIcon />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContinueWatching;
