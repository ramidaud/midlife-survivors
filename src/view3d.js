// Multi-style 3D & Isometric renderer (`src/view3d.js`).
// Lets the player toggle live between:
//   0: "2D 16-Bit"        — Classic top-down 16-bit Phaser view
//   1: "Diablo 3/4"       — Moody isometric 3/4 dungeon-crawler view with torchlight & long shadows
//   2: "3D Third-Person"  — Fortnite / Risk-of-Rain style stylized 3D view with sky, fog & 3D models!

window.VIEW_MODES = ["2D 16-Bit", "Diablo 3/4", "3D Third-Person"];
window.viewModeIdx = 0;

let threeState = null;

function initThreeOverlay() {
  if (threeState || typeof THREE === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.id = "three-overlay";
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "0", display: "none"
  });
  // Insert behind the Phaser canvas so Phaser's HUD, XP bar, and menus draw cleanly on top!
  const gameDiv = document.getElementById("game");
  gameDiv.insertBefore(canvas, gameDiv.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene3d = new THREE.Scene();
  const camera3d = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2800);

  // Lighting: hemisphere sky/ground + dramatic shadow-casting directional light + warm player torchlight
  const hemi = new THREE.HemisphereLight(0x9bb8ff, 0x1e2238, 0.65);
  scene3d.add(hemi);

  const dirLight = new THREE.DirectionalLight(0xfff0d8, 0.9);
  dirLight.position.set(180, 340, 220);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  const d = 480;
  dirLight.shadow.camera.left = -d; dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.near = 50; dirLight.shadow.camera.far = 1100;
  scene3d.add(dirLight);
  scene3d.add(dirLight.target);

  // Diablo-style warm torchlight following the player
  const torchLight = new THREE.PointLight(0xffa84c, 1.4, 380, 1.6);
  torchLight.position.set(0, 55, 0);
  scene3d.add(torchLight);

  // Procedural 3D floor texture (checkerboard carpet + wood grain lines + rug motifs)
  const floorCan = document.createElement("canvas");
  floorCan.width = 256; floorCan.height = 256;
  const fctx = floorCan.getContext("2d");
  for (let y = 0; y < 256; y += 64) {
    for (let x = 0; x < 256; x += 64) {
      const alt = ((x + y) / 64) % 2 === 0;
      fctx.fillStyle = alt ? "#222946" : "#1b2038";
      fctx.fillRect(x, y, 64, 64);
      fctx.strokeStyle = "#14182b"; fctx.lineWidth = 2;
      fctx.strokeRect(x, y, 64, 64);
      fctx.fillStyle = "rgba(255,255,255,0.04)";
      fctx.fillRect(x + 6, y + 6, 52, 2);
    }
  }
  const floorTex = new THREE.CanvasTexture(floorCan);
  floorTex.wrapS = THREE.RepeatWrapping;
  floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(50, 50);

  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.85, metalness: 0.1 });
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(12800, 12800), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene3d.add(floorMesh);

  // Build stylized 3D Player mesh group (body, head, glasses, tie, and steaming coffee mug!)
  const playerGroup = build3DPlayer();
  scene3d.add(playerGroup);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera3d.aspect = window.innerWidth / window.innerHeight;
    camera3d.updateProjectionMatrix();
  });

  threeState = {
    canvas, renderer, scene3d, camera3d, hemi, dirLight, torchLight,
    floorMesh, floorTex, playerGroup,
    enemyMeshes: new Map(),
    splashMeshes: new Map(),
    gemMeshes: new Map(),
    coinMeshes: new Map(),
    chestMeshes: new Map(),
    propMeshes: [],
    rings: [],
    projVec: new THREE.Vector3()
  };
}

// Convert a 3D world point (wx, wy, wz) into Phaser 2D world coordinates so 2D labels & damage numbers
// float right above their 3D models in Diablo 3/4 and 3D Third-Person views!
function project3DToPhaserWorld(scene, wx, wy, wz) {
  if (!threeState || window.viewModeIdx === 0) return { x: wx, y: wz, visible: true };
  const v = threeState.projVec.set(wx, wy, wz).project(threeState.camera3d);
  if (v.z > 1) return { x: -9999, y: -9999, visible: false }; // behind camera
  const sx = (v.x * 0.5 + 0.5) * scene.scale.width;
  const sy = (-v.y * 0.5 + 0.5) * scene.scale.height;
  return { x: scene.cameras.main.scrollX + sx, y: scene.cameras.main.scrollY + sy, visible: true };
}

