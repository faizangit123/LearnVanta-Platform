import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout/index.js";

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>;

const NotFound = () => {
  return (
    <MainLayout>
      <div className="not-found">
        <div className="not-found-content container">
          <div className="not-found-code gradient-text">404</div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-description">Oops! The page you're looking for doesn't exist. Let's get you back on track.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-md btn-rounded"><HomeIcon /> Go Home</Link>
            <button onClick={() => window.history.back()} className="btn btn-outline btn-md btn-rounded"><ArrowLeftIcon /> Go Back</button>
          </div>
          <div className="not-found-links">
            <p>Here are some helpful links:</p>
            <div className="not-found-links-list">
              <Link to="/classes">Browse Classes</Link>
              <Link to="/videos">Watch Videos</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
