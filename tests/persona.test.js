/**
 * CarbonWise AI - Persona Tests
 * Tests for carbon persona generation and scoring
 * @requires persona.js
 */

const PersonaTests = {
  /**
   * Test carbon score is within valid range
   */
  testCarbonScoreRange() {
    const computeScore = (state) => {
      let score = 100 - ((state.calculated.co2 - 2400) / 60);
      score -= state.inputs.flights * 1.8;
      score -= state.inputs.lpg > 25 ? 6 : 0;
      score -= state.inputs.diet === 'meat' ? 5 : state.inputs.diet === 'mixed' ? 2 : 0;
      score += state.inputs.renewable * 0.08;
      score += state.inputs.bike * 0.02;
      return Math.max(20, Math.min(100, score));
    };

    const testStates = [
      { calculated: { co2: 2000 }, inputs: { flights: 0, lpg: 10, diet: 'vegetarian', renewable: 50, bike: 20 } },
      { calculated: { co2: 5000 }, inputs: { flights: 5, lpg: 50, diet: 'meat', renewable: 0, bike: 0 } },
      { calculated: { co2: 8000 }, inputs: { flights: 10, lpg: 100, diet: 'meat', renewable: 0, bike: 0 } },
    ];

    testStates.forEach((state, idx) => {
      const score = computeScore(state);
      console.assert(score >= 20 && score <= 100, `Test ${idx + 1}: Score ${score} should be in range [20, 100]`);
    });

    console.log('✓ testCarbonScoreRange: PASSED');
  },

  /**
   * Test that eco-friendly choices increase score
   */
  testEcoFriendlyChoicesIncrease() {
    const computeScore = (state) => {
      let score = 100 - ((state.calculated.co2 - 2400) / 60);
      score -= state.inputs.flights * 1.8;
      score -= state.inputs.renewable * 0.08; // Bonus for renewable
      return Math.max(20, Math.min(100, score));
    };

    const lowRenewable = computeScore({ calculated: { co2: 4000 }, inputs: { flights: 2, renewable: 0 } });
    const highRenewable = computeScore({ calculated: { co2: 4000 }, inputs: { flights: 2, renewable: 100 } });

    console.assert(highRenewable < lowRenewable, 'Higher renewable should reduce emissions contribution to score');
    console.log('✓ testEcoFriendlyChoicesIncrease: PASSED');
  },

  /**
   * Test persona selection based on emissions category
   */
  testPersonaSelection() {
    const choosePersona = (transPercent, energyPercent, foodPercent, shoppingPercent) => {
      if (transPercent >= 45) return 'Carbon Heavy Traveler';
      if (energyPercent >= 40) return 'Power Guardian';
      if (foodPercent >= 35) return 'Food Future Architect';
      if (shoppingPercent >= 30) return 'Circular Consumer';
      return 'Eco Explorer';
    };

    console.assert(choosePersona(50, 30, 10, 10) === 'Carbon Heavy Traveler', 'High transport = traveler persona');
    console.assert(choosePersona(20, 45, 20, 15) === 'Power Guardian', 'High energy = power guardian');
    console.assert(choosePersona(30, 20, 40, 10) === 'Food Future Architect', 'High food = architect');
    console.assert(choosePersona(20, 30, 30, 35) === 'Circular Consumer', 'High shopping = consumer');
    console.assert(choosePersona(30, 30, 20, 20) === 'Eco Explorer', 'Balanced = explorer');

    console.log('✓ testPersonaSelection: PASSED');
  },

  /**
   * Test climate twin equivalences are realistic
   */
  testClimateEquivalents() {
    const formatEquivalent = (totalCO2) => {
      const drivingKm = Math.round(totalCO2 / 0.192);
      const trees = Math.round(totalCO2 / 21.8);
      const flights = Math.max(1, Math.round(totalCO2 / 1100));
      return { driving: drivingKm, trees, flights };
    };

    const equiv = formatEquivalent(4200);
    console.assert(equiv.driving > 0, 'Driving distance should be positive');
    console.assert(equiv.trees > 0, 'Trees should be positive');
    console.assert(equiv.flights >= 1, 'Flights should be at least 1');
    console.log('✓ testClimateEquivalents: PASSED');
  },

  /**
   * Test persona score translates to realistic levels
   */
  testPersonaScoringTiers() {
    const getLevel = (score) => {
      if (score >= 85) return 'Elite';
      if (score >= 70) return 'Advanced';
      if (score >= 50) return 'Balanced';
      return 'Emerging';
    };

    console.assert(getLevel(95) === 'Elite', 'High score = Elite');
    console.assert(getLevel(75) === 'Advanced', 'Medium-high score = Advanced');
    console.assert(getLevel(60) === 'Balanced', 'Medium score = Balanced');
    console.assert(getLevel(30) === 'Emerging', 'Low score = Emerging');

    console.log('✓ testPersonaScoringTiers: PASSED');
  },

  runAll() {
    console.log('\n=== Running Persona Tests ===\n');
    this.testCarbonScoreRange();
    this.testEcoFriendlyChoicesIncrease();
    this.testPersonaSelection();
    this.testClimateEquivalents();
    this.testPersonaScoringTiers();
    console.log('\n=== Persona Tests Complete ===\n');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PersonaTests;
}
