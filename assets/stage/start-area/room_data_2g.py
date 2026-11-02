"""HR Says Relax: room assembly only. Navigation and spawning belong to Claude."""
from room_data_2e import CAP

def place_wellness(put,placements,workers):
 labels=[];decor=[]
 def fixed(prop,x,y,v=0,caption=None):
  p=put(prop,x,y,v,'Wellness / '+prop)
  assert (p['x'],p['y'])==(x,y),('Wellness fixture moved',prop,x,y,p)
  p.update(district='wellness')
  if caption:p['caption']=CAP.get(caption,caption)
  return p
 fixed('wellness_massage_chair',3232,3548,0,'wellness_massage_chair')
 fixed('wellness_quiet_pod',3520,3552,0,'wellness_quiet_pod')
 fixed('wellness_puzzle_table',3824,3552,0,'wellness_puzzle_table')
 fixed('wellness_sad_lamp',3328,3548,0,'wellness_sad_lamp')
 fixed('wellness_sad_lamp',4056,3536,1,'wellness_sad_lamp')
 fixed('wellness_nap_pod',4312,3552,0,'wellness_nap_pod_broken')
 fixed('wellness_zen_fountain',4592,3548,0,'wellness_zen_fountain')
 for i,(x,y) in enumerate([(3540,3872),(3744,3872),(3948,3872),(3320,4184)]):
  placements.append(dict(id='wellness-mat-'+str(i),prop='wellness_yoga_mat',x=x,y=y,variant=i%3,solid=False,depthY=-1000000000+4,district='wellness',group='Wellness / floor mats',caption=CAP['wellness_yoga_mats' if i<3 else 'wellness_sad_yoga_mat']))
 p=put('wellness_fun_banner',3856,3440,0,'Wellness / mandatory fun',wall=True);p.update(district='wellness',depthY=3473,readAt=[3856,3680],caption=CAP['wellness_mandatory_fun'])
 for x,y in [(3424,3536),(3664,3548),(3968,3548),(4480,3548),(3096,3552),(3096,3744),(3096,3936),(3096,4128),(4904,3520),(4904,3920),(3184,4208),(3408,4208),(4304,4208)]:fixed('plant',x,y,0,'The ficus has attended every mindfulness session. Its growth has been modest but consistent.')
 for prop,x,y,v,caption in [('water_cooler',3648,4208,1,None),('water_cooler',4800,4048,1,None),('trash_recycle',3888,4208,1,None),('trash_recycle',4752,3548,1,None),('lost_found',4576,4048,1,"A forgotten yoga block, two clean socks and the best intentions of Q2."),('lost_found',4128,4208,0,"A spare yoga block. The label says ergonomic seating.")]:fixed(prop,x,y,v,caption)
 # Short bitmap labels, full jokes in the lower third. No tiny raster lettering.
 for id,x,y,text,width,caption,read,depth in [
 ('wellness-fun',3856,3398,'MANDATORY FUN',160,CAP['wellness_mandatory_fun'],[3856,3680],3474),
 ('wellness-nap',4312,3504,'OUT OF ORDER',112,CAP['wellness_nap_pod_broken'],[4312,3680],3558),
 ('wellness-steps',3264,3424,'STEP CHALLENGE',160,'STEP CHALLENGE. The leaderboard is still congratulating Brenda for a walk in April.',[3264,3680],3474),
 ('wellness-qr',4704,3424,'BREATHE',96,'The meditation app QR code has expired. Breathing still works without an account.',[4704,3680],3474)]:labels.append(dict(id=id,x=x,y=y,text=text,width=width,plate=True,depthY=depth,caption=caption,readAt=read))
 decor.extend([dict(kind='wellness-island',x=3472,y=3584,width=896,height=448),dict(kind='rug',x=3152,y=3472,width=160,height=128),dict(kind='rug',x=3440,y=3472,width=160,height=144),dict(kind='mess',x=3200,y=3696,width=1536,height=384,count=25,seed=67),dict(kind='confetti',x=3728,y=3784,width=288,height=128,count=18,seed=68),dict(kind='staff-tape',x=5008,y=3680,width=64,height=128)])
 return dict(labels=labels,floorDecor=decor,walls=[dict(id='wellness-west-throat-seal',x=3040,y=3632,width=32,height=224,axis='y',side='interior',style='wellness')],protectedRoutes=[dict(id='wellness-east-entry',x=4736,y=3632,width=592,height=224),dict(id='conference-west-public',x=2800,y=3856,width=224,height=400)])
