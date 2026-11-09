// Approved hero and Corporate Campus art. Change a flag and reload to compare.
window.USE_HERO_ART = true;
// Nov 2: 8-frame hero sheets with an idle row (ChatGPT). Set to 1 and reload for the 4-frame v1 walk.
window.HERO_ART_VERSION = 2;
window.HERO_ANIM = { walkFrameMs: 95, stepPx: 8.5, breathMs: 320, fidgetEveryMs: 7000, fidgetFrameMs: 170 };
window.USE_OFFICE_ART = true;
window.WorldArt = (() => {
  const palette = '171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f'.split(' ').map(hex => [0,2,4].map(i => parseInt(hex.slice(i,i+2),16)));
  function image(data) {
    return new Promise((resolve,reject) => { const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Art image unavailable'));img.src=data; });
  }
  function propTexture(scene,img,key,width,height) {
    if(scene.textures.exists(key))return;
    const source=document.createElement('canvas');source.width=img.width;source.height=img.height;
    const ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
    const pixels=ctx.getImageData(0,0,source.width,source.height);
    let left=img.width,right=0,top=img.height,bottom=0;
    for(let y=0;y<img.height;y++)for(let x=0;x<img.width;x++) {
      const i=(y*img.width+x)*4,[r,g,b]=pixels.data.subarray(i,i+3);
      if(r>160&&b>160&&g<110&&r-g>90&&b-g>90)pixels.data[i+3]=0;
      else {left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    }
    if(left>right)throw new Error('Empty prop: '+key);
    ctx.putImageData(pixels,0,0);
    const texture=scene.textures.createCanvas(key,width,height),out=texture.getContext();out.imageSmoothingEnabled=false;
    const factor=Math.min((width-2)/(right-left+1),(height-2)/(bottom-top+1));
    const dw=Math.round((right-left+1)*factor),dh=Math.round((bottom-top+1)*factor);
    if(img.width===width&&img.height===height)out.drawImage(source,0,0);
    else out.drawImage(source,left,top,right-left+1,bottom-top+1,Math.floor((width-dw)/2),height-dh-1,dw,dh);
    const native=out.getImageData(0,0,width,height);
    for(let i=0;i<native.data.length;i+=4)if(native.data[i+3]) {
      let best=palette[0],distance=Infinity;
      for(const color of palette){const d=color.reduce((sum,c,j)=>sum+(c-native.data[i+j])**2,0);if(d<distance){best=color;distance=d;}}
      native.data.set(best,i);native.data[i+3]=255;
    }
    out.putImageData(native,0,0);texture.refresh();texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  function init(scene,refs) {
    let alive=true,hero=null,shadow=null,facing='down',walked=0,lastX=refs.player.x,lastY=refs.player.y,lastClock=-1;
    const chunks=[],heroReady=new Set(),heroV2=new Set(),pendingProps=[],decor=[],captioned=[],captionsShown=new Set();let lastCaptionAt=-1e9;
    const state={active:false,update};scene.worldArt=state;
    function body(object,footprint,kind) {
      if(!object.body)scene.physics.add.existing(object);
      window.propGroup.add(object);object.body.setImmovable(true);object.body.moves=false;
      object.body.setSize(footprint.width,footprint.back+footprint.front).setOffset((object.width-footprint.width)/2,object.height-footprint.back);
      object.footprint=footprint;object.propKind=kind;object.hp=kind==='prop_plant'?2:9999;
      pendingProps.push(object);return object;
    }
    async function loadHero() {
      for(const character of CharacterArt.characters) {
        try {
          const img=await image(window.CHARACTER_SHEETS[character.id]);if(!alive)return;
          if(!scene.textures.exists('walk_'+character.id))CharacterArt.importSheet(scene,img,character.id,palette);
          heroReady.add(character.id);
        } catch(error){console.warn('Hero art fallback: '+error.message);}
        if(window.HERO_ART_VERSION===2) loadHeroV2(character.id);
      }
      if(window.HERO_ART_VERSION===2) loadHeroV2('coldWarCowboy'); // Ben has v2 art only (Nov 3)
    }
    // v2: 448x300 sheet, 8 columns x 5 rows of 56x60 (rows: down, up, left, right walks, then idle). Exact magenta = clear.
    const HERO_FILES={officeWorker:'office-worker-walk-56x60-v3',photographer:'soccer-dad-walk-56x60-v3',gradStudent:'grad-student-walk-56x60-v3',coldWarCowboy:'cold-war-cowboy-walk-56x60-v4'};
    function loadHeroV2(id) {
      const img=new Image();
      img.onload=()=>{
        if(!alive||img.width!==448||img.height!==300){if(alive)console.warn('Hero v2 art fallback: wrong size for '+id);return;}
        const c=document.createElement('canvas');c.width=448;c.height=300;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
        const d=x.getImageData(0,0,448,300);for(let i=0;i<d.data.length;i+=4)if(d.data[i]===255&&d.data[i+1]===0&&d.data[i+2]===255)d.data[i+3]=0;
        x.putImageData(d,0,0);
        if(!scene.textures.exists('walk2_'+id)){scene.textures.addSpriteSheet('walk2_'+id,c,{frameWidth:56,frameHeight:60});scene.textures.get('walk2_'+id).setFilter(Phaser.Textures.FilterMode.NEAREST);}
        heroV2.add(id);
      };
      img.onerror=()=>{};
      img.src='assets/characters/'+HERO_FILES[id]+'.png?v='+window.BUILD;
    }
    // Nov 9 (Rami): Lounge cosmetics. A "retro 3D" skin you buy in the Lounge for one run (stats.skin = 'retro3d').
    // Same 448x300 layout as the v2 sheets. Loaded the first time it's needed.
    const SKIN_FILES={retro3d:{officeWorker:'office-worker-retro3d-walk-56x60-v1',photographer:'photographer-retro3d-walk-56x60-v1',gradStudent:'gradStudent-retro3d-walk-56x60-v1',coldWarCowboy:'coldWarCowboy-retro3d-walk-56x60-v1'}};
    window.SKIN_FILES=SKIN_FILES;
    const skinAsked=new Set();
    function skinKey(id){
      const sk=typeof stats!=='undefined'&&stats&&stats.skin;if(!sk||!SKIN_FILES[sk]||!SKIN_FILES[sk][id])return null;
      const k='skin_'+sk+'_'+id;if(scene.textures.exists(k))return k;
      if(!skinAsked.has(k)){skinAsked.add(k);const img=new Image();img.onload=()=>{if(!alive||img.width!==448||img.height!==300)return;
        const c=document.createElement('canvas');c.width=448;c.height=300;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
        const d=x.getImageData(0,0,448,300);for(let i=0;i<d.data.length;i+=4)if(d.data[i]===255&&d.data[i+1]===0&&d.data[i+2]===255)d.data[i+3]=0;
        x.putImageData(d,0,0);if(!scene.textures.exists(k)){scene.textures.addSpriteSheet(k,c,{frameWidth:56,frameHeight:60});scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST);}};
        img.src='assets/characters/'+SKIN_FILES[sk][id]+'.png?v='+window.BUILD;}
      return null;
    }
    let stillSince=0,nextFidget=0,walkFrom=0;
    function heroFrame(id,moving,now) {
      const H=window.HERO_ANIM,dirs=['down','up','left','right'];
      // Walk cycle on its own clock (Nov 5, Paul McKinney's review): a steady rhythm that doesn't speed up or stall with
      // movement speed. walkFrameMs per frame; the cycle starts on frame 0 each time you start moving.
      if(moving){if(now-stillSince>150)walkFrom=now;stillSince=now;nextFidget=now+H.fidgetEveryMs;return dirs.indexOf(facing)*8+Math.floor((now-walkFrom)/H.walkFrameMs)%8;}
      if(facing!=='down'&&now-stillSince<600) return dirs.indexOf(facing)*8; // brief stand in the direction you stopped
      if(now>=nextFidget){const k=Math.floor((now-nextFidget)/H.fidgetFrameMs);if(k<4)return 32+4+k;nextFidget=now+H.fidgetEveryMs;}
      return 32+Math.floor(now/H.breathMs)%4; // breathing / coffee-sip loop
    }
    async function loadOffice() {
      const homeStage=window.STAGE_ID==='home'&&window.MapleHollow; // Nov 9: Maple Hollow builds instead of the office
      if(window.USE_START_AREA && (window.StartAreaArt||homeStage)) {
        const before=new Set(scene.children.list);
        // Quick Retry (the office was built before): keep the view blank for the moment it takes to rebuild,
        // then fade it in, so the old placeholder room never flashes (Fable review #9). 3 s safety net.
        const cam=scene.cameras.main,veil=window.__officeBuiltOnce;
        const reveal=()=>{if(!alive||cam.alpha===1)return;scene.tweens.add({targets:cam,alpha:1,duration:200});};
        if(veil){cam.setAlpha(0);setTimeout(()=>{if(alive)cam.setAlpha(1);},3000);}
        try {
          const area=await (homeStage?MapleHollow:StartAreaArt).build(scene,refs,{image,propTexture,body,isAlive:()=>alive});
          if(!alive||!area){if(area)area.destroy();reveal();return;}
          refs.props.forEach(p=>p.destroy());refs.props.splice(0,refs.props.length,...pendingProps);pendingProps.length=0;
          window.stagePlatforms.forEach(p=>p.destroy());window.stagePlatforms=[];
          refs.floor.setTexture('slice_void').clearTint().setDepth(-1000000000);
          state.startArea=area;state.active=true;scene.cameras.main.setRoundPixels(true);window.__officeBuiltOnce=true;reveal();return;
        } catch(error) {
          reveal();
          scene.children.list.slice().forEach(o=>{if(!before.has(o))o.destroy();});pendingProps.length=0;
          scene.cameras.main.removeBounds();console.warn('Start-area art fallback: '+error.message);
        }
      }
      let beforeChildren;
      try {
        const desks=await Promise.all(['tidy','paperwork','lunch'].map(async id=>[id,await image(window.DESK_VARIANT_IMAGES[id])]));
        const props=await Promise.all(OfficeEnvironment.props.map(async def=>[def,await image(window.ENVIRONMENT_IMAGES[def.id])]));
        if(!alive)return;
        for(const [id,img]of desks)propTexture(scene,img,'desk_'+id,96,104);
        // Stage 2A props (ChatGPT). Optional: if they fail to load, the office still works without them.
        const SP=window.USE_STAGE_PROPS&&window.STAGE_PROPS;
        if(SP) {
          try {
            for(const [id,f]of Object.entries(SP.families)) {
              const img=await image('assets/stage/props/'+f.file);if(!alive)return;
              for(let k=0;k<f.frames;k++) {
                const cut=document.createElement('canvas');cut.width=f.frame[0];cut.height=f.frame[1];
                cut.getContext('2d').drawImage(img,k*f.frame[0],0,f.frame[0],f.frame[1],0,0,f.frame[0],f.frame[1]);
                propTexture(scene,cut,f.desk?`desk_${f.desk}_${k}`:`stage_${id}_${k}`,f.frame[0],f.frame[1]);
              }
            }
          } catch(error){console.warn('Stage props fallback: '+error.message);}
        }
        const deskCaption=variant=>{
          if(!SP)return null;
          const fam=Object.entries(SP.families).find(([,f])=>f.desk&&variant.startsWith(f.desk+'_'));
          return fam?SP.captions[fam[0]]:null;
        };
        for(const [def,img]of props)propTexture(scene,img,def.key,def.width,def.height);
        OfficeEnvironment.createTiles(scene);
        beforeChildren=new Set(scene.children.list);
        // A 3x3 pool surrounds the player. Sections recycle only at campus scale,
        // beyond the viewport, preserving the connected routes in every direction.
        const layout=Object.assign({},OFFICE_LAYOUT,{endless:true});
        for(let ix=-1;ix<=1;ix++)for(let iy=-1;iy<=1;iy++) {
          const desks=[],landmarks=[],all=[];
          for(const d of layout.departments) {
            for(const [x,y,variant]of d.desks) {
              const key=scene.textures.exists('desk_'+variant)?'desk_'+variant:'desk_tidy';
              const desk=scene.add.image(x,y,key).setOrigin(.5,1);desk.variant=variant;
              const cap=key==='desk_'+variant&&deskCaption(variant);if(cap){desk.caption=cap;captioned.push(desk);}
              body(desk,{width:80,back:70,front:2},'prop_desk');desks.push(desk);all.push(desk);
            }
            const type=d.prop==='prop_copier'?'printer':d.prop==='prop_plant'?'plant':null;
            const def=OfficeEnvironment.props.find(p=>p.id===type);
            const landmark=scene.add.image(...d.propAt,def?def.key:d.prop).setOrigin(.5,1);
            landmark.environmentType=type;landmark.originalTexture=d.prop;
            body(landmark,def?def.footprint:{width:26,back:24,front:4},type==='plant'?'prop_plant':'prop_cooler');
            landmarks.push(landmark);all.push(landmark);
          }
          if(SP)for(const [x,y,id,k]of SP.place) {
            const f=SP.families[id],key=`stage_${id}_${k||0}`;
            if(!f||!scene.textures.exists(key))continue;
            const o=scene.add.image(x,y,key).setOrigin(.5,1);o.stageId=id;
            if(f.solid)body(o,f.footprint,'prop_desk');else if(f.flat)o.setDepth(-999999950);else decor.push(o);
            if(SP.captions[id]){o.caption=SP.captions[id];captioned.push(o);}
            all.push(o);
          }
          const environment=OfficeEnvironment.build(scene,layout,desks,landmarks);
          for(const p of environment.blockers)body(p,p.footprint,p.texture.key==='env_plant'?'prop_plant':'prop_desk');
          all.push(...environment.objects);
          for(const d of layout.departments)all.push(scene.add.text(d.x,d.y-d.height/2+20,d.name,{fontFamily:'monospace',fontSize:'12px',color:'#f2d7a1'}).setOrigin(.5).setAlpha(.65).setDepth(-999999980));
          chunks.push({ix,iy,cx:null,cy:null,objects:all.map(o=>({o,x:o.x,y:o.y}))});
        }
        refs.props.forEach(p=>p.destroy());refs.props.splice(0,refs.props.length,...pendingProps);pendingProps.length=0;
        window.stagePlatforms.forEach(p=>p.destroy());window.stagePlatforms=[];
        refs.floor.setTexture('env_floor').setDepth(-1000000000);
        state.active=true;scene.cameras.main.setRoundPixels(true);update();
      } catch(error){
        if(beforeChildren)scene.children.list.slice().forEach(o=>{if(!beforeChildren.has(o))o.destroy();});
        pendingProps.length=0;console.warn('Office art fallback: '+error.message);try{if(window.Telemetry&&Telemetry.event)Telemetry.event('office-fallback');}catch(e){}
      }
    }
    function update() {
      if(!state.active)return;
      if(state.startArea){state.startArea.update();return;}
      const cx=Math.round(refs.player.x/OFFICE_LAYOUT.width),cy=Math.round(refs.player.y/OFFICE_LAYOUT.height);
      for(const chunk of chunks) {
        const gx=cx+chunk.ix,gy=cy+chunk.iy;
        if(chunk.cx===gx&&chunk.cy===gy)continue;
        chunk.cx=gx;chunk.cy=gy;
        chunk.objects.forEach(({o,x,y},index)=>{
          o.setPosition(x+gx*OFFICE_LAYOUT.width,y+gy*OFFICE_LAYOUT.height);
          if(o.body){
            o.cellKey=`campus:${gx},${gy}:${index}`;o.hp=o.propKind==='prop_plant'?2:9999;
            const visible=!window.smashedPlants.has(o.cellKey);o.setVisible(visible);o.body.enable=visible;o.body.updateFromGameObject();
          }
        });
      }
    }
    function sync() {
      if(!alive)return;
      const p=refs.player,now=refs.clock(),moving=Math.hypot(p.x-lastX,p.y-lastY)>.05;
      const feet=p.y+p.height/2;
      if(window.USE_HERO_ART&&(heroReady.has(meta.selectedChar)||heroV2.has(meta.selectedChar))) {
        if(!hero){hero=scene.add.sprite(p.x,feet,heroV2.has(meta.selectedChar)?'walk2_'+meta.selectedChar:'walk_'+meta.selectedChar).setOrigin(.5,1);shadow=scene.add.image(p.x,feet-2,'enemy-art-contact').setDisplaySize(26,9);}
        const dx=p.x-lastX,dy=p.y-lastY;
        if(moving&&now!==lastClock){facing=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');walked+=Math.hypot(dx,dy);}
        if(heroV2.has(meta.selectedChar))hero.setTexture(skinKey(meta.selectedChar)||'walk2_'+meta.selectedChar,heroFrame(meta.selectedChar,moving,now));
        else hero.setTexture('walk_'+meta.selectedChar,CharacterArt.frame(facing,moving?Math.floor(now/(window.HERO_ANIM.walkFrameMs*2)):1));
        p.setVisible(false);hero.setPosition(Math.round(p.x),Math.round(feet)).setAlpha(p.alpha).setDepth(state.active?10000+feet-p.y:5);
        if(p.isTinted){if(p.tintFill)hero.setTintFill(p.tintTopLeft);else hero.setTint(p.tintTopLeft);}else hero.clearTint();
        shadow.setPosition(p.x,feet-2).setDepth(state.active?10000+feet-p.y-.1:4.9);
        refs.label.setPosition(p.x,feet-66);
      }
      if(state.active) {
        const view=scene.cameras.main.worldView,margin=192;
        for(const chunk of chunks) {
          const x=chunk.cx*OFFICE_LAYOUT.width,y=chunk.cy*OFFICE_LAYOUT.height;
          const visible=x+OFFICE_LAYOUT.width/2>view.x-margin&&x-OFFICE_LAYOUT.width/2<view.right+margin
            &&y+OFFICE_LAYOUT.height/2>view.y-margin&&y-OFFICE_LAYOUT.height/2<view.bottom+margin;
          if(visible!==chunk.shown){chunk.shown=visible;for(const {o}of chunk.objects)o.cameraFilter=visible?0:scene.cameras.main.id;}
        }
        const px=p.x,py=feet;
        for(const prop of refs.props) {
          if(!prop.active)continue;prop.setDepth(10000+prop.y-p.y);
          // Fade only the foreground furniture currently concealing the hero.
          const behind=prop.visible&&py<prop.y&&py>prop.y-prop.height&&Math.abs(px-prop.x)<prop.width/2+10;
          prop.setAlpha(behind?.48:1);
        }
        for(const d of decor)d.setDepth(10000+d.y-p.y);
        // "Read on approach": the full joke shows once per run in the lower third when you walk up to it.
        if(now-lastCaptionAt>6000&&window.showLowerThird)for(const o of captioned) {
          if(!o.visible||captionsShown.has(o.caption))continue;
          if(Math.abs(o.x-px)<110&&Math.abs(o.y-py)<110){captionsShown.add(o.caption);lastCaptionAt=now;window.showLowerThird('lore','MEMO',o.caption,4500);break;}
        }
        for(const e of refs.enemies().getChildren()) {e.setDepth(10000+e.y+e.height/2-p.y);if(e.tag)e.tag.setDepth(50000);}
        // TJ and Derek sort by their feet like everyone else (Nov 4, Rami: they kept disappearing behind walls).
        {const it=window.Interns&&Interns.active&&Interns.active();if(it&&it.o&&it.o.active){const d=10000+it.o.y-p.y;it.o.setDepth(d);if(it.ring&&it.ring.active)it.ring.setDepth(d-.5);}}
        refs.hpBar.setDepth(50001);refs.label.setDepth(50000);
      }
      if(state.startArea)state.startArea.sync();
      lastX=p.x;lastY=p.y;lastClock=now;
    }
    scene.events.on('postupdate',sync);
    scene.events.once('shutdown',()=>{alive=false;if(state.startArea)state.startArea.destroy();scene.events.off('postupdate',sync);});
    if(window.USE_HERO_ART)loadHero();
    if(window.USE_OFFICE_ART)loadOffice();
  }
  return {init};
})();
