import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { videos, subjects, chapters } from "../data/mockData.js";

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const VideoSearchSuggestions = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search videos...",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [dropdownPos, setDropdownPos] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentVideoSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keep dropdown positioned above any page content (fixed overlay)
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const el = inputRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    // capture=true to handle scroll in nested containers too
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, value]);

  // Filter suggestions based on input
  const getVideoSuggestions = () => {
    if (!value || value.length < 2) return [];
    const query = value.toLowerCase();
    return videos
      .filter(v => 
        v.title.toLowerCase().includes(query) || 
        v.description.toLowerCase().includes(query)
      )
      .slice(0, 5);
  };

  const getSubjectSuggestions = () => {
    if (!value || value.length < 2) return [];
    const query = value.toLowerCase();
    return subjects
      .filter(s => s.name.toLowerCase().includes(query))
      .slice(0, 3);
  };

  const getChapterSuggestions = () => {
    if (!value || value.length < 2) return [];
    const query = value.toLowerCase();
    return chapters
      .filter(c => c.name.toLowerCase().includes(query))
      .slice(0, 3);
  };

  const getTrendingVideos = () => {
    return videos.filter(v => v.isTrending).slice(0, 4);
  };

  const videoSuggestions = getVideoSuggestions();
  const subjectSuggestions = getSubjectSuggestions();
  const chapterSuggestions = getChapterSuggestions();
  const trendingVideos = getTrendingVideos();

  const hasSuggestions = videoSuggestions.length > 0 || subjectSuggestions.length > 0 || chapterSuggestions.length > 0;
  const showDropdown = isOpen && (hasSuggestions || value.length === 0);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      // Save to recent searches
      const updated = [value, ...recentSearches.filter(s => s !== value)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentVideoSearches', JSON.stringify(updated));
      onSearch?.(value);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (term) => {
    onChange(term);
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentVideoSearches', JSON.stringify(updated));
    setIsOpen(false);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const styles = {
    container: {
      position: 'relative',
      zIndex: 9999,
    },
    inputWrapper: {
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'hsl(var(--foreground-secondary))',
    },
    input: {
      width: '100%',
      paddingLeft: '3rem',
      paddingRight: '3rem',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      outline: 'none',
      transition: 'all 0.2s',
      color: 'hsl(var(--foreground))',
      fontSize: '1rem',
    },
    clearButton: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--muted))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    dropdown: {
      position: 'fixed',
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '0.75rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    section: {
      padding: '0.75rem',
      borderBottom: '1px solid hsl(var(--border))',
    },
    sectionLast: {
      padding: '0.75rem',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'hsl(var(--foreground-secondary))',
      marginBottom: '0.5rem',
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    tagButton: {
      padding: '0.375rem 0.75rem',
      borderRadius: '9999px',
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    suggestionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
      textDecoration: 'none',
      color: 'inherit',
    },
    thumbnail: {
      width: '3rem',
      height: '2rem',
      objectFit: 'cover',
      borderRadius: '0.25rem',
    },
    thumbnailLg: {
      width: '4rem',
      height: '2.5rem',
      objectFit: 'cover',
      borderRadius: '0.25rem',
    },
    suggestionContent: {
      flex: 1,
      minWidth: 0,
    },
    suggestionTitle: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'hsl(var(--foreground))',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    suggestionMeta: {
      fontSize: '0.75rem',
      color: 'hsl(var(--foreground-secondary))',
    },
    iconBox: {
      width: '2rem',
      height: '2rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    noResults: {
      padding: '1.5rem',
      textAlign: 'center',
      color: 'hsl(var(--foreground-secondary))',
    },
    noResultsIcon: {
      width: '2rem',
      height: '2rem',
      margin: '0 auto 0.5rem',
      opacity: 0.5,
    },
  };

  return (
    <div style={styles.container} className={className}>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputWrapper}>
          <span style={styles.searchIcon}><SearchIcon /></span>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            style={styles.input}
            className="video-search-input"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              style={styles.clearButton}
            >
              <XIcon />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            ...styles.dropdown,
            top: dropdownPos?.top ?? 0,
            left: dropdownPos?.left ?? 0,
            width: dropdownPos?.width ?? '100%',
          }}
        >
          {/* No query - show recent & trending */}
          {!value && (
            <>
              {recentSearches.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <ClockIcon />
                    Recent Searches
                  </div>
                  <div style={styles.tagsContainer}>
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(term)}
                        style={styles.tagButton}
                        className="search-tag-button"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={styles.sectionLast}>
                <div style={styles.sectionHeader}>
                  <TrendingUpIcon />
                  Trending Videos
                </div>
                <div style={styles.suggestionList}>
                  {trendingVideos.map((video) => (
                    <Link
                      key={video.id}
                      to={`/video/${video.id}`}
                      onClick={() => setIsOpen(false)}
                      style={styles.suggestionItem}
                      className="suggestion-item"
                    >
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        style={styles.thumbnail}
                      />
                      <div style={styles.suggestionContent}>
                        <p style={styles.suggestionTitle}>{video.title}</p>
                        <p style={styles.suggestionMeta}>{video.chapterName}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Has query - show suggestions */}
          {value && hasSuggestions && (
            <>
              {/* Video suggestions */}
              {videoSuggestions.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <VideoIcon />
                    Videos
                  </div>
                  <div style={styles.suggestionList}>
                    {videoSuggestions.map((video) => (
                      <Link
                        key={video.id}
                        to={`/video/${video.id}`}
                        onClick={() => setIsOpen(false)}
                        style={styles.suggestionItem}
                        className="suggestion-item"
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          style={styles.thumbnailLg}
                        />
                        <div style={styles.suggestionContent}>
                          <p style={{ ...styles.suggestionTitle, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {highlightMatch(video.title, value)}
                          </p>
                          <p style={styles.suggestionMeta}>{video.duration} • {video.chapterName}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject & Chapter suggestions */}
              {(subjectSuggestions.length > 0 || chapterSuggestions.length > 0) && (
                <div style={styles.sectionLast}>
                  <div style={styles.sectionHeader}>
                    <BookOpenIcon />
                    Subjects & Chapters
                  </div>
                  <div style={styles.suggestionList}>
                    {subjectSuggestions.map((subject) => (
                      <Link
                        key={subject.id}
                        to={`/subject/${subject.id}`}
                        onClick={() => setIsOpen(false)}
                        style={styles.suggestionItem}
                        className="suggestion-item"
                      >
                        <div style={{ ...styles.iconBox, color: 'hsl(var(--primary))' }}>
                          <BookOpenIcon />
                        </div>
                        <span style={{ ...styles.suggestionTitle, whiteSpace: 'normal' }}>
                          {highlightMatch(subject.name, value)}
                        </span>
                      </Link>
                    ))}
                    {chapterSuggestions.map((chapter) => (
                      <Link
                        key={chapter.id}
                        to={`/chapter/${chapter.id}`}
                        onClick={() => setIsOpen(false)}
                        style={styles.suggestionItem}
                        className="suggestion-item"
                      >
                        <div style={{ ...styles.iconBox, backgroundColor: 'hsla(var(--accent), 0.1)', color: 'hsl(var(--accent))' }}>
                          <BookOpenIcon />
                        </div>
                        <span style={{ ...styles.suggestionTitle, whiteSpace: 'normal' }}>
                          {highlightMatch(chapter.name, value)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* No results */}
          {value && value.length >= 2 && !hasSuggestions && (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}><SearchIcon /></div>
              <p style={{ fontSize: '0.875rem' }}>No results found for "{value}"</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .video-search-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsla(var(--primary), 0.2);
        }
        .video-search-input::placeholder {
          color: hsl(var(--foreground-secondary));
        }
        .suggestion-item:hover {
          background-color: hsl(var(--secondary));
        }
        .search-tag-button:hover {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .search-highlight {
          background-color: hsla(var(--primary), 0.2);
          color: hsl(var(--primary));
          border-radius: 2px;
          padding: 0 2px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-0.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VideoSearchSuggestions;