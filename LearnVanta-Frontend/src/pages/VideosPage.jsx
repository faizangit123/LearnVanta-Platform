import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { useWatchHistory } from "../hooks/useWatchHistory.js";
import VideoCard from "../components/VideoCard.jsx";
import ContinueWatching from "../components/ContinueWatching.jsx";
import VideoSearchSuggestions from "../components/VideoSearchSuggestions.jsx";
import VideoFilters, { DURATION_FILTERS } from "../components/VideoFilters.jsx";
import { apiRequest } from "../config/api";


const ITEMS_PER_PAGE = 12;

// Icons
const PlayIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// Skeleton component for loading state
const VideoCardSkeleton = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div style={{
      aspectRatio: '16/9',
      backgroundColor: 'hsl(var(--muted))',
      animation: 'pulse 2s infinite'
    }} />
    <div style={{ padding: '1rem' }}>
      <div style={{
        height: '1rem',
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        animation: 'pulse 2s infinite'
      }} />
      <div style={{
        height: '0.75rem',
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: '0.25rem',
        width: '60%',
        animation: 'pulse 2s infinite'
      }} />
    </div>
  </div>
);

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const { history, removeFromHistory } = useWatchHistory();
  
  const progressMap = useMemo(() => {
    const map = {};
    history.forEach(item => {
      map[item.videoId] = item.progress || 0;
    });
    return map;
  }, [history]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedWatchStatus, setSelectedWatchStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    Promise.all([
      apiRequest("/api/v1/content/videos/"),
      apiRequest("/api/v1/content/classes/"),
      apiRequest("/api/v1/content/subjects/"),
      apiRequest("/api/v1/content/chapters/"),
    ]).then(([v, c, s, ch]) => {
      setVideos(v || []);
      setClasses(c || []);
      setSubjects(s || []);
      setChapters(ch || []);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedClass, selectedSubject, selectedType, selectedDuration, selectedWatchStatus, sortBy]);

  // correct Django class relation
  const filteredSubjects = useMemo(() => {
    if (selectedClass === "all") return subjects;
    return subjects.filter((s) => s.class_ref?.id === selectedClass);
  }, [selectedClass, subjects]);

  // proper duration parsing (HH:MM:SS)
  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    const parts = durationStr.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 2) {
      return parts[0];
    }
    return 0;
  };

  const filteredVideos = useMemo(() => {
    let result = videos.filter((video) => {
      const matchesSearch = searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || video.subject?.id === selectedSubject;

      const matchesType = selectedType === "all" || video.video_type === selectedType;

      const matchesClass = selectedClass === "all" || video.subject?.class_ref?.id === selectedClass;
      
      let matchesDuration = true;
      if (selectedDuration !== "all") {
        const filter = DURATION_FILTERS.find(f => f.value === selectedDuration);
        const mins = parseDuration(video.duration);
        if (filter?.min !== undefined && filter?.max !== undefined) {
          matchesDuration = mins >= filter.min && mins < filter.max;
        } else if (filter?.max !== undefined) {
          matchesDuration = mins < filter.max;
        } else if (filter?.min !== undefined) {
          matchesDuration = mins >= filter.min;
        }
      }

      const progress = progressMap[video.id] || 0;
      let matchesWatchStatus = true;
      if (selectedWatchStatus === "unwatched") matchesWatchStatus = progress === 0;
      if (selectedWatchStatus === "in-progress") matchesWatchStatus = progress > 0 && progress < 90;
      if (selectedWatchStatus === "watched") matchesWatchStatus = progress >= 90;

      return matchesSearch && matchesSubject && matchesType && matchesClass && matchesDuration && matchesWatchStatus;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "latest": return new Date(b.published_at) - new Date(a.published_at);
        case "popular": return b.views - a.views;
        case "trending": return (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0);
        default: return 0;
      }
    });

    return result;
  }, [videos, searchQuery, selectedClass, selectedSubject, selectedType, selectedDuration, selectedWatchStatus, sortBy, progressMap]);


  const displayedVideos = useMemo(
    () => filteredVideos.slice(0, displayCount),
    [filteredVideos, displayCount]
  );

  const hasMore = displayCount < filteredVideos.length;

  useEffect(() => {
    if (!loadMoreRef.current || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredVideos.length));
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, filteredVideos.length]);

  const videoTypes = [...new Set(videos.map(v => v.video_type))];

  const clearFilters = () => {
    setSelectedClass("all");
    setSelectedSubject("all");
    setSelectedType("all");
    setSelectedDuration("all");
    setSelectedWatchStatus("all");
    setSearchQuery("");
    setSortBy("latest");
  };

  const hasActiveFilters = selectedClass !== "all" || selectedSubject !== "all" || selectedType !== "all" || selectedDuration !== "all" || selectedWatchStatus !== "all" || searchQuery !== "";

  const handleFavoriteClick = useCallback((video) => {
    const chapter = chapters.find(c => c.id === video.chapter?.id);
    toggleFavorite({
      id: video.id,          
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      chapterName: chapter?.name || "",
    });
  }, [toggleFavorite, chapters]);

  return (
    <MainLayout>
      <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
        {/* Hero Section */}
        <section className="videos-hero">
          <div className="videos-hero-bg"></div>
          <div className="container" style={{ position: "relative", zIndex: 10 }}>
            <div style={{ textAlign: "center", maxWidth: "48rem", margin: "0 auto" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: "1rem" }}>
                Video <span style={{ color: "hsl(var(--primary))" }}>Library</span>
              </h1>
              <p style={{ fontSize: "1.125rem", color: "hsl(var(--foreground-secondary))", marginBottom: "2rem" }}>
                Explore our comprehensive collection of educational videos designed to help you excel
              </p>
              <VideoSearchSuggestions
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(query) => setSearchQuery(query)}
                placeholder="Search videos, subjects, chapters..."
              />
            </div>
          </div>
        </section>

        <ContinueWatching history={history} onRemove={removeFromHistory} />

        <VideoFilters
          classes={classes}
          subjects={filteredSubjects}
          videoTypes={videoTypes}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedWatchStatus={selectedWatchStatus}
          setSelectedWatchStatus={setSelectedWatchStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          resultCount={filteredVideos.length}
        />

        {/* Videos Grid */}
        <section style={{ padding: "3rem 0" }}>
          <div className="container">
            {isLoading ? (
              <div className="videos-grid">
                {[...Array(8)].map((_, i) => <VideoCardSkeleton key={i} />)}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="empty-state">
                <PlayIcon />
                <h3>No videos found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn btn-primary btn-md btn-rounded" style={{ marginTop: '1rem' }}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="videos-grid">
                  {displayedVideos.map((video, index) => {
                    const chapter = chapters.find(c => c.id === video.chapter.id);
                    return (
                      <VideoCard
                        key={video.id}
                        video={video}
                        chapter={chapter}
                        isFavorite={isFavorite(video.id)}
                        onFavoriteClick={handleFavoriteClick}
                        progress={progressMap[video.id] || 0}
                        index={index}
                      />
                    );
                  })}
                </div>

                {hasMore && (
                  <div ref={loadMoreRef} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3rem 0" }}>
                    {isLoadingMore && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "hsl(var(--foreground-muted))" }}>
                        <LoaderIcon />
                        <span>Loading more videos...</span>
                      </div>
                    )}
                  </div>
                )}

                {!hasMore && displayedVideos.length > ITEMS_PER_PAGE && (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <p style={{ color: "hsl(var(--foreground-muted))", fontSize: "0.875rem" }}>
                      You've reached the end • {filteredVideos.length} videos total
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .videos-hero {
          position: relative;
          padding: 3rem 0 4rem;
          overflow: visible;
        }
        .videos-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--background)), hsl(var(--accent) / 0.05));
        }
        .videos-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 640px) { .videos-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .videos-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .videos-grid { grid-template-columns: repeat(4, 1fr); } }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </MainLayout>
  );
};

export default VideosPage;
