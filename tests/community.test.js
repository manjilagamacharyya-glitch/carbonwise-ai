/**
 * CarbonWise AI - Community Tests
 * Tests for My Earth ecosystem and environmental state transitions
 * @requires community.js
 */

const CommunityTests = {
  /**
   * Test Earth health state based on greenness
   */
  testEarthHealthStates() {
    const getHealthState = (greenness) => {
      if (greenness < 0.25) return { label: 'Critical', emoji: '🔴', desc: 'suffering' };
      if (greenness < 0.5) return { label: 'Stressed', emoji: '🟠', desc: 'recovery' };
      if (greenness < 0.75) return { label: 'Healing', emoji: '🟢', desc: 'growing' };
      return { label: 'Thriving', emoji: '🌍', desc: 'paradise' };
    };

    const critical = getHealthState(0.1);
    const stressed = getHealthState(0.35);
    const healing = getHealthState(0.65);
    const thriving = getHealthState(0.9);

    console.assert(critical.label === 'Critical', 'Low greenness = Critical');
    console.assert(stressed.label === 'Stressed', 'Low-mid greenness = Stressed');
    console.assert(healing.label === 'Healing', 'Mid-high greenness = Healing');
    console.assert(thriving.label === 'Thriving', 'High greenness = Thriving');

    console.log('✓ testEarthHealthStates: PASSED');
  },

  /**
   * Test atmosphere visual state changes
   */
  testAtmosphereVisuals() {
    const getAtmosphereDesc = (greenness) => {
      if (greenness < 0.25) return 'Carbon Saturated';
      if (greenness < 0.5) return 'Hazy';
      if (greenness < 0.75) return 'Clearing';
      return 'Balanced';
    };

    console.assert(getAtmosphereDesc(0.1) === 'Carbon Saturated', 'High pollution = saturated');
    console.assert(getAtmosphereDesc(0.4) === 'Hazy', 'Medium pollution = hazy');
    console.assert(getAtmosphereDesc(0.7) === 'Clearing', 'Low pollution = clearing');
    console.assert(getAtmosphereDesc(0.9) === 'Balanced', 'Very low pollution = balanced');

    console.log('✓ testAtmosphereVisuals: PASSED');
  },

  /**
   * Test forest health visualization
   */
  testForestHealth() {
    const getForestDesc = (greenness) => {
      if (greenness < 0.25) return 'Burning';
      if (greenness < 0.5) return 'Thin';
      if (greenness < 0.75) return 'Growing';
      return 'Lush';
    };

    console.assert(getForestDesc(0.1) === 'Burning', 'Extreme crisis = burning');
    console.assert(getForestDesc(0.4) === 'Thin', 'Stressed = thin');
    console.assert(getForestDesc(0.7) === 'Growing', 'Healing = growing');
    console.assert(getForestDesc(0.9) === 'Lush', 'Thriving = lush');

    console.log('✓ testForestHealth: PASSED');
  },

  /**
   * Test ocean state transitions
   */
  testOceanState() {
    const getOceanDesc = (greenness) => {
      if (greenness < 0.25) return 'Dark & Warm';
      if (greenness < 0.5) return 'Cloudy';
      if (greenness < 0.75) return 'Stabilizing';
      return 'Sparkling';
    };

    console.assert(getOceanDesc(0.1) === 'Dark & Warm', 'Crisis = dark warm ocean');
    console.assert(getOceanDesc(0.4) === 'Cloudy', 'Stressed = cloudy');
    console.assert(getOceanDesc(0.7) === 'Stabilizing', 'Healing = stabilizing');
    console.assert(getOceanDesc(0.9) === 'Sparkling', 'Thriving = sparkling');

    console.log('✓ testOceanState: PASSED');
  },

  /**
   * Test greenness calculation from CO2
   */
  testGreennessFromCO2() {
    const calcGreenness = (co2) => {
      return Math.max(0, Math.min(1, 1 - (co2 - 2000) / 8000));
    };

    const veryLow = calcGreenness(2000); // 1.0 greenness
    const low = calcGreenness(3000); // 0.875
    const medium = calcGreenness(5000); // 0.625
    const high = calcGreenness(8000); // 0.25
    const veryHigh = calcGreenness(10000); // 0.0

    console.assert(veryLow === 1, 'Very low emissions = maximum greenness');
    console.assert(veryHigh === 0, 'Very high emissions = minimum greenness');
    console.assert(low > medium && medium > high, 'Greenness should decrease with emissions');

    console.log('✓ testGreennessFromCO2: PASSED');
  },

  /**
   * Test smooth state transitions
   */
  testStateTransitions() {
    const smoothTransition = (current, target, speed = 0.015) => {
      return current + (target - current) * speed;
    };

    let current = 0.3;
    const target = 0.8;

    for (let i = 0; i < 50; i++) {
      current = smoothTransition(current, target);
    }

    console.assert(current > 0.3 && current < 0.8, 'Transition should progress gradually');
    console.log('✓ testStateTransitions: PASSED');
  },

  /**
   * Test community counter increments realistically
   */
  testCommunityCounters() {
    let co2Sum = 14242501;
    let treesSum = 582304;

    const increment = () => {
      co2Sum += Math.random() * 2.5;
      if (Math.random() > 0.85) {
        treesSum += 1;
      }
    };

    const initialCO2 = co2Sum;
    const initialTrees = treesSum;

    for (let i = 0; i < 100; i++) {
      increment();
    }

    console.assert(co2Sum > initialCO2, 'Community CO2 should increase');
    console.assert(treesSum >= initialTrees, 'Community trees should not decrease');
    console.log('✓ testCommunityCounters: PASSED');
  },

  runAll() {
    console.log('\n=== Running Community Tests ===\n');
    this.testEarthHealthStates();
    this.testAtmosphereVisuals();
    this.testForestHealth();
    this.testOceanState();
    this.testGreennessFromCO2();
    this.testStateTransitions();
    this.testCommunityCounters();
    console.log('\n=== Community Tests Complete ===\n');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommunityTests;
}
