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
      ctx.fillStyle='#171c35';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#303750';ctx.fillRect(3,4,2,1);ctx.fillRect(36,42,1,2);
    });
    tile(scene,'env_carpet',ctx=>{
      ctx.fillStyle='#303750';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#526078';ctx.globalAlpha=.14;
      for(let y=4;y<60;y+=8)for(let x=4;x<60;x+=8)ctx.fillRect(x,y,3,1);
      ctx.globalAlpha=.18;ctx.fillStyle='#171c35';ctx.fillRect(2,31,60,1);ctx.fillRect(31,2,1,60);ctx.globalAlpha=1;
    });
    tile(scene,'env_wood',ctx=>{
      ctx.fillStyle='#a88b70';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#874c3b';ctx.globalAlpha=.24;
      for(let y=15;y<63;y+=16)ctx.fillRect(1,y,62,1);
      ctx.fillRect(23,1,1,14);ctx.fillRect(45,17,1,14);ctx.fillRect(12,33,1,14);ctx.fillRect(38,49,1,13);
      ctx.fillStyle='#f2d7a1';ctx.globalAlpha=.13;
      [[4,5,14],[30,9,22],[8,23,28],[27,39,25],[5,55,21]].forEach(([x,y,w])=>ctx.fillRect(x,y,w,1));ctx.globalAlpha=1;
    });
    tile(scene,'env_vinyl',ctx=>{
      ctx.fillStyle='#a88b70';ctx.fillRect(0,0,64,64);
      ctx.fillStyle='#d3b78d';ctx.globalAlpha=.18;ctx.fillRect(2,2,29,29);ctx.fillRect(33,33,29,29);ctx.globalAlpha=1;
    });
  }
  function build(scene,layout,desks) {
    const objects=[],blockers=[];const base=-999999990;
    const add=o=>{objects.push(o);return o;};
    const floor=(x,y,w,h,key)=>add(scene.add.tileSprite(x,y,w,h,key).setDepth(base));
    floor(0,0,1280,192,'env_wood');floor(0,0,192,896,'env_wood');
    const details=add(scene.add.graphics().setDepth(base+1));
    // Low trim separates materials without pretending the department edges are walls.
    for(const d of layout.departments) {
      const patch=floor(d.x,d.y,384,256,d.id==='breakroom'?'env_vinyl':'env_carpet');
      patch.tilePositionX=d.x-192;patch.tilePositionY=d.y-128;
      details.fillStyle(0x171c35,.6);details.fillRect(d.x-192,d.y-128,384,3);details.fillRect(d.x-192,d.y-128,3,256);
      details.fillRect(d.x+189,d.y-128,3,256);details.fillRect(d.x-192,d.y+125,384,3);
      details.fillStyle(0xa88b70,.35);details.fillRect(d.x-192,d.y+128,384,1);
    }
    // Warm fluorescent pools are hard-edged, very low contrast, and part of the scene.
    details.fillStyle(0xf2d7a1,.08);details.fillRect(-528,-348,366,110);
    details.fillStyle(0xf2d7a1,.04);details.fillRect(-514,-238,350,72);
    details.fillStyle(0x171c35,.32);
    for(const desk of desks) {
      details.fillRect(desk.x-36,desk.y-7,72,10);
      details.fillRect(desk.x-30,desk.y+3,76,6);details.fillRect(desk.x-24,desk.y+9,68,3);
    }
    // North perimeter: trim and a low office wall, clear of the walking bounds.
    details.fillStyle(0x3e7775);details.fillRect(-640,-448,1280,22);
    details.fillStyle(0x83a89a);details.fillRect(-640,-448,1280,3);
    details.fillStyle(0x171c35);details.fillRect(-640,-428,1280,6);
    details.fillStyle(0x526078);details.fillRect(-640,-448,7,896);details.fillRect(633,-448,7,896);
    // Recessed windows and a small bulletin board act as landmarks above Accounts.
    for(const x of [-520,-382,-244]) {
      details.fillStyle(0x171c35);details.fillRect(x,-441,94,10);
      details.fillStyle(0xf2d7a1,.75);details.fillRect(x+3,-440,88,6);
      details.fillStyle(0x874c3b);details.fillRect(x+44,-441,3,10);
    }
    // A few floor-level stories. Keep the central combat routes clear and quiet.
    const paper=(x,y)=>{
      details.fillStyle(0x171c35,.3);details.fillRect(x+2,y+2,13,17);
      details.fillStyle(0xf2d7a1);details.fillRect(x,y,13,17);
      details.fillStyle(0x526078);details.fillRect(x+3,y+4,7,1);details.fillRect(x+3,y+7,6,1);
    };
    paper(-479,-324);paper(-465,-314);paper(-493,-308);
    details.fillStyle(0x874c3b,.6);
    for(const [x,y] of [[-258,-188],[-255,-185]]) {
      details.fillRect(x,y,9,1);details.fillRect(x,y+6,9,1);details.fillRect(x,y,1,7);details.fillRect(x+8,y,1,7);
    }
    details.fillStyle(0xbfa8cf);details.fillRect(-302,-150,7,6);
    details.fillStyle(0x83a89a);details.fillRect(-170,-306,5,2);
    // Decorative floor directional marks use the same wood/cream language.
    details.fillStyle(0xf2d7a1,.28);details.fillRect(-135,-56,23,2);
    for(let i=0;i<4;i++){details.fillRect(-135+i*2,-56-i*2,2,2);details.fillRect(-135+i*2,-54+i*2,2,2);}
    for(const spec of layout.environmentProps || []) {
      const def=props.find(p=>p.id===spec.id);
      const image=add(scene.add.image(spec.x,spec.y,def.key).setOrigin(.5,1).setDepth(spec.y));
      image.footprint=def.footprint;blockers.push(image);
      details.fillStyle(0x171c35,.3);details.fillRect(spec.x-def.footprint.width/2+5,spec.y-3,def.footprint.width,8);
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
