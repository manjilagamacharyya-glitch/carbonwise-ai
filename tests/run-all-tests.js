/**
 * CarbonWise AI - Master Test Suite
 * Runs all automated tests for the application
 */

// Import all test modules
const CalculatorTests = require('./calculator.test.js');
const PersonaTests = require('./persona.test.js');
const SimulatorTests = require('./simulator.test.js');
const AIEngineTests = require('./ai-engine.test.js');
const CommunityTests = require('./community.test.js');

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║           CarbonWise AI - AUTOMATED TEST SUITE             ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// Run all test suites
CalculatorTests.runAll();
PersonaTests.runAll();
SimulatorTests.runAll();
AIEngineTests.runAll();
CommunityTests.runAll();

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                   ALL TESTS COMPLETED ✓                    ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('\n');
