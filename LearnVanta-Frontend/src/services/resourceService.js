/**
 * Resource Service Layer
 * 
 * Manages chapter resources (Notes, Practice Questions, Formula Sheets).
 * Uses mock localStorage when API_CONFIG.useMock is true,
 * otherwise calls Django REST API.
 */

import { API_CONFIG, apiRequest, mockDelay } from "../config/api.js";

// Resource Types
export const RESOURCE_TYPES = {
  NOTES: 'notes',
  PRACTICE: 'practice',
  FORMULAS: 'formulas'
};

export const RESOURCE_TYPE_LABELS = {
  [RESOURCE_TYPES.NOTES]: 'Chapter Notes',
  [RESOURCE_TYPES.PRACTICE]: 'Practice Questions',
  [RESOURCE_TYPES.FORMULAS]: 'Formula Sheet'
};

export const RESOURCE_TYPE_DESCRIPTIONS = {
  [RESOURCE_TYPES.NOTES]: 'Detailed notes for revision',
  [RESOURCE_TYPES.PRACTICE]: 'MCQs and solved examples',
  [RESOURCE_TYPES.FORMULAS]: 'Quick reference formulas'
};

// ============================================
// CONFIGURATION
// ============================================

const RESOURCE_CONFIG = {
  maxFileSize: 25 * 1024 * 1024,
  acceptedTypes: ['application/pdf'],
  storageKey: 'edustream_resources'
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const getMockResources = () => {
  try {
    const stored = localStorage.getItem(RESOURCE_CONFIG.storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMockResources = (resources) => {
  localStorage.setItem(RESOURCE_CONFIG.storageKey, JSON.stringify(resources));
};

const generateId = () => `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================
// UPLOAD OPERATIONS
// ============================================

export const uploadResource = async (file, chapterId, resourceType, title = '') => {
  if (file.size > RESOURCE_CONFIG.maxFileSize) {
    throw new Error(`File size exceeds maximum of ${RESOURCE_CONFIG.maxFileSize / (1024 * 1024)}MB`);
  }

  if (!RESOURCE_CONFIG.acceptedTypes.includes(file.type)) {
    throw new Error('Only PDF files are accepted');
  }

  if (!Object.values(RESOURCE_TYPES).includes(resourceType)) {
    throw new Error('Invalid resource type');
  }

  if (!API_CONFIG.useMock) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chapter_id', chapterId);
    formData.append('resource_type', resourceType);
    if (title) formData.append('title', title);

    return apiRequest("/api/v1/resources/resources/upload/", {
      method: 'POST',
      body: formData,
    });
  }

  // Mock
  await mockDelay(500);

  const resource = {
    id: generateId(),
    chapterId,
    type: resourceType,
    title: title || RESOURCE_TYPE_LABELS[resourceType],
    fileName: file.name,
    size: formatFileSize(file.size),
    sizeBytes: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
    downloadCount: 0,
    url: null,
    isMock: true
  };

  const resources = getMockResources();

  const existingIndex = resources.findIndex(
    r => r.chapterId === chapterId && r.type === resourceType
  );

  if (existingIndex >= 0) {
    resources[existingIndex] = resource;
  } else {
    resources.push(resource);
  }

  saveMockResources(resources);
  return resource;
};

// ============================================
// READ OPERATIONS
// ============================================

export const getResourcesByChapter = async (chapterId) => {
  if (!API_CONFIG.useMock) {
    const data = await apiRequest(`/api/v1/resources/chapters/${chapterId}/resources/`);
    return {
      notes: data.find(r => r.type === RESOURCE_TYPES.NOTES) || null,
      practice: data.find(r => r.type === RESOURCE_TYPES.PRACTICE) || null,
      formulas: data.find(r => r.type === RESOURCE_TYPES.FORMULAS) || null
    };
  }

  const resources = getMockResources();
  const chapterResources = resources.filter(r => r.chapterId === chapterId);

  return {
    notes: chapterResources.find(r => r.type === RESOURCE_TYPES.NOTES) || null,
    practice: chapterResources.find(r => r.type === RESOURCE_TYPES.PRACTICE) || null,
    formulas: chapterResources.find(r => r.type === RESOURCE_TYPES.FORMULAS) || null
  };
};

export const getAllResources = async () => {
  if (!API_CONFIG.useMock) {
    return apiRequest("/api/v1/resources/resources/");
  }

  return getMockResources();
};

// ============================================
// UPDATE OPERATIONS
// ============================================

export const updateResource = async (resourceId, data) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/resources/resources/${resourceId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  const resources = getMockResources();
  const index = resources.findIndex(r => r.id === resourceId);

  if (index === -1) {
    throw new Error('Resource not found');
  }

  resources[index] = { ...resources[index], ...data, updatedAt: new Date().toISOString() };
  saveMockResources(resources);
  return resources[index];
};

// ============================================
// DELETE OPERATIONS
// ============================================

export const deleteResource = async (resourceId) => {
  if (!API_CONFIG.useMock) {
    return apiRequest(`/api/v1/resources/resources/${resourceId}/`, {
      method: 'DELETE',
    });
  }

  const resources = getMockResources();
  const filtered = resources.filter(r => r.id !== resourceId);
  saveMockResources(filtered);
  return { success: true };
};

// ============================================
// DOWNLOAD OPERATIONS
// ============================================

export const getDownloadUrl = async (resourceId) => {
  if (!API_CONFIG.useMock) {
    const response = await apiRequest(`/api/v1/resources/resources/${resourceId}/`);
    return response.file;
  }

  return null;
};

export const trackDownload = async (resourceId) => {
  if (!API_CONFIG.useMock) {
    apiRequest(`/api/v1/resources/resources/${resourceId}/track-download/`, {
      method: 'POST',
    }).catch(() => {});
    return;
  }

  const resources = getMockResources();
  const index = resources.findIndex(r => r.id === resourceId);
  if (index >= 0) {
    resources[index].downloadCount = (resources[index].downloadCount || 0) + 1;
    saveMockResources(resources);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const isMockMode = () => API_CONFIG.useMock;

export const getApiConfig = () => ({
  baseUrl: API_CONFIG.baseUrl,
  useMock: API_CONFIG.useMock,
  maxFileSize: RESOURCE_CONFIG.maxFileSize
});
