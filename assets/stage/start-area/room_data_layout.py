"""Assemble Rami's approved Courtyard Loop in existing campus coordinates."""
import json

def apply_layout(layout, root):
    plan=json.loads((root.parent/'layout-plan/plan-geometry.json').read_text())
    option=plan['options']['B']
    start={'lobby','bullpen'}
    floors=[r for r in layout['floors'] if r.get('district') in start]
    def in_start(x,y):
        return any(r['x']<=x<r['x']+r['width'] and r['y']<=y<r['y']+r['height'] for r in floors)
    for key in ('placements','workers','floorDecor','labels'):
        layout[key]=[r for r in layout[key] if not in_start(r['x'],r['y']) or r.get('prop')=='gate_hidden_cabinet']
    layout['internalRoutes']=[r for r in layout['internalRoutes'] if r['district'] not in start]
    layout['clearSpaces']=[r for r in layout['clearSpaces'] if r['district'] not in start]
    office=layout['officeLoop']={'pods':[],'workstations':[],'partitions':[],'scenes':[],'bands':[]}
    ox,oy=layout['origin']
    for i,(x,y,w,h) in enumerate(option['clearanceRectangles']):
        layout['protectedRoutes'].append(dict(id=f'courtyard-aisle-{i}',x=x,y=y,width=w,height=h))
        # The age-45 thresholds keep their wood floors and existing gate art.
        if x>=-768:
            for left,right in ((max(x,-768),min(x+w,1312)),(max(x,1312),x+w)):
                if right>left:office['bands'].append([left,y,right-left,h])
    # A second cross-aisle passes the north side of the glass office.
    layout['protectedRoutes'].append(dict(id='courtyard-glass-rear',x=1744,y=320,width=896,height=224))
    for name,x,y,w,h in option['arenas']:
        layout['clearSpaces'].append(dict(id=name.lower().replace(' ','-'),
            district='lobby' if x<1312 else 'bullpen',shape=dict(type='rect',x=x+ox,y=y+oy,width=w,height=h)))
    layout['tour'].update({'Commons':[2672,-218],'South apron':[2640,560],
        'Lobby arrival':[0,-296],'Seated desks':[1664,-424],'Goals':[3904,-480],'Bullpen':[2672,-218]})
    def prop(kind,x,y,variant=0,**kwargs):
        layout['placements'].append(dict(id=f'loop-{kind}-{len(layout["placements"])}',prop=kind,x=x,y=y,variant=variant,**kwargs))
    def label(id,text,x,y,width=128,**extra):
        layout['labels'].append(dict(id='loop-'+id,text=text,x=x,y=y,width=width,**extra))
    def decor(kind,x,y,w,h,**kwargs):
        layout['floorDecor'].append(dict(kind=kind,x=x,y=y,width=w,height=h,**kwargs))
    lights=layout['lights']=[]
    def light(kind,x,y,r,color):
        lights.append(dict(x=x,y=y,r=r,color=color,kind=kind))
    lamp=0xffd9a0
    cool=0x9fd8ff
    cast=['mute','salad','dozer','intern','retiring','email']
    accents={'Accounting':['adding','binders','calendar','photo'],
             'HR':['candy','plant','flyers','mugs'],
             'IT':['duck','cables','tower','tools','stickers'],
             'Marketing':['board','neon','box','tape','beanbag']}
    colors={'Accounting':0xa88b70,'HR':0x668674,'IT':0x3e7775,'Marketing':0x756482}
    def desk(id,x,y,kind,accent,color,seat_y=None,w=84,h=56):
        d=dict(id=id,x=x,y=y,w=w,h=h,kind=kind,accent=accent,color=color)
        office['workstations'].append(d)
        if seat_y is not None:
            i=len(layout['workers'])
            layout['workers'].append(dict(id='seat-'+id,host=id,x=x+w//2,y=seat_y,depthY=y+h-1,
                variant=i%3,cropHeight=56,cast=cast[i%6],colorway=(i//6)%2,phase=i*197%1120,seated=True))
        if accent not in ('box','beanbag','board'):light('screen',x+w//2,y+12,66,cool)
        if accent in ('adding','candy','duck','board','reception','photo'):light('lamp',x+18,y+18,96,lamp)
    for name,x,y,w,h,types in option['pods']:
        office['pods'].append(dict(name=name,x=x,y=y,w=w,h=h,color=colors[name]))
        decor('team-rug',x,y,w,h,color=colors[name])
        office['partitions'].append(dict(id='partition-'+name,x=x+16,y=y+h//2-8,w=w-32,h=16,color=colors[name]))
        # Short returns make each shared spine a bay and leave desk entrances open.
        for side,rx in [('west',x+16),('east',x+w-28)]:
            office['partitions'].append(dict(id=f'partition-{name}-{side}',x=rx,y=y+h//2-54,w=12,h=46,color=colors[name]))
        label(name.lower(),name.upper(),x+w//2,y+42,104)
        for i,kind in enumerate(types.split()):
            north=i<3
            dx=x+30+(i if north else i-3)*140
            dy=y+64 if north else y+h-94
            # Seats share the table-depth cluster while their feet land at the chair base.
            seat_y=dy+16 if kind in ('C','L') else None
            desk(name.lower()+str(i),dx,dy,kind,accents[name][i],colors[name],seat_y)
    x,y,w,h=option['office']
    decor('team-rug',x,y,w,h,color=0x516d70)
    for name,dx,dy,dw,dh in [('north',0,0,w,16),('west',0,16,16,h-32),('east',w-16,16,16,h-32),('front-left',0,h-16,112,16),('front-right',w-112,h-16,112,16)]:
        office['partitions'].append(dict(id='glass-'+name,x=x+dx,y=y+dy,w=dw,h=dh,color=0x83a89a,glass=True))
    label('glass','MANAGER',x+w//2,y+60,112)
    desk('manager',x+160,y+114,'L','photo',0x3e7775,y+130,w=132,h=64)
    # Reception, lifts and waiting area follow the measured plan.
    _,x,y,w,h=option['lobby'][0]
    desk('reception',x,y+24,'R','reception',0x3e7775,y+40,w=w,h=72)
    prop('giant_logo',385,-590,solid=False,caption='OUR VALUES. They go around and around.')
    _,x,y,w,h=option['lobby'][1]
    decor('team-rug',x,y,w,h,color=0xa88b70)
    prop('sofa',x+74,y+102,0)
    prop('sofa',x+234,y+180,1)
    prop('table_round',x+86,y+205,0)
    _,x,y,w,h=option['lobby'][2]
    office['partitions'].append(dict(id='elevators',x=x,y=y+16,w=w,h=32,color=0x526078,lift=True))
    label('lifts','LIFTS',x+w//2,y+14,100)
    x,y,w,h=option['mat']
    decor('welcome-rug',x,y,w,h)
    label('welcome','WELCOME',x+w//2,y+h-12,96,plate=False,floor=True,alpha=.85)
    for i,(x,y) in enumerate([(-744,-550),(-744,352),(1228,-488),(1230,344)]):prop('plant',x,y,i%3)
    prop('water_cooler',990,-495,caption='Two paper cups. One very good catch-up.')
    prop('vending_machine',770,-753,caption='The pretzels are still deciding.')
    light('vending',770,-800,106,cool)
    prop('printer',2318,-934,caption='PC LOAD LETTER. The printer needs a minute.')
    for x,y,v in [(2338,-907,0),(2378,-887,1),(2416,-861,2)]:
        prop('paper_drift',x,y,v,solid=False,alpha=.48)
    prop('fruit_tree',3090,-352,caption='LOW HANGING FRUIT. One leaf left.')
    prop('kitchen_counter',3110,470,caption='One microwave. Eleven soups.')
    prop('roadmap_whiteboard',4100,-480,solid=False,caption='The parking lot for ideas is also full.')
    label('ideas','IDEA PARKING',4100,-494,88)
    label('q3','Q3',1880,-558,72)
    label('wellness-weds','WELLNESS WEDS',2038,-172,104)
    for x,y,w,h in [(-380,-748,192,96),(1760,-920,224,80),(2784,-958,256,88),(3650,-818,192,88)]:
        decor('window-shape',x,y,w,h)
        light('window',x+w//2,y+h//2,w//2,lamp)
    decor('team-rug',2320,-560,704,656,color=0x526b67)
    decor('team-rug',2448,352,400,416,color=0x556674)
    label('circle-back','CIRCLE BACK',2672,-168,116,plate=False,floor=True,alpha=.46)
    label('apron','MIND THE GAP',2640,586,116,plate=False,floor=True,alpha=.40)
    for dx,dy in [(2552,-302),(2850,-425),(2470,617),(2808,685)]:
        decor('office-scuffs',dx,dy,112,52)
    office['scenes']=[
        dict(id='cooler-mina',cast='mute',x=1054,y=-515,phase=0),
        dict(id='cooler-art',cast='salad',x=1096,y=-491,phase=480,flip=True),
        dict(id='printer-nora',cast='email',x=2412,y=-907,phase=260),
        dict(id='phone-eli',cast='intern',x=3636,y=428,phase=440,walk=[[3586,428],[3690,428]],speed=26),
        dict(id='mug-sam',cast='retiring',x=2672,y=224,phase=720,walk=option['walk'][:2],speed=32)
    ]
    # Include existing later-room sources for Claude's lighting pass.
    for p in layout['placements']:
        if p['id'].startswith('loop-'):continue
        kind={'vending_machine':'vending','server_rack':'server','crt_stack':'screen',
              'offline_lamp':'lamp','wellness_sad_lamp':'lamp','skyline_window':'window'}.get(p['prop'])
        if kind:light(kind,p['x'],p['y']-32,100,lamp if kind in ('lamp','window') else cool)
