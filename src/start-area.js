// Authored Lobby/Bullpen vertical slice. No gate opening or navigation code lives here.
window.StartAreaArt = (() => {
 const BASE=-1000000000,CHUNK=512;
 function within(x,y){return START_AREA_LAYOUT.floors.some(r=>x>=r.x&&x<r.x+r.width&&y>=r.y&&y<r.y+r.height);}
 const font={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','4':'101101111001001','5':'111100110001110','0':'111101101101111','Q':'010101101111011','?':'110001010000010'};
 function sign(scene,key,text,width=128,plate=true){if(scene.textures.exists(key))return;const h=20,t=scene.textures.createCanvas(key,width,h),c=t.getContext();if(plate){c.fillStyle='#171c35';c.fillRect(0,0,width,h);c.fillStyle='#f2d7a1';c.fillRect(1,1,width-2,h-2);}c.fillStyle=plate?'#171c35':'#f2d7a1';const x0=Math.floor((width-(text.length*8-2))/2);[...text].forEach((ch,i)=>{const bits=font[ch]||'000000000000000';for(let n=0;n<15;n++)if(bits[n]==='1')c.fillRect(x0+i*8+(n%3)*2,5+Math.floor(n/3)*2,2,2);});t.refresh();t.setFilter(Phaser.Textures.FilterMode.NEAREST);}
 async function build(scene,refs,H){
  const data=START_AREA_LAYOUT,all=[],bodies=[],chunks=new Map(),items=[],captions=[],seen=new Set();let alive=true,lastMemo=-1e9,lastValid=data.spawn.slice();
  const add=(o,bounds=null)=>{all.push({o,bounds});return o;};
  // Decode everything before replacing the fallback office.
  for(const [id,a]of Object.entries(START_AREA_IMAGES)){
   const img=await H.image(a.src);if(!H.isAlive())return null;
   for(let v=0;v<a.variants;v++){const c=document.createElement('canvas');c.width=a.frame[0];c.height=a.frame[1];c.getContext('2d').drawImage(img,v*c.width,0,c.width,c.height,0,0,c.width,c.height);H.propTexture(scene,c,'slice_'+id+'_'+v,...a.frame);}
  }
  OfficeEnvironment.createTiles(scene);
  if(!scene.textures.exists('slice_void'))makeCanvasTex(scene,'slice_void',64,64,c=>{c.fillStyle='#171c35';c.fillRect(0,0,64,64);});
  if(!scene.textures.exists('slice_lobby'))makeCanvasTex(scene,'slice_lobby',64,64,c=>{c.fillStyle='#d3b78d';c.fillRect(0,0,64,64);c.fillStyle='#a88b70';c.fillRect(1,31,62,1);c.fillRect(31,1,1,62);c.fillStyle='#f2d7a1';c.globalAlpha=.2;c.fillRect(2,2,28,1);c.fillRect(34,34,28,1);c.globalAlpha=1;});
  function layer(x,y){const cx=Math.floor(x/CHUNK),cy=Math.floor(y/CHUNK),key=cx+','+cy;if(!chunks.has(key)){const g=add(scene.add.graphics().setDepth(BASE+3),{x:cx*CHUNK-256,y:cy*CHUNK-256,width:CHUNK+512,height:CHUNK+512});chunks.set(key,g);}return chunks.get(key);}
  for(const r of data.floors){const key=r.material==='vinyl'?'slice_lobby':'env_'+r.material;const t=add(scene.add.tileSprite(r.x,r.y,r.width,r.height,key).setOrigin(0).setDepth(BASE+1),r);t.tilePositionX=r.x;t.tilePositionY=r.y;}
  // Warm light pools and quieter floor stories leave every combat reserve non-solid.
  for(const r of data.floors)for(let x=r.x+64;x<r.x+r.width-96;x+=384){const g=layer(x,r.y+28);g.fillStyle(0xf2d7a1,.07);g.fillRect(x,r.y+28,Math.min(220,r.x+r.width-x-8),Math.min(120,r.height-40));}
  const rug=layer(-96,-160);rug.fillStyle(0x3e7775,.8);rug.fillRect(-432,-280,640,288);rug.fillStyle(0x83a89a,.7);rug.fillRect(-424,-272,624,3);rug.fillRect(-424,-4,624,3);rug.fillStyle(0xf2d7a1,.45);rug.fillRect(-408,-252,32,2);rug.fillRect(152,-32,32,2);
  rug.fillStyle(0x83a89a,.13);for(let y=-248;y<-16;y+=12)for(let x=-400;x<176;x+=24)rug.fillRect(x,y,8,1);
  const queue=layer(-80,-384);queue.fillStyle(0x3e7775,.45);for(let y=-420;y<-312;y+=24){queue.fillRect(-144,y,8,12);queue.fillRect(96,y,8,12);}queue.fillStyle(0x874c3b,.3);for(const [x,y]of [[-220,-344],[-188,-368],[252,-360]]){queue.fillRect(x,y,12,2);queue.fillRect(x,y+8,12,2);queue.fillRect(x-2,y+2,2,6);queue.fillRect(x+12,y+2,2,6);}queue.fillStyle(0xfff0cf,.6);for(let i=0;i<6;i++)queue.fillRect(-220+i*14,-430+(i%3)*12,8,12);
  sign(scene,'slice_welcome','WELCOME',96,false);add(scene.add.image(-112,-130,'slice_welcome').setAlpha(.65).setDepth(BASE+4),{x:-160,y:-140,width:96,height:20});
  for(let n=0;n<90;n++){const x=1450+(n*137%2450),y=-720+(n*83%1390);if(!within(x,y))continue;const g=layer(x,y);g.fillStyle(n%4===0?0xbfa8cf:0xf2d7a1,.52);g.fillRect(x,y,9,12);g.fillStyle(0x526078,.5);g.fillRect(x+2,y+3,5,1);}
  for(const [x,y,w,h]of [[1696,-560,960,24],[3104,-160,760,24],[2200,440,360,16]]){const g=layer(x,y);g.fillStyle(0xf2d7a1,.35);for(let a=0;a<w;a+=64)g.fillRect(x+a,y,32,h/8);}
  function fixture(p){const a=START_AREA_IMAGES[p.prop],key='slice_'+p.prop+'_'+(p.variant||0),o=add(scene.add.image(p.x,p.y,key).setOrigin(.5,1));o.sliceId=p.id;o.sliceDepth=p.depthY??p.y;o.sliceMeta=p;
   const solid=p.solid!==false&&a.solid;
   if(solid){H.body(o,a.footprint,p.prop==='plant'?'prop_plant':'prop_desk');bodies.push(o);o.cellKey='start:'+p.id;}
   items.push(o);const cap=window.STAGE_PROPS&&STAGE_PROPS.captions[p.prop]||a.caption;if(cap){o.caption=cap;captions.push(o);}
   if(solid){const g=p.prop==='plant'?add(scene.add.graphics().setDepth(BASE+3)):layer(p.x,p.y);OfficeEnvironment.groundObject(scene,g,key,p.x,p.y,p.prop.startsWith('desk_')?'desk':'prop');if(p.prop==='plant')o.sliceShadow=g;}
   if(p.prop.startsWith('desk_')){const g=layer(p.x,p.y);g.fillStyle(0x303750,.28);g.fillRect(p.x-42,p.y-30,76,40);g.fillStyle(0x83a89a,.18);g.fillRect(p.x-40,p.y-29,70,1);g.fillStyle(0x171c35,.3);g.fillRect(p.x+41,p.y-24,1,20);g.fillRect(p.x+36,p.y-5,6,1);}
   return o;
  }
  for(const p of data.placements)fixture(p);
  for(const p of data.workers){const o=add(scene.add.image(p.x,p.y,'slice_coworker_placeholder_'+p.variant).setOrigin(.5,1).setCrop(0,0,48,p.cropHeight));o.sliceId=p.id;o.sliceDepth=p.depthY;o.isCoworkerPlaceholder=true;o.caption=STAGE_PROPS.captions.coworker_placeholder;captions.push(o);items.push(o);}
  // Reusable native structural panels, not an illustrated map texture.
  for(const r of data.walls){const w=r.width,h=r.height+112,key='slice_wall_'+r.axis+'_'+r.width+'_'+r.height;
   if(!scene.textures.exists(key))makeCanvasTex(scene,key,w,h,c=>{c.fillStyle='#171c35';c.fillRect(0,0,w,h);c.fillStyle='#3e7775';c.fillRect(2,3,w-4,h-5);c.fillStyle='#83a89a';c.fillRect(2,3,Math.max(2,w-4),4);c.fillStyle='#f2d7a1';if(r.axis==='x'){c.fillRect(2,8,w-4,5);for(let x=16;x<w;x+=64){c.fillStyle='#303750';c.fillRect(x,30,Math.min(44,w-x-3),42);c.fillStyle='#526078';c.fillRect(x+2,32,Math.min(40,w-x-7),2);}}else c.fillRect(2,8,5,h-12);});
   const o=add(scene.add.image(r.x+w/2,r.y+r.height,key).setOrigin(.5,1));o.sliceId=r.id;o.sliceDepth=o.y;H.body(o,{width:r.width,back:r.height,front:0},'prop_wall');bodies.push(o);items.push(o);
  }
  const gates=[];
  for(const r of data.gates){const key='slice_closed_gate';if(!scene.textures.exists(key))makeCanvasTex(scene,key,128,336,c=>{c.fillStyle='#171c35';c.fillRect(0,0,128,336);c.fillStyle='#303750';c.fillRect(3,3,122,330);c.fillStyle='#3e7775';c.fillRect(8,8,112,320);c.fillStyle='#83a89a';c.fillRect(12,12,4,312);c.fillStyle='#f2d7a1';c.fillRect(40,12,7,312);c.fillStyle='#171c35';c.fillRect(4,166,120,4);});const o=add(scene.add.image(r.x+64,r.y+224,key).setOrigin(.5,1));H.body(o,{width:128,back:224,front:0},'prop_gate');bodies.push(o);items.push(o);o.sliceId=r.id;o.sliceDepth=o.y;const record={...r,object:o,rect:{x:r.x,y:r.y,w:r.width,h:r.height}};gates.push(record);
   sign(scene,'slice_gate_'+r.id,r.id==='parking-access'?'PARKING LOT':'BREAK ROOM',112);const tag=add(scene.add.image(r.x+160,r.y+100,'slice_gate_'+r.id));tag.sliceDepth=r.y+225;items.push(tag);sign(scene,'slice_age45','AGE 45',64);const age=add(scene.add.image(r.x+160,r.y+124,'slice_age45'));age.sliceDepth=r.y+226;items.push(age);
   o.caption=STAGE_PROPS.captions.gate_authorized_only;captions.push(o);
  }
  window.START_AREA_GATES=gates;
  const ownedBlockers=gates.map(g=>g.rect);window.navExtraBlockers=window.navExtraBlockers||[];window.navExtraBlockers.push(...ownedBlockers);
  const p=refs.player;if(refs.clock()<1000||!within(p.x,p.y+p.height/2)){p.setPosition(data.spawn[0],data.spawn[1]-p.height/2);p.body.updateFromGameObject();}
  scene.cameras.main.setBounds(data.bounds.x,data.bounds.y,data.bounds.width,data.bounds.height);
  // Navigation covers a local field. A bounded map also rejects off-floor births
  // beyond that field, without changing the navigation algorithm or spawn timing.
  for(const o of bodies)o.body.updateFromGameObject();
  const spawnCells=[];
  for(const r of data.floors)for(let y=Math.ceil(r.y/64)*64+32;y<r.y+r.height;y+=64)for(let x=Math.ceil(r.x/64)*64+32;x<r.x+r.width;x+=64){
    if(![[x-24,y-24],[x+24,y-24],[x-24,y+24],[x+24,y+24]].every(q=>within(...q)))continue;
    if(bodies.some(o=>{const b=o.body;return x>b.x-24&&x<b.right+24&&y>b.y-24&&y<b.bottom+24;}))continue;
    spawnCells.push([x,y]);
  }
  let repairedSpawns=0;
  function resolveSpawn(x,y){
    if(within(x,y)&&(!window.NAV||NAV.reachable(x,y)))return [x,y];
    const v=scene.cameras.main.worldView;let best=null,fallback=null,score=Infinity,fallbackScore=Infinity;
    for(const q of spawnCells){if(window.NAV&&!NAV.reachable(...q))continue;const distance=(q[0]-p.x)**2+(q[1]-p.y)**2;if(distance<240*240)continue;const d=(q[0]-x)**2+(q[1]-y)**2;
      if(d<fallbackScore){fallback=q;fallbackScore=d;}
      if(q[0]>v.x-24&&q[0]<v.right+24&&q[1]>v.y-24&&q[1]<v.bottom+24)continue;
      if(d<score){best=q;score=d;}
    }
    const q=best||fallback;if(q)repairedSpawns++;return q;
  }
  // Speed (Nov 2): floor-shadow Graphics are redrawn from scratch every frame in WebGL. They never change, so
  // paint all of them once into 1024px tiles covering the map, and show the tiles as plain images instead.
  try{const chunkG=all.filter(e=>e.bounds&&e.o&&e.o.type==='Graphics'&&e.o.active);
   if(chunkG.length&&scene.make.renderTexture){const B=data.bounds,T=1024;let n=0;
    for(let ty=B.y;ty<B.y+B.height;ty+=T)for(let tx=B.x;tx<B.x+B.width;tx+=T){
     const w=Math.min(T,B.x+B.width-tx),h=Math.min(T,B.y+B.height-ty),key='slice_bake_'+(n++);
     if(scene.textures.exists(key))scene.textures.remove(key);
     const rt=scene.make.renderTexture({x:0,y:0,width:w,height:h},false);
     for(const e of chunkG)rt.draw(e.o,-tx,-ty);
     rt.saveTexture(key);
     all.push({o:scene.add.image(tx,ty,key).setOrigin(0).setDepth(chunkG[0].o.depth),bounds:{x:tx,y:ty,width:w,height:h},rt});
    }
    for(const e of chunkG){e.o.destroy();all.splice(all.indexOf(e),1);}
   }}catch(e){}
  const state={data,gates,items,bodies,active:true,visibleProps:0,peakVisibleProps:0,get repairedSpawns(){return repairedSpawns;},resolveSpawn,update,sync,destroy,contains:within};
  function update(){if(!alive)return;const x=p.x,y=p.y+p.height/2;if(!within(x,y)){p.setPosition(...[lastValid[0],lastValid[1]-p.height/2]);p.setVelocity(0,0);p.body.updateFromGameObject();}else lastValid=[x,y];}
  function sync(){if(!alive)return;const v=scene.cameras.main.worldView,cam=scene.cameras.main.id,visible=[];
   for(const o of items){if(!o.active)continue;o.setDepth(10000+(o.sliceDepth??o.y)-p.y);if(o.sliceShadow)o.sliceShadow.setVisible(o.visible);const shown=o.visible&&o.x+o.displayWidth/2>v.x-96&&o.x-o.displayWidth/2<v.right+96&&o.y>v.y-96&&o.y-o.displayHeight<v.bottom+96;o.cameraFilter=shown?0:cam;if(shown)visible.push(o);}
   visible.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));for(const o of visible.slice(data.maxVisibleProps))o.cameraFilter=cam;for(const o of items)if(o.sliceShadow)o.sliceShadow.cameraFilter=o.cameraFilter;state.visibleProps=Math.min(visible.length,data.maxVisibleProps);state.peakVisibleProps=Math.max(state.peakVisibleProps,state.visibleProps);
   for(const {o,bounds:r}of all)if(r)o.cameraFilter=(r.x+r.width>v.x-96&&r.x<v.right+96&&r.y+r.height>v.y-96&&r.y<v.bottom+96)?0:cam;
   const now=refs.clock();if(now-lastMemo>6000&&window.showLowerThird)for(const o of captions){if(!o.visible||seen.has(o.caption))continue;if(Math.abs(o.x-p.x)<110&&Math.abs(o.y-(p.y+p.height/2))<110){seen.add(o.caption);lastMemo=now;window.showLowerThird('lore','MEMO',o.caption,4500);break;}}
  }
  function destroy(){alive=false;window.navExtraBlockers=(window.navExtraBlockers||[]).filter(r=>!ownedBlockers.includes(r));if(window.START_AREA_GATES===gates)window.START_AREA_GATES=[];for(const e of all){if(e.o.active)e.o.destroy();if(e.rt)e.rt.destroy();}}
  return state;
 }
 return {build,contains:within};
})();
