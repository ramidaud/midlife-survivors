// Multi-style 3D & Isometric renderer (`src/view3d.js`).
// Lets the player toggle live between 3 distinct visual experiences:
//   0: "2D 16-Bit"        - Classic top-down 16-bit SNES/Genesis pixel-art view
//   1: "Diablo 3/4"       - High-altitude 16-deg Telephoto Isometric Tactical Overview with obsidian dungeon slabs,
//                           flaming mezzanine braziers, warm flickering torchlight, and long shadows
//   2: "3D Third-Person"  - Low Over-the-Shoulder 68-deg Immersive 3D World with a 3D Skyscraper Horizon,
//                           Sunset Sky Dome, Floating 3D Clouds, Tall Arena Pillars, and animated 3D hero legs!

window.VIEW_MODES = ["2D 16-Bit", "Diablo 3/4", "3D Third-Person"];
window.viewModeIdx = 0;

let threeState = null;

function makeFloorTexture(style, stageObj) {
  const st = stageObj || (window.STAGES && window.STAGES[0]) || {
    id: "office", floorPrimary: "#242c4c", floorSecondary: "#1c223b", floorAccent: "#8a5a36", rugColor: "#1f5c6e"
  };
  const can = document.createElement("canvas");
  can.width = 512; can.height = 512;
  const ctx = can.getContext("2d");

  if (style === "diablo") {
    // Dark Sanctuary stone flagstones tinted by the active Life Stage, with warm ember mortar & arcane courtyard zones
    for (let y = 0; y < 512; y += 64) {
      for (let x = 0; x < 512; x += 64) {
        const alt = ((x + y) / 64) % 2 === 0;
        ctx.fillStyle = alt ? st.floorPrimary : st.floorSecondary;
        ctx.fillRect(x, y, 64, 64);
        ctx.fillStyle = "rgba(6, 5, 12, 0.58)";
        ctx.fillRect(x, y, 64, 64);
        ctx.strokeStyle = "#2b1d14"; ctx.lineWidth = 3;
        ctx.strokeRect(x + 1, y + 1, 62, 62);
        ctx.strokeStyle = "rgba(245, 185, 90, 0.12)"; ctx.lineWidth = 1;
        ctx.strokeRect(x + 6, y + 6, 52, 52);
      }
    }
    // Torchlit Stone Walkway Band (y = 196..292)
    ctx.fillStyle = "rgba(42, 28, 18, 0.75)";
    ctx.fillRect(0, 196, 512, 96);
    ctx.fillStyle = "#c99b49";
    ctx.fillRect(0, 196, 512, 4);
    ctx.fillRect(0, 288, 512, 4);
    // Sanctuary Rune Rug Zone
    ctx.fillStyle = st.rugColor;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(272, 28, 210, 142);
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "#c99b49"; ctx.lineWidth = 3;
    ctx.strokeRect(276, 32, 202, 134);
  } else {
    // Multi-Zone Architectural Floor for 3D Mode (tailored to Office, Hospital, Suburban Home, Social Courtyard, or Senior Resort!)
    for (let y = 0; y < 512; y += 64) {
      for (let x = 0; x < 512; x += 64) {
        const alt = ((x + y) / 64) % 2 === 0;
        ctx.fillStyle = alt ? st.floorPrimary : st.floorSecondary;
        ctx.fillRect(x, y, 64, 64);
        ctx.strokeStyle = "rgba(10, 14, 28, 0.65)"; ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 64, 64);
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(x + 6, y + 6, 52, 2);
      }
    }

    // Zone B: Architectural Corridor / Walkway Band (y = 196..292)
    ctx.fillStyle = st.floorAccent;
    ctx.fillRect(0, 196, 512, 96);
    for (let py = 200; py < 290; py += 18) {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, py, 512, 2);
    }
    ctx.fillStyle = "#f5c542";
    ctx.fillRect(0, 196, 512, 4);
    ctx.fillRect(0, 288, 512, 4);

    // Zone C: Stage Feature Zone (x = 272..484, y = 24..168)
    ctx.fillStyle = st.rugColor;
    ctx.fillRect(272, 24, 212, 144);
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = 4;
    ctx.strokeRect(276, 28, 204, 136);

    // Stage-Specific Environmental Details!
    if (st.id === "hospital") {
      // Red & Cyan Hospital Triage Line Stripes + Medical Cross Emblem
      ctx.fillStyle = "#ff3b4e"; ctx.fillRect(0, 234, 512, 6);
      ctx.fillStyle = "#00e5ff"; ctx.fillRect(0, 246, 512, 6);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(368, 72, 20, 48);
      ctx.fillRect(354, 86, 48, 20);
    } else if (st.id === "home") {
      // Scattered Colorful LEGO Bricks on the Living Room Rug & Toy Blocks!
      const legoCols = ["#ff2e44", "#ffe042", "#2bc4ff", "#52bf6a"];
      [[310, 62], [355, 118], [420, 78], [120, 95], [185, 380], [410, 395]].forEach(([lx, ly], i) => {
        ctx.fillStyle = legoCols[i % legoCols.length];
        ctx.fillRect(lx, ly, 16, 10);
        ctx.strokeStyle = "#12152a"; ctx.lineWidth = 1.5;
        ctx.strokeRect(lx, ly, 16, 10);
      });
    } else if (st.id === "social") {
      // Warm Golden String-Light Glow Pools on the Patio
      [[110, 110], [378, 96], [240, 390]].forEach(([gx, gy]) => {
        const g = ctx.createRadialGradient(gx, gy, 4, gx, gy, 54);
        g.addColorStop(0, "rgba(255, 215, 110, 0.35)");
        g.addColorStop(1, "rgba(255, 215, 110, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(gx, gy, 54, 0, Math.PI * 2); ctx.fill();
      });
    } else if (st.id === "senior") {
      // Pickleball Court Kitchen Lines & Center Net Line!
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3;
      ctx.strokeRect(284, 34, 188, 124);
      ctx.beginPath();
      ctx.moveTo(378, 34); ctx.lineTo(378, 158);
      ctx.moveTo(344, 34); ctx.lineTo(344, 158);
      ctx.moveTo(412, 34); ctx.lineTo(412, 158);
      ctx.stroke();
    } else {
      // Office Sticky Notes & Coffee Ring
      ctx.fillStyle = "#ffe066";
      ctx.fillRect(118, 92, 14, 14);
      ctx.fillRect(412, 360, 14, 14);
    }
  }

  const tex = new THREE.CanvasTexture(can);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(30, 30);
  return tex;
}

