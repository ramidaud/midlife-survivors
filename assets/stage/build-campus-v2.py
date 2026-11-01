"""Author proposal data and diagram. Never imported by the game."""
from pathlib import Path
import json,html
R=Path(__file__).resolve().parent
old=json.loads((R/'campus-layout-concept.json').read_text());old_by={d['id']:d for d in old['districts']}
# Orthogonal floor outlines. The structural gaps are walls/void, not bypass roads.
rows=[
('lobby',40,[[2400,1600],[4000,1600],[4000,1856],[4480,1856],[4480,2816],[3616,2816],[3616,3168],[2400,3168]],[3168,2448],'#d3b78d','L-shaped reception and queue hall'),
('bullpen',40,[[4480,1408],[6528,1408],[6528,1600],[7360,1600],[7360,2976],[6016,2976],[6016,3280],[4672,3280],[4672,2976],[4480,2976]],[5792,2336],'#3e7775','Large open floor with offset desk neighborhoods'),
('parking',45,[[128,192],[2240,192],[2240,896],[1920,896],[1920,1856],[128,1856]],[1152,1024],'#526078','Asymmetric indoor lot; approved close-up density'),
('breakroom',45,[[384,2304],[2016,2304],[2016,3456],[2688,3456],[2688,4096],[384,4096]],[1248,3072],'#a88b70','Long kitchen hall with a lower social annex'),
('server',50,[[2656,192],[4960,192],[4960,672],[4384,672],[4384,1152],[2656,1152]],[3504,656],'#303750','Long dogleg service hall, rack islands and cable bays'),
('conference',50,[[6240,3376],[7520,3376],[7520,4160],[5376,4160],[5376,3568],[6240,3568]],[6656,3824],'#3e7775','Offset glass pods and two separate fighting spaces'),
('executive',55,[[5408,192],[7520,192],[7520,1216],[6752,1216],[6752,1312],[5408,1312]],[6384,768],'#874c3b','Oversized corner suite with a narrow gallery return'),
('wellness',60,[[3040,3440],[4960,3440],[4960,4096],[4480,4096],[4480,4256],[3040,4256]],[3888,3824],'#83a89a','Curved mat island and stepped nap-pod annex'),
('archive',None,[[1824,1904],[2272,1904],[2272,2240],[1984,2240],[1984,2176],[1824,2176]],[2096,2048],'#526078','Cramped hidden L-shaped closet, not a full district square')]
districts=[]
for id,age,poly,center,color,shape in rows:
 d=old_by[id];districts.append(dict(id=id,name=d['name'],minAge=age,achievement='firstCoffee' if id=='archive' else None,polygon=poly,center=center,color=color,shape=shape,landmark=d['landmark'],description=d['description'],jokes=d['jokes'],floorTile=id+'_64',assembly='modular-data',solidBoundary=True))

def rect(x,y,w,h):return dict(type='rect',x=x,y=y,width=w,height=h)
reserves=[
 dict(id='lobby-queue',district='lobby',shape=dict(type='polygon',points=[[2720,2112],[3584,2112],[3584,2528],[3328,2528],[3328,2944],[2720,2944]]),decor=['reception queue tape','abstract company rug','PLEASE WAIT floor arrows']),
 dict(id='bullpen-runway',district='bullpen',shape=rect(4864,1760,1024,576),decor=['project runway tape','paper trail','coffee-ring floor clusters']),
 dict(id='bullpen-lunch',district='bullpen',shape=rect(6240,2176,832,576),decor=['chair-mat wear','crumb trail','CIRCLE BACK floor decal']),
 dict(id='parking-cross',district='parking',shape=rect(480,736,1024,576),decor=['parking paint','PENDING floor decal','scattered idea notes']),
 dict(id='break-cafe',district='breakroom',shape=rect(608,2656,1024,512),decor=['crooked communal rug','coffee spills','queue tape']),
 dict(id='break-annex',district='breakroom',shape=rect(1856,3616,640,320),decor=['birthday confetti','pizza-box floor outline']),
 dict(id='server-aisle',district='server',shape=rect(3040,448,928,288),decor=['cable route paint','OFFLINE tape']),
 dict(id='server-return',district='server',shape=rect(3040,864,832,224),decor=['maintenance arrows','dropped forms']),
 dict(id='conference-main',district='conference',shape=rect(6416,3520,736,384),decor=['meeting-overrun floor clock','chair scuffs']),
 dict(id='conference-overflow',district='conference',shape=rect(5536,3712,640,320),decor=['sticky-note spill','ALIGNMENT tape']),
 dict(id='executive-rug',district='executive',shape=rect(5728,544,1280,512),decor=['oversized company rug','putting-green edge paint']),
 dict(id='wellness-oval',district='wellness',shape=dict(type='ellipse',cx=3856,cy=3776,rx=608,ry=224),decor=['MANDATORY FUN mat print','footprint decals','sad confetti']),
 dict(id='archive-nook',district='archive',shape=rect(2016,1968,160,208),decor=['binder labels on floor','dust footprint trail'])]
