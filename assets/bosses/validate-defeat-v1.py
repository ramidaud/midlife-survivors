"""Run from repo root. Validate the art-only defeat kit."""
import json,sys
from pathlib import Path
sys.path.insert(0,'assets/breakables')
from png_qa import png
bg=(255,0,255,255);pal={tuple(bytes.fromhex(x[1:])) for x in json.loads(Path('assets/bosses/defeat-prompts-v1.json').read_text())['palette']}
report={}
for f,size in [('assets/enemies/remains-v1.png',(96,200)),('assets/bosses/boss-knockdown-v1.png',(1008,152)),('assets/ui/stamp-plate-v1.png',(48,24))]:
 w,h,rs=png(Path(f));assert(w,h)==size,f
 assert all(p[3]==255 and (p[:3] in pal or p==bg) for row in rs for p in row),f
 report[f]={'size':[w,h],'opaque_exact_key_and_palette':True,'bytes':Path(f).stat().st_size}
_,_,rs=png(Path('assets/enemies/remains-v1.png'));cells=[];ink=[]
for row in range(10):
 variants=[];counts=[]
 for col in range(3):
  v=tuple(rs[y][col*32+x] for y in range(row*20,row*20+20) for x in range(32));pts=[(x,y) for y in range(20) for x in range(32) if v[y*32+x]!=bg]
  assert 5<=len(pts)<30,(row,col,len(pts));assert min(x for x,y in pts)>0 and max(x for x,y in pts)<31 and min(y for x,y in pts)>0 and max(y for x,y in pts)<19
  if row==6:assert all(v[y*32+x][:3]==(191,168,207) for x,y in pts)
  variants.append(v);counts.append(len(pts))
 assert len(set(variants))==3,row;ink.append(counts)
report['remains']={'ink_pixels_per_variant':ink,'all_variants_distinct':True,'tint':'none','native_budget':29}
_,_,rs=png(Path('assets/bosses/boss-knockdown-v1.png'));bounds=[]
for col in range(7):
 pts=[(x,y) for y in range(152) for x in range(144) if rs[y][col*144+x]!=bg];b=[min(x for x,y in pts),min(y for x,y in pts),max(x for x,y in pts),max(y for x,y in pts)]
 assert b[3]==148,(col,b);assert b[0]>=4 and b[2]<=139 and b[1]>=4,(col,b);bounds.append(b)
report['knockdowns']={'bounds':bounds,'ground_line':148,'cell':[144,152]}
_,_,rs=png(Path('assets/ui/stamp-plate-v1.png'))
assert all(rs[y][x]==bg for y in range(8,16) for x in range(8,40))
assert any(p!=bg for row in rs for p in row)
assert all(rs[y][x]==rs[y][24] for y in list(range(8))+list(range(16,24)) for x in range(8,40))
assert all(rs[y][:8]==rs[12][:8] and rs[y][40:]==rs[12][40:] for y in range(8,16))
report['stamp']={'empty_center':True,'slice':8,'seamless_stretch_bands':True}
Path('assets/bosses/checks-defeat-v1.json').write_text(json.dumps(report,indent=2)+'\n');print('PASS: exact grids/palette/opaque magenta, 30 distinct sparse remains, seven y148 knockdowns and blank eight-pixel stamp slices.')
