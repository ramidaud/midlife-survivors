/* Isolated art study. Uses the actual current sprite generator for comparison.
   No game saves, leaderboard, balance or production scene are loaded here. */
(() => {
  'use strict';
  const status = document.getElementById('status');
  if (!window.Phaser) {
    status.textContent = 'Phaser could not load. Connect to the internet and reload this page.';
    return;
  }
  let scene, hero, bill, desks = [], floor, walkway, keys, coffee;
  let newArt = true, zoom = 1, paused = false, ready = false, shotAt = 0;
  let characterId = 'officeWorker', facing = 'down', walked = 0, galleryClock = 0, currentFrame = 1;
  const deskPositions = [[-125, 60], [125, 60], [180, 200]];
  const shots = [];
  const campus = window.OFFICE_LAYOUT;
  let campusMode = !!campus, layoutObjects = [], campusProps = [], discoveries = [];
  let visited = new Set(), found = new Set(), currentDepartment = '', lastMapX = Infinity, lastMapY = Infinity;

  // Screen Y represents the point where an object's feet meet the floor.
  // The desk's back wall is drawn ABOVE its floor footprint in this 3/4 view.
  function deskFootprint(desk) {
    if (desk.isLandmark) return { left: desk.x - 20, right: desk.x + 20, top: desk.y - 22, bottom: desk.y + 3 };
    return { left: desk.x - 40, right: desk.x + 40,
      top: desk.y - (newArt ? 70 : 38), bottom: desk.y + 2 };
  }

  function moveAroundDesks(actor, dx, dy, radius) {
    const blocks = (x, y) => [...desks, ...campusProps].some(desk => {
      const box = deskFootprint(desk);
      return x > box.left - radius && x < box.right + radius &&
        y > box.top - 5 && y < box.bottom + 5;
    });
    // Resolve each axis separately: brushing a corner slides along it.
    if (!blocks(actor.x + dx, actor.y)) actor.x += dx;
    if (!blocks(actor.x, actor.y + dy)) actor.y += dy;
    if (campusMode) {
      actor.x = Phaser.Math.Clamp(actor.x, -campus.width / 2 + 20, campus.width / 2 - 20);
      actor.y = Phaser.Math.Clamp(actor.y, -campus.height / 2 + 60, campus.height / 2 - 20);
    }
  }

  function updateStatus() {
    status.textContent = campusMode ?
      `Corporate Campus · ${currentDepartment || 'Central crossroads'} · ${visited.size}/4 departments · ${found.size}/3 discoveries · ${zoom}×${paused ? ' · Paused' : ''}` :
      (newArt ? 'New art' : 'Current art') + ' · ' + zoom + '× view' +
      (zoom === 1 ? (newArt ? ' · Hero about 15% larger' : ' · Original hero size') : ' · Enlarged for a closer look') + (paused ? ' · Paused' : '');
  }

  function drawMap() {
    if (!campusMode) return;
    const canvas = document.getElementById('campus-map'), ctx = canvas.getContext('2d');
    const mx = x => (x + campus.width / 2) / 4, my = y => (y + campus.height / 2) / 4;
    ctx.fillStyle = '#171c35'; ctx.fillRect(0, 0, 320, 224);
    ctx.fillStyle = '#a88b70'; ctx.fillRect(0, 88, 320, 48); ctx.fillRect(136, 0, 48, 224);
    for (const department of campus.departments) {
      ctx.fillStyle = visited.has(department.id) ? '#3e7775' : '#303750';
      ctx.fillRect(mx(department.x - 192), my(department.y - 128), 96, 64);
      if (visited.has(department.id)) {
        ctx.fillStyle = '#fff0cf'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        const shortNames = {accounts:'Accounts',quiet:'Quiet zone',breakroom:'Breakroom',wellness:'Wellness'};
        ctx.fillText(shortNames[department.id], mx(department.x), my(department.y) + 4);
      }
    }
    ctx.fillStyle = '#ef9347';
    for (const d of campus.discoveries) if (!found.has(d.id)) {
      const department = campus.departments.find(z => Math.abs(d.x - z.x) < 192 && Math.abs(d.y - z.y) < 128);
      if (department && visited.has(department.id)) ctx.fillRect(mx(d.x) - 2, my(d.y) - 2, 4, 4);
    }
    ctx.fillStyle = '#fff0cf'; ctx.fillRect(mx(hero.x) - 2, my(hero.y) - 2, 5, 5);
    canvas.setAttribute('aria-label', `Campus map: ${visited.size} of four departments visited, ${found.size} of three discoveries found. You are at ${currentDepartment || 'Central crossroads'}.`);
    lastMapX = hero.x; lastMapY = hero.y;
  }

  function buildLayout() {
    desks.forEach(d => d.destroy());
    layoutObjects.forEach(o => o.destroy());
    desks = []; layoutObjects = []; campusProps = []; discoveries = [];
    visited = new Set(); found = new Set(); currentDepartment = '';
    const positions = campusMode ? campus.departments.flatMap(d => d.desks) : deskPositions;
    desks = positions.map(([x, y, variant]) => {
      const desk = scene.add.image(x, y, 'art_desk').setOrigin(.5, 1).setDepth(y);
      desk.variant = variant || 'tidy';
      return desk;
    });
    if (campusMode) {
      scene.cameras.main.setBounds(-640, -448, campus.width, campus.height);
      const ground = scene.add.graphics().setDepth(-999999998); layoutObjects.push(ground);
      ground.fillStyle(0xa88b70); ground.fillRect(-640, -96, 1280, 192); ground.fillRect(-96, -448, 192, 896);
      ground.lineStyle(2, 0x526078); ground.strokeRect(-640, -448, 1280, 896);
      for (const d of campus.departments) {
        ground.fillStyle(d.color, .3); ground.fillRect(d.x - 192, d.y - 128, 384, 256);
        ground.lineStyle(1, d.color); ground.strokeRect(d.x - 192, d.y - 128, 384, 256);
        const label = scene.add.text(d.x, d.y + 100, d.name, {fontFamily:'monospace',fontSize:'12px',color:'#fff0cf',backgroundColor:'#171c35',padding:{x:5,y:3}}).setOrigin(.5,0).setDepth(-999999997);
        const prop = scene.add.image(...d.propAt, d.prop).setOrigin(.5,1).setDepth(d.propAt[1]); prop.isLandmark = true;
        campusProps.push(prop); layoutObjects.push(label,prop);
      }
      for (const d of campus.discoveries) {
        const marker = scene.add.rectangle(d.x, d.y - 8, 22, 22, 0xef9347).setAngle(45).setDepth(d.y);
        const icon = scene.add.text(d.x,d.y - 8,d.glyph,{fontFamily:'monospace',fontSize:'16px',color:'#171c35'}).setOrigin(.5).setDepth(d.y + 1);
        discoveries.push({...d,marker,icon}); layoutObjects.push(marker,icon);
      }
    } else scene.cameras.main.removeBounds();
    document.getElementById('exploration').hidden = !campusMode;
    document.getElementById('layout').textContent = campusMode ? 'Layout: Campus' : 'Layout: Art Study';
    document.getElementById('layout').setAttribute('aria-pressed',String(campusMode));
    document.getElementById('test-heading').textContent = campusMode ? 'Corporate Campus: take the long way to coffee.' : 'A little more character. Same coffee problem.';
    document.getElementById('test-intro').textContent = campusMode ? 'Four departments, wide escape routes, and three small discoveries. A playable layout study.' : 'Try the new office look in motion, then switch back to compare.';
    document.getElementById('test-help').textContent = campusMode ? 'WASD / arrows or hold and drag. Explore four departments and walk over the glowing finds. This study tests exploration without combat.' : 'WASD / arrows or hold and drag. Coffee fires automatically at one persistent Bill. No damage or score.';
    document.getElementById('discovery-note').textContent = 'Follow the broad crossroads. Each department has more than one way in.';
    bill.setVisible(!campusMode);
    reset(); appearance(); drawMap();
  }

  function explore() {
    const department = campus.departments.find(d => Math.abs(hero.x - d.x) < 192 && Math.abs(hero.y - d.y) < 128);
    const name = department ? department.name : '';
    if (name !== currentDepartment) {
      currentDepartment = name;
      if (department && !visited.has(department.id)) {
        visited.add(department.id);
        document.getElementById('discovery-note').textContent = department.landmark + ': ' + department.joke;
      }
      updateStatus(); drawMap();
    }
    for (const d of discoveries) if (!found.has(d.id) && Math.hypot(hero.x - d.x, hero.y - d.y) < 32) {
      found.add(d.id); d.marker.setVisible(false); d.icon.setVisible(false);
      document.getElementById('discovery-note').textContent = d.name + ': ' + d.note;
      if (found.size === 3 && visited.size === 4) document.getElementById('discovery-note').textContent += ' All corners explored. Head back to the crossroads.';
      updateStatus(); drawMap();
    }
    if (Math.hypot(hero.x - lastMapX, hero.y - lastMapY) > 4) drawMap();
  }

  // This import step keys the magenta and fits each atlas cell into game pixels.
  // Nearest-neighbor sampling and palette mapping keep the final textures hard edged.
  const palette = ['171c35', '303750', '526078', '3e7775', '83a89a', 'a88b70',
    'd3b78d', 'f2d7a1', 'fff0cf', '874c3b', 'c45c4b', 'ef9347', 'e5a995',
    'f1b5bf', 'bfa8cf'].map(hex => [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)));

  function drawCharacter(canvas, id, frame) {
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(scene.textures.get('walk_'+id).getSourceImage(),frame%4*56,Math.floor(frame/4)*60,56,60,0,0,canvas.width,canvas.height);
  }

  function animateCharacters(dt, moving) {
    if(newArt) {
      if(!paused) currentFrame=CharacterArt.frame(facing,moving?Math.floor(walked/17):1);
      hero.setTexture('walk_'+characterId,currentFrame);
      drawCharacter(document.getElementById('hero-sample'),characterId,currentFrame);
    }
    galleryClock+=dt;
    const step=Math.floor(galleryClock*8)%4;
    const direction=document.getElementById('walk-direction').value;
    for(const character of CharacterArt.characters) drawCharacter(document.getElementById(character.id+'-walk'),character.id,CharacterArt.frame(direction,step));
    document.getElementById('walk-step').textContent='Walk pose '+(step+1)+' / 4';
    document.getElementById('motion-status').textContent=newArt?
      `${CharacterArt.characters.find(c=>c.id===characterId).name} · Facing ${facing} · ${paused?'Paused':moving?'Walking':'Standing'}`:'Original 9-to-5er · Static comparison';
  }

  function importCell(image, column, key, width, height) {
    // Crop windows exclude a few pixels of desk that the generated atlas placed
    // over a cell boundary. Never include neighboring objects in the import.
    const [sx, sy, sw, sh] = column === null ? [0, 0, image.width, image.height] :
      [[32, 176, 456, 656], [544, 304, 448, 496], [1000, 232, 520, 592]][column];
    const source = document.createElement('canvas');
    source.width = sw; source.height = sh;
    const ctx = source.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    const pixels = ctx.getImageData(0, 0, source.width, source.height);
    let left = source.width, right = 0, top = source.height, bottom = 0;
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        const i = (y * source.width + x) * 4;
        const [r, g, b] = pixels.data.subarray(i, i + 3);
        if (r > 160 && b > 160 && g < 110 && r - g > 90 && b - g > 90) {
          pixels.data[i + 3] = 0;
        } else {
          left = Math.min(left, x); right = Math.max(right, x);
          top = Math.min(top, y); bottom = Math.max(bottom, y);
        }
      }
    }
    if (left > right) throw new Error('Empty sprite cell: ' + key);
    ctx.putImageData(pixels, 0, 0);
    const texture = scene.textures.createCanvas(key, width, height);
    const out = texture.getContext();
    out.imageSmoothingEnabled = false;
    const factor = Math.min((width - 2) / (right - left + 1), (height - 2) / (bottom - top + 1));
    const dw = Math.round((right - left + 1) * factor), dh = Math.round((bottom - top + 1) * factor);
    out.drawImage(source, left, top, right - left + 1, bottom - top + 1,
      Math.floor((width - dw) / 2), height - dh - 1, dw, dh);
    const small = out.getImageData(0, 0, width, height);
    for (let i = 0; i < small.data.length; i += 4) {
      if (!small.data[i + 3]) continue;
      const closest = palette.reduce((best, color) => {
        const d = color.reduce((sum, c, j) => sum + (c - small.data[i + j]) ** 2, 0);
        return d < best.d ? { color, d } : best;
      }, { d: Infinity });
      small.data.set(closest.color, i);
      small.data[i + 3] = 255;
    }
    out.putImageData(small, 0, 0);
    texture.refresh();
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  function makeFloor(key, warm) {
    makeCanvasTex(scene, key, 32, 32, ctx => {
      // Repeats at both edges with no light pool or unique mark to expose a seam.
      const colors = warm ? ['#a88b70', '#a88b70', '#d3b78d'] : ['#303750', '#303750', '#526078'];
      ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = colors[1]; ctx.fillRect(0, 0, 16, 16); ctx.fillRect(16, 16, 16, 16);
      ctx.fillStyle = colors[2];
      ctx.fillRect(4, 5, 1, 1); ctx.fillRect(24, 21, 1, 1);
    });
  }

  function samples() {
    for (const [id, key] of [['bill', newArt ? 'art_bill' : 'bill'], ['desk', newArt ? 'art_desk' : 'prop_desk'],
      ...(!newArt?[['hero','player']]:[])]) {
      const canvas = document.getElementById(id + '-sample'), ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const image = scene.textures.get(key).getSourceImage();
      const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      ctx.drawImage(image, Math.round((canvas.width - image.width * scale) / 2),
        Math.round((canvas.height - image.height * scale) / 2), image.width * scale, image.height * scale);
    }
    document.getElementById('bill-size').textContent = newArt ? '32 × 36 game pixels' : '36 × 26 game pixels';
    document.getElementById('hero-size').textContent = newArt ? '56 × 60 game pixels' : '48 × 52 game pixels';
    document.getElementById('hero-name').textContent = newArt ? CharacterArt.characters.find(c=>c.id===characterId).name : 'The 9-to-5er';
    document.getElementById('desk-size').textContent = newArt ? '96 × 104 game pixels' : '96 × 68 game pixels';
    for (const variant of ['tidy', 'paperwork', 'lunch']) {
      const canvas = document.getElementById(variant + '-sample');
      const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(scene.textures.get('desk_' + variant).getSourceImage(),0,0);
    }
  }

  function appearance() {
    if (!ready) return;
    hero.setTexture(newArt ? 'walk_'+characterId : 'player',newArt?(paused?currentFrame:CharacterArt.frame(facing,1)):undefined);
    document.getElementById('character').disabled=!newArt;
    bill.setTexture(newArt ? 'art_bill' : 'bill');
    desks.forEach(d => d.setTexture(newArt ? (campusMode ? 'desk_' + d.variant : 'art_desk') : 'prop_desk'));
    floor.setTexture(newArt ? 'art_floor' : 'floor');
    walkway.setVisible(newArt && !campusMode);
    // Switching art can change the furniture footprint around an actor.
    for (const actor of [hero, bill]) {
      for (const desk of desks) {
        const box = deskFootprint(desk);
        if (actor.x > box.left - 11 && actor.x < box.right + 11 && actor.y > box.top - 5 && actor.y < box.bottom + 5) {
          actor.y = box.bottom + 6;
        }
      }
    }
    document.getElementById('new-art').setAttribute('aria-pressed', String(newArt));
    document.getElementById('current-art').setAttribute('aria-pressed', String(!newArt));
    updateStatus();
    samples();
    animateCharacters(0,false);
  }

  function reset() {
    hero.setPosition(0, 38); bill.setPosition(-75, 100);
    facing='down';walked=0;
    shots.splice(0).forEach(s => s.image.destroy());
    shotAt = 0;
  }

  function create() {
    scene = this;
    buildSprites(scene);
    // A simple code-drawn blockout prop, pending a final printer asset.
    makeCanvasTex(scene, 'prop_copier', 48, 52, ctx => {
      ctx.fillStyle = '#171c35'; ctx.fillRect(3, 12, 42, 38);
      ctx.fillStyle = '#526078'; ctx.fillRect(6, 25, 36, 22);
      ctx.fillStyle = '#fff0cf'; ctx.fillRect(6, 13, 36, 12); ctx.fillRect(13, 3, 22, 12);
      ctx.fillStyle = '#d3b78d'; ctx.fillRect(13, 7, 22, 2); ctx.fillRect(13, 11, 22, 2);
      ctx.fillStyle = '#171c35'; ctx.fillRect(10, 30, 28, 9);
      ctx.fillStyle = '#f2d7a1'; ctx.fillRect(16, 34, 16, 14);
      ctx.fillStyle = '#83a89a'; ctx.fillRect(34, 17, 5, 4);
    });
    scene.load.image('atlas_source', window.ART_TEST_SHEET);
    for (const [variant, data] of Object.entries(window.DESK_VARIANT_IMAGES || {})) scene.load.image('source_' + variant, data);
    for (const [id, data] of Object.entries(window.CHARACTER_SHEETS || {})) scene.load.image('character_source_' + id, data);
    scene.load.once('complete', () => {
      try {
        const source = scene.textures.get('atlas_source').getSourceImage();
        importCell(source, 0, 'art_hero', 56, 60);
        importCell(source, 1, 'art_bill', 32, 36);
        importCell(source, 2, 'art_desk', 96, 104);
        for (const variant of ['tidy', 'paperwork', 'lunch']) {
          const image = scene.textures.get('source_' + variant).getSourceImage();
          importCell(image, null, 'desk_' + variant, 96, 104);
        }
        for(const character of CharacterArt.characters) CharacterArt.importSheet(scene,
          scene.textures.get('character_source_'+character.id).getSourceImage(),character.id,[...palette,[185,122,88],[112,64,47]]);
        makeFloor('art_floor', false); makeFloor('art_walkway', true);
        // Scenery must stay behind actors even north of world Y=0.
        floor = scene.add.tileSprite(0, 0, 2000, 2000, 'art_floor').setDepth(-1000000000);
        walkway = scene.add.tileSprite(0, 75, 2000, 112, 'art_walkway').setDepth(-999999999);
        hero = scene.add.image(0, 38, 'art_hero').setOrigin(.5, 1);
        bill = scene.add.image(-75, 100, 'art_bill').setOrigin(.5, 1);
        coffee = scene.add.graphics();
        keys = scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
        scene.input.keyboard.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']);
        scene.cameras.main.setRoundPixels(true).startFollow(hero, true, .1, .1);
        ready = true;
        buildLayout();
      } catch (error) {
        status.textContent = 'The art could not load. Reload this page to try again.';
        console.error(error);
      }
    });
    scene.load.once('loaderror', () => { status.textContent = 'The sprite sheet could not load. Reload this page to try again.'; });
    scene.load.start();
  }

  function update(time, delta) {
    if (!ready || paused) return;
    const dt = Math.min(delta, 50) / 1000;
    let dx = Number(keys.D.isDown || keys.RIGHT.isDown) - Number(keys.A.isDown || keys.LEFT.isDown);
    let dy = Number(keys.S.isDown || keys.DOWN.isDown) - Number(keys.W.isDown || keys.UP.isDown);
    const pointer = scene.input.activePointer;
    if (pointer.isDown && pointer.downElement === scene.game.canvas) {
      const world = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const px = world.x - hero.x, py = world.y - (hero.y - 20);
      if (Math.hypot(px, py) > 8) { dx = px; dy = py; }
    }
    const length = Math.hypot(dx, dy);
    const oldX=hero.x,oldY=hero.y;
    if (length) {
      facing=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');
      moveAroundDesks(hero, dx / length * 150 * dt, dy / length * 150 * dt, 11);
    }
    const distanceWalked=Math.hypot(hero.x-oldX,hero.y-oldY);
    walked+=distanceWalked;
    animateCharacters(dt,distanceWalked>.05);
    hero.setDepth(hero.y); bill.setDepth(bill.y);
    floor.setPosition(hero.x, hero.y); floor.tilePositionX = hero.x; floor.tilePositionY = hero.y;
    walkway.x = hero.x; walkway.tilePositionX = hero.x;
    if (campusMode) explore();
    const bx = hero.x - bill.x, by = hero.y - bill.y, distance = Math.hypot(bx, by);
    if (!campusMode && distance > 25) moveAroundDesks(bill, bx / distance * 38 * dt, by / distance * 38 * dt, 8);
    if (!campusMode && time > shotAt && distance > 28) {
      const image = scene.add.rectangle(hero.x - 12, hero.y - 24, 6, 4, 0xef9347).setDepth(10000);
      shots.push({ image, vx: bx / distance * -230, vy: by / distance * -230, age: 0 });
      shotAt = time + 1100;
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i]; s.image.x += s.vx * dt; s.image.y += s.vy * dt; s.age += dt;
      if (Math.hypot(s.image.x - bill.x, s.image.y - (bill.y - 16)) < 19) {
        bill.setPosition(hero.x - 65, hero.y + 80);
        for (const desk of desks) {
          const box = deskFootprint(desk);
          if (bill.x > box.left - 8 && bill.x < box.right + 8 && bill.y > box.top - 5 && bill.y < box.bottom + 5) bill.y = box.bottom + 6;
        }
        s.age = 2;
      }
      if (s.age > 1.5) { s.image.destroy(); shots.splice(i, 1); }
    }
    coffee.clear();
    const behindDesk = desks.some(desk => hero.y < desk.y && hero.y > desk.y - desk.height &&
      Math.abs(hero.x - desk.x) < desk.width / 2 + 12);
    const barY = Math.round(behindDesk ? hero.y - hero.height - 7 : hero.y + 5);
    coffee.fillStyle(0x171c35); coffee.fillRect(Math.round(hero.x - 16), barY, 32, 4);
    coffee.fillStyle(0x83a89a); coffee.fillRect(Math.round(hero.x - 15), barY + 1, 30, 2);
    coffee.setDepth(10001);
  }

  document.getElementById('new-art').onclick = () => { newArt = true; appearance(); };
  document.getElementById('character').onchange = event => {
    characterId=event.target.value;walked=0;
    if(ready) appearance();
  };
  document.getElementById('walk-direction').onchange = () => { if(ready) animateCharacters(0,false); };
  document.getElementById('current-art').onclick = () => { newArt = false; appearance(); };
  document.getElementById('zoom').onclick = event => {
    if (!ready) return;
    zoom = zoom === 1 ? 2 : 1;
    scene.cameras.main.setZoom(zoom);
    event.currentTarget.textContent = 'Zoom: ' + zoom + '×';
    event.currentTarget.setAttribute('aria-pressed', String(zoom === 2)); appearance();
  };
  document.getElementById('pause').onclick = event => {
    paused = !paused;
    event.currentTarget.textContent = paused ? 'Resume motion' : 'Pause motion';
    event.currentTarget.setAttribute('aria-pressed', String(paused)); appearance();
  };
  document.getElementById('reset').onclick = () => { if (ready) buildLayout(); };
  document.getElementById('layout').onclick = () => { if (ready) { campusMode = !campusMode; buildLayout(); } };
  const arena = document.getElementById('arena');
  const game = new Phaser.Game({ type: Phaser.CANVAS, parent: 'arena', backgroundColor: '#303750',
    pixelArt: true, roundPixels: true,
    scale: { mode: Phaser.Scale.NONE, width: arena.clientWidth, height: arena.clientHeight },
    scene: { create, update } });
  new ResizeObserver(() => {
    if (!game.isRunning || !game.canvas || !game.renderer) return;
    game.scale.resize(arena.clientWidth, arena.clientHeight);
  }).observe(arena);
})();
