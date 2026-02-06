/**
 * Resource Service Layer
 * 
 * Manages chapter resources (Notes, Practice Questions, Formula Sheets).
 * Uses Django REST API (mock code kept only as comments).
 */

import { API_CONFIG, apiRequest } from "../config/api.js";

// ============================================
// RESOURCE TYPES
// ============================================

export const RESOURCE_TYPES = {
  NOTES: "notes",
  PRACTICE: "practice",
  FORMULAS: "formulas",
};

export const RESOURCE_TYPE_LABELS = {
  [RESOURCE_TYPES.NOTES]: "Chapter Notes",
  [RESOURCE_TYPES.PRACTICE]: "Practice Questions",
  [RESOURCE_TYPES.FORMULAS]: "Formula Sheet",
};

export const RESOURCE_TYPE_DESCRIPTIONS = {
  [RESOURCE_TYPES.NOTES]: "Detailed notes for revision",
  [RESOURCE_TYPES.PRACTICE]: "MCQs and solved examples",
  [RESOURCE_TYPES.FORMULAS]: "Quick reference formulas",
};

// ============================================
// CONFIGURATION
// ============================================

const RESOURCE_CONFIG = {
  maxFileSize: 25 * 1024 * 1024, // 25MB
  acceptedTypes: ["application/pdf"],
  storageKey: "edustream_resources",
};

// ============================================
// NORMALIZER (backend → frontend)
// ============================================

const normalizeResource = (resource) => ({
  id: resource.id,
  chapterId: resource.chapter_id,
  type: resource.resource_type || resource.type,
  title: resource.title || RESOURCE_TYPE_LABELS[resource.resource_type],
  file: resource.file,
  fileName: resource.file_name || "",
  size: resource.size || null,
  mimeType: resource.mime_type || "application/pdf",
  uploadedAt: resource.created_at || resource.uploaded_at,
  downloadCount: resource.download_count || 0,
});

// ============================================
// UPLOAD
// ============================================

export const uploadResource = async (
  file,
  chapterId,
  resourceType,
  title = ""
) => {
  if (file.size > RESOURCE_CONFIG.maxFileSize) {
    throw new Error(
      `File size exceeds maximum of ${
        RESOURCE_CONFIG.maxFileSize / (1024 * 1024)
      }MB`
    );
  }

  if (!RESOURCE_CONFIG.acceptedTypes.includes(file.type)) {
    throw new Error("Only PDF files are accepted");
  }

  if (!Object.values(RESOURCE_TYPES).includes(resourceType)) {
    throw new Error("Invalid resource type");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("chapter_id", chapterId);
  formData.append("resource_type", resourceType);
  if (title) formData.append("title", title);

  const response = await apiRequest("/resources/upload/", {
    method: "POST",
    body: formData,
  });

  return normalizeResource(response);
};

// ============================================
// READ OPERATIONS
// ============================================

export const getResourcesByChapter = async (chapterId) => {
  const data = await apiRequest(`/resources/chapters/${chapterId}/`);
  const normalized = (data || []).map(normalizeResource);

  return {
    notes: normalized.find(r => r.type === RESOURCE_TYPES.NOTES) || null,
    practice: normalized.find(r => r.type === RESOURCE_TYPES.PRACTICE) || null,
    formulas: normalized.find(r => r.type === RESOURCE_TYPES.FORMULAS) || null,
  };
};

export const getAllResources = async () => {
  const data = await apiRequest("/resources/");
  return (data || []).map(normalizeResource);
};

export const getResourceById = async (resourceId) => {
  const data = await apiRequest(`/resources/${resourceId}/`);
  return normalizeResource(data);
};

// ============================================
// UPDATE
// ============================================

export const updateResource = async (resourceId, data) => {
  const response = await apiRequest(`/resources/${resourceId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return normalizeResource(response);
};

// ============================================
// DELETE
// ============================================

export const deleteResource = async (resourceId) => {
  return apiRequest(`/resources/${resourceId}/`, {
    method: "DELETE",
  });
};

// ============================================
// DOWNLOAD
// ============================================

export const getDownloadUrl = async (resourceId) => {
  const resource = await getResourceById(resourceId);
  return resource.file;
};

// ============================================
// UTILITIES
// ============================================

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(1)) +
    " " +
    sizes[i]
  );
};

export const isMockMode = () => API_CONFIG.useMock;

export const getApiConfig = () => ({
  baseUrl: API_CONFIG.baseUrl,
  useMock: API_CONFIG.useMock,
  maxFileSize: RESOURCE_CONFIG.maxFileSize,
});


export const trackDownload = async (resourceId) => {
  await apiRequest(`/resources/${resourceId}/track-download/`, {
    method: "POST",
  });
};

