/**
 * Video Notes Hook
 * 
 * Manages video notes with localStorage persistence (mock mode)
 * or Django API calls (real mode).
 */

import { useState, useEffect, useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS, apiRequest } from "../config/api.js";
import { useAuth } from "../contexts/AuthContext"; 

const STORAGE_KEY = "edustream_video_notes";

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const getLocalNotes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveLocalNotes = (allNotes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes));
};

// ============================================
// NORMALIZER
// ============================================

const normalizeNote = (note) => ({
  id: note.id,
  content: note.content,
  timestamp: note.timestamp ?? null,
  createdAt: note.createdAt ?? note.created_at ?? new Date().toISOString(),
  updatedAt: note.updatedAt ?? note.updated_at ?? new Date().toISOString(),
  isPinned: note.isPinned ?? note.is_pinned ?? false,
  isArchived: note.isArchived ?? note.is_archived ?? false,
});

// ============================================
// MAIN HOOK
// ============================================

export const useVideoNotes = (videoId) => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes
  useEffect(() => {
    const loadNotes = async () => {
      if (!isAuthenticated || !videoId) {
        setNotes([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        if (!API_CONFIG.useMock) {
          const data = await apiRequest(API_ENDPOINTS.notes.byVideo(videoId));
          const normalized = (data || []).map(normalizeNote);
          setNotes(normalized);
        } else {
          const allNotes = getLocalNotes();
          setNotes(allNotes[videoId] || []);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [videoId, isAuthenticated]); 

  // Save notes to localStorage (mock mode only)
  const saveToStorage = useCallback((videoId, updatedNotes) => {
    if (API_CONFIG.useMock) {
      const allNotes = getLocalNotes();
      allNotes[videoId] = updatedNotes;
      saveLocalNotes(allNotes);
    }
  }, []);

  // Add a new note
  const addNote = useCallback(async (content, timestamp = null) => {
    if (!isAuthenticated || !videoId) return null;
    if (!API_CONFIG.useMock) {
      const newNote = await apiRequest(API_ENDPOINTS.notes.create, {
        method: 'POST',
        body: JSON.stringify({
          video_id: videoId,
          content,
          timestamp,
        }),
      });

      const normalized = normalizeNote(newNote);
      setNotes(prev => [...prev, normalized]);
      return normalized;
    }

    // Mock implementation
    const newNote = {
      id: Date.now().toString(),
      content,
      timestamp,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      isArchived: false,
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveToStorage(videoId, updatedNotes);
    return newNote;
  }, [notes, videoId, saveToStorage, isAuthenticated]);

  // Update an existing note
  const updateNote = useCallback(async (noteId, content) => {
    if (!isAuthenticated || !videoId) return;
    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.notes.update(noteId), {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });
    }

    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    saveToStorage(videoId, updatedNotes);
  }, [notes, videoId, saveToStorage, isAuthenticated]);

  // Delete a note
  const deleteNote = useCallback(async (noteId) => {
    if (!isAuthenticated || !videoId) return;
    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.notes.delete(noteId), {
        method: 'DELETE',
      });
    }

    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    saveToStorage(videoId, updatedNotes);
  }, [notes, videoId, saveToStorage, isAuthenticated]);

  // Pin/unpin a note
  const togglePin = useCallback(async (noteId) => {
    if (!isAuthenticated || !videoId) return;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.notes.update(noteId), {
        method: 'PATCH',
        body: JSON.stringify({ is_pinned: !note.isPinned }),
      });
    }

    const updatedNotes = notes.map((n) =>
      n.id === noteId
        ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() }
        : n
    );
    setNotes(updatedNotes);
    saveToStorage(videoId, updatedNotes);
  }, [notes, videoId, saveToStorage, isAuthenticated]);

  // Archive/unarchive a note
    const toggleArchive = useCallback(async (noteId) => {
    if (!isAuthenticated || !videoId) return;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    if (!API_CONFIG.useMock) {
      await apiRequest(API_ENDPOINTS.notes.update(noteId), {
        method: 'PATCH',
        body: JSON.stringify({ is_archived: !note.isArchived }),
      });
    }

    const updatedNotes = notes.map((n) =>
      n.id === noteId
        ? { ...n, isArchived: !n.isArchived, updatedAt: new Date().toISOString() }
        : n
    );
    setNotes(updatedNotes);
    saveToStorage(videoId, updatedNotes);
  }, [notes, videoId, saveToStorage, isAuthenticated]);

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
  };
};

// ============================================ 
// UTILITY FUNCTIONS
// ============================================
/**
 * Get all notes across all videos
 */
export const getAllNotes = async () => {
  const token = localStorage.getItem("token"); 


  if (!token) return []; 


  if (!API_CONFIG.useMock) {
    return apiRequest(API_ENDPOINTS.notes.list);
  }

  return getLocalNotes();
};

/**
 * Save all notes (used for bulk operations)
 */
export const saveAllNotes = (allNotes) => {
  if (API_CONFIG.useMock) {
    saveLocalNotes(allNotes);
  }
};

/**
 * Get notes count for a specific video
 */
export const getNotesCount = (videoId) => {
  if (!videoId) return 0; 

  try {
    const allNotes = getLocalNotes();
    return (allNotes[videoId] || []).length;
  } catch {
    return 0;
  }
};

/**
 * Delete all notes for a specific video
 */
export const clearVideoNotes = async (videoId) => {
  const token = localStorage.getItem("token"); 


  if (!token || !videoId) return; 


  if (!API_CONFIG.useMock) {
    const notes = await apiRequest(API_ENDPOINTS.notes.byVideo(videoId));
    await Promise.all(
      notes.map(note => 
        apiRequest(API_ENDPOINTS.notes.delete(note.id), { method: 'DELETE' })
      )
    );
    return;
  }

  const allNotes = getLocalNotes();
  delete allNotes[videoId];
  saveLocalNotes(allNotes);
};


export default useVideoNotes;