// Build the Immersive 3D Horizon Environment for Mode 2 (3D Skyscraper Skyline, Glowing Sun, Clouds & Arena Pillars)
function build3DHorizonEnvironment() {
  const env = new THREE.Group();

  // 1. Glowing Synthwave / Golden-Hour Sun Disk on the far horizon (z = -1800)
  const sunGeo = new THREE.CircleGeometry(240, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffb84d, fog: false });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(0, 340, -1750);
  env.add(sun);

  const sunHaloGeo = new THREE.CircleGeometry(330, 32);
  const sunHaloMat = new THREE.MeshBasicMaterial({ color: 0xff5e7e, transparent: true, opacity: 0.35, fog: false });
  const sunHalo = new THREE.Mesh(sunHaloGeo, sunHaloMat);
  sunHalo.position.set(0, 340, -1760);
  env.add(sunHalo);

  // 2. 360-Degree Ring of Distant 3D Corporate Skyscrapers with Lit Windows!
  const bldgCount = 32;
  const ringR = 1450;
  for (let i = 0; i < bldgCount; i++) {
    const ang = (i / bldgCount) * Math.PI * 2;
    const bw = 90 + (i % 3) * 35;
    const bh = 220 + ((i * 73) % 340);
    const bd = 90 + (i % 2) * 30;
    const bMat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x162244 : 0x1d2c54,
      roughness: 0.7,
      metalness: 0.3,
      emissive: 0x081024
    });
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), bMat);
    bldg.position.set(Math.cos(ang) * ringR, bh / 2 - 10, Math.sin(ang) * ringR);
    bldg.lookAt(0, bh / 2, 0);
    env.add(bldg);

    // Glowing rooftop neon trim & window bands
    const roofTrim = new THREE.Mesh(
      new THREE.BoxGeometry(bw + 4, 6, bd + 4),
      new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x00e5ff : 0xffb84d })
    );
    roofTrim.position.set(bldg.position.x, bh - 8, bldg.position.z);
    roofTrim.rotation.copy(bldg.rotation);
    env.add(roofTrim);
  }

  // 3. Low-Poly Floating 3D Clouds Drifting Overhead
  const cloudMat = new THREE.MeshBasicMaterial({ color: 0xdce8ff, transparent: true, opacity: 0.42, fog: false });
  for (let i = 0; i < 14; i++) {
    const cg = new THREE.Group();
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(110, 22, 55), cloudMat);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(70, 28, 45), cloudMat);
    p2.position.set(25, 10, 8);
    cg.add(p1, p2);
    const ang = (i / 14) * Math.PI * 2;
    const r = 650 + (i % 3) * 260;
    cg.position.set(Math.cos(ang) * r, 260 + (i % 4) * 35, Math.sin(ang) * r);
    env.add(cg);
  }

  return env;
}

