"""Matte floor marks for the Courtyard Loop, authored in campus-local pixels."""

def dress_courtyard(layout):
    # The short Welcome mat becomes the east leg of an L-shaped runner from the lift doors.
    landing = next(d for d in layout['floorDecor'] if d['kind'] == 'welcome-rug')
    landing.update(x=32, y=-430, width=540, height=128)
    layout['floorDecor'].append(dict(kind='welcome-rug', x=-80, y=-766, width=112, height=464))
    next(r for r in layout['labels'] if r['id'] == 'loop-welcome').update(x=388, y=-326)

    def mark(style, x, y, width, height, **extra):
        layout['floorDecor'].append(dict(kind='courtyard-decal', style=style,
            x=x, y=y, width=width, height=height, **extra))

    def gag(id, text, x, y, width, alpha):
        layout['labels'].append(dict(id='loop-floor-'+id, text=text, x=x, y=y,
            width=width, floor=True, plate=False, alpha=alpha, scale=2))

    for x,y,w,h in [
        (-768,-745,242,56),(-768,450,242,56),(-558,-709,62,1200),
        (1012,-521,68,210),(224,-436,260,66),
        (1498,-756,2412,68),(3869,-722,65,952),(1498,191,2412,60),
        (1471,-720,61,945),(2644,-722,58,935),(2296,-928,58,210)
    ]: mark('wear',x,y,w,h)

    mark('inlay',2576,-418,224,224)
    mark('spill',2765,-115,110,57)
    gag('wet','CAUTION\nWET FLOOR',2819,-55,104,.56)
    mark('curl',545,-325,27,23)
    mark('chair',2338,-520,35,37,mirror=True)
    mark('chair',2972,-150,35,37)
    mark('chair',2365,40,35,37)
    mark('chair',1906,-681,35,37,mirror=True)
    mark('pizza',2924,24,47,34)
    mark('pen-cup',2196,-487,45,31)
    for x,y in [(2511,-676),(2425,-837),(2394,-796),(2348,-731),(2448,265),(3696,-570)]:
        mark('papers',x,y,49,33,seed=(x+y)%7)
    for x,y in [(2200,-678),(2257,-659),(2312,-643),(2380,-608),(3020,-176)]:
        mark('sticky',x,y,14,14)
    for x,y in [(2832,-469),(2551,-211),(2778,112),(2018,-655),(1212,-351),(462,-368)]:
        mark('rings',x,y,37,28)
    mark('cables',3212,-655,219,47)
    mark('cables',2191,-190,126,48,mirror=True)
    mark('old-printer',2481,-889,118,67)
    gag('printer','PRINTER\nWAS HERE',2540,-826,105,.52)
    mark('note',2238,-644,116,36)
    gag('move','MOVE YOUR CAR\nHR',2296,-610,116,.64)
    mark('footsteps',-47,-714,66,329,steps=12)
    mark('footsteps',-752,-741,202,45,steps=8)
    mark('badge',130,-376,34,19)
    mark('umbrella',-99,-315,63,21)
