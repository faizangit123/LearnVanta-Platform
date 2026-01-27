import React from "react";

// Icons
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const DURATION_FILTERS = [
  { value: "all", label: "All Durations" },
  { value: "short", label: "< 15 min", max: 15 },
  { value: "medium", label: "15-30 min", min: 15, max: 30 },
  { value: "long", label: "30-60 min", min: 30, max: 60 },
  { value: "extra-long", label: "> 60 min", min: 60 },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest", icon: "calendar" },
  { value: "popular", label: "Most Popular", icon: "eye" },
  { value: "trending", label: "Trending", icon: "eye" },
];

const WATCH_STATUS = [
  { value: "all", label: "All Videos" },
  { value: "unwatched", label: "Unwatched" },
  { value: "in-progress", label: "In Progress" },
  { value: "watched", label: "Watched" },
];

const SortIcon = ({ type }) => {
  if (type === "calendar") return <CalendarIcon />;
  return <EyeIcon />;
};

const VideoFilters = ({
  classes,
  subjects,
  videoTypes,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
  selectedDuration,
  setSelectedDuration,
  selectedWatchStatus,
  setSelectedWatchStatus,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  clearFilters,
  resultCount,
}) => {
  const FilterChip = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className="filter-pill"
      style={{
        background: active ? "hsl(var(--primary))" : undefined,
        borderColor: active ? "hsl(var(--primary))" : undefined,
        color: active ? "hsl(var(--primary-foreground))" : undefined
      }}
    >
      {children}
    </button>
  );

  return (
    <section className="video-filters-section">
      <div className="container">
        {/* Top row: Filter toggle, sort, result count */}
        <div className="video-filters-bar">
          <div className="video-filters-left">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-button"
              style={{
                background: showFilters || hasActiveFilters ? "hsl(var(--primary-muted))" : undefined,
                borderColor: showFilters || hasActiveFilters ? "hsl(var(--primary))" : undefined,
                color: showFilters || hasActiveFilters ? "hsl(var(--primary))" : undefined
              }}
            >
              <FilterIcon />
              Filters
              {hasActiveFilters && (
                <span style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.2)",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  ✓
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="clear-filters-button"
              >
                <XIcon />
                Clear all
              </button>
            )}
          </div>

          {/* Sort options */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "hsl(var(--foreground-secondary))" }} className="sm-inline hidden">Sort by:</span>
            <div style={{ display: "flex", gap: "0.25rem", background: "hsl(var(--secondary))", borderRadius: "var(--radius-lg)", padding: "0.25rem" }}>
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  style={{
                    padding: "0.375rem 0.75rem",
                    borderRadius: "var(--radius)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 150ms",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    background: sortBy === option.value ? "hsl(var(--card))" : "transparent",
                    color: sortBy === option.value ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    boxShadow: sortBy === option.value ? "var(--shadow-sm)" : "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  <SortIcon type={option.icon} />
                  <span className="sm-inline hidden">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "0.875rem", color: "hsl(var(--foreground-secondary))" }}>
            <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{resultCount}</span> videos found
          </p>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="video-filters-panel animate-fade-in">
            {/* Class & Subject row */}
            <div className="video-filters-grid">
              <div className="video-filter-group">
                <label className="video-filter-label">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedSubject("all");
                  }}
                  className="video-filter-select"
                >
                  <option value="all">All Classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="video-filter-group">
                <label className="video-filter-label">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="video-filter-select"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="video-filter-group">
                <label className="video-filter-label">Video Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="video-filter-select"
                >
                  <option value="all">All Types</option>
                  {videoTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration filters */}
            <div style={{ marginTop: "1.25rem" }}>
              <label className="video-filter-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <ClockIcon />
                Duration
              </label>
              <div className="filter-pills">
                {DURATION_FILTERS.map((filter) => (
                  <FilterChip
                    key={filter.value}
                    active={selectedDuration === filter.value}
                    onClick={() => setSelectedDuration(filter.value)}
                  >
                    {filter.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Watch status filters */}
            <div style={{ marginTop: "1rem" }}>
              <label className="video-filter-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <CheckCircleIcon />
                Watch Status
              </label>
              <div className="filter-pills">
                {WATCH_STATUS.map((status) => (
                  <FilterChip
                    key={status.value}
                    active={selectedWatchStatus === status.value}
                    onClick={() => setSelectedWatchStatus(status.value)}
                  >
                    {status.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoFilters;
export { DURATION_FILTERS, SORT_OPTIONS, WATCH_STATUS };