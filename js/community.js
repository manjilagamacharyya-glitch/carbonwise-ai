/* ==========================================================================
   CARBONWISE AI - COMMUNITY MAP & MY EARTH 3D ECOSYSTEM
   Replaces fake leaderboard with live 3D Earth that reacts to emissions
   ========================================================================== */

export function initCommunityFeatures() {
  const mapSvg = document.getElementById('world-map-svg');
  const myEarthContainer = document.getElementById('my-earth-3d-container');
  
  // Real-time ticking counters
  const co2TotalDisplay = document.getElementById('comm-co2-total');
  const treesTotalDisplay = document.getElementById('comm-trees-total');

  // My Earth status displays
  const earthHealthLabel = document.getElementById('my-earth-health-label');
  const earthHealthDesc = document.getElementById('my-earth-health-desc');

  // Coordinates mapping on 1000x500 map grid
  const cities = [
    { name: 'San Francisco', x: 130, y: 190, color: 'cyan', saved: '124,500 kg' },
    { name: 'New York', x: 250, y: 180, color: 'cyan', saved: '321,200 kg' },
    { name: 'Reykjavik', x: 420, y: 110, color: 'green', saved: '98,000 kg' },
    { name: 'London', x: 470, y: 150, color: 'green', saved: '412,500 kg' },
    { name: 'Copenhagen', x: 505, y: 135, color: 'green', saved: '242,100 kg' },
    { name: 'Tokyo', x: 840, y: 190, color: 'cyan', saved: '512,900 kg' },
    { name: 'Sydney', x: 880, y: 410, color: 'cyan', saved: '190,400 kg' },
    { name: 'Berlin', x: 520, y: 155, color: 'green', saved: '310,000 kg' }
  ];

  // =========================================================
  // 1. World Map (KEPT — identical to original)
  // =========================================================
  function drawMap() {
    if (!mapSvg) return;
    mapSvg.innerHTML = '';

    const gridLinesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridLinesGroup.setAttribute('stroke', 'rgba(255, 255, 255, 0.02)');
    gridLinesGroup.setAttribute('stroke-width', '0.5');

    for (let y = 50; y < 500; y += 50) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0'); line.setAttribute('y1', y);
      line.setAttribute('x2', '1000'); line.setAttribute('y2', y);
      gridLinesGroup.appendChild(line);
    }
    for (let x = 50; x < 1000; x += 50) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x); line.setAttribute('y1', '0');
      line.setAttribute('x2', x); line.setAttribute('y2', '500');
      gridLinesGroup.appendChild(line);
    }
    mapSvg.appendChild(gridLinesGroup);

    const continentDots = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    continentDots.setAttribute('fill', 'rgba(255, 255, 255, 0.045)');
    const dotSpacing = 16;
    for (let x = 30; x < 970; x += dotSpacing) {
      for (let y = 30; y < 470; y += dotSpacing) {
        if (isInsideContinent(x, y)) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', '2.5');
          continentDots.appendChild(circle);
        }
      }
    }
    mapSvg.appendChild(continentDots);

    cities.forEach((c) => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseRing.setAttribute('cx', c.x); pulseRing.setAttribute('cy', c.y); pulseRing.setAttribute('r', '8');
      pulseRing.setAttribute('class', `pulse-node ${c.color === 'green' ? 'green-node' : ''}`);
      nodeGroup.appendChild(pulseRing);
      const coreNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      coreNode.setAttribute('cx', c.x); coreNode.setAttribute('cy', c.y); coreNode.setAttribute('r', '3.5');
      coreNode.setAttribute('fill', c.color === 'green' ? 'var(--emerald-glow)' : 'var(--cyan-glow)');
      nodeGroup.appendChild(coreNode);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', c.x + 8); label.setAttribute('y', c.y + 3);
      label.setAttribute('fill', '#94a3b8'); label.setAttribute('font-size', '8');
      label.setAttribute('font-family', 'Space Grotesk'); label.setAttribute('font-weight', '500');
      label.textContent = c.name;
      nodeGroup.appendChild(label);
      mapSvg.appendChild(nodeGroup);
    });
  }

  function isInsideContinent(x, y) {
    if (x > 80 && x < 280 && y > 80 && y < 270) return true;
    if (x > 200 && x < 320 && y >= 270 && y < 450 && (x - 200) < (450 - y) * 0.8) return true;
    if (x > 400 && x < 900 && y > 80 && y < 350) {
      if (x > 620 && x < 700 && y > 280) return false;
      return true;
    }
    if (x > 480 && x < 600 && y >= 250 && y < 450) return true;
    if (x > 780 && x < 920 && y > 330 && y < 450) return true;
    if (x > 330 && x < 430 && y > 40 && y < 100) return true;
    return false;
  }

  // =========================================================
  // 2. MY EARTH — 3D Three.js Reactive Ecosystem
  // =========================================================
  function initMyEarth3D() {
    if (!myEarthContainer) return;

    const w = myEarthContainer.clientWidth;
    const h = myEarthContainer.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 500);
    camera.position.z = 160;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    myEarthContainer.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Earth core with procedural texture
    const earthTex = createMyEarthTexture(0.5);
    const earthGeom = new THREE.SphereGeometry(40, 48, 48);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTex,
      transparent: true,
      opacity: 0.95,
      shininess: 20,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    earthGroup.add(earthMesh);

    // Atmosphere shell
    const atmosGeom = new THREE.SphereGeometry(45, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    earthGroup.add(atmosMesh);

    // Cloud layer
    const cloudTex = createMyEarthCloudTexture();
    const cloudGeom = new THREE.SphereGeometry(42, 36, 36);
    const cloudMat = new THREE.MeshBasicMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    earthGroup.add(cloudMesh);

    // Pollution/carbon particles
    const pCount = 120;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    
    for (let i = 0; i < pCount; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 43 + Math.random() * 10;
      pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i*3+2] = r * Math.cos(phi);
      pCol[i*3] = 0.06; pCol[i*3+1] = 0.73; pCol[i*3+2] = 0.83;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeom.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pTexture = createParticleTex();
    const pMat = new THREE.PointsMaterial({
      size: 1.8, vertexColors: true, map: pTexture,
      transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const particles = new THREE.Points(pGeom, pMat);
    earthGroup.add(particles);

    // Orbiting bird-like particles (visible at low emissions)
    const birdCount = 8;
    const birdGeom = new THREE.BufferGeometry();
    const birdPos = new Float32Array(birdCount * 3);
    const birdAngles = new Float32Array(birdCount);
    const birdRadii = new Float32Array(birdCount);
    const birdHeights = new Float32Array(birdCount);
    
    for (let i = 0; i < birdCount; i++) {
      birdAngles[i] = Math.random() * Math.PI * 2;
      birdRadii[i] = 50 + Math.random() * 10;
      birdHeights[i] = (Math.random() - 0.5) * 30;
      birdPos[i*3] = birdRadii[i] * Math.cos(birdAngles[i]);
      birdPos[i*3+1] = birdHeights[i];
      birdPos[i*3+2] = birdRadii[i] * Math.sin(birdAngles[i]);
    }
    birdGeom.setAttribute('position', new THREE.BufferAttribute(birdPos, 3));
    const birdMat = new THREE.PointsMaterial({
      size: 3, color: 0xffffff,
      transparent: true, opacity: 0,
      map: pTexture, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const birds = new THREE.Points(birdGeom, birdMat);
    earthGroup.add(birds);

    // Aurora ring (visible at low emissions)
    const auroraGeom = new THREE.TorusGeometry(44, 1.5, 8, 64);
    const auroraMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const aurora = new THREE.Mesh(auroraGeom, auroraMat);
    aurora.rotation.x = Math.PI / 2.3;
    earthGroup.add(aurora);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(60, 30, 60);
    scene.add(dirLight);
    const pLight = new THREE.PointLight(0x06b6d4, 0.3, 300);
    pLight.position.set(-60, 30, 60);
    scene.add(pLight);

    // Drag interaction
    let isDragging = false, prevMouse = { x: 0, y: 0 };
    myEarthContainer.addEventListener('mousedown', (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
    myEarthContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      earthGroup.rotation.y += (e.clientX - prevMouse.x) * 0.005;
      earthGroup.rotation.x += (e.clientY - prevMouse.y) * 0.005;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // State tracking
    let currentGreenness = 0.5;
    let targetGreenness = 0.5;

    window.addEventListener('carbonStateUpdated', (e) => {
      const co2 = e.detail.calculated.co2;
      targetGreenness = Math.max(0, Math.min(1, 1 - (co2 - 2000) / 8000));
      
      // Regenerate earth texture for new state
      const newTex = createMyEarthTexture(targetGreenness);
      earthMat.map = newTex;
      earthMat.needsUpdate = true;

      // Update health labels
      updateHealthLabels(targetGreenness);
    });

    function updateHealthLabels(g) {
      if (!earthHealthLabel || !earthHealthDesc) return;

      const atmoText = document.getElementById('my-earth-atmo-text');
      const forestText = document.getElementById('my-earth-forest-text');
      const oceanText = document.getElementById('my-earth-ocean-text');

      if (g < 0.25) {
        earthHealthLabel.textContent = '🔴 Critical';
        earthHealthLabel.className = 'earth-health-status text-red';
        earthHealthDesc.textContent = 'Your Earth is suffering. Smoke fills the atmosphere, forests burn, and oceans darken. Take action now.';
        if (atmoText) atmoText.textContent = 'Carbon Saturated';
        if (forestText) forestText.textContent = 'Burning';
        if (oceanText) oceanText.textContent = 'Dark & Warm';
      } else if (g < 0.5) {
        earthHealthLabel.textContent = '🟠 Stressed';
        earthHealthLabel.className = 'earth-health-status text-amber';
        earthHealthDesc.textContent = 'Partial recovery visible. Some greenery returns, but pollution clouds persist. Keep improving.';
        if (atmoText) atmoText.textContent = 'Hazy';
        if (forestText) forestText.textContent = 'Thin';
        if (oceanText) oceanText.textContent = 'Cloudy';
      } else if (g < 0.75) {
        earthHealthLabel.textContent = '🟢 Healing';
        earthHealthLabel.className = 'earth-health-status text-cyan';
        earthHealthDesc.textContent = 'Beautiful recovery! Blue skies return, forests thrive, oceans clear. Your choices matter.';
        if (atmoText) atmoText.textContent = 'Clearing';
        if (forestText) forestText.textContent = 'Growing';
        if (oceanText) oceanText.textContent = 'Stabilizing';
      } else {
        earthHealthLabel.textContent = '🌍 Thriving';
        earthHealthLabel.className = 'earth-health-status text-emerald';
        earthHealthDesc.textContent = 'A paradise Earth! Crystal oceans, lush forests, clean air, aurora lights dance. This is the future you\'re building.';
        if (atmoText) atmoText.textContent = 'Balanced';
        if (forestText) forestText.textContent = 'Lush';
        if (oceanText) oceanText.textContent = 'Sparkling';
      }
    }

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      if (!isDragging) {
        earthGroup.rotation.y += 0.002;
      }
      cloudMesh.rotation.y += 0.0008;

      // Smooth transition
      currentGreenness += (targetGreenness - currentGreenness) * 0.015;

      // Update atmosphere based on greenness
      const hue = currentGreenness * 0.5; // 0=red, 0.5=cyan
      atmosMat.color.setHSL(hue, 0.7, 0.5);
      atmosMat.opacity = 0.04 + currentGreenness * 0.08;

      // Particle colors: red (polluted) → cyan/green (clean)
      const colArr = pGeom.attributes.color.array;
      for (let i = 0; i < pCount; i++) {
        if (currentGreenness < 0.3) {
          // Red/orange smoke particles
          colArr[i*3] = 0.9 + Math.random() * 0.1;
          colArr[i*3+1] = 0.2 + Math.random() * 0.15;
          colArr[i*3+2] = 0.1;
        } else if (currentGreenness < 0.6) {
          // Amber/yellow
          colArr[i*3] = 0.6 + Math.random() * 0.3;
          colArr[i*3+1] = 0.5 + Math.random() * 0.2;
          colArr[i*3+2] = 0.1 + Math.random() * 0.2;
        } else {
          // Cyan/green clean particles
          colArr[i*3] = 0.06 + Math.random() * 0.1;
          colArr[i*3+1] = 0.6 + Math.random() * 0.2;
          colArr[i*3+2] = 0.7 + Math.random() * 0.2;
        }
      }
      pGeom.attributes.color.needsUpdate = true;
      pMat.opacity = 0.3 + (1 - currentGreenness) * 0.5; // More visible when polluted

      // Particle movement: float upward when polluted (smoke), orbit when clean
      const posArr = pGeom.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        if (currentGreenness < 0.4) {
          // Smoke rising effect
          posArr[i*3+1] += 0.03;
          if (posArr[i*3+1] > 60) posArr[i*3+1] = -10;
        } else {
          // Gentle orbital
          const x = posArr[i*3], z = posArr[i*3+2];
          const a = 0.002;
          posArr[i*3] = x * Math.cos(a) - z * Math.sin(a);
          posArr[i*3+2] = x * Math.sin(a) + z * Math.cos(a);
        }
      }
      pGeom.attributes.position.needsUpdate = true;

      // Birds visible only at low emissions
      birdMat.opacity = Math.max(0, (currentGreenness - 0.6) * 2.5);
      if (birdMat.opacity > 0) {
        const bPos = birdGeom.attributes.position.array;
        for (let i = 0; i < birdCount; i++) {
          birdAngles[i] += 0.008 + i * 0.001;
          bPos[i*3] = birdRadii[i] * Math.cos(birdAngles[i]);
          bPos[i*3+1] = birdHeights[i] + Math.sin(t * 2 + i) * 3;
          bPos[i*3+2] = birdRadii[i] * Math.sin(birdAngles[i]);
        }
        birdGeom.attributes.position.needsUpdate = true;
      }

      // Aurora visible at very low emissions
      auroraMat.opacity = Math.max(0, (currentGreenness - 0.7) * 0.5);
      aurora.rotation.z = t * 0.1;
      
      pLight.color.setHSL(hue, 0.8, 0.5);

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      if (!myEarthContainer) return;
      const nw = myEarthContainer.clientWidth;
      const nh = myEarthContainer.clientHeight || 300;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

    animate();
    updateHealthLabels(0.5);
  }

  function createMyEarthTexture(greenness) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Ocean color based on greenness
    const oceanR = Math.round(10 + (1 - greenness) * 40);
    const oceanG = Math.round(37 + greenness * 30);
    const oceanB = Math.round(64 + greenness * 50);
    ctx.fillStyle = `rgb(${oceanR}, ${oceanG}, ${oceanB})`;
    ctx.fillRect(0, 0, 512, 256);

    // Continent color based on greenness
    const landR = Math.round(80 * (1 - greenness) + 20 * greenness);
    const landG = Math.round(50 * (1 - greenness) + 120 * greenness);
    const landB = Math.round(30 * (1 - greenness) + 50 * greenness);
    ctx.fillStyle = `rgb(${landR}, ${landG}, ${landB})`;

    // Simplified continents
    const continents = [
      [[60,60],[140,60],[140,140],[100,140],[60,120]],
      [[90,140],[110,140],[120,200],[100,220],[80,200]],
      [[200,60],[340,60],[360,100],[340,150],[300,200],[260,180],[220,120],[200,80]],
      [[230,140],[290,140],[300,200],[270,220],[240,200]],
      [[350,70],[450,50],[480,80],[470,120],[420,140],[380,120],[350,90]],
      [[380,150],[430,140],[450,180],[430,210],[390,190]],
    ];

    continents.forEach(pts => {
      ctx.beginPath();
      pts.forEach(([x,y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();
    });

    // Noise
    const imgData = ctx.getImageData(0, 0, 512, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 8;
      imgData.data[i] += n; imgData.data[i+1] += n; imgData.data[i+2] += n;
    }
    ctx.putImageData(imgData, 0, 0);

    // Fire spots when polluted
    if (greenness < 0.3) {
      ctx.fillStyle = 'rgba(255, 100, 30, 0.6)';
      for (let i = 0; i < 8; i++) {
        const x = 100 + Math.random() * 350;
        const y = 60 + Math.random() * 150;
        ctx.beginPath();
        ctx.arc(x, y, 4 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createMyEarthCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 256, y = Math.random() * 128;
      const r = 10 + Math.random() * 25;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255,255,255,${0.05 + Math.random() * 0.1})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createParticleTex() {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(8,8,0,8,8,8);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,16,16);
    return new THREE.CanvasTexture(c);
  }

  // =========================================================
  // 3. Real-time Ticking Tickers (KEPT)
  // =========================================================
  let co2Sum = 14242501.2;
  let treesSum = 582304;

  setInterval(() => {
    const co2Offset = Math.random() * 2.5;
    co2Sum += co2Offset;
    if (co2TotalDisplay) co2TotalDisplay.textContent = Math.round(co2Sum).toLocaleString() + ' kg';
    if (Math.random() > 0.85) {
      treesSum += 1;
      if (treesTotalDisplay) treesTotalDisplay.textContent = treesSum.toLocaleString();
    }
  }, 2200);

  // Initialize
  drawMap();
  initMyEarth3D();
}
