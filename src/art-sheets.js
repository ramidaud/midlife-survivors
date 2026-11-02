// Load a native pixel sheet with an exact magenta (#FF00FF) background, key the magenta out, and add it
// to Phaser as a texture with numbered frames (left to right, top to bottom). Used by breakables and boss art.
window.ArtSheets = (() => {
  const pending = new Map();
  function load(scene, key, url, fw, fh) {
    if (scene.textures.exists(key)) return Promise.resolve(true);
    if (pending.has(key)) return pending.get(key);
    const p = new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
          const ctx = c.getContext("2d", { willReadFrequently: true }); ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, c.width, c.height), px = d.data;
          for (let i = 0; i < px.length; i += 4) if (px[i] === 255 && px[i + 1] === 0 && px[i + 2] === 255) px[i + 3] = 0;
          ctx.putImageData(d, 0, 0);
          if (scene.textures.exists(key)) return resolve(true);
          const tex = scene.textures.addCanvas(key, c);
          const cols = Math.floor(img.width / fw), rows = Math.floor(img.height / fh);
          for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) tex.add(r * cols + q, 0, q * fw, r * fh, fw, fh);
          tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
          resolve(true);
        } catch (e) { console.warn("Art sheet failed: " + key, e); resolve(false); }
      };
      img.onerror = () => resolve(false);
      img.src = url + "?v=" + window.BUILD;
    });
    pending.set(key, p);
    return p;
  }
  return { load, reset: () => pending.clear() };
})();
