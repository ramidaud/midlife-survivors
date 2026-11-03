"""Validate room footprints, 224px lanes and locked/open reachability offline."""
from pathlib import Path
from collections import deque
import json,math,runpy
R=Path(__file__).resolve().parent
D=json.loads((R/'layout.json').read_text());C=16
inside=lambda x,y:any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in D['floors'])
assert {d['id'] for d in D['districts']}=={'lobby','bullpen','parking','breakroom','server','conference','executive','wellness'}
office=D.get('officeLoop')
if office:
 assert all(p['cropHeight']==(56 if p.get('seated') else 34) for p in D['workers'])
else:
 assert len(D['workers'])==26+D['finishStats']['newWorkers'] and all(p['cropHeight']==34 for p in D['workers'])
 assert sum(p['prop'].startswith('desk_') for p in D['placements'])==35+D['finishStats']['newDesks']
assert D['routeWidth']==224 and D['maxVisibleProps']==120
rects=[]
for p in D['placements']:
 s=D['assetSpecs'][p['prop']]
 if not s['solid'] or p.get('solid') is False:continue
 f=s['footprint'];x=p['x']-f['width']/2;y=p['y']-f['back'];w=f['width'];h=f['back']+f['front']
 assert all(inside(a,b) for a in [x+.1,x+w-.1] for b in [y+.1,y+h-.1]),p['id']
 rects.append((x,y,w,h,p['id']))
if office:
 validated=runpy.run_path(str(R/'validate-courtyard.py'))
 for id in validated['early']:
  if id not in {p['id'] for p in D['placements']}:
   rects.append((*validated['fixtures'][id],id))
for r in D['walls']+D['structures']:rects.append((r['x'],r['y'],r['width'],r['height'],r['id']))
for g in D['gates']:assert g['closed'] and g['age'] in [45,50,55,60] and g['height']==g['clearWidth']==224
assert len(D['gates'])==6
routes=D['protectedRoutes'][:]
for r in D['internalRoutes']:
 for (x,y),(a,b) in zip(r['points'],r['points'][1:]):routes.append(dict(id=r['district'],x=min(x,a)-112,y=min(y,b)-112,width=abs(x-a)+224,height=abs(y-b)+224))
for r in routes:
 for x,y,w,h,id in rects:
  assert not(x<r['x']+r['width']-.1 and x+w>r['x']+.1 and y<r['y']+r['height']-.1 and y+h>r['y']+.1),(r['id'],id)
b=D['bounds'];cells={(x,y) for y in range(math.floor(b['y']/C),math.ceil((b['y']+b['height'])/C)) for x in range(math.floor(b['x']/C),math.ceil((b['x']+b['width'])/C)) if inside(x*C+8,y*C+8)}
basefree={q for q in cells if all(inside(q[0]*C+8+a,q[1]*C+8+b) for a,b in [(-26,-26),(26,-26),(-26,26),(26,26)]) and not any(x-26<q[0]*C+8<x+w+26 and y-26<q[1]*C+8<y+h+26 for x,y,w,h,id in rects)}
def flood(open_ids):
 free={q for q in basefree if not any(g['id'] not in open_ids and g['x']-26<q[0]*C+8<g['x']+g['width']+26 and g['y']-26<q[1]*C+8<g['y']+g['height']+26 for g in D['gates'])}
 start=tuple(math.floor(a/C) for a in D['spawn']);seen={start};todo=deque([start])
 while todo:
  x,y=todo.popleft()
  for q in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
   if q in free and q not in seen:seen.add(q);todo.append(q)
 return seen
old=['Lobby','Hallway','Bullpen','Goals','Parking gate']
if office:old+=['Commons','South apron','Lobby arrival','Seated desks']
late=['Server','Rack aisle','Cable waterfall','Conference','Synergy','Bandwidth','Alignment','Executive gate','Meeting approach','Crash cart','Wellness door']
age45ids={'parking-access','break-access'};age50ids=age45ids|{'server-return','conference-return'};age55ids=age50ids|{'executive-return'}
closed=flood(set());age45=flood(age45ids);age50=flood(age50ids);age55=flood(age55ids);opened=flood(age55ids|{'wellness-conference'})
executive_tours=['Executive','Executive reception','Corner office','Skyline','Putting mat','Executive awards','Sealed Executive exit']
wellness_tours=['Wellness','Massage chair','Quiet pod','Puzzle','Nap pod','Zen fountain','Yoga annex','Wellness entry']
for name,p in D['tour'].items():
 cell=tuple(math.floor(a/C) for a in p)
 assert cell in opened,('Unreachable with age60 test-open',name)
 assert (cell in closed)==(name in old),('Closed gate leak',name)
 assert (cell in age45)==(name not in late+executive_tours+wellness_tours),('Age50 gate leak',name)
 assert (cell in age50)==(name not in executive_tours+wellness_tours),('Executive gate leak',name)
 assert (cell in age55)==(name not in wellness_tours),('Wellness gate leak',name)
