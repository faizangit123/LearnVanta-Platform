import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { MainLayout } from '../components/layout';

// Icons
const HeartIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const GridIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
const ListIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
const GripIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>;
const TagIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const FolderIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const NoteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>;
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const BookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Favorite Card Component
const FavoriteCard = ({ item, viewMode, isDragging, onRemove, onAddNote, onTagClick, dragHandleProps }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const cardStyles = {
    card: {
      position: 'relative',
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '0.75rem',
      border: '1px solid hsl(var(--border))',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, transform 0.2s',
      opacity: 1,
    },
    listCard: {
      display: 'flex',
      alignItems: 'stretch',
      gap: '1rem',
      padding: '1rem',
    },
    dragHandle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.5rem',
      color: 'hsl(var(--foreground-secondary))',
      cursor: 'grab',
      opacity: 0.5,
      transition: 'opacity 0.2s',
    },
    thumbnail: {
      position: 'relative',
      aspectRatio: viewMode === 'list' ? 'auto' : '16/9',
      width: viewMode === 'list' ? '8rem' : '100%',
      height: viewMode === 'list' ? '5rem' : 'auto',
      overflow: 'hidden',
      borderRadius: viewMode === 'list' ? '0.5rem' : 0,
      flexShrink: 0,
      backgroundColor: 'hsl(var(--muted))',
    },
    thumbImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s',
      imageRendering: 'auto',
      backfaceVisibility: 'hidden',
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
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      backgroundColor: 'hsl(var(--primary))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--primary-foreground))',
    },
    duration: {
      position: 'absolute',
      bottom: '0.5rem',
      right: '0.5rem',
      padding: '0.125rem 0.375rem',
      borderRadius: '0.25rem',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      fontSize: '0.75rem',
    },
    content: {
      padding: viewMode === 'list' ? 0 : '1rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontWeight: 600,
      color: 'hsl(var(--foreground))',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textDecoration: 'none',
      marginBottom: '0.5rem',
    },
    meta: {
      fontSize: '0.875rem',
      color: 'hsl(var(--foreground-secondary))',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    chapter: {
      color: 'hsl(var(--primary))',
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.25rem',
      marginTop: '0.5rem',
    },
    tag: {
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--foreground))',
      fontSize: '0.75rem',
      border: 'none',
      cursor: 'pointer',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      paddingTop: '0.5rem',
    },
    date: {
      fontSize: '0.75rem',
      color: 'hsl(var(--foreground-secondary))',
    },
    tagsInline: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: 'hsl(var(--foreground-secondary))',
    },
    quickActions: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      display: 'flex',
      gap: '0.25rem',
      opacity: showQuickActions ? 1 : 0,
      transition: 'opacity 0.2s',
    },
    quickBtn: {
      width: '2rem',
      height: '2rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    listActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    actionBtn: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground-secondary))',
      border: 'none',
      cursor: 'pointer',
    },
  };

  if (viewMode === 'list') {
    return (
      <div style={{ ...cardStyles.card, ...cardStyles.listCard }} className="favorite-card">
        <div style={cardStyles.dragHandle} {...dragHandleProps}>
          <GripIcon />
        </div>
        <Link to={`/video/${item.videoId}`} style={cardStyles.thumbnail} className="favorite-thumb-link">
          <img src={item.thumbnail} alt={item.title} style={cardStyles.thumbImg} />
          <div style={cardStyles.overlay} className="favorite-overlay">
            <div style={cardStyles.playBtn}><PlayIcon /></div>
          </div>
          <span style={cardStyles.duration}>{item.duration}</span>
        </Link>
        <div style={cardStyles.content}>
          <Link to={`/video/${item.videoId}`} style={cardStyles.title} className="favorite-title-link">{item.title}</Link>
          <div style={cardStyles.meta}>
            <span style={cardStyles.chapter}>{item.chapterName}</span>
            <span>Added {formatDate(item.addedAt)}</span>
          </div>
          {item.subjectName && (
            <div style={cardStyles.tags}>
              <span style={cardStyles.tag}>{item.subjectName}</span>
            </div>
          )}
        </div>
        <div style={cardStyles.listActions}>
          <Link to={`/video/${item.videoId}`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <PlayIcon style={{ width: '1rem', height: '1rem' }} /> Play
          </Link>
          <button style={cardStyles.actionBtn} onClick={() => onAddNote(item)} title="Add note" className="action-btn"><NoteIcon /></button>
          <button style={{ ...cardStyles.actionBtn, color: 'hsl(var(--destructive))' }} onClick={() => onRemove(item.videoId)} title="Remove" className="action-btn"><TrashIcon /></button>
        </div>
        <style>{`.favorite-card:hover .favorite-overlay { opacity: 1; } .favorite-thumb-link:hover img { transform: scale(1.05); } .favorite-title-link:hover { color: hsl(var(--primary)); } .tag-btn:hover { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); } .action-btn:hover { background-color: hsl(var(--secondary)); }`}</style>
      </div>
    );
  }

  return (
    <div
      style={cardStyles.card}
      className="favorite-card"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      <div style={{ ...cardStyles.dragHandle, position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 5 }} {...dragHandleProps}>
        <GripIcon />
      </div>
      <Link to={`/video/${item.videoId}`} style={cardStyles.thumbnail} className="favorite-thumb-link">
        <img src={item.thumbnail} alt={item.title} style={cardStyles.thumbImg} />
        <div style={cardStyles.overlay} className="favorite-overlay">
          <div style={cardStyles.playBtn}><PlayIcon /></div>
        </div>
        <span style={cardStyles.duration}>{item.duration}</span>
      </Link>
      <div style={cardStyles.content}>
        <Link to={`/video/${item.videoId}`} style={cardStyles.title} className="favorite-title-link">{item.title}</Link>
        <div style={cardStyles.meta}>
          <span style={cardStyles.chapter}>{item.chapterName}</span>
        </div>
        <div style={cardStyles.footer}>
          <span style={cardStyles.date}>Added {formatDate(item.addedAt)}</span>
          {item.subjectName && (
            <div style={cardStyles.tagsInline}><TagIcon /><span>{item.subjectName}</span></div>
          )}
        </div>
      </div>
      <div style={cardStyles.quickActions}>
        <button style={cardStyles.quickBtn} onClick={() => onAddNote(item)} title="Add note"><NoteIcon /></button>
        <button style={{ ...cardStyles.quickBtn, backgroundColor: 'hsl(var(--destructive) / 0.9)' }} onClick={() => onRemove(item.videoId)} title="Remove"><TrashIcon /></button>
      </div>
      <style>{`.favorite-card:hover { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); } .favorite-card:hover .favorite-overlay { opacity: 1; } .favorite-thumb-link:hover img { transform: scale(1.05); } .favorite-title-link:hover { color: hsl(var(--primary)); }`}</style>
    </div>
  );
};

