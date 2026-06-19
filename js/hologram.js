/* ==========================================================================
   CARBONWISE AI - PREMIUM THREE.JS 3D EARTH HOLOGRAM ENGINE
   Layers: Textured Earth + Atmosphere Glow + Country Outlines + Carbon 
   Particles + Clouds + Dynamic Color Transitions
   ========================================================================== */

export function initEarthHologram() {
  const container = document.getElementById('hologram-canvas-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x09090b, 0.001);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 240;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group to contain everything for rotation
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // =========== LAYER 1: Stylized Earth Texture (Canvas Generated) ===========
  const earthTexture = createEarthTexture();
  const coreGeometry = new THREE.SphereGeometry(65, 64, 64);
  const coreMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    transparent: true,
    opacity: 0.92,
    shininess: 25,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  globeGroup.add(coreMesh);

  // Wireframe overlay for HUD feel
  const wireGeometry = new THREE.SphereGeometry(65.3, 24, 24);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.08,
    wireframe: true,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  globeGroup.add(wireMesh);

  // =========== LAYER 2: Atmosphere Glow (Fresnel Rim) ===========
  const atmosGeometry = new THREE.SphereGeometry(72, 64, 64);
  const atmosMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  });
  const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
  globeGroup.add(atmosMesh);

  // Inner glow shell
  const innerGlowGeom = new THREE.SphereGeometry(67, 64, 64);
  const innerGlowMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.04,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
  });
  const innerGlowMesh = new THREE.Mesh(innerGlowGeom, innerGlowMat);
  globeGroup.add(innerGlowMesh);

  // =========== LAYER 3: Country Outlines ===========
  const outlinePoints = generateContinentOutlines();
  outlinePoints.forEach(points => {
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
    });
    const line = new THREE.Line(lineGeom, lineMat);
    globeGroup.add(line);
  });

  // =========== LAYER 4: Carbon Particles (Reactive) ===========
  const particleCount = 350;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const particleSpeeds = new Float32Array(particleCount);

  const colorCyan = new THREE.Color(0x06b6d4);
  const colorEmerald = new THREE.Color(0x10b981);

  for (let i = 0; i < particleCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 68 + Math.random() * 12;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const chosenColor = Math.random() > 0.4 ? colorCyan : colorEmerald;
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
    
    particleSpeeds[i] = 0.5 + Math.random() * 1.5;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleTexture = createRoundParticleTexture();
  const particleMaterial = new THREE.PointsMaterial({
    size: 2.0,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
  globeGroup.add(particlePoints);

  // =========== LAYER 5: Procedural Clouds ===========
  const cloudTexture = createCloudTexture();
  const cloudGeometry = new THREE.SphereGeometry(67.5, 48, 48);
  const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  globeGroup.add(cloudMesh);

  // =========== LAYER 6: Orbital Data Rings ===========
  const ring1Geom = new THREE.RingGeometry(85, 85.5, 128);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.12,
  });
  const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
  ring1.rotation.x = Math.PI / 2;
  scene.add(ring1);

  const ring2Geom = new THREE.RingGeometry(92, 92.3, 128);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.08,
  });
  const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
  ring2.rotation.x = Math.PI / 3.5;
  ring2.rotation.y = Math.PI / 5;
  globeGroup.add(ring2);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(100, 50, 100);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x06b6d4, 0.3, 500);
  pointLight.position.set(-100, 50, 100);
  scene.add(pointLight);

  // =========== DYNAMIC COLOR TRANSITIONS ===========
  let currentGreenness = 0.5; // 0=polluted, 1=clean
  let targetGreenness = 0.5;

  window.addEventListener('carbonStateUpdated', (e) => {
    const co2 = e.detail.calculated.co2;
    // Map CO2 to greenness: <2500=very green, >8000=very polluted
    targetGreenness = Math.max(0, Math.min(1, 1 - (co2 - 2000) / 8000));
  });

  // =========== INTERACTION ===========
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y,
    };
    globeGroup.rotation.y += delta.x * 0.005;
    globeGroup.rotation.x += delta.y * 0.005;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const delta = {
      x: e.touches[0].clientX - previousMousePosition.x,
      y: e.touches[0].clientY - previousMousePosition.y,
    };
    globeGroup.rotation.y += delta.x * 0.005;
    globeGroup.rotation.x += delta.y * 0.005;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  container.addEventListener('touchend', () => { isDragging = false; }, { passive: true });

  // =========== TEXTURE GENERATORS ===========
  function createEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Ocean base gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#0a2540');
    oceanGrad.addColorStop(0.3, '#0d3157');
    oceanGrad.addColorStop(0.5, '#0f3d6e');
    oceanGrad.addColorStop(0.7, '#0d3157');
    oceanGrad.addColorStop(1, '#0a2540');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Continent shapes using simplified coordinate mapping
    const continents = getContinentPaths();
    ctx.fillStyle = '#145a32';
    ctx.strokeStyle = '#1a7a42';
    ctx.lineWidth = 1;

    continents.forEach(continent => {
      ctx.beginPath();
      continent.forEach((point, i) => {
        const x = ((point[0] + 180) / 360) * 1024;
        const y = ((90 - point[1]) / 180) * 512;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Add subtle noise texture
    const imageData = ctx.getImageData(0, 0, 1024, 512);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      imageData.data[i] += noise;
      imageData.data[i + 1] += noise;
      imageData.data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    // City lights (yellow dots in populated areas)
    const cityLights = [
      [77, 28.6], [-74, 40.7], [2.35, 48.9], [139.7, 35.7], [121.5, 31.2],
      [-46.6, -23.5], [28.9, 41], [37.6, 55.8], [-118.2, 34], [72.9, 19],
      [103.8, 1.35], [151.2, -33.9], [-3.7, 40.4], [13.4, 52.5]
    ];
    ctx.fillStyle = 'rgba(255, 220, 100, 0.6)';
    cityLights.forEach(([lon, lat]) => {
      const x = ((lon + 180) / 360) * 1024;
      const y = ((90 - lat) / 180) * 512;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function getContinentPaths() {
    // Simplified continent outlines as [lon, lat] arrays
    return [
      // North America
      [[-130,50],[-125,55],[-120,60],[-100,65],[-85,70],[-75,60],[-80,45],[-75,35],[-85,30],[-95,25],[-105,20],[-115,30],[-125,40],[-130,50]],
      // South America
      [[-80,10],[-75,5],[-60,5],[-50,0],[-35,-5],[-40,-15],[-45,-22],[-50,-30],[-55,-35],[-65,-40],[-70,-50],[-75,-45],[-70,-20],[-75,-5],[-80,10]],
      // Europe
      [[-10,36],[0,38],[5,43],[3,47],[-5,48],[5,50],[10,48],[15,50],[20,45],[25,42],[30,45],[25,55],[20,55],[15,55],[10,58],[5,62],[15,65],[25,70],[30,65],[25,55],[30,50],[15,45],[10,40],[5,36],[-10,36]],
      // Africa
      [[-17,15],[-15,10],[-10,5],[0,5],[10,5],[15,0],[20,-5],[30,-10],[35,-20],[35,-30],[25,-35],[20,-30],[15,-25],[10,-15],[5,-5],[0,5],[-5,10],[-15,15],[-17,15]],
      // Asia (simplified)
      [[30,35],[35,35],[40,40],[50,40],[55,45],[60,40],[70,35],[75,30],[80,25],[85,28],[90,25],[95,20],[100,15],[105,20],[110,25],[120,30],[125,35],[130,40],[135,45],[140,40],[130,35],[120,25],[110,20],[105,10],[100,5],[95,10],[85,20],[75,25],[70,30],[65,35],[60,45],[50,50],[40,45],[35,40],[30,35]],
      // Australia
      [[115,-30],[120,-20],[130,-15],[140,-15],[150,-20],[153,-25],[150,-35],[140,-38],[130,-35],[120,-35],[115,-30]],
    ];
  }

  function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 512, 256);

    // Generate procedural cloud patches
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = 15 + Math.random() * 40;
      const opacity = 0.05 + Math.random() * 0.15;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      grad.addColorStop(0.6, `rgba(255, 255, 255, ${opacity * 0.3})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function generateContinentOutlines() {
    const paths = getContinentPaths();
    const lineArrays = [];

    paths.forEach(path => {
      const points = [];
      path.forEach(([lon, lat]) => {
        // Convert lat/lon to 3D coordinates on sphere
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = 65.5;
        const x = -r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      });
      lineArrays.push(points);
    });

    return lineArrays;
  }

  function createRoundParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }

  // =========== ANIMATION LOOP ===========
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Slowly rotate when not dragging
    if (!isDragging) {
      globeGroup.rotation.y += 0.0012;
    }

    // Cloud rotation (slightly faster, different axis)
    cloudMesh.rotation.y += 0.0005;

    // Particle orbital animation
    const posArray = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const x = posArray[idx];
      const z = posArray[idx + 2];
      const angle = particleSpeeds[i] * 0.001;
      posArray[idx] = x * Math.cos(angle) - z * Math.sin(angle);
      posArray[idx + 2] = x * Math.sin(angle) + z * Math.cos(angle);
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Smooth greenness transition
    currentGreenness += (targetGreenness - currentGreenness) * 0.02;

    // Dynamic color updates based on greenness
    updateEarthColors(currentGreenness);

    // Atmosphere pulse
    atmosMesh.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.008);
    ring1.scale.setScalar(1 + Math.sin(elapsed * 0.5) * 0.015);

    renderer.render(scene, camera);
  }

  function updateEarthColors(g) {
    // Atmosphere glow shifts from red (polluted) to cyan (clean)
    const atmosColor = new THREE.Color().setHSL(
      0.5 * g + 0.0 * (1 - g), // hue: red=0, cyan=0.5
      0.7,
      0.5
    );
    atmosMaterial.color.copy(atmosColor);
    atmosMaterial.opacity = 0.06 + g * 0.06;

    // Inner glow
    innerGlowMat.color.setHSL(0.38 * g + 0.0 * (1 - g), 0.8, 0.4);
    innerGlowMat.opacity = 0.03 + g * 0.04;

    // Wireframe overlay
    wireMaterial.color.setHSL(0.5 * g, 0.6, 0.45);
    wireMaterial.opacity = 0.06 + (1 - g) * 0.04;

    // Point light color
    pointLight.color.setHSL(0.5 * g, 0.8, 0.5);

    // Particle colors shift
    const colorHigh = new THREE.Color(0xef4444); // Red for pollution
    const colorLow = new THREE.Color(0x10b981); // Green for clean
    const blendedColor = new THREE.Color().copy(colorHigh).lerp(colorLow, g);
    const colArray = particleGeometry.attributes.color.array;
    for (let i = 0; i < particleCount; i++) {
      const mix = Math.random() > 0.5 ? g : g * 0.7;
      const c = new THREE.Color().copy(colorHigh).lerp(colorLow, mix);
      colArray[i * 3] = c.r;
      colArray[i * 3 + 1] = c.g;
      colArray[i * 3 + 2] = c.b;
    }
    particleGeometry.attributes.color.needsUpdate = true;
  }

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Start
  animate();
}
