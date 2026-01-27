import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout";

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);

const values = [
  {
    icon: <TargetIcon />,
    title: "Excellence",
    description: "We strive for excellence in every video, ensuring clarity and depth in our explanations."
  },
  {
    icon: <HeartIcon />,
    title: "Passion",
    description: "Our educators are passionate about teaching and making complex topics accessible to all."
  },
  {
    icon: <UsersIcon />,
    title: "Community",
    description: "We believe in building a supportive community where students help each other grow."
  },
  {
    icon: <LightbulbIcon />,
    title: "Innovation",
    description: "We continuously innovate our teaching methods to make learning more engaging and effective."
  },
];

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "500+", label: "Video Lessons" },
  { value: "15+", label: "Expert Teachers" },
  { value: "98%", label: "Success Rate" },
];

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="static-page">
        {/* Hero Section */}
        <section className="static-hero about-hero">
          <div className="container">
            <div className="static-hero-content">
              <div className="hero-icon">
                <GraduationCapIcon />
              </div>
              <h1>About EduStream</h1>
              <p>
                Empowering students across India with quality education through 
                engaging video lessons and comprehensive study materials.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="static-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2>Our Mission</h2>
                <p>
                  At EduStream, we believe that quality education should be accessible to every 
                  student, regardless of their location or background. Our mission is to bridge 
                  the gap between students and world-class education through technology.
                </p>
                <p>
                  We focus primarily on Mathematics because we understand that a strong 
                  foundation in math opens doors to countless opportunities. From basic 
                  concepts to advanced topics, we ensure our students are well-prepared 
                  for board exams, competitive exams, and beyond.
                </p>
                <Link to="/class/class-10" className="btn btn-primary btn-lg">
                  Start Learning
                </Link>
              </div>
              <div className="mission-image">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" 
                  alt="Students learning together" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="static-section stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="static-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Values</h2>
              <p>The principles that guide everything we do</p>
            </div>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="static-section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Start Learning?</h2>
              <p>Join thousands of students who are already learning with EduStream</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/contact" className="btn btn-outline btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
