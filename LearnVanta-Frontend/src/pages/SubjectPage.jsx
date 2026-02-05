import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { apiRequest } from "../config/api";



// Icons
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LayersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);


const formatViews = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};
const SubjectPage = () => {
  const { subjectId } = useParams();

  const [subject, setSubject] = useState(null);
  const [classData, setClassData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);

    // REAL BACKEND LOAD
  useEffect(() => {
    Promise.all([
      apiRequest(`/content/subjects/${subjectId}/`),
      apiRequest(`/content/chapters/?subject=${subjectId}`),
      apiRequest(`/content/videos/?subject=${subjectId}`),
    ])
      .then(([subjectData, chaptersData, videosData]) => {
        setSubject(subjectData);
        setClassData(subjectData.class_ref);
        setChapters(chaptersData || []);
        setVideos(videosData || []);
      })
      .catch(() => {
        setSubject(null);
      });
  }, [subjectId]);

  //  if (!subject || !classData) {
  //   return (
  //     <MainLayout>
  //       <div className="container">
  //         <h1>Subject Not Found</h1>
  //         <Link to="/">Go Home</Link>
  //       </div>
  //     </MainLayout>
  //   );
  // }
  
  // Calculate totals
  // const totalVideos = chapters.reduce((acc, ch) => acc + ch.videoCount, 0);
  // const totalViews = chapters.reduce((acc, ch) => {
  //   const chapterVideos = getVideosByChapter(ch.id);
  //   return acc + chapterVideos.reduce((sum, v) => sum + v.views, 0);
  // }, 0);

    const totalViews = videos.reduce((acc, v) => acc + v.views, 0);


  const features = [
    {
      icon: <AwardIcon />,
      title: "Expert Content",
      description: "Lessons created by experienced educators"
    },
    {
      icon: <TargetIcon />,
      title: "Concept Clarity",
      description: "Step-by-step explanations for every topic"
    },
    {
      icon: <ClockIcon />,
      title: "Self-Paced",
      description: "Learn at your own speed, revisit anytime"
    }
  ];

  if (!subject || !classData) {
    return (
      <MainLayout>
        <section className="section">
          <div className="container">
            <div className="not-found-content">
              <h1>Subject Not Found</h1>
              <p>The subject you're looking for doesn't exist.</p>
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
      <section className="subject-hero">
        <div className="container">
          <div className="subject-hero-content">
            <nav className="breadcrumb subject-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to={`/class/${classData.id}`} className="breadcrumb-link">{classData.name}</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{subject.name}</span>
            </nav>
            
            <div className={`subject-hero-badge ${subject.isPrimary ? 'primary' : 'secondary'}`}>
              <BookOpenIcon />
            </div>
            
            <div className="subject-hero-tags">
              <span className="badge badge-primary">{classData.name}</span>
              {subject.isPrimary && (
                <span className="badge badge-accent">
                  <StarIcon /> Primary Subject
                </span>
              )}
            </div>
            
            <h1 className="subject-hero-title">
              <span className={subject.isPrimary ? 'gradient-text-primary' : 'gradient-text-secondary'}>
                {subject.name}
              </span>
            </h1>
            <p className="subject-hero-subtitle">{subject.description}</p>
            
            <div className="subject-hero-stats">
              <div className="subject-stat">
                <div className="subject-stat-value">{chapters.length}</div>
                <div className="subject-stat-label">Chapters</div>
              </div>
              <div className="subject-stat">
                <div className="subject-stat-value">{videos.length}</div>
                <div className="subject-stat-label">Videos</div>
              </div>
              <div className="subject-stat">
                <div className="subject-stat-value">{formatViews(totalViews)}</div>
                <div className="subject-stat-label">Total Views</div>
              </div>
            </div>

            <div className="subject-hero-actions">
              <a href="#chapters" className="btn btn-primary btn-lg btn-rounded">
                <PlayCircleIcon /> Start Learning
              </a>
              <Link to={`/class/${classData.id}`} className="btn btn-outline btn-lg btn-rounded">
                View All Subjects
              </Link>
            </div>
          </div>
        </div>
        <div className="subject-hero-bg"></div>
      </section>

      {/* Features Section */}
      <section className="subject-features">
        <div className="container">
          <div className="subject-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="subject-feature-card">
                <div className="subject-feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section id="chapters" className="subject-chapters">
        <div className="container">
          <div className="section-header">
            <h2 className="h2">All Chapters</h2>
            <p className="section-subtitle">
              {chapters.length} chapters covering the complete syllabus
            </p>
          </div>

          {chapters.length > 0 ? (
            <div className="subject-chapters-list">
              {chapters.map((chapter, index) => {
               const chapterVideos = videos.filter(v => v.chapter === chapter.id);
               const chapterViews = chapterVideos.reduce((acc, v) => acc + v.views, 0);
                return (
                  <Link
                    key={chapter.id}
                    to={`/chapter/${chapter.id}`}
                    className="subject-chapter-card card card-interactive"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="subject-chapter-number">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="subject-chapter-content">
                      <h3 className="subject-chapter-title">{chapter.name}</h3>
                      <p className="subject-chapter-description">{chapter.description}</p>
                      <div className="subject-chapter-meta">
                        <span className="subject-chapter-stat">
                          <PlayCircleIcon />
                         {chapterVideos.length} Videos
                        </span>
                        {chapterVideos.length > 0 && (
                          <span className="subject-chapter-stat">
                            <EyeIcon />
                            {formatViews(chapterViews)} views
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="subject-chapter-arrow">
                      <ChevronRightIcon />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <LayersIcon />
              <h3>No Chapters Available</h3>
              <p>Chapters for this subject will be added soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Section */}
      {chapters.length > 0 && (
        <section className="subject-why">
          <div className="container">
            <div className="subject-why-content">
              <div className="subject-why-text">
                <h2 className="h2">Master {subject.name}</h2>
                <ul className="subject-why-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Comprehensive coverage of all topics
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    HD video lessons with detailed explanations
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Practice problems with solutions
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Download notes and resources
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Track your learning progress
                  </li>
                </ul>
                <a href="#chapters" className="btn btn-primary btn-md btn-rounded">
                  <PlayCircleIcon /> Start First Chapter
                </a>
              </div>
              <div className="subject-why-visual">
                <div className={`subject-visual-card ${subject.isPrimary ? 'primary' : 'secondary'}`}>
                  <div className="subject-visual-icon">
                    <BookIcon />
                  </div>
                  <div className="subject-visual-number">{chapters.length}</div>
                  <div className="subject-visual-label">Chapters Ready</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default SubjectPage;
