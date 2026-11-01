// Office environment study. Geometric tiles/decals stay native and seamless;
// illustrated props use generated art imported by the preview.
window.OfficeEnvironment = (() => {
  const props = [
    { id:'printer', key:'env_printer', width:80, height:80, footprint:{width:48,back:26,front:4} },
    { id:'cabinet', key:'env_cabinet', width:56, height:88, footprint:{width:38,back:40,front:4} },
    { id:'plant', key:'env_plant', width:48, height:64, footprint:{width:24,back:15,front:3} }
  ];
  function tile(scene,key,draw) { makeCanvasTex(scene,key,64,64,draw); }
  function createTiles(scene) {
    tile(scene,'env_floor',ctx=>{
      ctx.fillStyle='#303750';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#526078';ctx.globalAlpha=.18;
      ctx.fillRect(1,1,62,1);ctx.fillRect(1,1,1,62);
      ctx.fillRect(3,4,2,1);ctx.fillRect(36,42,1,2);ctx.globalAlpha=1;
    });
    tile(scene,'env_carpet',ctx=>{
      ctx.fillStyle='#526078';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#303750';ctx.globalAlpha=.14;
      for(let y=4;y<60;y+=8)for(let x=4;x<60;x+=8){
        ctx.fillRect(x,y,3,1);ctx.fillRect(x+2,y+2,1,2);
      }
      ctx.fillStyle='#83a89a';ctx.globalAlpha=.09;
      [[10,11],[42,19],[26,43],[50,51]].forEach(([x,y])=>{ctx.fillRect(x,y,2,1);ctx.fillRect(x+3,y+2,1,1);});
      ctx.globalAlpha=.18;ctx.fillStyle='#171c35';ctx.fillRect(2,31,60,1);ctx.fillRect(31,2,1,60);ctx.globalAlpha=1;
    });
    tile(scene,'env_wood',ctx=>{
      ctx.fillStyle='#a88b70';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#874c3b';ctx.globalAlpha=.24;
      for(let y=15;y<63;y+=16)ctx.fillRect(1,y,62,1);
      [[8,7,7],[32,23,10],[18,39,8],[44,55,7]].forEach(([x,y,w])=>{ctx.fillRect(x,y,w,1);ctx.fillRect(x+3,y+2,w-3,1);});
      ctx.fillRect(23,1,1,14);ctx.fillRect(45,17,1,14);ctx.fillRect(12,33,1,14);ctx.fillRect(38,49,1,13);
      ctx.fillStyle='#f2d7a1';ctx.globalAlpha=.13;
      [[4,5,14],[30,9,22],[8,23,28],[27,39,25],[5,55,21]].forEach(([x,y,w])=>ctx.fillRect(x,y,w,1));ctx.globalAlpha=1;
    });
    tile(scene,'env_vinyl',ctx=>{
      ctx.fillStyle='#a88b70';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#d3b78d';ctx.globalAlpha=.18;ctx.fillRect(2,2,29,29);ctx.fillRect(33,33,29,29);ctx.globalAlpha=1;
    });
  }
  // Contact contours are read once from the imported texture. Every column's
  // bottom pixel gets a short shadow, so feet and bases actually meet the ground.
  const profiles=new Map();
  function contactProfile(scene,key) {
    if(profiles.has(key)) return profiles.get(key);
    const image=scene.textures.get(key).getSourceImage();
    const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
    const pixels=ctx.getImageData(0,0,image.width,image.height).data,columns=[];
    for(let x=0;x<image.width;x++)for(let y=image.height-1;y>=Math.floor(image.height*.68);y--) {
      if(pixels[(y*image.width+x)*4+3]>0){columns.push([x-image.width/2,y-image.height]);break;}
    }
    profiles.set(key,columns);return columns;
  }
  function groundObject(scene,g,key,x,y,kind) {
    const columns=contactProfile(scene,key);
    // Two hard-edged tones: a short southeast cast, then tight dark contact.
    g.fillStyle(0x171c35,.18);
    for(const [px,py] of columns)g.fillRect(x+px+4,y+py+2,1,5);
    g.fillStyle(0x171c35,.48);
    for(const [px,py] of columns)g.fillRect(x+px,y+py+1,1,2);
    if(kind==='desk') {
      // Recessed shadow beneath the worktop ties the legs, drawers and chair together.
      g.fillStyle(0x171c35,.16);
      g.fillRect(x-38,y-28,70,12);g.fillRect(x-30,y-16,72,12);
    }
  }
  function build(scene,layout,desks,landmarks=[]) {
    const objects=[],blockers=[];const base=-999999990;
    const add=o=>{objects.push(o);return o;};
    const floor=(x,y,w,h,key)=>add(scene.add.tileSprite(x,y,w,h,key).setDepth(base));
    const details=add(scene.add.graphics().setDepth(base+2));
    for(const d of layout.departments) {
      const key=['atrium','breakroom'].includes(d.id)?'env_vinyl':'env_carpet';
      const patch=floor(d.x,d.y,d.width,d.height,key);
      patch.tilePositionX=d.x-d.width/2;patch.tilePositionY=d.y-d.height/2;
      details.fillStyle(d.color,.45);
      details.fillRect(d.x-d.width/2,d.y-d.height/2,d.width,4);
      details.fillRect(d.x-d.width/2,d.y+d.height/2-4,d.width,4);
      // Broad pools repeat at room scale, not at the floor-tile boundary.
      details.fillStyle(0xf2d7a1,.08);
      details.fillRect(d.x-d.width/2+24,d.y-d.height/2+24,d.width-48,96);
    }
    for(const lane of layout.corridors) {
      const strip=floor(lane.x,lane.y,lane.width,lane.height,'env_wood').setDepth(base+1);
      strip.tilePositionX=lane.x-lane.width/2;strip.tilePositionY=lane.y-lane.height/2;
      // Faint wear down the route helps the eye follow it into the distance.
      details.fillStyle(0xf2d7a1,.09);
      if(lane.width>lane.height) details.fillRect(lane.x-lane.width/2,lane.y-22,lane.width,44);
      else details.fillRect(lane.x-22,lane.y-lane.height/2,44,lane.height);
    }
    details.fillStyle(0xf2d7a1,.08);
    for(const x of [-1344,-768,0,768,1344]) details.fillRect(x-64,-80,128,128);
    for(const y of [-832,-448,448,832]) details.fillRect(-64,y-64,128,128);
    // A welcome rug gives the central intersection an unmistakable home base.
    details.fillStyle(0x171c35);details.fillRect(-104,-74,208,148);
    details.fillStyle(0x3e7775);details.fillRect(-100,-70,200,140);
    details.fillStyle(0x83a89a,.65);
    details.fillRect(-92,-62,184,3);details.fillRect(-92,59,184,3);
    for(let i=-2;i<=2;i++) details.fillRect(i*24-3,-5,6,10);
    const arrow=(x,y,dx,dy)=>{
      details.fillStyle(0xf2d7a1,.45);
      for(let i=0;i<5;i++) {
        details.fillRect(x-dx*i*3+dy*i*3,y-dy*i*3+dx*i*3,3,3);
        details.fillRect(x-dx*i*3-dy*i*3,y-dy*i*3-dx*i*3,3,3);
      }
    };
    for(const x of [-1152,0,1152])for(const y of [-832,832]) arrow(x,y,0,y<0?-1:1);
    for(const x of [-320,320,-1152,1152]) arrow(x,0,x<0?-1:1,0);
    const grounding=add(scene.add.graphics().setDepth(base+3));
    for(const desk of desks) {
      const {x,y}=desk;
      // A stepped chair mat extends UNDER the wheels. Its worn edge is attached,
      // not a detached stripe beyond the workstation.
      details.fillStyle(0x303750,.32);
      details.fillRect(x-38,y-24,58,34);details.fillRect(x-34,y-28,50,42);
      details.fillStyle(0x83a89a,.16);details.fillRect(x-34,y-28,50,1);details.fillRect(x-38,y-24,1,34);
      details.fillStyle(0x171c35,.19);
      [[-24,3,6],[-8,9,8],[11,-3,5]].forEach(([px,py,w])=>details.fillRect(x+px,y+py,w,1));
      // A little floor grit and cable beside each island belongs to that desk.
      details.fillStyle(0x303750,.55);
      details.fillRect(x+43,y-23,1,15);details.fillRect(x+39,y-9,5,1);
      details.fillRect(x+39,y-9,1,5);details.fillRect(x+39,y-5,7,1);
      details.fillStyle(0xf2d7a1,.20);details.fillRect(x-43,y-7,2,1);details.fillRect(x+39,y+6,2,1);
      groundObject(scene,grounding,'desk_'+desk.variant,x,y,'desk');
    }
    // Existing department landmarks need the same grounding as the extra props.
    for(const prop of landmarks) {
      const def=props.find(p=>p.id===prop.environmentType);
      groundObject(scene,grounding,def?def.key:prop.originalTexture,prop.x,prop.y,'prop');
    }
    const left=-layout.width/2,top=-layout.height/2;
    if(!layout.endless) {
    details.fillStyle(0x3e7775);details.fillRect(left,top,layout.width,24);
    details.fillStyle(0x83a89a);details.fillRect(left,top,layout.width,3);
    details.fillStyle(0x171c35);details.fillRect(left,top+24,layout.width,6);
    details.fillStyle(0x526078);details.fillRect(left,top,7,layout.height);details.fillRect(-left-7,top,7,layout.height);
    details.fillRect(left,-top-7,layout.width,7);
    for(let x=left+96;x<-left-96;x+=192) {
      details.fillStyle(0x171c35);details.fillRect(x,top+8,112,12);
      details.fillStyle(0xf2d7a1,.75);details.fillRect(x+3,top+9,106,7);
      details.fillStyle(0x874c3b);details.fillRect(x+54,top+8,3,12);
      details.fillStyle(0xf2d7a1,.06);details.fillRect(x+8,top+32,112,192);
    }
    }
    const paper=(x,y)=>{
      details.fillStyle(0x171c35,.3);details.fillRect(x+2,y+2,13,17);
      details.fillStyle(0xf2d7a1);details.fillRect(x,y,13,17);
      details.fillStyle(0x526078);details.fillRect(x+3,y+4,7,1);details.fillRect(x+3,y+7,6,1);
    };
    [[-944,-608],[-930,-584],[-906,-576],[-1008,-480],[-1056,-448],
      [-1208,-112],[-1240,-80],[-1272,-48],[940,-544],[922,-512]].forEach(p=>paper(...p));
    // Offset carpet repairs and coffee rings tell small stories without blocking movement.
    for(const [x,y] of [[-1024,-288],[576,-256],[-608,512],[832,560],[-1280,240]]) {
      details.fillStyle(0x526078,.35);details.fillRect(x,y,32,32);
      details.fillStyle(0x874c3b,.65);
      details.fillRect(x+9,y+9,10,2);details.fillRect(x+9,y+17,10,2);
      details.fillRect(x+7,y+11,2,6);details.fillRect(x+19,y+11,2,6);
    }
    // Wellness has a quiet exercise-mat island; breakroom vinyl has worn chair patches.
    details.fillStyle(0x3e7775);details.fillRect(624,400,128,56);
    details.fillStyle(0x83a89a);details.fillRect(628,404,120,2);details.fillRect(628,450,120,2);
    details.fillStyle(0x171c35,.1);details.fillRect(-784,400,160,80);
    for(const spec of layout.environmentProps || []) {
      const def=props.find(p=>p.id===spec.id);
      const image=add(scene.add.image(spec.x,spec.y,def.key).setOrigin(.5,1).setDepth(spec.y));
      image.footprint=def.footprint;blockers.push(image);
      groundObject(scene,grounding,def.key,spec.x,spec.y,'prop');
    }
    return {objects,blockers};
  }
  function downloads(scene) {
    for(const [id,key,magenta] of [...props.map(p=>[p.id,p.key,true]),['carpet','env_carpet',false],['wood','env_wood',false]]) {
      const image=scene.textures.get(key).getSourceImage();const canvas=document.createElement('canvas');
      canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');
      if(magenta){ctx.fillStyle='#ff00ff';ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.drawImage(image,0,0);
      const link=document.getElementById(id+'-environment-download');
      link.href=canvas.toDataURL('image/png');link.download=id+'-native.png';
    }
  }
  return {props,createTiles,build,downloads};
})();
