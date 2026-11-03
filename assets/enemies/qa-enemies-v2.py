"""Read-only v1 invariants, v2 pixel QA and an isolated embedded review manifest."""
from pathlib import Path
import base64,hashlib,json,sys
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent/'breakables'))
from png_qa import png
specs=json.loads((R/'batch-v2.json').read_text());old={s['id']:s for s in json.loads((R/'batch-1.json').read_text())}
BG=(255,0,255,255);NAVY=(23,28,53,255)
hexes='171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf'.split()
colors={tuple(bytes.fromhex(h))+(255,) for h in hexes}|{BG}
for path,digest in json.loads((R/'v1-invariants-v2.json').read_text()).items():assert hashlib.sha256((R.parents[1]/path).read_bytes()).hexdigest()==digest,('Existing enemy file changed',path)
def gif_meta(path):
 data=path.read_bytes();assert data[:6] in (b'GIF87a',b'GIF89a')
 pos=13+(3*(2**((data[10]&7)+1)) if data[10]&128 else 0);frames=0;delays=[]
 def blocks(pos):
  while data[pos]:pos+=data[pos]+1
  return pos+1
 while data[pos]!=59:
  if data[pos]==33:
   if data[pos+1]==249:delays.append(int.from_bytes(data[pos+4:pos+6],'little')*10)
   pos=blocks(pos+2)
  else:
   assert data[pos]==44
   packed=data[pos+9];pos+=10
   if packed&128:pos+=3*(2**((packed&7)+1))
   pos=blocks(pos+1);frames+=1
 return frames,delays
names=['Bill','Late Fee','Spam Likely','Late-Night Donut','Back Twinge','Reply All','3 AM Thought','Calendar Invite','Group Chat','Math Homework','Group Chat ping']
assets=[];checks=[]
for s,name in zip(specs,names):
 id=s['id'];n=s['size'];count=s['frames'];w,h,rows=png(R/s['file']);ow,oh,prior=png(R/('enemy-'+id+'-v1.png'))
 assert (w,h)==(n*count,n),(id,'Dimensions')
 assert all(p in colors for row in rows for p in row),(id,'Palette/opacity')
 frames=[];ink=[];bounds=[]
 for f in range(count):
  cell=[r[f*n:(f+1)*n] for r in rows]
  assert all(p==BG for p in cell[0]+cell[-1]+[r[0] for r in cell]+[r[-1] for r in cell]),(id,f,'Cell margin')
  pixels=[(x,y) for y in range(n) for x in range(n) if cell[y][x]!=BG]
  assert len(pixels)>12
  box=[min(x for x,y in pixels),min(y for x,y in pixels),max(x for x,y in pixels),max(y for x,y in pixels)]
  bounds.append(box);ink.append(len(pixels));frames.append(bytes(c for row in cell for p in row for c in p))
  if id in ['bill','late-fee','spam-likely','calendar-invite']:assert box[3]==n-3,(id,f,'Feet drift')
  if id=='late-night-donut':assert box[3]==[45,44,43,44,45,44,43,44][f],(id,f,'Bounce contact')
  if not(id=='3am-thought' and f>=4):
   for x,y in pixels:
    if any(cell[b][a]==BG for a,b in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]):assert cell[y][x]==NAVY,(id,f,'Outline',x,y)
 assert len(set(frames))==count,(id,'Duplicate poses')
 # Key poses are pixel-exact. The final ghost key deliberately has a softer palette.
 exact=[]
 for k,p in enumerate(s['keyV1']):
  f=k*2
  if id=='3am-thought' and f==6:continue
  expected=bytes(c for row in prior for pixel in row[p*n:(p+1)*n] for c in pixel)
  assert frames[f]==expected,(id,f,'V1 key pose mismatch');exact.append(dict(v2=f,v1=p))
 if id=='3am-thought':
  assert min(ink[:4])>ink[4]>ink[5]>max(ink[6:]),('Ghost fade density',ink)
  assert all(rows[y][f*n+x]!=NAVY for f in [6,7] for y in range(n) for x in range(n)), 'Ghost should be low contrast'
 gif=R/('enemy-'+id+'-preview-v2.gif');gif_frames,gif_delays=gif_meta(gif);assert gif_frames==count;assert sum(gif_delays)==round(old[id]['delay']*1000/2*count),(id,'GIF loop duration',gif_delays)
 groups=[dict(name='Walk' if count==8 else 'Pulse',v1=list(range(old[id]['frames'])),v2=list(range(count)))]
 if id=='spam-likely':groups=[dict(name='Walk',v1=[0,1],v2=[0,1,2,3]),dict(name='Ring',v1=[2,3],v2=[4,5,6,7])]
 if id=='back-twinge':groups=[dict(name='Lunge',v1=[1,2],v2=[0,1,2,3]),dict(name='Rest / twitch',v1=[0,3],v2=[4,5,6,7])]
 if id=='3am-thought':groups=[dict(name='Solid float',v1=[0,3],v2=[0,1,2,3]),dict(name='Fade out',v1=[1],v2=[4,5]),dict(name='Ghost',v1=[2],v2=[6,7])]
 if len(groups)>1:groups.append(dict(name='Full atlas',v1=list(range(old[id]['frames'])),v2=list(range(count))))
 delay=round(old[id]['delay']*1000)
 a=dict(id=id,name=name,size=n,anchor=old[id]['anchor'],frames=count,v1Frames=old[id]['frames'],v1DelayMs=delay,v2DelayMs=delay/2,groups=groups,file=s['file'],v1File='enemy-'+id+'-v1.png',preview=gif.name,source=s['source'],keyPoses=exact,bounds=bounds)
 assets.append(a);checks.append(dict(id=id,dimensions=[w,h],uniqueFrames=count,gifFrames=gif_frames,gifDelaysMs=gif_delays,opaqueMagenta=True,palette=True,clearMargins=True,footBounds=bounds,ink=ink,exactKeys=exact,sha256=hashlib.sha256((R/s['file']).read_bytes()).hexdigest()))
manifest=dict(status='art-only-awaiting-Rami-review',versionBump=False,runtimeChanged=False,v1Untouched=True,generation='built-in-imagegen; anchor-constrained native cleanup',palette=['#'+h.upper() for h in hexes],background='#FF00FF',families=len(assets),frames=sum(s['frames'] for s in assets),assets=assets,notes=['Use native one-row PNGs, not source studies.','Source drawings are 4x2 pose studies; production sheets flatten to one row.','PNG ghost see-through is exact-magenta pixel omission, not partial alpha.','Review uses exact halved frame delays. GIF delays alternate centiseconds where needed to preserve total loop duration.','Claude owns integration, attack states and invulnerability timing.'])
(R/'manifest-v2.json').write_text(json.dumps(manifest,indent=2)+'\n')
embedded=json.loads(json.dumps(manifest))
for a in embedded['assets']:
 for key,path in [('v1Src',a['v1File']),('v2Src',a['file'])]:a[key]='data:image/png;base64,'+base64.b64encode((R/path).read_bytes()).decode()
(R/'review-v2-data.js').write_text('window.ENEMY_V2_REVIEW='+json.dumps(embedded,separators=(',',':'))+';\n')
(R/'checks-v2.json').write_text(json.dumps(dict(status='passed',families=11,frames=84,v1FilesUntouched=True,checks=checks),indent=2)+'\n')
print('PASS: 11 v2 sheets, 84 unique poses; native dimensions, exact palette/magenta, margins, outlines, feet, anchor parity, ghost density and all v1 file hashes.')
