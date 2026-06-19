/**
 * CarbonWise AI - Utility Functions
 * Common helpers for validation, DOM manipulation, color operations, and state management
 * @module utils
 */

/**
 * Clamps a value between min and max bounds
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} The clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Interpolates between two colors in hex format
 * @param {string} color1 - Start color in hex (#RRGGBB)
 * @param {string} color2 - End color in hex (#RRGGBB)
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated color in hex format
 */
export function lerpColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r = Math.round(lerp(c1 >> 16, c2 >> 16, factor));
  const g = Math.round(lerp((c1 >> 8) & 0xff, (c2 >> 8) & 0xff, factor));
  const b = Math.round(lerp(c1 & 0xff, c2 & 0xff, factor));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Validates that a value is a safe number (not NaN, not Infinity)
 * @param {number} value - Value to validate
 * @returns {boolean} True if value is a valid, safe number
 */
export function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Safely gets an element from the DOM with error handling
 * @param {string} selector - CSS selector for the element
 * @returns {Element|null} The element or null if not found
 */
export function safeGetElement(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Failed to get element with selector "${selector}":`, error);
    return null;
  }
}

/**
 * Safely gets multiple elements from the DOM
 * @param {string} selector - CSS selector for elements
 * @returns {NodeList} Collection of elements (empty if not found)
 */
export function safeGetElements(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Failed to get elements with selector "${selector}":`, error);
    return [];
  }
}

/**
 * Safely sets text content (prevents XSS)
 * @param {Element} element - DOM element to update
 * @param {string} text - Text content to set
 */
export function setSafeText(element, text) {
  if (!element) return;
  try {
    element.textContent = String(text);
  } catch (error) {
    console.warn('Failed to set text content:', error);
  }
}

/**
 * Safely sets HTML content with sanitization (basic)
 * @param {Element} element - DOM element to update
 * @param {string} html - HTML content to set
 */
export function setSafeHTML(element, html) {
  if (!element) return;
  try {
    // Basic XSS prevention: remove script tags and event handlers
    const cleaned = String(html)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    element.innerHTML = cleaned;
  } catch (error) {
    console.warn('Failed to set HTML content:', error);
  }
}

/**
 * Formats a number with thousands separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 0) {
  if (!isValidNumber(num)) return '0';
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Converts kg CO2 to tons CO2
 * @param {number} kg - Value in kilograms
 * @returns {number} Value in tons
 */
export function kgToTons(kg) {
  return isValidNumber(kg) ? kg / 1000 : 0;
}

/**
 * Converts tons CO2 to kg CO2
 * @param {number} tons - Value in tons
 * @returns {number} Value in kilograms
 */
export function tonsToKg(tons) {
  return isValidNumber(tons) ? tons * 1000 : 0;
}

/**
 * Calculates greenness factor (0-1) based on CO2 emissions
 * @param {number} co2 - Total CO2 in kg
 * @param {number} minCO2 - Minimum CO2 for full greenness
 * @param {number} maxCO2 - Maximum CO2 for zero greenness
 * @returns {number} Greenness factor 0-1
 */
export function calcGreenness(co2, minCO2 = 2000, maxCO2 = 10000) {
  if (!isValidNumber(co2)) return 0.5;
  return clamp(1 - (co2 - minCO2) / (maxCO2 - minCO2), 0, 1);
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Pauses if document is hidden (for performance optimization)
 * @returns {boolean} True if animations should be paused
 */
export function shouldPauseAnimation() {
  return document.hidden === true;
}

/**
 * Validates user input from range sliders
 * @param {string|number} value - Input value
 * @param {number} min - Minimum allowed
 * @param {number} max - Maximum allowed
 * @returns {number} Validated value
 */
export function validateSliderInput(value, min = 0, max = 100) {
  const num = parseFloat(value);
  if (!isValidNumber(num)) return min;
  return clamp(num, min, max);
}

/**
 * Dispatches a custom event with error handling
 * @param {string} eventName - Name of the event
 * @param {*} detail - Event detail/data
 */
export function dispatchCustomEvent(eventName, detail = null) {
  try {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  } catch (error) {
    console.warn(`Failed to dispatch event "${eventName}":`, error);
  }
}

/**
 * Gets value from local storage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Value to return if not found
 * @returns {*} Stored value or default
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to get from storage "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Saves value to local storage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to save to storage "${key}":`, error);
    return false;
  }
}

/**
 * Requests animation frame with fallback
 * @param {Function} callback - Callback function
 * @returns {number} Request ID
 */
export function requestFrame(callback) {
  return window.requestAnimationFrame ? window.requestAnimationFrame(callback) : setTimeout(callback, 16);
}

/**
 * Cancels animation frame with fallback
 * @param {number} id - Request ID
 */
export function cancelFrame(id) {
  return window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : clearTimeout(id);
}

/**
 * Checks if a color has sufficient contrast (WCAG AA)
 * @param {string} color1 - Color 1 in hex
 * @param {string} color2 - Color 2 in hex
 * @returns {number} Contrast ratio (4.5:1 needed for AA compliance)
 */
export function getContrastRatio(color1, color2) {
  // Simplified luminance calculation
  const getLum = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const lum1 = getLum(color1);
  const lum2 = getLum(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}