// Spawn a 3D expanding shockwave ring on the floor (for Dad Joke and The Word "No.").
function spawn3DRing(wx, wz, maxRadius, colorHex) {
  if (!threeState) return;
  const geo = new THREE.RingGeometry(0.84, 1.0, 32);
  const mat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(wx, 2.5, wz);
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
  const matMug = new THREE.MeshStandardMaterial({ color: 0xf08526, roughness: 0.3, emissive: 0x3b1800 });

  // Legs
  const legGeo = new THREE.BoxGeometry(6, 12, 6);
  const legL = new THREE.Mesh(legGeo, matSuit); legL.position.set(-4.5, 6, 0); legL.castShadow = true;
  const legR = new THREE.Mesh(legGeo, matSuit); legR.position.set(4.5, 6, 0);  legR.castShadow = true;
  g.add(legL, legR);

  // Torso (blazer + shirt front + red tie)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 11), matSuit);
  torso.position.set(0, 19, 0); torso.castShadow = true;
  const shirt = new THREE.Mesh(new THREE.BoxGeometry(8, 15, 11.4), matShirt);
  shirt.position.set(0, 19, 0);
  const tie = new THREE.Mesh(new THREE.BoxGeometry(2.6, 11, 11.8), matTie);
  tie.position.set(0, 18.5, 0);
  g.add(torso, shirt, tie);

  // Head + Hair + Silver Temples + Glasses
  const head = new THREE.Mesh(new THREE.BoxGeometry(15, 14, 14), matSkin);
  head.position.set(0, 34, 0); head.castShadow = true;
  const hair = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 15), matHair);
  hair.position.set(0, 40, -0.5);
  const templeL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 14.4), matGray);
  templeL.position.set(-7.5, 36, 0);
  const templeR = templeL.clone(); templeR.position.x = 7.5;
  const glasses = new THREE.Mesh(
    new THREE.BoxGeometry(14, 3.2, 14.8),
    new THREE.MeshStandardMaterial({ color: 0x7ce0ff, metalness: 0.6, roughness: 0.2 })
  );
  glasses.position.set(0, 35, 0.5);
  g.add(head, hair, templeL, templeR, glasses);

  // Right arm holding glowing orange Coffee Mug
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(4, 3.6, 8, 12), matMug);
  mug.position.set(13, 21, 4); mug.castShadow = true;
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
    // 3D Torus Donut with pink icing!
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
  } else if (kind === "performanceReview") {
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(44, 56, 10),
      new THREE.MeshStandardMaterial({ color: 0xc92c49, roughness: 0.4 })
    );
    board.position.y = 28; board.castShadow = true;
    const clip = new THREE.Mesh(
      new THREE.BoxGeometry(22, 8, 13),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.7, roughness: 0.2 })
    );
    clip.position.set(0, 56, 0);
    g.add(board, clip);
  } else if (kind === "mortgageRefinance") {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(52, 38, 42),
      new THREE.MeshStandardMaterial({ color: 0x7b5cc2, roughness: 0.5 })
    );
    base.position.y = 19; base.castShadow = true;
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(40, 24, 4),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.5, roughness: 0.3 })
    );
    roof.rotation.y = Math.PI / 4; roof.position.y = 50;
    g.add(base, roof);
  } else if (kind === "midlifeCrisis") {
    // 3D Red Sports Convertible!
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(58, 14, 30),
      new THREE.MeshStandardMaterial({ color: 0xff1e38, metalness: 0.5, roughness: 0.2, emissive: 0x330006 })
    );
    chassis.position.y = 10; chassis.castShadow = true;
    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(14, 10, 26),
      new THREE.MeshStandardMaterial({ color: 0x8ce0ff, metalness: 0.8, roughness: 0.1 })
    );
    windshield.position.set(-6, 19, 0);
    g.add(chassis, windshield);
  } else {
    // Father Time / Reaper
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
  window.viewModeIdx = (window.viewModeIdx + 1) % window.VIEW_MODES.length;
  applyViewMode(scene);
  return window.VIEW_MODES[window.viewModeIdx];
}

function applyViewMode(scene) {
  initThreeOverlay();
  const is3D = window.viewModeIdx > 0;
  if (threeState) {
    threeState.canvas.style.display = is3D ? "block" : "none";
  }
  // Make Phaser's background transparent in 3D/Diablo modes so the Three.js world shows through
  // while Phaser's HUD, health/XP bars, floating damage numbers, and menus stay crisp on top!
  scene.cameras.main.setBackgroundColor(is3D ? "rgba(0,0,0,0)" : "#1b1f38");
  if (floor) floor.setVisible(!is3D);
  if (stageProps) stageProps.forEach(p => p.setAlpha(is3D ? 0 : 1));
  if (player) player.setAlpha(is3D ? 0 : 1);
}

