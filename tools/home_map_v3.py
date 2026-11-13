# Maple Hollow full map v3, to scale: 1 svg px = 10 game px
S=0.1
NAVY="#171C35"; SLATE="#303750"; TEAL="#3E7775"; SAGE="#83A89A"; CREAM="#F2D7A1"; COFFEE="#EF9347"; RUSSET="#C45C4B"; GRASS="#9BAE73"; ROAD="#2B3150"; TREE="#2F4A3A"; PAPER="#FFF0CF"; LAV="#BFA8CF"
WALL=192; COLW=2496; ROAD_W=256; R1=2048; R2=2752; R3=2048
xs=[WALL, WALL+COLW+ROAD_W, WALL+2*(COLW+ROAD_W)]
ys=[WALL, WALL+R1+ROAD_W, WALL+R1+ROAD_W+R2+ROAD_W]
hs=[R1,R2,R3]
W=WALL*2+3*COLW+2*ROAD_W; H=WALL*2+R1+R2+R3+2*ROAD_W
OX,OY=40,120  # svg offset
out=[]
def r(x,y,w,h,fill,stroke=None,sw=1,rx=0,dash=None,op=1):
    a=f'<rect x="{OX+x*S:.1f}" y="{OY+y*S:.1f}" width="{w*S:.1f}" height="{h*S:.1f}" rx="{rx}" fill="{fill}" opacity="{op}"'
    if stroke: a+=f' stroke="{stroke}" stroke-width="{sw}"'
    if dash: a+=f' stroke-dasharray="{dash}"'
    out.append(a+'/>')
def t(x,y,s,size=11,fill=PAPER,anchor="start",bold=False,font="Silkscreen, 'Courier New', monospace"):
    out.append(f'<text x="{OX+x*S:.1f}" y="{OY+y*S:.1f}" font-family="{font}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{700 if bold else 400}">{s}</text>')
def c(x,y,rad,fill,stroke=None,sw=1):
    out.append(f'<circle cx="{OX+x*S:.1f}" cy="{OY+y*S:.1f}" r="{rad*S:.1f}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>')
SW=W*S+80; SH=H*S+120+250
out.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{SW:.0f}" height="{SH:.0f}" viewBox="0 0 {SW:.0f} {SH:.0f}">')
out.append(f'<rect width="100%" height="100%" fill="{NAVY}"/>')
out.append(f'<text x="40" y="52" font-family="Silkscreen, \'Courier New\', monospace" font-size="20" fill="{CREAM}" font-weight="700">MAPLE HOLLOW · FULL MAP DRAFT V3 (TO SCALE)</text>')
out.append(f'<text x="40" y="80" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="14" fill="#B8C0D4">1 px here = 10 px in the game. Whole map 8,384 x 7,744 px, about 6.5 x 9.7 laptop screens. Big orange numbers = the age an area opens.</text>')
out.append(f'<text x="40" y="100" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="14" fill="#B8C0D4">Your block (teal outline) is already built. Everything else is a plan. Nov 12, 2026.</text>')
# tree wall + base
r(0,0,W,H,TREE)
r(WALL,WALL,W-2*WALL,H-2*WALL,GRASS)
# roads (tic-tac-toe)
for x in (xs[0]+COLW, xs[1]+COLW): r(x,WALL,ROAD_W,H-2*WALL,ROAD)
for y in (ys[0]+R1, ys[1]+R2): r(WALL,y,W-2*WALL,ROAD_W,ROAD)
# dashed center lines
for x in (xs[0]+COLW+ROAD_W/2, xs[1]+COLW+ROAD_W/2):
    out.append(f'<line x1="{OX+x*S:.1f}" y1="{OY+WALL*S:.1f}" x2="{OX+x*S:.1f}" y2="{OY+(H-WALL)*S:.1f}" stroke="{CREAM}" stroke-width="1" stroke-dasharray="6 6" opacity=".6"/>')
for y in (ys[0]+R1+ROAD_W/2, ys[1]+R2+ROAD_W/2):
    out.append(f'<line x1="{OX+WALL*S:.1f}" y1="{OY+y*S:.1f}" x2="{OX+(W-WALL)*S:.1f}" y2="{OY+y*S:.1f}" stroke="{CREAM}" stroke-width="1" stroke-dasharray="6 6" opacity=".6"/>')
