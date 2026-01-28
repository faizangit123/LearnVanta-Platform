import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService.js";

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying, success, error, no-token
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("no-token");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--primary), 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "hsl(var(--primary))",
              }}
            >
              <LoaderIcon />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Verifying your email...
            </h1>
            <p style={{ color: "hsl(var(--foreground-secondary))" }}>
              Please wait while we confirm your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--success), 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "hsl(var(--success, 142 76% 36%))",
              }}
            >
              <CheckCircleIcon />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Email Verified!
            </h1>
            <p style={{ color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Your email has been successfully verified.<br />
              You can now sign in to your account.
            </p>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem" }}>
              Redirecting to login in 3 seconds...
            </p>
            <Link to="/login" className="btn btn-primary btn-md" style={{ width: "100%", justifyContent: "center" }}>
              Sign In Now
            </Link>
          </div>
        );

      case "error":
        return (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--error), 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "hsl(var(--error, 0 84% 60%))",
              }}
            >
              <XCircleIcon />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Verification Failed
            </h1>
            <p style={{ color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {error || "We couldn't verify your email address."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link to="/register" className="btn btn-primary btn-md" style={{ width: "100%", justifyContent: "center" }}>
                Try Registering Again
              </Link>
              <Link to="/login" className="btn btn-secondary btn-md" style={{ width: "100%", justifyContent: "center" }}>
                Back to Login
              </Link>
            </div>
          </div>
        );

      case "no-token":
      default:
        return (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--primary), 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "hsl(var(--primary))",
              }}
            >
              <MailIcon />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Check Your Email
            </h1>
            <p style={{ color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              We've sent a verification link to your email address.<br />
              Click the link in the email to verify your account.
            </p>
            <div style={{ 
              backgroundColor: "hsl(var(--secondary))", 
              padding: "1rem", 
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}>
              <p style={{ fontSize: "0.875rem", color: "hsl(var(--foreground-secondary))" }}>
                <strong>Didn't receive the email?</strong><br />
                Check your spam folder or try registering again.
              </p>
            </div>
            <Link to="/login" className="btn btn-secondary btn-md" style={{ width: "100%", justifyContent: "center" }}>
              Back to Login
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <GraduationCapIcon />
            </div>
            <span>LearVanta</span>
          </Link>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