// Sync every Phaser entity into the Three.js 3D scene and render the active camera style!
function renderThreeView(scene) {
  if (window.viewModeIdx === 0) return;
  initThreeOverlay();
  if (!threeState || !player) return;

  const { renderer, scene3d, camera3d, hemi, dirLight, torchLight, floorMesh, floorTex, playerGroup } = threeState;
  const mode = window.viewModeIdx; // 1 = Diablo 3/4, 2 = 3D Third-Person (Fortnite/Over-the-shoulder)
  const px = player.x, pz = player.y;

  // Keep infinite floor centered under player and scroll its UV coordinates seamlessly
  floorMesh.position.set(px, 0, pz);
  floorTex.offset.set(px / 256, -pz / 256);

  // Sync Player 3D model position, facing, and walking bounce
  playerGroup.position.set(px, Math.abs(Math.sin(scene.time.now / 55)) * (player.body && player.body.velocity.length() > 5 ? 3.5 : 0), pz);
  if (player.body && player.body.velocity.length() > 5) {
    playerGroup.rotation.y = Math.atan2(player.body.velocity.x, player.body.velocity.y);
  }

  // Lighting & Camera setup per style
  torchLight.position.set(px, 65, pz);
  dirLight.position.set(px + 180, 340, pz + 220);
  dirLight.target.position.set(px, 0, pz);

  if (mode === 1) {
    // STYLE 1: DIABLO 3/4 ISOMETRIC DUNGEON VIEW
    // Moody dark atmosphere, strong golden torchlight around the hero, tilted 45-degree isometric camera
    scene3d.background = new THREE.Color(0x090b14);
    scene3d.fog = new THREE.FogExp2(0x090b14, 0.0014);
    hemi.intensity = 0.28;
    dirLight.intensity = 0.55;
    torchLight.intensity = 2.4;
    torchLight.distance = 460;
    camera3d.fov = 38;
    camera3d.updateProjectionMatrix();
    camera3d.position.set(px - 260, 420, pz + 320);
    camera3d.lookAt(px, 12, pz);
  } else {
    // STYLE 2: 3D THIRD-PERSON SHOOTER / ACTION VIEW ("Fortnite meets Vampire Survivors")
    // Bright stylized sky, horizon fog, lower chase camera looking across the 3D arena!
    scene3d.background = new THREE.Color(0x283866);
    scene3d.fog = new THREE.FogExp2(0x283866, 0.0011);
    hemi.intensity = 0.85;
    dirLight.intensity = 1.1;
    torchLight.intensity = 0.7;
    torchLight.distance = 320;
    camera3d.fov = 60;
    camera3d.updateProjectionMatrix();
    camera3d.position.set(px, 165, pz + 250);
    camera3d.lookAt(px, 22, pz - 90);
  }

  // Sync 3D Office Furniture Props (desks, plants, watercoolers)
  while (threeState.propMeshes.length < (stageProps ? stageProps.length : 0)) {
    const box = new THREE.Group();
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(64, 24, 38),
      new THREE.MeshStandardMaterial({ color: 0x8c5e35, roughness: 0.6 })
    );
    desk.position.y = 12; desk.castShadow = true; desk.receiveShadow = true;
    const mon = new THREE.Mesh(
      new THREE.BoxGeometry(36, 16, 4),
      new THREE.MeshStandardMaterial({ color: 0x5ce0ff, emissive: 0x1b5c80 })
    );
    mon.position.set(0, 30, -10);
    box.add(desk, mon);
    scene3d.add(box);
    threeState.propMeshes.push(box);
  }
  if (stageProps) {
    stageProps.forEach((sp, i) => {
      const m = threeState.propMeshes[i];
      if (!m) return;
      m.visible = sp.visible;
      m.position.set(sp.x, 0, sp.y);
    });
  }

  // Sync Enemies & Bosses
  const activeBills = new Set();
  if (bills) {
    bills.getChildren().forEach(b => {
      if (!b.active) return;
      activeBills.add(b);
      b.setAlpha(0); // hide 2D sprite while 3D mesh represents it
      let m = threeState.enemyMeshes.get(b);
      if (!m) {
        m = makeEnemy3DMesh(b.kind || "bill");
        scene3d.add(m);
        threeState.enemyMeshes.set(b, m);
      }
      m.position.set(b.x, 0, b.y);
      m.rotation.y = Math.atan2(px - b.x, pz - b.y);
      if (b.tag) {
        const pt = project3DToPhaserWorld(scene, b.x, b.isBoss ? 64 : 28, b.y);
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
    const pt = project3DToPhaserWorld(scene, px, 50, pz);
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
      new THREE.SphereGeometry(6, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xf09c42, emissive: 0x7b4a2a, roughness: 0.2 })
    );
    m.position.y = 18;
    return m;
  }, 18);

  // Sync Wisdom Gems (spinning 3D blue crystals)
  syncSimplePool(gems, threeState.gemMeshes, scene3d, () => {
    return new THREE.Mesh(
      new THREE.OctahedronGeometry(7, 0),
      new THREE.MeshStandardMaterial({ color: 0x5fb3f0, emissive: 0x1b5699, metalness: 0.5, roughness: 0.1 })
    );
  }, 10, true, scene.time.now);

  // Sync 401(k) Coins (spinning gold cylinders)
  syncSimplePool(coins, threeState.coinMeshes, scene3d, () => {
    const c = new THREE.Mesh(
      new THREE.CylinderGeometry(7, 7, 3, 14),
      new THREE.MeshStandardMaterial({ color: 0xffe042, emissive: 0x805500, metalness: 0.8, roughness: 0.2 })
    );
    c.rotation.x = Math.PI / 2;
    return c;
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
      m.position.set(item.x, yHeight, item.y);
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
  [bills, splashes, gems, coins, chests].forEach(grp => {
    if (grp) grp.getChildren().forEach(item => {
      item.setAlpha(1);
      if (item.tag) item.tag.setVisible(true);
    });
  });
}
