"""Build the ten round-three repaints and Rami-layout review. Never writes game files."""
from pathlib import Path
import sys, json, importlib.util, os, hashlib
sys.dont_write_bytecode=True
from PIL import Image, ImageDraw, ImageFont
import numpy as np
ROOT=Path(__file__).resolve().parent
V4=ROOT.parent
OUT=ROOT/'deliver'
PROJECT=ROOT.parents[4]
GROUND=V4/'house-ground-floor/repaint/deliver'
UP=V4/'house-upstairs/deliver'
FONT=ImageFont.load_default(size=14)
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
paint=module('round3_paint',V4/'house-ground-floor/build.py')
rooms_api=module('round3_routes',V4/'house-upstairs/build.py')
PALETTE=paint.PALETTE
def write(path,data):path.write_text(json.dumps(data,indent=2)+'\n')
def relative(path):return os.path.relpath(path,OUT)
def floor_footprints(placed,w,h):
 result=[]
 for p in placed:
  clipped=[]
  for x,y,fw,fh in p['footprints']:
   x0,y0=max(0,x),max(0,y);x1,y1=min(w,x+fw),min(h,y+fh)
   if x1>x0 and y1>y0:clipped.append([x0,y0,x1-x0,y1-y0])
  result.append({'footprints':clipped})
 return result
def library(folder,manifest):
 data=json.loads((folder/manifest).read_text());result={}
 for p in data['pieces']+data.get('reusedPieces',[]):
  result[p['id']]=dict(id=p['id'],file=relative((folder/p['file']).resolve()),size=p['size'],footprints=p['footprints'],footPoint=p['footPoint'],feetLine=p.get('feetLine',p['footPoint'][1]),renderLayer=p['renderLayer'],kind=p.get('kind','WALL' if p['footprints'] else 'WALK-THROUGH'),previousManifest=relative(folder/manifest),reused=True)
 return result
