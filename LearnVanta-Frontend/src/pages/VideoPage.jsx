import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "../components/layout";
import VideoPlayer from "../components/VideoPlayer";
import VideoResources from "../components/VideoResources";
import VideoNotes from "../components/VideoNotes";
import VideoSidebar from "../components/VideoSidebar";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import { useFavorites } from "../hooks/useFavorites";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useWatchProgress } from "../hooks/useWatchProgress";
import { useMiniPlayer } from "../context/MiniPlayerContext";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";
import { apiRequest } from "../config/api";

// Icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ThumbsUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const VimeoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.9765 6.4168c-.105 2.338-1.739 5.5432-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132L0 7.0298c1.1819-1.0378 2.3439-2.0778 3.4959-3.1138 1.58-1.362 2.769-2.099 3.576-2.201 1.88-.183 3.0379 1.103 3.4779 3.859.47 2.962.79 4.8 .97 5.5138.54 2.449 1.13 3.6718 1.78 3.6718.51 0 1.26-.802 2.27-2.405 1.0-1.6098 1.54-2.8378 1.6-3.685.14-1.399-.403-2.099-1.63-2.099-.58 0-1.18.133-1.79.398 1.18-3.869 3.45-5.7508 6.82-5.6508 2.5.074 3.68 1.693 3.54 4.853z"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const PipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <rect x="12" y="10" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" />
  </svg>
);

const PlaylistAddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15V6" /><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" />
  </svg>
);

const getVideoTypeBadge = (videoType) => {
  switch (videoType) {
    case "youtube":
      return { icon: <YoutubeIcon />, label: "YouTube", className: "badge-youtube" };
    case "vimeo":
      return { icon: <VimeoIcon />, label: "Vimeo", className: "badge-vimeo" };
    case "direct":
      return { icon: <VideoIcon />, label: "Video", className: "badge-direct" };
    case "embed":
      return { icon: <VideoIcon />, label: "Video", className: "badge-embed" };
    default:
      return { icon: <VideoIcon />, label: "Video", className: "badge-default" };
  }
};

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [subject, setSubject] = useState(null);
  const [classData, setClassData] = useState(null);

