"""Read-only native PNG QA plus saved report. Python standard library only."""
from pathlib import Path
import json,struct,zlib,hashlib,sys
R=Path(__file__).resolve().parent
manifest_file=sys.argv[1] if len(sys.argv)>1 else 'manifest.json'
M=json.loads((R/manifest_file).read_text())
def png(path):
 data=path.read_bytes();offset=8;packed=b''
 while offset<len(data):
  n=struct.unpack('>I',data[offset:offset+4])[0];kind=data[offset+4:offset+8];chunk=data[offset+8:offset+8+n];offset+=12+n
  if kind==b'IHDR':w,h,depth,color,_,_,interlace=struct.unpack('>IIBBBBB',chunk)
  elif kind==b'IDAT':packed+=chunk
 assert depth==8 and color in [2,6] and interlace==0,(path,depth,color,interlace)
 channels=4 if color==6 else 3;stride=w*channels;raw=zlib.decompress(packed);rows=[];prev=bytearray(stride);pos=0
 def paeth(a,b,c):
  p=a+b-c;dist=[abs(p-a),abs(p-b),abs(p-c)];return [a,b,c][dist.index(min(dist))]
 for y in range(h):
  filt=raw[pos];row=bytearray(raw[pos+1:pos+1+stride]);pos+=stride+1
  for x in range(stride):
   a=row[x-channels] if x>=channels else 0;b=prev[x];c=prev[x-channels] if x>=channels else 0
   row[x]=(row[x]+(0 if filt==0 else a if filt==1 else b if filt==2 else (a+b)//2 if filt==3 else paeth(a,b,c)))%256
  rows.append([tuple(row[i:i+channels])+(255,) if channels==3 else tuple(row[i:i+channels]) for i in range(0,stride,channels)]);prev=row
 return w,h,rows
allowed={tuple(bytes.fromhex(c[1:]))+(255,) for c in M['palette']};magenta=(255,0,255,255);allowed.add(magenta);navy=(23,28,53,255);results=[]
for s in M['assets']:
 w,h,rows=png(R/s['file']);fw,fh=s['frame'];assert (w,h)==(fw*s['variants'],fh)
 hashes=[];masks=[]
 for v in range(s['variants']):
  frame=[row[v*fw:(v+1)*fw] for row in rows];pixels=[p for row in frame for p in row]
  assert set(pixels)<=allowed,s['id'];assert all(p[3]==255 for p in pixels)
  assert all(p==magenta for p in frame[0]+frame[-1]+[row[0] for row in frame]+[row[-1] for row in frame]),s['id']
  mask={(x,y) for y,row in enumerate(frame) for x,p in enumerate(row) if p!=magenta};assert mask
  for x,y in mask:
   if any((a,b) not in mask for a,b in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]):assert frame[y][x]==navy,(s['id'],'outline')
  _,_,individual=png(R/(s['id']+'-variant-'+str(v+1)+'-v1.png'));assert individual==frame
  masks.append(mask);hashes.append(hashlib.sha256(bytes(k for p in pixels for k in p)).hexdigest())
 assert all(mask==masks[0] for mask in masks),'variant silhouette changed'
 assert len(set(hashes))==s['variants'],(s['id'],'duplicate colorway')
 assert s['footprint']['width']<=fw and s['footprint']['back']+s['footprint']['front']<=fh
 results.append(dict(id=s['id'],size=[w,h],variants=s['variants'],palette=True,opaque=True,flatMagentaMargins=True,navySilhouette=True,identicalVariantMasks=True,uniqueColorways=True))
contract=json.loads((R/'gate-clearance.json').read_text());assert contract['openingLocal']['max']-contract['openingLocal']['min']==224
for j in contract['jambLocal']:assert j['x']+j['width']<=-112 or j['x']>=112
for g in contract['gates']:
 assert g['clearWidth']==224 and g['jambsOutsideOpening']
 for r in g['closedBlockers']:assert r['width' if g['openingAxis']=='x' else 'height']==224
report=dict(status='passed',families=len(results),colorways=sum(s['variants'] for s in M['assets']),assets=results,gateClearWidth=224,gateOpenings=sum(len(g['closedBlockers']) for g in contract['gates']),runtimeNavigationTouched=False,runtimePerformanceTested=False)
(R/('checks.json' if manifest_file=='manifest.json' else manifest_file.replace('manifest','checks'))).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='assets'}))
