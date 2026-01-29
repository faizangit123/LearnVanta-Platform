import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout/index.js";
import { classes, testimonials, getTrendingVideos, getRecentVideos, formatViews, formatDate } from "../data/mockData.js";
import { useWatchHistory } from "../hooks/useWatchHistory.js";
import { useAuth } from "../context/AuthContext.jsx";

// Icons
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const StarIcon = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"></path></svg>;
const AwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;

const Home = () => {
  const trendingVideos = getTrendingVideos();
  const recentVideos = getRecentVideos();
  const { history, isLoading: historyLoading } = useWatchHistory();
  const { isAuthenticated } = useAuth();

  const styles = {
    iconWrapper: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsla(var(--primary-hsl), 0.1)',
    },
    sectionSubtitle: {
      color: 'var(--foreground-secondary)',
      fontSize: '0.875rem',
    },
    videoCard: {
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '3px',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    progressFill: {
      height: '100%',
      backgroundColor: 'var(--primary)',
      transition: 'width 0.3s',
    },
    progressText: {
      fontSize: '0.75rem',
      color: 'var(--foreground-secondary)',
      marginTop: '0.25rem',
    },
    dateTag: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-gradient"></div>
        <div className="hero-content container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-badge"><StarIcon filled /> <span>Learning platforms</span></div>
              <h1 className="hero-title">Learn Smarter, <span className="gradient-text">Score Higher</span></h1>
              <p className="hero-description">Quality education for Class 8-12 and College students. Expert video lessons, comprehensive notes, and exam-focused content.</p>
              <div className="hero-actions">
                <Link to="/classes" className="btn btn-primary btn-lg btn-rounded"><span>Start Learning Free</span><ArrowRightIcon /></Link>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg btn-rounded"><PlayIcon /><span>Watch on YouTube</span></a>
              </div>
              <div className="hero-stats">
                <div><p className="stat-value">500+</p><p className="stat-label">Video Lessons</p></div>
                <div><p className="stat-value">50K+</p><p className="stat-label">Students</p></div>
                <div><p className="stat-value">4.9</p><p className="stat-label">Rating</p></div>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <div className="hero-image-card"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Students learning" /><div className="hero-image-overlay"></div></div>
              </div>
              <div className="hero-decorative-1"></div>
              <div className="hero-decorative-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Watching Section - Only for authenticated users */}
      {isAuthenticated && !historyLoading && history.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header-flex">
              <div style={styles.flexCenter}>
                <div style={styles.iconWrapper}>
                  <HistoryIcon />
                </div>
                <div>
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Continue Watching</h2>
                  <p style={styles.sectionSubtitle}>Pick up where you left off</p>
                </div>
              </div>
              <Link to="/continue-watching" className="view-all-link">View All <ArrowRightIcon /></Link>
            </div>
            <div className="grid gap-6 sm-grid-cols-2 md-grid-cols-3 lg-grid-cols-4">
              {history.slice(0, 4).map((item) => (
                <Link key={item.videoId} to={`/video/${item.videoId}`} className="card card-interactive video-card continue-watching-card" style={styles.videoCard}>
                  <div className="video-thumbnail">
                    <img src={item.thumbnail} alt={item.title} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                    <div className="video-overlay"></div>
                    <span className="video-duration">{item.duration}</span>
                    <div className="video-play-btn">
                      <div className="video-play-icon"><PlayIcon /></div>
                    </div>
                    {item.progress > 0 && (
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${item.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                  <div className="video-content">
                    <h3 className="video-title">{item.title}</h3>
                    <div className="video-meta">
                      <span className="video-meta-item"><ClockIcon /> {item.chapterName}</span>
                    </div>
                    {item.progress > 0 && (
                      <p style={styles.progressText}>{item.progress}% watched</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Classes Section */}
      <section className="section">
        <div className="container">
          <div className="section-header"><h2 className="section-title">Choose Your Class</h2><p className="section-description">From Class 8 to College level, we've got comprehensive courses tailored for each grade.</p></div>
          <div className="grid gap-6 sm-grid-cols-2 lg-grid-cols-3">
            {classes.map((classItem) => (
              <Link key={classItem.id} to={`/class/${classItem.id}`} className="card card-interactive class-card" style={styles.videoCard}>
                <div className={`class-icon ${classItem.color}`}>{classItem.grade}</div>
                <h3 className="class-title">{classItem.name}</h3>
                <p className="class-description">{classItem.description}</p>
                <div className="class-meta"><span className="class-meta-item"><BookOpenIcon /> {classItem.subjectCount} Subjects</span><span className="class-meta-item"><UsersIcon /> {(classItem.studentCount / 1000).toFixed(1)}K</span></div>
                <div className="class-cta"><span>Explore</span><ChevronRightIcon /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="section">
        <div className="container">
          <div className="section-header-flex">
            <div style={styles.flexCenter}>
              <div style={styles.iconWrapper}>
                <SparklesIcon />
              </div>
              <div>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Recently Added</h2>
                <p style={styles.sectionSubtitle}>Fresh content just for you</p>
              </div>
            </div>
            <Link to="/videos" className="view-all-link">View All <ArrowRightIcon /></Link>
          </div>
          <div className="grid gap-6 sm-grid-cols-2 md-grid-cols-3 lg-grid-cols-4">
            {recentVideos.slice(0, 4).map((video) => (
              <Link key={video.id} to={`/video/${video.id}`} className="card card-interactive video-card" style={styles.videoCard}>
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="video-overlay"></div>
                  <span className="video-duration">{video.duration}</span>
                  <div className="video-play-btn">
                    <div className="video-play-icon"><PlayIcon /></div>
                  </div>
                </div>
                <div className="video-content">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-meta">
                    <span className="video-meta-item"><EyeIcon /> {formatViews(video.views)}</span>
                    <span className="video-meta-item" style={styles.dateTag}><CalendarIcon /> {formatDate(video.publishedAt)}</span>
                  </div>
                  <div className="video-tags">
                    {video.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge badge-primary">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Videos */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Trending Videos</h2>
              <p style={styles.sectionSubtitle}>Most popular lessons this week</p>
            </div>
            <Link to="/videos" className="view-all-link">View All <ArrowRightIcon /></Link>
          </div>
          <div className="grid gap-6 md-grid-cols-2 lg-grid-cols-3">
            {trendingVideos.slice(0, 6).map((video) => (
              <Link key={video.id} to={`/video/${video.id}`} className="card card-interactive video-card" style={styles.videoCard}>
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="video-overlay"></div>
                  <span className="video-duration">{video.duration}</span>
                  <div className="video-play-btn">
                    <div className="video-play-icon"><PlayIcon /></div>
                  </div>
                </div>
                <div className="video-content">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-meta">
                    <span className="video-meta-item"><EyeIcon /> {formatViews(video.views)}</span>
                    <span className="video-meta-item"><ClockIcon /> {formatDate(video.publishedAt)}</span>
                  </div>
                  <div className="video-tags">
                    {video.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge badge-primary">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header"><h2 className="section-title">Why Students Love Us</h2></div>
          <div className="grid gap-6 md-grid-cols-2 lg-grid-cols-4">
            {[{icon: "blue", title: "HD Video Lessons", desc: "Crystal clear explanations"}, {icon: "green", title: "Comprehensive Notes", desc: "Detailed PDF notes"}, {icon: "purple", title: "Expert Teachers", desc: "Experienced educators"}, {icon: "orange", title: "Exam Focused", desc: "Board exam aligned"}].map((f) => (
              <div key={f.title} className="card feature-card"><div className={`feature-icon ${f.icon}`}><AwardIcon /></div><h4 className="feature-title">{f.title}</h4><p className="feature-description">{f.desc}</p></div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2 className="cta-title">Ready to Start Learning?</h2>
          <p className="cta-description">Join thousands of students improving their grades with our lessons.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-lg btn-rounded cta-btn-primary">Get Started Free</Link>
            <Link to="/classes" className="btn btn-lg btn-rounded cta-btn-secondary">Browse Courses</Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
