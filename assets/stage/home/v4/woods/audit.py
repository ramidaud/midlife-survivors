"""Validate the isolated Woods asset contract, animation and review-route clearance."""
from pathlib import Path
from html.parser import HTMLParser
import json, hashlib
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent;OUT=ROOT/'deliver'
manifest=json.loads((OUT/'manifest-woods.json').read_text())
pieces=manifest['pieces'];lookup={p['id']:p for p in pieces}
assert len(pieces)==12 and len(lookup)==12
families={
 'twin-stone-i':['#303750','#526078','#83A89A'],
 'twin-stone-ii':['#303750','#526078','#83A89A'],
 'mossy-rock-cluster':['#303750','#526078','#83A89A'],
 'forest-floor':['#9BAE73','#6D895B','#315B4B'],
 'forest-trail-straight':['#B97A58','#A88B70','#D3B78D'],
 'forest-trail-curve':['#B97A58','#A88B70','#D3B78D'],
 'tree-evergreen':['#315B4B','#3E7775','#83A89A'],
 'tree-birch-yellow':['#D8AD4A','#F2D7A1','#FFF0CF']}
reports=[]
for p in pieces:
 im=Image.open(OUT/p['file']);a=np.array(im)
 assert im.mode=='RGBA' and list(im.size)==p['size'],p['id']
 assert set(np.unique(a[:,:,3]))<={0,255},p['id']
 assert Image.open(OUT/p['working']).size==(im.width*4,im.height*4)
 assert p['availability']=={'mode':'Full Life','ageGreaterThan':65}
 for file in [p['source'],p['working'],p['comparison1x']]:assert (OUT/file).is_file()
 assert 0<=p['feetLine']<im.height
 for x,y,w,h in p['footprints']:
  assert 0<=x<x+w<=im.width and 0<=y<y+h<=im.height
  assert np.any(a[y:y+h,x:x+w,3]>0)
 assert bool(p['footprints'])==(p['kind']=='WALL')
 if p['id'].startswith('forest-'):assert np.all(a[:,:,3]==255)
 if p['id']=='forest-floor':
  for edge in (a[0,:,:3],a[-1,:,:3],a[:,0,:3],a[:,-1,:3]):assert np.all(edge==[155,174,115]),'forest floor must blend to the lawn color'
 if not p['id'].startswith('forest-'):assert np.any(a[:,:,3]==0) and np.any(a[:,:,3]==255)
 colors={'#'+bytes(c).hex().upper() for c in np.unique(a[a[:,:,3]>0,:3],axis=0)}
 assert colors<=set(manifest['palette']),p['id']
 for color in families.get(p['id'],[]):assert color in colors,(p['id'],color,'missing material tone')
 reports.append({'id':p['id'],'sizePass':True,'alphaPass':True,'footprintPass':True,'palettePass':True,'materialFamilyColors':families.get(p['id'],[]),'sha256':hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()})

fire=lookup['fireflies-loop'];assert fire['frameSize']==[32,32] and len(fire['frameFiles'])==4
frames=[Image.open(OUT/f).convert('RGBA') for f in fire['frameFiles']]
assert all(im.size==(32,32) for im in frames)
assert len({hashlib.sha256(im.tobytes()).hexdigest() for im in frames})==4
gif=Image.open(OUT/'fireflies-preview.gif');assert gif.n_frames==4
assert fire['frameDurationMs']==200 and fire['renderLayer']=='overhead' and not fire['footprints']

layout=json.loads((OUT/'checks/scene-layout.json').read_text());rx,ry,rw,rh=layout['mainRoute']
assert rw==224 and len(layout['exits'])==2
solid=0
for placed in layout['placements']:
 p=lookup[placed['id']]
 if p['kind']=='WALL':solid+=1
 for x,y,w,h in p['footprints']:
  x+=placed['x'];y+=placed['y']
  assert not (x<rx+rw and x+w>rx and y<ry+rh and y+h>ry),(p['id'],'blocks main route')
assert solid==12==layout['solidCount']

class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key in ('href','src') and not value.startswith(('http:','https:','#')):
    assert (OUT/value).resolve().is_file(),value
# The check report is created before its review link is validated.
report={'assetChecksPass':True,'pieces':reports,'fireflies':{'frames':4,'uniqueFrames':4,'frameSize':[32,32],'frameDurationMs':200,'loopPass':True},'scene':{'size':layout['size'],'solidCount':solid,'targetSolidCount':12,'mainRouteWidth':224,'routeClear':True,'exits':layout['exits']},'privacy':'All source paintings generated with built-in imagegen. No real photos added.','runtimePlacement':False,'browser':'Local file preview blocked by URL policy; native PNG QA completed, browser/device layout unverified.'}
(OUT/'checks/export-checks.json').write_text(json.dumps(report,indent=2)+'\n')
Links().feed((OUT/'review.html').read_text())
print('PASS: 12 assets, material tones, alpha, footprints, 4 animation frames, clear 224px route and review links')
