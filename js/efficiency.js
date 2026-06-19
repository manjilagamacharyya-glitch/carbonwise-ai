/**
 * CarbonWise AI - Efficiency & Performance Module
 * Implements animation pausing, throttling, caching, and memory optimization
 * @module efficiency
 */

/**
 * Detects if user prefers reduced motion
 * @returns {boolean} True if prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detects if page is hidden/in background
 * @returns {boolean} True if page is hidden
 */
export function isPageHidden() {
  return document.hidden === true;
}

/**
 * Pauses all running animations and loops
 * @param {object} animationState - Object to track animation states
 */
export function pauseAnimations(animationState = {}) {
  if (isPageHidden() || prefersReducedMotion()) {
    // Stop all requestAnimationFrame loops
    Object.keys(animationState).forEach(key => {
      if (animationState[key] && typeof animationState[key].cancel === 'function') {
        animationState[key].cancel();
      }
    });
  }
}

/**
 * Resumes all paused animations
 * @param {object} animationState - Object to track animation states
 * @param {Function} resumeCallback - Callback to resume animations
 */
export function resumeAnimations(animationState = {}, resumeCallback) {
  if (!isPageHidden() && !prefersReducedMotion()) {
    if (typeof resumeCallback === 'function') {
      resumeCallback();
    }
  }
}

/**
 * Throttles particle count based on device performance
 * @returns {number} Recommended particle count
 */
export function getOptimalParticleCount() {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width < 1024;
  
  // Base particle count based on device
  let count = 350;
  
  if (isMobile) {
    count = 80;  // Significantly reduced for mobile
  } else if (isTablet) {
    count = 150; // Reduced for tablet
  }
  
  // Adjust based on device memory
  if (navigator.deviceMemory) {
    if (navigator.deviceMemory < 4) {
      count *= 0.5;
    } else if (navigator.deviceMemory >= 8) {
      count *= 1.2;
    }
  }
  
  return Math.round(count);
}

/**
 * Implements memoization for expensive calculations
 * @param {Function} func - Function to memoize
 * @returns {Function} Memoized function
 */
export function memoize(func) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
}

/**
 * Lazy loads an image with intersection observer
 * @param {HTMLImageElement} imgElement - Image element to load
 * @param {string} src - Image source URL
 */
export function lazyLoadImage(imgElement, src) {
  if (!('IntersectionObserver' in window)) {
    imgElement.src = src;
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = src;
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(imgElement);
}

/**
 * Implements viewport-aware rendering
 * @param {Function} renderCallback - Render function to call when in viewport
 * @param {Element} element - Element to observe
 */
export function observeViewport(renderCallback, element) {
  if (!('IntersectionObserver' in window)) {
    renderCallback();
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        renderCallback();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(element);
}

/**
 * Caches DOM queries to prevent repeated lookups
 */
export class DOMCache {
  constructor() {
    this.cache = new Map();
  }
  
  /**
   * Gets or caches a DOM element
   * @param {string} selector - CSS selector
   * @returns {Element|null} Cached element
   */
  get(selector) {
    if (this.cache.has(selector)) {
      return this.cache.get(selector);
    }
    
    const element = document.querySelector(selector);
    if (element) {
      this.cache.set(selector, element);
    }
    return element;
  }
  
  /**
   * Invalidates entire cache
   */
  clear() {
    this.cache.clear();
  }
}

/**
 * Implements request debouncing for resize events
 * @param {Function} callback - Callback function
 * @param {number} wait - Wait time in milliseconds
 */
export function onWindowResize(callback, wait = 300) {
  let timeoutId = null;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, wait);
  };
  
  window.addEventListener('resize', handleResize, { passive: true });
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Measures performance of a function
 * @param {string} label - Label for the measurement
 * @param {Function} func - Function to measure
   * @returns {*} Function result
 */
export function measurePerformance(label, func) {
  if (!window.performance) {
    return func();
  }
  
  const start = performance.now();
  const result = func();
  const end = performance.now();
  
  const duration = (end - start).toFixed(2);
  console.log(`⏱️ ${label}: ${duration}ms`);
  
  return result;
}

/**
 * Monitors memory usage (Chrome specific)
 * @returns {object|null} Memory information or null if unavailable
 */
export function getMemoryUsage() {
  if (!performance.memory) {
    return null;
  }
  
  return {
    usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
  };
}

/**
 * Batches multiple DOM updates to minimize reflows
 * @param {Function} updateCallback - Callback containing all DOM updates
 */
export function batchDOMUpdates(updateCallback) {
  if (!window.requestAnimationFrame) {
    updateCallback();
    return;
  }
  
  // Request animation frame ensures browser batches updates
  requestAnimationFrame(() => {
    updateCallback();
  });
}

/**
 * Implements virtual scrolling for large lists
 * @param {Element} container - Container element
 * @param {object[]} items - Array of items
 * @param {Function} renderItem - Function to render item
 * @param {number} itemHeight - Height of each item
 */
export function implementVirtualScroll(container, items, renderItem, itemHeight) {
  const visibleRange = Math.ceil(container.clientHeight / itemHeight) + 5;
  const scrollTop = container.scrollTop;
  const startIndex = Math.floor(scrollTop / itemHeight) - 2;
  const endIndex = Math.min(startIndex + visibleRange, items.length);
  
  container.innerHTML = '';
  
  for (let i = Math.max(0, startIndex); i < endIndex; i++) {
    const element = renderItem(items[i], i);
    container.appendChild(element);
  }
}

/**
 * Cleanup function to prevent memory leaks
 */
export class ResourceCleaner {
  constructor() {
    this.resources = [];
  }
  
  /**
   * Registers a resource for cleanup
   * @param {Function} cleanupFunc - Function to call for cleanup
   */
  register(cleanupFunc) {
    this.resources.push(cleanupFunc);
  }
  
  /**
   * Cleans up all registered resources
   */
  cleanup() {
    this.resources.forEach(func => {
      try {
        func();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    this.resources = [];
  }
}

// Log on module load
console.log('✓ Efficiency module loaded');
console.log('✓ Optimal particle count:', getOptimalParticleCount());
console.log('✓ Reduced motion preference:', prefersReducedMotion());
