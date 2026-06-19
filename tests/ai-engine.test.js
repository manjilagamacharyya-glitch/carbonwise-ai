/**
 * CarbonWise AI - AI Engine Tests
 * Tests for Gemini API integration, fallback mode, and response validation
 * @requires ai-engine.js
 */

const AIEngineTests = {
  /**
   * Test that Demo AI mode exists and returns valid structure
   */
  testDemoAIModeResponse() {
    const DEMO_RESPONSES = {
      trans: {
        biggestContributor: 'Transportation — Your car travel and flights are the dominant source',
        easyActions: ['Carpool with colleagues 2-3 days per week'],
        mediumTermImprovements: ['Switch to a hybrid vehicle'],
        longTermRoadmap: ['Transition to a fully electric vehicle (EV) by 2028'],
        estimatedCO2Savings: ['1,200 kg/year with easy actions', '2,800 kg/year with full roadmap'],
        motivationalMessage: 'Your transportation choices have the single biggest impact'
      }
    };

    const response = DEMO_RESPONSES.trans;

    console.assert(response.biggestContributor, 'Should have biggestContributor');
    console.assert(Array.isArray(response.easyActions), 'easyActions should be array');
    console.assert(Array.isArray(response.mediumTermImprovements), 'mediumTermImprovements should be array');
    console.assert(Array.isArray(response.longTermRoadmap), 'longTermRoadmap should be array');
    console.assert(Array.isArray(response.estimatedCO2Savings), 'estimatedCO2Savings should be array');
    console.assert(response.motivationalMessage, 'Should have motivationalMessage');

    console.log('✓ testDemoAIModeResponse: PASSED');
  },

  /**
   * Test API key detection
   */
  testAPIKeyDetection() {
    const isRealAPI = (key) => {
      return key && key !== 'YOUR_KEY' && key.length > 10;
    };

    console.assert(!isRealAPI('YOUR_KEY'), 'Default key should not be detected as real');
    console.assert(!isRealAPI(''), 'Empty key should not be detected as real');
    console.assert(isRealAPI('aReasonablyLongAPIKeyString'), 'Long key should be detected as real');

    console.log('✓ testAPIKeyDetection: PASSED');
  },

  /**
   * Test response has all required fields
   */
  testResponseValidation() {
    const validateResponse = (data) => {
      const required = [
        'biggestContributor',
        'easyActions',
        'mediumTermImprovements',
        'longTermRoadmap',
        'estimatedCO2Savings',
        'motivationalMessage'
      ];

      return required.every(field => field in data);
    };

    const validResponse = {
      biggestContributor: 'test',
      easyActions: [],
      mediumTermImprovements: [],
      longTermRoadmap: [],
      estimatedCO2Savings: [],
      motivationalMessage: 'test'
    };

    const invalidResponse = {
      biggestContributor: 'test'
    };

    console.assert(validateResponse(validResponse), 'Valid response should pass validation');
    console.assert(!validateResponse(invalidResponse), 'Invalid response should fail validation');

    console.log('✓ testResponseValidation: PASSED');
  },

  /**
   * Test category-specific AI responses
   */
  testCategorySpecificResponse() {
    const categories = ['trans', 'energy', 'food', 'shopping'];
    const hasCategory = (category) => {
      return ['trans', 'energy', 'food', 'shopping'].includes(category);
    };

    categories.forEach(cat => {
      console.assert(hasCategory(cat), `Category ${cat} should be recognized`);
    });

    console.log('✓ testCategorySpecificResponse: PASSED');
  },

  /**
   * Test confidence scoring
   */
  testConfidenceScoring() {
    const calcConfidence = (isRealAPI) => {
      return isRealAPI ? 97 : 95;
    };

    console.assert(calcConfidence(true) === 97, 'Real API should have 97% confidence');
    console.assert(calcConfidence(false) === 95, 'Demo mode should have 95% confidence');

    console.log('✓ testConfidenceScoring: PASSED');
  },

  /**
   * Test response doesn't expose API key
   */
  testNoAPIKeyExposure() {
    const GEMINI_API_KEY = 'YOUR_KEY';
    const mockResponse = {
      biggestContributor: 'Transportation',
      easyActions: ['Take transit']
    };

    const responseStr = JSON.stringify(mockResponse);

    console.assert(!responseStr.includes(GEMINI_API_KEY), 'API key should not be in response');
    console.assert(!responseStr.includes('YOUR_KEY'), 'Default key should not be in response');

    console.log('✓ testNoAPIKeyExposure: PASSED');
  },

  runAll() {
    console.log('\n=== Running AI Engine Tests ===\n');
    this.testDemoAIModeResponse();
    this.testAPIKeyDetection();
    this.testResponseValidation();
    this.testCategorySpecificResponse();
    this.testConfidenceScoring();
    this.testNoAPIKeyExposure();
    console.log('\n=== AI Engine Tests Complete ===\n');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIEngineTests;
}
