import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { useAuth } from "../context/AuthContext";
import { getAllNotes, clearVideoNotes, saveAllNotes } from "../hooks/useVideoNotes";

// Icons
const NoteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
const PlayIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
const PinIcon = ({ filled }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4.76z" /></svg>;
const ArchiveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>;
const BoldIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>;
const CodeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
const ChecklistIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>;
const SaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const GridIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
const ListIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" /></svg>;

const formatTimestamp = (timestamp) => {
  if (!timestamp && timestamp !== 0) return null;
  const mins = Math.floor(timestamp / 60);
  const secs = Math.floor(timestamp % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const renderMarkdown = (text) => {
  if (!text) return '';
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/`(.*?)`/g, '<code style="background-color: var(--muted); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem;">$1</code>');
  rendered = rendered.replace(/- \[ \] (.*?)(?:\n|$)/g, '<div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 1rem; height: 1rem; border: 1px solid var(--border); border-radius: 0.25rem;"></span>$1</div>');
  rendered = rendered.replace(/- \[x\] (.*?)(?:\n|$)/g, '<div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 1rem; height: 1rem; background-color: var(--primary); border-radius: 0.25rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem;">✓</span>$1</div>');
  rendered = rendered.replace(/\n/g, '<br/>');
  return rendered;
};

// Note Card Component
const NoteCard = ({ note, video, onEdit, onDelete, onPin, onArchive, onSeek }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);

  const handleSave = () => {
    setIsSaving(true);
    onEdit(note.id, editContent);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') { setIsEditing(false); setEditContent(note.content); }
  };

  const insertFormatting = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);
    let insertText = '';
    switch (format) {
      case 'bold': insertText = `**${selectedText || 'text'}**`; break;
      case 'code': insertText = `\`${selectedText || 'code'}\``; break;
      case 'checklist': insertText = `\n- [ ] ${selectedText || 'task'}`; break;
      default: return;
    }
    const newContent = editContent.substring(0, start) + insertText + editContent.substring(end);
    setEditContent(newContent);
  };

  const styles = {
    card: {
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '0.75rem',
      border: `1px solid ${note.isPinned ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
      padding: '1rem',
      boxShadow: note.isPinned ? '0 0 0 2px hsla(var(--primary), 0.1)' : 'none',
      opacity: note.isArchived ? 0.6 : 1,
    },
    pinnedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: 'hsl(var(--primary))',
      marginBottom: '0.5rem',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    },
    timestamp: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      color: 'hsl(var(--primary))',
      fontSize: '0.75rem',
      fontWeight: 500,
      border: 'none',
      cursor: 'pointer',
    },
    date: { fontSize: '0.75rem', color: 'hsl(var(--foreground-secondary))' },
    editor: { marginBottom: '0.75rem' },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginBottom: '0.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid hsl(var(--border))',
    },
    toolbarBtn: {
      padding: '0.375rem',
      borderRadius: '0.25rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground-secondary))',
      border: 'none',
      cursor: 'pointer',
    },
    toolbarSpacer: { flex: 1 },
    toolbarShortcut: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: 'hsl(var(--foreground-secondary))',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid hsl(var(--border))',
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
      resize: 'vertical',
      minHeight: '6rem',
    },
    editActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    content: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: 'hsl(var(--foreground))',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid hsl(var(--border))',
    },
    videoLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.875rem',
      color: 'hsl(var(--primary))',
      textDecoration: 'none',
    },
    actions: {
      display: 'flex',
      gap: '0.25rem',
    },
    actionBtn: {
      padding: '0.375rem',
      borderRadius: '0.25rem',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground-secondary))',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.card}>
      {note.isPinned && (
        <div style={styles.pinnedBadge}><PinIcon filled /> Pinned</div>
      )}
      <div style={styles.header}>
        {note.timestamp !== null && (
          <button style={styles.timestamp} onClick={() => onSeek(video.id, note.timestamp)}>
            <ClockIcon /> {formatTimestamp(note.timestamp)}
          </button>
        )}
        <span style={styles.date}>{formatDate(note.createdAt)}</span>
      </div>
      {isEditing ? (
        <div style={styles.editor}>
          <div style={styles.toolbar}>
            <button type="button" style={styles.toolbarBtn} onClick={() => insertFormatting('bold')} title="Bold"><BoldIcon /></button>
            <button type="button" style={styles.toolbarBtn} onClick={() => insertFormatting('code')} title="Code"><CodeIcon /></button>
            <button type="button" style={styles.toolbarBtn} onClick={() => insertFormatting('checklist')} title="Checklist"><ChecklistIcon /></button>
            <div style={styles.toolbarSpacer} />
            <span style={styles.toolbarShortcut}>⌘ + S to save</span>
          </div>
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.textarea}
            rows={4}
            autoFocus
            placeholder="Use **bold**, `code`, and - [ ] checklists"
          />
          <div style={styles.editActions}>
            <button onClick={() => { setIsEditing(false); setEditContent(note.content); }} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', border: 'none', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', cursor: 'pointer' }}>
              <SaveIcon /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.content} dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }} />
      )}
      <div style={styles.footer}>
        <Link to={`/video/${video.id}`} style={styles.videoLink}><PlayIcon /> {video.title}</Link>
        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => onPin(note.id)} title={note.isPinned ? 'Unpin' : 'Pin'} className="note-action-btn"><PinIcon filled={note.isPinned} /></button>
          <button style={styles.actionBtn} onClick={() => setIsEditing(true)} title="Edit" className="note-action-btn"><EditIcon /></button>
          <button style={styles.actionBtn} onClick={() => onArchive(note.id)} title={note.isArchived ? 'Unarchive' : 'Archive'} className="note-action-btn"><ArchiveIcon /></button>
          <button style={{ ...styles.actionBtn, color: 'var(--destructive)' }} onClick={() => onDelete(note.id)} title="Delete" className="note-action-btn"><TrashIcon /></button>
        </div>
      </div>
      <style>{`.note-action-btn:hover { background-color: var(--secondary); }`}</style>
    </div>
  );
};

// Video Group Component
const VideoGroup = ({ video, chapter, notes, onDeleteAll, isExpanded, onToggle }) => {
  const styles = {
    group: {
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '0.75rem',
      border: '1px solid hsl(var(--border))',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      width: '100%',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
    },
    thumb: {
      position: 'relative',
      width: '5rem',
      height: '3rem',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      flexShrink: 0,
    },
    thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
    playOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    },
    info: { flex: 1 },
    title: { fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '0.25rem' },
    meta: { fontSize: '0.875rem', color: 'hsl(var(--foreground-secondary))' },
    countBadge: {
      marginLeft: '0.5rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      color: 'hsl(var(--primary))',
      fontSize: '0.75rem',
    },
    chevron: {
      transition: 'transform 0.2s',
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      color: 'hsl(var(--foreground-secondary))',
    },
    content: {
      padding: '0 1rem 1rem',
      borderTop: '1px solid hsl(var(--border))',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
    },
    notesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    noteItem: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--background))',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-start',
    },
    noteTimestamp: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: 'hsl(var(--primary))',
      textDecoration: 'none',
    },
    noteText: { flex: 1, fontSize: '0.875rem', color: 'hsl(var(--foreground))' },
    noteDate: { fontSize: '0.75rem', color: 'hsl(var(--foreground-secondary))' },
  };

  return (
    <div style={styles.group}>
      <button style={styles.header} onClick={onToggle}>
        <div style={styles.thumb}>
          <img src={video.thumbnail} alt={video.title} style={styles.thumbImg} />
          <div style={styles.playOverlay}><PlayIcon /></div>
        </div>
        <div style={styles.info}>
          <h4 style={styles.title}>{video.title}</h4>
          <span style={styles.meta}>
            {chapter?.name || 'Unknown Chapter'}
            <span style={styles.countBadge}>{notes.length} notes</span>
          </span>
        </div>
        <div style={styles.chevron}><ChevronDownIcon /></div>
      </button>
      {isExpanded && (
        <div style={styles.content}>
          <div style={styles.actions}>
            <Link to={`/video/${video.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', backgroundColor: 'var(--secondary)', color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.875rem' }}>
              <PlayIcon /> Watch Video
            </Link>
            <button onClick={() => onDeleteAll(video.id, video.title)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', backgroundColor: 'transparent', color: 'var(--destructive)', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
              <TrashIcon /> Delete All
            </button>
          </div>
          <div style={styles.notesList}>
            {notes.map(note => (
              <div key={note.id} style={styles.noteItem}>
                {note.timestamp !== null && (
                  <Link to={`/video/${video.id}?t=${note.timestamp}`} style={styles.noteTimestamp}>
                    <ClockIcon /> {formatTimestamp(note.timestamp)}
                  </Link>
                )}
                <div style={styles.noteText} dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }} />
                <span style={styles.noteDate}>{formatDate(note.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NotesPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [allNotes, setAllNotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState('all');
  const [expandedVideos, setExpandedVideos] = useState({});
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector('.notes-search-input')?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    // For admin, get all users' notes; for regular users, get only their own
    // In current localStorage setup, getAllNotes returns all notes (single user context)
    // When Django backend is connected, this would fetch all users' notes for admin
    const notes = getAllNotes();
    setAllNotes(notes);
    setIsLoading(false);
  }, [isAdmin]);

  const processedNotes = useMemo(() => {
  const result = [];
  Object.entries(allNotes).forEach(([videoId, notes]) => {
    notes.forEach(note =>
      result.push({
        ...note,
        videoId,
        video: note.video,      
        chapter: note.chapter,  
        subject: note.subject,  
      })
    );
  });
  return result;
}, [allNotes]);


  const filteredNotes = useMemo(() => {
    let result = processedNotes;
    if (filterView === 'pinned') result = result.filter(n => n.isPinned);
    else if (filterView === 'archived') result = result.filter(n => n.isArchived);
    else result = result.filter(n => !n.isArchived);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n => n.content.toLowerCase().includes(query) || n.video.title.toLowerCase().includes(query));
    }
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return result;
  }, [processedNotes, filterView, searchQuery]);

  const groupedNotes = useMemo(() => {
    const groups = {};
    filteredNotes.forEach(note => {
      if (!groups[note.videoId]) groups[note.videoId] = { video: note.video, chapter: note.chapter, notes: [] };
      groups[note.videoId].notes.push(note);
    });
    return groups;
  }, [filteredNotes]);

  const handlePin = (noteId) => {
    const updated = { ...allNotes };
    Object.keys(updated).forEach(videoId => {
      updated[videoId] = updated[videoId].map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n);
    });
    setAllNotes(updated);
    saveAllNotes(updated);
  };

  const handleArchive = (noteId) => {
    const updated = { ...allNotes };
    Object.keys(updated).forEach(videoId => {
      updated[videoId] = updated[videoId].map(n => n.id === noteId ? { ...n, isArchived: !n.isArchived } : n);
    });
    setAllNotes(updated);
    saveAllNotes(updated);
  };

  const handleDelete = (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    const updated = { ...allNotes };
    Object.keys(updated).forEach(videoId => {
      updated[videoId] = updated[videoId].filter(n => n.id !== noteId);
      if (updated[videoId].length === 0) delete updated[videoId];
    });
    setAllNotes(updated);
    saveAllNotes(updated);
  };

  const handleEdit = (noteId, newContent) => {
    const updated = { ...allNotes };
    Object.keys(updated).forEach(videoId => {
      updated[videoId] = updated[videoId].map(n => n.id === noteId ? { ...n, content: newContent } : n);
    });
    setAllNotes(updated);
    saveAllNotes(updated);
  };

  const handleDeleteVideoNotes = (videoId, videoTitle) => {
    if (!window.confirm(`Delete all notes for "${videoTitle}"?`)) return;
    clearVideoNotes(videoId);
    const updated = { ...allNotes };
    delete updated[videoId];
    setAllNotes(updated);
  };

  const handleSeek = (videoId, timestamp) => {
    navigate(`/video/${videoId}?t=${timestamp}`);
  };

  const toggleVideoExpanded = (videoId) => {
    setExpandedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const styles = {
    page: { minHeight: '100vh', backgroundColor: 'hsl(var(--background))' },
    hero: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--background)), hsl(var(--accent) / 0.1))',
      padding: '3rem 0',
    },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' },
    heroContent: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
    heroLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
    heroIcon: {
      width: '3.5rem',
      height: '3.5rem',
      borderRadius: '1rem',
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--primary))',
    },
    heroTitle: { fontSize: '1.875rem', fontWeight: 700, color: 'hsl(var(--foreground))', margin: 0 },
    heroSubtitle: { color: 'hsl(var(--foreground-secondary))', marginTop: '0.25rem' },
    adminBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      backgroundColor: 'hsl(var(--accent) / 0.1)',
      color: 'hsl(var(--accent))',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginLeft: '0.75rem',
    },
    controls: {
      backgroundColor: 'hsl(var(--card))',
      borderBottom: '1px solid hsl(var(--border))',
      padding: '1rem 0',
    },
    controlsInner: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '1rem',
    },
    searchWrapper: {
      position: 'relative',
      flex: 1,
      minWidth: '200px',
      maxWidth: '400px',
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'hsl(var(--foreground-muted))',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      paddingLeft: '2.5rem',
      paddingRight: '1rem',
      paddingTop: '0.625rem',
      paddingBottom: '0.625rem',
      borderRadius: '9999px',
      border: '1px solid hsl(var(--border))',
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
    },
    filterTabs: {
      display: 'flex',
      gap: '0.25rem',
      padding: '0.25rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--muted))',
    },
    filterTab: {
      padding: '0.5rem 0.875rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.2s',
    },
    viewToggle: {
      display: 'flex',
      gap: '0.25rem',
      padding: '0.25rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsl(var(--muted))',
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
    content: { padding: '2rem 0' },
    notesGrid: {
      display: 'grid',
      gridTemplateColumns: viewMode === 'cards' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
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
      color: 'hsl(var(--foreground-muted))',
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
  };

  const totalNotes = processedNotes.filter(n => !n.isArchived).length;

  return (
    <MainLayout>
      <div style={styles.page}>
        <section style={styles.hero}>
          <div style={styles.container}>
            <div style={styles.heroContent}>
              <div style={styles.heroLeft}>
                <div style={styles.heroIcon}><NoteIcon /></div>
                <div>
                  <h1 style={styles.heroTitle}>
                    {isAdmin ? 'All Notes' : 'My Notes'}
                    {isAdmin && <span style={styles.adminBadge}>Admin View</span>}
                  </h1>
                  <p style={styles.heroSubtitle}>{totalNotes} note{totalNotes !== 1 ? 's' : ''} across all videos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.controls}>
          <div style={styles.container}>
            <div style={styles.controlsInner}>
                <div style={styles.searchWrapper}>
                  <SearchIcon style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search notes... (⌘/)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                    className="notes-search-input"
                  />
                </div>
                <div style={styles.filterTabs}>
                  {['all', 'pinned', 'archived'].map(view => (
                    <button
                      key={view}
                      onClick={() => setFilterView(view)}
                      style={{ ...styles.filterTab, backgroundColor: filterView === view ? 'hsl(var(--card))' : 'transparent', color: filterView === view ? 'hsl(var(--primary))' : 'hsl(var(--foreground-secondary))' }}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
                <div style={styles.viewToggle}>
                  <button
                    onClick={() => setViewMode('cards')}
                    style={{ ...styles.viewBtn, backgroundColor: viewMode === 'cards' ? 'hsl(var(--card))' : 'transparent', color: viewMode === 'cards' ? 'hsl(var(--primary))' : 'hsl(var(--foreground-secondary))' }}
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setViewMode('grouped')}
                    style={{ ...styles.viewBtn, backgroundColor: viewMode === 'grouped' ? 'hsl(var(--card))' : 'transparent', color: viewMode === 'grouped' ? 'hsl(var(--primary))' : 'hsl(var(--foreground-secondary))' }}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section style={styles.content}>
            <div style={styles.container}>
              {isLoading ? (
                <div style={styles.notesGrid}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ height: '200px', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', animation: 'pulse 2s infinite' }} />
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><NoteIcon /></div>
                  <h3 style={styles.emptyTitle}>
                    {searchQuery ? 'No notes found' : filterView === 'pinned' ? 'No pinned notes' : filterView === 'archived' ? 'No archived notes' : 'No notes yet'}
                  </h3>
                  <p style={styles.emptyText}>
                    {searchQuery ? 'Try a different search term' : 'Start watching videos and take notes to see them here'}
                  </p>
                  {!searchQuery && filterView === 'all' && (
                    <Link to="/videos" style={styles.browseBtn}>Browse Videos</Link>
                  )}
                </div>
              ) : viewMode === 'grouped' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(groupedNotes).map(([videoId, { video, chapter, notes }]) => (
                    <VideoGroup
                      key={videoId}
                      video={video}
                      chapter={chapter}
                      notes={notes}
                      onDeleteAll={handleDeleteVideoNotes}
                      isExpanded={expandedVideos[videoId]}
                      onToggle={() => toggleVideoExpanded(videoId)}
                    />
                  ))}
                </div>
              ) : (
                <div style={styles.notesGrid}>
                  {filteredNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      video={note.video}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      onArchive={handleArchive}
                      onSeek={handleSeek}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            .notes-search-input:focus {
              outline: none;
              border-color: hsl(var(--primary));
              box-shadow: 0 0 0 3px hsla(var(--primary), 0.15);
            }
          `}</style>
        </div>
    </MainLayout>
  );
};

export default NotesPage;
