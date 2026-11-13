"""Validate the exported review, door clearances, links and exact 3x previews."""
from pathlib import Path
from html.parser import HTMLParser
import json
import numpy as np
from PIL import Image
ROOT=Path(__file__).parent;OUT=ROOT/'deliver'
v=json.loads((OUT/'validation-ground-floor.json').read_text());assert v['passed'] and v['actualPieces']==56,v
assert not (OUT/'sources').exists(),'Duplicate exported source folder returned'
manifest=json.loads((OUT/'manifest-ground-floor.json').read_text())
for piece in manifest['pieces']:assert (OUT/piece['source']).exists(),piece['source']
routes=json.loads((OUT/'route-checks.json').read_text())
for room in ['dining-desk-shared','kitchen','entry']:assert routes[room]['doorClearancePassed'],room
assert not routes['living']['doorClearancePassed'],'Round-two fixed layout constraint must remain explicit'
assert routes['living']['reviewConstraint']
assert not routes['laundry-closet']['doorClearancePassed'],'Existing closet/appliance limit must remain explicit'
assert routes['laundry-closet']['existingConstraint']
for room in routes:
 small=np.asarray(Image.open(OUT/f'mockups/{room}-1x.png'))
 large=np.asarray(Image.open(OUT/f'mockups/{room}-3x.png'))
 assert np.array_equal(large,np.repeat(np.repeat(small,3,0),3,1)),room
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key in ['src','href'] and value and not value.startswith(('http:','https:','#')):assert (OUT/value).exists(),value
Links().feed((OUT/'review.html').read_text())
print('PASS: 56 assets; three unchanged through-room routes; explicit living/closet failures; five exact 3x previews; all review links.')

layout=json.loads((OUT/'mockups/room-layout.json').read_text())
placed=layout['placements']
bassinets=next(p for p in placed if p['id']=='twin-bassinets')
assert bassinets['at']==[0,0], 'Bassinets must stay in northwest corner'
drawings=next(p for p in placed if p['id']=='kids-drawings')
sizes={p['id']:p['size'] for p in manifest['pieces']}
assert drawings['at'][1]+sizes['kids-drawings'][1]<=0,'Drawings extend onto floor'
plant=next(p for p in placed if p['id']=='houseplant-cluster')
painting=next(p for p in placed if p['id']=='abstract-wall-painting')
assert plant['at'][0]+sizes['houseplant-cluster'][0]<=painting['at'][0], 'Plant overlaps painting'
print('PASS: northwest bassinets, wall-mounted drawings, plant clear of painting, source links and no duplicate sources folder.')

requested={'south-love-seat':[276,90],'side-table-lamp':[84,108],'leather-recliner':[120,90],'racing-sim-rig':[180,132],'round-coffee-table':[186,42],'galaxy-wall-tv':[92,120],'blanket-basket':[56,28]}
for id,size in requested.items():assert sizes[id]==size,(id,sizes[id])
source=json.loads((ROOT/'placements-round2.json').read_text())['rooms']['living']['items']
living=[p for p in placed if p['room']=='living']
assert len(living)==len(source)
for item,p in zip(source,living):
 assert item['id']==p['id']
 if item['id'] not in ['galaxy-wall-tv','blanket-basket']:assert p['at']==[item['x'],item['y']],item
 assert p['scaleApplied']==1 and p['rotationApplied']==0
for p in manifest['pieces']:
 if p['id'] not in requested:continue
 _,_,sw,sh=p['sourceFit'];x0,y0,x1,y1=p['sourceCrop']
 f=p['reductionFactor'];w,h=p['size']
 scale=min(1,(w-6)*f/(x1-x0),(h-6)*f/(y1-y0))
 assert abs(sw-(x1-x0)*scale)<=1 and abs(sh-(y1-y0)*scale)<=1,p['id']
print('PASS: seven requested native sizes, proportional source fits and round-two furniture positions without stretching or rotation.')
