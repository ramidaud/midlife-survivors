"""Check exported patch/tile geometry, palette and boundaries."""
from pathlib import Path
import json, sys
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent.parent/'breakables'))
from png_qa import png
manifest=json.loads((R/'manifest-v1.json').read_text())
key=(255,0,255,255);navy=(23,28,53,255)
palette={tuple(bytes.fromhex(hex))+(255,) for hex in '171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f ff00ff'.split()}
cells={}
for a in manifest['assets']:
 w,h,rows=png(R/a['file']);assert [w,h]==a['frame']
 assert {p for row in rows for p in row}<=palette
 if a['kind']=='tile':
  assert rows[0]==rows[-1] and all(row[0]==row[-1] for row in rows)
  assert all(key not in row for row in rows)
 else:
  assert all(row[32]==row[63] for row in rows) and rows[32]==rows[63],a['id']
  assert all(q==key for q in rows[0]+rows[-1]) and all(row[0]==row[-1]==key for row in rows)
  if a['kind']=='rug':
   for y in range(1,h-1):
    for x in range(1,w-1):
     if rows[y][x]!=key and any(rows[y+dy][x+dx]==key for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]):
      assert rows[y][x]==navy,(a['id'],x,y)
 cells[a['id']]=rows
for name,n in [('decorAtlas',96),('floorAtlas',64)]:
 a=manifest[name];w,h,rows=png(R/a['image'])
 assert (w,h)==(a['columns']*n,a['rows']*n)
 for i,id in enumerate(a['order']):
  x=i%a['columns']*n;y=i//a['columns']*n
  assert [r[x:x+n] for r in rows[y:y+n]]==cells[id]
print('8 native decor cells: exact palette, outlines, matching repeat seams and atlas parity passed.')