# loop road highlight around center block
lx,ly=xs[1]-ROAD_W,ys[1]-ROAD_W
out.append(f'<rect x="{OX+lx*S:.1f}" y="{OY+ly*S:.1f}" width="{(COLW+2*ROAD_W)*S:.1f}" height="{(R2+2*ROAD_W)*S:.1f}" fill="none" stroke="{COFFEE}" stroke-width="3" stroke-dasharray="10 6" opacity=".9"/>')
t(xs[1]+COLW/2, ly-60, "THE LOOP (Maple Lane ring road)", 11, COFFEE, "middle")
# road names
# districts: (col,row,name,age,line,color)
D={}
def district(col,row,name,age,sub,fill):
    x,y,w,h=xs[col],ys[row],COLW,hs[row]
    r(x+48,y+48,w-96,h-96,fill,COFFEE if age else TEAL,2,8,"8 5" if age else None,0.92)
    t(x+120,y+190,(f"{age} · " if age else "")+name,16,CREAM,bold=True)
    t(x+120,y+330,sub,12,PAPER,font="Atkinson Hyperlegible, Arial, sans-serif")
    D[(col,row)]=(x,y,w,h)
district(0,0,"BIRCH CIRCLE","47","HOA President in the cul-de-sac (48)","#5C7A5A")
district(1,0,"MAPLE PARK","62","Gold Watch at the pavilion (63.5)","#5C7A5A")
district(2,0,"THE WOODS",None,"Full Life only, past 65","#2F4A3A")
district(0,1,"ELEMENTARY","44","Math Homework on the playground (45)","#6F6A55")
district(2,1,"STRIP MALL","50","Mortgage at the bank (52)","#4A5068")
district(0,2,"COMMUNITY CTR","55","Holiday Party in the hall (56)","#6A5368")
district(1,2,"THE PARKWAY","59","The V8 chases you around the loop (60)","#4A5068")
district(2,2,"TOWN SQUARE","53*","Arcade, skate park, shops","#6A5A48")
# center (built)
x,y=xs[1],ys[1]
r(x,y,COLW,R2,"#7F9466",TEAL,3,6)
# rows of houses
for row_top in (448,1792):
    for i in range(6):
        r(x+i*416+16,y+row_top,336,368,"#B8A27F",NAVY,0.6)
        r(x+i*416,y+row_top-448,416,448,"#8FA56A",None)
    r(x,y+row_top+384+64,COLW,320,ROAD)  # street
r(x+2*416+16,y+448,336,368,COFFEE,NAVY,1.5)
t(x+COLW/2,y+R2/2-120,"40 · YOUR BLOCK",16,CREAM,"middle",True)
t(x+COLW/2,y+R2/2+40,"built: 12 houses, 11 backyards, your house",12,PAPER,"middle",font="Atkinson Hyperlegible, Arial, sans-serif")
# porch + start
px,py=x+2*416+120,y+448+372
c(px,py,70,CREAM,NAVY,1.5); t(x+60,y+1060,"PORCH = END AT 65 · WHITE DOT = START",9,CREAM)
c(x+2*416+200,y+900,50,PAPER,NAVY,1)
# features inside districts
def feat(col,row,fx,fy,fw,fh,label,fill=SLATE):
    X,Y,_,_=D[(col,row)]
    r(X+fx,Y+fy,fw,fh,fill,NAVY,0.8,4)
    t(X+fx+fw/2,Y+fy+fh/2+40,label,9,PAPER,"middle")
# birch circle
X,Y,_,_=D[(0,0)]; c(X+1250,Y+1200,420,ROAD,CREAM,1.5); t(X+1250,Y+1180,"CUL-DE-SAC",9,CREAM,"middle"); t(X+1250,Y+1320,"ARENA",9,CREAM,"middle")
for i,(hx,hy) in enumerate([(300,480),(900,480),(1700,480),(2000,1000),(300,1150),(1900,1550),(400,1650)]): r(X+hx,Y+hy,300,260,"#B8A27F",NAVY,0.6)
# park
feat(1,0,300,500,800,520,"PAVILION")
X,Y,_,_=D[(1,0)]; out.append(f'<ellipse cx="{OX+(X+1700)*S:.1f}" cy="{OY+(Y+900)*S:.1f}" rx="{450*S:.1f}" ry="{280*S:.1f}" fill="#5D8FA0" stroke="{NAVY}" stroke-width=".8"/>'); t(X+1700,Y+930,"POND",9,PAPER,"middle")
feat(1,0,400,1350,1600,300,"WALKING TRAIL","#7A6A4E")
# woods
X,Y,_,_=D[(2,0)]
import random; random.seed(4)
for _ in range(38): c(X+random.randint(250,2250),Y+random.randint(450,1800),random.randint(70,120),random.choice(["#3E6B4A",RUSSET,COFFEE,"#4E7A52"]))
c(X+1150,Y+1150,60,"#9AA3B5",NAVY); c(X+1320,Y+1150,60,"#9AA3B5",NAVY); t(X+1235,Y+1320,"TWIN STONES",9,CREAM,"middle")
# school
feat(0,1,250,450,1500,700,"SCHOOL BUILDING","#B8A27F")
feat(0,1,250,1350,1500,300,"PICKUP LINE",ROAD)
feat(0,1,250,1850,1900,600,"PLAYGROUND ARENA","#8FA56A")
# strip mall
for i,n in enumerate(["FOOD","BANK","PIZZA","RX"]):
    feat(2,1,250+i*520,450,470,520,n,"#B8A27F" if n!="BANK" else COFFEE)