// Collection Card - Now dynamic based on subjects
const CollectionCard = ({ collection, onSelect, isSelected }) => {
  const styles = {
    card: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      backgroundColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--card))',
      border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
      width: '100%',
    },
    icon: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      backgroundColor: isSelected ? 'hsl(var(--primary-foreground) / 0.2)' : 'hsl(var(--primary) / 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))',
    },
    info: {
      flex: 1,
    },
    name: {
      fontWeight: 500,
      color: isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
    },
    count: {
      fontSize: '0.875rem',
      color: isSelected ? 'hsl(var(--primary-foreground) / 0.8)' : 'hsl(var(--foreground-secondary))',
    },
  };

  return (
    <button 
      style={styles.card} 
      onClick={() => onSelect(isSelected ? null : collection.id)} 
      className="collection-card"
    >
      <div style={styles.icon}><FolderIcon /></div>
      <div style={styles.info}>
        <h4 style={styles.name}>{collection.name}</h4>
        <span style={styles.count}>{collection.count} video{collection.count !== 1 ? 's' : ''}</span>
      </div>
      <style>{`
        .collection-card:hover { 
          background-color: ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} !important; 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px hsl(var(--foreground) / 0.1);
        }
      `}</style>
    </button>
  );
};

// Filter by Subject/Chapter
const SubjectChapterFilter = ({ items, selectedItem, onSelectItem, type }) => {
  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    btn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.375rem 0.75rem',
      borderRadius: '9999px',
      border: '1px solid hsl(var(--border))',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.btn, backgroundColor: !selectedItem ? 'hsl(var(--primary))' : 'hsl(var(--card))', color: !selectedItem ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))' }}
        onClick={() => onSelectItem(null)}
      >
        All
      </button>
      {items.map(item => (
        <button
          key={item.id}
          style={{ ...styles.btn, backgroundColor: selectedItem === item.id ? 'hsl(var(--primary))' : 'hsl(var(--card))', color: selectedItem === item.id ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))' }}
          onClick={() => onSelectItem(item.id)}
        >
          {type === 'subject' ? <BookIcon /> : <TagIcon />}
          {item.name}
        </button>
      ))}
    </div>
  );
};

