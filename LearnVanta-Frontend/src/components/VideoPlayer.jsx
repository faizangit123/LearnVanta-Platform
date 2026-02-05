import React, { useState, useRef, useEffect, useCallback } from "react";

// Icons
const KeyboardIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M6 16h12"/></svg>;
const PlaySmallIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const ArrowLeftIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const ArrowRightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const ArrowUpIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
const ArrowDownIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;

const ShortcutsOverlay = ({ isVisible }) => {
  if (!isVisible) return null;
  const shortcuts = [
    { key: "Space", icon: <PlaySmallIcon />, label: "Play/Pause" },
    { key: "←", icon: <ArrowLeftIcon />, label: "Rewind 5s" },
    { key: "→", icon: <ArrowRightIcon />, label: "Forward 5s" },
    { key: "↑", icon: <ArrowUpIcon />, label: "Volume Up" },
    { key: "↓", icon: <ArrowDownIcon />, label: "Volume Down" },
  ];
  return (
    <div className="shortcuts-overlay">
      <div className="shortcuts-header"><KeyboardIcon /><span>Keyboard Shortcuts</span></div>
      <div className="shortcuts-list">
        {shortcuts.map((s) => <div key={s.key} className="shortcut-item"><kbd className="shortcut-key">{s.key}</kbd><span className="shortcut-label">{s.label}</span></div>)}
      </div>
    </div>
  );
};

const PlayCircleIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>;
const ErrorIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

const VideoPlayer = ({ video, getVideoEmbedUrl, initialTime = 0, onTimeUpdate }) => {
  const type = video.videoType || video.video_type;
const url = video.videoUrl || video.video_url;

  const [hasError, setHasError] = useState(false);
  const [hasSetInitialTime, setHasSetInitialTime] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current && initialTime > 0 && !hasSetInitialTime) {
      videoRef.current.currentTime = initialTime;
      setHasSetInitialTime(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) onTimeUpdate(videoRef.current.currentTime, videoRef.current.duration);
  };

  const handleKeyDown = useCallback((e) => {
    if (!videoRef.current || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case ' ': e.preventDefault(); videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); setIsPlaying(!videoRef.current.paused); break;
      case 'ArrowLeft': e.preventDefault(); videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5); break;
      case 'ArrowRight': e.preventDefault(); videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5); break;
      case 'ArrowUp': e.preventDefault(); videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1); break;
      case 'ArrowDown': e.preventDefault(); videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1); break;
      default: break;
    }
  }, []);

  useEffect(() => {
    if (type === "direct" && url) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [type, url, handleKeyDown]);

  useEffect(() => { setHasSetInitialTime(false); }, [video.id]);

  if (type === "direct" && url) {
    return (
      <div className="video-player-wrapper video-player-with-shortcuts" onMouseEnter={() => setShowShortcuts(true)} onMouseLeave={() => setShowShortcuts(false)}>
        <video ref={videoRef} className="video-html5" controls poster={video.thumbnail} onError={() => setHasError(true)} onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate}>
          <source src={url} type="video/mp4" /><source src={url} type="video/webm" />
        </video>
        <ShortcutsOverlay isVisible={showShortcuts} />
        {hasError && <div className="video-error"><ErrorIcon /><p>Unable to load video.</p></div>}
      </div>
    );
  }

  const embedUrl = getVideoEmbedUrl(video);
  if (!embedUrl) return <div className="video-player-wrapper"><div className="video-placeholder"><PlayCircleIcon /><p>Video source not available</p></div></div>;

  return (
    <div className="video-player-wrapper">
      <iframe src={embedUrl} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen className="video-iframe" />
    </div>
  );
};

export default VideoPlayer;