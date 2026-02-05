import React, { useState, useRef, useEffect } from "react";

import { 
  uploadResource, 
  RESOURCE_TYPES, 
  RESOURCE_TYPE_LABELS,
  formatFileSize,
  isMockMode
} from "../../services/resourceService.js";
import { apiRequest, } from "../../config/api.js";  

// Icons
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const ResourceUploadModal = ({ isOpen, onClose, onSuccess, editResource = null }) => {
  const [chapters, setChapters] = useState([]);        
  const [subjects, setSubjects] = useState([]);       

  const [selectedChapter, setSelectedChapter] = useState(editResource?.chapterId || "");
  const [resourceType, setResourceType] = useState(editResource?.type || RESOURCE_TYPES.NOTES);
  const [file, setFile] = useState(null);
  const [customTitle, setCustomTitle] = useState(editResource?.title || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);



    // ============================================
  // Load chapters + subjects
  // ============================================

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isMockMode()) {
  setChapters([]);
  setSubjects([]);
} else {
  const ch = await apiRequest("/content/chapters/all/");
  const sub = await apiRequest("/content/subjects/all/");
  setChapters(ch || []);
  setSubjects(sub || []);
}

      } catch {
        setChapters([]);
        setSubjects([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
  if (editResource) {
    setSelectedChapter(String(editResource.chapterId));
    setResourceType(editResource.type);
    setCustomTitle(editResource.title || "");
  } else {
    setSelectedChapter("");
    setResourceType(RESOURCE_TYPES.NOTES);
    setCustomTitle("");
  }
}, [editResource]);

 
  const handleClose = () => {
    setSelectedChapter("");
    setResourceType(RESOURCE_TYPES.NOTES);
    setFile(null);
    setCustomTitle("");
    setError(null);
    onClose();
  }; 


  const handleFileSelect = (selectedFile) => {
    setError(null);
    
    if (!selectedFile) return;
    
    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      return;
    }
    
    // Validate file size (25MB max)
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("File size must be less than 25MB");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedChapter) {
      setError("Please select a chapter");
      return;
    }

    if (!file && !editResource) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadResource(
        file,
        selectedChapter,
        resourceType,
        customTitle
      );
      
      onSuccess?.(result);
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to upload resource");
    } finally {
      setIsUploading(false);
    }
  };


  // ============================================
  //  FIXED: chapter + subject resolution
  // ============================================

  const selectedChapterData = chapters.find(
  c => String(c.id) === String(selectedChapter)
);

  const selectedSubject = subjects.find(
  s => String(s.id) === String(selectedChapterData?.subject)
);

  // -------------------------
  // Render
  // -------------------------
  if (!isOpen) return null;


  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal resource-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editResource ? "Update Resource" : "Upload Resource"}</h2>
          <button className="modal-close" onClick={handleClose}>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Mock Mode Notice */}
            {isMockMode() && (
              <div className="resource-mock-notice">
                <AlertIcon />
                <span>
                  <strong>Demo Mode:</strong> File metadata will be saved.
                </span>
              </div>
            )}

            {/* Chapter Selection */}
            <div className="form-group">
              <label className="form-label">Select Chapter *</label>
              <select
                className="form-select"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                required
              >
                <option value="">Choose a chapter...</option>
                {chapters.map((chapter) => {
                  const subject = subjects.find(
  s => String(s.id) === String(chapter.subject)
);

                  return (
                    <option key={chapter.id} value={chapter.id}>
                      {subject?.name} - {chapter.name}
                    </option>
                  );
                })}
              </select>
              {selectedChapterData && (
                <p className="form-hint">
                  {selectedSubject?.name} • Chapter {selectedChapterData.name}
                </p>
              )}
            </div>

            {/* Resource Type Selection */}
            <div className="form-group">
              <label className="form-label">Resource Type *</label>
              <div className="resource-type-grid">
                {Object.entries(RESOURCE_TYPE_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    className={`resource-type-option ${resourceType === type ? "selected" : ""}`}
                    onClick={() => setResourceType(type)}
                  >
                    <div className={`resource-type-icon resource-type-icon-${type}`}>
                      <FileIcon />
                    </div>
                    <span>{label}</span>
                    {resourceType === type && (
                      <div className="resource-type-check">
                        <CheckIcon />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Title */}
            <div className="form-group">
              <label className="form-label">Custom Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder={RESOURCE_TYPE_LABELS[resourceType]}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                maxLength={100}
              />
              <p className="form-hint">Leave blank to use default title</p>
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label className="form-label">PDF File *</label>
              <div
                className={`file-dropzone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  style={{ display: "none" }}
                />
                
                {file ? (
                  <div className="file-preview">
                    <div className="file-preview-icon">
                      <FileIcon />
                    </div>
                    <div className="file-preview-info">
                      <p className="file-preview-name">{file.name}</p>
                      <p className="file-preview-size">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      className="file-preview-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <div className="file-dropzone-content">
                    <UploadIcon />
                    <p className="file-dropzone-text">
                      <span>Click to upload</span> or drag and drop
                    </p>
                    <p className="file-dropzone-hint">PDF only, max 25MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="form-error">
                <AlertIcon />
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-md" onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={isUploading || (!file && !editResource)}
            >
              {isUploading ? "Uploading..." : editResource ? "Update" : "Upload Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceUploadModal;