function initThreeOverlay() {
  if (threeState || typeof THREE === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.id = "three-overlay";
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "0", display: "none"
  });
  const gameDiv = document.getElementById("game");
  gameDiv.insertBefore(canvas, gameDiv.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene3d = new THREE.Scene();
  const camera3d = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 10, 3500);

  // Lighting: hemisphere sky/ground + dramatic shadow-casting directional light + warm player torchlight
  const hemi = new THREE.HemisphereLight(0x9bb8ff, 0x1e2238, 0.65);
  scene3d.add(hemi);

  const dirLight = new THREE.DirectionalLight(0xfff0d8, 0.9);
  dirLight.position.set(180, 340, 220);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  const d = 720;
  dirLight.shadow.camera.left = -d; dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.near = 50; dirLight.shadow.camera.far = 1600;
  scene3d.add(dirLight);
  scene3d.add(dirLight.target);

  // Diablo-style warm torchlight following the player
  const torchLight = new THREE.PointLight(0xff9d3b, 1.4, 520, 1.5);
  torchLight.position.set(0, 65, 0);
  scene3d.add(torchLight);

  const st0 = (window.STAGES && window.STAGES[0]) || null;
  const floorTexCache = {
    "1_office": makeFloorTexture("diablo", st0),
    "2_office": makeFloorTexture("3d", st0)
  };

  const floorMat = new THREE.MeshStandardMaterial({ map: floorTexCache["2_office"], roughness: 0.8, metalness: 0.12 });
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(15360, 15360), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene3d.add(floorMesh);

  // Build 3D Horizon Skyline & Sky Dome for Mode 2 (Immersive 3D)
  const skyEnvGroup = build3DHorizonEnvironment();
  scene3d.add(skyEnvGroup);

  // Build stylized 3D Player mesh group (with articulated legs!)
  const playerGroup = build3DPlayer();
  scene3d.add(playerGroup);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera3d.aspect = window.innerWidth / window.innerHeight;
    camera3d.updateProjectionMatrix();
  });

  threeState = {
    canvas, renderer, scene3d, camera3d, hemi, dirLight, torchLight,
    floorMesh, floorMat, floorTexCache, activeTex: floorTexCache["2_office"], skyEnvGroup, playerGroup,
    lastFloorKey: "",
    enemyMeshes: new Map(),
    splashMeshes: new Map(),
    gemMeshes: new Map(),
    coinMeshes: new Map(),
    pizzaMeshes: new Map(),
    chestMeshes: new Map(),
    propMeshes: [],
    platformMeshes: [],
    rings: [],
    projVec: new THREE.Vector3()
  };
}

// Build a 3D Mezzanine Platform + 6-Step Staircase + Columns + Guardrails + Corner Braziers!
function build3DPlatformMesh() {
  const g = new THREE.Group();
  const matDeck = new THREE.MeshStandardMaterial({ color: 0x2f3c66, roughness: 0.65, metalness: 0.15 });
  const matStep = new THREE.MeshStandardMaterial({ color: 0x3d4c7a, roughness: 0.6 });
  const matGold = new THREE.MeshStandardMaterial({ color: 0xf5c542, roughness: 0.3, metalness: 0.7, emissive: 0x3b2800 });
  const matPillar = new THREE.MeshStandardMaterial({ color: 0x1e2540, roughness: 0.7 });
  const matFlame = new THREE.MeshBasicMaterial({ color: 0xff7722 });

  // Raised Mezzanine Deck
  const deck = new THREE.Mesh(new THREE.BoxGeometry(150, 10, 132), matDeck);
  deck.position.set(29, 37, 0);
  deck.castShadow = true; deck.receiveShadow = true;
  g.add(deck);

  // 4 Support Columns + Corner Torch Braziers on top of the deck corners!
  [[-38, -56], [96, -56], [-38, 56], [96, 56]].forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(12, 36, 12), matPillar);
    col.position.set(cx, 18, cz);
    col.castShadow = true; col.receiveShadow = true;
    g.add(col);

    // Corner Post + Glowing Torch Flame on top of the Mezzanine
    const post = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 16, 8), matPillar);
    post.position.set(cx, 50, cz);
    const flame = new THREE.Mesh(new THREE.OctahedronGeometry(5.5, 0), matFlame);
    flame.position.set(cx, 61, cz);
    g.add(post, flame);
  });

  // 6-Step Staircase on the Left (x = -108 .. -46, z = -42 .. +42) climbing from y = 0 to y = 42!
  const stepCount = 6, stepW = 62 / stepCount;
  for (let i = 0; i < stepCount; i++) {
    const sh = ((i + 1) / stepCount) * 42;
    const sx = -108 + (i + 0.5) * stepW;
    const step = new THREE.Mesh(new THREE.BoxGeometry(stepW + 0.5, sh, 84), matStep);
    step.position.set(sx, sh / 2, 0);
    step.castShadow = true; step.receiveShadow = true;
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 82), matGold);
    strip.position.set(sx - stepW / 2 + 1, sh + 0.4, 0);
    g.add(step, strip);
  }

  // Brass Guardrails along Top, Bottom, and Right of the deck
  const railTop = new THREE.Mesh(new THREE.BoxGeometry(150, 14, 4), matGold);
  railTop.position.set(29, 49, -64); railTop.castShadow = true;
  const railBot = new THREE.Mesh(new THREE.BoxGeometry(150, 14, 4), matGold);
  railBot.position.set(29, 49, 64); railBot.castShadow = true;
  const railRight = new THREE.Mesh(new THREE.BoxGeometry(4, 14, 132), matGold);
  railRight.position.set(102, 49, 0); railRight.castShadow = true;
  g.add(railTop, railBot, railRight);

  return g;
}

