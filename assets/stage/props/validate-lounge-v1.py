"""Run from repo root. Validate the art-only Student Lounge delivery."""
import json,sys,hashlib
from pathlib import Path
sys.path.insert(0,str(Path('assets/breakables')))
from png_qa import png
root=Path('assets/stage/props');m=json.loads((root/'manifest-lounge.json').read_text());pal={tuple(bytes.fromhex(s[1:])) for s in m['palette']};bg=(255,0,255,255);report={'props':{}}
for a in m['assets']:
 f=root/a['file'];w,h,rs=png(f);cw,ch=a['frame'];assert(w,h)==(cw*a['frames'],ch),a['id']
 assert all(p[3]==255 and (p[:3] in pal or p==bg) for row in rs for p in row),a['id']
 assert hashlib.sha256(f.read_bytes()).hexdigest()==a['sha256']
 bounds=[]
 for n in range(a['frames']):
  pts=[(x,y) for y in range(ch) for x in range(cw) if rs[y][n*cw+x]!=bg];assert pts,a['id']
  b=[min(x for x,y in pts),min(y for x,y in pts),max(x for x,y in pts),max(y for x,y in pts)];bounds.append(b)
  if a['mount']=='floor':assert b[3]==ch-3,(a['id'],b)
 if a['solid']:assert a['footprint']['back']+a['footprint']['front']==a['footprint']['depth'] and a['footprint']['width']<=cw
 if a['repeatX']:assert all(row[:4]==row[-4:] for row in rs)
 if a['id']=='lounge_paper_lamp':
  c0=[rs[y][x] for y in range(ch) for x in range(cw)];c1=[rs[y][cw+x] for y in range(ch) for x in range(cw)]
  assert c0!=c1 and all((p==bg)==(q==bg) for p,q in zip(c0,c1))
  assert all(rs[y][:cw]==rs[y][cw:] for y in range(ch*3//4,ch))
 report['props'][a['id']]={'size':[w,h],'cells':a['frames'],'bounds':bounds,'palette_background_foot':True}
report['scenes']={}
for name,size in [('lounge-scene-v1.png',(960,360)),('lounge-scene-tall-v1.png',(600,720))]:
 f=Path('assets/ui')/name;w,h,rs=png(f);assert(w,h)==size
 assert all(p[3]==255 and p[:3] in pal for row in rs for p in row)
 assert all(rs[y+dy][x+dx]==rs[y][x] for y in range(0,h,3) for x in range(0,w,3) for dy in range(3) for dx in range(3)),name
 report['scenes'][name]={'size':[w,h],'opaque':True,'palette':True,'exact_3x_pixels':True,'bytes':f.stat().st_size}
report['families']=len(m['assets']);report['cells']=sum(a['frames'] for a in m['assets']);assert report['families']==11 and report['cells']==15
(root/'checks-lounge-v1.json').write_text(json.dumps(report,indent=2)+'\n');print('PASS: 11 families / 15 cells, palette, opaque magenta, feet, lamp masks, wall repeat and both 3x scene exports.')
