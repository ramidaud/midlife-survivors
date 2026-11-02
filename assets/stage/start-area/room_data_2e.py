"""Stage 2E assembly in campus coordinates. Existing four districts remain untouched."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[3]
CAP={}
for line in (ROOT/'docs/handoffs/gemini-captions.md').read_text().splitlines():
 m=re.match(r"\s*(\w+): '(.*)',?\s*$",line)
 if m:CAP.setdefault(*m.groups())
CAP['conf_room_alignment']='Conference Room Alignment. Every chair is adjusted to a slightly different height.'

def place_age50(put,placements,workers,specs,occupied):
 labels=[];decor=[];walls=[];routes=[]
 def fixed(prop,x,y,v=0,zone='server',caption=None,**extra):
  p=put(prop,x,y,v,zone.title()+' / '+prop)
  assert (p['x'],p['y'])==(x,y),('Age50 fixture moved',prop,x,y,p)
  p.update(district=zone,**extra)
  if caption:p['caption']=CAP.get(caption,caption)
  return p
 # Protected rack loop remains 224px clear; the broad center has a 768x608 reserve.
 racks=[]
 for i,x in enumerate(range(3136,4673,192)):racks.append(fixed('server_rack',x,288,i%3,caption='server_rack_blinking',blink=True))
 for x in [4480,4672]:racks.append(fixed('server_rack',x,640,caption='server_rack_blinking',blink=True))
 for y in [800,1024]:racks.append(fixed('server_rack',2712,y,caption='server_rack_blinking',blink=True))
 for x in [3136,3328,3520,3712,3904]:racks.append(fixed('server_rack',x,1136,caption='server_rack_blinking',blink=True))
 offline=fixed('server_rack',4336,864,1,caption='server_taken_offline')
 fixed('cable_waterfall',4864,272,caption='server_cable_waterfall')
 fixed('server_crash_cart',4880,640,caption='server_crash_cart')
 fixed('offline_lamp',4336,752,caption='slang_unplugged_lamp')
 fixed('ocean_pot',4336,1104,caption='slang_boil_ocean')
 # Small smashable families are recognized by Claude's existing scan.
 for prop,x,y,v in [('printer',2712,704,0),('trash_recycle',2712,928,1),('cabinet',3008,1104,0),('printer',3984,1104,0),('trash_recycle',4560,640,2),('water_cooler',4920,560,1),('lost_found',3016,256,1)]:fixed(prop,x,y,v)
 labels.extend([dict(id='server-offline',text='OFFLINE',x=4336,y=776,width=72,depthY=868,readAt=[4336,920],caption=CAP['server_taken_offline']),dict(id='server-room-name',text='TAKE IT OFFLINE',x=2880,y=184,width=160,depthY=193,readAt=[2880,352],caption=CAP['server_rack_blinking'])])
 decor.extend([dict(kind='cable-cover',x=3040,y=592,width=928,height=12),dict(kind='cable-cover',x=4000,y=560,width=12,height=544),dict(kind='circuit-tape',x=2816,y=816,width=1152,height=12),dict(kind='mess',x=2720,y=688,width=1504,height=400,count=38,seed=50),dict(kind='server-light',x=3072,y=240,width=1696,height=96)])
 # Three glass pods off one 640px-deep shared hall. Tables leave >224px on both sides.
 room_edges=[(5376,6080,5728,'SYNERGY','conf_room_synergy'),(6096,6800,6440,'BANDWIDTH','conf_room_bandwidth'),(6816,7520,7168,'ALIGNMENT','conf_room_alignment')]
 def panel(id,x,y,w,h,axis='x'):
  if axis=='y':
   for dy in range(0,h,256):walls.append(dict(id=id+'-'+str(dy),x=x,y=y+dy,width=w,height=min(256,h-dy),axis=axis,side='interior',style='glass'))
  else:walls.append(dict(id=id,x=x,y=y,width=w,height=h,axis=axis,side='interior',style='glass'))
 for i,(left,right,cx,name,cap) in enumerate(room_edges):
  panel('glass-'+name+'-west',left,4208,cx-112-left,16)
  panel('glass-'+name+'-east',cx+112,4208,right-cx-112,16)
  p=fixed('conference_table',cx,4672,i,'conference',cap)
  # Seated placeholders stay within the solid table assembly.
  for j,dx in enumerate([-48,48]):workers.append(dict(id='meeting-worker-'+str(i)+'-'+str(j),host=p['id'],x=cx+dx,y=4600,variant=(i+j)%3,cropHeight=34,depthY=4671))
  labels.append(dict(id='room-'+name,text=name,x=cx,y=4136,width=128,depthY=4225,readAt=[cx,4336],caption=CAP[cap]))
  labels.append(dict(id='room-'+name+'-time',text='BOOKED' if i==0 else '9 HOURS' if i==1 else 'ON MUTE',x=cx,y=4112,width=96,depthY=4226,readAt=[cx,4336],caption=CAP['conf_nine_hour_meeting'] if i==1 else CAP[cap]))
  routes.extend([dict(id='pod-'+name+'-entry',x=cx-112,y=3952,width=224,height=592),dict(id='pod-'+name+'-left',x=left+8,y=4480,width=224,height=416),dict(id='pod-'+name+'-right',x=right-232,y=4480,width=224,height=416),dict(id='pod-'+name+'-rear',x=left+8,y=4740,width=right-left-16,height=224)])
  decor.extend([dict(kind='rug',x=left+16,y=4240,width=right-left-32,height=720),dict(kind='mess',x=cx-200,y=4448,width=400,height=400,count=22,seed=51+i)])
 for x in [6080,6800]:panel('glass-pod-divider-'+str(x),x,4208,16,784,'y')
 fixed('roadmap_whiteboard',5480,4368,0,'conference','conf_nine_hour_meeting')
 fixed('roadmap_whiteboard',6992,4448,1,'conference','conf_nine_hour_meeting')
 fixed('hard_stop',6288,3464,0,'conference','slang_hard_stop')
 fixed('goal_dollies',7392,3464,0,'conference','slang_move_goalposts')
 placements.append(dict(id='conference-touch-base',prop='baseball_base',x=7152,y=4304,variant=0,solid=False,depthY=-1000000000+4,group='Conference / touch base',district='conference',caption=CAP['slang_touch_base']))
 labels.extend([dict(id='could-be-email',text='COULD BE EMAIL',x=6800,y=3344,width=160,depthY=3377,readAt=[6800,3480],caption='THIS MEETING COULD HAVE BEEN AN EMAIL. The reply-all is already being drafted.'),dict(id='conference-hall',text='MEETING OVERFLOW',x=6032,y=3880,width=160,plate=False,floor=True,alpha=.45)])
 # Loot along wall bays, not across the ring reserve or pod approaches.
 for prop,x,y,v in [('vending_machine',5480,4144,0),('water_cooler',5904,4144,1),('trash_recycle',6272,4144,2),('printer',7408,4144,0),('plant',5968,4368,0),('trash_recycle',5968,4456,1),('cabinet',6200,4368,0),('water_cooler',6720,4368,0),('lost_found',6928,4368,1),('plant',7408,4448,0),('printer',6664,4456,0),('trash_recycle',7408,4368,0)]:fixed(prop,x,y,v,'conference')
 # The long connecting hall is dressed with small bays below the clear center route.
 for i,x in enumerate([3200,3552,3904,4256,4608,4960]):fixed(['vending_machine','trash_recycle','printer','water_cooler','lost_found','plant'][i],x,4704,i%3,'conference')
 for x in [3264,3968,4672]:labels.append(dict(id='meeting-wayfinding-'+str(x),text='MEETINGS',x=x,y=4504,width=112,plate=False,floor=True,alpha=.4))
 decor.extend([dict(kind='rug',x=5520,y=3600,width=1856,height=576),dict(kind='road-dashes',x=3056,y=4592,width=2256,height=16),dict(kind='mess',x=3104,y=4400,width=2080,height=288,count=55,seed=55),dict(kind='confetti',x=6480,y=3856,width=256,height=128,count=20,seed=56)])
 return dict(labels=labels,floorDecor=decor,walls=walls,protectedRoutes=routes+[dict(id='server-entry',x=2512,y=432,width=240,height=224),dict(id='conference-throat',x=2928,y=3632,width=112,height=224),dict(id='conference-south-neck',x=2800,y=3856,width=224,height=720),dict(id='conference-south-wrap',x=2800,y=4352,width=2528,height=224),dict(id='conference-east-return',x=5104,y=3632,width=224,height=944),dict(id='conference-main-entry',x=5104,y=3632,width=384,height=224),dict(id='executive-stub',x=4832,y=304,width=416,height=224)],racks=len(racks)+1)
