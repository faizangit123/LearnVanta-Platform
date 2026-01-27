import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "../components/layout";
import {
  getChapterById,
  getSubjectById,
  getClassById,
  getVideosByChapter,
  formatViews,
  formatDate,
} from "../data/mockData";
import { getResourcesByChapter, isMockMode } from "../services/resourceService";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthPrompt } from "../context/AuthPromptContext.jsx";

// Icons
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const FunctionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 12L20 4" />
    <path d="M18 2h4v4" />
  </svg>
);

// Resource Card Component
const ResourceCard = ({ resource, type, icon, title, description, isAuthenticated, showLoginPrompt }) => {
  const isMock = resource?.isMock;
  const url = resource?.url;
  const size = resource?.size;
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Check authentication first
    if (!isAuthenticated) {
      showLoginPrompt("downloads");
      return;
    }
    
    // Check for mock/missing URL
    if (isMock || !url) {
      // Could show a toast/modal here saying "Connect to backend"
      return;
    }
    
    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = resource?.title || title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`chapter-resource-card ${isMock ? "mock" : ""}`}
    >
      <div className={`chapter-resource-icon chapter-resource-icon-${type}`}>
        {icon}
      </div>
      <div className="chapter-resource-info">
        <h3>{resource?.title || title}</h3>
        <p>{description}</p>
        <span className="chapter-resource-size">{size || "—"}</span>
      </div>
      <div className="chapter-resource-download">
        {isAuthenticated ? <DownloadIcon /> : <LockIcon />}
      </div>
    </button>
  );
};

