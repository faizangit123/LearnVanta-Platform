import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { apiRequest } from "../config/api";


// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
  </svg>
);

const ChapterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
    <path d="M10 9H8"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
  </svg>
);

// helper
const formatViews = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  // Filters
  const [selectedClass, setSelectedClass] = useState(searchParams.get("class") || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subject") || "");
  const [selectedVideoType, setSelectedVideoType] = useState(searchParams.get("type") || "");

  // REAL DATA FROM BACKEND
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  
  // LOAD DATA
  useEffect(() => {
    Promise.all([
      apiRequest("/content/videos/"),
      apiRequest("/content/subjects/"),
      apiRequest("/content/classes/"),
      apiRequest("/content/chapters/"),
    ]).then(([v, s, c, ch]) => {
      setVideos(v || []);
      setSubjects(s || []);
      setClasses(c || []);
      setChapters(ch || []);
    });
  }, []);
  
  //VIDEO TYPES
  const videoTypes = [...new Set(videos.map(v => v.video_type))];

  // FILTER SUBJECTS BY CLASS
  const availableSubjects = useMemo(() => {
    if (!selectedClass) return subjects;
    return subjects.filter(s => s.class_ref?.id === selectedClass);
  }, [subjects, selectedClass]);

  // SEARCH LOGIC (REAL)
  const videoResults = useMemo(() => {
    return videos.filter(v => {
      const text =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const cls = !selectedClass || v.subject?.class_ref?.id === selectedClass;
      const sub = !selectedSubject || v.subject?.id === selectedSubject;
      const type = !selectedVideoType || v.video_type === selectedVideoType;

      return text && cls && sub && type;
    });
  }, [videos, searchQuery, selectedClass, selectedSubject, selectedVideoType]);

  const subjectResults = useMemo(() => {
    return subjects.filter(s => {
      const text = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const cls = !selectedClass || s.class_ref?.id === selectedClass;
      return text && cls;
    });
  }, [subjects, searchQuery, selectedClass]);

   const chapterResults = useMemo(() => {
    return chapters.filter(ch => {
      const text =
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const sub = !selectedSubject || ch.subject === selectedSubject;
      return text && sub;
    });
  }, [chapters, searchQuery, selectedSubject]);

  // Update URL when search changes
  // URL SYNC
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedClass) params.set("class", selectedClass);
    if (selectedSubject) params.set("subject", selectedSubject);
    if (selectedVideoType) params.set("type", selectedVideoType);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedClass, selectedSubject, selectedVideoType, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedVideoType("");
  };

  const hasActiveFilters = selectedClass || selectedSubject || selectedVideoType;

  const getResultCount = () => {
    switch (activeTab) {
      case "videos":
        return videoResults.length;
      case "subjects":
        return subjectResults.length;
      case "chapters":
        return chapterResults.length;
      default:
        return 0;
    }
  };

  return (
    <MainLayout>
      <div className="search-page">
        <div className="container">
          {/* Search Header */}
          <div className="search-header">
            <h1 className="search-title">Search</h1>
            <form onSubmit={handleSearch} className="search-form-large">
              <div className="search-input-wrapper">
                <span className="search-input-icon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search videos, subjects, chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-large"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              <button
                type="button"
                className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon />
                <span>Filters</span>
                {hasActiveFilters && <span className="filter-badge">!</span>}
              </button>
            </form>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                {/* Class Filter */}
                <div className="filter-group">
                  <label className="filter-label">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedSubject(""); // Reset subject when class changes
                    }}
                    className="filter-select"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div className="filter-group">
                  <label className="filter-label">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video Type Filter */}
                <div className="filter-group">
                  <label className="filter-label">Video Type</label>
                  <select
                    value={selectedVideoType}
                    onChange={(e) => setSelectedVideoType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Types</option>
                    {videoTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="search-tabs">
            <button
              className={`search-tab ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveTab("videos")}
            >
              Videos ({videoResults.length})
            </button>
            <button
              className={`search-tab ${activeTab === "subjects" ? "active" : ""}`}
              onClick={() => setActiveTab("subjects")}
            >
              Subjects ({subjectResults.length})
            </button>
            <button
              className={`search-tab ${activeTab === "chapters" ? "active" : ""}`}
              onClick={() => setActiveTab("chapters")}
            >
              Chapters ({chapterResults.length})
            </button>
          </div>

          {/* Results */}
          <div className="search-results">
            {searchQuery && (
              <p className="results-info">
                Found {getResultCount()} results for "{searchQuery}"
              </p>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="video-results">
                {videoResults.length === 0 ? (
                  <div className="no-results">
                    <p>No videos found. Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="video-results-grid">
                    {videoResults.map((video) => {
                      const subject = subjects.find((s) => s.id === video.subjectId);
                      const classInfo = classes.find((c) => c.id === subject?.classId);

                      return (
                        <Link
                          key={video.id}
                          to={`/video/${video.id}`}
                          className="video-result-card"
                        >
                          <div className="video-result-thumbnail">
                            <img src={video.thumbnail} alt={video.title} />
                            <span className="video-duration">{video.duration}</span>
                            <span className={`video-type-badge badge-${video.videoType}`}>
                              {video.videoType}
                            </span>
                          </div>
                          <div className="video-result-info">
                            <h3 className="video-result-title">{video.title}</h3>
                            <p className="video-result-meta">
                              {classInfo?.name} • {subject?.name}
                            </p>
                            <p className="video-result-stats">
                              <PlayIcon /> {formatViews(video.views)} views
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Subjects Tab */}
            {activeTab === "subjects" && (
              <div className="subject-results">
                {subjectResults.length === 0 ? (
                  <div className="no-results">
                    <p>No subjects found. Try adjusting your search.</p>
                  </div>
                ) : (
                  <div className="subject-results-grid">
                    {subjectResults.map((subject) => {
                      const classInfo = classes.find((c) => c.id === subject.classId);

                      return (
                        <Link
                          key={subject.id}
                          to={`/subject/${subject.id}`}
                          className="subject-result-card"
                        >
                          <div className="subject-result-icon">
                            <BookIcon />
                          </div>
                          <div className="subject-result-info">
                            <h3 className="subject-result-title">{subject.name}</h3>
                            <p className="subject-result-class">{classInfo?.name}</p>
                            <p className="subject-result-meta">
                              {subject.chapterCount} chapters • {subject.videoCount} videos
                            </p>
                            {subject.isPrimary && (
                              <span className="primary-badge">Primary Subject</span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Chapters Tab */}
            {activeTab === "chapters" && (
              <div className="chapter-results">
                {chapterResults.length === 0 ? (
                  <div className="no-results">
                    <p>No chapters found. Try adjusting your search.</p>
                  </div>
                ) : (
                  <div className="chapter-results-list">
                    {chapterResults.map((chapter) => {
                      const subject = subjects.find((s) => s.id === chapter.subjectId);
                      const classInfo = classes.find((c) => c.id === subject?.classId);

                      return (
                        <Link
                          key={chapter.id}
                          to={`/chapter/${chapter.id}`}
                          className="chapter-result-card"
                        >
                          <div className="chapter-result-icon">
                            <ChapterIcon />
                          </div>
                          <div className="chapter-result-info">
                            <h3 className="chapter-result-title">{chapter.name}</h3>
                            <p className="chapter-result-description">
                              {chapter.description}
                            </p>
                            <p className="chapter-result-meta">
                              {classInfo?.name} • {subject?.name} • {chapter.videoCount} videos
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
