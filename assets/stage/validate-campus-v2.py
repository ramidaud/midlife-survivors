"""Proposal validation only. Raster geometry and graph locks, not runtime code."""
from pathlib import Path
import json,math
from collections import deque
R=Path(__file__).resolve().parent;P=json.loads((R/'campus-layout-v2.json').read_text());CELL=16;W=480;H=270

def inside(x,y,points):
 found=False
 for i,(a,b) in enumerate(points):
  c,d=points[(i+1)%len(points)]
  if (b>y)!=(d>y) and x<(c-a)*(y-b)/(d-b)+a:found=not found
 return found

def poly_cells(poly):return {(x,y) for y in range(H) for x in range(W) if inside(x*CELL+8,y*CELL+8,poly)}
def rect_cells(r):return {(x,y) for y in range(max(0,r['y']//CELL),min(H,math.ceil((r['y']+r['height'])/CELL))) for x in range(max(0,r['x']//CELL),min(W,math.ceil((r['x']+r['width'])/CELL)))}
def line_cells(points,width):
 cells=set();half=width/2
 for (x1,y1),(x2,y2) in zip(points,points[1:]):
  assert x1==x2 or y1==y2
  if x1==x2:r=dict(x=int(x1-half),y=min(y1,y2),width=width,height=abs(y2-y1))
  else:r=dict(x=min(x1,x2),y=int(y1-half),width=abs(x2-x1),height=width)
  cells|=rect_cells(r)
 return cells

def flood(walk,start):
 seen={start};q=deque([start])
 while q:
  x,y=q.popleft()
  for point in [((x-1)%W,y),((x+1)%W,y),(x,(y-1)%H),(x,(y+1)%H)]:
   if point in walk and point not in seen:seen.add(point);q.append(point)
 return seen

districts={d['id']:poly_cells(d['polygon']) for d in P['districts']}
for a,cells in districts.items():
 for b,other in districts.items():
  if a<b:assert not cells&other,(a,b,'overlapping districts bypass gates')
floor=set().union(*districts.values())
for c in P['connections']:floor|=line_cells(c['points'],c['width'])
for c in P['wrapConnections']:
 for line in c['segments']:floor|=line_cells(line,c['width'])
start=tuple(v//CELL for v in P['start']['point']);assert start in floor

def is_open(c,age,achievement):return (c.get('minAge') is None or age>=c['minAge']) and (not c.get('achievement') or achievement)
def graph_reachable(age,achievement):
 seen={'lobby'};q=deque(['lobby'])
 while q:
  node=q.popleft()
  for c in P['connections']+P['wrapConnections']:
   if not is_open(c,age,achievement):continue
   a,b=c['fromDistrict'],c['toDistrict'];other=b if node==a else a if node==b else None
   if other and other not in seen:seen.add(other);q.append(other)
 return seen
results=[]
for age in [40,44.99,45,49.99,50,54.99,55,59.99,60]:
 for achievement in [False,True]:
  walk=set(floor)
  for c in P['connections']:
   if c['gate'] and not is_open(c,age,achievement):walk-=rect_cells(c['gate'])
  for c in P['wrapConnections']:
   if not is_open(c,age,achievement):
    for gate in c['gates']:walk-=rect_cells(gate)
  reached=flood(walk,start)
  actual={id for id,cells in districts.items() if cells&reached}
  expected={d['id'] for d in P['districts'] if (d['minAge'] is not None and age>=d['minAge']) or (d['achievement'] and achievement)}
  assert actual==expected,(age,achievement,actual,expected)
  assert graph_reachable(age,achievement)==expected,(age,'graph differs')
  for id,cells in districts.items():
   if id not in expected:assert not reached&cells,(age,id,'locked area reachable')
  results.append(dict(age=age,achievement=achievement,reachable=sorted(actual),reachableFloorPixels=len(reached)*256))
# Every dressed clear-space shape fits its district; no new solids are placed.
for space in P['combatSpaces']:
 sh=space['shape']
 if sh['type']=='rect':cells=rect_cells(sh)
 elif sh['type']=='polygon':cells=poly_cells(sh['points'])
 else:cells={(x,y) for y in range(H) for x in range(W) if ((x*16+8-sh['cx'])/sh['rx'])**2+((y*16+8-sh['cy'])/sh['ry'])**2<=1}
 assert cells<=districts[space['district']],space['id']
 assert space['decor'],space['id']
assert len(P['production']['propFamilies'])==72
assert all(p['variants'] in [2,3] and p['status']=='planned-not-generated' for p in P['production']['propFamilies'])
assert P['production']['maxVisibleProps']==120 and P['production']['enemyStressTarget']==350
base=next(r for r in results if r['age']==40 and not r['achievement'])
assert base['reachableFloorPixels']>=1280*800*4
out=dict(status='proposal-geometry-passed',cellSize=16,startingFloorPixels=base['reachableFloorPixels'],startingScreenAreas=round(base['reachableFloorPixels']/(1280*800),2),cases=results,lockedFloorLeak=False,wrapBypass=False,combatSpaces=len(P['combatSpaces']),propFamilies=72,runtimeImplemented=False,performanceTested=False)
(R/'campus-v2-checks.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:v for k,v in out.items() if k!='cases'}))
# Native sign/caption contracts are planned now and checked before asset production.
ids={p['id'] for p in P['production']['propFamilies']}
for c in P['production']['captions']:
 assert c['propId'] in ids and 1<=len(c['shortLabel'].split())<=3
 assert c['signMinWidth']>=64 and c['radiusPx']==128 and c['once']=='per-run'
# Keep actual image dimensions and hashes alongside the current proposal.
import hashlib,struct
assets=[]
for id,file,district,status in [('campus-overview-v2','campus-overview-v2.png','all','awaiting-v2-review'),('parking-lot-closeup','parking-lot-closeup-v1.png','parking','approved-style-density-scale-target'),('campus-overview-v1','campus-overview-v1.png','all','superseded-grid-layout')]:
 data=(R/file).read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n'
 digest=hashlib.sha256(data).hexdigest()
 if district=='parking':assert digest=='868f2d7c905fef49208bbf66c304fbffce36ab80abc1ada0967375980f28aedf','Approved image changed'
 assets.append(dict(id=id,file=file,size=list(struct.unpack('>II',data[16:24])),floorFootprint=None,solid=False,kind='concept-illustration',district=district,frameCount=1,status=status,sha256=digest,prompt=file.replace('.png','-prompt.txt')))
manifest=dict(batch='stage-pass-1',revision=2,status='awaiting-v2-review-before-stage-2',productionReady=False,worldSize=[7680,4320],assets=assets,layout='campus-layout-v2.json',measuredPlan='campus-plan-v2.svg',schedule='campus-promotions.json',productionPlan='campus-kit-plan.json',checks='campus-v2-checks.json',review='../../devlog/art/stage-pass-v2.html',notes=['Parking Lot v1 stays approved and unchanged.','Illustration is approximate; measured data defines floor geometry and gates.','72 prop families are planned, not generated; instance placements and native-size prop review belong to Stage 2.','No runtime gates, spawn policy, captions or map replacement have shipped. Performance is a target, not measured for this proposed world.'])
(R/'campus-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
