/* ==========================================================================
   CARBONWISE AI - FUTURE IMPACT SIMULATOR ENGINE (THREE.JS WORLD MORPH)
   ========================================================================== */

export function initFutureSimulator() {
  const simEarthContainer = document.getElementById('sim-earth-canvas-container');
  const smogOverlay = document.getElementById('smog-screen-overlay');
  
  // Toggles
  const toggles = {
    ev: document.getElementById('sim-ev'),
    solar: document.getElementById('sim-solar'),
    veg: document.getElementById('sim-veg'),
    flights: document.getElementById('sim-flights'),
    led: document.getElementById('sim-led'),
    bike: document.getElementById('sim-bike'),
  };

  // Toggle Cards (for active borders)
  const toggleCards = {
    ev: document.getElementById('toggle-card-ev'),
    solar: document.getElementById('toggle-card-solar'),
    veg: document.getElementById('toggle-card-veg'),
    flights: document.getElementById('toggle-card-flights'),
    led: document.getElementById('toggle-card-led'),
    bike: document.getElementById('toggle-card-bike'),
  };

  // Slider 2050
  const slider2050 = document.getElementById('input-2050');
  const desc2050 = document.getElementById('text-2050-desc');
  const earthStateLabel = document.getElementById('visual-earth-state-label');

  // Stats Displays
  const displays = {
    currVal: document.getElementById('sim-curr-val'),
    projVal: document.getElementById('sim-proj-val'),
    savedVal: document.getElementById('sim-saved-val'),
    treesVal: document.getElementById('sim-trees-val'),
    // HUD FX labels
    atmosphere: document.getElementById('fx-atmosphere-val'),
    forests: document.getElementById('fx-forests-val'),
    ocean: document.getElementById('fx-ocean-val'),
  };

  if (!simEarthContainer) return;

  const width = simEarthContainer.clientWidth;
  const height = simEarthContainer.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 210;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  simEarthContainer.appendChild(renderer.domElement);

  // Group container
  const simGlobeGroup = new THREE.Group();
  scene.add(simGlobeGroup);

  // 1. Core Sphere (morphic color)
  const coreGeom = new THREE.SphereGeometry(55, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x4a3b32, // Initially dead/polluted brownish-grey
    transparent: true,
    opacity: 0.5,
    wireframe: true
  });
  const coreMesh = new THREE.Mesh(coreGeom, coreMat);
  simGlobeGroup.add(coreMesh);

  // 2. Latitude/Longitude Grid (morphic color: Red -> Green)
  const gridGeom = new THREE.SphereGeometry(56, 16, 16);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0xef4444, // Initially red warning
    transparent: true,
    opacity: 0.35,
    wireframe: true
  });
  const gridMesh = new THREE.Mesh(gridGeom, gridMat);
  simGlobeGroup.add(gridMesh);

  // 3. Orbiting Data Ring
  const orbitGeom = new THREE.RingGeometry(65, 65.5, 64);
  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.15,
  });
  const orbit = new THREE.Mesh(orbitGeom, orbitMat);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  // Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  // Drag interaction
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };

  simEarthContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  simEarthContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = {
      x: e.clientX - prevMousePos.x,
      y: e.clientY - prevMousePos.y
    };
    simGlobeGroup.rotation.y += delta.x * 0.005;
    simGlobeGroup.rotation.x += delta.y * 0.005;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Listen to carbon footprint changes to keep baseline stats synced
  window.addEventListener('carbonStateUpdated', () => {
    updateSimulatorMath();
  });

  // Add toggle event listeners
  Object.keys(toggles).forEach((key) => {
    if (toggles[key]) {
      toggles[key].addEventListener('change', () => {
        // Toggle card visual active state
        if (toggles[key].checked) {
          toggleCards[key].classList.add(`active-${key}`);
        } else {
          toggleCards[key].classList.remove(`active-${key}`);
        }

        updateSimulatorMath();
      });
    }
  });

  // Add 2050 timeline slider listener
  if (slider2050) {
    slider2050.addEventListener('input', () => {
      updateSimulatorMath();
    });
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
      simGlobeGroup.rotation.y += 0.002;
      simGlobeGroup.rotation.x += 0.0005;
    }

    renderer.render(scene, camera);
  }

  // Simulator updates
  function updateSimulatorMath() {
    const state = window.CarbonWiseState;
    if (!state) return;

    // 1. Compute reduction factor based on enabled toggles
    // EV: saves 75% of car footprint
    // Solar: saves 80% of energy footprint
    // Veg: saves 50% of food footprint
    // Flights: saves 50% of flight footprint
    // LED: saves 15% of electricity energy
    // Bike: saves 20% of car footprint
    let savedCO2 = 0;

    if (toggles.ev.checked) {
      savedCO2 += state.inputs.car * 52 * 0.18 * 0.75;
    }
    if (toggles.solar.checked) {
      const elecVal = state.inputs.electricity;
      savedCO2 += (elecVal * 12 * 0.45) * (1 - state.inputs.renewable / 100) * 0.8;
    }
    if (toggles.veg.checked) {
      // difference between meat/mixed and veg diet
      let currentDietCO2 = 1500;
      if (state.inputs.diet === 'mixed') currentDietCO2 = 2500;
      if (state.inputs.diet === 'meat') currentDietCO2 = 3300;
      savedCO2 += Math.max(currentDietCO2 - 1500, 0);
    }
    if (toggles.flights.checked) {
      savedCO2 += state.inputs.flights * 600 * 0.5;
    }
    if (toggles.led.checked) {
      savedCO2 += (state.inputs.electricity * 12 * 0.45) * 0.15;
    }
    if (toggles.bike.checked) {
      // saves car emissions by substituting car use
      savedCO2 += state.inputs.car * 52 * 0.18 * 0.2;
    }

    const currentFootprint = state.calculated.co2;
    const projectedFootprint = Math.max(currentFootprint - savedCO2, 0);
    const treesSaved = Math.round(savedCO2 / 21.8); // 1 tree offsets ~21.8 kg CO2 annually

    // Save toggles to state
    state.simulators = {
      ev: toggles.ev.checked,
      solar: toggles.solar.checked,
      veg: toggles.veg.checked,
      flights: toggles.flights.checked,
      led: toggles.led.checked,
      bike: toggles.bike.checked,
    };

    // Update stats displays
    if (displays.currVal) displays.currVal.textContent = (currentFootprint / 1000).toFixed(2) + ' T';
    if (displays.projVal) displays.projVal.textContent = (projectedFootprint / 1000).toFixed(2) + ' T';
    if (displays.savedVal) displays.savedVal.textContent = (savedCO2 / 1000).toFixed(2) + ' T';
    if (displays.treesVal) displays.treesVal.textContent = treesSaved.toLocaleString();

    // 2. Blend with 2050 Slider (acts as multiplier on greenness)
    // 0 = Business-as-usual, 100 = Target Net Zero
    const sliderVal = slider2050 ? parseInt(slider2050.value) : 0;
    
    // Compute total Greenness Ratio (0.0 to 1.0)
    // Based on toggles checked + slider position
    const toggleCheckedCount = Object.values(toggles).filter(t => t.checked).length;
    const toggleFactor = toggleCheckedCount / 6; // 0.0 to 1.0
    const sliderFactor = sliderVal / 100; // 0.0 to 1.0
    
    // Average them out to determine overall planet health
    const greenness = (toggleFactor * 0.4) + (sliderFactor * 0.6);

    // 3. MORPH THE 3D EARTH HOLOGRAM
    // Interpolate colors based on greenness
    // Dead Earth: Core=brown (0x4a3b32), Grid=red (0xef4444), Orbit=red (0xef4444)
    // Healthy Earth: Core=vibrant blue (0x075985), Grid=emerald (0x10b981), Orbit=emerald (0x10b981)
    
    const deadCore = new THREE.Color(0x372d24);
    const aliveCore = new THREE.Color(0x042f4c);
    const deadGrid = new THREE.Color(0xef4444);
    const aliveGrid = new THREE.Color(0x10b981);

    coreMat.color.copy(deadCore).lerp(aliveCore, greenness);
    gridMat.color.copy(deadGrid).lerp(aliveGrid, greenness);
    orbitMat.color.copy(deadGrid).lerp(aliveGrid, greenness);

    // 4. Update HUD visual effects
    if (smogOverlay) {
      // Smog opacity fades out as greenness rises
      smogOverlay.style.opacity = Math.max((1 - greenness) * 0.65, 0);
    }

    // Update 2050 narrative based on slider position
    if (desc2050) {
      const sliderStory = sliderVal <= 20
        ? '2050: A world gasping for air. Rising seas swallow coastlines.'
        : sliderVal <= 50
          ? '2050: The tipping point. Some nations act, others delay.'
          : sliderVal <= 80
            ? '2050: Momentum builds. Forests return. Hope emerges.'
            : '2050: A world reborn. Clean skies. Thriving ecosystems. Your choices made this possible.';
      desc2050.textContent = sliderStory;
    }

    // Update state text indicators
    if (greenness < 0.25) {
      earthStateLabel.textContent = 'Eco Crisis';
      earthStateLabel.className = 'text-red';
      displays.atmosphere.textContent = 'Carbon Saturated';
      displays.atmosphere.className = 'val text-red';
      displays.forests.textContent = 'Decline';
      displays.forests.className = 'val text-red';
      displays.ocean.textContent = 'Elevated (+2.1°C)';
      displays.ocean.className = 'val text-red';
    } else if (greenness < 0.65) {
      earthStateLabel.textContent = 'Stabilizing';
      earthStateLabel.className = 'text-cyan';
      displays.atmosphere.textContent = 'Moderate Emissions';
      displays.atmosphere.className = 'val text-cyan';
      displays.forests.textContent = 'Partial Recovery';
      displays.forests.className = 'val text-cyan';
      displays.ocean.textContent = 'Stabilized (+1.2°C)';
      displays.ocean.className = 'val text-cyan';
    } else {
      earthStateLabel.textContent = 'Eco Oasis';
      earthStateLabel.className = 'text-emerald';
      displays.atmosphere.textContent = 'Balanced Oxygen';
      displays.atmosphere.className = 'val text-emerald';
      displays.forests.textContent = 'Reforestation Active';
      displays.forests.className = 'val text-emerald';
      displays.ocean.textContent = 'Stable temperature';
      displays.ocean.className = 'val text-emerald';
    }
  }

  // Resize handler
  window.addEventListener('resize', () => {
    if (!simEarthContainer) return;
    const w = simEarthContainer.clientWidth;
    const h = simEarthContainer.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Initial trigger
  animate();
  updateSimulatorMath();
}
