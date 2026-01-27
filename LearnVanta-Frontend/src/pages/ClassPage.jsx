import React from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { getClassById, getSubjectsByClass } from "../data/mockData";

// Icons
const BookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

const FolderIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CalculatorIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="14" x2="16" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
);

const AtomIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const AwardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const TargetIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const getSubjectIcon = (iconName) => {
  switch (iconName) {
    case "Calculator":
      return <CalculatorIcon />;
    case "Atom":
      return <AtomIcon />;
    default:
      return <BookIcon />;
  }
};

const getColorGradient = (color) => {
  const gradients = {
    blue: "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(200, 85%, 50%))",
    purple: "linear-gradient(135deg, hsl(258, 90%, 66%), hsl(280, 80%, 55%))",
    green: "linear-gradient(135deg, hsl(142, 71%, 45%), hsl(160, 84%, 39%))",
    orange: "linear-gradient(135deg, hsl(38, 92%, 50%), hsl(25, 95%, 53%))",
    red: "linear-gradient(135deg, hsl(0, 84%, 60%), hsl(350, 80%, 50%))",
    indigo: "linear-gradient(135deg, hsl(239, 84%, 67%), hsl(260, 80%, 60%))",
  };
  return gradients[color] || gradients.blue;
};

const ClassPage = () => {
  const { classId } = useParams();
  const classData = getClassById(classId);
  const allSubjects = getSubjectsByClass(classId);

  // Separate primary (Maths) and secondary subjects
  const primarySubjects = allSubjects.filter((s) => s.isPrimary);
  const secondarySubjects = allSubjects.filter((s) => !s.isPrimary);

  // Calculate totals
  const totalVideos = allSubjects.reduce((acc, s) => acc + s.videoCount, 0);
  const totalChapters = allSubjects.reduce((acc, s) => acc + s.chapterCount, 0);

  const features = [
    {
      icon: <AwardIcon />,
      title: "NCERT Aligned",
      description: "Complete syllabus coverage following NCERT guidelines",
    },
    {
      icon: <TargetIcon />,
      title: "Exam Focused",
      description: "Targeted preparation for board and competitive exams",
    },
    {
      icon: <ClockIcon />,
      title: "Learn Anytime",
      description: "Access lessons 24/7 on any device at your convenience",
    },
  ];

  if (!classData) {
    return (
      <MainLayout>
        <section className="section">
          <div className="container">
            <div className="not-found-content">
              <h1>Class Not Found</h1>
              <p>The class you're looking for doesn't exist.</p>
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
      <section className="class-hero">
        <div className="container">
          <div className="class-hero-content">
            <nav className="breadcrumb class-breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/classes" className="breadcrumb-link">
                Classes
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{classData.name}</span>
            </nav>

            <div className="class-hero-badge" style={{ background: getColorGradient(classData.color) }}>
              <GraduationCapIcon />
            </div>

            <h1 className="class-hero-title">
              <span
                className="gradient-text"
                style={{
                  background: getColorGradient(classData.color),
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {classData.name}
              </span>
              <br />
              <span style={{ fontSize: "0.5em", fontWeight: 500, color: "hsl(var(--foreground-secondary))" }}>
                {classData.description}
              </span>
            </h1>

            <div className="class-hero-stats">
              <div className="class-stat">
                <div
                  className="class-stat-value"
                  style={{
                    background: getColorGradient(classData.color),
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {allSubjects.length}
                </div>
                <div className="class-stat-label">Subjects</div>
              </div>
              <div className="class-stat">
                <div
                  className="class-stat-value"
                  style={{
                    background: getColorGradient(classData.color),
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {totalChapters}+
                </div>
                <div className="class-stat-label">Chapters</div>
              </div>
              <div className="class-stat">
                <div
                  className="class-stat-value"
                  style={{
                    background: getColorGradient(classData.color),
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {totalVideos}+
                </div>
                <div className="class-stat-label">Videos</div>
              </div>
              <div className="class-stat">
                <div
                  className="class-stat-value"
                  style={{
                    background: getColorGradient(classData.color),
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {(classData.studentCount / 1000).toFixed(1)}K+
                </div>
                <div className="class-stat-label">Students</div>
              </div>
            </div>

            <div className="class-hero-actions">
              <a href="#subjects" className="btn btn-primary btn-lg btn-rounded">
                <PlayCircleIcon /> Start Learning
              </a>
              <Link to="/videos" className="btn btn-outline btn-lg btn-rounded">
                Browse Videos
              </Link>
            </div>
          </div>
        </div>
        <div
          className="class-hero-bg"
          style={{
            background: `
            radial-gradient(circle at 20% 80%, ${getColorGradient(classData.color).replace("linear-gradient(135deg, ", "").split(",")[0]}15 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${getColorGradient(classData.color).replace("linear-gradient(135deg, ", "").split(",")[0]}15 0%, transparent 50%)
          `,
          }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="class-features">
        <div className="container">
          <div className="class-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="class-feature-card">
                <div
                  className="class-feature-icon"
                  style={{
                    background: `${getColorGradient(classData.color).replace("linear-gradient(135deg, ", "").split(",")[0]}15`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Subjects (Mathematics) */}
      {primarySubjects.length > 0 && (
        <section id="subjects" className="class-subjects">
          <div className="container">
            <div className="section-header">
              <h2 className="h2">
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Mathematics
                </span>{" "}
                - Core Subject
              </h2>
              <p className="section-subtitle">Our primary focus with comprehensive coverage</p>
            </div>

            <div className="class-subjects-grid primary">
              {primarySubjects.map((subject, index) => (
                <Link
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className="class-subject-card card card-interactive primary"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="class-subject-header">
                    <div className="class-subject-icon primary">{getSubjectIcon(subject.icon)}</div>
                    <span className="class-subject-badge primary">
                      <StarIcon /> Core Subject
                    </span>
                  </div>

                  <h3 className="class-subject-title">{subject.name}</h3>
                  <p className="class-subject-description">{subject.description}</p>

                  <div className="class-subject-meta">
                    <div className="class-subject-stat">
                      <FolderIcon />
                      <span>{subject.chapterCount} Chapters</span>
                    </div>
                    <div className="class-subject-stat">
                      <PlayCircleIcon />
                      <span>{subject.videoCount} Videos</span>
                    </div>
                  </div>

                  <div className="class-subject-footer">
                    <span>Start Learning</span>
                    <ChevronRightIcon />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secondary Subjects */}
      {secondarySubjects.length > 0 && (
        <section className="class-subjects secondary-section">
          <div className="container">
            <div className="section-header">
              <h2 className="h2">Other Subjects</h2>
              <p className="section-subtitle">Additional subjects to complement your learning</p>
            </div>

            <div className="class-subjects-grid">
              {secondarySubjects.map((subject, index) => (
                <Link
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className="class-subject-card card card-interactive"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="class-subject-header">
                    <div className="class-subject-icon secondary">{getSubjectIcon(subject.icon)}</div>
                  </div>

                  <h3 className="class-subject-title">{subject.name}</h3>
                  <p className="class-subject-description">{subject.description}</p>

                  <div className="class-subject-meta">
                    <div className="class-subject-stat">
                      <FolderIcon />
                      <span>{subject.chapterCount} Chapters</span>
                    </div>
                    <div className="class-subject-stat">
                      <PlayCircleIcon />
                      <span>{subject.videoCount} Videos</span>
                    </div>
                  </div>

                  <div className="class-subject-footer">
                    <span>View Subject</span>
                    <ChevronRightIcon />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="class-why">
        <div className="container">
          <div className="class-why-content">
            <div className="class-why-text">
              <h2 className="h2">Why Choose {classData.name}?</h2>
              <ul className="class-why-list">
                <li>
                  <span className="check-icon">✓</span>
                  Expert teachers with years of experience
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Complete NCERT syllabus coverage
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Practice questions with solutions
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  HD video lessons with clear explanations
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Track your progress and take notes
                </li>
              </ul>
              <a href="#subjects" className="btn btn-primary btn-md btn-rounded">
                <PlayCircleIcon /> Start Learning Now
              </a>
            </div>
            <div className="class-why-visual">
              <div className="class-visual-card" style={{ background: getColorGradient(classData.color) }}>
                <div className="class-visual-icon">
                  <UsersIcon />
                </div>
                <div className="class-visual-number">{classData.studentCount.toLocaleString()}+</div>
                <div className="class-visual-label">Active Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Subjects */}
      {allSubjects.length === 0 && (
        <section className="section">
          <div className="container">
            <div className="empty-state">
              <BookIcon />
              <h3>No Subjects Available</h3>
              <p>Subjects for this class will be added soon.</p>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ClassPage;