// Build a 3D Office Barrier Prop (Cubicle Desk with tall Partition, Potted Fern, or Watercooler)
function build3DPropMesh(kind) {
  const g = new THREE.Group();
  g.propKind = kind;
  if (kind === "prop_plant") {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 8, 18, 12),
      new THREE.MeshStandardMaterial({ color: 0xc95f38, roughness: 0.7 })
    );
    pot.position.y = 9; pot.castShadow = true;
    const foliage = new THREE.Mesh(
      new THREE.DodecahedronGeometry(17, 1),
      new THREE.MeshStandardMaterial({ color: 0x42ad58, roughness: 0.55 })
    );
    foliage.position.y = 27; foliage.castShadow = true;
    g.add(pot, foliage);
  } else if (kind === "prop_cooler") {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(22, 30, 22),
      new THREE.MeshStandardMaterial({ color: 0xdce3f2, roughness: 0.4 })
    );
    base.position.y = 15; base.castShadow = true;
    const jug = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, 20, 14),
      new THREE.MeshStandardMaterial({ color: 0x4cb8f5, emissive: 0x104070, roughness: 0.15 })
    );
    jug.position.y = 40; jug.castShadow = true;
    g.add(base, jug);
  } else {
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(76, 24, 40),
      new THREE.MeshStandardMaterial({ color: 0x8c5e35, roughness: 0.6 })
    );
    desk.position.y = 12; desk.castShadow = true; desk.receiveShadow = true;
    // Tall 3D Cubicle Privacy Wall & Dual Glowing Monitors so 3D view has vertical architecture!
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(78, 42, 5),
      new THREE.MeshStandardMaterial({ color: 0x3b486b, roughness: 0.75 })
    );
    wall.position.set(0, 21, -18); wall.castShadow = true;
    const mon = new THREE.Mesh(
      new THREE.BoxGeometry(44, 18, 4),
      new THREE.MeshStandardMaterial({ color: 0x5ce0ff, emissive: 0x1b5c80 })
    );
    mon.position.set(0, 33, -11);
    g.add(desk, wall, mon);
  }
  return g;
}

// Convert a 3D world point (wx, wy, wz) into Phaser 2D world coordinates so 2D labels & damage numbers
// float right above their 3D models in Diablo 3/4 and 3D Third-Person views!
function project3DToPhaserWorld(scene, wx, wy, wz) {
  if (!threeState || window.viewModeIdx === 0) return { x: wx, y: wz, visible: true };
  const v = threeState.projVec.set(wx, wy, wz).project(threeState.camera3d);
  if (v.z > 1 || v.z < -1) return { x: -9999, y: -9999, visible: false };
  const sx = (v.x * 0.5 + 0.5) * scene.scale.width;
  const sy = (-v.y * 0.5 + 0.5) * scene.scale.height;
  return { x: scene.cameras.main.scrollX + sx, y: scene.cameras.main.scrollY + sy, visible: true };
}

// Spawn a 3D expanding shockwave ring on the floor or raised mezzanine (for Dad Joke and The Word "No.").
function spawn3DRing(wx, wz, maxRadius, colorHex) {
  if (!threeState) return;
  const geo = new THREE.RingGeometry(0.84, 1.0, 32);
  const mat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(wx, ((player && player.elev) || 0) + 2.5, wz);
  mesh.scale.set(12, 12, 1);
  threeState.scene3d.add(mesh);
  threeState.rings.push({ mesh, mat, geo, r: 12, maxR: maxRadius });
}

