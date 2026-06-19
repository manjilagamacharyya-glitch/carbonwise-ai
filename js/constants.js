/**
 * CarbonWise AI - Global Constants
 * Centralized configuration for emission factors, colors, timings, and selectors
 * @module constants
 */

// ===== EMISSION FACTORS (Source-Backed) =====
export const EMISSION_FACTORS = {
  // Transportation (kg CO2)
  CAR: 0.192,                    // kg CO₂/km — IPCC AR6
  BUS: 0.105,                    // kg CO₂/km — EPA
  TRAIN: 0.041,                  // kg CO₂/km — Our World in Data
  FLIGHT_DOMESTIC: 255,          // kg CO₂/trip — IPCC AR6
  FLIGHT_INTERNATIONAL: 1100,    // kg CO₂/trip — IPCC AR6

  // Energy (kg CO2)
  ELECTRICITY_INDIA: 0.708,      // kg CO₂/kWh — CEA India 2024
  LPG: 2.98,                     // kg CO₂/kg — IPCC AR6

  // Food (kg CO2/year)
  DIET_VEGETARIAN: 1700,         // kg CO₂/year — Our World in Data
  DIET_MIXED: 2800,              // kg CO₂/year — Our World in Data
  DIET_MEAT: 3600,               // kg CO₂/year — Our World in Data

  // Shopping (kg CO2)
  CLOTHING_PER_ITEM: 14,         // kg CO₂/item — WRAP UK
  ELECTRONICS_PER_ITEM: 120,     // kg CO₂/item — Carbon Trust
};

// ===== COLOR PALETTE =====
export const COLORS = {
  CYAN_GLOW: '#22d3ee',
  EMERALD_GLOW: '#10b981',
  BLUE_GLOW: '#3b82f6',
  ACCENT_RED: '#ef4444',
  ACCENT_PURPLE: '#a855f7',
  ACCENT_AMBER: '#f59e0b',
  TEXT_PRIMARY: 'rgba(255, 255, 255, 0.95)',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.75)',
  TRANSPARENT_DARK: 'rgba(0, 0, 0, 0.5)',
};

// ===== DOM SELECTORS =====
export const SELECTORS = {
  // Input elements
  INPUT_CAR: '#input-car',
  INPUT_BIKE: '#input-bike',
  INPUT_TRANSIT: '#input-transit',
  INPUT_FLIGHTS: '#input-flights',
  INPUT_ELECTRICITY: '#input-electricity',
  INPUT_LPG: '#input-lpg',
  INPUT_RENEWABLE: '#input-renewable',
  INPUT_CLOTHES: '#input-clothes',
  INPUT_ELECTRONICS: '#input-electronics',
  INPUT_2050: '#input-2050',

  // Display elements
  RESULTS_CO2: '#results-co2-val',
  RESULTS_RADIAL: '#results-radial-progress',
  CALCULATOR_RESULTS: '.calculator-results',

  // Simulator toggles
  SIM_EV: '#sim-ev',
  SIM_SOLAR: '#sim-solar',
  SIM_VEG: '#sim-veg',
  SIM_FLIGHTS: '#sim-flights',
  SIM_LED: '#sim-led',
  SIM_BIKE: '#sim-bike',

  // Canvas containers
  HOLOGRAM_CANVAS: '#hologram-canvas-container',
  SIM_EARTH_CANVAS: '#sim-earth-canvas-container',
  MY_EARTH_CANVAS: '#my-earth-3d-container',
  PARTICLE_CANVAS: '#particle-canvas',

  // AI Coach
  AI_INSIGHTS: '#ai-insights-container',
  COACH_MODE: '#coach-mode-indicator',
  COACH_CONFIDENCE: '#coach-confidence-bar',

  // My Earth
  MY_EARTH_HEALTH: '#my-earth-health-label',
  MY_EARTH_HEALTH_DESC: '#my-earth-health-desc',
};

// ===== ANIMATION TIMINGS (ms) =====
export const TIMINGS = {
  SLIDE_ANIMATION: 300,
  CARD_REVEAL: 400,
  EARTH_MORPH: 1000,
  TYPEWRITER_CHAR: 30,
  PULSE_ANIMATION: 1500,
  TRANSITION_DEFAULT: 250,
};

// ===== EMISSION BREAKPOINTS =====
export const EMISSION_LEVELS = {
  CRITICAL: { max: 2500, color: 'red', label: 'Critical' },
  STRESSED: { max: 5000, color: 'orange', label: 'Stressed' },
  HEALING: { max: 7500, color: 'yellow', label: 'Healing' },
  THRIVING: { max: Infinity, color: 'green', label: 'Thriving' },
};

// ===== GREENNESS CALCULATION FACTORS =====
export const GREENNESS_FACTORS = {
  MIN_CO2: 2000,
  MAX_CO2: 10000,
  TOGGLE_WEIGHT: 0.4,
  SLIDER_WEIGHT: 0.6,
};

// ===== PERSONA THRESHOLDS =====
export const PERSONA_THRESHOLDS = {
  TRAVELER: 0.45,
  POWER_GUARDIAN: 0.40,
  FOOD_ARCHITECT: 0.35,
  CIRCULAR_CONSUMER: 0.30,
};

// ===== STORAGE KEYS =====
export const STORAGE_KEYS = {
  USER_STATE: 'carbonwise_user_state',
  STATS: 'carbonwise_stats',
  ACHIEVEMENTS: 'carbonwise_achievements',
};

// ===== API CONFIGURATION =====
export const API_CONFIG = {
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  GEMINI_API_KEY_FALLBACK: 'YOUR_KEY', // Triggers Demo AI mode
  DEMO_MODE_CONFIDENCE: 95,
  REAL_API_CONFIDENCE: 97,
};

// ===== DEFAULT STATE =====
export const DEFAULT_STATE = {
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
    electronics: 2,
  },
  calculated: {
    co2: 4500,
    breakdown: { trans: 0, energy: 0, food: 0, shopping: 0 },
    percentages: { trans: 0, energy: 0, food: 0, shopping: 0 },
    maxCategory: 'trans',
  },
  simulators: {
    ev: false,
    solar: false,
    veg: false,
    flights: false,
    led: false,
    bike: false,
  },
  xp: 1250,
  level: 3,
  rank: 'Green Hero',
};
