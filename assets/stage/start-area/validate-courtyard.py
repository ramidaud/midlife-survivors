"""Verify built Courtyard footprints against the measured plan and original outer rooms."""
from pathlib import Path
import json
R=Path(__file__).resolve().parent
D=json.loads((R/'layout.json').read_text())
plan=json.loads((R.parent/'layout-plan/plan-geometry.json').read_text())['options']['B']
office=D['officeLoop']
floor=[p for p in D['floors'] if p.get('district') in ('lobby','bullpen')]
def inside(x,y):
    return any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in floor)
def overlap(a,b):
    x,y,w,h=a
    u,v,s,t=b
    return x<u+s and x+w>u and y<v+t and y+h>v
def r(p):
    return p['x'],p['y'],p['width'],p['height']
fixtures={}
for p in D['placements']:
    spec=D['assetSpecs'][p['prop']]
    if spec['solid'] and p.get('solid',True):
        f=spec['footprint']
        fixtures[p['id']]=(p['x']-f['width']/2,p['y']-f['back'],f['width'],f['back']+f['front'])
for p in office['partitions']:
    fixtures[p['id']]=(p['x'],p['y'],p['w'],p['h'])
for p in office['workstations']:
    fixtures[p['id']]=(p['x'],p['y']+20,p['w'],p['h']-20)
for p in D['workers']:
    if p.get('seated'):
        fixtures[p['id']]=(p['x']-14,p['y']-18,28,18)
early=[k for k in fixtures if k.startswith(('loop-','seat-','glass-','partition-')) or k=='elevators' or k in {d['id'] for d in office['workstations']}]
for id in early:
    x,y,w,h=fixtures[id]
    assert all(inside(a,b) for a in (x+.01,x+w-.01) for b in (y+.01,y+h-.01)),(id,'outside room')
    for other in early:
        if other>id:
            assert not overlap(fixtures[id],fixtures[other]),(id,other,'overlapping furniture')
routes=[r(p) for p in D['protectedRoutes'] if p['id'].startswith('courtyard-')]
assert all(tuple(p) in routes for p in plan['clearanceRectangles'])
arena=[tuple(p[1:]) for p in plan['arenas']]
for a in routes+arena:
    for name,b in fixtures.items():
        assert not overlap(a,b),(a,name,b)
    for p in D['walls']:
        assert not overlap(a,r(p)),(a,p['id'])
assert len(office['workstations'])==20
assert sum(bool(p.get('seated')) for p in D['workers'])==15
assert len(office['scenes'])==5
assert all(light['r']>0 and light['kind'] in {'lamp','window','vending','server','screen'} for light in D['lights'])
print(f'{len(routes)} clear route rectangles, 3 open arenas, {len(early)} early solid fixtures, {len(D["lights"])} light anchors.')