def prepare(plan):
 hero=Image.open(V4/'house-ground-floor/reference/hero-56x60.png').convert('RGBA');pieces=[]
 for p in plan:
  source=ROOT/'sources'/(p['id']+'.png');im=Image.open(source).convert('RGBA')
  box=im.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox();cut=im.crop(box)
  w,h=p['size'];l,t,r,b=p['targetBounds'];f=3
  cut.thumbnail(((r-l)*f,(b-t)*f),Image.Resampling.LANCZOS)
  fit=[l*f+((r-l)*f-cut.width)//2,b*f-cut.height,*cut.size]
  work=Image.new('RGBA',(w*f,h*f));work.alpha_composite(cut,tuple(fit[:2]))
  working='working/'+p['id']+'-3x.png';work.save(OUT/working)
  art=paint.palette_map(paint.mode_reduce(work,w,h,f),p);file=p['id']+'-v3.png';art.save(OUT/file)
  bounds=art.getbbox();line=bounds[3]-1
  record=dict(id=p['id'],file=file,room=p['room'],size=[w,h],previousSize=p['previousSize'],requestedFactor=p['requestedFactor'],renderLayer=p['renderLayer'],kind='WALL' if p['footprints'] else 'WALK-THROUGH',feetLine=line,footPoint=[w//2,line],footprints=p['footprints'],visibleBounds=list(bounds),source='../sources/'+source.name,sourceSize=list(im.size),sourceCrop=list(box),sourceFit=fit,working=working,workingSize=list(work.size),reductionFactor=f,previousArt=relative((ROOT/p['previousArt']).resolve()),description=p['description'])
  old=Image.open(ROOT/p['previousArt']).convert('RGBA')
  cw=max(520,w+old.width+180);ch=max(h,old.height,60)+72
  comparison=Image.new('RGBA',(cw,ch),PALETTE[6]);d=ImageDraw.Draw(comparison)
  d.text((8,4),p['id'],font=FONT,fill=PALETTE[0]);d.text((8,26),'HERO 1X',font=FONT,fill=PALETTE[0]);d.text((80,26),'NEW 1X',font=FONT,fill=PALETTE[0]);d.text((w+104,26),'CURRENT 1X',font=FONT,fill=PALETTE[0])
  for image,at in [(hero,(8,ch-64)),(art,(80,ch-h-4)),(old,(w+104,ch-old.height-4))]:comparison.alpha_composite(image,at)
  record['comparison1x']='checks/'+p['id']+'-hero-1x.png';comparison.save(OUT/record['comparison1x']);pieces.append(record)
 return pieces,hero

def compose(pieces,hero):
 g=library(GROUND,'manifest-ground-floor.json');u=library(UP,'manifest-upstairs.json')
 g['round-coffee-table']['file']=relative(UP/'coffee-table-oak-v1.png')
 g['bird-of-paradise-original']=dict(g['bird-of-paradise'],id='bird-of-paradise-original')
 fresh={p['id']:p for p in pieces}
 saved=json.loads((PROJECT/'docs/plans/house-layout/rami-layout-nov13.json').read_text())['rooms']
 rects={'living':[16,16,768,345],'dining-desk-shared':[184,361,600,322],'kitchen':[368,699,416,332],'abe-room':[180,951,604,406]}
 doors={'living':[['patio','north',64,184],['dining','south',656,768]],'dining-desk-shared':[['living','north',488,600],['hall','south',16,152]],'kitchen':[['hall','west',0,332],['breakfast-nook','south',0,296]],'abe-room':[['hall','north',20,164],['closet','west',196,292]]}
 views=[];allplaced=[];reports={};used={}
 for name,rect in rects.items():
  _,_,w,h=rect;lookup=dict(u if name=='abe-room' else g);lookup.update(fresh)
  items=saved['up-abe-room' if name=='abe-room' else name];placed=[]
  for index,(editor_id,x,y,sc,rot) in enumerate(items):
   id='bird-of-paradise-original' if editor_id=='bird-of-paradise' and sc!=80 else editor_id
   p=lookup[id];used[id]=p
   placed.append(dict(id=id,editorId=editor_id,instance=index,at=[x,y],room=name,layer=p['renderLayer'],footprints=[[x+fx,y+fy,fw,fh] for fx,fy,fw,fh in p['footprints']],sourcePosition=[x,y],editorRequestedScale=sc,editorRequestedRotation=rot,scaleApplied=1,rotationApplied=0,repainted=id in fresh))
  minx=min([0]+[p['at'][0] for p in placed]);miny=min([-128]+[p['at'][1] for p in placed])
  maxx=max([w]+[p['at'][0]+lookup[p['id']]['size'][0] for p in placed]);maxy=max([h]+[p['at'][1]+lookup[p['id']]['size'][1] for p in placed])
  left=32-minx;top=32-miny;canvas=Image.new('RGBA',(left+maxx+32,top+maxy+56),PALETTE[0])
  floor=Image.open(V4/('house-ground-floor/beige-carpet-v1.png' if name=='abe-room' else 'house-ground-floor/dark-wood-floor-v1.png')).convert('RGBA')
  rooms_api.tile(canvas,floor,(left,top,w,h))
  strip=Image.open(V4/'house-ground-floor/north-wall-strip-v1.png').convert('RGBA')
  rooms_api.tile(canvas,strip.crop((0,0,strip.width,32)),(left,top-128,w,32));rooms_api.tile(canvas,strip,(left,top-96,w,96))
  edge=Image.open(V4/'house-ground-floor/side-wall-strip-v1.png').convert('RGBA')
  rooms_api.tile(canvas,edge,(left-16,top,16,h));rooms_api.tile(canvas,edge,(left+w,top,16,h))
  for _,side,lo,hi in doors[name]:
   if side=='north' and name=='abe-room':continue
   opening={'north':(left+lo,top-128,hi-lo,128),'south':(left+lo,top+h,hi-lo,16),'west':(left-16,top+lo,16,hi-lo),'east':(left+w,top+lo,16,hi-lo)}[side]
   rooms_api.tile(canvas,floor,opening)
  for p in sorted(placed,key=lambda p:(0 if p['layer']=='ground' else 1 if p['layer']=='wall-mounted' else 2,p['at'][1]+lookup[p['id']]['footPoint'][1])):
   canvas.alpha_composite(Image.open(OUT/lookup[p['id']]['file']).convert('RGBA'),(left+p['at'][0],top+p['at'][1]))
  # Clip before using the shared flood fill. A hanging plant wholly above the
  # floor must not become a negative NumPy slice that blocks most of the room.
  route_placed=floor_footprints(placed,w,h)
  report,good=rooms_api.route_check((w,h),route_placed,doors[name],[d[0] for d in doors[name]])
  overlaps=[];outside=[];overhang=[]
  for i,p in enumerate(placed):
   if p['at'][0]<0 or p['at'][1]<-128 or p['at'][0]+lookup[p['id']]['size'][0]>w or p['at'][1]+lookup[p['id']]['size'][1]>h:
    overhang.append(dict(id=p['id'],instance=i,at=p['at'],size=lookup[p['id']]['size'],repainted=p['repainted']))
   for x,y,fw,fh in p['footprints']:
    if x<0 or y<0 or x+fw>w or y+fh>h:outside.append(dict(id=p['id'],instance=i,footprint=[x,y,fw,fh],repainted=p['repainted']))
   for q in placed[i+1:]:
    for x,y,fw,fh in p['footprints']:
     for qx,qy,qw,qh in q['footprints']:
      if max(x,qx)<min(x+fw,qx+qw) and max(y,qy)<min(y+fh,qy+qh):overlaps.append(dict(left=p['id'],right=q['id'],rect=[max(x,qx),max(y,qy),min(x+fw,qx+qw)-max(x,qx),min(y+fh,qy+qh)-max(y,qy)]))
  connected=max((c['positions'] for c in good),default=0)
  report.update(footprintOverlaps=overlaps,footprintsOutsideFloor=outside,artOverhangs=overhang,unreachableClearSquares=sum(c['positions'] for c in report['components'])-connected,layoutSource='docs/plans/house-layout/rami-layout-nov13.json',positionsPreserved=True)
  report['layoutNeedsReview']=not report['passed'] or bool(overlaps) or bool([p for p in outside if p['repainted']]) or report['unreachableClearSquares']>0
  report['note']='Saved editor positions are authoritative. No runtime nudges, scale or rotation applied. Route result concerns door connectivity; overlaps, clear pockets and overhangs are reported separately. New art is not integrated.'
  reports[name]=report
  centers=good[0]['previewCenters'] if good else next((c['previewCenters'] for c in sorted(report['components'],key=lambda c:-c['positions'])),[])
  cx,cy=centers[len(centers)//2] if centers else [w//2,h//2];canvas.alpha_composite(hero,(left+cx-28,top+cy-30))
  d=ImageDraw.Draw(canvas);d.text((left,top+maxy+24),f'96px DOORS: {"PASS" if report["passed"] else "FAIL"}  /  '+('LAYOUT NEEDS REVIEW' if report['layoutNeedsReview'] else 'LAYOUT CLEAR'),font=FONT,fill=PALETTE[8])
  native='mockups/'+name+'-1x.png';large='mockups/'+name+'-3x.png';canvas.save(OUT/native);canvas.resize((canvas.width*3,canvas.height*3),Image.Resampling.NEAREST).save(OUT/large)
  overlay=canvas.copy();d=ImageDraw.Draw(overlay);d.rectangle((left,top,left+w-1,top+h-1),outline=PALETTE[4])
  for p in placed:
   for x,y,fw,fh in p['footprints']:d.rectangle((left+x,top+y,left+x+fw-1,top+y+fh-1),outline=PALETTE[10])
  for c in good:
   for x,y in c['previewCenters']:d.point((left+x,top+y),fill=PALETTE[4])
  for _,side,lo,hi in doors[name]:
   line={'north':(left+lo,top,left+hi-1,top),'south':(left+lo,top+h-1,left+hi-1,top+h-1),'west':(left,top+lo,left,top+hi-1),'east':(left+w-1,top+lo,left+w-1,top+hi-1)}[side];d.line(line,fill=PALETTE[8],width=2)
  ofile='mockups/'+name+'-footprints-3x.png';overlay.save(OUT/ofile.replace('-3x','-1x'));overlay.resize((overlay.width*3,overlay.height*3),Image.Resampling.NEAREST).save(OUT/ofile)
  views.append(dict(id=name,rect=rect,file=large,overlay=ofile,canvasFloorOrigin=[left,top],note='Exact saved editor coordinates. Native-size paintings, no piece transforms. Canvas extends to show overhanging art without cropping.'))
  allplaced+=placed
 write(OUT/'route-checks.json',reports)
 write(OUT/'mockups/room-layout.json',dict(views=views,placements=allplaced,routeChecks=reports,status='Art review only. Saved layout needs clearance review where flagged. Nothing placed in game.'))
 return views,reports,[p for p in used.values() if p.get('reused')]

def validate(pieces,views):
 checks=[];palette={tuple(bytes.fromhex(c[1:])) for c in PALETTE}
 for p in pieces:
  art=Image.open(OUT/p['file']).convert('RGBA');a=np.array(art);w,h=p['size'];work=Image.open(OUT/p['working']).convert('RGBA')
  colors=set(map(tuple,a[:,:,:3][a[:,:,3]>0].tolist()));l,t,r,b=p['visibleBounds']
  c=dict(id=p['id'],size=art.size==(w,h),exactWorking=work.size==(w*3,h*3),exactReduction=np.array_equal(np.array(paint.palette_map(paint.mode_reduce(work,w,h,3),p)),a),palette=colors<=palette,threeTones=len(colors)>=3,binaryAlpha=set(a[:,:,3].ravel())<={0,255},boundedFootprints=all(l<=x and t<=y and x+fw<=r and y+fh<=b and fw>0 and fh>0 for x,y,fw,fh in p['footprints']),sha256=hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest())
  checks.append(c)
 for v in views:
  for file in [v['file'],v['overlay']]:
   n=np.array(Image.open(OUT/file.replace('-3x','-1x')));big=np.array(Image.open(OUT/file));assert np.array_equal(big,n.repeat(3,0).repeat(3,1)),file
 passed=len(pieces)==10 and all(v for c in checks for v in c.values() if isinstance(v,bool))
 write(OUT/'validation.json',dict(passed=passed,expectedPieces=10,actualPieces=len(pieces),checks=checks,exact3xPreviews=True))
 assert passed,'See validation.json: asset export checks failed (layout constraints are separate).'

def review(pieces,views,reports):
 css='body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{padding:var(--ms-space-5)}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}figure{margin:0;overflow:auto}img{image-rendering:pixelated;max-width:none}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}article{padding-block:var(--ms-space-4);border-top:var(--ms-border-w) solid var(--ms-line)}'
 body='<h1>House repaints: round three</h1><p>Ten new painted variants. Nothing placed in game. Saved editor positions are preserved, with no runtime nudges or piece transforms. Overhanging art stays visible in the enlarged review canvases. Clearance failures and overlaps remain flagged.</p><p><a href="manifest-round3.json">Manifest</a> · <a href="mockups/room-layout.json">Editor layout</a> · <a href="route-checks.json">Clearance</a> · <a href="validation.json">Asset validation</a> · <a href="../prompts.json">Painting prompts</a> · <a href="../README.md">Notes</a></p>'
 for v in views:
  r=reports[v['id']];body+=f'<article><h2>{v["id"]}</h2><p>96px door route: {"PASS" if r["passed"] else "FAIL"}. Footprint overlaps: {len(r["footprintOverlaps"])}. Clear positions outside the door-connected region: {r["unreachableClearSquares"]}. '+('Layout needs review before placement.' if r['layoutNeedsReview'] else 'Door-connected layout is clear.')+f'</p><figure><img alt="{v["id"]} at exact 3x, saved positions" src="{v["file"]}"></figure><details><summary>Footprints, room boundary and doors</summary><figure><img alt="{v["id"]} footprint check" src="{v["overlay"]}"></figure></details></article>'
 for p in pieces:body+=f'<article><h2>{p["id"]}: {p["size"][0]} x {p["size"][1]}</h2><figure><img alt="{p["id"]} new and current at native size with hero" src="{p["comparison1x"]}"></figure></article>'
 (OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>House round-three review</title><link rel="stylesheet" href="../../../../../ui/ms-tokens.css"><style>'+css+'</style><main>'+body+'</main></html>')

def build():
 for folder in ['working','checks','mockups']:(OUT/folder).mkdir(parents=True,exist_ok=True)
 plan=json.loads((ROOT/'generation-plan.json').read_text());pieces,hero=prepare(plan);views,reports,reused=compose(pieces,hero)
 write(OUT/'manifest-round3.json',dict(status='Art review only. Nothing placed in game.',method='Built-in imagegen repaints, proportional fits to exact 3x working canvases, whole-number reduction and material-family palette mapping. No stretched room pieces or procedural art.',privacy='New paintings contain no people, faces, names or logos. Only public existing art is referenced.',layoutSource='docs/plans/house-layout/rami-layout-nov13.json',pieces=pieces,reusedPieces=reused,palette=PALETTE))
 validate(pieces,views);review(pieces,views,reports)
 print('Built 10 painted variants and 4 exact Rami-layout room views. Door routes:',{k:v['passed'] for k,v in reports.items()})
if __name__=='__main__':build()
