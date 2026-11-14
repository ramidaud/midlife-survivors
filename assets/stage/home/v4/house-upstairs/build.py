"""Build art-only upstairs review. Run with Pillow + NumPy; no runtime writes."""
from pathlib import Path
import json, importlib.util, hashlib
import sys
sys.dont_write_bytecode=True
from collections import deque
from PIL import Image, ImageDraw, ImageFont
import numpy as np
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parent/'house-ground-floor'
REPAINT=BASE/'repaint/deliver'
OUT=ROOT/'deliver'
FONT=ImageFont.load_default(size=14)
PALETTE=json.loads((BASE/'reference/palette.json').read_text())
spec=importlib.util.spec_from_file_location('paint_reduction', BASE/'build.py')
reduction=importlib.util.module_from_spec(spec);spec.loader.exec_module(reduction)

def savejson(path,data):path.write_text(json.dumps(data,indent=2)+'\n')
def tile(canvas,art,rect):
 x,y,w,h=rect
 for yy in range(y,y+h,art.height):
  for xx in range(x,x+w,art.width):
   canvas.alpha_composite(art.crop((0,0,min(art.width,x+w-xx),min(art.height,y+h-yy))),(xx,yy))

def route_check(size,placed,doors,required):
 """Exact native-pixel flood fill of collision-free 96x96 squares, checked at real doors."""
 w,h=size;n=96;mask=np.zeros((h,w),dtype=np.int32)
 for p in placed:
  for x,y,fw,fh in p['footprints']:
   mask[max(0,y):min(h,y+fh),max(0,x):min(w,x+fw)]=1
 sums=np.pad(mask,((1,0),(1,0))).cumsum(0).cumsum(1)
 free=sums[n:,n:]-sums[:-n,n:]-sums[n:,:-n]+sums[:-n,:-n]==0
 labels=np.full(free.shape,-1,dtype=np.int32);components=[]
 for sy,sx in zip(*np.where(free)):
  if labels[sy,sx]>=0:continue
  idx=len(components);labels[sy,sx]=idx;q=deque([(int(sx),int(sy))]);points=[];hit=set();count=0
  while q:
   x,y=q.popleft();count+=1
   if x%16==0 and y%16==0:points.append([x+48,y+48])
   for name,edge,lo,hi in doors:
    edge_reached={'north':y==0,'south':y==h-n,'west':x==0,'east':x==w-n}[edge]
    t=x if edge in ('north','south') else y
    if edge_reached and lo<=t and t+n<=hi:hit.add(name)
   for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
    if 0<=ny<free.shape[0] and 0<=nx<free.shape[1] and free[ny,nx] and labels[ny,nx]<0:
     labels[ny,nx]=idx;q.append((nx,ny))
  components.append(dict(positions=count,doors=sorted(hit),previewCenters=points))
 good=[c for c in components if set(required)<=set(c['doors'])]
 return dict(clearance=96,passed=bool(good),requiredDoors=required,openingsChecked=doors,components=components,
             note='Exact 96x96 square clearance against proposed footprints at actual floor-plan openings. One exit where the existing plan has one; no new runtime openings proposed.'),good

