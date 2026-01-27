import React, { useState, useRef, useEffect, forwardRef } from "react";
import { useVideoNotes } from "../hooks/useVideoNotes";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthPrompt } from "../context/AuthPromptContext.jsx";

// Icons with forwardRef to fix ref warnings
const PlusIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
));
PlusIcon.displayName = 'PlusIcon';

const EditIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
));
EditIcon.displayName = 'EditIcon';

const TrashIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
));
TrashIcon.displayName = 'TrashIcon';

const ClockIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
));
ClockIcon.displayName = 'ClockIcon';

const NoteIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
));
NoteIcon.displayName = 'NoteIcon';

const CheckIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

const CloseIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));
CloseIcon.displayName = 'CloseIcon';

const BoldIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
));
BoldIcon.displayName = 'BoldIcon';

const CodeIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
));
CodeIcon.displayName = 'CodeIcon';

const ChecklistIcon = forwardRef((props, ref) => (
  <svg ref={ref} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
));
ChecklistIcon.displayName = 'ChecklistIcon';

const formatTimestamp = (timestamp) => {
  if (!timestamp && timestamp !== 0) return null;
  const mins = Math.floor(timestamp / 60);
  const secs = Math.floor(timestamp % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Simple markdown renderer
const renderMarkdown = (text) => {
  if (!text) return '';
  
  // Bold **text**
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Code `text`
  rendered = rendered.replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
  // Checklist - [ ] and - [x]
  rendered = rendered.replace(/- \[ \] (.*?)(?:\n|$)/g, '<div class="checklist-item"><span class="checkbox unchecked"></span>$1</div>');
  rendered = rendered.replace(/- \[x\] (.*?)(?:\n|$)/g, '<div class="checklist-item"><span class="checkbox checked">✓</span>$1</div>');
  // Line breaks
  rendered = rendered.replace(/\n/g, '<br/>');
  
  return rendered;
};

const VideoNotes = ({ videoId, videoTitle, currentTime = null, onSeekToTime }) => {
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useAuthPrompt();
  const { notes, isLoading, addNote, updateNote, deleteNote } = useVideoNotes(videoId);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const textareaRef = useRef(null);
  const editTextareaRef = useRef(null);

  // If user is not authenticated, show login prompt UI
  if (!isAuthenticated) {
    return (
      <div className="video-notes-section">
        <div className="notes-header">
          <div className="notes-header-left">
            <NoteIcon />
            <h3>My Notes</h3>
          </div>
        </div>
        <div className="notes-login-prompt" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'hsl(var(--card))',
          borderRadius: '0.75rem',
          border: '1px solid hsl(var(--border))',
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'hsla(var(--primary), 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h4 style={{ marginBottom: '0.5rem', color: 'hsl(var(--foreground))' }}>Login Required</h4>
          <p style={{ color: 'hsl(var(--foreground-secondary))', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Sign in to take notes while watching videos
          </p>
          <button 
            onClick={() => showLoginPrompt("notes")} 
            className="btn btn-primary btn-sm"
          >
            Login to Add Notes
          </button>
        </div>
      </div>
    );
  }

  // Focus textarea when adding note
  useEffect(() => {
    if (isAddingNote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAddingNote]);

  // Keyboard shortcut handler
  const handleKeyDown = (e, isEditing = false) => {
    // Cmd/Ctrl + S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (isEditing) {
        handleSaveEdit(editingNoteId);
      } else {
        handleAddNote();
      }
    }
    // Escape to cancel
    if (e.key === 'Escape') {
      if (isEditing) {
        handleCancelEdit();
      } else {
        setIsAddingNote(false);
        setNewNoteContent("");
      }
    }
  };

  // Insert formatting at cursor
  const insertFormatting = (format, textareaRefToUse, content, setContent) => {
    const textarea = textareaRefToUse.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let insertText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        insertText = `**${selectedText || 'text'}**`;
        cursorOffset = selectedText ? insertText.length : 2;
        break;
      case 'code':
        insertText = `\`${selectedText || 'code'}\``;
        cursorOffset = selectedText ? insertText.length : 1;
        break;
      case 'checklist':
        insertText = `\n- [ ] ${selectedText || 'task'}`;
        cursorOffset = insertText.length;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + insertText + content.substring(end);
    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addNote(newNoteContent.trim(), includeTimestamp && currentTime !== null ? currentTime : null);
      setNewNoteContent("");
      setIsAddingNote(false);
    }
  };

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (noteId) => {
    if (editContent.trim()) {
      updateNote(noteId, editContent.trim());
    }
    setEditingNoteId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Delete this note?")) {
      deleteNote(noteId);
    }
  };

  // Toolbar component
  const EditorToolbar = ({ textareaRefToUse, content, setContent, onSave }) => (
    <div className="note-editor-toolbar">
      <button 
        type="button"
        className="toolbar-btn" 
        onClick={() => insertFormatting('bold', textareaRefToUse, content, setContent)}
        title="Bold (Cmd+B)"
      >
        <BoldIcon />
      </button>
      <button 
        type="button"
        className="toolbar-btn"
        onClick={() => insertFormatting('code', textareaRefToUse, content, setContent)}
        title="Code"
      >
        <CodeIcon />
      </button>
      <button 
        type="button"
        className="toolbar-btn"
        onClick={() => insertFormatting('checklist', textareaRefToUse, content, setContent)}
        title="Checklist"
      >
        <ChecklistIcon />
      </button>
      <div className="toolbar-spacer" />
      <span className="toolbar-shortcut">⌘/Ctrl + S to save</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="video-notes-section">
        <div className="notes-loading">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="video-notes-section">
      <div className="notes-header">
        <div className="notes-header-left">
          <NoteIcon />
          <h3>My Notes</h3>
          <span className="notes-count">{notes.length}</span>
        </div>
        {!isAddingNote && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddingNote(true)}
          >
            <PlusIcon />
            <span>Add Note</span>
          </button>
        )}
      </div>

      {/* Add Note Form with Rich Editor */}
      {isAddingNote && (
        <div className="add-note-form enhanced">
          <EditorToolbar 
            textareaRefToUse={textareaRef}
            content={newNoteContent}
            setContent={setNewNoteContent}
          />
          <textarea
            ref={textareaRef}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, false)}
            placeholder="Write your note... (supports **bold**, `code`, and - [ ] checklists)"
            className="note-textarea rich-editor"
            rows={4}
          />
          {currentTime !== null && (
            <label className="note-timestamp-toggle">
              <input
                type="checkbox"
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
              />
              <ClockIcon />
              <span>Link to {formatTimestamp(currentTime)}</span>
            </label>
          )}
          <div className="note-form-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsAddingNote(false);
                setNewNoteContent("");
              }}
            >
              <CloseIcon />
              <span>Cancel</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddNote}
              disabled={!newNoteContent.trim()}
            >
              <CheckIcon />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              {editingNoteId === note.id ? (
                <div className="note-edit-form enhanced">
                  <EditorToolbar 
                    textareaRefToUse={editTextareaRef}
                    content={editContent}
                    setContent={setEditContent}
                  />
                  <textarea
                    ref={editTextareaRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, true)}
                    className="note-textarea rich-editor"
                    autoFocus
                    rows={4}
                  />
                  <div className="note-form-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCancelEdit}
                    >
                      <CloseIcon />
                      <span>Cancel</span>
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSaveEdit(note.id)}
                      disabled={!editContent.trim()}
                    >
                      <CheckIcon />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className="note-content rendered-markdown"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
                  />
                  <div className="note-meta">
                    <div className="note-meta-left">
                      {note.timestamp !== null && (
                        <button
                          className="note-timestamp-btn"
                          onClick={() => onSeekToTime?.(note.timestamp)}
                          title="Jump to this time in video"
                        >
                          <ClockIcon />
                          {formatTimestamp(note.timestamp)}
                        </button>
                      )}
                      <span className="note-date">{formatDate(note.createdAt)}</span>
                    </div>
                    <div className="note-actions">
                      <button
                        className="note-action-btn"
                        onClick={() => handleStartEdit(note)}
                        title="Edit note"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="note-action-btn note-action-delete"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete note"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isAddingNote && (
          <div className="notes-empty">
            <NoteIcon />
            <p>No notes yet</p>
            <span>Take notes while watching to remember key points</span>
          </div>
        )
      )}
    </div>
  );
};

export default VideoNotes;
