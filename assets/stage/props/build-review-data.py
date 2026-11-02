"""Optional file-safe gallery and manifest authoring, never run by the game."""
from pathlib import Path
import json,base64,hashlib,struct,re
R=Path(__file__).resolve().parent
specs=[]
for brief in sorted(R.glob('batch-2[abcdef].json')):
 for s in json.loads(brief.read_text()):
  s['batch']=brief.stem.replace('batch-','');specs.append(s)
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
runtime_file=R.parents[2]/'src/data/stage-props.js'
registered=set()
if runtime_file.exists():
 family_source=runtime_file.read_text().split('captions:')[0]
 registered=set(re.findall(r'^    ([a-z0-9_]+):\s*\{',family_source,re.M))
assets=[]
for s in specs:
 file=R/s['file']
 if not file.exists():continue
 data=file.read_bytes();w,h=s['frame'];foot=s['footprint'];a={k:v for k,v in s.items() if k!='prompt'}
 a.update(size=list(struct.unpack('>II',data[16:24])),frameCount=s['variants'],framePurpose='colorways-not-animation',padding=2,anchor=dict(x=w/2,y=h-3),caption=s.get('caption',captions.get(s['id'],extra.get(s['id'],s['name']))),status='ready-for-stage-'+s['batch']+'-review',sha256=hashlib.sha256(data).hexdigest(),shadow='code-contact-only' if s['solid'] else 'none',notes=(('Floor decor, non-solid. Full caption supplies the joke.' if s.get('mount')=='floor' else 'Tabletop detail, non-solid. Place above its host table.' if s.get('mount')=='tabletop' else 'Wall art, non-solid. Full caption supplies the longer joke.') if not s['solid'] else 'Shared floor footprint for every colorway; actual authored placements live in start-area/layout.json.'))
 if s['id']=='gate_keycard':a['notes']='Modular side jamb. Place entirely outside the 224px clear opening. No runtime gate behavior supplied.'
 if s['id']=='gate_hidden_cabinet':a['notes']='FILES is the short clue. Repeat as a cabinet facade; retract every door leaf fully outside the 224px opening.'
 a['integrationStatus']='registered-in-current-office' if s['id'] in registered else 'not-registered'
 assets.append(a)