# Broad internal loops are reserved before solid prop placement, not beige roads.
loops={
 'lobby':[[[2624,1792],[3744,1792],[3744,2112],[4208,2112],[4208,2592],[3392,2592],[3392,2944],[2624,2944],[2624,1792]]],
 'bullpen':[[[4736,1664],[6272,1664],[6272,1856],[7104,1856],[7104,2720],[5760,2720],[5760,3024],[4928,3024],[4928,2720],[4736,2720],[4736,1664]]],
 'parking':[[[352,416],[2016,416],[2016,672],[1696,672],[1696,1632],[352,1632],[352,416]]],
 'breakroom':[[[608,2528],[1792,2528],[1792,3680],[2464,3680],[2464,3872],[608,3872],[608,2528]]],
 'server':[[[2880,416],[4736,416],[4736,448],[4160,448],[4160,928],[2880,928],[2880,416]]],
 'conference':[[[6464,3600],[7296,3600],[7296,3936],[5600,3936],[5600,3792],[6464,3792],[6464,3600]]],
 'executive':[[[5632,416],[7296,416],[7296,992],[6528,992],[6528,1088],[5632,1088],[5632,416]]],
 'wellness':[[[3264,3664],[4736,3664],[4736,3872],[4256,3872],[4256,4032],[3264,4032],[3264,3664]]],
 'archive':[[[2016,2032],[2160,2032],[2160,2144]]]
}
connections=[]
def link(id,a,b,points,age,gate=None,label='AUTHORIZED PERSONNEL',decor=None):
 connections.append(dict(id=id,fromDistrict=a,toDistrict=b,points=points,width=224,minAge=age,gate=gate,label=label,decorBays=decor or []))
link('new-hire-upper','lobby','bullpen',[[4224,2112],[4736,2112]],40)
link('new-hire-lower','lobby','bullpen',[[4224,2624],[4736,2624]],40)
link('parking-access','lobby','parking',[[2592,1728],[1760,1728]],45,rect(2144,1616,128,224),decor=['vending alcove','lost-and-found bin'])
link('break-access','lobby','breakroom',[[2560,2928],[1856,2928]],45,rect(2144,2816,128,224),decor=['sad birthday banner','dropped party plate'])
link('west-return','parking','breakroom',[[1024,1728],[1024,2432]],45,rect(912,2072,224,128),label='STAFF ACCESS',decor=['vending alcove'])
link('server-access','lobby','server',[[3264,1728],[3264,1056]],50,rect(3152,1312,224,128),decor=['Take It Offline sign','unplugged lamp bay'])
link('server-return','parking','server',[[2080,544],[2752,544]],50,rect(2384,432,128,224),label='STAFF ACCESS')
link('meeting-access','bullpen','conference',[[6528,2848],[6528,3504]],50,rect(6416,3136,224,128),label='PLEASE SEE HR',decor=['HARD STOP sign','nine-hour meeting clock'])
link('executive-access','bullpen','executive',[[5824,1536],[5824,1184]],55,rect(5712,1296,224,128),label='EXECUTIVES ONLY',decor=['thought-leadership portrait'])
link('executive-return','server','executive',[[4832,416],[5536,416]],55,rect(5120,304,128,224),label='EXECUTIVES ONLY')
link('wellness-access','lobby','wellness',[[3456,3040],[3456,3568]],60,rect(3344,3248,224,128),label='PLEASE SEE HR',decor=['Mandatory Fun banner'])
link('wellness-west','breakroom','wellness',[[2560,3744],[3168,3744]],60,rect(2800,3632,128,224),label='PLEASE SEE HR')
link('wellness-east','conference','wellness',[[5504,3792],[4832,3792]],60,rect(5104,3680,128,224),label='PLEASE SEE HR')
link('hidden-binder','lobby','archive',[[2528,2080],[2144,2080]],None,rect(2304,1968,64,224),label='FILES')
connections[-1]['achievement']='firstCoffee'
# Wrapping routes have a gate at BOTH seam ends; no locked-area bypass.
wraps=[dict(id='wrap-horizontal',fromDistrict='parking',toDistrict='executive',minAge=55,axis='x',width=224,segments=[[[0,512],[256,512]],[[7392,512],[7680,512]]],gates=[rect(32,400,64,224),rect(7584,400,64,224)],label='STAFF ACCESS'),dict(id='wrap-vertical',fromDistrict='server',toDistrict='wellness',minAge=60,axis='y',width=224,segments=[[[3840,0],[3840,320]],[[3840,3968],[3840,4320]]],gates=[rect(3728,64,224,64),rect(3728,4192,224,64)],label='PLEASE SEE HR')]
# Gate bodies are thin rectangles across a full 224px connector. Jambs belong outside it.
for gate in connections+wraps:
 if gate.get('gate') or gate.get('gates'):
  gate['clearWidth']=224
  gate['jambPlacement']='outside-clear-opening'
  gate['openStateCollision']='no-door-panel-collision-in-clear-opening'
  if gate.get('achievement'):
   gate['entranceReadability']='subtle FILES label, protruding lavender binder, no glow or giant key icon'
