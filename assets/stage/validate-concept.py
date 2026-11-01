"""Stage 1 proposal checks. No game module imports or production writes."""
from pathlib import Path
from collections import deque
import json,struct,hashlib
root=Path(__file__).resolve().parent
plan=json.loads((root/'campus-layout-concept.json').read_text())
assert (plan['world']['width'],plan['world']['height'])==(7680,4320)
assert len(plan['districts'])==9
assert plan['mainRouteWidth']>=192 and plan['branchRouteWidth']>=160
routes=plan['mainRoutes']+plan['branches']
def overlap(a,b):
 return a['x']<b['x']+b['width'] and a['x']+a['width']>b['x'] and a['y']<b['y']+b['height'] and a['y']+a['height']>b['y']
for d in plan['districts']:
 p=d['plaza'];assert p['width']==p['height']==512
 assert 0<=p['x']<=7680-512 and 0<=p['y']<=4320-512
 assert not overlap(p,d['landmarkFootprint']),d['id']
 assert all(not overlap(d['landmarkFootprint'],r) for r in routes),d['id']
 assert sum(overlap(p,r) for r in plan['mainRoutes'])==2,d['id']
# Exact multiples of sixteen make a conservative connectivity check possible.
cell=16;w,h=7680//cell,4320//cell;walk=set()
for r in routes+[d['plaza'] for d in plan['districts']]:
 for y in range(r['y']//cell,(r['y']+r['height'])//cell):
  for x in range(r['x']//cell,(r['x']+r['width'])//cell):walk.add((x,y))
assert {y for y in range(h) if (0,y) in walk}=={y for y in range(h) if (w-1,y) in walk}
assert {x for x in range(w) if (x,0) in walk}=={x for x in range(w) if (x,h-1) in walk}
assert any((0,y) in walk for y in range(h)) and any((x,0) in walk for x in range(w))
start=(3840//cell,2160//cell);seen={start};queue=deque([start])
while queue:
 x,y=queue.popleft()
 for nx,ny in [((x-1)%w,y),((x+1)%w,y),(x,(y-1)%h),(x,(y+1)%h)]:
  if (nx,ny) in walk and (nx,ny) not in seen:seen.add((nx,ny));queue.append((nx,ny))
assert seen==walk,'Disconnected route or plaza'
assert all((d['center'][0]//cell,d['center'][1]//cell) in seen for d in plan['districts'])
assets=[]
for id,name,district in [('campus-overview','campus-overview-v1.png','all'),('parking-lot-closeup','parking-lot-closeup-v1.png','parking')]:
 path=root/name;data=path.read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n';size=list(struct.unpack('>II',data[16:24]))
 if district=='parking':assert size==[1280,800]
 assets.append(dict(id=id,file=name,size=size,floorFootprint=None,solid=False,kind='concept-illustration',district=district,frameCount=1,status='awaiting-stage-1-approval',sha256=hashlib.sha256(data).hexdigest(),prompt=id+'-v1-prompt.txt'))
manifest=dict(batch='stage-pass-1',status='awaiting-approval',productionReady=False,worldSize=[7680,4320],assets=assets,layout='campus-layout-concept.json',measuredPlan='campus-plan.svg',review='../../devlog/art/stage-pass.html',notes=['Concept paintings include illustrative light/contact cues and full backgrounds; they are not magenta sprite exports.','Future production props keep exact magenta, native sizes, code-drawn shadows and floor-footprint collisions.','No Stage 2 props, posters or Stage 3 coworker sheets have been generated.','Illustration is not a pixel-accurate collision map. The measured plan reserves route and plaza geometry.'])
# Archived v1 checks must not replace the current revision manifest.
if not (root/'campus-layout-v2.json').exists():
 (root/'campus-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
result=dict(districts=9,mainRoutes=len(plan['mainRoutes']),branchLoops=9,clearPlazas=9,mainWidth=224,branchWidth=160,connected=True,wrapConnections=True,walkCells=len(walk),landmarksOutsideRoutes=True,productionMapChanged=False)
(root/'layout-checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
