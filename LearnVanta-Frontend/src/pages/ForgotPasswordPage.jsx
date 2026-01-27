import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authService.js";

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic email validation
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      await requestPasswordReset(email);
      setIsEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="auth-page">
        <Link to="/login" className="auth-back-home">
          <ArrowLeftIcon />
          <span>Back to Login</span>
        </Link>

        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
                <GraduationCapIcon />
              </div>
              <span>EduStream</span>
            </Link>
          </div>

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
              Check your email
            </h1>
            <p style={{ color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              We've sent a password reset link to<br />
              <strong style={{ color: "hsl(var(--foreground))" }}>{email}</strong>
            </p>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--foreground-secondary))", marginBottom: "1.5rem" }}>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setIsEmailSent(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "hsl(var(--primary))",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                try again
              </button>
            </p>
            <Link to="/login" className="btn btn-primary btn-md" style={{ width: "100%", justifyContent: "center" }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Link to="/login" className="auth-back-home">
        <ArrowLeftIcon />
        <span>Back to Login</span>
      </Link>

      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <GraduationCapIcon />
            </div>
            <span>EduStream</span>
          </Link>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              backgroundColor: "hsla(var(--primary), 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "1rem auto",
              color: "hsl(var(--primary))",
            }}
          >
            <MailIcon />
          </div>
          <h1>Forgot your password?</h1>
          <p>Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              className="input"
              required
              maxLength={255}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderIcon />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-switch">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
