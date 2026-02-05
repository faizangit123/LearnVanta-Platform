import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthPrompt } from "../context/AuthPromptContext.jsx";
import { MainLayout } from "./layout/index.js";

/**
 * ProtectedRoute Component
 * 
 * Protects routes based on authentication and role requirements.
 * Shows a login modal instead of redirecting for better UX.
 * 
 * Props:
 * - children: The component to render if authorized
 * - requireAuth: Whether authentication is required (default: true)
 * - requireAdmin: Whether admin role is required (default: false)
 * - feature: Feature name for the login prompt modal
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  feature = "default",
}) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const { showLoginPrompt } = useAuthPrompt();
  const location = useLocation();

  // Determine feature from path if not provided
  const getFeatureFromPath = () => {
    if (feature !== "default") return feature;
    const path = location.pathname;
    if (path.includes("history")) return "history";
    if (path.includes("favorites")) return "favorites";
    if (path.includes("notes")) return "notes";
    if (path.includes("continue-watching")) return "continue-watching";
    return "default";
  };

  // Show login prompt when unauthenticated user tries to access protected route
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      showLoginPrompt(getFeatureFromPath());
    }
  }, [isLoading, requireAuth, isAuthenticated, showLoginPrompt, location.pathname, feature]);


  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
        <style>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            gap: 1rem;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid hsl(var(--border));
            border-top-color: hsl(var(--primary));
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show empty state for unauthenticated users (modal will appear)
  if (requireAuth && (!isAuthenticated || !user)) {
    return (
      <MainLayout>
        <section className="section">
          <div className="container">
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              textAlign: "center",
            }}>
              <div style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--primary), 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 style={{ 
                fontSize: "1.5rem", 
                fontWeight: 700, 
                color: "hsl(var(--foreground))",
                marginBottom: "0.5rem",
              }}>
                Login Required
              </h2>
              <p style={{ 
                color: "hsl(var(--foreground-secondary))", 
                marginBottom: "1.5rem",
                maxWidth: "400px",
              }}>
                Please sign in to access this page
              </p>
              <button
                onClick={() => showLoginPrompt(getFeatureFromPath())}
                className="btn btn-primary btn-md"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Check admin role
   if (requireAdmin && (!isAuthenticated || !user || !isAdmin)) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🔒</div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <p className="access-denied-hint">This area is restricted to administrators only.</p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
        <style>{`
          .access-denied {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: hsl(var(--background));
            padding: 2rem;
          }
          .access-denied-content {
            text-align: center;
            max-width: 400px;
          }
          .access-denied-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .access-denied h1 {
            color: hsl(var(--destructive));
            margin-bottom: 0.5rem;
          }
          .access-denied p {
            color: hsl(var(--muted-foreground));
            margin-bottom: 0.5rem;
          }
          .access-denied-hint {
            font-size: 0.875rem;
            margin-bottom: 1.5rem !important;
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