function build3DPlayer() {
  const g = new THREE.Group();
  const matSuit = new THREE.MeshStandardMaterial({ color: 0x3b4d7a, roughness: 0.5 });
  const matShirt = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const matTie = new THREE.MeshStandardMaterial({ color: 0xe83b4c, roughness: 0.4 });
  const matSkin = new THREE.MeshStandardMaterial({ color: 0xf2bc94, roughness: 0.6 });
  const matHair = new THREE.MeshStandardMaterial({ color: 0x422c1e, roughness: 0.7 });
  const matGray = new THREE.MeshStandardMaterial({ color: 0xdce5f5, roughness: 0.5 });
  const matMug = new THREE.MeshStandardMaterial({ color: 0xf08526, roughness: 0.3, emissive: 0x4d2000 });

  // Articulated Legs
  const legGeo = new THREE.BoxGeometry(6, 13, 6);
  const legL = new THREE.Mesh(legGeo, matSuit); legL.position.set(-4.5, 6.5, 0); legL.castShadow = true;
  const legR = new THREE.Mesh(legGeo, matSuit); legR.position.set(4.5, 6.5, 0);  legR.castShadow = true;
  g.add(legL, legR);
  g.legL = legL;
  g.legR = legR;

  // Torso (blazer + shirt front + red tie)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(19, 17, 11.5), matSuit);
  torso.position.set(0, 20, 0); torso.castShadow = true;
  const shirt = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 12), matShirt);
  shirt.position.set(0, 20, 0);
  const tie = new THREE.Mesh(new THREE.BoxGeometry(2.8, 12, 12.4), matTie);
  tie.position.set(0, 19.5, 0);
  g.add(torso, shirt, tie);

  // Head + Hair + Silver Temples + Glasses
  const head = new THREE.Mesh(new THREE.BoxGeometry(15, 14, 14), matSkin);
  head.position.set(0, 35, 0); head.castShadow = true;
  const hair = new THREE.Mesh(new THREE.BoxGeometry(16, 5.5, 15), matHair);
  hair.position.set(0, 41, -0.5);
  const templeL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5, 14.4), matGray);
  templeL.position.set(-7.6, 37, 0);
  const templeR = templeL.clone(); templeR.position.x = 7.6;
  const glasses = new THREE.Mesh(
    new THREE.BoxGeometry(14.5, 3.4, 14.8),
    new THREE.MeshStandardMaterial({ color: 0x7ce0ff, metalness: 0.6, roughness: 0.2, emissive: 0x103048 })
  );
  glasses.position.set(0, 36, 0.5);
  g.add(head, hair, templeL, templeR, glasses);

  // Right arm holding glowing orange Coffee Mug
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.8, 8.5, 12), matMug);
  mug.position.set(13.5, 22, 4); mug.castShadow = true;
  g.add(mug);

  return g;
}

// Build a stylized 3D mesh for each enemy & boss type!
function makeEnemy3DMesh(kind) {
  const g = new THREE.Group();
  if (kind === "bill") {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(24, 18, 5),
      new THREE.MeshStandardMaterial({ color: 0x5ec264, roughness: 0.4 })
    );
    m.position.y = 12; m.castShadow = true;
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 5.6),
      new THREE.MeshStandardMaterial({ color: 0xc8ffd0, emissive: 0x1b4d20 })
    );
    stripe.position.y = 12;
    g.add(m, stripe);
  } else if (kind === "lateFee") {
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(11, 22, 4),
      new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0x4d0804, roughness: 0.35 })
    );
    m.position.y = 11; m.castShadow = true;
    g.add(m);
  } else if (kind === "spamCall") {
    const phone = new THREE.Mesh(
      new THREE.BoxGeometry(16, 28, 4),
      new THREE.MeshStandardMaterial({ color: 0x9b52e0, metalness: 0.4, roughness: 0.3 })
    );
    phone.position.y = 15; phone.castShadow = true;
    const scr = new THREE.Mesh(
      new THREE.BoxGeometry(12, 20, 4.5),
      new THREE.MeshStandardMaterial({ color: 0xff384c, emissive: 0x801020 })
    );
    scr.position.y = 15;
    g.add(phone, scr);
  } else if (kind === "snackAttack") {
    const dough = new THREE.Mesh(
      new THREE.TorusGeometry(10, 5, 12, 20),
      new THREE.MeshStandardMaterial({ color: 0xd98f38, roughness: 0.5 })
    );
    dough.rotation.x = Math.PI / 2; dough.position.y = 8; dough.castShadow = true;
    const icing = new THREE.Mesh(
      new THREE.TorusGeometry(10, 4.2, 12, 20),
      new THREE.MeshStandardMaterial({ color: 0xf257a6, roughness: 0.25, emissive: 0x3b0822 })
    );
    icing.rotation.x = Math.PI / 2; icing.position.y = 10.5;
    g.add(dough, icing);
  } else if (kind === "backTwinge") {
    const bolt = new THREE.Mesh(
      new THREE.OctahedronGeometry(13, 0),
      new THREE.MeshStandardMaterial({ color: 0xffe042, emissive: 0xff5500, roughness: 0.2 })
    );
    bolt.position.y = 15; bolt.castShadow = true;
    g.add(bolt);
  } else if (kind === "officeGossip") {
    const stack = new THREE.Mesh(
      new THREE.BoxGeometry(30, 22, 20),
      new THREE.MeshStandardMaterial({ color: 0x7cb8ff, metalness: 0.3, roughness: 0.35 })
    );
    stack.position.y = 12; stack.castShadow = true;
    const badge = new THREE.Mesh(
      new THREE.SphereGeometry(7, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xff2e44, emissive: 0x660010 })
    );
    badge.position.set(12, 24, 8);
    g.add(stack, badge);
  } else if (kind === "performanceReview" || kind === "hoaPresident") {
    const col = kind === "hoaPresident" ? 0x4bbf73 : 0xc92c49;
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(44, 56, 10),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 })
    );
    board.position.y = 28; board.castShadow = true;
    const clip = new THREE.Mesh(
      new THREE.BoxGeometry(22, 8, 13),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.7, roughness: 0.2 })
    );
    clip.position.set(0, 56, 0);
    g.add(board, clip);
  } else if (kind === "mortgageRefinance" || kind === "retirementBoss") {
    const col = kind === "retirementBoss" ? 0xf5c542 : 0x7b5cc2;
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(52, 38, 42),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 })
    );
    base.position.y = 19; base.castShadow = true;
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(40, 24, 4),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.5, roughness: 0.3 })
    );
    roof.rotation.y = Math.PI / 4; roof.position.y = 50;
    g.add(base, roof);
  } else if (kind === "midlifeCrisis" || kind === "pickleballChamp") {
    const col = kind === "pickleballChamp" ? 0xc8f542 : 0xff1e38;
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(58, 14, 30),
      new THREE.MeshStandardMaterial({ color: col, metalness: 0.5, roughness: 0.2, emissive: 0x330006 })
    );
    chassis.position.y = 10; chassis.castShadow = true;
    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(14, 10, 26),
      new THREE.MeshStandardMaterial({ color: 0x8ce0ff, metalness: 0.8, roughness: 0.1 })
    );
    windshield.position.set(-6, 19, 0);
    g.add(chassis, windshield);
  } else {
    const robe = new THREE.Mesh(
      new THREE.ConeGeometry(24, 62, 12),
      new THREE.MeshStandardMaterial({ color: 0x221836, emissive: 0x120a24, roughness: 0.6 })
    );
    robe.position.y = 31; robe.castShadow = true;
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(18, 2, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, emissive: 0x996b00 })
    );
    halo.rotation.x = Math.PI / 2; halo.position.y = 64;
    g.add(robe, halo);
  }
  return g;
}