def build():
 for d in ('working','checks','mockups'): (OUT/d).mkdir(parents=True,exist_ok=True)
 plan=json.loads((ROOT/'generation-plan.json').read_text());pieces=[]
 hero=Image.open(BASE/'reference/hero-56x60.png').convert('RGBA')
 # Extract existing unscaled upstairs pieces for honest same-subject comparisons.
 data=json.loads((ROOT/'reference-layout.json').read_text());atlas=Image.open(BASE.parents[1]/'v2/house2-floor2-pieces.png').convert('RGBA')
 for p in plan:
  source=ROOT/'sources'/(p['id']+'.png')
  if not source.exists():raise FileNotFoundError(source)
  im=Image.open(source).convert('RGBA');box=im.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox()
  if not box:raise ValueError('Empty painting '+p['id'])
  cut=im.crop(box);w,h=p['size'];factor=3;work=Image.new('RGBA',(w*factor,h*factor))
  cut.thumbnail(((w-4)*factor,(h-4)*factor),Image.Resampling.LANCZOS)
  fit=[(work.width-cut.width)//2,work.height-2*factor-cut.height,*cut.size]
  work.alpha_composite(cut,tuple(fit[:2]));working='working/'+p['id']+'-3x.png';work.save(OUT/working)
  art=reduction.palette_map(reduction.mode_reduce(work,w,h,3),dict(id=p['id']))
  file=p['id']+'-v1.png';art.save(OUT/file)
  bounds=art.getbbox();line=bounds[3]-1;fp=p['footprints']
  record=dict(id=p['id'],file=file,room=p['room'],size=[w,h],kind='WALL' if fp else 'WALK-THROUGH',renderLayer=p['renderLayer'],feetLine=line,footPoint=[w//2,line],footprints=fp,visibleBounds=list(bounds),source='../sources/'+source.name,sourceSize=list(im.size),sourceCrop=list(box),sourceFit=fit,working=working,workingSize=list(work.size),reductionFactor=3,description=p['description'])
  old=None
  if p.get('oldReference'):
   frame=data['frames'].get('f2_p_'+p['oldReference'])
   if frame:
    x,y,ow,oh=frame;old=atlas.crop((x,y,x+ow,y+oh))
  ch=max(h,60,old.height if old else 0)+72;cw=max(420,w+220+(old.width if old else 0))
  comparison=Image.new('RGBA',(cw,ch),PALETTE[6]);d=ImageDraw.Draw(comparison)
  d.text((8,4),p['id'],font=FONT,fill=PALETTE[0]);d.text((8,26),'HERO 1X',font=FONT,fill=PALETTE[0]);d.text((84,26),'NEW 1X',font=FONT,fill=PALETTE[0])
  comparison.alpha_composite(hero,(8,ch-64));comparison.alpha_composite(art,(84,ch-h-4))
  if old:
   d.text((w+108,26),'OLD 1X',font=FONT,fill=PALETTE[0]);comparison.alpha_composite(old,(w+108,ch-old.height-4))
  record['comparison1x']='checks/'+p['id']+'-hero-1x.png';comparison.save(OUT/record['comparison1x']);pieces.append(record)
 # Existing kit pieces are referenced, never recopied along with duplicate source folders.
 reuse={'bedroom-carpet':(BASE/'beige-carpet-v1.png','ground'), 'north-wall':(BASE/'north-wall-strip-v1.png','wall-mounted'), 'side-wall':(BASE/'side-wall-strip-v1.png','wall-mounted'),
        'laundry-basket':(REPAINT/'laundry-basket-v1.png','furniture'), 'window-east':(REPAINT/'window-blinds-east-v1.png','wall-mounted'), 'moon-print':(REPAINT/'moon-print-v1.png','wall-mounted')}
 lookup={p['id']:p for p in pieces}
 for id,(path,layer) in reuse.items():
  art=Image.open(path).convert('RGBA');w,h=art.size
  fp=[] if layer!='furniture' else [[w//4,max(0,h-20),max(1,w//2),16]]
  lookup[id]=dict(id=id,file=__import__('os').path.relpath(path,OUT),size=[w,h],footPoint=[w//2,h-1],footprints=fp,renderLayer=layer,reused=True)
 manifest=dict(status='Art review only. Nothing placed in game.',method='Built-in imagegen, proportionally fitted to exact 3x working canvases, whole-number block-mode reduction, material-family palette mapping. No procedural world artwork.',privacy='Written brief and public game art only; private reference photos were not attached to this chat. No people, faces, license plates or identifying text. ABE tiles are explicitly permitted.',layoutSource='src/data/house-v2.js floor2, existing room sizes and openings unchanged.',coordinates='Native room-local pixels; wall art y is -128 to 0. Footprints [x,y,w,h], feetLine y, footPoint [x,y]. Depth uses the foot point, ground first, wall-mounted decor separately.',palette=PALETTE,pieces=pieces,reusedPieces=[v for v in lookup.values() if v.get('reused')])
 manifest['coffeeTableFix']='coffee-table-manifest.json'
 manifest['reviewRevision']='Generic space poster/game-pad neon; denser room edges and unique pictures; full Abe north wall with painted open doorway. Current prompts are in ../review-revision-prompts.json.'
 savejson(OUT/'manifest-upstairs.json',manifest)
 rooms=room_recipes()
 views=[];placements=[];reports={};coverage={}
 for name,r in rooms.items():
  _,_,w,h=r['rect'];pad=160;canvas=Image.new('RGBA',(w+32,h+pad+40),PALETTE[0])
  carpet=Image.open(BASE/'beige-carpet-v1.png').convert('RGBA')
  if name=='bathroom':
   fx,fy,fw,fh=data['frames']['f2_floor_bathroom'];carpet=atlas.crop((fx,fy,fx+fw,fy+fh))
  tile(canvas,carpet,(16,pad,w,h))
  # A 128px face assembled from unscaled 96px strip: repeat upper plaster for 32px, keep baseboard at floor.
  strip=Image.open(BASE/'north-wall-strip-v1.png').convert('RGBA')
  tile(canvas,strip.crop((0,0,strip.width,32)),(16,pad-128,w,32));tile(canvas,strip,(16,pad-96,w,96))
  edge=Image.open(BASE/'side-wall-strip-v1.png').convert('RGBA');tile(canvas,edge,(0,pad,16,h));tile(canvas,edge,(w+16,pad,16,h))
  # Cut actual openings out of the painted wall strips using the room's own
  # ground texture. Assembly of existing paintings adds no procedural world art.
  for _,side,lo,hi in r['doors']:
   if side=='north' and r.get('continuousNorthFace'):continue
   opening={'north':(16+lo,pad-128,hi-lo,128),'south':(16+lo,pad+h,hi-lo,16),'west':(0,pad+lo,16,hi-lo),'east':(16+w,pad+lo,16,hi-lo)}[side]
   tile(canvas,carpet,opening)
  placed=[]
  for id,x,y in r['items']:
   p=lookup[id];fp=[[x+fx,y+fy,fw,fh] for fx,fy,fw,fh in p['footprints']]
   assert all(0<=fx and 0<=fy and fx+fw<=w and fy+fh<=h for fx,fy,fw,fh in fp),(name,id,'footprint outside floor')
   if id=='north-doorway':
    assert y==-128 and any(side=='north' and x==lo and x+p['size'][0]==hi for _,side,lo,hi in r['doors'])
   elif p['renderLayer']=='wall-mounted' and id not in ('hall-decor-east','hall-decor-west','window-east'):
    assert -128<=y and y+p['size'][1]<=0,(name,id,'north decor outside wall face')
    assert all(x+p['size'][0]<=lo or x>=hi for _,side,lo,hi in r['doors'] if side=='north'),(name,id,'decor over north doorway')
   placed.append(dict(id=id,at=[x,y],footprints=fp,layer=p['renderLayer'],sourcePosition=[x,y],rotationApplied=0,scaleApplied=1,room=name))
  for p in sorted(placed,key=lambda p:(0 if p['layer']=='ground' else 1 if p['layer']=='wall-mounted' else 2,p['at'][1]+lookup[p['id']]['footPoint'][1])):
   canvas.alpha_composite(Image.open(OUT/lookup[p['id']]['file']).convert('RGBA'),(p['at'][0]+16,p['at'][1]+pad))
  for i,left in enumerate(placed):
   for right in placed[i+1:]:
    for x,y,fw,fh in left['footprints']:
     for rx,ry,rw,rh in right['footprints']:
      assert x+fw<=rx or rx+rw<=x or y+fh<=ry or ry+rh<=y,(name,left['id'],right['id'],'overlapping footprints')
  report,good=route_check((w,h),placed,r['doors'],[d[0] for d in r['doors']]);reports[name]=report
  if name in ('master-bedroom','abe-room','walk-in-closet','hall','linen','utility'):
   from edge_coverage import check
   coverage[name]=check(r,placed,lookup)
  if r.get('continuousNorthFace'):
   report['northWallFace']={'height':128,'continuous':True,'doorStyle':'painted-open-oak-frame','carpetCutout':False}
  if name=='abe-room':
   square=[164,136,224,224]
   report['mainOpenSquare']=square
   sx,sy,sw,sh=square
   report['mainOpenSquarePassed']=all(x+fw<=sx or sx+sw<=x or y+fh<=sy or sy+sh<=y for p in placed for x,y,fw,fh in p['footprints'])
   assert report['mainOpenSquarePassed']
  centers=good[0]['previewCenters'] if good else []
  center=centers[len(centers)//2] if centers else [w//2,h//2]
  if r.get('heroAt'):center=r['heroAt']
  canvas.alpha_composite(hero,(16+center[0]-28,pad+center[1]-30))
  d=ImageDraw.Draw(canvas);d.text((16,pad+h+24),('96px ROUTE PASS' if report['passed'] else 'ROUTE FAIL'),font=FONT,fill=PALETTE[8])
  if r.get('note'):report['planConstraint']=r['note']
  native='mockups/'+name+'-1x.png';large='mockups/'+name+'-3x.png';canvas.save(OUT/native);canvas.resize((canvas.width*3,canvas.height*3),Image.Resampling.NEAREST).save(OUT/large)
  overlay=canvas.copy();d=ImageDraw.Draw(overlay)
  for p in placed:
   for x,y,fw,fh in p['footprints']:d.rectangle((16+x,pad+y,16+x+fw-1,pad+y+fh-1),outline=PALETTE[10])
  for c in good:
   for x,y in c['previewCenters']:d.point((16+x,pad+y),fill=PALETTE[4])
  for label,edge,lo,hi in r['doors']:
   xy={'north':(16+lo,pad,16+hi-1,pad),'south':(16+lo,pad+h-1,16+hi-1,pad+h-1),'west':(16,pad+lo,16,pad+hi-1),'east':(16+w-1,pad+lo,16+w-1,pad+hi-1)}[edge]
   d.line(xy,fill=PALETTE[8],width=2)
  overlayfile='mockups/'+name+'-footprints-3x.png';overlay.save(OUT/('mockups/'+name+'-footprints-1x.png'));overlay.resize((overlay.width*3,overlay.height*3),Image.Resampling.NEAREST).save(OUT/overlayfile)
  views.append(dict(id=name,file=large,overlay=overlayfile,rect=r['rect'],note=r.get('note','Existing plan, native assets, 128px north wall, exact 3x nearest-neighbor. No runtime placement.')));placements+=placed
 savejson(OUT/'mockups/room-layout.json',dict(views=views,placements=placements,routeChecks=reports,status='Awaiting Rami approval. No game placement.'))
 savejson(OUT/'route-checks.json',reports)
 savejson(OUT/'edge-coverage.json',coverage)
 import coffee_table
 coffee_table.build(ROOT,OUT,BASE)
 validate(plan,pieces,views,reports)
 review(pieces,views,reports)
 print('Built',len(pieces),'new paintings;',len(views),'rooms;',sum(r['passed'] for r in reports.values()),'route passes')

def room_recipes():
 return json.loads((ROOT/'placements-review.json').read_text())

def validate(plan,pieces,views,reports):
 checks=[];palette=set(tuple(bytes.fromhex(c[1:])) for c in PALETTE)
 for p in pieces:
  im=Image.open(OUT/p['file']).convert('RGBA');a=np.array(im);w,h=p['size'];colors=set(map(tuple,a[:,:,:3][a[:,:,3]>0].tolist()))
  working=Image.open(OUT/p['working']).convert('RGBA');recomputed=reduction.palette_map(reduction.mode_reduce(working,w,h,3),dict(id=p['id']))
  left,top,right,bottom=p['visibleBounds']
  assert all(left<=x and x+fw<=right and top<=y and y+fh<=bottom for x,y,fw,fh in p['footprints']),(p['id'],'footprint exceeds painted object')
  checks.append(dict(id=p['id'],size=list(im.size)==[w,h],sourceExists=(OUT/p['source']).exists(),exactWorking=working.size==(w*3,h*3),exactReduction=np.array_equal(np.array(recomputed),a),palette=colors<=palette,threeTones=len(colors)>=3,binaryAlpha=set(a[:,:,3].ravel())<={0,255},boundedFootprints=all(x>=0 and y>=0 and fw>0 and fh>0 and x+fw<=w and y+fh<=h for x,y,fw,fh in p['footprints']),sha256=hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()))
 for v in views:
  native=np.asarray(Image.open(OUT/v['file'].replace('-3x','-1x')));large=np.asarray(Image.open(OUT/v['file']))
  assert np.array_equal(large,np.repeat(np.repeat(native,3,0),3,1)),v['id']
 passed=all(value for c in checks for value in c.values() if isinstance(value,bool)) and all(r['passed'] for r in reports.values())
 savejson(OUT/'validation.json',dict(passed=passed,expectedPieces=len(plan),actualPieces=len(pieces),checks=checks,allDoorRoutesPassed=all(r['passed'] for r in reports.values()),exact3xPreviews=True))
 assert passed,'See deliver/validation.json or route-checks.json'

def review(pieces,views,reports):
 style='body{background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read);margin:0}main{padding:var(--ms-space-5)}a{color:var(--ms-text);display:inline-flex;min-height:var(--ms-touch);align-items:center}figure{margin:0;overflow:auto}img{image-rendering:pixelated;max-width:none}article{border-top:var(--ms-border-w) solid var(--ms-line);padding-block:var(--ms-space-4)}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}'
 body='<h1>Upstairs art review</h1><p>PR #11 room revisions: generic space and game-pad art, fuller room edges, distinct pictures, and Abe’s full north wall with a painted open doorway. Nothing placed in the game. Painted from the written brief; private photos were not attached. ABE tiles are permitted. No people, faces, real trademarks or license plates.</p><p><a href="manifest-upstairs.json">Manifest</a> · <a href="mockups/room-layout.json">Layout editor data</a> · <a href="route-checks.json">Door routes</a> · <a href="edge-coverage.json">Wall coverage</a> · <a href="validation.json">Validation</a> · <a href="../review-revision-prompts.json">Current painting prompts</a> · <a href="../generation-plan.json">Piece specifications</a> · <a href="../README.md">Notes</a></p><p>Every preview is exact 3x nearest-neighbor. Scroll sideways at small sizes to inspect real pixels. Red outlines are footprints; sage points are centers of clear 96px squares; cream marks actual door openings. Rugs and runners are flat and do not block movement. The main bedroom has the twins corner. The 144px hall is narrower than the 224px target in the existing floor plan.</p>'
 for v in views:
  body+=f'<article><h2>{v["id"]}: 96px route {"PASS" if reports[v["id"]]["passed"] else "FAIL"}</h2><p>{v["note"]}</p><figure><img alt="{v["id"]} room at 3x with hero" src="{v["file"]}"></figure><details><summary>Footprints and route</summary><figure><img alt="{v["id"]} collision footprints and route centers" src="{v["overlay"]}"></figure></details></article>'
 body+='<h2>Coffee table: warm light oak</h2><p>Same native size, alpha silhouette, footprint and prop pixels. Only the connected light tabletop material is repainted with three oak tones.</p><p><a href="coffee-table-manifest.json">Coffee-table checks</a></p><figure><img alt="Hero and coffee table before and after oak repaint at 1x" src="checks/coffee-table-oak-hero-1x.png"></figure><h2>Pieces against the hero at 1x</h2>'
 for p in pieces:body+=f'<article><h2>{p["id"]}</h2><figure><img alt="{p["id"]} with native hero and old piece when available" src="{p["comparison1x"]}"></figure></article>'
 (OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Upstairs art review</title><link rel="stylesheet" href="../../../../../ui/ms-tokens.css"><style>'+style+'</style><main>'+body+'</main></html>')
if __name__=='__main__':build()
