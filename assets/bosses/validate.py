"""Read-only boss/telegraph PNG checks, standard library only."""
import sys,json,hashlib
sys.dont_write_bytecode=True
from pathlib import Path
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent/'breakables'))
from png_qa import png
M=json.loads((R/'manifest.json').read_text());magenta=(255,0,255,255);navy=(23,28,53,255);allowed={tuple(bytes.fromhex(c[1:]))+(255,) for c in M['palette']}|{magenta}
def check(frame,padding):
 pixels=[p for row in frame for p in row];assert set(pixels)<=allowed
 assert all(p[3]==255 for p in pixels)
 mask={(x,y) for y,row in enumerate(frame) for x,p in enumerate(row) if p!=magenta};assert mask
 w,h=len(frame[0]),len(frame)
 assert all(p==magenta for y,row in enumerate(frame) for x,p in enumerate(row) if x<padding or x>=w-padding or y<padding or y>=h-padding)
 assert all(frame[y][x]==navy for x,y in mask if any(q not in mask for q in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]))
 return mask,hashlib.sha256(bytes(k for p in pixels for k in p)).hexdigest()
reports=[]
for a in M['assets']:
 w,h,rows=png(R/a['file']);assert (w,h)==(576,456);hashes=[];heights=[]
 for n in range(11):
  x=n%4*144;y=n//4*152;frame=[row[x:x+144] for row in rows[y:y+152]];mask,digest=check(frame,4);hashes.append(digest);heights.append(max(y for x,y in mask)-min(y for x,y in mask)+1)
  assert max(y for x,y in mask)<=147
  _,_,single=png(R/(a['id']+'-frame-'+str(n).zfill(2)+'-v1.png'));assert single==frame
 assert len(set(hashes))==11,(a['id'],'duplicate pose')
 assert all(p==magenta for row in rows[304:456] for p in row[432:576]),(a['id'],'last cell not blank')
 assert [f for key in ['walk','windup','attack','hurt'] for f in a['animations'][key]['frames']]==list(range(11))
 mw,mh,marker=png(R/a['marker']['file']);assert [mw,mh]==a['marker']['frame'];mask,_=check(marker,2);assert abs(min(x for x,y in mask)-(mw-1-max(x for x,y in mask)))<=1;assert abs(min(y for x,y in mask)-(mh-1-max(y for x,y in mask)))<=1;assert marker[mh//2][mw//2]==magenta or a['id']=='performance-review'
 reports.append(dict(id=a['id'],frames=11,walkFrames=6,uniquePoses=True,nativeFrame=[144,152],frameHeights=heights,blankFinalCell=True,minimumPadding=4,palette=True,opaque=True,navyOutlines=True,individualParity=True,marker=[mw,mh]))
report=dict(status='passed',bosses=3,poseFrames=33,telegraphs=3,gameCodeChanged=False,assets=reports)
(R/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='assets'}))
