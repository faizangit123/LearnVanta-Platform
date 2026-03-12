import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWatchHistory } from '../hooks/useWatchHistory.js';
import { MainLayout } from '../components/layout';

// Icons
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlayIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const CheckSquareIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const SquareIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
const ChevronRightIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"></path></svg>;
const SparklesIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const RotateCcwIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;

// Skeleton component for loading state
const VideoCardSkeleton = () => (
  <div style={{
    backgroundColor: 'hsl(var(--card))',
    borderRadius: '0.75rem',
    border: '1px solid hsl(var(--border))',
    overflow: 'hidden',
  }}>
    <div style={{
      aspectRatio: '16/9',
      backgroundColor: 'hsl(var(--muted))',
      animation: 'pulse 2s infinite',
    }} />
    <div style={{ padding: '1rem' }}>
      <div style={{
        height: '1rem',
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        animation: 'pulse 2s infinite',
      }} />
      <div style={{
        height: '0.75rem',
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: '0.25rem',
        width: '60%',
        animation: 'pulse 2s infinite',
      }} />
    </div>
  </div>
);

// ============================================
// GROUP BY TIME (uses backend watchedAt)
// ============================================

const groupHistoryByTime = (history) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date(today);
  thisMonth.setMonth(thisMonth.getMonth() - 1);

  const groups = { today: [], yesterday: [], thisWeek: [], thisMonth: [], older: [] };

  history.forEach(item => {
    const watchedDate = new Date(item.watchedAt);
    if (watchedDate >= today) groups.today.push(item);
    else if (watchedDate >= yesterday) groups.yesterday.push(item);
    else if (watchedDate >= thisWeek) groups.thisWeek.push(item);
    else if (watchedDate >= thisMonth) groups.thisMonth.push(item);
    else groups.older.push(item);
  });

  return groups;
};

const GROUP_LABELS = {
  today: { label: 'Today', Icon: CalendarIcon },
  yesterday: { label: 'Yesterday', Icon: CalendarIcon },
  thisWeek: { label: 'This Week', Icon: CalendarIcon },
  thisMonth: { label: 'This Month', Icon: CalendarIcon },
  older: { label: 'Older', Icon: ClockIcon }
};