// Cycle between 0 (2D 16-Bit), 1 (Diablo 3/4), and 2 (3D Third-Person).
function cycleViewMode(scene) {
  if (!window.ENABLE_3D_VIEWS) { applyViewMode(scene); return window.VIEW_MODES[0]; }
  window.viewModeIdx = (window.viewModeIdx + 1) % window.VIEW_MODES.length;
  applyViewMode(scene);
  return window.VIEW_MODES[window.viewModeIdx];
}

window.ENABLE_3D_VIEWS = false; // Parked Oct 30: 2D only until the game is fun. Set true to bring 3D back.

function applyViewMode(scene) {
  if (!window.ENABLE_3D_VIEWS) window.viewModeIdx = 0;
  initThreeOverlay();
  const is3D = window.viewModeIdx > 0;
  if (threeState) {
    threeState.canvas.style.display = is3D ? "block" : "none";
  }
  scene.cameras.main.setBackgroundColor(is3D ? "rgba(0,0,0,0)" : "#1b1f38");
  if (floor) floor.setVisible(!is3D);
  if (stageProps) stageProps.forEach(p => p.setAlpha(is3D ? 0 : 1));
  if (window.stagePlatforms) window.stagePlatforms.forEach(pl => pl.setAlpha(is3D ? 0 : 1));
  if (player) player.setAlpha(is3D ? 0 : 1);
  if (window.syncUITheme) window.syncUITheme();
}

