"""Read-only native palette, cell, colorway, and preserved-car checks."""
from pathlib import Path
import json,sys,hashlib
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parents[1]/'breakables'))
from png_qa import png
mag=(255,0,255,255)
M=json.loads((R/'manifest-2d.json').read_text());palette={tuple(bytes.fromhex(c[1:]))+(255,) for c in M['palette']}|{mag}
checks=[]
for a in M['assets']:
 w,h,rows=png(R/a['file']);fw,fh=a['frame'];assert(w,h)==(fw*a['variants'],fh)
 masks=[];unique=[]
 for v in range(a['variants']):
  cell=[r[v*fw:(v+1)*fw] for r in rows];colors={p for r in cell for p in r};assert colors<=palette,(a['id'],colors-palette)
  assert all(p==mag for p in cell[0]+cell[-1]+[r[0] for r in cell]+[r[-1] for r in cell]),a['id']
  masks.append([[p!=mag for p in r] for r in cell]);unique.append(hashlib.sha256(bytes(n for r in cell for p in r for n in p)).hexdigest())
 assert all(m==masks[0] for m in masks),a['id'];assert len(set(unique))==a['variants'],a['id']
 checks.append(dict(id=a['id'],frame=[fw,fh],colorways=a['variants'],palette=True,magentaMargins=True,sharedSilhouette=True))
w,h,new=png(R/'car_compact-campus-v2.png');ow,oh,old=png(R/'car_compact-v1.png');assert (w,h)==(720,112) and all(a[:ow]==b for a,b in zip(new,old))
frames=[[r[v*144:(v+1)*144] for r in new] for v in range(5)]
assert len({str(f) for f in frames})==5
assert all([[p!=mag for p in r] for r in f]==[[p!=mag for p in r] for r in frames[0]] for f in frames)
report=dict(status='passed',families=checks,carFrames=5,originalThreeCarsPixelExact=True,extraCarColors=2)
(R/'checks-2d.json').write_text(json.dumps(report,indent=2)+'\n');print('8 families / 23 colorways passed. Original three cars exact; two extra paints distinct.')
