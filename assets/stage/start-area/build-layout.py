"""Author the four-district campus slice, preserving the original start area. Optional offline tool, not a game build."""
from pathlib import Path
import json,math,random,sys
sys.dont_write_bytecode=True
from room_data import place_rooms
R=Path(__file__).resolve().parent;P=json.loads((R.parent/'campus-layout-v2.json').read_text());O=[3168,2448];C=16
specs={s['id']:s for f in ['batch-2a.json','batch-2b.json','batch-2c.json','batch-2d.json'] for s in json.loads((R.parent/'props'/f).read_text())}
for id in ['tidy','paperwork','lunch']:specs['desk_'+id]=dict(id='desk_'+id,frame=[96,104],footprint=dict(width=80,back=70,front=2),variants=1,file='../../desks/'+id+'-native.png',solid=True)
for id,frame,foot in [('printer',[80,80],[48,26,4]),('cabinet',[56,88],[38,40,4]),('plant',[48,64],[24,15,3])]:specs[id]=dict(id=id,frame=frame,footprint=dict(zip(['width','back','front'],foot)),variants=1,file='../../office-environment/'+id+'-native.png',solid=True)
for s in specs.values():
 if s['id'].startswith('desk_') and s['id'] not in ['desk_sleeper']:s['footprint']=dict(width=80,back=70,front=2)
specs['car_compact_campus']=dict(id='car_compact_campus',frame=[144,112],footprint=dict(width=118,back=56,front=6),variants=5,file='car_compact-campus-v2.png',solid=True,caption='')
D=[d for d in P['districts'] if d['id'] in ['lobby','bullpen','parking','breakroom']]
for reserve in P['combatSpaces']:
 if reserve['id']=='break-cafe':reserve['shape']=dict(type='rect',x=1120,y=2704,width=512,height=448)
def inside(x,y,poly):
 hit=False
 for i,(a,b) in enumerate(poly):
  c,d=poly[(i+1)%len(poly)]
  if (b>y)!=(d>y) and x<(c-a)*(y-b)/(d-b)+a:hit=not hit
 return hit
halls=[dict(x=1760,y=1616,width=832,height=224),dict(x=1856,y=2816,width=736,height=224),dict(x=912,y=1728,width=224,height=704),dict(x=2080,y=432,width=432,height=224),dict(x=2560,y=3632,width=368,height=224)]
def onfloor(x,y):return any(inside(x,y,d['polygon']) for d in D) or any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in halls)
walk={(x,y) for y in range(0,272) for x in range(0,480) if onfloor(x*C+8,y*C+8)}
def rectcells(r):return {(x,y) for y in range(math.floor(r['y']/C),math.ceil((r['y']+r['height'])/C)) for x in range(math.floor(r['x']/C),math.ceil((r['x']+r['width'])/C))}
reserves=set()
for r in P['combatSpaces']:
 if r['district'] not in ['lobby','bullpen','parking','breakroom']:continue
 sh=r['shape']
 if sh['type']=='rect':reserves|=rectcells(sh)
 else:reserves|={(x,y) for (x,y) in walk if inside(x*C+8,y*C+8,sh['points'])}
lanes=set()
for route in P['internalRoutes']:
 if route['district'] not in ['lobby','bullpen','parking','breakroom']:continue
 for (a,b),(c,d) in zip(route['points'],route['points'][1:]):lanes|=rectcells(dict(x=min(a,c)-112,y=min(b,d)-112,width=abs(c-a)+224,height=abs(d-b)+224))
# Two protected 224px routes pass through a broad, open-plan shared connection.
for y in [2112,2624]:lanes|=rectcells(dict(x=4208,y=y-112,width=640,height=224))
for hall in halls:lanes|=rectcells(hall)
protected=reserves|lanes;placements=[];occupied=[]
def overlap(a,b,gap=0):return a['x']<b['x']+b['width']+gap and a['x']+a['width']+gap>b['x'] and a['y']<b['y']+b['height']+gap and a['y']+a['height']+gap>b['y']
def foot(s,x,y):
 f=s['footprint'];return dict(x=x-f['width']/2,y=y-f['back'],width=f['width'],height=f['back']+f['front'])