phases=[dict(age=40,areas=['lobby','bullpen'],message='New hire access: Lobby and Bullpen.'),dict(age=45,areas=['breakroom','parking'],message="You've earned a break. Break Room and Parking Lot access granted."),dict(age=50,areas=['server','conference'],message="Now you're in the meetings. Server Room and Conference Rooms unlocked."),dict(age=55,areas=['executive'],message='Promotion approved. Executive Wing access granted.'),dict(age=60,areas=['wellness'],message='HR says you should relax. Wellness Corner unlocked.')]
schedule=dict(status='proposal-not-loaded-by-game',phases=phases,hidden=dict(area='archive',achievement='firstCoffee',achievementName='Per My Last Email',rationale='Existing achievement, pay off 50 Bills in one run. Proposed binding, tunable.',message='A filing cabinet clicks open. You found the Supply Closet.'),doorAnimation=dict(frames=4,durationMs=320,releaseCollision='after-final-opening-frame',messageChannel='existing-lower-third',messageOnce='per-promotion-per-run'),spawnPolicy=dict(mode='reachable-floor-only',closedGatesBlock=True,requireUnlockedDistrict=True,requireReachableFromPlayer=True,wrapCannotBypass=True),captionPolicy=dict(channel='existing-lower-third-tip-bar',radiusPx=128,once='per-caption-per-run',smallSignWords=[1,3],smallSignMinWidth=64))
(R/'campus-promotions.json').write_text(json.dumps(schedule,indent=2)+'\n')
kit_groups={
'furniture':'desk_tidy desk_paperwork desk_lunch desk_sticky_notes desk_family_photo desk_2009 chair_task chair_exec table_round table_conference reception_counter sofa bench file_cabinet binder_shelf server_rack printer water_cooler kitchen_counter vending_machine',
'slang':'roundabout gauge fruit_tree kiddie_pool baseball_base ocean_pot duck_row manager_cats goal_dollies cardboard_thinker memo_flagpole hard_stop firehose pie_chart kpi_frame last_email_monitor offline_lamp',
'ambient':'desk_sleeper nap_pod yoga_mat cot coat_rack umbrella_bin lost_found birthday_banner trash_recycle coffee_cart plant_sad',
'parking':'car_compact car_sedan car_convertible wheel_boot parking_kiosk bollard',
'gates':'gate_keycard gate_double gate_hidden_cabinet gate_turnstile',
'landmarks':'giant_logo goals_board',
'posters':'hang_cat_high hang_cat_low hang_cat_claw hang_branch teamwork synergy opportunity perseverance success think_big team',
'signs':'sign_plate'}
kit=[dict(id=id,category=category,variants=3 if category in ['furniture','parking','ambient'] else 2,status='planned-not-generated') for category,ids in kit_groups.items() for id in ids.split()]
assert len(kit)==72
# Delivered art is indexed here; this does not wire it into the production game.
batch_path=R/'props/manifest-2a.json'
if batch_path.exists():
 batch=json.loads(batch_path.read_text())
 delivered={a['id']:a for a in batch['assets']}
 for prop in kit:
  if prop['id'] in delivered:
   art=delivered[prop['id']];prop.update(status='ready-for-stage-2a-review',manifest='props/manifest-2a.json',file='props/'+art['file'])