// Sync every Phaser entity into the Three.js 3D scene and render the active camera style!
function renderThreeView(scene) {
  if (window.viewModeIdx === 0) return;
  initThreeOverlay();
  if (!threeState || !player) return;

  const {
    renderer, scene3d, camera3d, hemi, dirLight, torchLight,
    floorMesh, floorMat, floorTexCache, skyEnvGroup, playerGroup
  } = threeState;
  const mode = window.viewModeIdx; // 1 = Diablo 3/4 Isometric Overview, 2 = 3D Immersive Third-Person
  const px = player.x, pz = player.y, pe = player.elev || 0;
  const st = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : (window.STAGES && window.STAGES[0]);
  const stId = (st && st.id) || "office";
  const floorKey = `${mode}_${stId}`;

  // Swap multi-zone floor material texture when switching mode OR unlocking a new Life Stage!
  if (threeState.lastFloorKey !== floorKey) {
    threeState.lastFloorKey = floorKey;
    if (!floorTexCache[floorKey]) {
      floorTexCache[floorKey] = makeFloorTexture(mode === 1 ? "diablo" : "3d", st);
    }
    threeState.activeTex = floorTexCache[floorKey];
    floorMat.map = threeState.activeTex;
    floorMat.needsUpdate = true;
  }

  // Keep infinite multi-zone floor & 3D skyline centered on player
  floorMesh.position.set(px, 0, pz);
  threeState.activeTex.offset.set(px / 512, -pz / 512);
  skyEnvGroup.position.set(px, 0, pz);

  // Sync Player 3D model position, leg stride animation, and scale
  const moving = player.body && player.body.velocity.length() > 5;
  const walkBounce = moving ? Math.abs(Math.sin(scene.time.now / 55)) * 3.5 : 0;
  const stride = moving ? Math.sin(scene.time.now / 55) * 0.65 : 0;
  if (playerGroup.legL) playerGroup.legL.rotation.x = stride;
  if (playerGroup.legR) playerGroup.legR.rotation.x = -stride;

  // In Mode 2 (3D Immersive), scale up the Hero slightly (1.22x) for strong over-the-shoulder presence
  const heroScale = mode === 2 ? 1.22 : 0.95;
  playerGroup.scale.set(heroScale, heroScale, heroScale);
  playerGroup.position.set(px, pe + walkBounce, pz);
  if (moving) {
    playerGroup.rotation.y = Math.atan2(player.body.velocity.x, player.body.velocity.y);
  }

  torchLight.position.set(px, pe + 68, pz);
  dirLight.position.set(px + 220, 420, pz + 260);
  dirLight.target.position.set(px, pe, pz);

  if (mode === 1) {
    // =========================================================================
    // MODE 1: DIABLO 3/4 ISOMETRIC TACTICAL OVERVIEW
    // True 16-deg Telephoto Isometric projection from high diagonal altitude!
    // =========================================================================
    skyEnvGroup.visible = false;
    const bgHex = (st && st.diabloBg) || 0x07060d;
    scene3d.background = new THREE.Color(bgHex);
    scene3d.fog = new THREE.FogExp2(bgHex, 0.00048);
    hemi.intensity = 0.22;
    dirLight.intensity = 0.48;
    const flicker = 1 + Math.sin(scene.time.now / 70) * 0.08 + Math.cos(scene.time.now / 43) * 0.05;
    torchLight.intensity = 2.8 * flicker;
    torchLight.distance = 620;
    camera3d.fov = 16; // Narrow telephoto lens = true parallel isometric lines!
    camera3d.updateProjectionMatrix();
    camera3d.position.set(px - 760, 1060 + pe * 0.5, pz + 760);
    camera3d.lookAt(px, 10 + pe * 0.5, pz);
  } else {
    // =========================================================================
    // MODE 2: 3D IMMERSIVE THIRD-PERSON WORLD ("Fortnite meets Vampire Survivors")
    // Low 68-deg wide-angle chase camera right behind the hero (y = 66, z = +142)
    // =========================================================================
    skyEnvGroup.visible = true;
    const skyHex = (st && st.sky3d) || 0x1e2f66;
    const fogHex = (st && st.fog3d) || 0x283c7a;
    scene3d.background = new THREE.Color(skyHex);
    scene3d.fog = new THREE.FogExp2(fogHex, 0.00075);
    hemi.intensity = 0.95;
    dirLight.intensity = 1.25;
    torchLight.intensity = 0.85;
    torchLight.distance = 340;
    camera3d.fov = 68; // Wide-angle action lens for deep 3D perspective!
    camera3d.updateProjectionMatrix();
    camera3d.position.set(px, 68 + pe * 0.92, pz + 142);
    camera3d.lookAt(px, 34 + pe * 0.92, pz - 280);
  }

  // Sync 3D Raised Mezzanine Platforms & Staircases
  const plats = window.stagePlatforms || [];
  while (threeState.platformMeshes.length < plats.length) {
    const pm = build3DPlatformMesh();
    scene3d.add(pm);
    threeState.platformMeshes.push(pm);
  }
  plats.forEach((pl, i) => {
    const pm = threeState.platformMeshes[i];
    if (!pm) return;
    pm.position.set(pl.worldX || pl.x, 0, pl.worldY || pl.y);
  });

  // Sync 3D Office Barrier Props (cubicle desks with walls, potted ferns, watercoolers)
  while (threeState.propMeshes.length < (stageProps ? stageProps.length : 0)) {
    const box = build3DPropMesh("prop_desk");
    scene3d.add(box);
    threeState.propMeshes.push(box);
  }
  if (stageProps) {
    stageProps.forEach((sp, i) => {
      let m = threeState.propMeshes[i];
      if (!m) return;
      const wantKind = sp.propKind || "prop_desk";
      if (m.propKind !== wantKind) {
        scene3d.remove(m);
        m = build3DPropMesh(wantKind);
        scene3d.add(m);
        threeState.propMeshes[i] = m;
      }
      m.visible = sp.visible;
      m.position.set(sp.x, 0, sp.y);
    });
  }

  // Sync Enemies & Bosses (including their elevation on stairs and mezzanine platforms!)
  const activeBills = new Set();
  if (bills) {
    bills.getChildren().forEach(b => {
      if (!b.active) return;
      activeBills.add(b);
      b.setAlpha(0);
      let m = threeState.enemyMeshes.get(b);
      if (!m) {
        m = makeEnemy3DMesh(b.kind || "bill");
        scene3d.add(m);
        threeState.enemyMeshes.set(b, m);
      }
      const be = b.elev || 0;
      const eScale = mode === 2 ? 1.15 : 0.95;
      m.scale.set(eScale, eScale, eScale);
      m.position.set(b.x, be, b.y);
      m.rotation.y = Math.atan2(px - b.x, pz - b.y);
      if (b.tag) {
        const pt = project3DToPhaserWorld(scene, b.x, be + (b.isBoss ? 68 : 30), b.y);
        b.tag.setPosition(pt.x, pt.y).setVisible(pt.visible);
      }
    });
  }
  threeState.enemyMeshes.forEach((m, b) => {
    if (!activeBills.has(b)) {
      scene3d.remove(m);
      threeState.enemyMeshes.delete(b);
    }
  });

  // Project Player label right above the 3D Hero's head
  if (label) {
    const pt = project3DToPhaserWorld(scene, px, pe + (mode === 2 ? 58 : 48), pz);
    label.setPosition(pt.x, pt.y).setVisible(pt.visible);
  }

  // Animate 3D expanding shockwave rings (Dad Joke / The Word "No.")
  for (let i = threeState.rings.length - 1; i >= 0; i--) {
    const rg = threeState.rings[i];
    rg.r += (rg.maxR - rg.r) * 0.22 + 2.5;
    rg.mesh.scale.set(rg.r, rg.r, 1);
    rg.mat.opacity = Math.max(0, 0.8 * (1 - rg.r / rg.maxR));
    if (rg.r >= rg.maxR * 0.98) {
      scene3d.remove(rg.mesh);
      rg.geo.dispose();
      rg.mat.dispose();
      threeState.rings.splice(i, 1);
    }
  }

  // Sync Coffee Splashes (3D glowing espresso spheres)
  syncSimplePool(splashes, threeState.splashMeshes, scene3d, () => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xf09c42, emissive: 0x7b4a2a, roughness: 0.2 })
    );
    m.position.y = 18;
    return m;
  }, 18);

  // Sync Wisdom Gems (spinning 3D blue crystals)
  syncSimplePool(gems, threeState.gemMeshes, scene3d, () => {
    return new THREE.Mesh(
      new THREE.OctahedronGeometry(7.5, 0),
      new THREE.MeshStandardMaterial({ color: 0x5fb3f0, emissive: 0x1b5699, metalness: 0.5, roughness: 0.1 })
    );
  }, 10, true, scene.time.now);

  // Sync 401(k) Coins (spinning gold cylinders)
  syncSimplePool(coins, threeState.coinMeshes, scene3d, () => {
    const c = new THREE.Mesh(
      new THREE.CylinderGeometry(7.5, 7.5, 3, 14),
      new THREE.MeshStandardMaterial({ color: 0xffe042, emissive: 0x805500, metalness: 0.8, roughness: 0.2 })
    );
    c.rotation.x = Math.PI / 2;
    return c;
  }, 10, true, scene.time.now);

  // Sync Leftover Pizza Slices (spinning cheese-and-pepperoni wedges!)
  syncSimplePool(window.pizzas, threeState.pizzaMeshes, scene3d, () => {
    const p = new THREE.Mesh(
      new THREE.ConeGeometry(9.5, 14, 3),
      new THREE.MeshStandardMaterial({ color: 0xffb838, emissive: 0x802208, roughness: 0.3 })
    );
    p.rotation.x = Math.PI / 2;
    return p;
  }, 10, true, scene.time.now);

  // Sync Boss Chests
  syncSimplePool(chests, threeState.chestMeshes, scene3d, () => {
    return new THREE.Mesh(
      new THREE.BoxGeometry(24, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0xf5bd26, emissive: 0x593a00, metalness: 0.6, roughness: 0.3 })
    );
  }, 9);

  renderer.render(scene3d, camera3d);
}

function syncSimplePool(phaserGroup, map, scene3d, createFn, yHeight, spin, now) {
  const active = new Set();
  if (phaserGroup) {
    phaserGroup.getChildren().forEach(item => {
      if (!item.active) return;
      active.add(item);
      item.setAlpha(0);
      let m = map.get(item);
      if (!m) {
        m = createFn();
        scene3d.add(m);
        map.set(item, m);
      }
      m.position.set(item.x, (item.elev || 0) + yHeight, item.y);
      if (spin) m.rotation.y = (now || 0) / 280;
    });
  }
  map.forEach((m, item) => {
    if (!active.has(item)) {
      scene3d.remove(m);
      map.delete(item);
    }
  });
}

// Restore 2D sprite visibility when switching back to Mode 0 ("2D 16-Bit").
function restore2DSprites() {
  if (window.viewModeIdx !== 0) return;
  if (label) label.setVisible(true);
  if (window.stagePlatforms) window.stagePlatforms.forEach(pl => pl.setAlpha(1));
  [bills, splashes, gems, coins, window.pizzas, chests].forEach(grp => {
    if (grp) grp.getChildren().forEach(item => {
      item.setAlpha(1);
      if (item.tag) item.tag.setVisible(true);
    });
  });
}
