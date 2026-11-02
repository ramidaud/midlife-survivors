// Looks only. Set false and reload to compare with the original canvas art.
window.USE_ENEMY_ART = true;
window.EnemyArt = (() => {
  const specs = {
    bill: ['bill', 48, 4, 180, 36],
    lateFee: ['late-fee', 32, 4, 100, 25],
    spamCall: ['spam-likely', 48, 4, 160, 36],
    snackAttack: ['late-night-donut', 48, 4, 150, 34],
    backTwinge: ['back-twinge', 48, 4, 140, 32],
    officeGossip: ['reply-all', 48, 4, 220, 42],
    threeAmThought: ['3am-thought', 48, 4, 230, 32],
    calendarInvite: ['calendar-invite', 48, 4, 120, 32],
    groupChat: ['group-chat', 48, 4, 200, 34],
    mathWorksheet: ['math-homework', 48, 4, 170, 34],
    ping: ['group-chat-ping', 16, 2, 160, 14]
  };
  const key = kind => 'enemy-art-' + kind;
  function animation(scene, kind, suffix, frames) {
    const name = key(kind) + suffix;
    if (!scene.anims.exists(name)) scene.anims.create({
      key: name, frames: frames.map(frame => ({ key: key(kind), frame })),
      frameRate: 1000 / specs[kind][3], repeat: -1
    });
    return name;
  }
  function importSheet(scene, image, kind) {
    const [, size, frames] = specs[kind];
    if (image.width !== size * frames || image.height !== size) throw new Error('Wrong native dimensions');
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = false; ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i] === 255 && pixels.data[i + 1] === 0 && pixels.data[i + 2] === 255) pixels.data[i + 3] = 0;
    }
    ctx.putImageData(pixels, 0, 0);
    if (!scene.textures.exists(key(kind))) {
      scene.textures.addSpriteSheet(key(kind), canvas, { frameWidth: size, frameHeight: size });
      scene.textures.get(key(kind)).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    animation(scene, kind, '', Array.from({ length: frames }, (_, i) => i));
    if (kind === 'spamCall') {
      animation(scene, kind, '-walk', [0, 1]);
      animation(scene, kind, '-ring', [2, 3]);
    }
  }
  function init(scene, clock) {
    const entities = new Set(), ready = new Set(), requests = [];
    let alive = true, previousTime = -1;
    const shadowKey = 'enemy-art-contact';
    if (!scene.textures.exists(shadowKey)) {
      const texture = scene.textures.createCanvas(shadowKey, 32, 12), ctx = texture.getContext();
      ctx.save(); ctx.scale(1, 12 / 32);
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(23,28,53,0.32)'); gradient.addColorStop(1, 'rgba(23,28,53,0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 32); ctx.restore(); texture.refresh();
    }
    // Image elements also support opening index.html directly from the folder.
    if (window.USE_ENEMY_ART) for (const kind of Object.keys(specs)) {
      const image = new Image(); requests.push(image);
      image.onload = () => {
        if (!alive) return;
        try { importSheet(scene, image, kind); ready.add(kind); }
        catch (error) { console.warn('Enemy art fallback for ' + kind + ': ' + error.message); }
      };
      image.onerror = () => { /* Keep the original canvas sprite for this species. */ };
      image.src = 'assets/enemies/enemy-' + specs[kind][0] + '-v1.png?v=' + window.BUILD;
    }
    function attach(entity, kind) {
      if (!specs[kind]) return; // bosses never enter the art layer
      const record = { entity, kind, visual: null, shadow: null, shown: false };
      entity.artRecord = record; // lets hit and death effects find the drawn sprite
      entities.add(record);
      entity.once('destroy', () => {
        if (record.visual) record.visual.destroy();
        if (record.shadow) record.shadow.destroy();
        entities.delete(record);
      });
    }
    function sync() {
      const now = clock(), running = now !== previousTime;
      previousTime = now;
      for (const record of entities) {
        const { entity, kind } = record;
        if (!entity.active) continue;
        const enabled = window.USE_ENEMY_ART && ready.has(kind);
        if (!enabled) {
          if (record.shown) {
            entity.setVisible(true);
            if (entity.tag) entity.tag.setY(entity.y - ENEMIES[kind].size / 2 - 6);
          }
          record.shown = false;
          if (record.visual) { record.visual.setVisible(false); record.visual.anims.timeScale = 0; }
          if (record.shadow) record.shadow.setVisible(false);
          continue;
        }
        const [, size, , , baseDisplay] = specs[kind];
        const displaySize = baseDisplay * ((ENEMIES[kind] && ENEMIES[kind].scale) || 1); // ENEMY_SCALE in src/data/enemies.js
        if (!record.visual) {
          record.visual = scene.add.sprite(entity.x, entity.y, key(kind)).setScale(displaySize / size);
          if (kind !== 'threeAmThought' && kind !== 'ping') {
            record.shadow = scene.add.image(entity.x, entity.y, shadowKey).setDisplaySize(displaySize * 0.65, 7);
          }
        }
        const visual = record.visual;
        entity.setVisible(false); record.shown = true;
        visual.setVisible(true).setPosition(entity.x, entity.y)
          .setFlip(entity.flipX, entity.flipY).setAlpha(entity.alpha).setRotation(entity.rotation);
        if (visual.depth !== entity.depth) visual.setDepth(entity.depth);
        { // squash and stretch for ~120 ms after a hit (src/juice.js sets entity.hitAt)
          const base = displaySize / size, k = entity.hitAt ? (now - entity.hitAt) / 120 : 1;
          if (k >= 0 && k < 1) { const w = Math.sin(Math.PI * k); visual.setScale(base * (1 + 0.24 * w), base * (1 - 0.2 * w)); record.squashed = true; }
          else if (record.squashed) { visual.setScale(base); record.squashed = false; }
        } // setDepth re-sorts the whole scene, so only when it changes
        if (entity.tag) entity.tag.setY(entity.y - Math.max(displaySize, ENEMIES[kind].size) / 2 - 6
          - (kind === 'spamCall' && entity.state === 'ringing' ? 2 : 0));
        if (entity.isTinted) {
          if (entity.tintFill) visual.setTintFill(entity.tintTopLeft); else visual.setTint(entity.tintTopLeft);
        } else visual.clearTint();
        const age = Math.max(0, now - (entity.bornAt || now));
        if (kind === 'backTwinge') {
          const bt = ENEMIES.backTwinge, phase = age % (bt.lungeMs + bt.restMs);
          const frame = phase <= bt.lungeMs ? (phase < bt.lungeMs / 2 ? 1 : 2)
            : (phase < bt.lungeMs + bt.restMs / 2 ? 3 : 0);
          visual.anims.stop(); visual.setFrame(frame);
        } else if (kind === 'threeAmThought') {
          // Draw the fade inside the existing ghost window. Never derive
          // collision or vulnerability from an animation frame.
          const thought = ENEMIES.threeAmThought;
          const phase = age % (thought.solidMs + thought.ghostMs) - thought.solidMs;
          const frame = entity.ghost ? (phase < 230 || phase > thought.ghostMs - 230 ? 1 : 2)
            : (Math.floor(age / specs[kind][3]) % 2 ? 3 : 0);
          visual.anims.stop(); visual.setFrame(frame);
        } else {
          const suffix = kind === 'spamCall' ? (entity.state === 'ringing' ? '-ring' : '-walk') : '';
          visual.play(key(kind) + suffix, true);
          visual.anims.timeScale = running ? 1 : 0;
        }
        if (record.shadow) {
          record.shadow.setVisible(true).setPosition(entity.x, entity.y + displaySize * 0.4).setAlpha(entity.alpha);
          if (record.shadow.depth !== entity.depth - 0.1) record.shadow.setDepth(entity.depth - 0.1);
        }
      }
    }
    scene.events.on('postupdate', sync);
    scene.events.once('shutdown', () => {
      alive = false; scene.events.off('postupdate', sync);
      requests.forEach(image => { image.onload = null; image.onerror = null; });
      entities.clear();
    });
    scene.enemyArt = { attach };
  }
  return { init };
})();
