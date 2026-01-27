import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMiniPlayer } from "../context/MiniPlayerContext";
import { getVideoEmbedUrl } from "../data/mockData";

// Icons
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MaximizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const MiniPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { miniPlayerVideo, currentTime, isMinimized, closeMiniPlayer, updateTime } = useMiniPlayer();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasSetTime, setHasSetTime] = useState(false);

  const isOnVideoPage = location.pathname === `/video/${miniPlayerVideo?.id}`;

  useEffect(() => {
    if (videoRef.current && currentTime > 0 && !hasSetTime) {
      videoRef.current.currentTime = currentTime;
      setHasSetTime(true);
    }
  }, [currentTime, hasSetTime]);

  useEffect(() => {
    setHasSetTime(false);
  }, [miniPlayerVideo?.id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      updateTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && currentTime > 0 && !hasSetTime) {
      videoRef.current.currentTime = currentTime;
      setHasSetTime(true);
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleExpand = () => {
    navigate(`/video/${miniPlayerVideo.id}`);
    closeMiniPlayer();
  };

  if (!miniPlayerVideo || !isMinimized || isOnVideoPage) {
    return null;
  }

  if (miniPlayerVideo.videoType !== "direct" || !miniPlayerVideo.videoUrl) {
    return (
      <div className="mini-player">
        <div className="mini-player-content">
          <div className="mini-player-embed-notice">
            <p>Mini player not available for embedded videos</p>
          </div>
          <div className="mini-player-info">
            <span className="mini-player-title">{miniPlayerVideo.title}</span>
          </div>
          <div className="mini-player-controls">
            <button onClick={handleExpand} className="mini-player-btn" title="Expand"><MaximizeIcon /></button>
            <button onClick={closeMiniPlayer} className="mini-player-btn" title="Close"><XIcon /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mini-player">
      <div className="mini-player-content">
        <div className="mini-player-video">
          <video ref={videoRef} src={miniPlayerVideo.videoUrl} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} autoPlay playsInline />
          <button onClick={togglePlay} className="mini-player-play-overlay">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <div className="mini-player-info">
          <span className="mini-player-title">{miniPlayerVideo.title}</span>
        </div>
        <div className="mini-player-controls">
          <button onClick={handleExpand} className="mini-player-btn" title="Expand"><MaximizeIcon /></button>
          <button onClick={closeMiniPlayer} className="mini-player-btn" title="Close"><XIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;