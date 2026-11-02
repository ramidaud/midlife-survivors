"""Check the authored slice without loading Phaser or changing its data."""
from pathlib import Path
from collections import deque
import json, math
R=Path(__file__).resolve().parent
D=json.loads((R/'layout.json').read_text());C=16
inside=lambda x,y:any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in D['floors'])
assert {d['id'] for d in D['districts']}=={'lobby','bullpen'}
assert len(D['workers'])==18 and all(p['cropHeight']==34 for p in D['workers'])
assert sum(p['prop'].startswith('desk_') for p in D['placements'])==35
assert D['routeWidth']==224 and D['maxVisibleProps']==120
rects=[]
for p in D['placements']:
 s=D['assetSpecs'][p['prop']]
 if not s['solid'] or p.get('solid') is False:continue
 f=s['footprint'];x=p['x']-f['width']/2;y=p['y']-f['back'];w=f['width'];h=f['back']+f['front']
 assert all(inside(a,b) for a in [x+.1,x+w-.1] for b in [y+.1,y+h-.1]),p['id']
 rects.append((x,y,w,h))
for r in D['walls']+D['gates']:rects.append((r['x'],r['y'],r['width'],r['height']))
assert len(rects)==132
for g in D['gates']:assert g['closed'] and g['age']==45 and g['height']==g['clearWidth']==224
# Opening spans include their endpoints minus an epsilon. No solid may intrude.
for y in [2112-2448,2624-2448]:
 for x0,y0,w,h in rects:assert not(x0<1320 and x0+w>1304 and y0<y+112 and y0+h>y-112),(x0,y0,w,h)
b=D['bounds'];cells={(x,y) for y in range(math.floor(b['y']/C),math.ceil((b['y']+b['height'])/C)) for x in range(math.floor(b['x']/C),math.ceil((b['x']+b['width'])/C)) if inside(x*C+8,y*C+8)}
free={q for q in cells if not any(x-10<q[0]*C+8<x+w+10 and y-10<q[1]*C+8<y+h+10 for x,y,w,h in rects)}
start=tuple(math.floor(a/C) for a in D['spawn']);seen={start};todo=deque([start])
while todo:
 x,y=todo.popleft()
 for q in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
  if q in free and q not in seen:seen.add(q);todo.append(q)
for name,point in D['tour'].items():assert tuple(math.floor(a/C) for a in point) in seen,name
report=dict(status='passed',districts=2,props=len(D['placements']),desks=35,staticWorkers=18,solidBodies=len(rects),doorwayWidth=224,closedGates=2,reachableFloorCells=len(seen),allTourPointsReachable=True,maxVisibleProps=120)
(R/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
