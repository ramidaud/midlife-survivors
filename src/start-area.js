// Authored campus slice: Lobby/Bullpen plus the closed age-45 rooms. No gate opening or navigation code lives here.
window.StartAreaArt = (() => {
 const BASE=-1000000000,CHUNK=512;
 function within(x,y){return START_AREA_LAYOUT.floors.some(r=>x>=r.x&&x<r.x+r.width&&y>=r.y&&y<r.y+r.height);}
 const font={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','4':'101101111001001','5':'111100110001110','0':'111101101101111','Q':'010101101111011','?':'110001010000010'};
 Object.assign(font,{'1':'010110010010111','2':'110001010100111','3':'110001010001110','6':'011100110101010','7':'111001010010010','8':'010101010101010','9':'010101011001110'});
 function sign(scene,key,text,width=128,plate=true,scale=2){if(scene.textures.exists(key))return;const lines=text.split('\n'),h=lines.length*(5*scale+2)+8,t=scene.textures.createCanvas(key,width,h),c=t.getContext();if(plate){c.fillStyle='#171c35';c.fillRect(0,0,width,h);c.fillStyle='#f2d7a1';c.fillRect(1,1,width-2,h-2);}c.fillStyle=plate?'#171c35':'#f2d7a1';lines.forEach((line,row)=>{const x0=Math.floor((width-(line.length*4*scale-scale))/2);[...line].forEach((ch,i)=>{const bits=font[ch]||'000000000000000';for(let n=0;n<15;n++)if(bits[n]==='1')c.fillRect(x0+i*4*scale+n%3*scale,4+row*(5*scale+2)+Math.floor(n/3)*scale,scale,scale);});});t.refresh();t.setFilter(Phaser.Textures.FilterMode.NEAREST);}

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
  for(const name of ['asphalt','kitchen'])if(!scene.textures.exists('slice_'+name))makeCanvasTex(scene,'slice_'+name,64,64,c=>{if(name==='asphalt'){c.fillStyle='#526078';c.fillRect(0,0,64,64);c.fillStyle='#303750';c.globalAlpha=.22;c.fillRect(0,0,64,1);c.fillRect(0,0,1,64);for(let i=0;i<8;i++)c.fillRect((i*19+5)%64,(i*13+7)%64,3,1);}else{c.fillStyle='#d3b78d';c.fillRect(0,0,64,64);c.fillStyle='#a88b70';c.fillRect(0,0,32,32);c.fillRect(32,32,32,32);c.fillStyle='#f2d7a1';c.globalAlpha=.28;c.fillRect(1,1,30,1);c.fillRect(33,33,30,1);c.fillStyle='#3e7775';c.globalAlpha=.18;for(const [x,y]of [[16,16],[48,48]])c.fillRect(x,y,3,3);}c.globalAlpha=1;});
  function layer(x,y){const cx=Math.floor(x/CHUNK),cy=Math.floor(y/CHUNK),key=cx+','+cy;if(!chunks.has(key)){const g=add(scene.add.graphics().setDepth(BASE+3),{x:cx*CHUNK-256,y:cy*CHUNK-256,width:CHUNK+512,height:CHUNK+512});chunks.set(key,g);}return chunks.get(key);}
  for(const r of data.floors){const key=r.material==='vinyl'?'slice_lobby':['asphalt','kitchen'].includes(r.material)?'slice_'+r.material:'env_'+r.material;const t=add(scene.add.tileSprite(r.x,r.y,r.width,r.height,key).setOrigin(0).setDepth(BASE+1),r);t.tilePositionX=r.x;t.tilePositionY=r.y;}
  // Warm light pools and quieter floor stories leave every combat reserve non-solid.
  for(const r of data.floors)for(let x=r.x+64;x<r.x+r.width-96;x+=384){const g=layer(x,r.y+28);g.fillStyle(0xf2d7a1,.07);g.fillRect(x,r.y+28,Math.min(220,r.x+r.width-x-8),Math.min(120,r.height-40));}
  const rug=layer(-96,-160);rug.fillStyle(0x3e7775,.8);rug.fillRect(-432,-280,640,288);rug.fillStyle(0x83a89a,.7);rug.fillRect(-424,-272,624,3);rug.fillRect(-424,-4,624,3);rug.fillStyle(0xf2d7a1,.45);rug.fillRect(-408,-252,32,2);rug.fillRect(152,-32,32,2);
  rug.fillStyle(0x83a89a,.13);for(let y=-248;y<-16;y+=12)for(let x=-400;x<176;x+=24)rug.fillRect(x,y,8,1);
  const queue=layer(-80,-384);queue.fillStyle(0x3e7775,.45);for(let y=-420;y<-312;y+=24){queue.fillRect(-144,y,8,12);queue.fillRect(96,y,8,12);}queue.fillStyle(0x874c3b,.3);for(const [x,y]of [[-220,-344],[-188,-368],[252,-360]]){queue.fillRect(x,y,12,2);queue.fillRect(x,y+8,12,2);queue.fillRect(x-2,y+2,2,6);queue.fillRect(x+12,y+2,2,6);}queue.fillStyle(0xfff0cf,.6);for(let i=0;i<6;i++)queue.fillRect(-220+i*14,-430+(i%3)*12,8,12);
  sign(scene,'slice_welcome','WELCOME',96,false);add(scene.add.image(-112,-130,'slice_welcome').setAlpha(.65).setDepth(BASE+4),{x:-160,y:-140,width:96,height:20});
  for(let n=0;n<90;n++){const x=1450+(n*137%2450),y=-720+(n*83%1390);if(!within(x,y))continue;const g=layer(x,y);g.fillStyle(n%4===0?0xbfa8cf:0xf2d7a1,.52);g.fillRect(x,y,9,12);g.fillStyle(0x526078,.5);g.fillRect(x+2,y+3,5,1);}
  for(const [x,y,w,h]of [[1696,-560,960,24],[3104,-160,760,24],[2200,440,360,16]]){const g=layer(x,y);g.fillStyle(0xf2d7a1,.35);for(let a=0;a<w;a+=64)g.fillRect(x+a,y,32,h/8);}
  // Small repeatable floor stories, authored as data, baked by the existing speed pass below.
  for(const d of data.floorDecor||[]){const {x,y,width:w,height:h}=d,g=add(scene.add.graphics().setDepth(BASE+3),{x:x-4,y:y-4,width:w+8,height:h+8});
   const rect=(a,b,c,e,color=0xf2d7a1,alpha=.5)=>{g.fillStyle(color,alpha);g.fillRect(x+a,y+b,c,e);};
   if(d.kind==='parking-bay'){rect(0,0,2,h);rect(w-2,0,2,h);rect(0,h-2,w,2);}
   if(d.kind==='reserved-bay'){rect(2,2,w-4,h-4,0x3e7775,.2);for(let n=0;n<w;n+=20)rect(n,h-8,10,3);}
   if(d.kind==='road-dashes')for(let n=0;n<w;n+=64)rect(n,6,32,3);
   if(d.kind==='lane-arrow'){const block=(a,b,c,e)=>rect(d.direction==='left'?w-a-c:a,b,c,e,0xf2d7a1,.42);block(8,32,64,16);block(72,16,8,48);block(80,24,8,32);block(88,32,8,16);}
   if(d.kind==='crosswalk')for(let n=0;n<h;n+=40)rect(8,n,w-16,16,0xf2d7a1,.4);
   if(d.kind==='light-pool'){rect(0,0,w,h,0xf2d7a1,.055);rect(32,24,w-64,h-48,0xf2d7a1,.04);}
   if(d.kind==='rug'){g.fillStyle(0x171c35,.28);g.fillPoints([{x:x+8,y},{x:x+w,y:y+8},{x:x+w-8,y:y+h},{x,y:y+h-8}],true);rect(8,8,w-16,h-16,0x3e7775,.7);rect(16,16,w-32,2,0x83a89a,.65);rect(16,h-18,w-32,2,0x83a89a,.65);for(let n=24;n<w-24;n+=48)rect(n,24,16,2,0xf2d7a1,.18);}
   if(['microwave-queue','staff-tape'].includes(d.kind))for(let n=8;n<h-8;n+=24){rect(8,n,4,12,0x83a89a,.65);rect(w-12,n,4,12,0x83a89a,.65);}
   if(['mess','confetti'].includes(d.kind)){let seed=d.seed||45;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};for(let n=0;n<d.count;n++){const a=Math.floor(random()*(w-16))+4,b=Math.floor(random()*(h-16))+4;if(!within(x+a,y+b))continue;if(d.kind==='confetti'){rect(a,b,2,3,[0xf2d7a1,0xbfa8cf,0x83a89a,0xc45c4b][n%4],.5);}else if(n%7===0){rect(a,b,12,2,0x874c3b,.25);rect(a,b+8,12,2,0x874c3b,.25);rect(a-2,b+2,2,6,0x874c3b,.25);rect(a+12,b+2,2,6,0x874c3b,.25);}else{rect(a,b,6,8,n%3===0?0xbfa8cf:0xfff0cf,.5);rect(a+1,b+3,4,1,0x526078,.45);}}}
  }
  for(const r of data.structures||[]){const w=r.width,h=r.height+12,key='slice_curb_'+w+'_'+h;if(!scene.textures.exists(key))makeCanvasTex(scene,key,w,h,c=>{c.fillStyle='#171c35';c.fillRect(0,8,w,h-8);c.fillStyle='#f2d7a1';c.fillRect(2,8,w-4,h-12);c.fillStyle='#3e7775';c.fillRect(8,12,w-16,h-24);c.fillStyle='#83a89a';c.fillRect(8,12,w-16,2);});const o=add(scene.add.image(r.x+w/2,r.y+r.height,key).setOrigin(.5,1));o.sliceId=r.id;o.sliceDepth=o.y;H.body(o,{width:w,back:r.height,front:0},'prop_wall');bodies.push(o);items.push(o);OfficeEnvironment.groundObject(scene,layer(o.x,o.y),key,o.x,o.y,'prop');}
  function fixture(p){const a=START_AREA_IMAGES[p.prop],key='slice_'+p.prop+'_'+(p.variant||0),o=add(scene.add.image(p.x,p.y,key).setOrigin(.5,1));o.sliceId=p.id;o.sliceDepth=p.depthY??p.y;o.sliceMeta=p;
   const solid=p.solid!==false&&a.solid;
   if(solid){H.body(o,a.footprint,p.prop==='plant'?'prop_plant':'prop_desk');bodies.push(o);o.cellKey='start:'+p.id;}
   items.push(o);const cap=p.caption??(window.STAGE_PROPS&&STAGE_PROPS.captions[p.prop]||a.caption);if(cap){o.caption=cap;o.sliceReadAt=p.readAt;captions.push(o);}
   if(solid){const g=p.prop==='plant'?add(scene.add.graphics().setDepth(BASE+3)):layer(p.x,p.y);OfficeEnvironment.groundObject(scene,g,key,p.x,p.y,p.prop.startsWith('desk_')?'desk':'prop');if(p.prop==='plant')o.sliceShadow=g;}
   if(p.prop.startsWith('desk_')){const g=layer(p.x,p.y);g.fillStyle(0x303750,.28);g.fillRect(p.x-42,p.y-30,76,40);g.fillStyle(0x83a89a,.18);g.fillRect(p.x-40,p.y-29,70,1);g.fillStyle(0x171c35,.3);g.fillRect(p.x+41,p.y-24,1,20);g.fillRect(p.x+36,p.y-5,6,1);}
   return o;
  }
  for(const p of data.placements)fixture(p);
  for(const r of data.labels||[]){const key='slice_label_'+r.id;sign(scene,key,r.text,r.width,r.plate!==false,r.scale||2);const o=add(scene.add.image(r.x,r.y,key).setOrigin(.5,1).setAlpha(r.alpha??1),r.floor?{x:r.x-r.width/2,y:r.y-40,width:r.width,height:40}:null);if(r.floor)o.setDepth(BASE+4);else{o.sliceDepth=r.depthY??r.y;items.push(o);}if(r.caption){o.caption=r.caption;o.sliceReadAt=r.readAt;captions.push(o);}}

  for(const p of data.workers){const o=add(scene.add.image(p.x,p.y,'slice_coworker_placeholder_'+p.variant).setOrigin(.5,1).setCrop(0,0,48,p.cropHeight));o.sliceId=p.id;o.sliceDepth=p.depthY;o.isCoworkerPlaceholder=true;o.caption=STAGE_PROPS.captions.coworker_placeholder;captions.push(o);items.push(o);}
  // Reusable native structural panels, not an illustrated map texture.
  for(const r of data.walls){const w=r.width,h=r.height+(r.style==='parking'?48:112),key='slice_wall_'+(r.style||'office')+'_'+r.axis+'_'+r.width+'_'+r.height;
   if(!scene.textures.exists(key))makeCanvasTex(scene,key,w,h,c=>{c.fillStyle='#171c35';c.fillRect(0,0,w,h);c.fillStyle=r.style==='kitchen'?'#d3b78d':r.style==='parking'?'#303750':'#3e7775';c.fillRect(2,3,w-4,h-5);c.fillStyle=r.style==='parking'?'#526078':'#83a89a';c.fillRect(2,3,Math.max(2,w-4),4);c.fillStyle='#f2d7a1';if(r.axis==='x'){c.fillRect(2,8,w-4,5);for(let x=16;x<w;x+=64){c.fillStyle='#303750';c.fillRect(x,30,Math.min(44,w-x-3),42);c.fillStyle='#526078';c.fillRect(x+2,32,Math.min(40,w-x-7),2);}}else c.fillRect(2,8,5,h-12);});
   const o=add(scene.add.image(r.x+w/2,r.y+r.height,key).setOrigin(.5,1));o.sliceId=r.id;o.sliceDepth=o.y;H.body(o,{width:r.width,back:r.height,front:0},'prop_wall');bodies.push(o);items.push(o);
  }
  const gates=[];
  for(const r of data.gates){const key='slice_closed_gate';if(!scene.textures.exists(key))makeCanvasTex(scene,key,128,336,c=>{c.fillStyle='#171c35';c.fillRect(0,0,128,336);c.fillStyle='#303750';c.fillRect(3,3,122,330);c.fillStyle='#3e7775';c.fillRect(8,8,112,320);c.fillStyle='#83a89a';c.fillRect(12,12,4,312);c.fillStyle='#f2d7a1';c.fillRect(40,12,7,312);c.fillStyle='#171c35';c.fillRect(4,166,120,4);});const o=add(scene.add.image(r.x+64,r.y+224,key).setOrigin(.5,1));H.body(o,{width:128,back:224,front:0},'prop_gate');bodies.push(o);items.push(o);o.sliceId=r.id;o.sliceDepth=o.y;const record={...r,object:o,rect:{x:r.x,y:r.y,w:r.width,h:r.height}};gates.push(record);
   sign(scene,'slice_gate_'+r.id,r.sign||r.name.toUpperCase(),112);const tag=add(scene.add.image(r.x+64,r.y-68,'slice_gate_'+r.id));tag.sliceDepth=r.y+225;items.push(tag);sign(scene,'slice_age_'+r.age,'AGE '+r.age,64);const age=add(scene.add.image(r.x+64,r.y-44,'slice_age_'+r.age));age.sliceDepth=r.y+226;items.push(age);
   o.caption=r.age===45?STAGE_PROPS.captions.gate_parking_break:(r.id==='server-return'?'SERVER ROOM. Access at fifty. Bring a sweater and a reason.':'CONFERENCE ROOMS. Access at fifty. You have been invited to the invitation.');o.sliceReadAt=[r.x+r.width/2,r.y+r.height/2];captions.push(o);
  }
  window.START_AREA_GATES=gates;
  const ownedBlockers=gates.map(g=>g.rect);window.navExtraBlockers=window.navExtraBlockers||[];window.navExtraBlockers.push(...ownedBlockers);
  const p=refs.player;if(refs.clock()<1000||!within(p.x,p.y+p.height/2)){p.setPosition(data.spawn[0],data.spawn[1]-p.height/2);p.body.updateFromGameObject();}
  scene.cameras.main.setBounds(data.bounds.x,data.bounds.y,data.bounds.width,data.bounds.height);
  // Navigation covers a local field. A bounded map also rejects off-floor births
  // beyond that field, without changing the navigation algorithm or spawn timing.
  for(const o of bodies)o.body.updateFromGameObject();
  let spawnPadding=26;
  for(const [kind,e]of Object.entries(window.ENEMIES||{})){const key=e.tex||kind;if(!scene.textures.exists(key))continue;const f=scene.textures.getFrame(key),boss=(window.BOSS_KINDS||[]).includes(kind),hitScale=boss?(window.ENEMY_SCALE?.bossHitbox||1):1;spawnPadding=Math.max(spawnPadding,Math.ceil(Math.max(f.width,f.height)*(e.scale||1)*hitScale/2)+2);}
  function fitsSpawn(x,y){return [[x-spawnPadding,y-spawnPadding],[x+spawnPadding,y-spawnPadding],[x-spawnPadding,y+spawnPadding],[x+spawnPadding,y+spawnPadding]].every(q=>within(...q))&&!bodies.some(o=>{const b=o.body;return o.active&&b&&b.enable&&x>b.x-spawnPadding&&x<b.right+spawnPadding&&y>b.y-spawnPadding&&y<b.bottom+spawnPadding;});}
  const spawnCells=[],spawnKeys=new Set();
  for(const r of data.floors)for(let y=Math.ceil(r.y/64)*64+32;y<r.y+r.height;y+=64)for(let x=Math.ceil(r.x/64)*64+32;x<r.x+r.width;x+=64){
    if(!fitsSpawn(x,y))continue;
    const key=x+','+y;if(!spawnKeys.has(key)){spawnKeys.add(key);spawnCells.push([x,y]);}
  }
  // NAV.reachable deliberately accepts positions outside its local field. A bounded
  // campus must only accept candidates the current field can actually verify.
  function reachableSpawn(x,y){if(!window.NAV)return true;const reach=(NAV.radius-2)*NAV.cell;return Math.abs(x-p.x)<reach&&Math.abs(y-p.y)<reach&&NAV.reachable(x,y);}
  let repairedSpawns=0;
  function resolveSpawn(x,y){
    if(fitsSpawn(x,y)&&reachableSpawn(x,y))return [x,y];
    const v=scene.cameras.main.worldView;let best=null,fallback=null,score=Infinity,fallbackScore=Infinity;
    for(const q of spawnCells){if(!reachableSpawn(...q))continue;const distance=(q[0]-p.x)**2+(q[1]-p.y)**2;if(distance<240*240)continue;const d=(q[0]-x)**2+(q[1]-y)**2;
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
     if(!data.floors.some(r=>r.x+r.width>tx&&r.x<tx+w&&r.y+r.height>ty&&r.y<ty+h))continue;
     if(scene.textures.exists(key))scene.textures.remove(key);
     const rt=scene.make.renderTexture({x:0,y:0,width:w,height:h},false);
     for(const e of chunkG){const r=e.bounds;if(r.x+r.width>tx&&r.x<tx+w&&r.y+r.height>ty&&r.y<ty+h)rt.draw(e.o,-tx,-ty);}
     rt.saveTexture(key);
     all.push({o:scene.add.image(tx,ty,key).setOrigin(0).setDepth(chunkG[0].o.depth),bounds:{x:tx,y:ty,width:w,height:h},rt});
    }
    for(const e of chunkG){e.o.destroy();all.splice(all.indexOf(e),1);}
   }}catch(e){}
  const state={data,gates,items,bodies,active:true,visibleProps:0,peakVisibleProps:0,spawnPadding,get repairedSpawns(){return repairedSpawns;},resolveSpawn,update,sync,destroy,contains:within};
  function update(){if(!alive)return;const x=p.x,y=p.y+p.height/2;if(!within(x,y)){p.setPosition(...[lastValid[0],lastValid[1]-p.height/2]);p.setVelocity(0,0);p.body.updateFromGameObject();}else lastValid=[x,y];}
  function sync(){if(!alive)return;const v=scene.cameras.main.worldView,cam=scene.cameras.main.id,visible=[];
   for(const o of items){if(!o.active)continue;o.setDepth(10000+(o.sliceDepth??o.y)-p.y);if(o.sliceShadow)o.sliceShadow.setVisible(o.visible);const shown=o.visible&&o.x+o.displayWidth/2>v.x-96&&o.x-o.displayWidth/2<v.right+96&&o.y>v.y-96&&o.y-o.displayHeight<v.bottom+96;o.cameraFilter=shown?0:cam;if(shown)visible.push(o);}
   visible.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));for(const o of visible.slice(data.maxVisibleProps))o.cameraFilter=cam;for(const o of items)if(o.sliceShadow)o.sliceShadow.cameraFilter=o.cameraFilter;state.visibleProps=Math.min(visible.length,data.maxVisibleProps);state.peakVisibleProps=Math.max(state.peakVisibleProps,state.visibleProps);
   for(const {o,bounds:r}of all)if(r)o.cameraFilter=(r.x+r.width>v.x-96&&r.x<v.right+96&&r.y+r.height>v.y-96&&r.y<v.bottom+96)?0:cam;
   const now=refs.clock();if(now-lastMemo>6000&&window.showLowerThird)for(const o of captions){if(!o.visible||seen.has(o.caption))continue;if(Math.abs((o.sliceReadAt?.[0]??o.x)-p.x)<110&&Math.abs((o.sliceReadAt?.[1]??o.y)-(p.y+p.height/2))<110){seen.add(o.caption);lastMemo=now;window.showLowerThird('lore','MEMO',o.caption,4500);break;}}
  }
  function destroy(){alive=false;window.navExtraBlockers=(window.navExtraBlockers||[]).filter(r=>!ownedBlockers.includes(r));if(window.START_AREA_GATES===gates)window.START_AREA_GATES=[];for(const e of all){if(e.o.active)e.o.destroy();if(e.rt)e.rt.destroy();}}
  return state;
 }
 return {build,contains:within};
})();