production=dict(propFamilies=kit,floorTiles=dict(size=[64,64],districtFamilies=9,seamless=True),modularBoundaries=['wall_straight','wall_corner','wall_end','cubicle_straight','cubicle_corner','glass_segment'],maxVisibleProps=120,cullOffscreen=True,enemyStressTarget=350,propReview=dict(heroFrame=[56,60],enemyReference='enemy-bill-v1.png',displayScale=1,desktop=[1280,800],phone=[390,844]),paintedMapIsRuntime=False,captionPolicy=schedule['captionPolicy'])
# Full lines are data, not tiny lettering baked into sprite art.
caption_lines={
 'hang_cat_high':('HANG IN THERE','Hang in there. The cat still has two paws on the branch.'),
 'hang_cat_low':('HANG IN THERE','Hang in there. The branch has been restructured.'),
 'hang_cat_claw':('HANG IN THERE','Hang in there. One claw counts as full engagement.'),
 'hang_branch':('HANG IN THERE','Hang in there. The cat has taken PTO.'),
 'teamwork':('TEAMWORK','TEAMWORK: Because none of us is as dumb as all of us.'),
 'synergy':('SYNERGY','SYNERGY: Two staplers fighting over the same memo.'),
 'opportunity':('OPPORTUNITY','OPPORTUNITY: Please use the door that has been bricked up.'),
 'perseverance':('PERSEVERANCE','PERSEVERANCE: The printer has been jammed since Tuesday.'),
 'success':('SUCCESS','SUCCESS. The SS is crossed out. Underneath: PTO denied.'),
 'think_big':('THINK BIG','THINK BIG. Printed as small as the budget allows.'),
 'team':('TEAM','There is no I in TEAM, but there is in quiet quitting.'),
 'kpi_frame':('KPIs','What the hell is a KPI again?'),
 'last_email_monitor':('LAST EMAIL','Per my last email. And the one before that.'),
 'birthday_banner':('ANOTHER YEAR','Another year somehow. The cake is in a meeting.'),
 'reception_counter':('PLEASE WAIT','Please wait to be ignored.')}
production['captions']=[dict(id='caption-'+id,propId=id,shortLabel=short,signMinWidth=64,fullLine=line,radiusPx=128,once='per-run') for id,(short,line) in caption_lines.items()]
production['placementsStatus']='Stage 2 will add per-instance positions, prop IDs, variants and floor footprints after native-size review.'
(R/'campus-kit-plan.json').write_text(json.dumps(production,indent=2)+'\n')
plan=dict(id='corporate-campus-v2',revision=2,status='v2-approved-stage-2-in-progress',world=dict(width=7680,height=4320,wrapX=True,wrapY=True),start=dict(district='lobby',point=[3168,2448],openDistricts=['lobby','bullpen']),camera=dict(x=512,y=640,width=1280,height=800,district='parking'),mainRouteWidth=224,branchRouteWidth=160,districts=districts,connections=connections,wrapConnections=wraps,internalRoutes=[dict(district=k,width=160 if k=='archive' else 224,points=line) for k,lines in loops.items() for line in lines],combatSpaces=reserves,solidProps=[],decorPolicy='Non-solid rugs, tape, paper and spills dress every reserve; never bare identical beige squares.',schedule=schedule,production=production,notes=['Parking Lot close-up v1 approved unchanged as density/style/scale target.','Rami approved v2. Every gate has a 224px clear opening. Claude owns runtime flow-field navigation and locked-area spawn filtering.','Production uses modular tiles/walls/props assembled from positions and IDs, never this painted overview.'])
(R/'campus-layout-v2.json').write_text(json.dumps(plan,indent=2)+'\n')
(R/'campus-plan-v2-data.js').write_text('window.CAMPUS_V2 = '+json.dumps(plan,separators=(',',':'))+';\n')
# Draw exact authored floor geometry as an SVG reference and accessible review plan.
e=html.escape
parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7680 4320" role="img" aria-labelledby="title desc">','<title id="title">Corporate Campus v2: irregular wings and promotion gates</title>','<desc id="desc">Lobby and the large Bullpen start open. Age gates unlock side wings. The hidden Archive uses an achievement. Floor shapes and fighting spaces differ in size and shape.</desc>','<style>text{font-family:monospace;fill:#fff0cf;paint-order:stroke;stroke:#171c35;stroke-width:6}.district{transition:opacity .15s}.gate text{stroke-width:8}.space{stroke:#83a89a;stroke-width:10;fill:#83a89a;fill-opacity:.12}.route{fill:none;stroke:#fff0cf;stroke-opacity:.16;stroke-linejoin:round;stroke-linecap:square}.start-outline{fill:none;stroke:#ef9347;stroke-width:22;stroke-dasharray:48 20}.gridline{stroke:#526078;stroke-width:2;opacity:.16}</style>','<rect width="7680" height="4320" fill="#171c35"/>']
def path(points):return 'M'+'L'.join(f'{x} {y}' for x,y in points)
def box(r,attrs=''):return f'<rect x="{r["x"]}" y="{r["y"]}" width="{r["width"]}" height="{r["height"]}" {attrs}/>'
for c in connections:
 parts.append(f'<path d="{path(c["points"])}" fill="none" stroke="#526078" stroke-width="{c["width"]+48}"/>')
 parts.append(f'<path d="{path(c["points"])}" fill="none" stroke="#a88b70" stroke-width="{c["width"]}"/>')
