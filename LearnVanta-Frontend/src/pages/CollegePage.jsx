import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { subjects, chapters, videos, getVideosBySubject } from "../data/mockData";

// Icons
const GraduationCapIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
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

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const getSubjectIcon = (iconName) => {
  const icons = {
    Calculator: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
      </svg>
    ),
    Grid: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
    Binary: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="14" width="4" height="6" rx="2" />
        <rect x="6" y="4" width="4" height="6" rx="2" />
        <path d="M6 20v-4" />
        <path d="M14 10V4" />
      </svg>
    ),
    BarChart: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
      </svg>
    ),
  };
  const IconComponent = icons[iconName] || icons.Calculator;
  return <IconComponent />;
};

const CollegePage = () => {
  const collegeSubjects = subjects.filter(s => s.classId === "college");
  const totalVideos = collegeSubjects.reduce((acc, s) => acc + s.videoCount, 0);
  const totalChapters = collegeSubjects.reduce((acc, s) => acc + s.chapterCount, 0);

  const features = [
    {
      icon: <AwardIcon />,
      title: "Industry-Ready Content",
      description: "Curriculum designed for real-world applications and career success"
    },
    {
      icon: <TargetIcon />,
      title: "Exam Focused",
      description: "Comprehensive preparation for university exams and competitive tests"
    },
    {
      icon: <ClockIcon />,
      title: "Learn at Your Pace",
      description: "Flexible learning with lifetime access to all course materials"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="college-hero">
        <div className="container">
          <div className="college-hero-content">
            <div className="college-hero-badge">
              <GraduationCapIcon />
            </div>
            <h1 className="college-hero-title">
              <span className="gradient-text">College & University</span>
              <br />
              Mathematics
            </h1>
            <p className="college-hero-subtitle">
              Advanced mathematics courses designed for undergraduate and postgraduate students. 
              Master calculus, linear algebra, discrete math, and statistics with expert-led video lessons.
            </p>
            
            <div className="college-hero-stats">
              <div className="college-stat">
                <div className="college-stat-value">{collegeSubjects.length}</div>
                <div className="college-stat-label">Courses</div>
              </div>
              <div className="college-stat">
                <div className="college-stat-value">{totalChapters}+</div>
                <div className="college-stat-label">Chapters</div>
              </div>
              <div className="college-stat">
                <div className="college-stat-value">{totalVideos}+</div>
                <div className="college-stat-label">Videos</div>
              </div>
              <div className="college-stat">
                <div className="college-stat-value">3.5K+</div>
                <div className="college-stat-label">Students</div>
              </div>
            </div>

            <div className="college-hero-actions">
              <a href="#courses" className="btn btn-primary btn-lg btn-rounded">
                <PlayCircleIcon /> Explore Courses
              </a>
              <Link to="/videos" className="btn btn-outline btn-lg btn-rounded">
                Browse All Videos
              </Link>
            </div>
          </div>
        </div>
        <div className="college-hero-bg"></div>
      </section>

      {/* Features Section */}
      <section className="college-features">
        <div className="container">
          <div className="college-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="college-feature-card">
                <div className="college-feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="college-courses">
        <div className="container">
          <div className="section-header">
            <h2 className="h2">Available Courses</h2>
            <p className="section-subtitle">Choose from our comprehensive collection of university-level mathematics courses</p>
          </div>

          <div className="college-courses-grid">
            {collegeSubjects.map((subject, index) => {
              const subjectChapters = chapters.filter(ch => ch.subjectId === subject.id);
              return (
                <Link
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className="college-course-card card card-interactive"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="college-course-header">
                    <div className={`college-course-icon ${subject.isPrimary ? 'primary' : 'secondary'}`}>
                      {getSubjectIcon(subject.icon)}
                    </div>
                    {subject.isPrimary && (
                      <span className="college-course-badge">
                        <TrendingUpIcon /> Core Subject
                      </span>
                    )}
                  </div>
                  
                  <h3 className="college-course-title">{subject.name}</h3>
                  <p className="college-course-description">{subject.description}</p>
                  
                  <div className="college-course-meta">
                    <div className="college-course-stat">
                      <BookIcon />
                      <span>{subject.chapterCount} Chapters</span>
                    </div>
                    <div className="college-course-stat">
                      <PlayCircleIcon />
                      <span>{subject.videoCount} Videos</span>
                    </div>
                  </div>

                  <div className="college-course-footer">
                    <span>Start Learning</span>
                    <ChevronRightIcon />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="college-why">
        <div className="container">
          <div className="college-why-content">
            <div className="college-why-text">
              <h2 className="h2">Why Choose EduStream for College Math?</h2>
              <ul className="college-why-list">
                <li>
                  <span className="check-icon">✓</span>
                  Expert faculty with years of teaching experience
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Step-by-step problem solving approach
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Practice problems with detailed solutions
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Perfect for GATE, NET, and university exams
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Access on any device, anytime
                </li>
              </ul>
              <Link to="/videos" className="btn btn-primary btn-md btn-rounded">
                <PlayCircleIcon /> Start Learning Now
              </Link>
            </div>
            <div className="college-why-visual">
              <div className="college-visual-card">
                <div className="college-visual-icon">
                  <UsersIcon />
                </div>
                <div className="college-visual-number">3,500+</div>
                <div className="college-visual-label">Active Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CollegePage;
