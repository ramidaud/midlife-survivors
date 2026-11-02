// Connected office-floor study. Coordinates are pixels; 32 pixels = one tile.
// Landmarks and discoveries test exploration only, not production item rewards.
window.OFFICE_LAYOUT = {
  name: 'Corporate Campus', width: 3072, height: 2048,
  spawn: [0, 38], laneWidth: 224,
  corridors: [
    {x:0,y:0,width:224,height:2048},
    {x:0,y:0,width:3072,height:224},
    {x:0,y:-832,width:2304,height:192},
    {x:0,y:832,width:2304,height:192},
    {x:-1152,y:0,width:192,height:1664},
    {x:1152,y:0,width:192,height:1664},
    {x:0,y:-448,width:1024,height:160},
    {x:0,y:448,width:1024,height:160}
  ],
  environmentProps: [
    {id:'cabinet',x:-1040,y:-640},{id:'plant',x:-430,y:-640},
    {id:'cabinet',x:-1408,y:-176},{id:'cabinet',x:-1408,y:16},
    {id:'plant',x:1408,y:-208},{id:'plant',x:1408,y:208},
    {id:'plant',x:464,y:624},{id:'plant',x:960,y:288},
    {id:'plant',x:-160,y:-128},{id:'plant',x:160,y:128}
  ],
  departments: [
    { id: 'atrium', name: 'CENTRAL ATRIUM', shortName:'Atrium', x:0,y:0,width:512,height:448,color:0xa88b70,
      landmark:'The welcome mat', joke:'You are here. Your inbox has been here all weekend.',
      desks:[],prop:'prop_plant',propAt:[176,-128],tour:[0,38] },
    { id: 'accounts', name: 'ACCOUNTS PAYABLE', shortName:'Accounts', x:-704,y:-448,width:640,height:448,color:0x526078,
      landmark: 'The paperwork skyline', joke: 'Every pile has been marked urgent since 2009.',
      desks:[[-928,-544,'tidy'],[-768,-544,'paperwork'],[-608,-544,'lunch'],[-928,-352,'y2009_1'],[-768,-352,'tidy'],[-608,-352,'y2009_0']],
      prop:'prop_copier',propAt:[-960,-656],tour:[-704,-448] },
    { id: 'quiet', name: 'THE QUIET ZONE', shortName:'Quiet zone', x:704,y:-448,width:640,height:448,color:0x3e7775,
      landmark: 'The loudest printer in the building', joke: 'Quiet hours begin as soon as this finishes printing.',
      desks:[[512,-544,'sticky_0'],[672,-544,'tidy'],[832,-544,'paperwork'],[512,-352,'tidy'],[672,-352,'paperwork'],[832,-352,'sticky_1']],
      prop:'prop_copier',propAt:[960,-608],tour:[704,-448] },
    { id: 'breakroom', name: 'THE BREAKROOM', shortName:'Breakroom', x:-704,y:448,width:640,height:448,color:0xa88b70,
      landmark: 'Friday leftovers', joke: 'The pizza is communal. The mug absolutely is not.',
      desks:[[-928,336,'lunch'],[-512,336,'lunch'],[-928,592,'lunch'],[-512,592,'lunch']],
      prop:'prop_cooler',propAt:[-960,448],tour:[-704,448] },
    { id: 'wellness', name: 'WELLNESS CORNER', shortName:'Wellness', x:704,y:448,width:640,height:448,color:0x83a89a,
      landmark: 'The emotional-support fern', joke: 'The plant has also declined the optional wellness seminar.',
      desks:[[512,336,'family_0'],[896,336,'tidy'],[512,592,'tidy'],[896,592,'family_1']],
      prop:'prop_plant',propAt:[960,480],tour:[704,448] },
    { id:'archives',name:'RECORDS ANNEX',shortName:'Files',x:-1312,y:0,width:320,height:576,color:0x526078,
      landmark:'The permanent archive',joke:'Filed under: we might need this someday.',
      desks:[],prop:'prop_copier',propAt:[-1280,-192],tour:[-1312,96] },
    { id:'meeting',name:'MEETING WING',shortName:'Meet',x:1312,y:0,width:320,height:576,color:0x3e7775,
      landmark:'Room 404',joke:'The meeting has moved. The invite has not.',
      desks:[[1312,-176,'sticky_2'],[1312,224,'paperwork']],prop:'prop_plant',propAt:[1280,-240],tour:[1408,0] }
  ],
  discoveries: [
    { id: 'coupon', name: 'The ancient coupon', x:-960,y:-448,glyph:'%',
      note: 'Ten percent off. Expired before your last promotion.' },
    { id: 'headphones', name: 'Noise-canceling headphones',x:960,y:-448,glyph:'♪',
      note: 'You can still see the reply-all notifications. Small victories.' },
    { id: 'pizza', name: 'Leftover Friday pizza',x:-704,y:608,glyph:'△',
      note: 'A little cold, a little mysterious, still the best meeting today.' },
    {id:'binder',name:'The lost binder',x:-1312,y:160,glyph:'?',note:'The project was canceled. The binder survived.'},
    {id:'badge',name:'The visitor badge',x:1424,y:64,glyph:'!',note:'Valid for one meeting. Somehow still here three years later.'}
  ]
};
