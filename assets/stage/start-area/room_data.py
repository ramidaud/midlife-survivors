"""Explicit Stage 2D props and floor stories. World coordinates, before origin subtraction."""
def place_rooms(put,placements,workers,specs,occupied):
 labels=[];decor=[]
 structures=[dict(id='north-curb-island',x=1288,y=200,width=192,height=64,kind='curb'),dict(id='south-curb-island',x=712,y=1752,width=192,height=64,kind='curb'),dict(id='east-curb-island',x=1984,y=800,width=192,height=64,kind='curb')]
 occupied.extend({k:r[k] for k in ['x','y','width','height']} for r in structures)
 def fixed(id,x,y,v=0,group='',**extra):
  p=put(id,x,y,v,group)
  assert (p['x'],p['y'])==(x,y),('Room fixture moved from measured slot',id,(x,y),(p['x'],p['y']))
  p.update(extra);p['district']='parking' if group.startswith('Parking') else 'breakroom';return p
 rows=[('north edge',256,[448+i*144 for i in range(12) if i not in [6,7]]),('north bank',640,[544+i*192 for i in range(6)]),('south bank',1488,[544+i*192 for i in range(6)]),('south edge',1808,[448,592,1312,1456,1600])]
 cars=[]
 for name,y,xs in rows:
  for x in xs:
   p=fixed('car_compact_campus',x,y,len(cars)%5,'Parking / '+name);cars.append(p)
   decor.append(dict(kind='parking-bay',x=x-72,y=max(192,y-72),width=144,height=y+24-max(192,y-72)))
 reserved=next(p for p in cars if p['x']==928 and p['y']==640)
 reserved['caption']="EMPLOYEE OF THE MONTH (2014). Still waiting for next month's announcement."
 labels.append(dict(id='reserved-2014',text='2014 MVP',x=928,y=686,width=112,plate=False,floor=True,alpha=.75))
 decor.append(dict(kind='reserved-bay',x=856,y=568,width=144,height=96))
 honda=next(p for p in cars if p['x']==1120 and p['y']==1488)
 honda['caption']='MY OTHER CAR IS ALSO A HONDA. A consistent approach to the midlife crisis.'
 labels.append(dict(id='honda-sticker',text='ALSO A HONDA',x=honda['x']-28,y=honda['y']-18,width=51,scale=1,plate=True,depthY=honda['y']+4))
 dave=next(p for p in cars if p['x']==1456 and p['y']==1808);dave['variant']=3
 dave['caption']="Dave's idea. Facilities has committed to keeping it in the parking lot."
 placements.append(dict(id='daves-wheel-boot',prop='wheel_boot',x=dave['x']+12,y=dave['y']+2,variant=0,solid=False,depthY=dave['y']+3,group='Parking / Dave',district='parking',parent=dave['id']))
 cars[1]['caption']='BLOCKCHAIN. Parked diagonally across two spaces in 2021. Nobody remembers who has the keys.'
 cars[-1]['caption']='BRING BACK CASUAL FRIDAYS. Parallel parked with care and waiting for a hero.'
 for x,y in [(184,864),(184,1216)]:fixed('cart_corral',x,y,0,'Parking / cart bays')
 for i,(x,y) in enumerate([(208,480),(1856,1056),(1856,1504),(2192,736)]):
  fixed('parking_light',x,y,i%3,'Parking / lighting');decor.append(dict(kind='light-pool',x=x-96,y=y-48,width=192,height=128))
 fixed('parking_whiteboard',1864,1344,0,'Parking / parked ideas')
 for i,r in enumerate(structures):
  placements.append(dict(id='curb-tree-'+str(i),prop='fruit_tree',x=r['x']+r['width']/2,y=r['y']+r['height']-12,variant=i%2,depthY=r['y']+r['height']+1,group='Parking / curb trees',district='parking',parent=r['id']))
 decor.extend([dict(kind='road-dashes',x=544,y=880,width=1024,height=16),dict(kind='road-dashes',x=544,y=1296,width=1024,height=16),dict(kind='lane-arrow',x=768,y=1008,width=128,height=80,direction='right'),dict(kind='lane-arrow',x=1216,y=1136,width=128,height=80,direction='left'),dict(kind='crosswalk',x=512,y=960,width=96,height=256),dict(kind='mess',x=176,y=240,width=1600,height=1500,count=55,seed=45),dict(kind='staff-tape',x=952,y=1888,width=144,height=384)])
 labels.extend([dict(id='one-way-question',text='ONE WAY?',x=1376,y=912,width=112,plate=False,floor=True,alpha=.5),dict(id='staff-return',text='STAFF ONLY',x=1024,y=2160,width=128,plate=False,floor=True,alpha=.45)])
 # The north wall faces down toward the camera. Appliances face into the room.
 fixed('kitchen_counter',800,2400,0,'Break / kitchenette')
 fixed('coffee_cart',1376,2400,0,'Break / coffee landmark')
 fixed('fridge_note',1856,2400,0,'Break / fridge')
 table1=fixed('table_round',896,2752,0,'Break / communal table')
 table2=fixed('table_round',1376,3344,1,'Break / birthday table')
 placements.append(dict(id='last-birthday-slice',prop='cake_slice',x=table2['x']-8,y=table2['y']-54,variant=0,solid=False,depthY=table2['y']+2,group='Break / birthday table',district='breakroom',parent=table2['id']))
 for i,p in enumerate([table1,table2]):workers.append(dict(id='break-worker-'+str(i),host=p['id'],x=p['x']-8,y=p['y']-68,variant=(i+1)%3,cropHeight=34,depthY=p['y']-1))
 for i,(x,y) in enumerate([(464,2720),(464,3120),(464,3696),(1968,2720),(2064,3520),(2352,3520)]):fixed('vending_machine',x,y,i%3,'Break / snack bays')
 for i,(x,y) in enumerate([(464,2928),(464,3376),(1968,3168),(2224,3520)]):fixed('water_cooler',x,y,i%3,'Break / cooler bays')
 for i,(x,y) in enumerate([(464,3520),(464,3952),(1968,3104),(2576,3504)]):fixed('trash_recycle',x,y,i%3,'Break / bins')
 fixed('lost_found',1968,3344,1,'Break / left behind')
 for x,y in [(464,2560),(464,3232),(1232,2400),(1968,2496),(2480,4032)]:fixed('plant',x,y,0,'Break / plants')
 fixed('sofa',944,3584,1,'Break / quiet seats');fixed('sofa',1248,3584,0,'Break / quiet seats')
 p=put('hang_cat_high',576,2288,0,'Break / north wall',wall=True);p['district']='breakroom'
 p=put('birthday_banner',1248,4080,1,'Break / party wall',wall=True);p['district']='breakroom'
 labels.extend([dict(id='food-policy',text='PLEASE LABEL\nYOUR FOOD',x=1856,y=2264,width=128,plate=True,depthY=2305,readAt=[1856,2464],caption="PLEASE LABEL YOUR FOOD. The fridge has started referring to us as a community."),dict(id='fish-warning',text='NO FISH',x=800,y=2264,width=80,plate=True,depthY=2305,readAt=[800,2464],caption='FISH SMELL WARNING. The microwave remembers what you did.')])
 decor.extend([dict(kind='rug',x=1088,y=2720,width=544,height=416),dict(kind='rug',x=832,y=3440,width=640,height=256),dict(kind='rug',x=1920,y=3616,width=640,height=320),dict(kind='microwave-queue',x=832,y=2448,width=64,height=224),dict(kind='mess',x=736,y=2656,width=864,height=1088,count=72,seed=46),dict(kind='confetti',x=1280,y=3296,width=192,height=128,count=40,seed=47)])
 return dict(labels=labels,floorDecor=decor,structures=structures,cars=len(cars),protectedRoutes=[dict(id='parking-entry',x=1760,y=1616,width=832,height=224),dict(id='break-entry',x=1856,y=2816,width=736,height=224),dict(id='staff-return',x=912,y=1856,width=224,height=448),dict(id='server-stub',x=2080,y=432,width=432,height=224),dict(id='conference-stub',x=2560,y=3632,width=368,height=224)])
