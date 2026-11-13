from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,numpy as np
FONT=ImageFont.load_default(size=14)
def tile(dst,im,rect):
 x,y,w,h=rect
 for yy in range(y,y+h,im.height):
  for xx in range(x,x+w,im.width):dst.alpha_composite(im.crop((0,0,min(im.width,x+w-xx),min(im.height,y+h-yy))),(xx,yy))
def routes(size,placements):
 # A 96x96 square must fit at each traversed native-pixel position.
 w,h=size;mask=np.zeros((h,w),dtype=np.int32)
 for p in placements:
  for x,y,fw,fh in p['footprints']:
   x0=max(0,x);y0=max(0,y);x1=min(w,x+fw);y1=min(h,y+fh)
   if x1>x0 and y1>y0:mask[y0:y1,x0:x1]=1
 sums=np.pad(mask,((1,0),(1,0))).cumsum(0).cumsum(1);n=96
 free=(sums[n:,n:]-sums[:-n,n:]-sums[n:,:-n]+sums[:-n,:-n])==0
 seen=set();components=[]
 for sy,sx in zip(*np.where(free)):
  if (int(sx),int(sy)) in seen:continue
  stack=[(int(sx),int(sy))];seen.add(stack[0]);count=0;edges=set();points=[];boundary=[]
  while stack:
   x,y=stack.pop();count+=1
   if x==0:edges.add('west');boundary.append([x,y,'west'])
   if y==0:edges.add('north');boundary.append([x,y,'north'])
   if x==w-n:edges.add('east');boundary.append([x,y,'east'])
   if y==h-n:edges.add('south');boundary.append([x,y,'south'])
   if x%16==0 and y%16==0:points.append([x+48,y+48])
   for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
    if 0<=ny<free.shape[0] and 0<=nx<free.shape[1] and free[ny,nx] and (nx,ny) not in seen:seen.add((nx,ny));stack.append((nx,ny))
  components.append({'positions':count,'edges':sorted(edges),'previewCenters':points,'boundarySquares':boundary})
 good=[c for c in components if len(c['edges'])>=2]
 return {'clearance':96,'passed':bool(good),'components':components,'note':'96px square flood-fill over proposed footprints; boundary reach is a room-local clearance study. Runtime door connectivity is not tested.'}
