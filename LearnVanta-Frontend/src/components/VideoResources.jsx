import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthPrompt } from "../context/AuthPromptContext.jsx";

// Resource Types: pdf, image, link, video, document

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const PdfIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
);

const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const getResourceIcon = (type) => {
  switch (type) {
    case "pdf":
      return <PdfIcon />;
    case "image":
      return <ImageIcon />;
    case "link":
      return <LinkIcon />;
    default:
      return <FileIcon />;
  }
};

const getResourceColor = (type) => {
  switch (type) {
    case "pdf":
      return "resource-icon-pdf";
    case "image":
      return "resource-icon-image";
    case "link":
      return "resource-icon-link";
    default:
      return "resource-icon-default";
  }
};

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const VideoResources = ({ resources }) => {
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useAuthPrompt();

  if (!resources || resources.length === 0) {
    return null;
  }

  const handleResourceClick = (resource) => {
    // Check authentication for downloads (links are okay without login)
    if (!isAuthenticated && resource.type !== "link") {
      showLoginPrompt("downloads");
      return;
    }

    if (resource.type === "link") {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    } else {
      // For downloadable resources, trigger download
      const link = document.createElement("a");
      link.href = resource.url;
      link.download = resource.title;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="video-resources">
      <h3 className="resources-title">
        <FileIcon />
        Resources & Attachments
      </h3>
      <div className="resources-list">
        {resources.map((resource) => (
          <button
            key={resource.id}
            className="resource-item"
            onClick={() => handleResourceClick(resource)}
          >
            <div className={`resource-icon ${getResourceColor(resource.type)}`}>
              {getResourceIcon(resource.type)}
            </div>
            <div className="resource-info">
              <span className="resource-title">{resource.title}</span>
              {resource.size && (
                <span className="resource-size">{resource.size}</span>
              )}
            </div>
            <div className="resource-action">
              {!isAuthenticated && resource.type !== "link" ? (
                <LockIcon />
              ) : resource.type === "link" ? (
                <ExternalLinkIcon />
              ) : (
                <DownloadIcon />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoResources;
