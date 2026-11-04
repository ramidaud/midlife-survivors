import sys,json
from pathlib import Path
sys.path.insert(0,'assets/breakables')
from png_qa import png
palette={tuple(bytes.fromhex(x)) for x in ['171C35','303750','526078','3E7775','83A89A','D3B78D','F2D7A1','FFF0CF','EF9347','C45C4B','BFA8CF','F1B5BF']}
spec={'assets/ui/minimap-frame-v1.png':(64,64),'assets/ui/minimap-buttons-v1.png':(48,24),'assets/ui/minimap-icons-v1.png':(96,12),'assets/stage/props/evac-map-v1.png':(96,64)}
report={}
for f,size in spec.items():
 w,h,rows=png(Path(f));pixels=[v for row in rows for v in row]
 assert (w,h)==size,(f,w,h)
 assert all(v[3] in (0,255) for v in pixels),f
 assert all(v[:3] in palette for v in pixels if v[3]),f
 report[f]={'size':[w,h],'hard_alpha':True,'palette':True,'bytes':Path(f).stat().st_size}
_,_,rows=png(Path('assets/ui/minimap-frame-v1.png'))
assert all(rows[y][x]==(23,28,53,255) for y in range(16,48) for x in range(16,48))
# Invariant edge rails in the stretchable bands, no decorative seams.
assert all(rows[y][:16]==rows[32][:16] and rows[y][48:]==rows[32][48:] for y in range(16,48))
assert all(rows[y][x]==rows[y][32] for y in list(range(16))+list(range(48,64)) for x in range(16,48))
_,_,rows=png(Path('assets/stage/props/evac-map-v1.png'))
a=[[row[x] for x in range(48)] for row in rows];b=[[row[x+48] for x in range(48)] for row in rows]
assert a[63][24][3]==255 and b[63][24][3]==255
changes=[(x,y) for y in range(64) for x in range(48) if a[y][x]!=b[y][x]]
assert changes and len(changes)<20,changes
assert all(a[y][x][3]==b[y][x][3] for y in range(64) for x in range(48))
_,_,rows=png(Path('assets/ui/minimap-icons-v1.png'))
for n in range(8):assert any(rows[y][n*12+x][3] for y in range(12) for x in range(12))
report['invariants']={'flat_center':True,'nine_slice_straight_rails':True,'sign_fixed_foot':[24,63],'sign_changed_pixels':len(changes),'eight_nonempty_icons':True}
Path('assets/ui/checks-minimap-v1.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report['invariants']))