for w in wraps:
 for line in w['segments']:parts.append(f'<path d="{path(line)}" fill="none" stroke="#a88b70" stroke-width="224"/>')
for d in districts:
 id=d['id'];points=d['polygon'];parts.append(f'<g class="district" data-district="{id}"><path d="{path(points)}Z" fill="{d["color"]}" stroke="#526078" stroke-width="24"/>')
 if id in ['lobby','bullpen']:parts.append(f'<path class="start-outline" d="{path(points)}Z"/>')
 for r in plan['internalRoutes']:
  if r['district']==id:parts.append(f'<path class="route" d="{path(r["points"])}" stroke-width="{r["width"]}"/>')
 for reserve in reserves:
  if reserve['district']!=id:continue
  sh=reserve['shape']
  if sh['type']=='rect':parts.append(box(sh,'class="space"'))
  elif sh['type']=='ellipse':parts.append(f'<ellipse cx="{sh["cx"]}" cy="{sh["cy"]}" rx="{sh["rx"]}" ry="{sh["ry"]}" class="space"/>')
  else:parts.append(f'<path d="{path(sh["points"])}Z" class="space"/>')
  # Non-solid floor dressing is deliberately visible in the reserved space.
  if sh['type']=='rect':
   x,y=sh['x']+32,sh['y']+32;parts.append(f'<path d="M{x} {y}h96m32 0h64M{x} {y+64}h48" stroke="#f2d7a1" stroke-width="8" opacity=".45"/>')
 cx,cy=d['center'];label={'archive':'HIDDEN ARCHIVE','conference':'CONFERENCE','executive':'EXECUTIVE WING','breakroom':'BREAK ROOM','wellness':'WELLNESS','parking':'PARKING LOT','lobby':'LOBBY / START','bullpen':'BIG OPEN BULLPEN','server':'SERVER ROOM'}[id]
 font=40 if id=='archive' else 68
 parts.append(f'<text x="{cx}" y="{cy}" text-anchor="middle" font-size="{font}" font-weight="bold">{label}</text><text x="{cx}" y="{cy+74}" text-anchor="middle" font-size="{max(32,font-16)}">'+('ACHIEVEMENT' if d['minAge'] is None else ('OPEN AT 40' if d['minAge']==40 else f'AGE {d["minAge"]}'))+'</text></g>')
for c in connections:
 if not c['gate']:continue
 r=c['gate'];age=c['minAge'];label='KEY' if age is None else str(age)
 parts.append(f'<g class="gate" data-gate="{c["id"]}">'+box(r,'fill="#c45c4b" stroke="#171c35" stroke-width="10"')+f'<text x="{r["x"]+r["width"]/2}" y="{r["y"]+r["height"]/2+20}" text-anchor="middle" font-size="60">{label}</text></g>')
for w in wraps:
 for i,r in enumerate(w['gates']):parts.append(f'<g class="gate" data-wrap="{w["id"]}">'+box(r,'fill="#c45c4b" stroke="#171c35" stroke-width="8"')+f'<text x="{r["x"]+r["width"]/2}" y="{r["y"]+r["height"]/2+16}" text-anchor="middle" font-size="44">{w["minAge"]}</text></g>')
parts.extend(['<circle cx="3168" cy="2448" r="32" fill="#ef9347"/>','<text x="120" y="4280" font-size="52">V2: IRREGULAR MODULAR WINGS • ORANGE = START AREA • RED BARS = PROMOTION GATES</text>','</svg>'])
(R/'campus-plan-v2.svg').write_text('\n'.join(parts)+'\n')
print('V2 authored: 9 unequal floor outlines, 13 dressed fighting spaces, 72 planned prop families.')
