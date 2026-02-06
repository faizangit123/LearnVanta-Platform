import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api.js";
import { formatViews } from "../utils/format.js"; 

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
  </svg>
);

const ChapterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const SearchAutocomplete = ({ 
  placeholder = "Search videos, subjects...", 
  onClose,
  isMobile = false,
  className = ""
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search results
  const [results, setResults] = useState({
  videos: [],
  subjects: [],
  chapters: [],
});

useEffect(() => {
  if (query.trim().length < 2) {
    setResults({ videos: [], subjects: [], chapters: [] });
    return;
  }

  const fetchResults = async () => {
    try {
      const [videos, subjects, chapters] = await Promise.all([
        apiRequest(`/content/videos/?search=${encodeURIComponent(query)}`),
        apiRequest(`/content/subjects/search/?q=${encodeURIComponent(query)}`),
        apiRequest(`/content/chapters/search/?q=${encodeURIComponent(query)}`),
      ]);

      setResults({
        videos: (videos || []).slice(0, 5),
        subjects: (subjects || []).slice(0, 3),
        chapters: (chapters || []).slice(0, 3),
      });
    } catch (err) {
      console.error("Search failed", err);
      setResults({ videos: [], subjects: [], chapters: [] });
    }
  };

  fetchResults();
}, [query]);


  const totalResults = results.videos.length + results.subjects.length + results.chapters.length;
  const hasResults = totalResults > 0;

  // Get all items in order for keyboard navigation
  const allItems = useMemo(() => {
    const items = [];
    results.videos.forEach((v, i) => items.push({ type: 'video', item: v, index: i }));
    results.subjects.forEach((s, i) => items.push({ type: 'subject', item: s, index: i }));
    results.chapters.forEach((c, i) => items.push({ type: 'chapter', item: c, index: i }));
    return items;
  }, [results]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = useCallback((e) => {
  e.preventDefault();
  if (query.trim()) {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsOpen(false);
    setQuery("");
    onClose?.();
  }
}, [query, navigate, onClose]);

  const handleItemClick = useCallback(() => {
  setIsOpen(false);
  setQuery("");
  onClose?.();
}, [onClose]);
  const handleKeyDown = useCallback((e) => {if (!isOpen || !hasResults) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < allItems.length) {
          const selected = allItems[activeIndex];
          let path = "";
          if (selected.type === "video") path = `/video/${selected.item.id}`;
          else if (selected.type === "subject") path = `/subject/${selected.item.id}`;
          else if (selected.type === "chapter") path = `/chapter/${selected.item.id}`;
          navigate(path);
          handleItemClick();
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  }, [isOpen, hasResults, activeIndex, allItems, navigate,handleItemClick,handleSubmit]);

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      maxWidth: '320px',
    },
    inputWrapper: {
      position: 'relative',
      width: '100%',
    },
    icon: {
      position: 'absolute',
      left: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'hsl(var(--foreground-secondary))',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width: '100%',
      paddingLeft: '2.75rem',
      paddingRight: '2.5rem',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--secondary))',
      border: '1px solid hsl(var(--border))',
      outline: 'none',
      transition: 'all 0.2s ease',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
    },
    clearBtn: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'hsl(var(--foreground-secondary))',
      borderRadius: '50%',
      transition: 'all 0.2s',
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 0.5rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '340px',
      maxWidth: '95vw',
      maxHeight: '70vh',
      overflowY: 'auto',
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      animation: 'fadeIn 0.15s ease-out',
    },
    empty: {
      padding: '1.5rem 1rem',
      textAlign: 'center',
      color: 'hsl(var(--foreground-secondary))',
    },
    section: {
      padding: '0.375rem',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.6875rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'hsl(var(--foreground-secondary))',
      padding: '0.5rem 0.625rem',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
      padding: '0.5rem 0.625rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'background-color 0.15s',
    },
    itemActive: {
      backgroundColor: 'hsl(var(--secondary))',
    },
    thumb: {
      width: '2.5rem',
      height: '1.75rem',
      objectFit: 'cover',
      borderRadius: '0.25rem',
      flexShrink: 0,
      backgroundColor: 'hsl(var(--muted))',
    },
    itemContent: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
    },
    itemTitle: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: 'hsl(var(--foreground))',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
    },
    itemMeta: {
      fontSize: '0.6875rem',
      color: 'hsl(var(--foreground-secondary))',
      marginTop: '0.125rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    duration: {
      fontSize: '0.6875rem',
      color: 'hsl(var(--foreground-secondary))',
      backgroundColor: 'hsl(var(--muted))',
      padding: '0.125rem 0.375rem',
      borderRadius: '0.25rem',
      flexShrink: 0,
      fontWeight: 500,
    },
    iconBox: {
      width: '1.75rem',
      height: '1.75rem',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    viewAll: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.625rem 0.75rem',
      borderTop: '1px solid hsl(var(--border))',
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: 'hsl(var(--primary))',
      textDecoration: 'none',
      transition: 'background-color 0.15s',
    },
  };

  return (
    <div style={styles.container} className={`search-autocomplete ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            style={styles.input}
            className="search-autocomplete-input"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              style={styles.clearBtn}
              onClick={handleClear}
              className="search-clear-btn"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.length >= 2 && (
        <div style={styles.dropdown}>
          {!hasResults ? (
            <div style={styles.empty}>
              <p>No results found for "{query}"</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Try different keywords</p>
            </div>
          ) : (
            <>
              {/* Videos */}
              {results.videos.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <VideoIcon />
                    <span>Videos</span>
                  </div>
                  {results.videos.map((video, index) => {
                    const itemIndex = index;
                    return (
                      <Link
                        key={video.id}
                        to={`/video/${video.id}`}
                        style={{
                          ...styles.item,
                          ...(activeIndex === itemIndex ? styles.itemActive : {}),
                        }}
                        className="autocomplete-item"
                        onClick={handleItemClick}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt="" 
                          style={styles.thumb}
                          onError={(e) => { e.target.src = '/placeholder.svg'; }}
                        />
                        <div style={styles.itemContent}>
                          <span style={styles.itemTitle}>
                            {highlightMatch(video.title, query)}
                          </span>
                          <span style={styles.itemMeta}>
                            {video.chapter_name || video.chapter?.name || "Chapter"} • {formatViews(video.views || 0)} views
                          </span>
                        </div>
                        <span style={styles.duration}>{video.duration}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Subjects */}
              {results.subjects.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <BookIcon />
                    <span>Subjects</span>
                  </div>
                  {results.subjects.map((subject, index) => {
                    const itemIndex = results.videos.length + index;
                    return (
                      <Link
                        key={subject.id}
                        to={`/subject/${subject.id}`}
                        style={{
                          ...styles.item,
                          ...(activeIndex === itemIndex ? styles.itemActive : {}),
                        }}
                        className="autocomplete-item"
                        onClick={handleItemClick}
                      >
                        <div style={{ ...styles.iconBox, backgroundColor: 'hsla(var(--primary), 0.1)' }}>
                          <BookIcon style={{ color: 'hsl(var(--primary))' }} />
                        </div>
                        <div style={styles.itemContent}>
                          <span style={styles.itemTitle}>
                            {highlightMatch(subject.name, query)}
                          </span>
                          <span style={styles.itemMeta}>
                            {subject.chapter_count || 0} chapters • {subject.video_count || 0} videos
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Chapters */}
              {results.chapters.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <ChapterIcon />
                    <span>Chapters</span>
                  </div>
                  {results.chapters.map((chapter, index) => {
                    const itemIndex = results.videos.length + results.subjects.length + index;
                    return (
                      <Link
                        key={chapter.id}
                        to={`/chapter/${chapter.id}`}
                        style={{
                          ...styles.item,
                          ...(activeIndex === itemIndex ? styles.itemActive : {}),
                        }}
                        className="autocomplete-item"
                        onClick={handleItemClick}
                      >
                        <div style={{ ...styles.iconBox, backgroundColor: 'hsla(var(--accent), 0.1)' }}>
                          <ChapterIcon style={{ color: 'hsl(var(--accent))' }} />
                        </div>
                        <div style={styles.itemContent}>
                          <span style={styles.itemTitle}>
                            {highlightMatch(chapter.name, query)}
                          </span>
                          <span style={styles.itemMeta}>
                           {chapter.video_count || 0} videos
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* View All Results */}
              <Link 
                to={`/search?q=${encodeURIComponent(query)}`}
                style={styles.viewAll}
                className="autocomplete-view-all"
                onClick={handleItemClick}
              >
                <span>View all results for "{query}"</span>
                <ArrowRightIcon />
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .search-autocomplete-input:focus {
          border-color: hsl(var(--primary));
          background-color: hsl(var(--card));
          box-shadow: 0 0 0 3px hsla(var(--primary), 0.15);
        }
        .search-autocomplete-input::placeholder {
          color: hsl(var(--foreground-secondary));
        }
        .search-clear-btn:hover {
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
        }
        .autocomplete-item:hover {
          background-color: hsl(var(--secondary));
        }
        .autocomplete-view-all:hover {
          background-color: hsl(var(--secondary));
        }
        .search-highlight {
          background-color: hsla(var(--primary), 0.2);
          color: hsl(var(--primary));
          border-radius: 2px;
          padding: 0 2px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-0.25rem); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchAutocomplete;