// Smart suggestion component
const SmartSuggestion = ({ historyItem, allVideos }) => {
  const currentVideo = allVideos.find(v => v.id === historyItem.videoId);
  if (!currentVideo) return null;

  const relatedVideos = allVideos
    .filter(v => v.id !== currentVideo.id && (v.chapterId === currentVideo.chapterId || v.subjectId === currentVideo.subjectId))
    .slice(0, 2);

  if (relatedVideos.length === 0) return null;

  const styles = {
    container: {
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid hsl(var(--border))',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.75rem',
      color: 'hsl(var(--foreground-secondary))',
      marginBottom: '0.5rem',
    },
    list: {
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.25rem',
    },
    item: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsla(var(--secondary), 0.5)',
      fontSize: '0.75rem',
      textDecoration: 'none',
      color: 'hsl(var(--foreground))',
      transition: 'background-color 0.15s',
    },
    thumb: {
      width: '2rem',
      height: '1.25rem',
      objectFit: 'cover',
      borderRadius: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <SparklesIcon style={{ color: 'hsl(var(--primary))' }} />
        Continue with
      </div>
      <div style={styles.list}>
        {relatedVideos.map(video => (
          <Link key={video.id} to={`/video/${video.id}`} style={styles.item} className="suggestion-link">
            <img src={video.thumbnail} alt="" style={styles.thumb} />
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// History card component
const HistoryCard = ({
  item,
  isSelected,
  onSelect,
  onRemove,
  isSelectionMode,
  showSuggestions = false,
  allVideos = []
}) => {
  const isWatched = item.progress >= 90;
  
  const formatTimeRemaining = (duration, progress) => {
    const parts = duration.split(':');
    let totalSeconds = parts.length === 3 
      ? parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
      : parseInt(parts[0]) * 60 + parseInt(parts[1]);
    const remaining = Math.round(totalSeconds * (1 - progress / 100));
    const mins = Math.floor(remaining / 60);
    return mins <= 0 ? 'Completed' : `${mins} min left`;
  };

  const styles = {
    card: {
      position: 'relative',
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '0.75rem',
      border: `1px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
      boxShadow: isSelected ? '0 0 0 3px hsla(var(--primary), 0.2)' : 'none',
      overflow: 'hidden',
      transition: 'all 0.2s',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
    },
    thumbnailWrapper: {
      position: 'relative',
      aspectRatio: '16/9',
      overflow: 'hidden',
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      opacity: 0,
      transition: 'opacity 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playBtn: {
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      backgroundColor: 'hsla(var(--primary), 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--primary-foreground))',
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '4px',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    progressFill: {
      height: '100%',
      backgroundColor: isWatched ? 'hsl(var(--success))' : 'hsl(var(--primary))',
      transition: 'width 0.3s',
    },
    duration: {
      position: 'absolute',
      bottom: '0.5rem',
      right: '0.5rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '0.25rem',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    watchedBadge: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '0.25rem',
      backgroundColor: 'hsl(var(--success))',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    selectBtn: {
      position: 'absolute',
      top: '0.75rem',
      left: '0.75rem',
      zIndex: 10,
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '0.25rem',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
    info: {
      padding: '1rem',
    },
    title: {
      fontWeight: 600,
      color: 'hsl(var(--foreground))',
      marginBottom: '0.5rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textDecoration: 'none',
    },
    meta: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: 'hsl(var(--foreground-secondary))',
    },
    chapter: {
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      color: 'hsl(var(--primary))',
      fontSize: '0.75rem',
    },
    timeLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    resumeBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      marginTop: '0.75rem',
      padding: '0.375rem 0.75rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      fontSize: '0.875rem',
      fontWeight: 500,
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    removeBtn: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground-secondary))',
      border: 'none',
      cursor: 'pointer',
      opacity: 0,
      transition: 'opacity 0.2s, background-color 0.2s',
    },
  };

  return (
    <div style={styles.card} className="history-card">
      {isSelectionMode && (
        <button onClick={() => onSelect(item.videoId)} style={styles.selectBtn}>
          {isSelected ? <CheckSquareIcon style={{ color: 'hsl(var(--primary))' }} /> : <SquareIcon />}
        </button>
      )}

      <Link to={`/video/${item.videoId}`} style={styles.thumbnailWrapper} className="history-thumb-link">
        <img src={item.thumbnail} alt={item.title} style={styles.thumbnail} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
        <div style={styles.overlay} className="history-overlay">
          <div style={styles.playBtn}>
            <PlayIcon />
          </div>
        </div>
        {item.progress > 0 && (
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${item.progress}%` }} />
          </div>
        )}
        <span style={styles.duration}>{item.duration}</span>
        {isWatched && <span style={styles.watchedBadge}>✓ Watched</span>}
      </Link>

      <div style={styles.info}>
        <Link to={`/video/${item.videoId}`} style={styles.title} className="history-title-link">
          {item.title}
        </Link>
        <div style={styles.meta}>
          <span style={styles.chapter}>{item.chapterName}</span>
          <span style={styles.timeLeft}>
            <ClockIcon style={{ width: '0.75rem', height: '0.75rem' }} />
            {formatTimeRemaining(item.duration, item.progress)}
          </span>
        </div>
        {!isWatched && item.progress > 0 && (
          <Link to={`/video/${item.videoId}`} style={styles.resumeBtn}>
            <RotateCcwIcon />
            Resume
          </Link>
        )}
        {showSuggestions && allVideos.length > 0 && (<SmartSuggestion historyItem={item} allVideos={allVideos} />)}
      </div>

      <button onClick={() => onRemove(item.videoId)} style={styles.removeBtn} className="history-remove-btn" title="Remove from history">
        <TrashIcon />
      </button>

      <style>{`
        .history-card:hover { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
        .history-card:hover .history-overlay { opacity: 1; }
        .history-card:hover .history-remove-btn { opacity: 1; }
        .history-card:hover .history-thumb-link img { transform: scale(1.05); }
        .history-remove-btn:hover { background-color: hsla(var(--destructive), 0.1); color: hsl(var(--destructive)); }
        .history-title-link:hover { color: hsl(var(--primary)); }
        .suggestion-link:hover { background-color: hsl(var(--secondary)); }
      `}</style>
    </div>
  );
};

// Timeline group component
const TimelineGroup = ({ groupKey, items, selectedIds, onSelect, onRemove, isSelectionMode, onSelectAll }) => {
  const { label, Icon } = GROUP_LABELS[groupKey];
  const allSelected = items.every(item => selectedIds.includes(item.videoId));

  const styles = {
    container: {
      marginBottom: '2rem',
      animation: 'fadeIn 0.3s ease-out',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    iconWrapper: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--primary))',
    },
    title: {
      fontWeight: 600,
      color: 'hsl(var(--foreground))',
    },
    subtitle: {
      fontSize: '0.875rem',
      color: 'hsl(var(--foreground-secondary))',
    },
    selectAllBtn: {
      fontSize: '0.875rem',
      color: 'hsl(var(--primary))',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    timeline: {
      paddingLeft: '1.25rem',
      borderLeft: '2px solid hsl(var(--border))',
      marginLeft: '1.25rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrapper}>
            <Icon />
          </div>
          <div>
            <h3 style={styles.title}>{label}</h3>
            <p style={styles.subtitle}>{items.length} video{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {isSelectionMode && (
          <button onClick={() => onSelectAll(items.map(i => i.videoId), !allSelected)} style={styles.selectAllBtn}>
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        )}
      </div>
      <div style={styles.timeline}>
        <div style={styles.grid}>
          {items.map((item, index) => (
            <HistoryCard
            key={item.videoId}
            item={item}
            isSelected={selectedIds.includes(item.videoId)}
            onSelect={onSelect}
            onRemove={onRemove}
            isSelectionMode={isSelectionMode}
            showSuggestions={index === 0}
            allVideos={items}

            />
          ))}
        </div>
      </div>
    </div>
  );
};

const WatchHistoryPage = () => {
  const { history, isLoading, removeFromHistory, clearHistory } = useWatchHistory();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const groupedHistory = useMemo(() => groupHistoryByTime(history), [history]);
  const activeGroups = useMemo(() => {
    return Object.entries(groupedHistory)
      .filter(([_, items]) => items.length > 0)
      .map(([key, items]) => ({ key, items }));
  }, [groupedHistory]);

  const handleSelect = (videoId) => {
    setSelectedIds(prev => prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]);
  };

  const handleSelectAll = (ids, select) => {
    if (select) setSelectedIds(prev => [...new Set([...prev, ...ids])]);
    else setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedIds) await removeFromHistory(id);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) setSelectedIds([]);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: 'hsl(var(--background))',
    },
    hero: {
      position: 'relative',
      padding: '3rem 0',
      background: 'linear-gradient(135deg, hsla(var(--primary), 0.1), hsl(var(--background)), hsla(var(--accent), 0.1))',
      overflow: 'hidden',
    },
    heroDecor: {
      position: 'absolute',
      top: '2.5rem',
      right: '2.5rem',
      width: '16rem',
      height: '16rem',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      borderRadius: '50%',
      filter: 'blur(60px)',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
      position: 'relative',
      zIndex: 1,
    },
    heroContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    heroLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    heroIcon: {
      width: '3.5rem',
      height: '3.5rem',
      borderRadius: '1rem',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--primary))',
    },
    heroTitle: {
      fontSize: '1.875rem',
      fontWeight: 700,
      color: 'hsl(var(--foreground))',
      margin: 0,
    },
    heroSubtitle: {
      color: 'hsl(var(--foreground-secondary))',
      marginTop: '0.25rem',
    },
    heroActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    selectBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    clearAllBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsla(var(--destructive), 0.1)',
      color: 'hsl(var(--destructive))',
      border: 'none',
      cursor: 'pointer',
    },
    bulkBar: {
      position: 'sticky',
      top: '4rem',
      zIndex: 20,
      backgroundColor: 'hsl(var(--card))',
      borderBottom: '1px solid hsl(var(--border))',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.2s ease-out',
    },
    bulkContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
    },
    bulkLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    bulkRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    content: {
      padding: '2rem 0',
    },
    emptyState: {
      textAlign: 'center',
      padding: '5rem 0',
    },
    emptyIcon: {
      width: '6rem',
      height: '6rem',
      margin: '0 auto 1.5rem',
      borderRadius: '50%',
      backgroundColor: 'hsl(var(--muted))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground-secondary))',
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'hsl(var(--foreground))',
      marginBottom: '0.5rem',
    },
    emptyText: {
      color: 'hsl(var(--foreground-secondary))',
      marginBottom: '1.5rem',
      maxWidth: '28rem',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    browseBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      fontWeight: 500,
      textDecoration: 'none',
    },
  };

  return (
    <MainLayout>
      <div style={styles.page}>
          <section style={styles.hero}>
            <div style={styles.heroDecor} />
            <div style={styles.container}>
              <div style={{ ...styles.heroContent, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={styles.heroLeft}>
                  <div style={styles.heroIcon}>
                    <ClockIcon style={{ width: '1.75rem', height: '1.75rem' }} />
                  </div>
                  <div>
                    <h1 style={styles.heroTitle}>Watch History</h1>
                    <p style={styles.heroSubtitle}>Continue where you left off • {history.length} video{history.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {history.length > 0 && (
                  <div style={styles.heroActions}>
                    <button
                      onClick={toggleSelectionMode}
                      style={{
                        ...styles.selectBtn,
                        backgroundColor: isSelectionMode ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                        color: isSelectionMode ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                      }}
                    >
                      <CheckSquareIcon />
                      {isSelectionMode ? 'Cancel' : 'Select'}
                    </button>
                    <button onClick={clearHistory} style={styles.clearAllBtn}>
                      <TrashIcon />
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {isSelectionMode && selectedIds.length > 0 && (
            <div style={styles.bulkBar}>
              <div style={styles.container}>
                <div style={styles.bulkContent}>
                  <div style={styles.bulkLeft}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{selectedIds.length} selected</span>
                    <button onClick={() => handleSelectAll(history.map(h => h.videoId), true)} style={{ fontSize: '0.875rem', color: 'hsl(var(--primary))', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Select all
                    </button>
                  </div>
                  <div style={styles.bulkRight}>
                    <button onClick={() => setSelectedIds([])} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--foreground-secondary))', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <XIcon />
                      Clear selection
                    </button>
                    <button onClick={handleDeleteSelected} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 1rem', borderRadius: '0.5rem', backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                      <TrashIcon />
                      Delete selected
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <section style={styles.content}>
            <div style={styles.container}>
              {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {[...Array(4)].map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
              ) : history.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <ClockIcon style={{ width: '2.5rem', height: '2.5rem' }} />
                  </div>
                  <h3 style={styles.emptyTitle}>No watch history yet</h3>
                  <p style={styles.emptyText}>Videos you watch will appear here so you can easily pick up where you left off</p>
                  <Link to="/videos" style={styles.browseBtn}>
                    Browse Videos
                    <ChevronRightIcon />
                  </Link>
                </div>
              ) : (
                <div>
                  {activeGroups.map(({ key, items }) => (
                    <TimelineGroup
                      key={key}
                      groupKey={key}
                      items={items}
                      selectedIds={selectedIds}
                      onSelect={handleSelect}
                      onRemove={removeFromHistory}
                      isSelectionMode={isSelectionMode}
                      onSelectAll={handleSelectAll}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-0.5rem); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 768px) {
              .history-card { flex-direction: column; }
            }
          `}</style>
        </div>
    </MainLayout>
  );
};

export default WatchHistoryPage;
