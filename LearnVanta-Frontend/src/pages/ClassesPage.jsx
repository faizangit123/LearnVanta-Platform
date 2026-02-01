import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { classes, subjects } from "../data/mockData";

// Icons
const GraduationCapIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const getColorClass = (color) => {
  const colorMap = {
    blue: "class-card-blue",
    purple: "class-card-purple",
    green: "class-card-green",
    orange: "class-card-orange",
    red: "class-card-red",
    indigo: "class-card-indigo",
  };
  return colorMap[color] || "class-card-blue";
};

const ClassesPage = () => {
  // Get subject count for each class
  const getSubjectCount = (classId) => {
    return subjects.filter(s => s.classId === classId).length;
  };

  // Get total video count for a class
  const getVideoCount = (classId) => {
    return subjects
      .filter(s => s.classId === classId)
      .reduce((total, s) => total + s.videoCount, 0);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="classes-hero">
        <div className="container">
          <div className="classes-hero-content">
            <div className="classes-hero-icon">
              <GraduationCapIcon />
            </div>
            <h1>Choose Your Class</h1>
            <p>Select your class to explore subjects, chapters, and video lessons tailored for your curriculum.</p>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="section">
        <div className="container">
          <div className="classes-page-grid">
            {classes.map((classItem, index) => (
              <Link
                key={classItem.id}
                to={`/class/${classItem.id}`}
                className={`class-page-card card card-interactive ${getColorClass(classItem.color)}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="class-card-header">
                  <div className={`class-card-badge ${classItem.color}`}>
                    {classItem.grade === "UG/PG" ? "University" : `Grade ${classItem.grade}`}
                  </div>
                  {classItem.id === "class-10" || classItem.id === "class-12" ? (
                    <span className="class-card-popular">
                      <StarIcon /> Popular
                    </span>
                  ) : null}
                </div>

                <h2 className="class-card-title">{classItem.name}</h2>
                <p className="class-card-description">{classItem.description}</p>

                <div className="class-card-stats">
                  <div className="class-stat">
                    <BookIcon />
                    <span>{getSubjectCount(classItem.id)} Subjects</span>
                  </div>
                  <div className="class-stat">
                    <PlayCircleIcon />
                    <span>{getVideoCount(classItem.id)}+ Videos</span>
                  </div>
                  <div className="class-stat">
                    <UsersIcon />
                    <span>{classItem.studentCount.toLocaleString()} Students</span>
                  </div>
                </div>

                <div className="class-card-cta">
                  <span>Explore Class</span>
                  <ArrowRightIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="classes-features">
            <div className="classes-feature">
              <div className="feature-icon blue">
                <PlayCircleIcon />
              </div>
              <h3>HD Video Lessons</h3>
              <p>Crystal clear explanations for every concept</p>
            </div>
            <div className="classes-feature">
              <div className="feature-icon green">
                <BookIcon />
              </div>
              <h3>NCERT Aligned</h3>
              <p>Content follows CBSE curriculum</p>
            </div>
            <div className="classes-feature">
              <div className="feature-icon purple">
                <StarIcon />
              </div>
              <h3>Teacher</h3>
              <p>Learn from experienced educator</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ClassesPage;
