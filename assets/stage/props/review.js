/* Art-only review. Never loaded by the game. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id),specs=window.STAGE_PROPS.assets,images=new Map(),variants=new Map(),seen=new Set();
 function keyed(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height);for(let i=0;i<p.data.length;i+=4)if(p.data[i]===255&&p.data[i+1]===0&&p.data[i+2]===255)p.data[i+3]=0;ctx.putImageData(p,0,0);resolve(c);};img.onerror=reject;img.src=src;});}
 function floor(ctx,w,h){const mode=$('floor').value;ctx.fillStyle={carpet:'#526078',wood:'#a88b70',navy:'#171c35'}[mode];ctx.fillRect(0,0,w,h);if(images.has('floor-'+mode)){ctx.fillStyle=ctx.createPattern(images.get('floor-'+mode),'repeat');ctx.fillRect(0,0,w,h);return;}ctx.fillStyle=mode==='wood'?'#874c3b':'#303750';ctx.globalAlpha=.28;for(let x=0;x<w;x+=32){ctx.fillRect(x,0,1,h);}ctx.globalAlpha=1;ctx.fillStyle='#83a89a';if(mode==='carpet')for(let x=12;x<w;x+=40)ctx.fillRect(x,190,5,1);}
 const label=(ctx,text,x,y)=>{ctx.font='10px monospace';ctx.fillStyle='#fff0cf';ctx.fillText(text,x,y);};
 function draw(s){const canvas=$('canvas-'+s.id),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;floor(ctx,320,208);const [w,h]=s.frame,base=174,x=100-w/2,y=base-(h-3),v=variants.get(s.id)||0;
 if(!s.solid){ctx.fillStyle='#303750';ctx.fillRect(100-w/2-4,y-4,w+8,h+7);ctx.fillStyle='#526078';ctx.fillRect(100-w/2-2,y-2,w+4,h+3);}else{ctx.fillStyle='#171c35';ctx.globalAlpha=.24;ctx.fillRect(Math.round(100-s.footprint.width/2)-2,base-4,s.footprint.width+4,9);ctx.globalAlpha=1;}
 ctx.drawImage(images.get(s.id),v*w,0,w,h,x,y,w,h);
 if($('footprints').checked&&s.solid){ctx.strokeStyle='#ef9347';ctx.lineWidth=1;ctx.strokeRect(Math.floor(100-s.footprint.width/2)+.5,base-s.footprint.back+.5,s.footprint.width,s.footprint.back+s.footprint.front);}
 ctx.drawImage(images.get('hero'),56,0,56,60,192,base-57,56,60);ctx.drawImage(images.get('bill'),0,0,48,48,272,base-34,36,36);
 label(ctx,'PROP',88,199);label(ctx,'HERO',207,199);label(ctx,'BILL',278,199);
 }
 function gate(){const canvas=$('gate-preview'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;floor(ctx,384,224);const left=80,right=304,open=$('gate-open').checked,archive=$('gate-type').value==='archive';
 ctx.fillStyle='#303750';ctx.fillRect(0,36,left,136);ctx.fillRect(right,36,80,136);
 if(archive){const img=images.get('gate_hidden_cabinet');ctx.drawImage(img,0,0,96,112,left-96,50,96,112);ctx.drawImage(img,0,0,96,112,right,50,96,112);if(!open){ctx.save();ctx.beginPath();ctx.rect(left,50,224,112);ctx.clip();for(const x of [left,left+74,left+148])ctx.drawImage(img,0,0,96,112,x,50,96,112);ctx.restore();}}
 else {const img=images.get('gate_keycard');ctx.drawImage(img,0,0,24,96,left-24,62,24,96);ctx.drawImage(img,0,0,24,96,right,62,24,96);if(!open){ctx.fillStyle='#3e7775';ctx.fillRect(left,77,224,78);ctx.fillStyle='#83a89a';ctx.fillRect(left,77,224,3);ctx.fillStyle='#171c35';ctx.fillRect(191,80,2,75);}}
 // No jamb or retracted panel intrudes into this measured opening.
 ctx.strokeStyle='#f2d7a1';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left+.5,183);ctx.lineTo(right+.5,183);ctx.moveTo(left+.5,178);ctx.lineTo(left+.5,188);ctx.moveTo(right+.5,178);ctx.lineTo(right+.5,188);ctx.stroke();
 if(open)ctx.drawImage(images.get('hero'),56,0,56,60,164,107,56,60);
 label(ctx,open?'224px CLEAR OPENING':'224px DOORWAY (CLOSED)',open?132:126,204);label(ctx,archive?'FILES':'AUTHORIZED PERSONNEL',archive?176:128,28);
 }
 function redraw(){for(const s of specs)draw(s);gate();}
 for(const s of specs){const card=document.createElement('article');card.className='card';card.dataset.category=s.category;
 const title=document.createElement('h2');title.textContent=s.name;const meta=document.createElement('p');meta.textContent=`${s.frame.join('×')} native · ${s.variants} colorways · ${s.solid?'solid floor footprint':'non-solid wall art'}`;
 const scroll=document.createElement('div');scroll.className='canvas-scroll';const canvas=document.createElement('canvas');canvas.id='canvas-'+s.id;canvas.width=320;canvas.height=208;canvas.setAttribute('aria-label',s.name+' beside the native hero and Bill');scroll.append(canvas);
 const controls=document.createElement('div');controls.className='controls';for(let v=0;v<s.variants;v++){const b=document.createElement('button');b.textContent='Color '+(v+1);b.setAttribute('aria-label',s.name+' color '+(v+1));b.setAttribute('aria-pressed',String(v===0));b.onclick=()=>{variants.set(s.id,v);for(const other of controls.querySelectorAll('button'))other.setAttribute('aria-pressed',String(other===b));draw(s);};controls.append(b);}
 const approach=document.createElement('button');approach.textContent='Read on approach';approach.onclick=()=>{$('tip').hidden=false;if(seen.has(s.id)){$('tip').textContent='Already read this run. Reset the caption demo to read again.';return;}seen.add(s.id);$('tip').textContent=s.caption;};
 const links=document.createElement('div');links.className='downloads';for(const [name,file] of [['Native sheet',s.file],['Source',s.source]]){const a=document.createElement('a');a.textContent=name;a.href=file;a.download=file;links.append(a);}
 const note=document.createElement('p');note.textContent=s.notes;
 card.append(title,meta,scroll,controls,approach,note,links);$('gallery').append(card);
 }
 $('filter').onchange=()=>document.querySelectorAll('.card').forEach(c=>c.hidden=$('filter').value!=='all'&&c.dataset.category!==$('filter').value);
 $('scale').onchange=()=>document.querySelectorAll('#gallery canvas').forEach(c=>{c.style.width=320*Number($('scale').value)+'px';c.style.height=208*Number($('scale').value)+'px';});
 $('floor').onchange=redraw;$('footprints').onchange=redraw;$('gate-type').onchange=gate;$('gate-open').onchange=gate;$('reset-captions').onclick=()=>{seen.clear();$('tip').hidden=true;$('tip').textContent='Caption demo reset. Approach a prop to read its joke.';};
 Promise.all([...Object.entries(window.STAGE_PROPS.floors).map(async([id,src])=>images.set('floor-'+id,await keyed(src))),...specs.map(async s=>images.set(s.id,await keyed(s.src))),keyed(window.CHARACTER_SHEETS.officeWorker).then(c=>images.set('hero',c)),keyed(window.ENEMY_ART_REVIEW.find(e=>e.id==='bill').src).then(c=>images.set('bill',c))]).then(()=>{redraw();document.body.dataset.ready='true';}).catch(()=>{$('tip').hidden=false;$('tip').textContent='An art file could not load. Reload this isolated review.';});
})();
