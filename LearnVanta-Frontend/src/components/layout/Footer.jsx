import React from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../../data/mockData.js";

// Icons
const GraduationCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path>
  </svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>;
const iconMap = {
  Youtube: <YoutubeIcon />,
  Instagram: <InstagramIcon />,
  Twitter: <TwitterIcon />,
  Facebook: <FacebookIcon />
};
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const styles = {
    footer: {
      backgroundColor: 'var(--card)',
      borderTop: '1px solid var(--border)'
    },
    main: {
      padding: '4rem 0 2rem'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem'
    },
    brand: {
      gridColumn: 'span 1'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      color: 'var(--foreground)',
      marginBottom: '1rem'
    },
    logoIcon: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    brandText: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: 'var(--foreground-secondary)',
      marginBottom: '1.5rem'
    },
    socialLinks: {
      display: 'flex',
      gap: '0.75rem'
    },
    socialLink: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'var(--secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--foreground-secondary)',
      textDecoration: 'none',
      transition: 'all 0.2s'
    },
    section: {
      display: 'flex',
      flexDirection: 'column'
    },
    sectionTitle: {
      fontWeight: 600,
      color: 'var(--foreground)',
      marginBottom: '1rem'
    },
    links: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    link: {
      fontSize: '0.875rem',
      color: 'var(--foreground-secondary)',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    contactIcon: {
      width: '2rem',
      height: '2rem',
      borderRadius: '0.5rem',
      backgroundColor: 'hsla(var(--primary-hsl), 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
      flexShrink: 0
    },
    contactLabel: {
      fontSize: '0.75rem',
      color: 'var(--foreground-secondary)'
    },
    contactValue: {
      fontSize: '0.875rem',
      color: 'var(--foreground)',
      textDecoration: 'none'
    },
    newsletter: {
      marginTop: '3rem',
      padding: '2rem',
      borderRadius: '1rem',
      backgroundColor: 'var(--background)',
      textAlign: 'center'
    },
    newsletterTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: 'var(--foreground)',
      marginBottom: '0.5rem'
    },
    newsletterText: {
      fontSize: '0.875rem',
      color: 'var(--foreground-secondary)',
      marginBottom: '1rem'
    },
    newsletterForm: {
      display: 'flex',
      gap: '0.5rem',
      maxWidth: '24rem',
      margin: '0 auto'
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      borderRadius: '9999px',
      border: '1px solid var(--border)',
      backgroundColor: 'var(--card)',
      color: 'var(--foreground)',
      fontSize: '0.875rem'
    },
    bottom: {
      borderTop: '1px solid var(--border)',
      padding: '1.5rem 0'
    },
    bottomContent: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    },
    copyright: {
      fontSize: '0.875rem',
      color: 'var(--foreground-secondary)'
    },
    madeWith: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.875rem',
      color: 'var(--foreground-secondary)'
    },
    heart: {
      color: 'var(--destructive)'
    }
  };
  return <footer style={styles.footer}>
      <div style={styles.main}>
        <div style={styles.container}>
          <div style={styles.grid}>
            <div style={styles.brand}>
              <Link to="/" style={styles.logo}>
                <div style={styles.logoIcon}><GraduationCapIcon /></div>
                <span style={{
                fontSize: '1.25rem',
                fontWeight: 700
              }}>EduStream</span>
              </Link>
              <p style={styles.brandText}>
                Empowering students with quality education through engaging video lessons, 
                comprehensive notes, and personalized learning experiences.
              </p>
              <div style={styles.socialLinks}>
                {navLinks.footer.social.map(social => <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" style={styles.socialLink} aria-label={social.name} className="social-link">
                    {iconMap[social.icon]}
                  </a>)}
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Quick Links</h3>
              <div style={styles.links}>
                {navLinks.classes.slice(0, 5).map(item => <Link key={item.id} to={item.href} style={styles.link} className="footer-link">{item.name}</Link>)}
                <Link to="/college" style={styles.link} className="footer-link">College / University</Link>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Company</h3>
              <div style={styles.links}>
                {navLinks.footer.company.map(item => <Link key={item.name} to={item.href} style={styles.link} className="footer-link">{item.name}</Link>)}
                {navLinks.footer.legal.map(item => <Link key={item.name} to={item.href} style={styles.link} className="footer-link">{item.name}</Link>)}
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Contact Us</h3>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}><MailIcon /></span>
                <div>
                  <p style={styles.contactLabel}>Email us at</p>
                  <a href="mailto:support@edustream.com" style={styles.contactValue} className="contact-link">support@edustream.com</a>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}><PhoneIcon /></span>
                <div>
                  <p style={styles.contactLabel}>Call us at</p>
                  <a href="tel:+919876543210" style={styles.contactValue} className="contact-link">+91 98765 43210</a>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}><MapPinIcon /></span>
                <div>
                  <p style={styles.contactLabel}>Location</p>
                  <p style={styles.contactValue}>New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.newsletter}>
            <h3 style={styles.newsletterTitle}>Subscribe to our Newsletter</h3>
            <p style={styles.newsletterText}>Get updates on new videos, notes, and study tips delivered to your inbox.</p>
            <form style={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" style={styles.input} className="newsletter-input" />
              <button type="submit" className="btn btn-primary btn-md btn-rounded">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <div style={styles.container}>
          <div style={styles.bottomContent}>
            <p style={styles.copyright}>© {currentYear} LearVanta. All rights reserved.</p>
            
          </div>
        </div>
      </div>

      <style>{`
        .social-link:hover { background-color: var(--primary); color: var(--primary-foreground); }
        .footer-link:hover { color: var(--foreground); }
        .contact-link:hover { color: var(--primary); }
        .newsletter-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px hsla(var(--primary-hsl), 0.15); }
        @media (min-width: 1024px) {
          .footer-brand { grid-column: span 2; }
        }
      `}</style>
    </footer>;
};
export default Footer;