def build(root,out,pieces,hero):
 base=root.parent;layout=json.loads((root/'placements.json').read_text())
 lookup={p['id']:p for p in pieces};views=[];allplaced=[];reports={}
 fixes={'living':{'cream-sofa':(0,64),'photo-ledges':(8,-112),'sim-cables':(512,224),'galaxy-wall-tv':(720,96),'fluted-media-console':(648,128),'racing-sim-rig':(400,160),'round-coffee-table':(156,176),'drum-floor-lamp':(672,8),'blanket-basket':(296,208),'leather-recliner':(440,0),'arched-floor-lamp':(560,-68),'tile-fireplace':(240,-40),'ornate-silver-mirror':(248,-104)},'dining-desk-shared':{'houseplant-cluster':(40,0),'mesh-office-chair':(440,-8),'kids-drawings':(160,-24),'dining-chair-north':(136,136),'dining-chair-south':(136,24),'dining-chair-east':(24,80),'dining-chair-west':(248,80),'window-blinds-east':None,'corner-computer-desk':(352,-48),'abstract-wall-painting':(136,-128),'moon-print':(280,-104)},'kitchen':{'white-oak-sink-counter':(0,-24),'white-oak-upper-cabinets':(0,-112),'stove-microwave':(192,-64),'kitchen-counter-east':(280,-24),'kitchen-counter-west':(0,224),'magnet-fridge':(320,216),'kitchen-runner':(184,64)},'entry':{'storage-bench-west':(0,120),'shoe-rack':(96,0)},'laundry-closet':{'laundry-basket':(48,104)}}
 for name,room in layout['rooms'].items():
  _,_,w,h=room['rect'];pad=160;canvas=Image.new('RGBA',(w+32,h+pad+16),'#171C35');floor=Image.open(base/'dark-wood-floor-v1.png').convert('RGBA');tile(canvas,floor,(16,pad,w,h));wall=Image.open(base/'north-wall-strip-v1.png').convert('RGBA');tile(canvas,wall,(16,pad-128,w,128));trim=Image.open((out/'side-wall-strip-v1.png') if (out/'side-wall-strip-v1.png').exists() else base/'side-wall-strip-v1.png').convert('RGBA');tile(canvas,trim,(0,pad,16,h));tile(canvas,trim,(w+16,pad,16,h));placed=[];counts={}
  items=list(room['items'])
  if name=='living':items += [dict(id='twin-bassinets',x=0,y=0),dict(id='side-table-lamp',x=128,y=264),dict(id='side-table-lamp',x=384,y=224),dict(id='twins-toy-bin',x=680,y=304)]
  if name=='dining-desk-shared':items += [dict(id='window-blinds-north',x=8,y=-112),dict(id='window-blinds-west',x=-8,y=24)]
  for item in items:
   id=item['id'];counts[id]=counts.get(id,0)+1
   if name=='living' and id=='photo-ledges' and counts[id]>1:continue
   if name=='kitchen' and id=='white-oak-upper-cabinets' and counts[id]>1:item=dict(item,x=208,y=-112)
   if name=='living' and id=='cream-sofa' and item.get('rot')==270:id='south-love-seat'
   p=lookup.get(id)
   if not p:continue
   xy=fixes.get(name,{}).get(id,(item['x'],item['y']))
   if name=='kitchen' and id=='white-oak-upper-cabinets' and counts[id]>1:xy=(208,-112)
   if xy is None:continue
   x,y=[round(v/8)*8 for v in xy]
   if id=='south-love-seat':x,y=192,264
   if id=='potted-pothos':x,y=(144 if counts[id]==1 else 432),-96
   if name=='living' and id=='window-olive-curtains':x,y=(112 if counts[id]==1 else 400),-128
   if name=='living' and id=='bird-of-paradise':x,y=(544 if counts[id]==1 else 176),-40
   # Keep furniture within side/south boundaries; north-wall overhang remains intentional.
   x=max(0,min(x,w-p['size'][0]));y=min(y,h-p['size'][1])
   fp=[[x+fx,y+fy,fw,fh] for fx,fy,fw,fh in p['footprints']]
   placed.append({'id':id,'at':[x,y],'footprints':fp,'layer':p['renderLayer'],'sourcePosition':[item['x'],item['y']],'rotationApplied':0,'scaleApplied':1})
  def key(p):return (0 if p['layer']=='ground' else 1 if p['layer']=='wall-mounted' else 2,p['at'][1]+lookup[p['id']]['footPoint'][1])
  for p in sorted(placed,key=key):canvas.alpha_composite(Image.open(out/lookup[p['id']]['file']).convert('RGBA'),(p['at'][0]+16,p['at'][1]+pad))
  if name=='laundry-closet':
   oldlayout=json.loads((root/'reference/house-layout.json').read_text());atlas=Image.open(root/'reference/existing-floor1-atlas.png').convert('RGBA')
   for old in oldlayout['pieces']:
    if old['room']!='laundry-closet':continue
    ax,ay,aw,ah=oldlayout['frames'][old['key']];px,py=old['at'][0]-room['rect'][0],old['at'][1]-room['rect'][1]
    canvas.alpha_composite(atlas.crop((ax,ay,ax+aw,ay+ah)),(px+16,py+pad))
    placed.append({'id':'existing-'+old['id'],'at':[px,py],'footprints':[[px,py,aw,ah]],'layer':'legacy','rotationApplied':0,'scaleApplied':1})
  report=routes((w,h),placed)
  openings={'living':{'north':[[64,184]],'south':[[168,768]]},'dining-desk-shared':{'north':[[0,600]],'south':[[16,152],[184,600]]},'kitchen':{'west':[[0,332]],'south':[[0,296]]},'entry':{'west':[[0,120]],'east':[[0,172]]},'laundry-closet':{'west':[[16,120]]}}[name]
  matched=[]
  for component in report['components']:
   exits=set()
   for bx,by,edge in component['boundarySquares']:
    t=bx if edge in ['north','south'] else by
    if any(lo<=t and t+96<=hi for lo,hi in openings.get(edge,[])):exits.add(edge)
   matched.append(sorted(exits))
  report['usableDoorEdgesPerComponent']=matched
  report['requiredExitCount']=1 if name=='laundry-closet' else 2
  report['doorClearancePassed']=any(len(x)>=report['requiredExitCount'] for x in matched)
  report['openingsChecked']=openings
  if name=='laundry-closet':report['existingConstraint']='Existing 104x136 laundry closet holds a washer/dryer and has one opening. A full 96px square cannot fit inside with the appliance. Basket is accessed from outside; no game layout change is proposed.'
  reports[name]=report
  # Put hero in a verified clear square, at native size, away from labels.
  candidates=[c for c,exits in zip(report['components'],matched) if len(exits)>=report['requiredExitCount']]
  center=(candidates[0]['previewCenters'][len(candidates[0]['previewCenters'])//2] if candidates and candidates[0]['previewCenters'] else [w//2,h//2]);
  if name!='laundry-closet':canvas.alpha_composite(hero,(center[0]-28+16,center[1]-30+pad))
  if name=='laundry-closet':
   reference=Image.new('RGBA',(max(240,canvas.width),canvas.height+76),'#171C35');reference.alpha_composite(canvas,(0,0));reference.alpha_composite(hero,(16,canvas.height+8));ImageDraw.Draw(reference).text((84,canvas.height+28),'HERO 56x60',font=FONT,fill='#FFF0CF');canvas=reference
  native=f'mockups/{name}-1x.png';large=f'mockups/{name}-3x.png';canvas.save(out/native);canvas.resize((canvas.width*3,canvas.height*3),Image.Resampling.NEAREST).save(out/large)
  overlay=canvas.copy();d=ImageDraw.Draw(overlay)
  for p in placed:
   for x,y,fw,fh in p['footprints']:d.rectangle((x+16,y+pad,x+fw+15,y+fh+pad-1),outline='#C45C4B',width=1)
  for c in candidates:
   for x,y in c['previewCenters']:d.point((x+16,y+pad),fill='#83A89A')
  check=f'mockups/{name}-footprints-1x.png';overlay.save(out/check);views.append({'id':name,'file':large,'overlay':check,'rect':room['rect'],'note':'Rami layout intent, grid-snapped and tidied; 3x nearest-neighbor. Green centers mark verified 96px clearance. No runtime placement.'});allplaced.extend(dict(p,room=name) for p in placed)
 (out/'mockups/room-layout.json').write_text(json.dumps({'views':views,'placements':allplaced,'routeChecks':reports,'status':'Awaiting approval. No game placement.'},indent=2)+'\n')
 (out/'route-checks.json').write_text(json.dumps(reports,indent=2)+'\n')
