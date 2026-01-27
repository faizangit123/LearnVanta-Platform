import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout/index.js";
import { useWatchHistory } from "../hooks/useWatchHistory.js";
import { videos as allVideos, chapters } from "../data/mockData.js";

// Icons
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const ContinueWatchingPage = () => {
  const { history, isLoading, removeFromHistory } = useWatchHistory();

  // Show ALL watched videos (no filter)
  const continueWatchingItems = history;

  const getVideoDetails = (historyItem) => {
    return allVideos.find((v) => v.id === historyItem.videoId);
  };

  const getStatusInfo = (progress) => {
    if (progress >= 95) return { label: "Completed", badge: "✓ Completed", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.1)" };
    if (progress > 0) return { label: `${progress}% complete`, badge: "In Progress", color: "hsl(var(--primary))", bgColor: "hsla(var(--primary), 0.1)" };
    return { label: "Not started", badge: "New", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)" };
  };

  const formatTimeRemaining = (duration, progress) => {
    const parts = duration.split(":");
    let totalSeconds;
    if (parts.length === 3) {
      totalSeconds =
        parseInt(parts[0]) * 3600 +
        parseInt(parts[1]) * 60 +
        parseInt(parts[2]);
    } else {
      totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    
    if (progress >= 95) return "Completed";
    if (progress === 0) return `${Math.floor(totalSeconds / 60)} min`;
    
    const remaining = Math.round(totalSeconds * (1 - progress / 100));
    const mins = Math.floor(remaining / 60);
    return `${mins} min left`;
  };

  const styles = {
    page: {
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "2rem",
    },
    headerTop: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    backBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "var(--radius)",
      backgroundColor: "hsl(var(--secondary))",
      color: "hsl(var(--foreground))",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    iconWrapper: {
      width: "3.5rem",
      height: "3.5rem",
      borderRadius: "var(--radius-lg)",
      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    headerText: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "hsl(var(--foreground))",
      margin: 0,
    },
    subtitle: {
      color: "hsl(var(--foreground-secondary))",
      fontSize: "0.875rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "1.5rem",
    },
    card: {
      position: "relative",
      backgroundColor: "hsl(var(--card))",
      borderRadius: "var(--radius-lg)",
      border: "1px solid hsl(var(--border))",
      overflow: "hidden",
      transition: "all 0.3s ease",
    },
    cardLink: {
      display: "block",
      textDecoration: "none",
      color: "inherit",
    },
    thumbnail: {
      position: "relative",
      aspectRatio: "16/9",
      overflow: "hidden",
    },
    thumbnailImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    playBtn: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(0.8)",
      width: "4rem",
      height: "4rem",
      borderRadius: "50%",
      backgroundColor: "hsl(var(--primary))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      opacity: 0,
      transition: "all 0.3s ease",
    },
    timeRemaining: {
      position: "absolute",
      bottom: "0.75rem",
      left: "0.75rem",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem",
      padding: "0.375rem 0.625rem",
      borderRadius: "var(--radius)",
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      color: "#fff",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    progressBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "4px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
      transition: "width 0.3s ease",
    },
    content: {
      padding: "1rem",
    },
    videoTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "hsl(var(--foreground))",
      marginBottom: "0.375rem",
      lineHeight: "1.4",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    chapterName: {
      fontSize: "0.813rem",
      color: "hsl(var(--foreground-secondary))",
    },
    progressText: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "0.75rem",
      fontSize: "0.75rem",
      color: "hsl(var(--foreground-muted))",
    },
    removeBtn: {
      position: "absolute",
      top: "0.75rem",
      right: "0.75rem",
      width: "2rem",
      height: "2rem",
      borderRadius: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      opacity: 0,
      transition: "all 0.2s ease",
      zIndex: 10,
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem 2rem",
    },
    emptyIcon: {
      width: "5rem",
      height: "5rem",
      margin: "0 auto 1.5rem",
      borderRadius: "50%",
      backgroundColor: "hsl(var(--secondary))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "hsl(var(--foreground-muted))",
    },
    emptyTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "hsl(var(--foreground))",
      marginBottom: "0.5rem",
    },
    emptyText: {
      color: "hsl(var(--foreground-secondary))",
      marginBottom: "1.5rem",
    },
  };

  return (
    <MainLayout>
      <section className="section" style={styles.page}>
        <div className="container">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerTop}>
              <Link to="/" style={styles.backBtn} className="back-btn-hover">
                <ArrowLeftIcon />
              </Link>
              <div style={styles.headerContent}>
                <div style={styles.iconWrapper}>
                  <HistoryIcon />
                </div>
                <div style={styles.headerText}>
                  <h1 style={styles.title}>Continue Watching</h1>
                  <p style={styles.subtitle}>
                    {continueWatchingItems.length > 0
                      ? `${continueWatchingItems.length} video${continueWatchingItems.length > 1 ? "s" : ""} in your watch history`
                      : "Your watched videos will appear here"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div style={styles.grid} className="continue-watching-page-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-thumbnail"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : continueWatchingItems.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <PlayIcon />
              </div>
              <h3 style={styles.emptyTitle}>No watched videos yet</h3>
              <p style={styles.emptyText}>
                Start watching any video and it will appear here for easy access.
              </p>
              <Link to="/videos" className="btn btn-primary btn-md btn-rounded">
                Browse Videos
              </Link>
            </div>
          ) : (
            <div style={styles.grid} className="continue-watching-page-grid">
              {continueWatchingItems.map((item) => {
                const video = getVideoDetails(item);
                if (!video) return null;
                const chapter = chapters.find((c) => c.id === video.chapterId);
                const statusInfo = getStatusInfo(item.progress);

                return (
                  <div
                    key={item.videoId}
                    style={styles.card}
                    className="continue-card"
                  >
                    <Link
                      to={`/video/${item.videoId}`}
                      style={styles.cardLink}
                    >
                      <div style={styles.thumbnail}>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          style={styles.thumbnailImg}
                          className="continue-card-img"
                        />
                        <div style={styles.overlay} className="continue-card-overlay"></div>
                        <div style={styles.playBtn} className="continue-card-play">
                          <PlayIcon />
                        </div>
                        
                        {/* Status badge */}
                        <div style={{
                          position: "absolute",
                          top: "0.75rem",
                          left: "0.75rem",
                          padding: "0.25rem 0.625rem",
                          borderRadius: "var(--radius)",
                          backgroundColor: statusInfo.color,
                          color: "#fff",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          zIndex: 5
                        }}>
                          {statusInfo.badge}
                        </div>
                        
                        <div style={styles.timeRemaining}>
                          <ClockIcon />
                          {formatTimeRemaining(video.duration, item.progress)}
                        </div>
                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${Math.max(item.progress, 0)}%`,
                              background: item.progress >= 95 
                                ? "#22c55e" 
                                : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))"
                            }}
                          ></div>
                        </div>
                      </div>
                      <div style={styles.content}>
                        <h3 style={styles.videoTitle}>{video.title}</h3>
                        <p style={styles.chapterName}>
                          {chapter?.name || video.chapterName}
                        </p>
                        <div style={styles.progressText}>
                          <span style={{ color: statusInfo.color }}>{statusInfo.label}</span>
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromHistory(item.videoId);
                      }}
                      style={styles.removeBtn}
                      className="continue-card-remove"
                      title="Remove from list"
                    >
                      <XIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .continue-watching-page-grid {
          grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 640px) {
          .continue-watching-page-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .continue-watching-page-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .continue-watching-page-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .continue-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: hsl(var(--primary) / 0.3);
        }
        
        .continue-card:hover .continue-card-img {
          transform: scale(1.05);
        }
        
        .continue-card:hover .continue-card-overlay {
          opacity: 1;
        }
        
        .continue-card:hover .continue-card-play {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .continue-card:hover .continue-card-remove {
          opacity: 1;
        }
        
        .continue-card-remove:hover {
          background-color: hsl(var(--destructive)) !important;
        }
        
        .back-btn-hover:hover {
          background-color: hsl(var(--secondary-hover));
        }
        
        /* Skeleton loading styles */
        .skeleton-card {
          background: hsl(var(--card));
          border-radius: var(--radius-lg);
          border: 1px solid hsl(var(--border));
          overflow: hidden;
        }
        
        .skeleton-thumbnail {
          aspect-ratio: 16/9;
          background: linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--secondary-hover)) 50%, hsl(var(--secondary)) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        .skeleton-content {
          padding: 1rem;
        }
        
        .skeleton-line {
          height: 1rem;
          background: hsl(var(--secondary));
          border-radius: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        .skeleton-line.short {
          width: 60%;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </MainLayout>
  );
};

export default ContinueWatchingPage;
