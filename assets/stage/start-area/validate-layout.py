"""Validate room footprints, 224px lanes and locked/open reachability offline."""
from pathlib import Path
from collections import deque
import json,math
R=Path(__file__).resolve().parent
D=json.loads((R/'layout.json').read_text());C=16
inside=lambda x,y:any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in D['floors'])
assert {d['id'] for d in D['districts']}=={'lobby','bullpen','parking','breakroom','server','conference'}
assert len(D['workers'])==26 and all(p['cropHeight']==34 for p in D['workers'])
assert sum(p['prop'].startswith('desk_') for p in D['placements'])==35
assert D['routeWidth']==224 and D['maxVisibleProps']==120
rects=[]
for p in D['placements']:
 s=D['assetSpecs'][p['prop']]
 if not s['solid'] or p.get('solid') is False:continue
 f=s['footprint'];x=p['x']-f['width']/2;y=p['y']-f['back'];w=f['width'];h=f['back']+f['front']
 assert all(inside(a,b) for a in [x+.1,x+w-.1] for b in [y+.1,y+h-.1]),p['id']
 rects.append((x,y,w,h,p['id']))
for r in D['walls']+D['structures']:rects.append((r['x'],r['y'],r['width'],r['height'],r['id']))
for g in D['gates']:assert g['closed'] and g['age'] in [45,50,55] and g['height']==g['clearWidth']==224
assert len(D['gates'])==5
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
late=['Server','Rack aisle','Cable waterfall','Conference','Synergy','Bandwidth','Alignment','Executive gate','Meeting approach']
closed=flood(set());age45=flood({'parking-access','break-access'});opened=flood({'parking-access','break-access','server-return','conference-return'})
for name,p in D['tour'].items():
 cell=tuple(math.floor(a/C) for a in p)
 assert cell in opened,('Unreachable with age50 test-open',name)
 assert (cell in closed)==(name in old),('Closed gate leak',name)
 assert (cell in age45)==(name not in late),('Age50 gate leak',name)
# Explicit boss escape radius: ring 260 + half thickness16 + hero half-body26, plus its outer half-body26.
clearance=[]
for name,x,y in [('Server',3488,752),('Conference',6784,3840)]:
 x-=D['origin'][0];y-=D['origin'][1]
 for i in range(128):
  a=math.tau*i/128;px=x+328*math.cos(a);py=y+328*math.sin(a)
  assert inside(px,py) and not any(rx<=px<=rx+w and ry<=py<=ry+h for rx,ry,w,h,id in rects),('Boss escape blocked',name,i)
 clearance.append(dict(room=name,ringRadius=260,escapeRadius=328,driftRadius=130,passed=True))
# Save actual player-center walking paths for the isolated review only.
def paths():
 closed_rects=[g for g in D['gates'] if g['age']==55]
 free={q for q in basefree if not any(g['x']-26<q[0]*C+8<g['x']+g['width']+26 and g['y']-26<q[1]*C+8<g['y']+g['height']+26 for g in closed_rects)}
 start=(math.floor(D['spawn'][0]/C),math.floor((D['spawn'][1]-26)/C));parent={start:None};todo=deque([start])
 while todo:
  x,y=todo.popleft()
  for q in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
   if q in free and q not in parent:parent[q]=(x,y);todo.append(q)
 result={}
 for name in ['Server','Conference']:
  p=D['tour'][name];q=(math.floor(p[0]/C),math.floor((p[1]-26)/C));assert q in parent,name
  path=[]
  while q is not None:path.append(q);q=parent[q]
  path.reverse();turns=[path[0]]
  for i in range(1,len(path)-1):
   if (path[i][0]-path[i-1][0],path[i][1]-path[i-1][1])!=(path[i+1][0]-path[i][0],path[i+1][1]-path[i][1]):turns.append(path[i])
  turns.append(path[-1]);result[name]=[[x*C+8,y*C+8] for x,y in turns]
 return result
(R/'qa-paths-2e.js').write_text('window.STAGE_2E_QA_PATHS='+json.dumps(paths(),separators=(',',':'))+';\n')
# The connecting hall leaves the future Wellness floor unbuilt.
P=json.loads((R.parent/'campus-layout-v2.json').read_text())
poly=next(d['polygon'] for d in P['districts'] if d['id']=='wellness')
def polygon_contains(x,y):
 hit=False
 for i,(a,b) in enumerate(poly):
  c,d=poly[(i+1)%len(poly)]
  if (b>y)!=(d>y) and x<(c-a)*(y-b)/(d-b)+a:hit=not hit
 return hit
for y in range(3448,4256,16):
 for x in range(3048,4960,16):
  if polygon_contains(x,y):assert not inside(x-D['origin'][0],y-D['origin'][1]),('Future Wellness overlap',x,y)
report=dict(status='passed',futureWellnessPreserved=True,districts=6,props=len(D['placements']),desks=35,staticWorkers=26,solidBodies=len(rects)+5,doorwayWidth=224,closedGates=5,age45Gates=2,age50Gates=2,age55Gates=1,closedReachableCells=len(closed),age45ReachableCells=len(age45),testOpenedReachableCells=len(opened),allTourPointsReachableWhenTestOpened=True,lockedRoomsExcluded=True,protectedRoutes=len(routes),bossClearance=clearance,maxVisibleProps=120,**D['roomStats'])
(R/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
