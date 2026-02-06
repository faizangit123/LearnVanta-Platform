import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatViews } from "./utils/format.js";


// Icons
const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const VimeoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.9765 6.4168c-.105 2.338-1.739 5.5432-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132L0 7.0298c1.1819-1.0378 2.3439-2.0778 3.4959-3.1138 1.58-1.362 2.769-2.099 3.576-2.201 1.88-.183 3.0379 1.103 3.4779 3.859.47 2.962.79 4.8 .97 5.5138.54 2.449 1.13 3.6718 1.78 3.6718.51 0 1.26-.802 2.27-2.405 1.0-1.6098 1.54-2.8378 1.6-3.685.14-1.399-.403-2.099-1.63-2.099-.58 0-1.18.133-1.79.398 1.18-3.869 3.45-5.7508 6.82-5.6508 2.5.074 3.68 1.693 3.54 4.853z"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const getVideoTypeBadge = (videoType) => {
  switch (videoType) {
    case "youtube":
      return { icon: <YoutubeIcon />, className: "badge-youtube" };
    case "vimeo":
      return { icon: <VimeoIcon />, className: "badge-vimeo" };
    default:
      return { icon: <VideoIcon />, className: "badge-default" };
  }
};

const VideoSidebar = ({ 
  currentVideo, 
  playlist, 
  playlistVideos, 
  relatedVideos, 
  chapterVideos,
  chapter 
}) => {
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(true);
  const hasPlaylist = playlist && playlistVideos && playlistVideos.length > 0;

  const styles = {
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    sectionTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
      marginBottom: "0.75rem",
    },
    // Playlist Styles
    playlistContainer: {
      backgroundColor: "hsl(var(--card))",
      borderRadius: "0.75rem",
      border: "1px solid hsl(var(--border))",
      overflow: "hidden",
    },
    playlistHeader: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem",
      backgroundColor: "hsl(var(--muted))",
      cursor: "pointer",
      userSelect: "none",
    },
    playlistIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      borderRadius: "0.5rem",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
    },
    playlistInfo: {
      flex: 1,
      minWidth: 0,
    },
    playlistTitle: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    playlistMeta: {
      fontSize: "0.75rem",
      color: "hsl(var(--muted-foreground))",
    },
    playlistToggle: {
      display: "flex",
      alignItems: "center",
      color: "hsl(var(--muted-foreground))",
    },
    playlistVideos: {
      maxHeight: isPlaylistExpanded ? "400px" : "0",
      overflow: "auto",
      transition: "max-height 0.3s ease",
    },
    playlistVideo: {
      display: "flex",
      gap: "0.75rem",
      padding: "0.75rem 1rem",
      textDecoration: "none",
      transition: "background-color 0.15s ease",
      borderBottom: "1px solid hsl(var(--border) / 0.5)",
    },
    playlistVideoActive: {
      backgroundColor: "hsl(var(--primary) / 0.1)",
    },
    playlistVideoNumber: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      fontSize: "0.75rem",
      fontWeight: 500,
      color: "hsl(var(--muted-foreground))",
      flexShrink: 0,
    },
    playlistVideoNumberActive: {
      color: "hsl(var(--primary))",
    },
    playlistVideoThumb: {
      position: "relative",
      width: "80px",
      height: "45px",
      borderRadius: "0.375rem",
      overflow: "hidden",
      flexShrink: 0,
      backgroundColor: "hsl(var(--muted))",
    },
    playlistVideoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    playlistVideoDuration: {
      position: "absolute",
      bottom: "2px",
      right: "2px",
      backgroundColor: "rgba(0,0,0,0.8)",
      color: "white",
      fontSize: "0.625rem",
      padding: "1px 4px",
      borderRadius: "2px",
    },
    playlistVideoInfo: {
      flex: 1,
      minWidth: 0,
    },
    playlistVideoTitle: {
      fontSize: "0.8125rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
      lineHeight: 1.3,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    playlistVideoTitleActive: {
      color: "hsl(var(--primary))",
    },
    // Related Videos Section
    relatedSection: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    relatedCard: {
      display: "flex",
      gap: "0.75rem",
      padding: "0.5rem",
      borderRadius: "0.5rem",
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      textDecoration: "none",
      transition: "all 0.15s ease",
    },
    relatedThumb: {
      position: "relative",
      width: "140px",
      height: "78px",
      borderRadius: "0.375rem",
      overflow: "hidden",
      flexShrink: 0,
      backgroundColor: "hsl(var(--muted))",
    },
    relatedImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    relatedDuration: {
      position: "absolute",
      bottom: "4px",
      right: "4px",
      backgroundColor: "rgba(0,0,0,0.85)",
      color: "white",
      fontSize: "0.6875rem",
      padding: "2px 5px",
      borderRadius: "3px",
      fontWeight: 500,
    },
    relatedBadge: {
      position: "absolute",
      top: "4px",
      left: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      borderRadius: "4px",
      backgroundColor: "rgba(0,0,0,0.75)",
    },
    relatedInfo: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    relatedTitle: {
      fontSize: "0.8125rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
      lineHeight: 1.3,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    relatedMeta: {
      fontSize: "0.75rem",
      color: "hsl(var(--muted-foreground))",
    },
    // No content
    noContent: {
      fontSize: "0.875rem",
      color: "hsl(var(--muted-foreground))",
      textAlign: "center",
      padding: "1rem",
    },
    // Chapter Link
    chapterLink: {
      display: "block",
      marginTop: "0.5rem",
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      backgroundColor: "hsl(var(--secondary))",
      color: "hsl(var(--foreground))",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "0.875rem",
      fontWeight: 500,
      transition: "background-color 0.15s ease",
    },
  };

  const currentVideoIndex = hasPlaylist 
    ? playlistVideos.findIndex(v => v.id === currentVideo?.id)
    : -1;

  return (
    <aside style={styles.sidebar}>
      {/* Playlist Section */}
      {hasPlaylist && (
        <div style={styles.playlistContainer}>
          <div 
            style={styles.playlistHeader}
            onClick={() => setIsPlaylistExpanded(!isPlaylistExpanded)}
          >
            <div style={styles.playlistIcon}>
              <ListIcon />
            </div>
            <div style={styles.playlistInfo}>
              <div style={styles.playlistTitle}>{playlist.title}</div>
              <div style={styles.playlistMeta}>
                {currentVideoIndex + 1} / {playlistVideos.length} videos
              </div>
            </div>
            <div style={styles.playlistToggle}>
              {isPlaylistExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </div>
          </div>
          
          <div style={styles.playlistVideos}>
            {playlistVideos.map((video, index) => {
              const isActive = video.id === currentVideo?.id;
              const badge = getVideoTypeBadge(video.videoType);
              return (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  style={{
                    ...styles.playlistVideo,
                    ...(isActive ? styles.playlistVideoActive : {}),
                  }}
                >
                  <div style={{
                    ...styles.playlistVideoNumber,
                    ...(isActive ? styles.playlistVideoNumberActive : {}),
                  }}>
                    {isActive ? <PlayIcon /> : index + 1}
                  </div>
                  <div style={styles.playlistVideoThumb}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={styles.playlistVideoImg}
                    />
                    <span style={styles.playlistVideoDuration}>{video.duration}</span>
                  </div>
                  <div style={styles.playlistVideoInfo}>
                    <div style={{
                      ...styles.playlistVideoTitle,
                      ...(isActive ? styles.playlistVideoTitleActive : {}),
                    }}>
                      {video.title}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Videos Section */}
      <div style={styles.relatedSection}>
        <h3 style={styles.sectionTitle}>
          {hasPlaylist ? "You might also like" : "More from this Chapter"}
        </h3>
        
        {relatedVideos && relatedVideos.length > 0 ? (
          relatedVideos.map((video) => {
            const badge = getVideoTypeBadge(video.videoType);
            return (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                style={styles.relatedCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(var(--muted))";
                  e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(var(--card))";
                  e.currentTarget.style.borderColor = "hsl(var(--border))";
                }}
              >
                <div style={styles.relatedThumb}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={styles.relatedImg}
                  />
                  <span style={styles.relatedDuration}>{video.duration}</span>
                  <span style={styles.relatedBadge} className={badge.className}>
                    {badge.icon}
                  </span>
                </div>
                <div style={styles.relatedInfo}>
                  <div style={styles.relatedTitle}>{video.title}</div>
                  <div style={styles.relatedMeta}>{formatViews(video.views)} views</div>
                </div>
              </Link>
            );
          })
        ) : chapterVideos && chapterVideos.length > 0 ? (
          chapterVideos.map((video) => {
            const badge = getVideoTypeBadge(video.videoType);
            return (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                style={styles.relatedCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(var(--muted))";
                  e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(var(--card))";
                  e.currentTarget.style.borderColor = "hsl(var(--border))";
                }}
              >
                <div style={styles.relatedThumb}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={styles.relatedImg}
                  />
                  <span style={styles.relatedDuration}>{video.duration}</span>
                  <span style={styles.relatedBadge} className={badge.className}>
                    {badge.icon}
                  </span>
                </div>
                <div style={styles.relatedInfo}>
                  <div style={styles.relatedTitle}>{video.title}</div>
                  <div style={styles.relatedMeta}>{formatViews(video.views)} views</div>
                </div>
              </Link>
            );
          })
        ) : (
          <p style={styles.noContent}>No related videos yet.</p>
        )}
      </div>

      {/* View All Chapter Videos */}
      {chapter && (
        <Link to={`/chapter/${chapter.id}`} style={styles.chapterLink}>
          View All Chapter Videos
        </Link>
      )}

      <style>{`
        .badge-youtube { color: #ff0000; }
        .badge-vimeo { color: #1ab7ea; }
        .badge-default { color: hsl(var(--muted-foreground)); }
      `}</style>
    </aside>
  );
};

export default VideoSidebar;
