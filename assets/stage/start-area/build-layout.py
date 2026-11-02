"""Author the approved two-district slice. Optional offline tool, not a game build."""
from pathlib import Path
import json,math,random
R=Path(__file__).resolve().parent;P=json.loads((R.parent/'campus-layout-v2.json').read_text());O=[3168,2448];C=16
specs={s['id']:s for f in ['batch-2a.json','batch-2b.json','batch-2c.json'] for s in json.loads((R.parent/'props'/f).read_text())}
for id in ['tidy','paperwork','lunch']:specs['desk_'+id]=dict(id='desk_'+id,frame=[96,104],footprint=dict(width=80,back=70,front=2),variants=1,file='../../desks/'+id+'-native.png',solid=True)
for id,frame,foot in [('printer',[80,80],[48,26,4]),('cabinet',[56,88],[38,40,4]),('plant',[48,64],[24,15,3])]:specs[id]=dict(id=id,frame=frame,footprint=dict(zip(['width','back','front'],foot)),variants=1,file='../../office-environment/'+id+'-native.png',solid=True)
for s in specs.values():
 if s['id'].startswith('desk_') and s['id'] not in ['desk_sleeper']:s['footprint']=dict(width=80,back=70,front=2)
D=[d for d in P['districts'] if d['id'] in ['lobby','bullpen']]
def inside(x,y,poly):
 hit=False
 for i,(a,b) in enumerate(poly):
  c,d=poly[(i+1)%len(poly)]
  if (b>y)!=(d>y) and x<(c-a)*(y-b)/(d-b)+a:hit=not hit
 return hit
halls=[dict(x=2272,y=1616,width=256,height=224),dict(x=2272,y=2816,width=320,height=224)]
def onfloor(x,y):return any(inside(x,y,d['polygon']) for d in D) or any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in halls)
walk={(x,y) for y in range(80,210) for x in range(130,465) if onfloor(x*C+8,y*C+8)}
def rectcells(r):return {(x,y) for y in range(math.floor(r['y']/C),math.ceil((r['y']+r['height'])/C)) for x in range(math.floor(r['x']/C),math.ceil((r['x']+r['width'])/C))}
reserves=set()
for r in P['combatSpaces']:
 if r['district'] not in ['lobby','bullpen']:continue
 sh=r['shape']
 if sh['type']=='rect':reserves|=rectcells(sh)
 else:reserves|={(x,y) for (x,y) in walk if inside(x*C+8,y*C+8,sh['points'])}
lanes=set()
for route in P['internalRoutes']:
 if route['district'] not in ['lobby','bullpen']:continue
 for (a,b),(c,d) in zip(route['points'],route['points'][1:]):lanes|=rectcells(dict(x=min(a,c)-112,y=min(b,d)-112,width=abs(c-a)+224,height=abs(d-b)+224))
# Two protected 224px routes pass through a broad, open-plan shared connection.
for y in [2112,2624]:lanes|=rectcells(dict(x=4208,y=y-112,width=640,height=224))
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
# Collect outer boundary edges and merge contiguous collinear cells.
edges={}
for x,y in walk:
 for dx,dy,axis,line,start,side in [(-1,0,'y',x*C,y*C,'w'),(1,0,'y',(x+1)*C,y*C,'e'),(0,-1,'x',y*C,x*C,'n'),(0,1,'x',(y+1)*C,x*C,'s')]:
  if (x+dx,y+dy) in walk:continue
  if axis=='y' and line==2272 and (1616<=start<1840 or 2816<=start<3040):continue
  edges.setdefault((axis,line,side),[]).append(start)
walls=[]
def wall(axis,line,start,end,side):
 while start<end:
  finish=min(end,start+256)
  if axis=='x':r=dict(x=start,y=line-32 if side=='n' else line,width=finish-start,height=32)
  else:r=dict(x=line-32 if side=='w' else line,y=start,width=32,height=finish-start)
  walls.append(dict(id='wall-'+str(len(walls)),axis=axis,side=side,**r));start=finish