feat(2,1,250,1200,2000,1300,"PARKING LOT: runaway carts",ROAD)
# community ctr
feat(0,2,300,450,1500,800,"THE HALL","#B8A27F")
feat(0,2,300,1450,1900,350,"BLOCK PARTY STREET",ROAD)
# parkway
X,Y,_,_=D[(1,2)]
out.append(f'<path d="M{OX+(X+150)*S:.1f},{OY+(Y+1600)*S:.1f} C{OX+(X+800)*S:.1f},{OY+(Y+300)*S:.1f} {OX+(X+1700)*S:.1f},{OY+(Y+1800)*S:.1f} {OX+(X+2350)*S:.1f},{OY+(Y+500)*S:.1f}" fill="none" stroke="{ROAD}" stroke-width="{256*S:.1f}"/>')
feat(1,2,900,1500,700,300,"GOLF EDGE","#8FA56A")
# road out of town
rx0=xs[1]+COLW/2-128
r(rx0,H-WALL,256,WALL,ROAD)
r(rx0-30,H-WALL-60,316,60,RUSSET,NAVY,1)
t(xs[1]+COLW/2,H+260,"ROAD OUT OF TOWN (closed; opens in Full Life)",11,RUSSET,"middle")
# town square
feat(2,2,250,450,900,600,"ARCADE",LAV)
feat(2,2,1300,450,950,600,"SHOPS","#B8A27F")
X,Y,_,_=D[(2,2)]; c(X+1750,Y+1550,300,"#C9B98F",NAVY,1); t(X+1750,Y+1580,"FOUNTAIN",9,NAVY,"middle")
feat(2,2,250,1300,650,600,"SKATE PARK","#9AA3B5")
# screen scale
# legend
LY=OY+H*S+60
L=[(TEAL,"Built and playable"),(COFFEE,"Opens at this age (dashed edge)"),(ROAD,"Roads; the orange ring is the loop"),(TREE,"Tree wall contains the level")]
for i,(col,lab) in enumerate(L):
    lx2=40+(i%2)*330; ly2=LY+(i//2)*28
    out.append(f'<rect x="{lx2}" y="{ly2}" width="18" height="18" fill="{col}" stroke="{CREAM}" stroke-width=".5"/>')
    out.append(f'<text x="{lx2+26}" y="{ly2+14}" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="14" fill="{PAPER}">{lab}</text>')
out.append(f'<rect x="700" y="{LY}" width="{1280*S:.0f}" height="{800*S:.0f}" fill="none" stroke="{CREAM}" stroke-width="1.5" stroke-dasharray="4 3"/>')
out.append(f'<text x="{700+64}" y="{LY+46}" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="13" fill="{PAPER}" text-anchor="middle">1 screen</text>')
LY+=40
notes=["Every area has its boss arena and at least two entrances off the roads (96 px gaps, 224 px main routes).",
       "Run rhythm: an area opens about a year before its boss, you explore, the swarm builds, boss, chest, calm.",
       "* Town Square at 53 is a suggestion: a shopping breather between the Mortgage (52) and the Party (56).",
       "The Woods and the road out of town are for Full Life, which will connect to the office and later the hospital."]
for i,n in enumerate(notes):
    out.append(f'<text x="40" y="{LY+52+i*22}" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="14" fill="#B8C0D4">{n}</text>')
out.append('</svg>')
open("home-map-v3.svg","w").write("\n".join(out))
print(SW,SH)
