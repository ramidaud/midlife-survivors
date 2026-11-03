// Authored campus slice: eight districts through the closed age-60 Wellness Corner. No gate opening or navigation code lives here.
window.StartAreaArt = (() => {
 const BASE=-1000000000,CHUNK=512;
 function within(x,y){return START_AREA_LAYOUT.floors.some(r=>x>=r.x&&x<r.x+r.width&&y>=r.y&&y<r.y+r.height);}
 const font={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','4':'101101111001001','5':'111100110001110','0':'111101101101111','Q':'010101101111011','?':'110001010000010'};
 Object.assign(font,{'1':'010110010010111','2':'110001010100111','3':'110001010001110','6':'011100110101010','7':'111001010010010','8':'010101010101010','9':'010101011001110'});
 function sign(scene,key,text,width=128,plate=true,scale=2){if(scene.textures.exists(key))return;const lines=text.split('\n'),h=lines.length*(5*scale+2)+8,t=scene.textures.createCanvas(key,width,h),c=t.getContext();if(plate){c.fillStyle='#171c35';c.fillRect(0,0,width,h);c.fillStyle='#f2d7a1';c.fillRect(1,1,width-2,h-2);}c.fillStyle=plate?'#171c35':'#f2d7a1';lines.forEach((line,row)=>{const x0=Math.floor((width-(line.length*4*scale-scale))/2);[...line].forEach((ch,i)=>{const bits=font[ch]||'000000000000000';for(let n=0;n<15;n++)if(bits[n]==='1')c.fillRect(x0+i*4*scale+n%3*scale,4+row*(5*scale+2)+Math.floor(n/3)*scale,scale,scale);});});t.refresh();t.setFilter(Phaser.Textures.FilterMode.NEAREST);}

 const WORKER_WIDTH=48, WORKER_HEIGHT=56, WORKER_POSES=4;
 const NOTICE_RADIUS=120, NOTICE_COOLDOWN=6000;

 async function loadCoworkers(scene,H){
  const cast=window.START_AREA_COWORKERS||{};
  for(const [id,art] of Object.entries(cast)){
   const key='slice_coworker_'+id;
   if(scene.textures.exists(key))continue;
   try{
    const image=await H.image(art.src);
    if(!H.isAlive())return {};
    const width=WORKER_WIDTH*WORKER_POSES, height=WORKER_HEIGHT*4;
    if(image.width!==width||image.height!==height)throw new Error('Invalid coworker sheet size');
    H.propTexture(scene,image,key,width,height);
    const texture=scene.textures.get(key);
    for(let row=0;row<4;row++)for(let col=0;col<WORKER_POSES;col++){
     texture.add(row*WORKER_POSES+col,0,col*WORKER_WIDTH,row*WORKER_HEIGHT,WORKER_WIDTH,WORKER_HEIGHT);
    }
   }catch(error){
    console.warn('Coworker art fallback for '+id+': '+error.message);
   }
  }
  return cast;
 }

 function updateCoworkers(workers,now,x,y){
  for(const worker of workers){
   const o=worker.object;
   if(!o.active||o.cameraFilter){
    worker.near=false;
    continue;
   }
   const dx=x-o.x,dy=y-o.y;
   const near=dx*dx+dy*dy<=NOTICE_RADIUS*NOTICE_RADIUS;
   if(near&&!worker.near&&now-worker.noticedAt>=NOTICE_COOLDOWN)worker.noticedAt=now;
   worker.near=near;
   const reactionPose=Math.floor((now-worker.noticedAt)/worker.art.reactionMs);
   const pose=reactionPose<WORKER_POSES
    ? WORKER_POSES+reactionPose
    : Math.floor((now+worker.phase)/worker.art.idleMs)%WORKER_POSES;
   const frame=worker.firstFrame+pose;
   if(o.frame.name!==frame)o.setFrame(frame);
  }
 }

 function officePersonTexture(scene,castId,seated){
  const sourceKey='slice_coworker_'+castId;
  if(!scene.textures.exists(sourceKey))return null;
  const key=sourceKey+(seated?'_seat':'_stand');
  if(scene.textures.exists(key))return key;
  const source=scene.textures.get(sourceKey).getSourceImage(), w=56, h=60;
  makeCanvasTex(scene,key,w*4,h*4,c=>{
   c.imageSmoothingEnabled=false;
   const paint=(color,x,y,width,height)=>{c.fillStyle=color;c.fillRect(x,y,width,height);};
   for(let frame=0;frame<16;frame++){
    const x=frame%4*w, y=Math.floor(frame/4)*h;
    c.save();c.translate(x,y);
    const step=seated?0:frame%2===0?-3:3;
    const thigh=seated?41:38;
    paint('#171c35',20,thigh,17,11);
    paint('#526078',21,thigh+1,15,8);
    paint('#171c35',20+step,thigh+7,8,60-thigh-7);
    paint('#171c35',29-step,thigh+7,8,60-thigh-7);
    paint('#303750',21+step,thigh+7,6,58-thigh-7);
    paint('#526078',30-step,thigh+7,6,58-thigh-7);
    paint('#a88b70',19+step,56,9,3);
    paint('#a88b70',30-step,56,9,3);
    c.drawImage(source,frame%4*48,Math.floor(frame/4)*56,48,34,1,8,54,seated?39:36);
    if(!seated&&castId==='intern'){
     paint('#171c35',38,19,5,11);paint('#526078',39,20,3,8);
     paint('#83a89a',40,21,2,2);paint('#e5a995',37,26,4,4);
    }
    if(!seated&&castId==='email'){
     const reach=frame%4<2?0:3;
     paint('#171c35',32+reach,34,14,10);paint('#fff0cf',33+reach,35,12,8);
     paint('#a88b70',35+reach,37,7,1);paint('#a88b70',35+reach,40,8,1);
    }
    c.restore();
   }
  });
  const texture=scene.textures.get(key);
  texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  for(let frame=0;frame<16;frame++)texture.add(frame,0,frame%4*w,Math.floor(frame/4)*h,w,h);
  return key;
 }

 function updateStanding(scenes,now){
  for(const {object:o,art,scene:person} of scenes){
   if(!o.active)continue;
   if(person.walk){
    const [[ax,ay],[bx,by]]=person.walk;
    const length=Math.hypot(bx-ax,by-ay);
    const t=((now+person.phase)/1000*person.speed/length)%2;
    const along=t<=1?t:2-t;
    o.setPosition(ax+(bx-ax)*along,ay+(by-ay)*along);
    o.sliceDepth=o.y;
    o.setFlipX(t>1);
   }
   if(o.cameraFilter)continue;
   const frame=Math.floor((now+person.phase)/(person.walk?180:art.idleMs))%WORKER_POSES;
   if(o.frame.name!==frame)o.setFrame(frame);
  }
 }

 async function build(scene,refs,H){
  const data=START_AREA_LAYOUT,all=[],bodies=[],chunks=new Map(),items=[],captions=[],blinkLights=[],animatedWorkers=[],standingPeople=[],seen=new Set();let alive=true,lastMemo=-1e9,lastValid=data.spawn.slice();
  const add=(o,bounds=null)=>{all.push({o,bounds});return o;};
  // Decode everything before replacing the fallback office.
  for(const [id,a]of Object.entries(START_AREA_IMAGES)){
   const img=await H.image(a.src);if(!H.isAlive())return null;
   for(let v=0;v<a.variants;v++){const c=document.createElement('canvas');c.width=a.frame[0];c.height=a.frame[1];c.getContext('2d').drawImage(img,v*c.width,0,c.width,c.height,0,0,c.width,c.height);H.propTexture(scene,c,'slice_'+id+'_'+v,...a.frame);}
  }
  const decor=window.FINISH_DECOR||{};
  for(const [id,a] of Object.entries(decor)){
   if(scene.textures.exists('finish_'+id))continue;
   const img=await H.image(a.src);if(!H.isAlive())return null;
   const c=document.createElement('canvas');[c.width,c.height]=a.frame;c.getContext('2d').drawImage(img,0,0);
   H.propTexture(scene,c,'finish_'+id,...a.frame);
  }
  const cast=await loadCoworkers(scene,H);
  if(!H.isAlive())return null;
  // Repeat native pixels through the center and edges; keep the authored corners intact.
  function floorPatch(id,x,y,w,h,alpha=1,depth=BASE+2){
   if(!decor[id]||w<64||h<64)return;
   const key='finish_patch_'+id+'_'+w+'_'+h;
   if(!scene.textures.exists(key)){
    const source=scene.textures.get('finish_'+id).getSourceImage();
    const spans=n=>{const a=[[0,0,32]];for(let i=32;i<n-32;i+=32)a.push([32,i,Math.min(32,n-32-i)]);a.push([64,n-32,32]);return a;};
    makeCanvasTex(scene,key,w,h,c=>{c.imageSmoothingEnabled=false;for(const [sx,dx,sw] of spans(w))for(const [sy,dy,sh] of spans(h))c.drawImage(source,sx,sy,sw,sh,dx,dy,sw,sh);});
   }
   const o=add(scene.add.image(x,y,key).setOrigin(0).setAlpha(alpha).setDepth(depth),{x,y,width:w,height:h});o.sliceBakeFloor=true;
  }
  OfficeEnvironment.createTiles(scene);
  if(!scene.textures.exists('slice_void'))makeCanvasTex(scene,'slice_void',64,64,c=>{c.fillStyle='#171c35';c.fillRect(0,0,64,64);});
  if(!scene.textures.exists('slice_lobby'))makeCanvasTex(scene,'slice_lobby',64,64,c=>{c.fillStyle='#d3b78d';c.fillRect(0,0,64,64);c.fillStyle='#a88b70';c.fillRect(1,31,62,1);c.fillRect(31,1,1,62);c.fillStyle='#f2d7a1';c.globalAlpha=.2;c.fillRect(2,2,28,1);c.fillRect(34,34,28,1);c.globalAlpha=1;});
  for(const name of ['asphalt','kitchen'])if(!scene.textures.exists('slice_'+name))makeCanvasTex(scene,'slice_'+name,64,64,c=>{if(name==='asphalt'){c.fillStyle='#526078';c.fillRect(0,0,64,64);c.fillStyle='#303750';c.globalAlpha=.22;c.fillRect(0,0,64,1);c.fillRect(0,0,1,64);for(let i=0;i<8;i++)c.fillRect((i*19+5)%64,(i*13+7)%64,3,1);}else{c.fillStyle='#d3b78d';c.fillRect(0,0,64,64);c.fillStyle='#a88b70';c.fillRect(0,0,32,32);c.fillRect(32,32,32,32);c.fillStyle='#f2d7a1';c.globalAlpha=.28;c.fillRect(1,1,30,1);c.fillRect(33,33,30,1);c.fillStyle='#3e7775';c.globalAlpha=.18;for(const [x,y]of [[16,16],[48,48]])c.fillRect(x,y,3,3);}c.globalAlpha=1;});
  for(const name of ['server','conference'])if(!scene.textures.exists('slice_'+name))makeCanvasTex(scene,'slice_'+name,64,64,c=>{c.fillStyle=name==='server'?'#303750':'#3e7775';c.fillRect(0,0,64,64);c.fillStyle='#526078';if(name==='server'){c.fillRect(0,0,64,2);c.fillRect(0,0,2,64);for(const [x,y]of [[5,5],[57,57]])c.fillRect(x,y,2,2);}else{c.globalAlpha=.28;c.fillRect(0,0,32,32);c.fillRect(32,32,32,32);c.globalAlpha=1;c.fillStyle='#83a89a';for(let y=4;y<64;y+=8)c.fillRect((y*3)%64,y,3,1);}});
  if(!scene.textures.exists('slice_executive'))makeCanvasTex(scene,'slice_executive',64,64,c=>{c.fillStyle='#303750';c.fillRect(0,0,64,64);c.fillStyle='#526078';c.globalAlpha=.28;for(let y=4;y<64;y+=8)for(let x=4;x<64;x+=8)c.fillRect(x+(y%16?2:0),y,3,1);c.globalAlpha=1;c.fillStyle='#3e7775';c.fillRect(0,31,64,1);});
  if(!scene.textures.exists('slice_wellness'))makeCanvasTex(scene,'slice_wellness',64,64,c=>{c.fillStyle='#d3b78d';c.fillRect(0,0,64,64);for(let y=2;y<64;y+=8)for(let x=2;x<64;x+=8){c.fillStyle=(x+y)%16?'#a88b70':'#f2d7a1';c.globalAlpha=.35;c.fillRect((x+(y%16?3:0))%64,y,2,1);}c.globalAlpha=1;});
  function layer(x,y){const cx=Math.floor(x/CHUNK),cy=Math.floor(y/CHUNK),key=cx+','+cy;if(!chunks.has(key)){const g=add(scene.add.graphics().setDepth(BASE+3),{x:cx*CHUNK-256,y:cy*CHUNK-256,width:CHUNK+512,height:CHUNK+512});chunks.set(key,g);}return chunks.get(key);}
  for(const r of data.floors){const key=r.material==='vinyl'?(decor.vinyl_muted?'finish_vinyl_muted':'slice_lobby'):r.material==='carpet'&&r.district==='bullpen'&&decor.carpet_muted?'finish_carpet_muted':['asphalt','kitchen','server','conference','executive','wellness'].includes(r.material)?'slice_'+r.material:'env_'+r.material;const t=add(scene.add.tileSprite(r.x,r.y,r.width,r.height,key).setOrigin(0).setDepth(BASE+1),r);t.tilePositionX=r.x;t.tilePositionY=r.y;}
  // Later rooms retain their original pool stamps. The Courtyard uses baked tread and window shapes.
  for(const r of data.floors){
   if(r.district==='lobby'||r.district==='bullpen')continue;
   for(let x=r.x+64;x<r.x+r.width-96;x+=384)floorPatch(r.material==='server'?'light_cool':'light_warm',x,r.y+28,Math.min(220,r.x+r.width-x-8),Math.min(120,r.height-40),.11);
  }
  for(const [x,y,w,h] of data.officeLoop?.bands||[]){
   const g=add(scene.add.graphics().setDepth(BASE+2),{x,y,width:w,height:h});
   g.fillStyle(x<1312?0xd3b78d:0x788087,.40);g.fillRect(x,y,w,h);
   g.fillStyle(0xf2d7a1,.14);
   for(let dy=6;dy<h;dy+=24)for(let dx=4+(dy%5)*3;dx<w-12;dx+=36)g.fillRect(x+dx,y+dy,8+(dx%13),1);
   g.fillStyle(0x303750,.14);
   for(let dx=16;dx<w-10;dx+=64)g.fillRect(x+dx,y,1,h);
  }
  // Small repeatable floor stories, authored as data, baked by the existing speed pass below.
  for(const d of data.floorDecor||[]){const {x,y,width:w,height:h}=d;
   if(d.kind==='welcome-rug'){floorPatch('rug_teal',x,y,w,h,.93,BASE+3);continue;}
   if(d.kind==='team-rug'||d.kind==='window-shape'){
    const g=add(scene.add.graphics().setDepth(d.kind==='team-rug'?BASE+1.5:BASE+3),{x,y,width:w,height:h});
    if(d.kind==='team-rug'){
     g.fillStyle(0x171c35,.75);g.fillRect(x,y,w,h);
     g.fillStyle(d.color,.95);g.fillRect(x+2,y+2,w-4,h-4);
     g.fillStyle(0xfff0cf,.15);g.fillRect(x+6,y+6,w-12,2);g.fillRect(x+6,y+h-8,w-12,2);
     for(let dy=11;dy<h-7;dy+=8)for(let dx=6+(dy%3)*3;dx<w-8;dx+=16)g.fillRect(x+dx,y+dy,4,1);
     g.fillStyle(0x171c35,.16);
     for(let dx=64;dx<w-4;dx+=64)g.fillRect(x+dx,y+8,1,h-16);
     for(let dy=64;dy<h-4;dy+=64)g.fillRect(x+8,y+dy,w-16,1);
     g.fillStyle(0xfff0cf,.22);
     for(let dx=10;dx<w-12;dx+=9){g.fillRect(x+dx,y+3,4,1);g.fillRect(x+dx,y+h-4,4,1);}
    }else{
     g.fillStyle(0xffd9a0,.17);
     for(let row=0;row<4;row++)for(let col=0;col<4;col++){
      const left=col*(w/4-6)+row*8;
      g.fillRect(x+left,y+row*h/4,w/4-11,h/4-4);
     }
    }
    continue;
   }
   const patch={rug:'rug_sage','wellness-island':'rug_lavender','light-pool':'light_warm','server-light':'light_cool'}[d.kind];
   if(patch){const light=patch.startsWith('light');floorPatch(patch,x,y,w,h,light ? .13 : .72,light?BASE+2:BASE+3);continue;}
   const g=add(scene.add.graphics().setDepth(BASE+3),{x:x-4,y:y-4,width:w+8,height:h+8});
   const rect=(a,b,c,e,color=0xf2d7a1,alpha=.5)=>{g.fillStyle(color,alpha);g.fillRect(x+a,y+b,c,e);};
   if(d.kind==='office-scuffs'){
    for(let i=0;i<7;i++){rect(3+i*14,8+i%3*4,8,1,0x171c35,.15);rect(8+i*14,11+i%3*4,5,1,0xf2d7a1,.12);}
    rect(36,35,10,2,0xa88b70,.4);rect(34,37,2,5,0xa88b70,.4);rect(46,37,2,5,0xa88b70,.4);
   }
   if(d.kind==='cable-cover'){rect(0,0,w,h,0x171c35,.7);rect(1,1,w-2,2,0x526078,.8);for(let n=8;n<(w>h?w:h);n+=32)rect(w>h?n:3,w>h?3:n,w>h?4:Math.max(2,w-6),w>h?Math.max(2,h-6):4,0x83a89a,.45);}
   if(d.kind==='circuit-tape')for(let n=0;n<w;n+=48)rect(n,2,24,3,0x83a89a,.5);
   if(d.kind==='parking-bay'){rect(0,0,2,h);rect(w-2,0,2,h);rect(0,h-2,w,2);}
   if(d.kind==='reserved-bay'){rect(2,2,w-4,h-4,0x3e7775,.2);for(let n=0;n<w;n+=20)rect(n,h-8,10,3);}
   if(d.kind==='road-dashes')for(let n=0;n<w;n+=64)rect(n,6,32,3);
   if(d.kind==='lane-arrow'){const block=(a,b,c,e)=>rect(d.direction==='left'?w-a-c:a,b,c,e,0xf2d7a1,.42);block(8,32,64,16);block(72,16,8,48);block(80,24,8,32);block(88,32,8,16);}
   if(d.kind==='crosswalk')for(let n=0;n<h;n+=40)rect(8,n,w-16,16,0xf2d7a1,.4);
   if(['microwave-queue','staff-tape'].includes(d.kind))for(let n=8;n<h-8;n+=24){rect(8,n,4,12,0x83a89a,.65);rect(w-12,n,4,12,0x83a89a,.65);}
   if(['mess','confetti'].includes(d.kind)){let seed=d.seed||45;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};for(let n=0;n<d.count;n++){const a=Math.floor(random()*(w-16))+4,b=Math.floor(random()*(h-16))+4;if(!within(x+a,y+b))continue;if(d.kind==='confetti'){rect(a,b,2,3,[0xf2d7a1,0xbfa8cf,0x83a89a,0xc45c4b][n%4],.5);}else if(n%7===0){rect(a,b,12,2,0x874c3b,.25);rect(a,b+8,12,2,0x874c3b,.25);rect(a-2,b+2,2,6,0x874c3b,.25);rect(a+12,b+2,2,6,0x874c3b,.25);}else{rect(a,b,6,8,n%3===0?0xbfa8cf:0xfff0cf,.5);rect(a+1,b+3,4,1,0x526078,.45);}}}
  }
  for(const r of data.structures||[]){const w=r.width,h=r.height+12,key='slice_curb_'+w+'_'+h;if(!scene.textures.exists(key))makeCanvasTex(scene,key,w,h,c=>{c.fillStyle='#171c35';c.fillRect(0,8,w,h-8);c.fillStyle='#f2d7a1';c.fillRect(2,8,w-4,h-12);c.fillStyle='#3e7775';c.fillRect(8,12,w-16,h-24);c.fillStyle='#83a89a';c.fillRect(8,12,w-16,2);});const o=add(scene.add.image(r.x+w/2,r.y+r.height,key).setOrigin(.5,1));o.sliceId=r.id;o.sliceDepth=o.y;H.body(o,{width:w,back:r.height,front:0},'prop_wall');bodies.push(o);items.push(o);OfficeEnvironment.groundObject(scene,layer(o.x,o.y),key,o.x,o.y,'prop');}
  function fixture(p){const a=START_AREA_IMAGES[p.prop],key='slice_'+p.prop+'_'+(p.variant||0),o=add(scene.add.image(p.x,p.y,key).setOrigin(.5,1));o.sliceId=p.id;o.sliceDepth=p.depthY??p.y;o.sliceMeta=p;
   if(['wellness_yoga_mat','paper_drift'].includes(p.prop)){o.sliceBakeFloor=true;o.setDepth(BASE+4).setAlpha(p.alpha??1);all[all.length-1].bounds={x:p.x-a.frame[0]/2,y:p.y-a.frame[1],width:a.frame[0],height:a.frame[1]};}
   if(p.prop==='server_crash_cart')o.sliceMeta={...p,prop:'crash_cart',artProp:p.prop};
   const solid=p.solid!==false&&a.solid;
   if(solid){H.body(o,a.footprint,p.prop==='plant'?'prop_plant':'prop_desk');bodies.push(o);o.cellKey='start:'+p.id;}
   items.push(o);const cap=p.caption??(window.STAGE_PROPS&&STAGE_PROPS.captions[p.prop]||a.caption);if(cap){o.caption=cap;o.sliceReadAt=p.readAt;captions.push(o);}
   if(solid){const g=p.prop==='plant'?add(scene.add.graphics().setDepth(BASE+3)):layer(p.x,p.y);OfficeEnvironment.groundObject(scene,g,key,p.x,p.y,p.prop.startsWith('desk_')?'desk':'prop');if(p.prop==='plant')o.sliceShadow=g;}
   if(p.prop.startsWith('desk_'))floorPatch('chair_mat',p.x-44,p.y-42,88,64,.76);
   if(p.blink){const key='slice_rack_leds';if(!scene.textures.exists(key))makeCanvasTex(scene,key,3,44,c=>{c.fillStyle='#83a89a';for(let y=0;y<44;y+=10)c.fillRect(0,y,2,2);});const light=add(scene.add.image(p.x+8,p.y-65,key).setOrigin(.5,1));light.sliceDepth=p.y+1;items.push(light);blinkLights.push({light,seed:blinkLights.length});}
   return o;
  }
  // Draw the approved Courtyard kit once. Depth stays live so the hero can pass behind it.
  function officePiece(id,x,y,w,h,paint,footprint,depthY=y+h){
   const key='loop_'+id;
   if(!scene.textures.exists(key))makeCanvasTex(scene,key,w,h,paint);
   const o=add(scene.add.image(x+w/2,y+h,key).setOrigin(.5,1));
   o.sliceId=id;
   o.sliceDepth=depthY;
   items.push(o);
   if(footprint){
    H.body(o,footprint,'prop_desk');bodies.push(o);
    OfficeEnvironment.groundObject(scene,layer(o.x,o.y),key,o.x,o.y,'desk');
   }
   return o;
  }
  function workstation(d){
   const {id,x,y,w,h,kind,accent,color}=d;
   const deskFoot={width:w,back:h-20,front:0};
   officePiece(id,x,y-24,w,h+24,c=>{
    const block=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
    const base=kind==='S'?h-4:h;
    block('#171c35',0,24,w,26);
    block('#f2d7a1',2,25,w-4,16);
    block('#fff0cf',2,25,w-4,2);
    block('#d3b78d',w-15,28,12,12);
    block('#fff0cf',4,37,w-22,1);
    block('#a88b70',w-7,39,5,7);
    block('#171c35',w-2,43,2,6);
    block('#a88b70',2,41,w-4,6);
    block('#874c3b',3,47,w-6,2);
    // Drawer bank or standing legs, plus a side return on L desks.
    if(kind==='S'){
     for(const px of [7,w-12]){block('#171c35',px,48,6,base-22);block('#526078',px+1,49,2,base-24);}
    }else{
     block('#171c35',4,48,kind==='L'?25:19,base-24);
     block('#526078',6,49,kind==='L'?21:15,base-26);
     block('#303750',kind==='L'?24:18,49,3,base-26);
     block('#a88b70',6,50,kind==='L'?18:12,1);
     block('#303750',7,base+6,kind==='L'?19:13,1);
     block('#303750',7,57,kind==='L'?19:13,1);
     block('#f2d7a1',10,53,6,1);
     block('#171c35',w-11,48,7,base-24);
     block('#a88b70',w-10,49,4,base-26);
    }
    if(kind==='L'){
     block('#171c35',w-24,39,24,h-16);
     block('#f2d7a1',w-22,40,20,13);
     block('#a88b70',w-22,53,20,5);
     block('#526078',w-21,58,17,h-37);
     block('#303750',w-21,64,17,1);
    }
    if(kind==='R'){
     block('#171c35',1,45,w-2,base-21);
     c.fillStyle='#'+color.toString(16).padStart(6,'0');
     c.fillRect(3,47,w-6,base-25);
     block('#83a89a',4,49,w-8,2);
     block('#303750',5,base+14,w-10,3);
     block('#fff0cf',w/2-40,55,80,4);
    }
    const monitorX=kind==='R'?w-64:w-25;
    if(!['box','beanbag','board'].includes(accent)){
     block('#171c35',monitorX,4,22,24);block('#d3b78d',monitorX+2,5,18,18);
     block('#303750',monitorX+4,8,14,12);block('#83a89a',monitorX+5,9,12,7);
     block('#fff0cf',monitorX+5,9,8,1);block('#a88b70',monitorX+7,23,10,3);
     block('#171c35',monitorX-4,31,21,5);block('#fff0cf',monitorX-3,31,18,3);
     for(let i=0;i<4;i++)block('#a88b70',monitorX-1+i*4,32,2,1);
    }
    // A different silhouette and color accent at each seat.
    const paper=(px,py,t='#fff0cf')=>{block('#171c35',px,py,18,9);block(t,px+1,py,16,7);block('#a88b70',px+3,py+2,8,1);block('#a88b70',px+3,py+4,11,1);};
    const mug=(px,py,t)=>{block('#171c35',px,py,9,10);block(t,px+1,py+2,6,7);block('#fff0cf',px+1,py+1,6,1);block('#171c35',px+8,py+3,3,5);};
    switch(accent){
     case 'adding':block('#171c35',6,20,20,13);block('#a88b70',7,21,18,9);paper(10,13);for(let i=0;i<4;i++)block('#fff0cf',9+i*4,27,2,2);break;
     case 'binders':for(let i=0;i<4;i++){block('#171c35',5+i*5,13+i%2*3,6,20-i%2*3);block(['#ef9347','#3e7775','#bfa8cf','#83a89a'][i],6+i*5,14+i%2*3,3,17-i%2*3);}break;
     case 'calendar':case 'flyers':paper(7,23,accent==='flyers'?'#bfa8cf':'#fff0cf');paper(13,28);break;
     case 'photo':block('#171c35',7,17,16,16);block('#ef9347',8,18,14,13);block('#526078',10,20,10,9);block('#e5a995',12,22,4,5);block('#fff0cf',17,23,2,4);break;
     case 'candy':block('#171c35',6,25,22,8);block('#fff0cf',8,27,18,5);for(let i=0;i<5;i++)block(i%2?'#ef9347':'#c45c4b',8+i*3,25+i%2,3,3);break;
     case 'plant':block('#171c35',9,24,12,10);block('#ef9347',11,25,8,8);block('#3e7775',7,18,16,7);block('#83a89a',9,16,4,5);block('#83a89a',16,15,4,7);break;
     case 'mugs':mug(5,21,'#ef9347');mug(19,24,'#bfa8cf');break;
     case 'duck':block('#171c35',8,20,14,12);block('#f2d7a1',9,23,12,7);block('#ef9347',17,23,7,3);block('#f2d7a1',12,19,8,6);block('#171c35',17,20,2,2);break;
     case 'cables':for(let i=0;i<3;i++){block('#171c35',5+i*5,20,6,12);block('#526078',6+i*5,22,4,8);block('#ef9347',7+i*5,23,2,4);}break;
     case 'tower':block('#171c35',8,10,18,24);block('#526078',10,12,14,20);block('#303750',12,15,10,5);block('#83a89a',12,26,3,2);break;
     case 'tools':paper(5,25,'#526078');block('#ef9347',9,27,4,8);block('#83a89a',14,26,2,8);break;
     case 'stickers':block('#171c35',5,23,23,12);block('#526078',7,24,19,8);block('#ef9347',9,25,3,3);block('#bfa8cf',15,26,5,3);break;
     case 'board':block('#171c35',8,5,45,26);block('#a88b70',10,7,41,22);block('#bfa8cf',14,10,11,7);block('#fff0cf',28,14,15,10);block('#ef9347',44,8,4,8);break;
     case 'neon':block('#171c35',6,15,21,14);block('#bfa8cf',8,17,17,9);block('#526078',11,19,11,5);break;
     case 'box':block('#171c35',13,13,42,24);block('#d3b78d',15,16,38,19);block('#a88b70',15,23,38,12);block('#fff0cf',30,16,6,10);break;
     case 'tape':block('#171c35',10,23,17,10);block('#ef9347',11,24,13,7);block('#fff0cf',14,25,5,5);paper(28,26,'#bfa8cf');break;
     case 'beanbag':block('#171c35',8,20,21,14);block('#bfa8cf',9,22,19,10);block('#526078',11,29,14,2);break;
     case 'reception':paper(36,31);mug(98,25,'#ef9347');break;
    }
    if(['adding','candy','duck','board','reception','photo'].includes(accent)){
     const px=accent==='reception'?138:28;
     block('#171c35',px,10,14,4);block('#f2d7a1',px+1,11,12,3);
     block('#a88b70',px+6,14,2,12);block('#171c35',px+2,26,10,2);
    }
   },deskFoot,y+h);
  }
  function partition(p){
   const {x,y,w,h,color,glass,lift}=p;
   const rise=lift?86:glass?56:38;
   officePiece(p.id,x,y-rise,w,h+rise,c=>{
    c.fillStyle='#171c35';c.fillRect(0,0,w,h+rise);
    c.fillStyle='#'+color.toString(16).padStart(6,'0');
    c.globalAlpha=glass ? .65 : 1;c.fillRect(2,3,w-4,h+rise-6);c.globalAlpha=1;
    if(!glass&&!lift){
     c.fillStyle='rgba(255,240,207,.10)';
     for(let yy=7;yy<h+rise-8;yy+=4)for(let xx=3+(yy%3);xx<w-4;xx+=6)c.fillRect(xx,yy,2,1);
    }
    if(glass){c.clearRect(2,5,w-4,Math.max(0,h+rise-13));c.fillStyle='rgba(131,168,154,.35)';c.fillRect(2,5,w-4,h+rise-13);}
    c.fillStyle='#83a89a';c.fillRect(2,2,w-4,2);
    c.fillStyle='#303750';c.fillRect(2,h+rise-6,w-4,4);
    for(let i=24;i<w-12;i+=lift?96:72){
     c.fillStyle='#303750';c.fillRect(i,4,2,h+rise-10);
     if(lift){c.fillStyle='#171c35';c.fillRect(i+8,12,64,66);c.fillStyle='#526078';c.fillRect(i+10,14,60,62);c.fillStyle='#83a89a';c.fillRect(i+39,14,2,62);c.fillStyle='#ef9347';c.fillRect(i+31,6,16,3);}
     else if(!glass){c.fillStyle=i%2?'#bfa8cf':'#d3b78d';c.fillRect(i+6,11,8,6);}
    }
   },{width:w,back:h,front:0});
  }
  for(const p of data.officeLoop?.partitions||[])partition(p);
  for(const d of data.officeLoop?.workstations||[])workstation(d);
  for(const p of data.placements)fixture(p);
  for(const r of data.labels||[]){const key='slice_label_'+r.id;sign(scene,key,r.text,r.width,r.plate!==false,r.scale||2);const o=add(scene.add.image(r.x,r.y,key).setOrigin(.5,1).setAlpha(r.alpha??1),r.floor?{x:r.x-r.width/2,y:r.y-40,width:r.width,height:40}:null);if(r.floor){o.setDepth(BASE+4);if(r.id.startsWith('loop-'))o.sliceBakeFloor=true;}else{o.sliceDepth=r.depthY??r.y;items.push(o);}if(r.caption){o.caption=r.caption;o.sliceReadAt=r.readAt;captions.push(o);}}

  for(const seat of data.workers){
   const art=cast[seat.cast];
   const key=seat.seated?officePersonTexture(scene,seat.cast,true):'slice_coworker_'+seat.cast;
   const animated=art&&scene.textures.exists(key);
   const firstFrame=(seat.colorway||0)*WORKER_POSES*2;
   const phase=seat.phase||0;
   const idleFrame=animated?firstFrame+Math.floor(phase/art.idleMs)%WORKER_POSES:undefined;
   if(seat.seated){
    officePiece('chair-'+seat.host,seat.x-18,seat.y-37,36,37,c=>{
     const b=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
     b('#171c35',2,3,28,21);b('#3e7775',4,5,24,16);b('#83a89a',4,5,24,2);
     b('#171c35',4,22,31,6);b('#526078',6,22,26,3);
     b('#171c35',15,27,5,7);b('#171c35',5,33,25,3);b('#526078',6,33,23,1);
    },{width:28,back:18,front:0},seat.depthY-1);
   }
   const o=add(scene.add.image(seat.x,seat.y,
    animated?key:'slice_coworker_placeholder_'+seat.variant,idleFrame)
    .setOrigin(.5,1));
   if(!seat.seated)o.setCrop(0,0,WORKER_WIDTH,seat.cropHeight);
   o.sliceId=seat.id;
   o.sliceDepth=seat.depthY;
   o.caption=art?.caption??STAGE_PROPS.captions.coworker_placeholder;
   if(animated)animatedWorkers.push({object:o,art,phase,firstFrame,near:false,noticedAt:-Infinity});
   captions.push(o);
   items.push(o);
  }
  for(const person of data.officeLoop?.scenes||[]){
   const art=cast[person.cast],key=officePersonTexture(scene,person.cast,false);
   if(!key||!art)continue;
   const o=add(scene.add.image(person.x,person.y,key,0).setOrigin(.5,1).setFlipX(!!person.flip));
   o.sliceId=person.id;
   o.sliceDepth=o.y;
   items.push(o);
   standingPeople.push({object:o,art,scene:person});
  }
  // Reusable native structural panels, not an illustrated map texture.
  for(const r of data.walls){const w=r.width,h=r.height+(r.style==='parking'?48:112),key='slice_wall_'+(r.style||'office')+'_'+r.axis+'_'+r.width+'_'+r.height;
   if(!scene.textures.exists(key))makeCanvasTex(scene,key,w,h,c=>{if(r.style==='wellness'){c.fillStyle='#171c35';c.fillRect(0,0,w,h);c.fillStyle='#83a89a';c.fillRect(2,2,w-4,h-4);c.fillStyle='#fff0cf';c.fillRect(2,3,w-4,4);c.fillStyle='#3e7775';for(let x=16;x<w;x+=48)c.fillRect(x,12,2,h-20);c.fillStyle='#bfa8cf';c.fillRect(2,h-10,w-4,3);return;}if(r.style==='executive'){c.fillStyle='#171c35';c.fillRect(0,0,w,h);c.fillStyle='#874c3b';c.fillRect(2,2,w-4,h-4);c.fillStyle='#b97a58';c.fillRect(2,2,w-4,3);c.fillStyle='#70402f';for(let x=14;x<w-2;x+=32)c.fillRect(x,8,2,h-14);c.fillStyle='#d3b78d';c.fillRect(2,h-10,w-4,2);return;}if(r.style==='glass'){c.fillStyle='#83a89a';c.globalAlpha=.2;c.fillRect(1,1,w-2,h-2);c.globalAlpha=1;c.fillStyle='#303750';c.fillRect(0,h-8,w,8);c.fillRect(0,0,2,h);c.fillRect(w-2,0,2,h);c.fillStyle='#83a89a';c.fillRect(1,0,w-2,2);c.fillStyle='#f2d7a1';if(r.axis==='x')for(let x=16;x<w;x+=64)c.fillRect(x,16,2,24);return;}c.fillStyle='#171c35';c.fillRect(0,0,w,h);c.fillStyle=r.style==='kitchen'?'#d3b78d':['parking','server'].includes(r.style)?'#303750':'#3e7775';c.fillRect(2,3,w-4,h-5);c.fillStyle=r.style==='parking'?'#526078':'#83a89a';c.fillRect(2,3,Math.max(2,w-4),4);c.fillStyle='#f2d7a1';if(r.axis==='x'){c.fillRect(2,8,w-4,5);for(let x=16;x<w;x+=64){c.fillStyle='#303750';c.fillRect(x,30,Math.min(44,w-x-3),42);c.fillStyle='#526078';c.fillRect(x+2,32,Math.min(40,w-x-7),2);}}else c.fillRect(2,8,5,h-12);});
   const o=add(scene.add.image(r.x+w/2,r.y+r.height,key).setOrigin(.5,1));o.sliceId=r.id;o.sliceDepth=o.y;H.body(o,{width:r.width,back:r.height,front:0},'prop_wall');bodies.push(o);items.push(o);
  }
  const gates=[];
  for(const r of data.gates){const key='slice_closed_gate';if(!scene.textures.exists(key))makeCanvasTex(scene,key,128,336,c=>{c.fillStyle='#171c35';c.fillRect(0,0,128,336);c.fillStyle='#303750';c.fillRect(3,3,122,330);c.fillStyle='#3e7775';c.fillRect(8,8,112,320);c.fillStyle='#83a89a';c.fillRect(12,12,4,312);c.fillStyle='#f2d7a1';c.fillRect(40,12,7,312);c.fillStyle='#171c35';c.fillRect(4,166,120,4);});const o=add(scene.add.image(r.x+64,r.y+224,key).setOrigin(.5,1));H.body(o,{width:128,back:224,front:0},'prop_gate');bodies.push(o);items.push(o);o.sliceId=r.id;o.sliceDepth=o.y;const record={...r,object:o,rect:{x:r.x,y:r.y,w:r.width,h:r.height}};gates.push(record);
   sign(scene,'slice_gate_'+r.id,r.sign||r.name.toUpperCase(),112);const tag=add(scene.add.image(r.x+64,r.y-68,'slice_gate_'+r.id));tag.sliceDepth=r.y+225;items.push(tag);sign(scene,'slice_age_'+r.age,'AGE '+r.age,64);const age=add(scene.add.image(r.x+64,r.y-44,'slice_age_'+r.age));age.sliceDepth=r.y+226;items.push(age);
   o.caption=r.caption??(r.age===45?STAGE_PROPS.captions.gate_parking_break:(r.id==='server-return'?'SERVER ROOM. Access at fifty. Bring a sweater and a reason.':'CONFERENCE ROOMS. Access at fifty. You have been invited to the invitation.'));o.sliceReadAt=[r.x+r.width/2,r.y+r.height/2];captions.push(o);
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
  try{const chunkG=all.filter(e=>e.bounds&&e.o&&(e.o.type==='Graphics'||e.o.sliceBakeFloor)&&e.o.active).sort((a,b)=>a.o.depth-b.o.depth);
   if(chunkG.length&&scene.make.renderTexture){const B=data.bounds,T=1024;let n=0;
    for(let ty=B.y;ty<B.y+B.height;ty+=T)for(let tx=B.x;tx<B.x+B.width;tx+=T){
     const w=Math.min(T,B.x+B.width-tx),h=Math.min(T,B.y+B.height-ty),key='slice_bake_'+(n++);
     if(!data.floors.some(r=>r.x+r.width>tx&&r.x<tx+w&&r.y+r.height>ty&&r.y<ty+h))continue;
     if(scene.textures.exists(key))scene.textures.remove(key);
     const rt=scene.make.renderTexture({x:0,y:0,width:w,height:h},false);
     for(const e of chunkG){const r=e.bounds;if(r.x+r.width>tx&&r.x<tx+w&&r.y+r.height>ty&&r.y<ty+h)rt.draw(e.o,e.o.sliceBakeFloor?e.o.x-tx:-tx,e.o.sliceBakeFloor?e.o.y-ty:-ty);}
     rt.saveTexture(key);
     all.push({o:scene.add.image(tx,ty,key).setOrigin(0).setDepth(chunkG[0].o.depth),bounds:{x:tx,y:ty,width:w,height:h},rt});
    }
    for(const e of chunkG){if(e.o.sliceBakeFloor){const i=captions.indexOf(e.o);if(i>=0)captions[i]={x:e.o.x,y:e.o.y,visible:true,caption:e.o.caption,sliceReadAt:e.o.sliceReadAt};}e.o.destroy();all.splice(all.indexOf(e),1);}
   }}catch(e){}
  const state={data,gates,items,bodies,active:true,visibleProps:0,peakVisibleProps:0,spawnPadding,get repairedSpawns(){return repairedSpawns;},resolveSpawn,update,sync,destroy,contains:within};
  function update(){if(!alive)return;const x=p.x,y=p.y+p.height/2;if(!within(x,y)){p.setPosition(...[lastValid[0],lastValid[1]-p.height/2]);p.setVelocity(0,0);p.body.updateFromGameObject();}else lastValid=[x,y];}
  function sync(){if(!alive)return;const now=refs.clock();updateStanding(standingPeople,now);for(const {light,seed}of blinkLights)if(light.active)light.setVisible((Math.floor(refs.clock()/650)+seed)%3!==0);const v=scene.cameras.main.worldView,cam=scene.cameras.main.id,visible=[];
   for(const o of items){if(!o.active)continue;const depth=10000+(o.sliceDepth??o.y)-p.y;if(o.depth!==depth)o.setDepth(depth);if(o.sliceShadow)o.sliceShadow.setVisible(o.visible);const shown=o.visible&&o.x+o.displayWidth/2>v.x-96&&o.x-o.displayWidth/2<v.right+96&&o.y>v.y-96&&o.y-o.displayHeight<v.bottom+96;o.cameraFilter=shown?0:cam;if(shown)visible.push(o);}
   if(visible.length>data.maxVisibleProps){
    visible.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
    for(const o of visible.slice(data.maxVisibleProps))o.cameraFilter=cam;
   }
   for(const o of items)if(o.sliceShadow)o.sliceShadow.cameraFilter=o.cameraFilter;state.visibleProps=Math.min(visible.length,data.maxVisibleProps);state.peakVisibleProps=Math.max(state.peakVisibleProps,state.visibleProps);
   for(const {o,bounds:r}of all)if(r)o.cameraFilter=(r.x+r.width>v.x-96&&r.x<v.right+96&&r.y+r.height>v.y-96&&r.y<v.bottom+96)?0:cam;
   updateCoworkers(animatedWorkers,now,p.x,p.y+p.height/2);
   if(now-lastMemo>6000&&window.showLowerThird)for(const o of captions){if(!o.visible||seen.has(o.caption))continue;if(Math.abs((o.sliceReadAt?.[0]??o.x)-p.x)<110&&Math.abs((o.sliceReadAt?.[1]??o.y)-(p.y+p.height/2))<110){seen.add(o.caption);lastMemo=now;window.showLowerThird('lore','MEMO',o.caption,4500);break;}}
  }
  function destroy(){alive=false;window.navExtraBlockers=(window.navExtraBlockers||[]).filter(r=>!ownedBlockers.includes(r));if(window.START_AREA_GATES===gates)window.START_AREA_GATES=[];for(const e of all){if(e.o.active)e.o.destroy();if(e.rt)e.rt.destroy();}}
  return state;
 }
 return {build,contains:within};
})();