useEffect(() => {
  apiRequest(`/content/videos/${videoId}/`)
    .then((data) => {
      setVideo(data);
      setChapter(data.chapter);
      setSubject(data.subject);
      setClassData(data.class_data);
    })
    .catch(() => {
      setVideo(null);
    });
}, [videoId]);

  
  // // Check if video is part of a playlist
  // const playlist = video ? getPlaylistForVideo(video.id) : null;
  // const playlistVideos = playlist ? getPlaylistVideos(playlist.id) : [];
  
  // // Related videos (excludes playlist videos if in playlist)
  // const relatedVideos = video ? getRelatedVideos(video, 5) : [];
  
  // Chapter videos (fallback if no related)
  // const chapterVideos = chapter 
  //   ? getVideosByChapter(chapter.id).filter(v => v.id !== videoId).slice(0, 4)
  //   : [];

  const [isLiked, setIsLiked] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const videoPlayerRef = useRef(null);
  
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useAuthPrompt();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToHistory } = useWatchHistory();
  const { progress, loadProgress, updateProgress, forceUpdateProgress } = useWatchProgress(videoId);
  const { openMiniPlayer } = useMiniPlayer();
  const isVideoFavorite = isFavorite(videoId);

  const handleToggleFavorite = async () => {
  if (!video || !chapter) return;

  await toggleFavorite({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    chapterName: chapter.name,
  });
};

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Add to watch history when video is opened
  useEffect(() => {
    if (video && chapter) {
      addToHistory(video.id);

    }
  }, [videoId, video, chapter]);

  // Handle video time updates (save progress)
  const handleVideoTimeUpdate = (currentTime, duration) => {
    setCurrentVideoTime(currentTime);
    updateProgress(currentTime, duration);
  };

  // Save progress when leaving page
  useEffect(() => {
    return () => {
      if (currentVideoTime > 0) {
        forceUpdateProgress(currentVideoTime, progress.duration || currentVideoTime);
      }
    };
  }, [currentVideoTime, progress.duration]);

  // const handleToggleFavorite = async () => {
  //   if (video && chapter) {
  //     const result = await toggleFavorite({
  //       id: video.id,   
  //       title: video.title,
  //       thumbnail: video.thumbnail,
  //       duration: video.duration,
  //       chapterName: chapter.name,
  //     });
  //     setIsVideoFavorite(result);
  //   }
  // };

  // Handle seeking to a specific time in video (for note timestamps)
  const handleSeekToTime = (timestamp) => {
    // This would need video player integration - for now just scroll to player
    if (videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!video || !chapter || !subject || !classData) {
    return (
      <MainLayout>
        <section className="section">
          <div className="container">
            <div className="not-found-content">
              <h1>Video Not Found</h1>
              <p>The video you're looking for doesn't exist.</p>
              <Link to="/" className="btn btn-primary btn-md">
                Go Home
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  const videoTypeBadge = getVideoTypeBadge(video.video_type);

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/class/${classData.id}`} className="breadcrumb-link">{classData.name}</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/subject/${subject.id}`} className="breadcrumb-link">{subject.name}</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/chapter/${chapter.id}`} className="breadcrumb-link">{chapter.name}</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Video</span>
          </nav>
        </div>
      </section>

      {/* Video Player Section */}
      <section className="video-player-section">
        <div className="container">
          <div className="video-layout">
            {/* Main Video */}
            <div className="video-main" ref={videoPlayerRef}>
              {/* Video Player Component */}
              <VideoPlayer 
               video={video} 
               initialTime={progress.currentTime}
               onTimeUpdate={handleVideoTimeUpdate}

               />
              {/* Video Info */}
              <div className="video-info">
                <div className="video-tags-row">
                  {/* Video Source Badge */}
                  <span className={`badge video-source-badge ${videoTypeBadge.className}`}>
                    {videoTypeBadge.icon}
                    {videoTypeBadge.label}
                  </span>
                  {video.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">{tag}</span>
                  ))}
                </div>
                <h1 className="video-page-title">{video.title}</h1>
                
                <div className="video-stats">
                  <div className="video-stats-left">
                    <span className="stat-item">
                      <EyeIcon />
                      {video.views} views
                    </span>
                    <span className="stat-item">
                      <CalendarIcon />
                      {new Date(video.published_at).toLocaleDateString()}
                    </span>
                    <span className="stat-item">
                      <ClockIcon />
                      {video.duration}
                    </span>
                  </div>
                  <div className="video-stats-right">
                    <button 
                      className={`action-btn ${isLiked ? 'active' : ''}`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <ThumbsUpIcon />
                      <span>{video.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button className="action-btn">
                      <ShareIcon />
                      <span>Share</span>
                    </button>
                    <button 
                      className={`action-btn ${isVideoFavorite ? 'active favorite' : ''}`}
                      onClick={handleToggleFavorite}
                    >
                      <HeartIcon filled={isVideoFavorite} />
                      <span>{isVideoFavorite ? 'Saved' : 'Save'}</span>
                    </button>
                    {video.video_type === "direct" && (
                      <button 
                        className="action-btn"
                        onClick={() => openMiniPlayer(video, currentVideoTime)}
                        title="Mini player"
                      >
                        <PipIcon />
                        <span>Mini</span>
                      </button>
                    )}
                    <button 
                      className="action-btn"
                      onClick={() => {
                        if (!isAuthenticated) {
                          showLoginPrompt("playlists");
                          return;
                        }
                        setShowPlaylistModal(true);
                      }}
                      title="Add to playlist"
                    >
                      <PlaylistAddIcon />
                      <span>Playlist</span>
                    </button>
                  </div>
                </div>

                <div className="video-description-box">
                  <h3>Description</h3>
                  <p>{video.description}</p>
                </div>

                {/* Resources Section */}
                <VideoResources resources={video.resources || []} />

                {/* Notes Section */}
                <VideoNotes
                  videoId={videoId}
                  videoTitle={video.title}
                  currentTime={currentVideoTime}
                  onSeekToTime={() => videoPlayerRef.current?.scrollIntoView()}
                />

                <div className="video-chapter-link">
                  <Link to={`/chapter/${chapter.id}`} className="chapter-link-card card">
                    <div className="chapter-link-icon">
                      <span>{chapter.order}</span>
                    </div>
                    <div className="chapter-link-text">
                      <span className="chapter-link-label">Part of Chapter</span>
                      <span className="chapter-link-name">{chapter.name}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar - Playlist & Related Videos */}
            <VideoSidebar
            currentVideo={video}
            playlist={null}
            playlistVideos={[]}
            relatedVideos={[]}
            chapterVideos={[]}
            chapter={chapter}

            />

          </div>
        </div>
      </section>

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        video={video}
      />
    </MainLayout>
  );
};

export default VideoPage;
