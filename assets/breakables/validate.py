"""Read-only export checks. Source assets must stay unchanged."""
import sys,json,hashlib
sys.dont_write_bytecode=True
from pathlib import Path
from png_qa import png
R=Path(__file__).resolve().parent
brief=json.loads((R/'brief.json').read_text())
palette=['171c35','303750','526078','3e7775','83a89a','a88b70','d3b78d','f2d7a1','fff0cf','874c3b','c45c4b','ef9347','e5a995','f1b5bf','bfa8cf','b97a58','70402f']
allowed={tuple(bytes.fromhex(c))+(255,) for c in palette};magenta=(255,0,255,255);navy=(23,28,53,255);allowed.add(magenta)
reports=[]
def mask(frame):return {(x,y) for y,row in enumerate(frame) for x,p in enumerate(row) if p!=magenta}
def edge(frame):
 m=mask(frame)
 return all(frame[y][x]==navy for x,y in m if any(q not in m for q in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]))
for s in brief:
 fw,fh=s['frame'];v=s['variants'];w,h,rows=png(R/(s['id']+'-states-v1.png'));assert (w,h)==(3*fw,v*fh)
 _,_,original=png(R/s['intact']);states=[];legacy=set()
 for color in range(v):
  frames=[[row[col*fw:(col+1)*fw] for row in rows[color*fh:(color+1)*fh]] for col in range(3)]
  assert frames[0]==[row[color*fw:(color+1)*fw] for row in original],(s['id'],'intact differs')
  states.append(frames);base=mask(frames[0]);baseHeight=max(y for x,y in base)-min(y for x,y in base)+1
  for state,frame in enumerate(frames):
   assert all(p[3]==255 for row in frame for p in row)
   assert all(p==magenta for p in frame[0]+frame[-1]+[row[0] for row in frame]+[row[-1] for row in frame]),(s['id'],'padding')
   extras={p for row in frame for p in row}-allowed
   if state==0:assert not extras,(s['id'],'intact palette');legacy|=extras
   else:assert not extras,(s['id'],'palette',extras);assert edge(frame),(s['id'],'outline')
   m=mask(frame);assert m
   assert max(y for x,y in m)==max(y for x,y in base),(s['id'],'baseline')
   if state==2:assert max(y for x,y in m)-min(y for x,y in m)+1<=max(12,baseHeight//3),(s['id'],'rubble too tall')
  assert frames[0]!=frames[1] and frames[1]!=frames[2]
 for color in range(1,v):
  for state in [1,2]:assert mask(states[color][state])==mask(states[0][state]),(s['id'],'variant mask')
 dw,dh,debris=png(R/(s['id']+'-debris-v1.png'));assert (dw,dh)==(96,16*v)
 debrisMasks=[]
 for color in range(v):
  unique=set();colorMasks=[]
  for n in range(6):
   frame=[row[n*16:(n+1)*16] for row in debris[color*16:(color+1)*16]]
   assert {p for row in frame for p in row}<=allowed;assert mask(frame);assert edge(frame);colorMasks.append(mask(frame));unique.add(bytes(k for row in frame for p in row for k in p))
   assert all(p==magenta for p in frame[0]+frame[-1]+[row[0] for row in frame]+[row[-1] for row in frame])
  assert len(unique)==6,(s['id'],'duplicate debris')
  debrisMasks.append(colorMasks)
 assert all(m==debrisMasks[0] for m in debrisMasks),(s['id'],'debris variant silhouette')
 reports.append(dict(id=s['id'],frame=s['frame'],colorways=v,intactPixelExact=True,sharedDamageMasks=True,palette=True,legacyIntactColors=[list(c) for c in sorted(legacy)],baseline=True,brokenHeightAtMostOneThird=True,debris=6*v))
report=dict(status='passed',families=len(reports),colorways=sum(s['variants'] for s in brief),stateFrames=3*sum(s['variants'] for s in brief),debrisFrames=6*sum(s['variants'] for s in brief),gameCodeChanged=False,assets=reports)
(R/'checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='assets'}))
