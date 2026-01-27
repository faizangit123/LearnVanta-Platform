import React from "react";
import { Link } from "react-router-dom";

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LoginPromptModal = ({ isOpen, onClose, feature = "this feature" }) => {
  if (!isOpen) return null;

  const featureMessages = {
    favorites: {
      title: "Save Your Favorites",
      description: "Create an account to save videos and access them anytime.",
      icon: "❤️",
    },
    history: {
      title: "Track Your Progress",
      description: "Sign in to keep track of videos you've watched and resume where you left off.",
      icon: "📺",
    },
    notes: {
      title: "Take Notes",
      description: "Login to take personal notes while watching videos and access them later.",
      icon: "📝",
    },
    downloads: {
      title: "Download Resources",
      description: "Sign in to download chapter notes, practice questions, and formula sheets.",
      icon: "📥",
    },
    "continue-watching": {
      title: "Continue Watching",
      description: "Login to save your progress and pick up where you left off.",
      icon: "▶️",
    },
    default: {
      title: "Login Required",
      description: `Sign in to access ${feature}.`,
      icon: "🔒",
    },
  };

  const content = featureMessages[feature] || featureMessages.default;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "hsl(var(--card))",
          borderRadius: "1rem",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          zIndex: 1001,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          animation: "scaleIn 0.2s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "hsl(var(--foreground-secondary))",
            padding: "0.25rem",
            borderRadius: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="login-modal-close"
        >
          <CloseIcon />
        </button>

        {/* Content */}
        <div style={{ textAlign: "center" }}>
          {/* Icon */}
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              backgroundColor: "hsla(var(--primary), 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "1.75rem",
            }}
          >
            {content.icon}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
              marginBottom: "0.75rem",
            }}
          >
            {content.title}
          </h2>

          {/* Description */}
          <p
            style={{
              color: "hsl(var(--foreground-secondary))",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            {content.description}
          </p>

          {/* Social Login Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
            <button
              onClick={() => {
                /**
                 * TODO: Django Backend Integration
                 * Replace this mock with real Google OAuth:
                 * 
                 * 1. Configure Google OAuth in Django:
                 *    - Install django-allauth or social-auth-app-django
                 *    - Add Google OAuth credentials in settings.py
                 *    - Configure callback URL: /api/auth/google/callback/
                 * 
                 * 2. Replace this onClick with:
                 *    window.location.href = `${DJANGO_API_URL}/api/auth/google/login/`;
                 * 
                 * 3. After OAuth callback, Django returns JWT token
                 *    which should be stored and used for subsequent requests
                 */
                alert("Google login will be available when connected to Django backend.\n\nFor now, please use email/password login.");
              }}
              className="btn btn-secondary btn-md social-login-btn"
              style={{
                width: "100%",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => {
                /**
                 * TODO: Django Backend Integration
                 * Replace this mock with real GitHub OAuth:
                 * 
                 * 1. Configure GitHub OAuth in Django:
                 *    - Register app at github.com/settings/developers
                 *    - Add GitHub OAuth credentials in settings.py
                 *    - Configure callback URL: /api/auth/github/callback/
                 * 
                 * 2. Replace this onClick with:
                 *    window.location.href = `${DJANGO_API_URL}/api/auth/github/login/`;
                 */
                alert("GitHub login will be available when connected to Django backend.\n\nFor now, please use email/password login.");
              }}
              className="btn btn-secondary btn-md social-login-btn"
              style={{
                width: "100%",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1rem", 
            marginBottom: "1rem" 
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "hsl(var(--border))" }} />
            <span style={{ fontSize: "0.75rem", color: "hsl(var(--foreground-secondary))" }}>
              or
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "hsl(var(--border))" }} />
          </div>

          {/* Email Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              to="/login"
              className="btn btn-primary btn-md"
              style={{
                width: "100%",
                justifyContent: "center",
                fontWeight: 600,
              }}
              onClick={onClose}
            >
              Sign In with Email
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary btn-md"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
              onClick={onClose}
            >
              Create Free Account
            </Link>
          </div>

          {/* Footer note */}
          <p
            style={{
              fontSize: "0.75rem",
              color: "hsl(var(--foreground-secondary))",
              marginTop: "1rem",
            }}
          >
            Free forever • No credit card required
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .login-modal-close:hover {
          background-color: hsl(var(--secondary));
        }
      `}</style>
    </>
  );
};

export default LoginPromptModal;
