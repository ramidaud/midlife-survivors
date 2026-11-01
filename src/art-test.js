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
  const deskPositions = [[-125, 60], [125, 60], [180, 200]];
  const shots = [];

  // This import step keys the magenta and fits each atlas cell into game pixels.
  // Nearest-neighbor sampling and palette mapping keep the final textures hard edged.
  const palette = ['171c35', '303750', '526078', '3e7775', '83a89a', 'a88b70',
    'd3b78d', 'f2d7a1', 'fff0cf', '874c3b', 'c45c4b', 'ef9347', 'e5a995',
    'f1b5bf', 'bfa8cf'].map(hex => [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)));

  function importCell(image, column, key, width, height) {
    // Crop windows exclude a few pixels of desk that the generated atlas placed
    // over a cell boundary. Never include neighboring objects in the import.
    const [sx, sy, sw, sh] = [[32, 176, 456, 656], [544, 304, 448, 496], [1000, 232, 520, 592]][column];
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
    for (const [id, key] of [['hero', newArt ? 'art_hero' : 'player'],
      ['bill', newArt ? 'art_bill' : 'bill'], ['desk', newArt ? 'art_desk' : 'prop_desk']]) {
      const canvas = document.getElementById(id + '-sample'), ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const image = scene.textures.get(key).getSourceImage();
      const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      ctx.drawImage(image, Math.round((canvas.width - image.width * scale) / 2),
        Math.round((canvas.height - image.height * scale) / 2), image.width * scale, image.height * scale);
    }
    document.getElementById('bill-size').textContent = newArt ? '32 × 36 game pixels' : '36 × 26 game pixels';
    document.getElementById('desk-size').textContent = newArt ? '96 × 104 game pixels' : '96 × 68 game pixels';
  }

  function appearance() {
    if (!ready) return;
    hero.setTexture(newArt ? 'art_hero' : 'player');
    bill.setTexture(newArt ? 'art_bill' : 'bill');
    desks.forEach(d => d.setTexture(newArt ? 'art_desk' : 'prop_desk'));
    floor.setTexture(newArt ? 'art_floor' : 'floor');
    walkway.setVisible(newArt);
    document.getElementById('new-art').setAttribute('aria-pressed', String(newArt));
    document.getElementById('current-art').setAttribute('aria-pressed', String(!newArt));
    status.textContent = (newArt ? 'New art' : 'Current art') + ' · ' + zoom + '× view' +
      (zoom === 1 ? ' · Same hero frame size as the game' : ' · Enlarged for a closer look') + (paused ? ' · Paused' : '');
    samples();
  }

  function reset() {
    hero.setPosition(0, 38); bill.setPosition(-130, 65);
    shots.splice(0).forEach(s => s.image.destroy());
    shotAt = 0;
  }

  function create() {
    scene = this;
    buildSprites(scene);
    scene.load.image('atlas_source', window.ART_TEST_SHEET);
    scene.load.once('complete', () => {
      try {
        const source = scene.textures.get('atlas_source').getSourceImage();
        importCell(source, 0, 'art_hero', 48, 52);
        importCell(source, 1, 'art_bill', 32, 36);
        importCell(source, 2, 'art_desk', 96, 104);
        makeFloor('art_floor', false); makeFloor('art_walkway', true);
        floor = scene.add.tileSprite(0, 0, 2000, 2000, 'art_floor');
        walkway = scene.add.tileSprite(0, 75, 2000, 112, 'art_walkway');
        desks = deskPositions.map(([x, y]) => scene.add.image(x, y, 'art_desk').setOrigin(.5, 1).setDepth(y));
        hero = scene.add.image(0, 38, 'art_hero').setOrigin(.5, 1);
        bill = scene.add.image(-130, 65, 'art_bill').setOrigin(.5, 1);
        coffee = scene.add.graphics();
        keys = scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
        scene.input.keyboard.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']);
        scene.cameras.main.setRoundPixels(true).startFollow(hero, true, .1, .1);
        ready = true;
        appearance();
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
    if (length) {
      let nx = hero.x + dx / length * 150 * dt, ny = hero.y + dy / length * 150 * dt;
      // A shallow footprint keeps tall artwork from blocking empty floor above it.
      for (const desk of desks) {
        if (Math.abs(nx - desk.x) < 48 && ny > desk.y - 38 && ny < desk.y + 8) { nx = hero.x; ny = hero.y; }
      }
      hero.setPosition(nx, ny);
    }
    hero.setDepth(hero.y); bill.setDepth(bill.y);
    floor.setPosition(hero.x, hero.y); floor.tilePositionX = hero.x; floor.tilePositionY = hero.y;
    walkway.x = hero.x; walkway.tilePositionX = hero.x;
    const bx = hero.x - bill.x, by = hero.y - bill.y, distance = Math.hypot(bx, by);
    if (distance > 25) { bill.x += bx / distance * 38 * dt; bill.y += by / distance * 38 * dt; }
    if (time > shotAt && distance > 28) {
      const image = scene.add.rectangle(hero.x - 12, hero.y - 24, 6, 4, 0xef9347).setDepth(10000);
      shots.push({ image, vx: bx / distance * -230, vy: by / distance * -230, age: 0 });
      shotAt = time + 1100;
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i]; s.image.x += s.vx * dt; s.image.y += s.vy * dt; s.age += dt;
      if (Math.hypot(s.image.x - bill.x, s.image.y - (bill.y - 16)) < 19) {
        bill.setPosition(hero.x - 150, hero.y + 60);
        s.age = 2;
      }
      if (s.age > 1.5) { s.image.destroy(); shots.splice(i, 1); }
    }
    coffee.clear();
    coffee.fillStyle(0x171c35); coffee.fillRect(Math.round(hero.x - 16), Math.round(hero.y + 5), 32, 4);
    coffee.fillStyle(0x83a89a); coffee.fillRect(Math.round(hero.x - 15), Math.round(hero.y + 6), 30, 2);
    coffee.setDepth(10001);
  }

  document.getElementById('new-art').onclick = () => { newArt = true; appearance(); };
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
  document.getElementById('reset').onclick = () => { if (ready) reset(); };
  const arena = document.getElementById('arena');
  const game = new Phaser.Game({ type: Phaser.CANVAS, parent: 'arena', backgroundColor: '#303750',
    pixelArt: true, roundPixels: true,
    scale: { mode: Phaser.Scale.NONE, width: arena.clientWidth, height: arena.clientHeight },
    scene: { create, update } });
  new ResizeObserver(() => {
    game.scale.resize(arena.clientWidth, arena.clientHeight);
  }).observe(arena);
})();