manifest=dict(batch='stage-2-props-posters',status='start-area-kit-complete',families=len(assets),colorways=sum(a['variants'] for a in assets),plannedFamilies=72,remainingFamilies=72-len(assets),palette=['#'+c for c in ['171c35','303750','526078','3e7775','83a89a','a88b70','d3b78d','f2d7a1','fff0cf','874c3b','c45c4b','ef9347','e5a995','f1b5bf','bfa8cf','b97a58','70402f']],background='#FF00FF',assets=assets,productionIntegrated=True,runtimeOwner='Claude: flow-field navigation and locked-area spawn filtering',generation='built-in-imagegen',export='nearest-neighbor native sampling, palette normalization, one-pixel navy silhouette, controlled palette colorways',review='review.html')
manifest['integration']={'registeredFamilies':[a['id'] for a in assets if a['id'] in registered],'unregisteredFamilies':[a['id'] for a in assets if a['id'] not in registered],'basis':'Current src/data/stage-props.js family registry, read only. Authored Lobby/Bullpen placements use this registry. Claude owns future gate opening and navigation changes.'}
(R/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
second={**manifest,'batch':'stage-2b-slang-landmarks','assets':[a for a in assets if a['batch']=='2b']}
second.update(families=len(second['assets']),colorways=sum(a['variants'] for a in second['assets']),totalReadyFamilies=len(assets),totalColorways=manifest['colorways'])
(R/'manifest-2b.json').write_text(json.dumps(second,indent=2)+'\n')
candidate={'status':'data-only-candidate-not-loaded-by-game','families':{},'captions':{},'place':[],'notes':['Matches the existing stage-props.js family/caption shape.','Choose placements later; join solid props to propGroup using these proposed floor footprints. Runtime navigation and spawn filtering belong to Claude.']}
for a in second['assets']:
 family={'file':a['file'],'frame':a['frame'],'frames':a['variants'],'solid':a['solid'],'mount':a.get('mount','floor')}
 if a['solid']:family['footprint']=a['footprint']
 candidate['families'][a['id']]=family;candidate['captions'][a['id']]=a['caption']
(R/'integration-2b.json').write_text(json.dumps(candidate,indent=2)+'\n')
third={**manifest,'batch':'stage-2c-start-area-props','assets':[a for a in assets if a['batch']=='2c']}
third.update(families=len(third['assets']),colorways=sum(a['variants'] for a in third['assets']))
(R/'manifest-2c.json').write_text(json.dumps(third,indent=2)+'\n')
fourth={**manifest,'batch':'stage-2d-age45-rooms','assets':[a for a in assets if a['batch']=='2d']}
fourth.update(families=len(fourth['assets']),colorways=sum(a['variants'] for a in fourth['assets']))
(R/'manifest-2d.json').write_text(json.dumps(fourth,indent=2)+'\n')
fifth={**manifest,'batch':'stage-2e-age50-rooms','assets':[a for a in assets if a['batch']=='2e']}
fifth.update(families=len(fifth['assets']),colorways=sum(a['variants'] for a in fifth['assets']))
(R/'manifest-2e.json').write_text(json.dumps(fifth,indent=2)+'\n')
sixth={**manifest,'batch':'stage-2f-executive','assets':[a for a in assets if a['batch']=='2f']}
sixth.update(families=len(sixth['assets']),colorways=sum(a['variants'] for a in sixth['assets']))
(R/'manifest-2f.json').write_text(json.dumps(sixth,indent=2)+'\n')
embedded=json.loads(json.dumps(manifest))
for a in embedded['assets']:a['src']='data:image/png;base64,'+base64.b64encode((R/a['file']).read_bytes()).decode()
# Two additional paints reuse the existing car family, so do not inflate kit counts.
car=next(a for a in assets if a['id']=='car_compact').copy()
car.update(id='car_compact_extra',name='Two extra campus car paints',file='car_compact-extra-v2.png',batch='2d',variants=2,frameCount=2,size=[288,112],notes='Existing car silhouette and footprint. Original three paints are preserved in the five-frame campus sheet.',src='data:image/png;base64,'+base64.b64encode((R/'car_compact-extra-v2.png').read_bytes()).decode())
embedded['assets'].append(car)
# Static coworker is reviewed separately, outside the planned 72 prop families.
worker=json.loads((R/'batch-placeholder.json').read_text())[0]
worker.update(batch='placeholder',padding=2,caption='Just resting my eyes while the big spreadsheet saves.',status='static-placeholder',frameCount=worker['variants'],framePurpose='colorways-not-animation',notes='Static upper body is cropped behind desks in the slice. Final coworker animation is deferred.',size=[worker['frame'][0]*worker['variants'],worker['frame'][1]])
worker.pop('prompt',None)
(R/'manifest-placeholder.json').write_text(json.dumps(dict(palette=manifest['palette'],assets=[worker]),indent=2)+'\n')
worker['src']='data:image/png;base64,'+base64.b64encode((R/worker['file']).read_bytes()).decode()
embedded['assets'].append(worker)
embedded['floors']={id:'data:image/png;base64,'+base64.b64encode((R.parent.parent/'office-environment'/(id+'-native.png')).read_bytes()).decode() for id in ['carpet','wood']}
(R/'review-data.js').write_text('window.STAGE_PROPS = '+json.dumps(embedded,separators=(',',':'))+';\n')
plan=json.loads((R.parent/'campus-layout-v2.json').read_text());gates=[]
for c in plan['connections']+plan['wrapConnections']:
 if not(c.get('gate') or c.get('gates')):continue
 gates.append(dict(id=c['id'],clearWidth=224,jambsOutsideOpening=True,closedBlockers=[c['gate']] if c.get('gate') else c['gates'],openingAxis='x' if (c.get('gate') or c['gates'][0])['width']==224 else 'y',hidden=bool(c.get('achievement'))))
contract=dict(status='art-assembly-contract-no-runtime-code',clearWidth=224,openingLocal=dict(min=-112,max=112),jambLocal=[dict(x=-136,width=24),dict(x=112,width=24)],openState='all moving leaves retract outside [-112,112]; no collision inside the clear span',archive='ordinary FILES cabinet and one lavender binder clue; no glowing marker or giant key icon',navigationOwner='Claude',gates=gates)
(R/'gate-clearance.json').write_text(json.dumps(contract,indent=2)+'\n')
print(f"Authored {len(assets)} families, {manifest['colorways']} colorways; game files untouched.")