def valid(s,x,y):
 r=foot(s,x,y);cells=rectcells(r)
 return cells<=walk and not cells&protected and not any(overlap(r,q,20) for q in occupied)
def put(id,x,y,variant=0,group='story',wall=False):
 s=specs[id]
 if wall:
  p=dict(id=f'{id}-{len(placements)}',prop=id,x=x,y=y,variant=variant,group=group,mount='wall',depthY=y+20);placements.append(p);return p
 if not valid(s,x,y):
  candidates=[(x+dx,y+dy) for dy in range(-192,193,16) for dx in range(-192,193,16)];candidates.sort(key=lambda v:(v[0]-x)**2+(v[1]-y)**2)
  options=[v for v in candidates if valid(s,*v)]
  if not options:raise ValueError(('No position',id,x,y))
  x,y=options[0]
 p=dict(id=f'{id}-{len(placements)}',prop=id,x=x,y=y,variant=variant%s['variants'],group=group);placements.append(p);occupied.append(foot(s,x,y));return p
put('reception_counter',3120,1968,group='Reception')
put('giant_logo',2850,1992,group='Reception')
put('sofa',3500,1984,group='Waiting')
put('sofa',3500,2072,1,group='Waiting')
put('vending_machine',2456,1960,group='Hallway')
put('lost_found',2456,2072,group='Hallway')
put('coat_rack',2460,2300,group='Hallway')
put('trash_recycle',2460,2460,group='Hallway')
put('water_cooler',3936,2320,group='Lobby service bay')
put('plant',3968,2480,group='Lobby service bay')
put('plant',3440,1984,group='Waiting')
put('gate_hidden_cabinet',2460,2672,group='Files clue')
put('birthday_banner',2864,1584,group='North wall',wall=True)
put('hang_cat_high',3440,1584,group='North wall',wall=True)
put('kpi_frame',5376,1392,group='Bullpen north wall',wall=True)
put('gauge',6016,1392,group='Bullpen north wall',wall=True)
put('goals_board',6224,2064,group='Q4 Goals')
put('roundabout',4528,2392,group='Connector joke')
put('fruit_tree',6144,2496,group='Low hanging fruit')
put('printer',6048,2720,group='Print queue')
put('cabinet',6160,2800,group='Print queue')
put('water_cooler',6880,2032,1,group='Gossip')
put('trash_recycle',7104,2032,group='Gossip')
put('plant',7296,2352,group='East wall')
put('printer',5200,3232,group='South cove')
# Individually authored clusters use all six desk personalities, not repeated rooms.
styles=['desk_tidy','desk_paperwork','desk_lunch','desk_sticky_notes','desk_family_photo','desk_2009']
clusters=[('Inbox Harbor',(5056,1536),7),('Sticky Note Bay',(6000,1936),7),('Project 2009',(6064,2420),7),('South Cove',(5552,3216),7),('East Desks',(7280,2608),7)]
rng=random.Random(1940)
for name,(cx,cy),count in clusters:
 candidates=[(x,y) for y in range(1488,3264,32) for x in range(4544,7345,32) if onfloor(x,y)]
 candidates.sort(key=lambda v:((v[0]-cx)**2+(v[1]-cy)**2)+rng.random()*12000)
 placed=0
 for x,y in candidates:
  id=styles[(len(placements)+placed)%len(styles)];s=specs[id]
  if not valid(s,x,y):continue
  if any(p['prop'].startswith('desk_') and abs(p['x']-x)<144 and abs(p['y']-y)<152 for p in placements):continue
  put(id,x,y,placed%specs[id]['variants'],name);placed+=1
  if placed==count:break
 if placed!=count:raise ValueError((name,placed))
