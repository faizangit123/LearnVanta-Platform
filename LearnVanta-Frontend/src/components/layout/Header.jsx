import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { navLinks } from "../../data/mockData.js";
import SearchAutocomplete from "../SearchAutocomplete.jsx";

// Icons
const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" x2="9" y1="12" y2="12"></line>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line>
  </svg>
);

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isAdmin = user?.is_admin === true;
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsClassDropdownOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); setIsUserDropdownOpen(false); };
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: isScrolled ? 'hsl(var(--card))' : 'transparent',
      borderBottom: isScrolled ? '1px solid hsl(var(--border))' : 'none',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.2s',
    },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' },
    content: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' },
    logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'hsl(var(--foreground))' },
    logoIcon: { width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
    logoText: { fontSize: '1.25rem', fontWeight: 700 },
    nav: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    navLink: { padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground-secondary))', textDecoration: 'none', transition: 'all 0.2s' },
    dropdown: { position: 'relative' },
    dropdownToggle: { display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground-secondary))', background: 'none', border: 'none', cursor: 'pointer' },
    dropdownIcon: { transition: 'transform 0.2s', transform: isClassDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' },
    dropdownMenu: { position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', minWidth: '12rem', backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 50 },
    dropdownItem: { display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'hsl(var(--foreground))', textDecoration: 'none', transition: 'background-color 0.15s' },
    actions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    iconBtn: { width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--foreground-secondary))', transition: 'all 0.2s' },
    authLinks: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    loginLink: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground-secondary))', textDecoration: 'none' },
    userBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' },
    avatar: { width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary-foreground))', fontSize: '0.875rem', fontWeight: 600 },
    userName: { fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground))' },
    userMenuHeader: { padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid hsl(var(--border))' },
    avatarLg: { width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary-foreground))', fontSize: '1rem', fontWeight: 600 },
    menuName: { fontWeight: 600, color: 'hsl(var(--foreground))' },
    menuEmail: { fontSize: '0.75rem', color: 'hsl(var(--foreground-secondary))' },
    logoutItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'hsl(var(--destructive))', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' },
    menuToggle: { display: 'none', width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--foreground))' },
    mobileMenu: { position: 'fixed', top: '4rem', left: 0, right: 0, bottom: 0, backgroundColor: 'hsl(var(--card))', borderTop: '1px solid hsl(var(--border))', overflowY: 'auto', zIndex: 40 },
    mobileContent: { padding: '1rem' },
    mobileSearch: { marginBottom: '1.5rem' },
    mobileSection: { marginBottom: '1.5rem' },
    mobileLabel: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--foreground-secondary))', marginBottom: '0.5rem' },
    mobileLink: { display: 'block', padding: '0.75rem 0', fontSize: '1rem', color: 'hsl(var(--foreground))', textDecoration: 'none', borderBottom: '1px solid hsl(var(--border))' },
    mobileDivider: { height: '1px', backgroundColor: 'hsl(var(--border))', margin: '1rem 0' },
    mobileUserInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' },
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.content}>
            <Link to="/" style={styles.logo}>
              <div style={styles.logoIcon}><GraduationCapIcon /></div>
              <span style={styles.logoText}>LearVanta</span>
            </Link>

            <nav style={{ ...styles.nav, display: 'none' }} className="nav-desktop">
              <div style={styles.dropdown} ref={dropdownRef}>
                <button onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)} style={styles.dropdownToggle} className="quick-links-toggle">
                  Classes <span style={styles.dropdownIcon}><ChevronDownIcon /></span>
                </button>
                {isClassDropdownOpen && (
                  <div style={styles.dropdownMenu} className="classes-dropdown">
                    {navLinks.classes.map((item) => (
                      <Link 
                        key={item.id} 
                        to={item.href} 
                        style={styles.dropdownItem}
                        className="dropdown-item"
                        onClick={() => setIsClassDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/videos" style={styles.navLink} className="nav-link">Videos</Link>
              <Link to="/playlists" style={styles.navLink} className="nav-link">Playlists</Link>
              <Link to="/history" style={styles.navLink} className="nav-link">History</Link>
              <Link to="/favorites" style={styles.navLink} className="nav-link">Favorites</Link>
              <Link to="/notes" style={styles.navLink} className="nav-link">Notes</Link>
              {isAdmin && (
                <Link to="/admin" style={{ ...styles.navLink, color: 'var(--primary)', fontWeight: 600 }} className="nav-link admin-link">
                  Admin Dashboard
                </Link>
              )}
            </nav>

            <div style={{ display: 'none' }} className="header-search-desktop">
              <SearchAutocomplete placeholder="Search videos, subjects..." />
            </div>

            <div style={styles.actions}>
              <button onClick={toggleTheme} style={styles.iconBtn} aria-label="Toggle theme" className="icon-btn">
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </button>

              <div style={{ ...styles.authLinks, display: 'none' }} className="auth-links">
                {isAuthenticated ? (
                  <div style={styles.dropdown} ref={userDropdownRef}>
                    <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} style={styles.userBtn}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ ...styles.avatar, objectFit: 'cover' }} />
                      ) : (
                        <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
                      )}
                      <span style={styles.userName}>{user?.name || "User"}</span>
                    </button>
                    {isUserDropdownOpen && (
                      <div style={{ ...styles.dropdownMenu, right: 0, left: 'auto' }}>
                        <div style={styles.userMenuHeader}>
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} style={{ ...styles.avatarLg, objectFit: 'cover' }} />
                          ) : (
                            <div style={styles.avatarLg}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
                          )}
                          <div>
                            <p style={styles.menuName}>{user?.name}</p>
                            <p style={styles.menuEmail}>{user?.email}</p>
                          </div>
                        </div>
                        <Link to="/profile" style={styles.dropdownItem} onClick={() => setIsUserDropdownOpen(false)} className="dropdown-item">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserIcon /> My Profile</span>
                        </Link>
                        <Link to="/notes" style={styles.dropdownItem} onClick={() => setIsUserDropdownOpen(false)} className="dropdown-item">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserIcon /> My Notes</span>
                        </Link>
                        <button onClick={handleLogout} style={styles.logoutItem} className="dropdown-item">
                          <LogOutIcon /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login" style={styles.loginLink} className="login-link"><LogInIcon /><span>Login</span></Link>
                    <Link to="/register" className="btn btn-primary btn-md btn-rounded">Get Started</Link>
                  </>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={styles.menuToggle} aria-label="Toggle menu" className="menu-toggle">
                 ☰ {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <div style={{ ...styles.container, ...styles.mobileContent }}>
            <div style={styles.mobileSearch}>
              <SearchAutocomplete placeholder="Search videos, subjects..." onClose={closeMobileMenu} isMobile={true} />
            </div>
            <nav>
              <div style={styles.mobileSection}>
                <p style={styles.mobileLabel}>Classes</p>
                {navLinks.classes.map((item) => (
                  <Link key={item.id} to={item.href} style={styles.mobileLink}>{item.name}</Link>
                ))}
              </div>
              <div style={styles.mobileDivider}></div>
              <div style={styles.mobileSection}>
                <Link to="/videos" style={styles.mobileLink}>All Videos</Link>
                <Link to="/playlists" style={styles.mobileLink}>My Playlists</Link>
                <Link to="/history" style={styles.mobileLink}>Watch History</Link>
                <Link to="/favorites" style={styles.mobileLink}>Favorites</Link>
                <Link to="/notes" style={styles.mobileLink}>Notes & Resources</Link>
                {isAdmin && (
                  <Link to="/admin" style={{ ...styles.mobileLink, color: 'var(--primary)', fontWeight: 600 }}>
                    Admin Dashboard
                  </Link>
                )}
              </div>
              <div style={styles.mobileDivider}></div>
              <div style={styles.mobileSection}>
                {isAuthenticated ? (
                  <>
                    <div style={styles.mobileUserInfo}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ ...styles.avatarLg, objectFit: 'cover' }} />
                      ) : (
                        <div style={styles.avatarLg}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
                      )}
                      <div>
                        <p style={styles.menuName}>{user?.name}</p>
                        <p style={styles.menuEmail}>{user?.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" style={{ ...styles.mobileLink, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserIcon /> My Profile
                    </Link>
                    <button onClick={handleLogout} style={{ ...styles.mobileLink, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--destructive)' }}>
                      <LogOutIcon /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{ ...styles.mobileLink, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LogInIcon /> Login</Link>
                    <Link to="/register" style={{ display: 'block', marginTop: '0.5rem' }}>
                      <span className="btn btn-primary" style={{ display: 'block', padding: '0.75rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>Get Started Free</span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .header-search-desktop { display: block !important; }
          .auth-links { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
        .nav-link:hover { background-color: hsl(var(--secondary)); color: hsl(var(--foreground)); }
        .dropdown-item:hover { background-color: hsl(var(--secondary)); }
        .icon-btn:hover { background-color: hsl(var(--secondary)); color: hsl(var(--foreground)); }
        .login-link:hover { color: hsl(var(--foreground)); }
        
        .classes-dropdown {
          animation: dropdownEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top center;
        }
        
        @keyframes dropdownEnter {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .classes-dropdown .dropdown-item {
          opacity: 0;
          animation: itemSlideIn 0.2s ease-out forwards;
        }
        
        .classes-dropdown .dropdown-item:nth-child(1) { animation-delay: 0.03s; }
        .classes-dropdown .dropdown-item:nth-child(2) { animation-delay: 0.06s; }
        .classes-dropdown .dropdown-item:nth-child(3) { animation-delay: 0.09s; }
        .classes-dropdown .dropdown-item:nth-child(4) { animation-delay: 0.12s; }
        .classes-dropdown .dropdown-item:nth-child(5) { animation-delay: 0.15s; }
        .classes-dropdown .dropdown-item:nth-child(6) { animation-delay: 0.18s; }
        
        @keyframes itemSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-8px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;
