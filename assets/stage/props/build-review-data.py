"""Optional file-safe gallery and manifest authoring, never run by the game."""
from pathlib import Path
import json,base64,hashlib,struct
R=Path(__file__).resolve().parent
specs=json.loads((R/'batch-2a.json').read_text())
kit=json.loads((R.parent/'campus-kit-plan.json').read_text())
captions={c['propId']:c['fullLine'] for c in kit['captions']}
extra={
'desk_sticky_notes':'There is a monitor under there. According to the last status meeting.',
'desk_family_photo':'The family photo is the only meeting worth being on time for.',
'desk_2009':'The desk calendar says 2009. The software budget agrees.',
'car_compact':'Rebrand? Park it here. We will circle back next quarter.',
'wheel_boot':"Dave's idea is going nowhere. Facilities made it official.",
'gate_keycard':'Authorized personnel. The door is wider than the approval process.',
'gate_hidden_cabinet':'FILES. A lavender binder is sticking out. That seems worth a look.',
'sign_plate':'Rebrand? Another great idea, safely parked.'}
assets=[]
for s in specs:
 file=R/s['file']
 if not file.exists():continue
 data=file.read_bytes();w,h=s['frame'];foot=s['footprint'];a={k:v for k,v in s.items() if k!='prompt'}
 a.update(size=list(struct.unpack('>II',data[16:24])),frameCount=s['variants'],framePurpose='colorways-not-animation',padding=2,anchor=dict(x=w/2,y=h-3),caption=captions.get(s['id'],extra.get(s['id'],s['name'])),status='ready-for-stage-2a-review',sha256=hashlib.sha256(data).hexdigest(),shadow='code-contact-only' if s['solid'] else 'none',notes=('Wall art, non-solid. Full caption supplies the longer joke.' if not s['solid'] else 'Floor footprint is an art proposal for later integration, shared by every colorway.'))
 if s['id']=='gate_keycard':a['notes']='Modular side jamb. Place entirely outside the 224px clear opening. No runtime gate behavior supplied.'
 if s['id']=='gate_hidden_cabinet':a['notes']='FILES is the short clue. Repeat as a cabinet facade; retract every door leaf fully outside the 224px opening.'
 assets.append(a)
manifest=dict(batch='stage-2a-props-posters',status='first-batch-ready-for-review',families=len(assets),colorways=sum(a['variants'] for a in assets),plannedFamilies=72,remainingFamilies=72-len(assets),palette=['#'+c for c in ['171c35','303750','526078','3e7775','83a89a','a88b70','d3b78d','f2d7a1','fff0cf','874c3b','c45c4b','ef9347','e5a995','f1b5bf','bfa8cf','b97a58','70402f']],background='#FF00FF',assets=assets,productionIntegrated=False,runtimeOwner='Claude: flow-field navigation and locked-area spawn filtering',generation='built-in-imagegen',export='nearest-neighbor native sampling, palette normalization, one-pixel navy silhouette, controlled palette colorways',review='review.html')
(R/'manifest-2a.json').write_text(json.dumps(manifest,indent=2)+'\n')
embedded=json.loads(json.dumps(manifest))
for a in embedded['assets']:a['src']='data:image/png;base64,'+base64.b64encode((R/a['file']).read_bytes()).decode()
embedded['floors']={id:'data:image/png;base64,'+base64.b64encode((R.parent.parent/'office-environment'/(id+'-native.png')).read_bytes()).decode() for id in ['carpet','wood']}
(R/'review-data.js').write_text('window.STAGE_PROPS = '+json.dumps(embedded,separators=(',',':'))+';\n')
plan=json.loads((R.parent/'campus-layout-v2.json').read_text());gates=[]
for c in plan['connections']+plan['wrapConnections']:
 if not(c.get('gate') or c.get('gates')):continue
 gates.append(dict(id=c['id'],clearWidth=224,jambsOutsideOpening=True,closedBlockers=[c['gate']] if c.get('gate') else c['gates'],openingAxis='x' if (c.get('gate') or c['gates'][0])['width']==224 else 'y',hidden=bool(c.get('achievement'))))
contract=dict(status='art-assembly-contract-no-runtime-code',clearWidth=224,openingLocal=dict(min=-112,max=112),jambLocal=[dict(x=-136,width=24),dict(x=112,width=24)],openState='all moving leaves retract outside [-112,112]; no collision inside the clear span',archive='ordinary FILES cabinet and one lavender binder clue; no glowing marker or giant key icon',navigationOwner='Claude',gates=gates)
(R/'gate-clearance.json').write_text(json.dumps(contract,indent=2)+'\n')
print(f"Authored {len(assets)} families, {manifest['colorways']} colorways; game files untouched.")
