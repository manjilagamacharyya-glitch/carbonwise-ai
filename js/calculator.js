/* ==========================================================================
   CARBONWISE AI - CARBON FOOTPRINT CALCULATOR MATHEMATICS & DOM BINDING
   Source-Backed Emission Factors: IPCC AR6, EPA, Our World in Data, CEA India
   ========================================================================== */

// Verified emission factors with citations
const emissionFactors = {
  car: 0.192,                // kg CO₂/km — IPCC AR6 (avg petrol car)
  bus: 0.105,                // kg CO₂/km — EPA (average urban bus)
  train: 0.041,              // kg CO₂/km — Our World in Data
  flightDomestic: 255,       // kg CO₂/flight — IPCC AR6 (avg domestic)
  flightInternational: 1100, // kg CO₂/flight — IPCC AR6 (avg international)
  electricityIndia: 0.708,   // kg CO₂/kWh — CEA India 2024
  lpg: 2.98,                 // kg CO₂/kg — IPCC AR6
  clothing: 14,              // kg CO₂/item — WRAP UK Study
  electronics: 120,          // kg CO₂/item — Carbon Trust
  dietVegetarian: 1700,      // kg CO₂/year — Our World in Data
  dietMixed: 2800,           // kg CO₂/year — Our World in Data
  dietMeatHeavy: 3600,       // kg CO₂/year — Our World in Data
};

const emissionSources = [
  { factor: 'Car (0.192 kg/km)', source: 'IPCC AR6, Chapter 10' },
  { factor: 'Bus (0.105 kg/km)', source: 'US EPA Emission Factors Hub' },
  { factor: 'Train (0.041 kg/km)', source: 'Our World in Data, 2023' },
  { factor: 'Domestic Flight (255 kg)', source: 'IPCC AR6, Aviation' },
  { factor: 'Int\'l Flight (1100 kg)', source: 'IPCC AR6, Aviation' },
  { factor: 'Electricity India (0.708 kg/kWh)', source: 'CEA India, 2024' },
  { factor: 'LPG (2.98 kg/kg)', source: 'IPCC AR6, Residential' },
];

