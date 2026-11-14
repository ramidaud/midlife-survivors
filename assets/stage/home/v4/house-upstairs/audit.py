"""Audit the delivered art package, without opening the game or sending stats."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib, json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'deliver'
manifest=json.loads((OUT/'manifest-upstairs.json').read_text())
layout=json.loads((OUT/'mockups/room-layout.json').read_text())
validation=json.loads((OUT/'validation.json').read_text())
plan=json.loads((ROOT/'generation-plan.json').read_text())
expected=len(plan)
assert validation['passed'] and validation['actualPieces']==expected
hashes={p['id']:p['sha256'] for p in validation['checks']}
sources=[p.resolve() for p in (ROOT/'sources').glob('*.png') if not p.name.startswith('.')]
assert len(sources)==expected+1 and len(set(sources))==expected+1
assert not (OUT/'sources').exists(),'Keep only one source folder'
used_sources={(OUT/p['source']).resolve() for p in manifest['pieces']}
coffee=json.loads((OUT/'coffee-table-manifest.json').read_text())
used_sources.add((OUT/coffee['source']).resolve())
assert used_sources==set(sources)
for p in manifest['pieces']:
 for key in ('file','source','working','comparison1x'):assert (OUT/p[key]).is_file(),(p['id'],key)
 assert hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()==hashes[p['id']]
for p in manifest['reusedPieces']:assert (OUT/p['file']).is_file()
for key in ('file','source','working','comparison1x','previousArt'):assert (OUT/coffee[key]).is_file(),key
assert all(coffee[key] for key in ('sameSize','sameFootprints','sameAlpha','propsAndBaseUnchanged','threeOakTones'))
assert coffee['size']==[186,42]
assert len(layout['views'])==9
for v in layout['views']:
 assert layout['routeChecks'][v['id']]['passed'],v['id']
 for path in (v['file'],v['overlay']):
  native=np.asarray(Image.open(OUT/path.replace('-3x','-1x')))
  large=np.asarray(Image.open(OUT/path))
  assert np.array_equal(large,np.repeat(np.repeat(native,3,0),3,1)),path
assert layout['routeChecks']['abe-room']['mainOpenSquarePassed']
assert layout['routeChecks']['abe-room']['northWallFace']['continuous']
assert not layout['routeChecks']['abe-room']['northWallFace']['carpetCutout']
coverage=json.loads((OUT/'edge-coverage.json').read_text())
assert set(coverage)=={'master-bedroom','abe-room','walk-in-closet','hall','linen','utility'}
assert all(room['passed'] for room in coverage.values()),coverage
rooms_to_art={'walk-in-closet':'closet-picture','hall':'hall-picture','linen':'linen-picture','utility':'utility-picture'}
for room,picture in rooms_to_art.items():
 assert any(p['room']==room and p['id']==picture for p in layout['placements'])
 assert not any(p['room']==room and p['id']=='hall-wall' for p in layout['placements'])
assert len({hashes[id] for id in rooms_to_art.values()})==4
# The exposed top-left 20px of Abe's full north face must match the actual
# painted plaster/baseboard strip, never the carpet texture.
strip=Image.open(ROOT.parent/'house-ground-floor/north-wall-strip-v1.png').convert('RGBA')
expected_wall=Image.new('RGBA',(20,128))
expected_wall.alpha_composite(strip.crop((0,0,20,32)),(0,0))
expected_wall.alpha_composite(strip.crop((0,0,20,96)),(0,32))
abe=Image.open(OUT/'mockups/abe-room-1x.png').convert('RGBA')
assert np.array_equal(np.array(abe.crop((16,32,36,160))),np.array(expected_wall))
assert all(p['rotationApplied']==0 and p['scaleApplied']==1 for p in layout['placements'])
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  assert tag!='script','Static review must never load game scripts or telemetry'
  for key,value in attrs:
   if key in ('src','href') and value and not value.startswith(('http:','https:','#')):
    assert (OUT/value).is_file(),value
Links().feed((OUT/'review.html').read_text())
report=dict(passed=True,newPaintings=expected,coffeeTableFix=True,sourcePaintings=expected+1,singleSourceFolder=True,rooms=9,allDoorRoutesPassed=True,wallRunsWithin160px=True,distinctRoomPictures=True,abeNorthFaceHasNoCarpetCutout=True,exactNativeAnd3xPreviews=True,coffeeCanvasSilhouetteBasePropsAndFootprintPreserved=True,reviewLinksExist=True,transformsApplied=False,telemetryLoaded=False,browserCheck='Local file browser access was previously blocked; direct native image QA.')
(OUT/'checks/delivery-checks.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'PASS: {expected} upstairs paintings + coffee fix; nine door routes; six room edge checks; full north face; distinct pictures; native/3x previews and links; no game scripts or stats.')
