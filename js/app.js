/* ==========================================================================
   CARBONWISE AI - APPLICATION ORCHESTRATOR & ES6 ENTRY
   ========================================================================== */

// Import Sub-modules
import { initBackgroundParticles } from './particles.js';
import { initEarthHologram } from './hologram.js';
import { initCarbonCalculator } from './calculator.js';
import { initAICoach } from './ai-engine.js';
import { initFutureSimulator } from './simulator.js';
import { initCarbonPersona } from './persona.js';
import { initDashboardAnalytics } from './dashboard.js';
import { initEcoChallenges } from './challenges.js';
import { initCommunityFeatures } from './community.js';

// 1. Initialize Global Shared Application State
window.CarbonWiseState = {
  inputs: {
    car: 120,
    bike: 15,
    transit: 40,
    flights: 2,
    electricity: 350,
    lpg: 15,
    renewable: 25,
    diet: 'vegetarian',
    clothes: 3,
    electronics: 2
  },
  simulators: {
    ev: false,
    solar: false,
    veg: false,
    flights: false,
    led: false,
    bike: false
  },
  calculated: {
    co2: 4500, // kg CO2/year
    breakdown: {
      trans: 1800,
      energy: 1575,
      food: 1500,
      shopping: 450
    },
    percentages: {
      trans: 40,
      energy: 35,
      food: 15,
      shopping: 10
    },
    maxCategory: 'trans'
  },
  xp: 1250,
  level: 3,
  completedQuests: []
};

// 2. Global Scroll helper
window.scrollToSection = function(selector) {
  const element = document.querySelector(selector);
  if (element) {
    // Add offsets if header is sticky
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update active nav-link highlighting
    updateNavLinks(selector);
  }
};

function updateNavLinks(activeId) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initUIEffects() {
  document.querySelectorAll('.ripple-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }
}

// Nav link clicking smooth scrolls
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    window.scrollToSection(href);
  });
});

// Scrollspy to highlight current section during scrolling
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const scrollPos = window.scrollY + 200;

  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      updateNavLinks(`#${section.id}`);
    }
  });
});

// 3. Orchestrated Initialization on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  console.log('CarbonWise AI - Initializing eco HUD systems...');
  
  // Background particles and overlays
  initBackgroundParticles();

  // UI micro-interactions
  initUIEffects();

  // Three.js 3D earth components
  initEarthHologram();

  // Carbon calculator logic & events
  initCarbonCalculator();

  // Future simulator morphing sphere
  initFutureSimulator();

  // Carbon coach intelligence
  initAICoach();

  // Carbon identity and climate twin
  initCarbonPersona();

  // Analytics Chart.js trends dashboards
  initDashboardAnalytics();

  // Level systems & Eco gamified quest boards
  initEcoChallenges();

  // SVG dynamic world node maps & score boards
  initCommunityFeatures();
  
  console.log('CarbonWise AI - Systems fully operational.');
});
