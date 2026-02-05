import React, { useState, useEffect } from "react";
import { apiRequest } from "../../config/api.js";
import {
  getAllResources,
  deleteResource,
  RESOURCE_TYPES,
  RESOURCE_TYPE_LABELS,
} from "../../services/resourceService.js";
import ResourceUploadModal from "./ResourceUploadModal.jsx";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";

// Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
    <path d="M16 16h5v5"></path>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ChapterResourcesManager = () => {
  const [chapters, setChapters] = useState([]);
const [subjects, setSubjects] = useState([]);
const [classes, setClasses] = useState([]);

  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteResourceId, setDeleteResourceId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
  const loadMeta = async () => {
    try {
      const [ch, sub, cls] = await Promise.all([
        apiRequest("/content/chapters/all/"),
        apiRequest("/content/subjects/all/"),
        apiRequest("/content/classes/")
      ]);

      setChapters(ch || []);
      setSubjects(sub || []);
      setClasses(cls || []);
    } catch (e) {
      setChapters([]);
      setSubjects([]);
      setClasses([]);
    }
  };

  loadMeta();
}, []);

useEffect(() => {
  loadResources();
}, []);



  const loadResources = async () => {
    setIsLoading(true);
    try {
      const allResources = await getAllResources();
      setResources(allResources);
    } catch (error) {
      showNotification("Failed to load resources", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUploadSuccess = (resource) => {
    setResources(prev => {
      // Check if resource already exists (replacement)
      const existingIndex = prev.findIndex(
        r => r.chapterId === resource.chapterId && r.type === resource.type
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = resource;
        return updated;
      }
      return [resource, ...prev];
    });
    showNotification("Resource uploaded successfully");
  };

  const handleDeleteResource = async () => {
    if (!deleteResourceId) return;
    setDeleteLoading(true);
    try {
      await deleteResource(deleteResourceId);
      setResources(prev => prev.filter(r => r.id !== deleteResourceId));
      setDeleteResourceId(null);
      showNotification("Resource deleted successfully");
    } catch (error) {
      showNotification(error.message || "Failed to delete resource", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get chapter info for each resource
  const enrichedResources = resources.map(resource => {
  const chapter = chapters.find(c => c.id === resource.chapterId);
  const subject = subjects.find(s => s.id === chapter?.subject);
  const classData = classes.find(c => c.id === subject?.class_ref);

    return {
      ...resource,
      chapterName: chapter?.name || "Unknown Chapter",
      subjectName: subject?.name || "Unknown Subject",
      className: classData?.name || "Unknown Class"
    };
  });

  // Filter resources
  const filteredResources = enrichedResources.filter(resource => {
    const matchesSearch = 
      resource.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || resource.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Group by chapter
  const groupedByChapter = filteredResources.reduce((acc, resource) => {
    const key = resource.chapterId;
    if (!acc[key]) {
      acc[key] = {
        chapterId: resource.chapterId,
        chapterName: resource.chapterName,
        subjectName: resource.subjectName,
        className: resource.className,
        resources: []
      };
    }
    acc[key].resources.push(resource);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getResourceTypeIcon = (type) => {
    const colors = {
      [RESOURCE_TYPES.NOTES]: "var(--primary)",
      [RESOURCE_TYPES.PRACTICE]: "var(--accent)",
      [RESOURCE_TYPES.FORMULAS]: "var(--success)"
    };
    return (
      <div 
        className="resource-type-badge"
        style={{ 
          backgroundColor: `hsl(${colors[type]} / 0.1)`,
          color: `hsl(${colors[type]})`
        }}
      >
        {RESOURCE_TYPE_LABELS[type]}
      </div>
    );
  };

  return (
    <div className="resources-manager">
      {/* Header */}
      <div className="resources-manager-header">
        <div className="resources-manager-title">
          <h2>Chapter Resources</h2>
          <p>{resources.length} resource{resources.length !== 1 ? "s" : ""} uploaded</p>
          {/* {isMockMode() && (
            <span className="mock-badge">Demo Mode</span>
          )} */}
        </div>
        <div className="resources-manager-actions">
          <button className="btn btn-outline btn-sm" onClick={loadResources}>
            <RefreshIcon />
            Refresh
          </button>
          <button className="btn btn-primary btn-md" onClick={() => setIsUploadModalOpen(true)}>
            <PlusIcon />
            Upload Resource
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="resources-filters">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by chapter, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          {Object.entries(RESOURCE_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              className={`filter-tab ${filterType === type ? "active" : ""}`}
              onClick={() => setFilterType(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="resources-loading">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      ) : Object.keys(groupedByChapter).length === 0 ? (
        <div className="resources-empty">
          <FolderIcon />
          <h3>No Resources Found</h3>
          <p>
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "Upload your first resource to get started"}
          </p>
          {!searchQuery && filterType === "all" && (
            <button 
              className="btn btn-primary btn-md"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <PlusIcon />
              Upload Resource
            </button>
          )}
        </div>
      ) : (
        <div className="resources-list">
          {Object.values(groupedByChapter).map((group) => (
            <div key={group.chapterId} className="resource-group card">
              <div className="resource-group-header">
                <div className="resource-group-info">
                  <h3>{group.chapterName}</h3>
                  <p>{group.className} • {group.subjectName}</p>
                </div>
                <span className="resource-count">
                  {group.resources.length} file{group.resources.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="resource-group-items">
                {group.resources.map((resource) => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-item-icon">
                      <FileIcon />
                    </div>
                    <div className="resource-item-info">
                      <div className="resource-item-title">
                        {resource.title}
                        {getResourceTypeIcon(resource.type)}
                      </div>
                      <div className="resource-item-meta">
                        <span>{resource.size}</span>
                        <span>•</span>
                        <span>{formatDate(resource.uploadedAt)}</span>
                        <span>•</span>
                        <span>{resource.downloadCount || 0} downloads</span>
                      </div>
                    </div>
                    <div className="resource-item-actions">
                      {/* {resource.isMock && (
                        <span className="resource-mock-tag">Mock</span>
                      )} */}
                      <button
  className="btn btn-ghost btn-sm"
  title="Download"
  disabled={!resource.file_url}
  onClick={() => window.open(resource.file_url, "_blank")}
>
  <DownloadIcon />
</button>

                      <button
                        className="btn btn-ghost btn-sm danger"
                        title="Delete"
                        onClick={() => setDeleteResourceId(resource.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Modals */}
      <ResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <DeleteConfirmModal
        isOpen={!!deleteResourceId}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        onConfirm={handleDeleteResource}
        onCancel={() => setDeleteResourceId(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ChapterResourcesManager;