const ChapterPage = () => {
  const { chapterId } = useParams();
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useAuthPrompt();
  
  const chapter = getChapterById(chapterId);
  const subject = chapter ? getSubjectById(chapter.subjectId) : null;
  const classData = subject ? getClassById(subject.classId) : null;
  const videos = chapter ? getVideosByChapter(chapterId) : [];
  
  // Resources state - fetched from resource service
  const [resources, setResources] = useState({ notes: null, practice: null, formulas: null });
  const [resourcesLoading, setResourcesLoading] = useState(true);
  
  useEffect(() => {
    const loadResources = async () => {
      if (!chapterId) return;
      setResourcesLoading(true);
      try {
        const data = await getResourcesByChapter(chapterId);
        setResources(data);
      } catch (error) {
        console.error("Failed to load resources:", error);
      } finally {
        setResourcesLoading(false);
      }
    };
    loadResources();
  }, [chapterId]);
  
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
  
  // Check if any resources exist (either from service or embedded in chapter)
  const hasResources = resources.notes || resources.practice || resources.formulas || chapter?.resources;

  if (!chapter || !subject || !classData) {
    return (
      <MainLayout>
        <section className="section">
          <div className="container">
            <div className="not-found-content">
              <h1>Chapter Not Found</h1>
              <p>The chapter you're looking for doesn't exist.</p>
              <Link to="/" className="btn btn-primary btn-md">
                Go Home
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="chapter-hero">
        <div className="container">
          <div className="chapter-hero-content">
            <nav className="breadcrumb chapter-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to={`/class/${classData.id}`} className="breadcrumb-link">{classData.name}</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to={`/subject/${subject.id}`} className="breadcrumb-link">{subject.name}</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{chapter.name}</span>
            </nav>
            
            
            <div className="chapter-hero-tags">
              <span className="badge badge-primary">{classData.name}</span>
              <span className="badge badge-accent">{subject.name}</span>
              <span className="chapter-number-badge">Chapter {chapter.order}</span>
            </div>
            
            <h1 className="chapter-hero-title">{chapter.name}</h1>
            <p className="chapter-hero-subtitle">{chapter.description}</p>
            
            <div className="chapter-hero-stats">
              <div className="chapter-stat">
                <div className="chapter-stat-value">{videos.length}</div>
                <div className="chapter-stat-label">Videos</div>
              </div>
              <div className="chapter-stat">
                <div className="chapter-stat-value">{formatViews(totalViews)}</div>
                <div className="chapter-stat-label">Total Views</div>
              </div>
            </div>

            {videos.length > 0 && (
              <div className="chapter-hero-actions">
                <Link to={`/video/${videos[0].id}`} className="btn btn-primary btn-lg btn-rounded">
                  <PlayCircleIcon /> Start Watching
                </Link>
                <Link to={`/subject/${subject.id}`} className="btn btn-outline btn-lg btn-rounded">
                  Back to {subject.name}
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="chapter-hero-bg"></div>
      </section>

      {/* Resources Section */}
      {hasResources && (
        <section className="chapter-resources">
          <div className="container">
            <h2 className="chapter-resources-title">Study Materials</h2>
            {resourcesLoading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "hsl(var(--foreground-secondary))" }}>
                Loading resources...
              </div>
            ) : (
              <div className="chapter-resources-grid">
                {/* Notes - Check service first, then fallback to embedded */}
                {(resources.notes || chapter?.resources?.notes) && (
                  <ResourceCard 
                    resource={resources.notes || chapter?.resources?.notes}
                    type="notes"
                    icon={<FileTextIcon />}
                    title="Chapter Notes"
                    description="Detailed notes for revision"
                    isAuthenticated={isAuthenticated}
                    showLoginPrompt={showLoginPrompt}
                  />
                )}
                
                {/* Practice Questions */}
                {(resources.practice || chapter?.resources?.practice) && (
                  <ResourceCard 
                    resource={resources.practice || chapter?.resources?.practice}
                    type="practice"
                    icon={<ClipboardIcon />}
                    title="Practice Questions"
                    description="MCQs and solved examples"
                    isAuthenticated={isAuthenticated}
                    showLoginPrompt={showLoginPrompt}
                  />
                )}
                
                {/* Formula Sheet */}
                {(resources.formulas || chapter?.resources?.formulas) && (
                  <ResourceCard 
                    resource={resources.formulas || chapter?.resources?.formulas}
                    type="formulas"
                    icon={<FunctionIcon />}
                    title="Formula Sheet"
                    description="Quick reference formulas"
                    isAuthenticated={isAuthenticated}
                    showLoginPrompt={showLoginPrompt}
                  />
                )}
              </div>
            )}
            
            {/* Show notice in mock mode */}
            {isMockMode() && !resourcesLoading && (resources.notes || resources.practice || resources.formulas) && (
              <p style={{ 
                textAlign: "center", 
                marginTop: "1rem", 
                fontSize: "0.75rem", 
                color: "hsl(var(--foreground-muted))" 
              }}>
                Demo mode: Connect to backend to enable file downloads
              </p>
            )}
          </div>
        </section>
      )}
      {/* Videos Grid */}
      <section className="chapter-videos">
        <div className="container">
          <div className="section-header">
            <h2 className="h2">Videos in this Chapter</h2>
            <p className="section-subtitle">
              {videos.length} video{videos.length !== 1 ? 's' : ''} covering all concepts
            </p>
          </div>
          
          {videos.length > 0 ? (
            <div className="chapter-videos-grid">
              {videos.map((video, index) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  className="chapter-video-card card card-interactive"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="chapter-video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="chapter-video-overlay" />
                    <span className="chapter-video-duration">
                      <ClockIcon /> {video.duration}
                    </span>
                    <div className="chapter-video-play">
                      <PlayIcon />
                    </div>
                    <div className="chapter-video-number">{index + 1}</div>
                  </div>
                  <div className="chapter-video-content">
                    <h3 className="chapter-video-title">{video.title}</h3>
                    <p className="chapter-video-description">
                      {video.description?.slice(0, 100)}...
                    </p>
                    <div className="chapter-video-meta">
                      <span className="chapter-video-stat">
                        <EyeIcon />
                        {formatViews(video.views)} views
                      </span>
                      <span className="chapter-video-stat">
                        <CalendarIcon />
                        {formatDate(video.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BookIcon />
              <h3>No Videos Available</h3>
              <p>Videos for this chapter will be added soon.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default ChapterPage;
