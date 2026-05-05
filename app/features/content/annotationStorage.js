/**
 * Annotation storage utility for localStorage persistence
 * Structure: { [pageId]: [annotations], annotatedPages: [...] }
 */

const STORAGE_KEY = 'tech-for-us-annotations';

export const annotationStorage = {
  /**
   * Get all annotations for a specific page
   * @param {string} pageId - Unique identifier for the page/file
   * @returns {Array} Array of annotation objects
   */
  getPageAnnotations(pageId) {
    const data = this.getAllData();
    return data[pageId] || [];
  },

  /**
   * Save an annotation for a page
   * @param {string} pageId - Unique identifier for the page
   * @param {object} annotation - Annotation object with id, text, selectedText, timestamp, etc.
   */
  saveAnnotation(pageId, annotation) {
    const data = this.getAllData();
    if (!data[pageId]) {
      data[pageId] = [];
    }
    
    // Add to annotations array
    data[pageId].push(annotation);
    
    // Track page as annotated
    if (!data.annotatedPages) {
      data.annotatedPages = [];
    }
    if (!data.annotatedPages.includes(pageId)) {
      data.annotatedPages.push(pageId);
    }
    
    this.saveData(data);
  },

  /**
   * Update an existing annotation
   * @param {string} pageId - Page identifier
   * @param {string} annotationId - ID of annotation to update
   * @param {object} updates - Fields to update
   */
  updateAnnotation(pageId, annotationId, updates) {
    const data = this.getAllData();
    if (data[pageId]) {
      const index = data[pageId].findIndex(a => a.id === annotationId);
      if (index !== -1) {
        data[pageId][index] = { ...data[pageId][index], ...updates };
        this.saveData(data);
      }
    }
  },

  /**
   * Delete an annotation
   * @param {string} pageId - Page identifier
   * @param {string} annotationId - ID of annotation to delete
   */
  deleteAnnotation(pageId, annotationId) {
    const data = this.getAllData();
    if (data[pageId]) {
      data[pageId] = data[pageId].filter(a => a.id !== annotationId);
      // Remove page from annotatedPages if no annotations left
      if (data[pageId].length === 0) {
        delete data[pageId];
        data.annotatedPages = data.annotatedPages.filter(id => id !== pageId);
      }
      this.saveData(data);
    }
  },

  /**
   * Get list of all pages with annotations
   * @returns {Array} Array of page IDs
   */
  getAnnotatedPages() {
    const data = this.getAllData();
    return data.annotatedPages || [];
  },

  /**
   * Get all data
   * @returns {object} All stored data
   */
  getAllData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { annotatedPages: [] };
    } catch (e) {
      console.error('Failed to read annotations from localStorage:', e);
      return { annotatedPages: [] };
    }
  },

  /**
   * Save data to localStorage
   * @param {object} data - Data to save
   */
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save annotations to localStorage:', e);
    }
  },

  /**
   * Export all annotations as JSON
   * @returns {string} JSON string of all data
   */
  exportAsJSON() {
    return JSON.stringify(this.getAllData(), null, 2);
  },

  /**
   * Import annotations from JSON
   * @param {string} jsonString - JSON string to import
   * @returns {boolean} Success status
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data === 'object' && data !== null) {
        this.saveData(data);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import annotations:', e);
      return false;
    }
  },

  /**
   * Clear all annotations
   */
  clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ annotatedPages: [] }));
  }
};
