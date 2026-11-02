"""Validate room footprints, 224px lanes and locked/open reachability offline."""
from pathlib import Path
from collections import deque
import json,math
R=Path(__file__).resolve().parent
D=json.loads((R/'layout.json').read_text());C=16
inside=lambda x,y:any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in D['floors'])
assert {d['id'] for d in D['districts']}=={'lobby','bullpen','parking','breakroom'}
assert len(D['workers'])==20 and all(p['cropHeight']==34 for p in D['workers'])
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
for g in D['gates']:assert g['closed'] and g['age'] in [45,50] and g['height']==g['clearWidth']==224
assert len(D['gates'])==4
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
old=['Lobby','Hallway','Bullpen','Goals','Parking gate'];closed=flood(set());opened=flood({'parking-access','break-access'})
for name,p in D['tour'].items():
 cell=tuple(math.floor(a/C) for a in p)
 assert cell in opened,('Unreachable with age45 test-open',name)
 assert (cell in closed)==(name in old),('Closed gate leak',name)
for gate in ['parking-access','break-access']:
 seen=flood({gate})
 for name in ['Parking','Break Room']:assert tuple(math.floor(a/C) for a in D['tour'][name]) in seen,(gate,name)
report=dict(status='passed',districts=4,props=len(D['placements']),desks=35,staticWorkers=20,solidBodies=len(rects)+4,doorwayWidth=224,closedGates=4,age45Gates=2,age50Gates=2,closedReachableCells=len(closed),testOpenedReachableCells=len(opened),allTourPointsReachableWhenTestOpened=True,lockedRoomsExcluded=True,protectedRoutes=len(routes),maxVisibleProps=120,**D['roomStats'])
(R/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