export function initCarbonCalculator() {
  const inputs = {
    car: document.getElementById('input-car'),
    bike: document.getElementById('input-bike'),
    transit: document.getElementById('input-transit'),
    flights: document.getElementById('input-flights'),
    electricity: document.getElementById('input-electricity'),
    lpg: document.getElementById('input-lpg'),
    renewable: document.getElementById('input-renewable'),
    clothes: document.getElementById('input-clothes'),
    electronics: document.getElementById('input-electronics'),
  };

  const displays = {
    car: document.getElementById('val-car'),
    bike: document.getElementById('val-bike'),
    transit: document.getElementById('val-transit'),
    flights: document.getElementById('val-flights'),
    electricity: document.getElementById('val-electricity'),
    lpg: document.getElementById('val-lpg'),
    renewable: document.getElementById('val-renewable'),
    clothes: document.getElementById('val-clothes'),
    electronics: document.getElementById('val-electronics'),
    resultsCo2: document.getElementById('results-co2-val'),
    resultsRadialProgress: document.getElementById('results-radial-progress'),
    compBarUser: document.getElementById('comp-bar-user'),
    compValUser: document.getElementById('comp-val-user'),
    // Breakdown percentages
    pctTrans: document.getElementById('pct-trans'),
    pctEnergy: document.getElementById('pct-energy'),
    pctFood: document.getElementById('pct-food'),
    pctShopping: document.getElementById('pct-shopping'),
    barTrans: document.getElementById('bar-trans'),
    barEnergy: document.getElementById('bar-energy'),
    barFood: document.getElementById('bar-food'),
    barShopping: document.getElementById('bar-shopping'),
    alertBanner: document.getElementById('category-alert-banner'),
    alertBannerText: document.getElementById('alert-banner-text'),
  };

  // Diet button selection listeners
  const dietButtons = {
    veg: document.getElementById('btn-diet-veg'),
    mix: document.getElementById('btn-diet-mix'),
    meat: document.getElementById('btn-diet-meat'),
  };

  // Set up range value updates in real-time
  Object.keys(inputs).forEach((key) => {
    if (inputs[key]) {
      inputs[key].addEventListener('input', (e) => {
        if (displays[key]) {
          displays[key].textContent = e.target.value;
        }
        updateCalculations();
      });
    }
  });

  // Diet buttons handler
  Object.keys(dietButtons).forEach((key) => {
    if (dietButtons[key]) {
      dietButtons[key].addEventListener('click', () => {
        // Toggle active status
        Object.values(dietButtons).forEach((btn) => btn.classList.remove('active'));
        dietButtons[key].classList.add('active');
        
        let dietVal = 'vegetarian';
        if (key === 'mix') dietVal = 'mixed';
        if (key === 'meat') dietVal = 'meat';
        
        window.CarbonWiseState.inputs.diet = dietVal;
        updateCalculations();
      });
    }
  });

  // Calculate Button — Triggers storytelling flow
  const calcBtn = document.getElementById('calculate-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      // Trigger a visual calculation animation (pulse radial indicator)
      const circle = displays.resultsRadialProgress;
      if (circle) {
        circle.style.transition = 'none';
        circle.style.strokeDashoffset = '251.2';
        setTimeout(() => {
          circle.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
          updateCalculations();
          // Trigger confetti if footprint is below target
          if (window.CarbonWiseState.calculated.co2 < 3000) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }, 100);
      }

      // Dispatch storytelling flow event
      window.dispatchEvent(new CustomEvent('storytellingFlow', { detail: window.CarbonWiseState }));
    });
  }

  // Source citation toggle
  const sourceToggle = document.getElementById('toggle-sources-btn');
  const sourcePanel = document.getElementById('sources-panel');
  if (sourceToggle && sourcePanel) {
    sourceToggle.addEventListener('click', () => {
      sourcePanel.classList.toggle('expanded');
      sourceToggle.textContent = sourcePanel.classList.contains('expanded') ? 'Hide Sources ▲' : 'View Sources ▼';
    });
  }

  // Live calculation function with source-backed emission factors
  function updateCalculations() {
    // 1. Read input values
    const carVal = parseFloat(inputs.car.value);
    const bikeVal = parseFloat(inputs.bike.value);
    const transitVal = parseFloat(inputs.transit.value);
    const flightsVal = parseFloat(inputs.flights.value);
    const electricityVal = parseFloat(inputs.electricity.value);
    const lpgVal = parseFloat(inputs.lpg.value);
    const renewableVal = parseFloat(inputs.renewable.value);
    const clothesVal = parseFloat(inputs.clothes.value);
    const electronicsVal = parseFloat(inputs.electronics.value);

    // Save inputs to global state
    window.CarbonWiseState.inputs = {
      car: carVal,
      bike: bikeVal,
      transit: transitVal,
      flights: flightsVal,
      electricity: electricityVal,
      lpg: lpgVal,
      renewable: renewableVal,
      diet: window.CarbonWiseState.inputs.diet,
      clothes: clothesVal,
      electronics: electronicsVal
    };

    // 2. Compute category carbon emissions (kg CO2/year) — IPCC/EPA backed
    // Transportation: Car + Bus/Transit + Flights (domestic if ≤3, mixed above)
    const carCO2 = carVal * 52 * emissionFactors.car;
    const transitCO2 = transitVal * 52 * emissionFactors.bus;
    const bikeCO2 = 0; // Zero emissions
    let flightCO2 = 0;
    if (flightsVal <= 3) {
      flightCO2 = flightsVal * emissionFactors.flightDomestic;
    } else {
      flightCO2 = (3 * emissionFactors.flightDomestic) + ((flightsVal - 3) * emissionFactors.flightInternational);
    }
    const transCO2 = carCO2 + transitCO2 + bikeCO2 + flightCO2;
    
    // Energy: Electricity (India grid factor) + LPG — reduced by renewable %
    const electricityCO2 = (electricityVal * 12 * emissionFactors.electricityIndia) * (1 - renewableVal / 100);
    const lpgCO2 = lpgVal * 12 * emissionFactors.lpg;
    const energyCO2 = electricityCO2 + lpgCO2;

    // Diet: Source-backed annual values
    let dietCO2 = emissionFactors.dietVegetarian;
    if (window.CarbonWiseState.inputs.diet === 'mixed') dietCO2 = emissionFactors.dietMixed;
    if (window.CarbonWiseState.inputs.diet === 'meat') dietCO2 = emissionFactors.dietMeatHeavy;

    // Shopping: Clothing + Electronics
    const shoppingCO2 = (clothesVal * 12 * emissionFactors.clothing) + (electronicsVal * emissionFactors.electronics);

    // 3. Totals
    const totalCO2 = transCO2 + energyCO2 + dietCO2 + shoppingCO2;
    const tonsCO2 = totalCO2 / 1000;

    // Save outputs to global state
    window.CarbonWiseState.calculated.co2 = totalCO2;
    window.CarbonWiseState.calculated.breakdown = {
      trans: transCO2,
      energy: energyCO2,
      food: dietCO2,
      shopping: shoppingCO2
    };

    // Compute percentages
    const pctTransVal = Math.round((transCO2 / totalCO2) * 100) || 0;
    const pctEnergyVal = Math.round((energyCO2 / totalCO2) * 100) || 0;
    const pctFoodVal = Math.round((dietCO2 / totalCO2) * 100) || 0;
    const pctShoppingVal = Math.round((shoppingCO2 / totalCO2) * 100) || 0;

    window.CarbonWiseState.calculated.percentages = {
      trans: pctTransVal,
      energy: pctEnergyVal,
      food: pctFoodVal,
      shopping: pctShoppingVal
    };

    // 4. Update UI displays
    if (displays.resultsCo2) {
      displays.resultsCo2.textContent = tonsCO2.toFixed(1);
    }

    // Radial progress circle dashoffset mapping (cap at 12 Tons CO2/yr max)
    if (displays.resultsRadialProgress) {
      const circumference = 251.2;
      const progressPercent = Math.min(tonsCO2 / 12, 1);
      displays.resultsRadialProgress.style.strokeDashoffset = circumference - (progressPercent * circumference);
      
      // Update color based on emissions level
      if (tonsCO2 < 4.0) {
        displays.resultsRadialProgress.style.stroke = 'var(--emerald-glow)';
        displays.resultsRadialProgress.style.filter = 'drop-shadow(0 0 8px var(--emerald-glow))';
      } else if (tonsCO2 < 8.0) {
        displays.resultsRadialProgress.style.stroke = 'var(--cyan-glow)';
        displays.resultsRadialProgress.style.filter = 'drop-shadow(0 0 8px var(--cyan-glow))';
      } else {
        displays.resultsRadialProgress.style.stroke = 'var(--accent-red)';
        displays.resultsRadialProgress.style.filter = 'drop-shadow(0 0 8px var(--accent-red))';
      }
    }

    // Comparison Bars
    if (displays.compValUser) {
      displays.compValUser.textContent = Math.round(totalCO2).toLocaleString() + ' kg';
    }
    if (displays.compBarUser) {
      // Comparison bars represent up to 10,000 kg CO2 max
      const userBarPercent = Math.min((totalCO2 / 10000) * 100, 100);
      displays.compBarUser.style.width = userBarPercent + '%';
      if (totalCO2 > 6000) {
        displays.compBarUser.className = 'comp-bar-fill fill-red';
        displays.compBarUser.style.background = 'var(--accent-red)';
      } else if (totalCO2 > 3000) {
        displays.compBarUser.className = 'comp-bar-fill fill-cyan';
        displays.compBarUser.style.background = 'var(--cyan-glow)';
      } else {
        displays.compBarUser.className = 'comp-bar-fill fill-emerald';
        displays.compBarUser.style.background = 'var(--emerald-glow)';
      }
    }

    // Update breakdown percentages and bars with animation
    if (displays.pctTrans) displays.pctTrans.textContent = pctTransVal + '%';
    if (displays.pctEnergy) displays.pctEnergy.textContent = pctEnergyVal + '%';
    if (displays.pctFood) displays.pctFood.textContent = pctFoodVal + '%';
    if (displays.pctShopping) displays.pctShopping.textContent = pctShoppingVal + '%';

    if (displays.barTrans) displays.barTrans.style.width = pctTransVal + '%';
    if (displays.barEnergy) displays.barEnergy.style.width = pctEnergyVal + '%';
    if (displays.barFood) displays.barFood.style.width = pctFoodVal + '%';
    if (displays.barShopping) displays.barShopping.style.width = pctShoppingVal + '%';

    // 5. Highlight biggest contributor
    const categories = [
      { name: 'trans', val: transCO2, pct: pctTransVal, title: 'Transportation', element: document.getElementById('breakdown-trans') },
      { name: 'energy', val: energyCO2, pct: pctEnergyVal, title: 'Home Energy', element: document.getElementById('breakdown-energy') },
      { name: 'food', val: dietCO2, pct: pctFoodVal, title: 'Food & Diet', element: document.getElementById('breakdown-food') },
      { name: 'shopping', val: shoppingCO2, pct: pctShoppingVal, title: 'Shopping', element: document.getElementById('breakdown-shopping') }
    ];

    // Find max value
    let maxCategory = categories[0];
    categories.forEach((c) => {
      c.element.classList.remove('alert-max');
      if (c.val > maxCategory.val) {
        maxCategory = c;
      }
    });

    // Mark the max category with pulse animation
    maxCategory.element.classList.add('alert-max');
    window.CarbonWiseState.calculated.maxCategory = maxCategory.name;

    // Display Alert Warning
    if (displays.alertBannerText) {
      displays.alertBannerText.innerHTML = `<strong>${maxCategory.title}</strong> contributes ${maxCategory.pct}% of your emissions (${Math.round(maxCategory.val).toLocaleString()} kg CO₂/yr). This category deserves immediate attention.`;
    }

    // Dispatch update event for listener components (AI coach, Simulator, My Earth, etc)
    const updateEvent = new CustomEvent('carbonStateUpdated', { detail: window.CarbonWiseState });
    window.dispatchEvent(updateEvent);
  }

  // Global demo loader function
  window.loadDemoData = function() {
    inputs.car.value = 350;
    inputs.bike.value = 5;
    inputs.transit.value = 10;
    inputs.flights.value = 4;
    inputs.electricity.value = 680;
    inputs.lpg.value = 30;
    inputs.renewable.value = 0;
    inputs.clothes.value = 10;
    inputs.electronics.value = 4;

    // Trigger input events to update text nodes
    Object.keys(inputs).forEach((key) => {
      if (inputs[key] && displays[key]) {
        displays[key].textContent = inputs[key].value;
      }
    });

    // Trigger Mixed diet select
    dietButtons.mix.click();
  };

  // Initial Calculation Run
  updateCalculations();
}
