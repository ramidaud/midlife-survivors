// Shared animation import and frame selection for the preview and main game.
// Every frame uses one shared crop/scale so characters don't grow between steps.
window.CharacterArt = (() => {
  const directions = ['down', 'up', 'left', 'right'];
  const characters = [
    { id: 'officeWorker', name: 'The 9-to-5er' },
    { id: 'photographer', name: 'The Soccer Dad' },
    { id: 'gradStudent', name: 'The Grad Student at 45' }
  ];
  function frame(direction, step) {
    return Math.max(0, directions.indexOf(direction)) * 4 + ((step % 4 + 4) % 4);
  }
  function importSheet(scene, image, id, palette) {
    const source = document.createElement('canvas');
    source.width = image.width; source.height = image.height;
    const ctx = source.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, source.width, source.height);
    const cw = source.width / 4, ch = source.height / 4;
    let left = cw, right = 0, top = ch, bottom = 0;
    const counts = Array(16).fill(0);
    for (let y = 0; y < source.height; y++) for (let x = 0; x < source.width; x++) {
      const i = (y * source.width + x) * 4;
      const r = pixels.data[i], g = pixels.data[i+1], b = pixels.data[i+2];
      if (r > 160 && b > 160 && g < 110 && r-g > 90 && b-g > 90) { pixels.data[i+3] = 0; continue; }
      const col = Math.min(3, Math.floor(x/cw)), row = Math.min(3, Math.floor(y/ch));
      const lx = x-col*cw, ly = y-row*ch;
      counts[row*4+col]++;
      left = Math.min(left,lx); right = Math.max(right,lx);
      top = Math.min(top,ly); bottom = Math.max(bottom,ly);
    }
    if (counts.some(n => n < 100)) throw new Error('Missing animation frame in ' + id);
    ctx.putImageData(pixels,0,0);
    const isNative=source.width===224 && source.height===240;
    if(isNative){left=0;top=0;}
    const sw = isNative?56:right-left+1, sh = isNative?60:bottom-top+1;
    const scale = isNative?1:Math.min(52/sw,56/sh), dw = Math.round(sw*scale), dh = Math.round(sh*scale);
    const texture = scene.textures.createCanvas('walk_'+id, 224, 240);
    const out = texture.getContext(); out.imageSmoothingEnabled = false;
    for (let n = 0; n < 16; n++) {
      const col = n%4, row = Math.floor(n/4);
      out.drawImage(source,col*cw+left,row*ch+top,sw,sh,
        col*56+Math.floor((56-dw)/2),row*60+(isNative?0:58-dh),dw,dh);
      texture.add(n,0,col*56,row*60,56,60);
    }
    const small = out.getImageData(0,0,224,240);
    for(let i=0;i<small.data.length;i+=4) {
      if(!small.data[i+3]) continue;
      let best, distance=Infinity;
      for(const color of palette) {
        const d=(color[0]-small.data[i])**2+(color[1]-small.data[i+1])**2+(color[2]-small.data[i+2])**2;
        if(d<distance){best=color;distance=d;}
      }
      small.data.set(best,i);small.data[i+3]=255;
    }
    out.putImageData(small,0,0);texture.refresh();texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const native = document.createElement('canvas'); native.width=224;native.height=240;
    const exportCtx=native.getContext('2d'); exportCtx.fillStyle='#ff00ff'; exportCtx.fillRect(0,0,224,240);
    exportCtx.drawImage(texture.getSourceImage(),0,0);
    const link=document.getElementById(id+'-native');
    if(link){link.href=native.toDataURL('image/png');link.download=id+'-walk-56x60.png';}
    return { key: 'walk_'+id, frameWidth:56, frameHeight:60, frames:16, sourceCounts:counts };
  }
  return { characters, directions, frame, importSheet };
})();
