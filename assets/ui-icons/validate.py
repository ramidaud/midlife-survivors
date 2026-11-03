"""Check icon palette, padding and coverage against the live UI metadata."""
from pathlib import Path
import json, subprocess, sys
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent/'breakables'))
from png_qa import png
m=json.loads((R/'icons-v1.json').read_text())
ui=subprocess.check_output(['node','-e',"""const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('src/ui.js','utf8').split('const THEME_LABELS')[0];const x={};vm.runInNewContext(s+';this.keys=[Object.keys(UPGRADE_META),Object.keys(CHAR_ICONS)]',x);console.log(JSON.stringify(x.keys));"""],cwd=R.parent.parent)
assert json.loads(ui)==[list(m['cards']),list(m['characters'])]
w,h,rows=png(R/m['image']);assert (w,h)==(256,160)
key=(255,0,255,255);navy=(23,28,53,255)
palette={tuple(bytes.fromhex(hex))+(255,) for hex in '171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f ff00ff'.split()}
mapped=list(m['cards'].values())+list(m['characters'].values())+[m['fallback']]
assert sorted(mapped+m['reserved'])==list(range(40))
seen=set()
for i in range(40):
 x0=i%8*32;y0=i//8*32
 cell=tuple(tuple(row[x0:x0+32]) for row in rows[y0:y0+32])
 fg={(x,y) for y in range(32) for x in range(32) if cell[y][x]!=key}
 assert bool(fg)==(i in mapped)
 if fg:
  assert cell not in seen;seen.add(cell)
  assert all(2<=x<30 and 2<=y<30 for x,y in fg)
  assert all(cell[y][x] in palette for x,y in fg)
  assert all(cell[y][x]==navy for x,y in fg if any((x+dx,y+dy) not in fg for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]))
print(f'{len(mapped)} unique icons, exact UI keys, opaque magenta padding and navy outlines passed.')
