"""Check the art delivery while keeping fixed-layout clearance failures explicit."""
import sys
sys.dont_write_bytecode=True
from pathlib import Path
import json, hashlib
from html.parser import HTMLParser
import numpy as np
from PIL import Image
from build import floor_footprints, rooms_api
ROOT=Path(__file__).resolve().parent;OUT=ROOT/'deliver';PROJECT=ROOT.parents[4]
manifest=json.loads((OUT/'manifest-round3.json').read_text())
validation=json.loads((OUT/'validation.json').read_text())
layout=json.loads((OUT/'mockups/room-layout.json').read_text())
saved=json.loads((PROJECT/'docs/plans/house-layout/rami-layout-nov13.json').read_text())['rooms']
assert validation['passed'] and validation['actualPieces']==10
expected={'galaxy-wall-tv':[184,240],'electric-console-east':[216,84],'kitchen-counter-west':[240,90],'bird-of-paradise':[64,80],'camera-book-shelves':[194,90],'tv-cube-shelf-east':[96,216],'record-dresser-south':[306,114],'hamper':[72,78],'guitar-amp':[60,48],'abe-rug':[224,320]}
assert {p['id']:p['size'] for p in manifest['pieces']}==expected
sources={(OUT/p['source']).resolve() for p in manifest['pieces']}
assert len(sources)==10
assert sources=={p.resolve() for p in (ROOT/'sources').glob('*.png') if not p.name.startswith('.')}
assert not (OUT/'sources').exists()
hashes={p['id']:p['sha256'] for p in validation['checks']}
for p in manifest['pieces']:
 for field in ('file','source','working','comparison1x','previousArt'):assert (OUT/p[field]).is_file(),(p['id'],field)
 assert hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()==hashes[p['id']]
for p in manifest['reusedPieces']:assert (OUT/p['file']).is_file(),p['id']
assert len(layout['views'])==4
for v in layout['views']:
 entries=saved['up-abe-room' if v['id']=='abe-room' else v['id']]
 actual=[p for p in layout['placements'] if p['room']==v['id']]
 assert len(actual)==len(entries)
 for p,entry in zip(actual,entries):
  assert [p['editorId'],*p['at'],p['editorRequestedScale'],p['editorRequestedRotation']]==entry
  assert p['scaleApplied']==1 and p['rotationApplied']==0
 for path in (v['file'],v['overlay']):
  native=np.asarray(Image.open(OUT/path.replace('-3x','-1x')));big=np.asarray(Image.open(OUT/path))
  assert np.array_equal(big,native.repeat(3,0).repeat(3,1)),path
small=next(p for p in layout['placements'] if p['room']=='living' and p['id']=='bird-of-paradise')
full=next(p for p in layout['placements'] if p['room']=='living' and p['id']=='bird-of-paradise-original')
assert small['at']==[544,-40] and full['at']==[148,-76]
routes=layout['routeChecks']
assert not routes['living']['passed'] and not routes['dining-desk-shared']['passed']
assert routes['kitchen']['passed'] and not routes['kitchen']['layoutNeedsReview']
assert routes['abe-room']['passed'] and routes['abe-room']['unreachableClearSquares']>0
assert any({o['left'],o['right']}=={'record-dresser-south','hamper'} for o in routes['abe-room']['footprintOverlaps'])
assert routes['abe-room']['layoutNeedsReview']
# Regression: a hanging plant entirely north of the floor cannot block it.
doors=[['west','west',0,200],['east','east',0,200]]
report,_=rooms_api.route_check((200,200),floor_footprints([{'footprints':[[0,-80,200,10]]}],200,200),doors,['west','east'])
assert report['passed']
report,_=rooms_api.route_check((200,200),floor_footprints([{'footprints':[[90,0,20,200]]}],200,200),doors,['west','east'])
assert not report['passed']
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  assert tag!='script','No game scripts or telemetry in the review'
  for key,value in attrs:
   if key in ('src','href') and value and not value.startswith(('http:','https:','#')):assert (OUT/value).is_file(),value
Links().feed((OUT/'review.html').read_text())
report=dict(artPackagePassed=True,paintedVariants=10,singleSourceFolder=True,savedEditorCoordinatesPreserved=True,exactNativeSizes=True,exact3xRoomAndFootprintPreviews=True,reviewLinksExist=True,aboveFloorFootprintRegressionPassed=True,solidBarrierRegressionPassed=True,layoutReadyForPlacement=False,doorRoutes={k:r['passed'] for k,r in routes.items()},roomsNeedingLayoutReview=[k for k,r in routes.items() if r['layoutNeedsReview']],runtimeTouched=False,telemetryLoaded=False)
(OUT/'checks/delivery-checks.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASS: 10 art variants; saved editor positions; four exact 3x rooms/overlays; source/size/hash/link checks; two clearance regressions. Fixed layout constraints remain flagged, not approved for placement.')