// New Collection Modal
const NewCollectionModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  
  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
      onClose();
    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'hsl(var(--foreground) / 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    },
    modal: {
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '1rem',
      width: '100%',
      maxWidth: '24rem',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid hsl(var(--border))',
    },
    title: { fontWeight: 600, color: 'hsl(var(--foreground))', margin: 0 },
    closeBtn: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground-secondary))',
      border: 'none',
      cursor: 'pointer',
    },
    body: { padding: '1.5rem' },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'hsl(var(--foreground))',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid hsl(var(--border))',
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
    },
    hint: {
      fontSize: '0.75rem',
      color: 'hsl(var(--foreground-secondary))',
      marginTop: '0.5rem',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderTop: '1px solid hsl(var(--border))',
    },
    cancelBtn: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--foreground))',
      border: 'none',
      cursor: 'pointer',
    },
    createBtn: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>Create New Collection</h3>
          <button style={modalStyles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={modalStyles.body}>
          <label style={modalStyles.label}>Collection Name</label>
          <input
            type="text"
            placeholder="e.g., Watch Later, Important Videos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={modalStyles.input}
            autoFocus
          />
          <p style={modalStyles.hint}>Collections help you organize your favorite videos</p>
        </div>
        <div style={modalStyles.footer}>
          <button style={modalStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={modalStyles.createBtn} onClick={handleCreate} disabled={!name.trim()}>Create</button>
        </div>
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [noteTarget, setNoteTarget] = useState(null);
  const [customCollections, setCustomCollections] = useState(() => {
    const saved = localStorage.getItem('favorite_collections');
    return saved ? JSON.parse(saved) : [];
  });

  // Enrich favorites with subject info
  const enrichedFavorites = useMemo(() => {
  return favorites;
}, [favorites]);

  // Build dynamic collections from subjects in favorites
  const dynamicCollections = useMemo(() => {
    const subjectMap = {};
    enrichedFavorites.forEach(fav => {
      if (fav.subjectId && fav.subjectName) {
        if (!subjectMap[fav.subjectId]) {
          subjectMap[fav.subjectId] = { id: fav.subjectId, name: fav.subjectName, count: 0 };
        }
        subjectMap[fav.subjectId].count++;
      }
    });
    return Object.values(subjectMap);
  }, [enrichedFavorites]);

  // Get unique subjects and chapters from favorites
  const favoriteSubjects = useMemo(() => {
    const subjectSet = new Map();
    enrichedFavorites.forEach(fav => {
      if (fav.subjectId && fav.subjectName) {
        subjectSet.set(fav.subjectId, { id: fav.subjectId, name: fav.subjectName });
      }
    });
    return Array.from(subjectSet.values());
  }, [enrichedFavorites]);

  const favoriteChapters = useMemo(() => {
    const chapterSet = new Map();
    enrichedFavorites.forEach(fav => {
      if (fav.chapterId && fav.chapterName) {
        // If subject is selected, only show chapters from that subject
        if (!selectedSubject || fav.subjectId === selectedSubject) {
          chapterSet.set(fav.chapterId, { id: fav.chapterId, name: fav.chapterName });
        }
      }
    });
    return Array.from(chapterSet.values());
  }, [enrichedFavorites, selectedSubject]);

  // Filter favorites
  const filteredFavorites = useMemo(() => {
    let result = enrichedFavorites;
    
    // Filter by collection (subject)
    if (selectedCollection) {
      result = result.filter(item => item.subjectId === selectedCollection);
    }
    
    // Filter by subject
    if (selectedSubject) {
      result = result.filter(item => item.subjectId === selectedSubject);
    }
    
    // Filter by chapter
    if (selectedChapter) {
      result = result.filter(item => item.chapterId === selectedChapter);
    }
    
    return result;
  }, [enrichedFavorites, selectedCollection, selectedSubject, selectedChapter]);

  const handleRemove = (videoId) => {
    if (window.confirm('Remove this video from favorites?')) removeFavorite(videoId);
  };

  const handleAddNote = (item) => { setNoteTarget(item); setShowAddNoteModal(true); };
  const handleDragStart = (e, item) => { setDraggedItem(item); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e) => { e.preventDefault(); setDraggedItem(null); };
  const handleDragEnd = () => setDraggedItem(null);
  
  const handleCreateCollection = (name) => {
    const newCollection = { id: `custom-${Date.now()}`, name, count: 0 };
    const updated = [...customCollections, newCollection];
    setCustomCollections(updated);
    localStorage.setItem('favorite_collections', JSON.stringify(updated));
  };

  const handleSelectCollection = (id) => {
    setSelectedCollection(selectedCollection === id ? null : id);
    // Clear other filters when selecting a collection
    if (id) {
      setSelectedSubject(null);
      setSelectedChapter(null);
    }
  };

  const styles = {
    page: { minHeight: '100vh', backgroundColor: 'hsl(var(--background))' },
    header: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--background)))',
      padding: '3rem 0',
    },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
    headerIcon: {
      width: '3.5rem',
      height: '3.5rem',
      borderRadius: '1rem',
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--primary))',
    },
    title: { fontSize: '1.875rem', fontWeight: 700, color: 'hsl(var(--foreground))', margin: 0 },
    subtitle: { color: 'hsl(var(--foreground-secondary))', marginTop: '0.25rem' },
    viewToggle: {
      display: 'flex',
      gap: '0.25rem',
      padding: '0.25rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--secondary))',
    },
    viewBtn: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    filtersSection: { padding: '1.5rem 0', borderBottom: '1px solid hsl(var(--border))' },
    collectionsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    collectionsTitle: { fontWeight: 600, color: 'hsl(var(--foreground))', margin: 0 },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.875rem',
      color: 'hsl(var(--primary))',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
    },
    collectionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    filterSection: { marginTop: '1rem' },
    content: { padding: '2rem 0' },
    grid: {
      display: 'grid',
      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
      gap: '1.5rem',
    },
    emptyState: { textAlign: 'center', padding: '5rem 0' },
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
    emptyTitle: { fontSize: '1.25rem', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '0.5rem' },
    emptyText: { color: 'hsl(var(--foreground-secondary))', marginBottom: '1.5rem' },
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
    noteModalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'hsl(var(--foreground) / 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    },
    noteModal: {
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '1rem',
      width: '100%',
      maxWidth: '28rem',
      overflow: 'hidden',
    },
    noteModalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid hsl(var(--border))',
    },
    noteModalTitle: { fontWeight: 600, color: 'hsl(var(--foreground))', margin: 0 },
    noteModalClose: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground-secondary))',
      border: 'none',
      cursor: 'pointer',
    },
    noteModalBody: { padding: '1.5rem' },
    noteModalVideoTitle: { fontSize: '0.875rem', color: 'hsl(var(--foreground-secondary))', marginBottom: '1rem' },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid hsl(var(--border))',
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
      resize: 'vertical',
    },
    noteModalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderTop: '1px solid hsl(var(--border))',
    },
    noCollectionsText: {
      padding: '1rem',
      textAlign: 'center',
      color: 'hsl(var(--foreground-secondary))',
      fontSize: '0.875rem',
      backgroundColor: 'hsl(var(--muted))',
      borderRadius: '0.5rem',
    },
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        <section style={styles.header}>
            <div style={styles.container}>
              <div style={styles.headerContent}>
                <div style={styles.headerLeft}>
                  <div style={styles.headerIcon}><HeartIcon filled /></div>
                  <div>
                    <h1 style={styles.title}>My Favorites</h1>
                    <p style={styles.subtitle}>{favorites.length} video{favorites.length !== 1 ? 's' : ''} saved</p>
                  </div>
                </div>
                <div style={styles.viewToggle}>
                  <button
                    style={{ ...styles.viewBtn, backgroundColor: viewMode === 'grid' ? 'hsl(var(--card))' : 'transparent', color: viewMode === 'grid' ? 'hsl(var(--primary))' : 'hsl(var(--foreground-secondary))' }}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >
                    <GridIcon />
                  </button>
                  <button
                    style={{ ...styles.viewBtn, backgroundColor: viewMode === 'list' ? 'hsl(var(--card))' : 'transparent', color: viewMode === 'list' ? 'hsl(var(--primary))' : 'hsl(var(--foreground-secondary))' }}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {!isLoading && favorites.length > 0 && (
            <section style={styles.filtersSection}>
              <div style={styles.container}>
                <div style={styles.collectionsHeader}>
                  <h3 style={styles.collectionsTitle}>Collections</h3>
                  <button 
                    style={styles.addBtn} 
                    onClick={() => setShowNewCollectionModal(true)}
                    className="add-collection-btn"
                  >
                    <PlusIcon /> New
                  </button>
                </div>
                
                {dynamicCollections.length > 0 ? (
                  <div style={styles.collectionsGrid}>
                    {dynamicCollections.map(collection => (
                      <CollectionCard 
                        key={collection.id} 
                        collection={collection} 
                        onSelect={handleSelectCollection}
                        isSelected={selectedCollection === collection.id}
                      />
                    ))}
                    {customCollections.map(collection => (
                      <CollectionCard 
                        key={collection.id} 
                        collection={collection} 
                        onSelect={handleSelectCollection}
                        isSelected={selectedCollection === collection.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={styles.noCollectionsText}>
                    Add videos to favorites to see collections by subject
                  </p>
                )}
                
                {/* Subject Filter */}
                {favoriteSubjects.length > 0 && (
                  <div style={styles.filterSection}>
                    <h3 style={{ ...styles.collectionsTitle, marginBottom: '0.75rem', fontSize: '1rem' }}>Filter by Subject</h3>
                    <SubjectChapterFilter 
                      items={favoriteSubjects} 
                      selectedItem={selectedSubject} 
                      onSelectItem={(id) => {
                        setSelectedSubject(id);
                        setSelectedChapter(null); // Reset chapter when subject changes
                        setSelectedCollection(null);
                      }}
                      type="subject"
                    />
                  </div>
                )}
                
                {/* Chapter Filter */}
                {favoriteChapters.length > 0 && (
                  <div style={{ ...styles.filterSection, marginTop: '1rem' }}>
                    <h3 style={{ ...styles.collectionsTitle, marginBottom: '0.75rem', fontSize: '1rem' }}>Filter by Chapter</h3>
                    <SubjectChapterFilter 
                      items={favoriteChapters} 
                      selectedItem={selectedChapter} 
                      onSelectItem={(id) => {
                        setSelectedChapter(id);
                        setSelectedCollection(null);
                      }}
                      type="chapter"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          <section style={styles.content}>
            <div style={styles.container}>
              {isLoading ? (
                <div style={styles.grid}>{[...Array(6)].map((_, i) => <VideoCardSkeleton key={i} />)}</div>
              ) : favorites.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><HeartIcon /></div>
                  <h3 style={styles.emptyTitle}>No favorites yet</h3>
                  <p style={styles.emptyText}>Save videos you want to watch later by clicking the heart icon</p>
                  <Link to="/videos" style={styles.browseBtn}>Browse Videos</Link>
                </div>
              ) : filteredFavorites.length === 0 ? (
                <div style={styles.emptyState}>
                  <h3 style={styles.emptyTitle}>No videos match the filter</h3>
                  <p style={styles.emptyText}>Try selecting a different subject or chapter</p>
                  <button 
                    onClick={() => { setSelectedSubject(null); setSelectedChapter(null); setSelectedCollection(null); }} 
                    style={{ ...styles.browseBtn, backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', border: 'none', cursor: 'pointer' }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={styles.grid} onDragOver={handleDragOver}>
                  {filteredFavorites.map((item, index) => (
                    <div
                      key={item.videoId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <FavoriteCard
                        item={item}
                        viewMode={viewMode}
                        isDragging={draggedItem?.videoId === item.videoId}
                        onRemove={handleRemove}
                        onAddNote={handleAddNote}
                        dragHandleProps={{ onMouseDown: (e) => e.stopPropagation() }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Add Note Modal */}
          {showAddNoteModal && noteTarget && (
            <div style={styles.noteModalOverlay} onClick={() => setShowAddNoteModal(false)}>
              <div style={styles.noteModal} onClick={e => e.stopPropagation()}>
                <div style={styles.noteModalHeader}>
                  <h3 style={styles.noteModalTitle}>Add Note</h3>
                  <button style={styles.noteModalClose} onClick={() => setShowAddNoteModal(false)}><CloseIcon /></button>
                </div>
                <div style={styles.noteModalBody}>
                  <p style={styles.noteModalVideoTitle}>{noteTarget.title}</p>
                  <textarea placeholder="Write your note..." style={styles.textarea} rows={4} />
                </div>
                <div style={styles.noteModalFooter}>
                  <button onClick={() => setShowAddNoteModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => setShowAddNoteModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', cursor: 'pointer' }}>Save Note</button>
                </div>
              </div>
            </div>
          )}

          {/* New Collection Modal */}
          <NewCollectionModal 
            isOpen={showNewCollectionModal}
            onClose={() => setShowNewCollectionModal(false)}
            onCreate={handleCreateCollection}
          />
          
          <style>{`
            .add-collection-btn:hover {
              background-color: hsl(var(--primary) / 0.1) !important;
            }
          `}</style>
        </div>
    </MainLayout>
  );
};

export default FavoritesPage;