# Additional readable everyday clutter sits with desks, not in the fighting reserves.
for target,id in [((5800,3200),'plant'),((7330,1810),'plant')]:put(id,*target,group='Cluster dressing')
# The corrected duck tray sits on reception, not floating on the floor.
host=next(p for p in placements if p['prop']=='reception_counter')
placements.append(dict(id='ducks-on-reception',prop='duck_row',x=host['x']+24,y=host['y']-64,variant=0,group='Reception',solid=False,depthY=host['y']+2))
# Workers are explicit static placeholders seated at existing solid furniture.
workers=[]
for i,p in enumerate([p for p in placements if p['prop'].startswith('desk_') or p['prop']=='reception_counter']):
 if i%2==0:workers.append(dict(id='worker-'+str(len(workers)),host=p['id'],x=p['x']+(56 if p['prop']=='reception_counter' else -8),y=p['y']-68,variant=len(workers)%3,cropHeight=34,depthY=p['y']-1))
room=place_rooms(put,placements,workers,specs,occupied)
# Collect outer boundary edges and merge contiguous collinear cells.
edges={}
for x,y in walk:
 for dx,dy,axis,line,start,side in [(-1,0,'y',x*C,y*C,'w'),(1,0,'y',(x+1)*C,y*C,'e'),(0,-1,'x',y*C,x*C,'n'),(0,1,'x',(y+1)*C,x*C,'s')]:
  if (x+dx,y+dy) in walk:continue
  if axis=='y' and ((line==2512 and 432<=start<656) or (line==2928 and 3632<=start<3856)):continue
  edges.setdefault((axis,line,side),[]).append(start)
walls=[]
def wall(axis,line,start,end,side):
 while start<end:
  finish=min(end,start+256)
  if axis=='x':r=dict(x=start,y=line-32 if side=='n' else line,width=finish-start,height=32)
  else:r=dict(x=line-32 if side=='w' else line,y=start,width=32,height=finish-start)
  px=(start+finish)/2 if axis=='x' else line+(8 if side=='w' else -8)
  py=line+(8 if side=='n' else -8) if axis=='x' else (start+finish)/2
  zone=next((d['id'] for d in D if inside(px,py,d['polygon'])),'connector')
  style='parking' if zone=='parking' else 'kitchen' if zone=='breakroom' else 'office'
  walls.append(dict(id='wall-'+str(len(walls)),axis=axis,side=side,style=style,**r));start=finish
for (axis,line,side),values in edges.items():
 values=sorted(values);start=last=values[0]
 for v in values[1:]:
  if v!=last+C:wall(axis,line,start,last+C,side);start=v
  last=v
 wall(axis,line,start,last+C,side)
for a,b in [(1856,2000),(2736,2816)]:walls.append(dict(id='partition-'+str(a),axis='y',side='w',x=4472,y=a,width=16,height=b-a))
gates=[dict(id='parking-access',name='Parking Lot',sign='PARKING LOT',age=45,fromDistrict='lobby',toDistrict='parking',x=2144,y=1616,width=128,height=224,clearWidth=224,closed=True),dict(id='break-access',name='Break Room',sign='BREAK ROOM',age=45,fromDistrict='lobby',toDistrict='breakroom',x=2144,y=2816,width=128,height=224,clearWidth=224,closed=True),dict(id='server-return',name='Server Room',sign='SERVER ROOM',age=50,fromDistrict='parking',toDistrict='server',x=2384,y=432,width=128,height=224,clearWidth=224,closed=True),dict(id='conference-return',name='Conference Rooms',sign='CONFERENCE',age=50,fromDistrict='breakroom',toDistrict='conference',x=2800,y=3632,width=128,height=224,clearWidth=224,closed=True)]
# Rectangle decomposition keeps floors on shared seamless 64px tiles, not a painted map.
floors=[]
for d in D:
 ys=sorted(set(y for x,y in d['polygon']))
 for y1,y2 in zip(ys,ys[1:]):
  xs=sorted(set(x for x,y in d['polygon']))
  spans=[(a,b) for a,b in zip(xs,xs[1:]) if inside((a+b)/2,(y1+y2)/2,d['polygon'])]
  if spans:floors.append(dict(x=min(a for a,b in spans),y=y1,width=max(b for a,b in spans)-min(a for a,b in spans),height=y2-y1,district=d['id'],material={'lobby':'vinyl','bullpen':'carpet','parking':'asphalt','breakroom':'kitchen'}[d['id']]))
