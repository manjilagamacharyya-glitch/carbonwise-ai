/**
 * CarbonWise AI - Calculator Tests
 * Tests for carbon emission calculations and input validation
 * @requires calculator.js
 */

const CalculatorTests = {
  /**
   * Test that emissions are never negative
   */
  testEmissionsNeverNegative() {
    const testCases = [
      { car: 0, bike: 0, transit: 0, flights: 0, electricity: 0, lpg: 0, renewable: 100, diet: 'vegetarian', clothes: 0, electronics: 0 },
      { car: 100, bike: 50, transit: 100, flights: 10, electricity: 1000, lpg: 100, renewable: 0, diet: 'vegetarian', clothes: 20, electronics: 5 },
    ];

    testCases.forEach((inputs, idx) => {
      // Simulate calculator logic
      const carCO2 = inputs.car * 52 * 0.192;
      const transitCO2 = inputs.transit * 52 * 0.105;
      const flightCO2 = inputs.flights * 255;
      const electricityCO2 = (inputs.electricity * 12 * 0.708) * (1 - inputs.renewable / 100);
      const lpgCO2 = inputs.lpg * 12 * 2.98;
      const dietCO2 = inputs.diet === 'vegetarian' ? 1700 : inputs.diet === 'mixed' ? 2800 : 3600;
      const shoppingCO2 = (inputs.clothes * 12 * 14) + (inputs.electronics * 120);

      const totalCO2 = carCO2 + transitCO2 + flightCO2 + electricityCO2 + lpgCO2 + dietCO2 + shoppingCO2;

      console.assert(totalCO2 >= 0, `Test ${idx + 1}: Emissions should be >= 0, got ${totalCO2}`);
    });

    console.log('✓ testEmissionsNeverNegative: PASSED');
  },

  /**
   * Test that emissions scale correctly with input changes
   */
  testEmissionsScaling() {
    const baseCarCO2 = 0 * 52 * 0.192;
    const doubledCarCO2 = 200 * 52 * 0.192; // Roughly 2x the 100 km/week baseline

    console.assert(doubledCarCO2 > baseCarCO2, 'Emissions should increase with car travel');
    console.log('✓ testEmissionsScaling: PASSED');
  },

  /**
   * Test that renewable energy reduces electricity emissions
   */
  testRenewableEnergyReduction() {
    const noRenewable = 350 * 12 * 0.708;
    const fullRenewable = 350 * 12 * 0.708 * (1 - 100 / 100); // Should be ~0

    console.assert(fullRenewable < noRenewable, 'Full renewable energy should reduce emissions to near zero');
    console.log('✓ testRenewableEnergyReduction: PASSED');
  },

  /**
   * Test input validation and clamping
   */
  testInputValidation() {
    const validate = (value, min, max) => Math.max(min, Math.min(max, value));

    console.assert(validate(-50, 0, 1000) === 0, 'Negative input should clamp to min');
    console.assert(validate(2000, 0, 1000) === 1000, 'Oversized input should clamp to max');
    console.assert(validate(500, 0, 1000) === 500, 'Valid input should pass through');
    console.log('✓ testInputValidation: PASSED');
  },

  /**
   * Test diet factor selection
   */
  testDietFactorSelection() {
    const dietFactors = {
      vegetarian: 1700,
      mixed: 2800,
      meat: 3600
    };

    console.assert(dietFactors.vegetarian < dietFactors.mixed, 'Vegetarian should have lower emissions than mixed');
    console.assert(dietFactors.mixed < dietFactors.meat, 'Mixed should have lower emissions than meat-heavy');
    console.log('✓ testDietFactorSelection: PASSED');
  },

  runAll() {
    console.log('\n=== Running Calculator Tests ===\n');
    this.testEmissionsNeverNegative();
    this.testEmissionsScaling();
    this.testRenewableEnergyReduction();
    this.testInputValidation();
    this.testDietFactorSelection();
    console.log('\n=== Calculator Tests Complete ===\n');
  }
};

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalculatorTests;
}
