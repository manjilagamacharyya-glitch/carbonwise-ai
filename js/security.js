/**
 * CarbonWise AI - Security & Efficiency Module
 * Implements input validation, sanitization, and performance optimizations
 * @module security
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'\/]/g, (char) => map[char]);
}

/**
 * Validates numeric slider input
 * @param {number} value - Input value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Validated value or 0 if invalid
 */
export function validateNumericInput(value, min = 0, max = 100) {
  const num = parseFloat(value);
  
  // Check for NaN, Infinity, or invalid values
  if (isNaN(num) || !isFinite(num)) {
    console.warn(`Invalid numeric input: ${value}`);
    return min;
  }
  
  // Clamp between bounds
  return Math.max(min, Math.min(max, num));
}

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

/**
 * Validates that API responses have required fields
 * @param {object} response - API response object
 * @param {string[]} requiredFields - Fields that must exist
 * @returns {boolean} True if all required fields present
 */
export function validateResponseStructure(response, requiredFields = []) {
  if (!response || typeof response !== 'object') {
    console.warn('Response is not a valid object');
    return false;
  }
  
  return requiredFields.every(field => field in response);
}

/**
 * Checks if API key is properly configured (not default)
 * @param {string} apiKey - API key to check
 * @returns {boolean} True if API key is configured (not default placeholder)
 */
export function isAPIKeyConfigured(apiKey) {
  return apiKey && 
         apiKey.length > 10 && 
         apiKey !== 'YOUR_KEY' &&
         !apiKey.includes('PLACEHOLDER');
}

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback value
 */
export function safeJSONParse(jsonString, fallback = null) {
  try {
    if (typeof jsonString !== 'string') return fallback;
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
}

/**
 * Implements rate limiting for API calls
 * @param {string} key - Unique key for this rate limit
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} timeWindowMs - Time window in milliseconds
 * @returns {boolean} True if call is allowed, false if rate limited
 */
export class RateLimiter {
  constructor() {
    this.calls = new Map();
  }

  isAllowed(key, maxCalls = 10, timeWindowMs = 60000) {
    const now = Date.now();
    
    if (!this.calls.has(key)) {
      this.calls.set(key, []);
    }
    
    const callTimes = this.calls.get(key);
    
    // Remove old calls outside the time window
    const validCalls = callTimes.filter(time => now - time < timeWindowMs);
    this.calls.set(key, validCalls);
    
    // Check if limit exceeded
    if (validCalls.length >= maxCalls) {
      console.warn(`Rate limit exceeded for key: ${key}`);
      return false;
    }
    
    // Record this call
    validCalls.push(now);
    return true;
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Performs feature detection for critical APIs
 * @returns {object} Object with boolean flags for supported features
 */
export function detectFeatures() {
  return {
    localStorage: typeof Storage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    canvas: typeof HTMLCanvasElement !== 'undefined',
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })(),
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
  };
}

/**
 * Safely executes code with try-catch
 * @param {Function} func - Function to execute
 * @param {*} defaultReturn - Default return value if error occurs
 * @returns {*} Function result or default return value
 */
export function tryCatch(func, defaultReturn = null) {
  try {
    return func();
  } catch (error) {
    console.error('Error in try-catch:', error);
    return defaultReturn;
  }
}

/**
 * Prevents rapid consecutive calls (debounced API calls)
 * @param {Function} apiFunction - API function to call
 * @param {number} delayMs - Delay between calls in milliseconds
 * @returns {Function} Debounced function
 */
export function createDebouncedAPICall(apiFunction, delayMs = 500) {
  let timeoutId = null;
  
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      apiFunction(...args);
      timeoutId = null;
    }, delayMs);
  };
}

/**
 * Logs security events for monitoring
 * @param {string} event - Event type
 * @param {object} data - Event data
 */
export function logSecurityEvent(event, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...data
  };
  
  // In production, send to secure logging service
  if (process.env.NODE_ENV === 'production') {
    // Implement server-side logging
    console.warn('SECURITY EVENT:', logEntry);
  } else {
    console.log('SECURITY EVENT:', logEntry);
  }
}

/**
 * Verifies HTTPS in production
 * @returns {boolean} True if running on HTTPS or localhost
 */
export function isSecureContext() {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
}

// Log on module load
console.log('✓ Security module loaded');
console.log('✓ Features detected:', detectFeatures());
console.log('✓ Secure context:', isSecureContext());