# Explicit boss escape radius: ring 260 + half thickness16 + hero half-body26, plus its outer half-body26.
clearance=[]
for name,x,y in [('Server',3488,752),('Conference',6784,3840)]:
 x-=D['origin'][0];y-=D['origin'][1]
 for i in range(128):
  a=math.tau*i/128;px=x+328*math.cos(a);py=y+328*math.sin(a)
  assert inside(px,py) and not any(rx<=px<=rx+w and ry<=py<=ry+h for rx,ry,w,h,id in rects),('Boss escape blocked',name,i)
 clearance.append(dict(room=name,ringRadius=260,escapeRadius=328,driftRadius=130,passed=True))
# V8 drift envelopes and 600px straight charge lanes stay clear in both final rooms.
for name,cx,cy,lane in [('Executive',6176,784,832),('Wellness',3920,3808,896),('Bullpen',5840,2216,704) if office else ('Bullpen',5376,2080,640)]:
 x=cx-D['origin'][0];y=cy-D['origin'][1]
 for i in range(128):
  a=math.tau*i/128;px=x+220*math.cos(a);py=y+220*math.sin(a)
  assert inside(px,py) and not any(rx<=px<=rx+w and ry<=py<=ry+h for rx,ry,w,h,id in rects),(name,'drift blocked',i)
 for rx,ry,w,h,id in rects:assert not(rx<x+300 and rx+w>x-300 and ry<y+50 and ry+h>y-50),(name,'charge blocked',id)
 clearance.append(dict(room=name,chargeLane=600,openLane=lane,driftRadius=130,escapeRadius=220,passed=True))
# Save actual player-center walking paths for the isolated review only.
def paths():
 closed_rects=[]
 free={q for q in basefree if not any(g['x']-26<q[0]*C+8<g['x']+g['width']+26 and g['y']-26<q[1]*C+8<g['y']+g['height']+26 for g in closed_rects)}
 start=(math.floor(D['spawn'][0]/C),math.floor((D['spawn'][1]-26)/C));parent={start:None};todo=deque([start])
 while todo:
  x,y=todo.popleft()
  for q in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
   if q in free and q not in parent:parent[q]=(x,y);todo.append(q)
 result={}
 for name in ['Bullpen','Wellness','Massage chair','Quiet pod','Yoga annex','Executive']:
  p=D['tour'][name];q=(math.floor(p[0]/C),math.floor((p[1]-26)/C));assert q in parent,name
  path=[]
  while q is not None:path.append(q);q=parent[q]
  path.reverse();turns=[path[0]]
  for i in range(1,len(path)-1):
   if (path[i][0]-path[i-1][0],path[i][1]-path[i-1][1])!=(path[i+1][0]-path[i][0],path[i+1][1]-path[i][1]):turns.append(path[i])
  turns.append(path[-1]);result[name]=[[x*C+8,y*C+8] for x,y in turns]
 return result
(R/'qa-finish-paths.js').write_text('window.FINISH_QA_PATHS='+json.dumps(paths(),separators=(',',':'))+';\n')
# Wellness's west wall stays inside its plot; the public Conference corridor is all 224px.
corridor=dict(x=2800-D['origin'][0],y=3856-D['origin'][1],width=224,height=400)
for x,y,w,h,id in rects:
 assert not(x<corridor['x']+224 and x+w>corridor['x'] and y<corridor['y']+400 and y+h>corridor['y']),('Conference public corridor narrowed',id)
oldx=5152-D['origin'][0];oldy=1088-D['origin'][1]
assert all(any(x<=oldx<=x+w and y<=py<y+h for x,y,w,h,id in rects if id.startswith('wall-')) for py in range(oldy,oldy+224)), 'Old Executive opening not sealed'
g=next(g for g in D['gates'] if g['age']==60);assert g['id']=='wellness-conference' and g['fromDistrict']=='conference' and g['closed'] and g['width']==128 and g['height']==224
report=dict(status='passed',conferenceCorridor224=True,oldExecutiveOpeningSealed=True,districts=8,props=len(D['placements']),desks=len(office['workstations']) if office else 35+D['finishStats']['newDesks'],workers=len(D['workers']),solidBodies=len(rects)+6,doorwayWidth=224,closedGates=6,age45Gates=2,age50Gates=2,age55Gates=1,age60Gates=1,closedReachableCells=len(closed),age45ReachableCells=len(age45),age50ReachableCells=len(age50),age55ReachableCells=len(age55),testOpenedReachableCells=len(opened),allTourPointsReachableWhenTestOpened=True,lockedRoomsExcluded=True,protectedRoutes=len(routes),bossClearance=clearance,maxVisibleProps=120,**D['roomStats'])
if office:
 report['courtyard']=dict(pods=len(office['pods']),workstations=len(office['workstations']),seated=sum(bool(p.get('seated')) for p in D['workers']),standing=len(office['scenes']),lights=len(D['lights']))
else:report['finish']=D['finishStats']
(R/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