floors += [dict(**r,material='wood') for r in halls]
# Store local coordinates to preserve the existing hero's physics and camera math.
def local(r):
 r=dict(r)
 if 'x' in r:r['x']-=O[0]
 if 'y' in r:r['y']-=O[1]
 if 'depthY' in r:r['depthY']-=O[1]
 if 'readAt' in r:r['readAt']=[r['readAt'][0]-O[0],r['readAt'][1]-O[1]]
 return r
schedule=json.loads((R.parent/'campus-promotions.json').read_text());schedule['status']='embedded-schedule-gates-held-closed';schedule['slicePolicy']='Lobby/Bullpen start open. Parking Lot and Break Room are built behind closed age-45 gates. Far age-50 doors remain closed; Claude owns promotion opening.'
(R/'promotions.json').write_text(json.dumps(schedule,indent=2)+'\n')
result=dict(promotions=schedule,id='campus-age45-slice',version=2,origin=O,spawn=[0,2152-O[1]],bounds=dict(x=96-O[0],y=160-O[1],width=7296,height=3968),districts=[dict(id=d['id'],name=d['name'],polygon=[[x-O[0],y-O[1]] for x,y in d['polygon']]) for d in D],floors=list(map(local,floors)),walls=list(map(local,walls)),gates=list(map(local,gates)),placements=list(map(local,placements)),workers=list(map(local,workers)),assetSpecs={id:{k:v for k,v in specs[id].items() if k in ['id','frame','file','footprint','variants','solid','mount','caption']} for id in sorted({p['prop'] for p in placements})},clearSpaces=[r for r in P['combatSpaces'] if r['district'] in ['lobby','bullpen','parking','breakroom']],maxVisibleProps=120,routeWidth=224,gateOwnership='Four closed physical gates only; Claude owns opening/navigation. Lobby/Bullpen plus Parking/Break Room floors are built. Server/Conference floors are future work.',tour={'Lobby':[0,-296],'Hallway':[2608-O[0],1984-O[1]],'Bullpen':[5400-O[0],2060-O[1]],'Goals':[6624-O[0],2400-O[1]],'Parking gate':[2420-O[0],1728-O[1]]})
result.update({k:list(map(local,room[k])) for k in ['labels','floorDecor','structures','protectedRoutes']})
result['internalRoutes']=[dict(district=r['district'],width=r['width'],points=[[x-O[0],y-O[1]] for x,y in r['points']]) for r in P['internalRoutes'] if r['district'] in ['lobby','bullpen','parking','breakroom']]
result['roomStats']=dict(parkingCars=room['cars'],breakableProps=sum(p['prop'] in ['plant','vending_machine','trash_recycle','water_cooler','lost_found','printer','cabinet','coat_rack'] and p.get('district')=='breakroom' for p in placements))
result['tour'].update({name:[x-O[0],y-O[1]] for name,(x,y) in {'Parking':(1152,1248),'Break Room':(1376,2528),'Kitchen':(800,2528),'Birthday':(1376,3504),'Loot Bay':(2224,3680),'Server gate':(2256,544),'Conference gate':(2672,3744),'Staff hall':(1024,2120)}.items()})
(R/'layout.json').write_text(json.dumps(result,indent=2)+'\n')
repo=R.parents[2]
(repo/'src/data/start-area.js').write_text('window.USE_START_AREA = true;\nwindow.START_AREA_LAYOUT = '+json.dumps(result,separators=(',',':'))+';\n')
print(f"Slice authored: {len(placements)} props, {len(workers)} static coworkers, {len(walls)} boundary/partition pieces, four closed 224px gates.")