for (axis,line,side),values in edges.items():
 values=sorted(values);start=last=values[0]
 for v in values[1:]:
  if v!=last+C:wall(axis,line,start,last+C,side);start=v
  last=v
 wall(axis,line,start,last+C,side)
for a,b in [(1856,2000),(2736,2816)]:walls.append(dict(id='partition-'+str(a),axis='y',side='w',x=4472,y=a,width=16,height=b-a))
gates=[dict(id='parking-access',name='Parking Lot',age=45,x=2144,y=1616,width=128,height=224,clearWidth=224,closed=True),dict(id='break-access',name='Break Room',age=45,x=2144,y=2816,width=128,height=224,clearWidth=224,closed=True)]
# Rectangle decomposition keeps floors on shared seamless 64px tiles, not a painted map.
floors=[]
for d in D:
 ys=sorted(set(y for x,y in d['polygon']))
 for y1,y2 in zip(ys,ys[1:]):
  xs=sorted(set(x for x,y in d['polygon']))
  spans=[(a,b) for a,b in zip(xs,xs[1:]) if inside((a+b)/2,(y1+y2)/2,d['polygon'])]
  if spans:floors.append(dict(x=min(a for a,b in spans),y=y1,width=max(b for a,b in spans)-min(a for a,b in spans),height=y2-y1,material='vinyl' if d['id']=='lobby' else 'carpet'))
floors += [dict(**r,material='wood') for r in halls]
# Store local coordinates to preserve the existing hero's physics and camera math.
def local(r):
 r=dict(r)
 if 'x' in r:r['x']-=O[0]
 if 'y' in r:r['y']-=O[1]
 if 'depthY' in r:r['depthY']-=O[1]
 return r
schedule=json.loads((R.parent/'campus-promotions.json').read_text());schedule['status']='embedded-schedule-gates-held-closed';schedule['slicePolicy']='Only Lobby/Bullpen are built. Gates stay closed until destination districts exist and Claude enables opening.'
(R/'promotions.json').write_text(json.dumps(schedule,indent=2)+'\n')
result=dict(promotions=schedule,id='lobby-bullpen-slice',version=1,origin=O,spawn=[0,2152-O[1]],bounds=dict(x=2112-O[0],y=1296-O[1],width=5280,height=2016),districts=[dict(id=d['id'],name=d['name'],polygon=[[x-O[0],y-O[1]] for x,y in d['polygon']]) for d in D],floors=list(map(local,floors)),walls=list(map(local,walls)),gates=list(map(local,gates)),placements=list(map(local,placements)),workers=list(map(local,workers)),assetSpecs={id:{k:v for k,v in specs[id].items() if k in ['id','frame','file','footprint','variants','solid','mount','caption']} for id in {p['prop'] for p in placements}},clearSpaces=[r for r in P['combatSpaces'] if r['district'] in ['lobby','bullpen']],maxVisibleProps=120,routeWidth=224,gateOwnership='Closed physical fixtures only; Claude owns opening/navigation integration. No other district floors exist in this slice.',tour={'Lobby':[0,-296],'Hallway':[2608-O[0],1984-O[1]],'Bullpen':[5400-O[0],2060-O[1]],'Goals':[6624-O[0],2400-O[1]],'Parking gate':[2420-O[0],1728-O[1]]})
(R/'layout.json').write_text(json.dumps(result,indent=2)+'\n')
repo=R.parents[2]
(repo/'src/data/start-area.js').write_text('window.USE_START_AREA = true;\nwindow.START_AREA_LAYOUT = '+json.dumps(result,separators=(',',':'))+';\n')
print(f"Slice authored: {len(placements)} props, {len(workers)} static coworkers, {len(walls)} boundary/partition pieces, two closed 224px gates.")
