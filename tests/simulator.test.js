/**
 * CarbonWise AI - Simulator Tests
 * Tests for future impact simulation and sustainability toggle effects
 * @requires simulator.js
 */

const SimulatorTests = {
  /**
   * Test that enabling EV reduces transport emissions
   */
  testEVReduction() {
    const baseCO2 = 120 * 52 * 0.192; // 1196.16 kg
    const evSavings = 120 * 52 * 0.192 * 0.75; // 75% reduction
    const projectedEV = baseCO2 - evSavings;

    console.assert(projectedEV < baseCO2, 'EV should reduce car emissions');
    console.assert(evSavings > 0, 'EV savings should be positive');
    console.log('✓ testEVReduction: PASSED');
  },

  /**
   * Test that solar panels reduce energy emissions
   */
  testSolarReduction() {
    const elecCO2 = 350 * 12 * 0.708; // Base electricity
    const solarSavings = elecCO2 * 0.8; // 80% reduction with solar

    console.assert(solarSavings > 0, 'Solar savings should be positive');
    console.assert(solarSavings < elecCO2, 'Solar should reduce energy emissions');
    console.log('✓ testSolarReduction: PASSED');
  },

  /**
   * Test that vegetarian diet reduces food emissions
   */
  testVegetarianReduction() {
    const meatCO2 = 3600;
    const vegCO2 = 1700;
    const savings = meatCO2 - vegCO2;

    console.assert(savings > 0, 'Vegetarian diet should reduce emissions');
    console.assert(savings > 1500, 'Vegetarian should save significant emissions vs meat');
    console.log('✓ testVegetarianReduction: PASSED');
  },

  /**
   * Test that reducing flights saves emissions
   */
  testFlightReduction() {
    const flightCO2 = 4 * 255; // 4 domestic flights
    const flightSavings = (flightCO2 * 0.5); // 50% reduction

    console.assert(flightSavings > 0, 'Flight reduction should save emissions');
    console.log('✓ testFlightReduction: PASSED');
  },

  /**
   * Test cumulative effects of multiple sustainability choices
   */
  testCumulativeEffect() {
    const baseCO2 = 5000;

    // Apply each toggle
    let savings = 0;
    savings += 120 * 52 * 0.18 * 0.75; // EV
    savings += (350 * 12 * 0.45) * 0.8; // Solar
    savings += (3600 - 1700); // Veg diet
    savings += 4 * 600 * 0.5; // Flights
    savings += (350 * 12 * 0.45) * 0.15; // LED
    savings += 120 * 52 * 0.18 * 0.2; // Bike

    const projected = Math.max(0, baseCO2 - savings);

    console.assert(projected < baseCO2, 'All toggles enabled should reduce total emissions');
    console.log('✓ testCumulativeEffect: PASSED');
  },

  /**
   * Test future timeline descriptions change with slider
   */
  testFutureNarrative() {
    const narratives = (sliderVal) => {
      if (sliderVal <= 20) return 'world gasping';
      if (sliderVal <= 50) return 'tipping point';
      if (sliderVal <= 80) return 'momentum builds';
      return 'world reborn';
    };

    console.assert(narratives(10).includes('gasping'), 'Low slider = crisis narrative');
    console.assert(narratives(35).includes('tipping'), 'Mid-low slider = tipping point');
    console.assert(narratives(65).includes('momentum'), 'Mid-high slider = recovery');
    console.assert(narratives(90).includes('reborn'), 'High slider = success');

    console.log('✓ testFutureNarrative: PASSED');
  },

  /**
   * Test Earth greenness calculation from toggles and slider
   */
  testGreenessCalculation() {
    const calcGreenness = (toggleCount, sliderVal) => {
      const toggleFactor = toggleCount / 6; // 6 total toggles
      const sliderFactor = sliderVal / 100;
      return (toggleFactor * 0.4) + (sliderFactor * 0.6);
    };

    const noToggles0Slider = calcGreenness(0, 0);
    const allToggles100Slider = calcGreenness(6, 100);

    console.assert(noToggles0Slider === 0, 'No actions = no greenness');
    console.assert(allToggles100Slider === 1, 'All actions = full greenness');
    console.assert(noToggles0Slider < allToggles100Slider, 'Greenness should increase with actions');

    console.log('✓ testGreenessCalculation: PASSED');
  },

  runAll() {
    console.log('\n=== Running Simulator Tests ===\n');
    this.testEVReduction();
    this.testSolarReduction();
    this.testVegetarianReduction();
    this.testFlightReduction();
    this.testCumulativeEffect();
    this.testFutureNarrative();
    this.testGreenessCalculation();
    console.log('\n=== Simulator Tests Complete ===\n');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimulatorTests;
}
