"""Ground floor v4 (Nov 13): Codex's approved repaint (PR #10) placed in the big house, with real walls.

Reads the v2 house (src/data/house-v2.js, built by tools/build_house_v2.py) and writes src/data/house-v4.js,
which replaces window.HOUSE_V2's ground floor before the game builds it:
  * three tall wall faces (128 px): the top of the house, living/dining, dining/kitchen. The house gets 368 px
    taller; everything below a face moves down with it.
  * doorways through the faces where the 96 px routes need them (Rami picked "real walls" + "swap the dining wall").
  * the living room from Rami's round 2 layout, the other rooms from Codex's approved room-layout.json.
  * every piece keeps its painted size (no scaling); its solid footprint comes from Codex's manifest.
It also prints a route check: a 96 x 96 square must reach every main room from the front door.
Run: python3 tools/build_house_v4.py
"""
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
ART = os.path.join(ROOT, "assets/stage/home/v4/house-ground-floor/")
DEL = ART + "repaint/deliver/"
OUT_ATLAS = "v4/house-ground-floor/house4-floor1-pieces.png"   # relative to assets/stage/home/

FACE = 128                                   # wall face height
CUTS = [(16, FACE - 16), (361, FACE), (699, FACE)]   # (old y, px inserted): top wall grows to 128; two new faces
def Y(y):
    return y + sum(d for c, d in CUTS if y >= c)
def R(r):
    # a rect that ends exactly on a cut stays above it (the new face goes below it, not inside it)
    x, y, w, h = r; y1 = Y(y + h - 1) + 1; return [x, Y(y), w, y1 - Y(y)]

src = open(ROOT + "/src/data/house-v2.js").read().split("window.HOUSE_V2 = ", 1)[1]
H2 = json.loads(src[:src.index("};") + 1])
old_atlas = Image.open(ROOT + "/assets/stage/home/" + H2["atlas"]).convert("RGBA")

# ---------- rooms, walls, doors in the taller house ----------
rooms = {r["id"]: dict(r, rect=R(r["rect"]), old=r["rect"]) for r in H2["rooms"]}
walls = [R(w) for w in H2["walls"] if not (w[1] == 0 and w[3] == 16)]          # the top wall becomes a face
doors = [dict(d, rect=R(d["rect"])) for d in H2["doors"]]
for d in doors:
    if d["id"] == "patio": d["rect"] = [d["rect"][0], 0, d["rect"][2], FACE]       # the closed patio door spans the face
# faces: [x, y, w, h]; gaps are the doorways
DOOR_B = [672, 784]                         # living -> dining, at the living room's open corner (dining wall swapped)
faces = [[0, 0, 800, FACE],
         [16, Y(361) - FACE, DOOR_B[0] - 16, FACE],
         [16, Y(699) - FACE, 184, FACE], [336, Y(699) - FACE, 784 - 336, FACE]]   # the hallway (200-336) stays open

# ---------- pieces ----------
man = {p["id"]: p for p in json.load(open(DEL + "manifest-ground-floor.json"))["pieces"]}
man["round-coffee-table"] = dict(man["round-coffee-table"], file="../../../house-upstairs/deliver/coffee-table-oak-v1.png")  # Codex's oak top (PR #11), same size and footprint
layout = json.load(open(DEL + "mockups/room-layout.json"))
living = json.load(open(ROOT + "/docs/plans/house-layout/placements-round2.json"))["rooms"]["living"]["items"]
REPLACED = {"living", "dining", "downstairs-desk-nook", "kitchen", "entry"}
keep = [p for p in H2["pieces"] if p["room"] not in REPLACED and p["id"] != "abstract-painting"]  # the old hallway painting: Codex repainted it for the dining wall

# Rami's own layout from the House Layout Editor (scale and rotation are repaint requests, never applied here)
import sys
RAMI = json.load(open(ROOT + "/docs/plans/house-layout/" + (sys.argv[1] if len(sys.argv) > 1 else "rami-layout-nov13.json")))["rooms"]
FIX = {("living", "racing-sim-rig"): (540, 96), ("living", "sim-cables"): (568, 160),   # route nudges, if the room needs them
       # the dining wall swap (Rami's option 1): desk + shelves left, painting right, so the living-room doorway fits at the right end
       ("dining-desk-shared", "corner-computer-desk"): (112, -48), ("dining-desk-shared", "camera-book-shelves"): (124, -144),
       ("dining-desk-shared", "mesh-office-chair"): (200, -8), ("dining-desk-shared", "abstract-wall-painting"): (352, -128),
       ("dining-desk-shared", "kids-drawings"): (376, -24), ("dining-desk-shared", "moon-print"): (-128, -104)}
placements = []   # (view room id, piece id, x, y) room-relative, in the room's own (old-rect) frame
for room in ("living", "dining-desk-shared", "kitchen", "entry", "laundry-closet"):
    for pid, x, y, sc, rot in RAMI[room]:
        x, y = FIX.get((room, pid), (x, y))
        if room in ("entry", "laundry-closet") and man[pid]["renderLayer"] == "wall-mounted": y = max(y, -28)  # no tall face here
        placements.append((room, pid, x, y))
VIEW = {v["id"]: v["rect"] for v in layout["views"]}

atlas_items = []      # (key, image)
for k, (x, y, w, h) in H2["frames"].items(): atlas_items.append((k, old_atlas.crop((x, y, x + w, y + h))))
used = set()
pieces = []
for room, pid, x, y in placements:
    m = man[pid]; key = "v4_" + pid
    if key not in used: atlas_items.append((key, Image.open(DEL + m["file"]).convert("RGBA"))); used.add(key)
    ox, oy = VIEW[room][0], Y(VIEW[room][1])
    w, h = m["size"]
    layer = {"ground": "decal", "wall-mounted": "wall", "over-everything": "over"}.get(m["renderLayer"], "furniture")
    fps = m["footprints"]
    fp = None
    if fps:
        x0 = min(f[0] for f in fps); y0 = min(f[1] for f in fps)
        x1 = max(f[0] + f[2] for f in fps); y1 = max(f[1] + f[3] for f in fps)
        fp = [x0, y0, x1 - x0, y1 - y0]
    solid = layer == "furniture" and fp is not None
    pieces.append({"id": pid, "key": key, "at": [ox + x, oy + y], "size": [w, h], "fp": fp, "solid": solid,
                   "layer": layer, "room": room})
for p in keep: p["at"] = [p["at"][0], Y(p["at"][1])]
pieces = keep + pieces

# ---------- textures: Codex's wood floor and a 128 px wall face built from his north-wall strip ----------
strip = Image.open(ART + "north-wall-strip-v1.png").convert("RGBA")          # 256 x 96
face = Image.new("RGBA", (strip.width, FACE)); top = strip.crop((0, 0, strip.width, 8))
for yy in range(0, FACE - strip.height, 8): face.paste(top, (0, yy))
face.paste(strip, (0, FACE - strip.height))
atlas_items.append(("v4_wallface", face))
atlas_items.append(("floor_v4wood", Image.open(ART + "dark-wood-floor-v1.png").convert("RGBA")))

items = sorted(atlas_items, key=lambda kv: -kv[1].size[1])
AW, xo, yo, shelf, frames = 2048, 0, 0, 0, {}
for k, im in items:
    w, h = im.size
    if xo + w > AW: xo, yo, shelf = 0, yo + shelf + 2, 0
    frames[k] = [xo, yo, w, h]; xo += w + 2; shelf = max(shelf, h)
atlas = Image.new("RGBA", (AW, yo + shelf))
for k, im in items: atlas.paste(im, tuple(frames[k][:2]))
atlas.save(ROOT + "/assets/stage/home/" + OUT_ATLAS)

for rid in ("living", "dining", "downstairs-desk-nook", "kitchen", "entry", "circulation", "breakfast-nook", "stairs", "half-bath", "entry-closet", "laundry-closet"):
    if rid in rooms and rid != "stairs": rooms[rid]["floor"] = "floor_v4wood"
base = [dict(b, rect=R(b["rect"])) for b in H2["base"]]
base[0]["floor"] = "floor_v4wood"
size = [H2["size"][0], Y(H2["size"][1])]
out = dict(H2, size=size, atlas=OUT_ATLAS, frames=frames, base=base,
           rooms=[{"id": r["id"], "rect": r["rect"], "floor": r.get("floor")} for r in rooms.values()],
           walls=walls, doors=doors, pieces=pieces, faces=faces,
           stairs={"rect": R(H2["stairs"]["rect"]), "art": H2["stairs"]["art"]},
           wallTex=dict(H2["wallTex"], face="v4_wallface"),
           note="Built by tools/build_house_v4.py: v2 house + 128 px wall faces + Codex's approved repaint (PR #10) in Rami's layout.")
js = "// GENERATED by tools/build_house_v4.py (do not hand-edit). Ground floor v4: real walls + the approved repaint.\n"
js += "window.HOUSE_V2 = Object.assign(window.HOUSE_V2 || {}, " + json.dumps({k: v for k, v in out.items() if k != "floor2"}, separators=(",", ":")) + ");\n"
open(ROOT + "/src/data/house-v4.js", "w").write(js)
print("house", size, "| pieces", len(pieces), "| atlas", atlas.size)

# ---------- route check: a 96 x 96 square from the front door ----------
W, Hh = size
mask = np.zeros((Hh, W), dtype=np.int32)
def block(x, y, w, h): mask[max(0, y):max(0, y + h), max(0, x):max(0, x + w)] = 1
for w in walls: block(*w)
for f in faces: block(*f)
for d in doors:
    if d["id"] in ("patio", "front-entry", "garage-front"): block(*d["rect"])
for p in pieces:
    if p.get("solid"):
        if p.get("fp"): block(p["at"][0] + p["fp"][0], p["at"][1] + p["fp"][1], p["fp"][2], p["fp"][3])
        else: f = p["foot"]; block(p["at"][0] + f[0], p["at"][1] + f[1], f[2], f[3])
# outside the house is blocked too
mask[:, :16] |= 0
n = 96
S = np.pad(mask, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
free = (S[n:, n:] - S[:-n, n:] - S[n:, :-n] + S[:-n, :-n]) == 0
fe = next(d for d in doors if d["id"] == "front-entry")["rect"]
start = None
for yy in range(fe[1], fe[1] + fe[3]):
    for xx in range(16, 120):
        if yy < free.shape[0] and xx < free.shape[1] and free[yy, xx]: start = (xx, yy); break
    if start: break
seen = np.zeros_like(free, dtype=bool); st = [start] if start else []
if start: seen[start[1], start[0]] = True
while st:
    x, y = st.pop()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= ny < free.shape[0] and 0 <= nx < free.shape[1] and free[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True; st.append((nx, ny))
ok = True
for rid in ("entry", "circulation", "breakfast-nook", "kitchen", "dining", "downstairs-desk-nook", "living", "garage"):
    x, y, w, h = rooms[rid]["rect"]
    reach = seen[max(0, y):max(0, y + h - n + 1), max(0, x):max(0, x + w - n + 1)].any() if w >= n and h >= n else None
    if reach is not None and not reach: ok = False
    # pockets: free squares in the room that the walk never reaches
    fr = free[max(0, y):max(0, y + h - n + 1), max(0, x):max(0, x + w - n + 1)]
    sn = seen[max(0, y):max(0, y + h - n + 1), max(0, x):max(0, x + w - n + 1)]
    pocket = int((fr & ~sn).sum())
    print("  %-22s reached=%s  unreachable 96px spots=%d" % (rid, reach, pocket))
print("ROUTES", "PASS" if ok else "FAIL")
np.save("/tmp/house4_seen.npy", seen); np.save("/tmp/house4_mask.npy", mask)


# =====================================================================================================
# UPSTAIRS (Nov 13 evening): Codex's approved upstairs (PR #11) in Rami's layout, with the same wall faces.
# =====================================================================================================
F2 = H2["floor2"]
UP = ART.replace("house-ground-floor/", "house-upstairs/deliver/")
U_CUTS = [(16, FACE - 16), (443, FACE), (951, FACE)]   # top; linen / hall / walk-in row; Abe's room row
def UY(y): return y + sum(d for c, d in U_CUTS if y >= c)
def UR(r):
    x, y, w, h = r; y1 = UY(y + h - 1) + 1; return [x, UY(y), w, y1 - UY(y)]
u_rooms = {r["id"]: dict(r, rect=UR(r["rect"])) for r in F2["rooms"]}
u_walls = [UR(w) for w in F2["walls"] if not (w[1] == 0 and w[3] == 16)]
u_doors = [dict(d, rect=UR(d["rect"])) for d in F2["doors"]]
B0, D0 = UY(443) - FACE, UY(951) - FACE
u_faces = [[0, 0, 800, FACE],
           [16, B0, 184, FACE], [304, B0, 480, FACE],            # linen | doorway from the main bedroom (200-304) | hall stub + walk-in closet
           [16, UY(947), 184, UY(951) - UY(947)],                # the utility room (its top sits 4 px above the cut)
           [344, D0, 440, FACE]]                                 # Abe's room; 200-344 is his doorway from the hall
u_man = {p["id"]: dict(p, file=UP + p["file"]) for p in json.load(open(UP + "manifest-upstairs.json"))["pieces"]}
for r in json.load(open(UP + "manifest-upstairs.json"))["reusedPieces"]:
    u_man[r["id"]] = dict(r, file=os.path.normpath(UP + r["file"]))
u_layout = json.load(open(UP + "mockups/room-layout.json"))
U_VIEW = {v["id"]: v["rect"] for v in u_layout["views"]}
U_FIX = {("abe-room", "gaming-chair"): (268, -10),   # tucked under the desk: opens the lane above the bed
         ("abe-room", "beanbag"): (470, 160),      # slid toward the TV: opens the east side of the room
         ("abe-room", "guitar-amp"): (532, 330)}   # into the southeast corner: it blocked the lane above the bed
u_place = []
for room in ("master-bedroom", "abe-room", "hall"):
    for pid, x, y, sc, rot in RAMI["up-" + room]:
        x, y = U_FIX.get((room, pid), (x, y)); u_place.append((room, pid, x, y))
for p in u_layout["placements"]:
    if p["room"] in ("master-bedroom", "abe-room", "hall") or p["id"] == "stairs-flight": continue
    u_place.append((p["room"], p["id"], p["at"][0], p["at"][1]))

def on_face(ax, aw, ay):
    """is this stretch of wall (abs x, width, the room's top y in the new frame) covered by a tall face?"""
    return any(fx <= ax and ax + aw <= fx + fw and fy + fh <= ay <= fy + fh + 16 for fx, fy, fw, fh in u_faces)  # a room may start a 16 px wall below its face
u_items = [("v4_wallface", face), ("f2_floor_v4carpet", Image.open(ART + "beige-carpet-v1.png").convert("RGBA")),
           ("v4u_stairs", Image.open(UP + "stairs-flight-v1.png").convert("RGBA"))]
for k, (x, y, w, h) in F2["frames"].items():
    if k.startswith("f2_floor_bathroom"): u_items.append((k, Image.open(ROOT + "/assets/stage/home/" + F2["atlas"]).convert("RGBA").crop((x, y, x + w, y + h))))
u_used, u_pieces = set(), []
for room, pid, x, y in u_place:
    m = u_man[pid]; key = "v4u_" + pid
    if key not in u_used: u_items.append((key, Image.open(m["file"]).convert("RGBA"))); u_used.add(key)
    vx, vy = U_VIEW[room][0], UY(U_VIEW[room][1])
    w, h = m["size"]
    layer = {"ground": "decal", "wall-mounted": "wall", "over-everything": "over"}.get(m["renderLayer"], "furniture")
    if pid == "north-doorway": y = -h                                                 # Abe's door frame stands in the doorway gap, bottom on his floor line
    elif layer == "wall" and y < -16 and not on_face(vx + x, w, vy): y = -16        # no tall face here: hang it on the thin wall
    fps = m.get("footprints") or []
    fp = None
    if fps:
        x0 = min(f[0] for f in fps); y0 = min(f[1] for f in fps)
        fp = [x0, y0, max(f[0] + f[2] for f in fps) - x0, max(f[1] + f[3] for f in fps) - y0]
    u_pieces.append({"id": pid, "key": key, "at": [vx + x, vy + y], "size": [w, h], "fp": fp,
                     "solid": layer == "furniture" and fp is not None, "layer": layer, "room": room})

items = sorted(u_items, key=lambda kv: -kv[1].size[1])
xo, yo, shelf, u_frames = 0, 0, 0, {}
for k, im in items:
    w, h = im.size
    if xo + w > AW: xo, yo, shelf = 0, yo + shelf + 2, 0
    u_frames[k] = [xo, yo, w, h]; xo += w + 2; shelf = max(shelf, h)
u_atlas = Image.new("RGBA", (AW, yo + shelf))
for k, im in items: u_atlas.paste(im, tuple(u_frames[k][:2]))
U_ATLAS = "v4/house-upstairs/house4-floor2-pieces.png"
u_atlas.save(ROOT + "/assets/stage/home/" + U_ATLAS)
for r in u_rooms.values():
    if r.get("floor"): r["floor"] = "f2_floor_bathroom" if r["id"] == "bathroom" else "f2_floor_v4carpet"
u_size = [F2["size"][0], UY(F2["size"][1])]
floor2 = dict(F2, size=u_size, atlas=U_ATLAS, frames=u_frames,
              base=[dict(b, rect=UR(b["rect"]), floor="f2_floor_v4carpet") for b in F2["base"]],
              rooms=[{"id": r["id"], "rect": r["rect"], "floor": r.get("floor")} for r in u_rooms.values()],
              walls=u_walls, doors=u_doors, pieces=u_pieces, faces=u_faces,
              stairs={"rect": UR(F2["stairs"]["rect"]), "art": "v4u_stairs"},
              wallTex=dict(F2["wallTex"], face="v4_wallface"))
js = open(ROOT + "/src/data/house-v4.js").read()
js += "window.HOUSE_V2.floor2 = " + json.dumps(floor2, separators=(",", ":")) + ";\n"
open(ROOT + "/src/data/house-v4.js", "w").write(js)
print("upstairs", u_size, "| pieces", len(u_pieces), "| atlas", u_atlas.size)

# route check upstairs: from the top of the stairs (the hall side) to every room
W, Hh = u_size
mask = np.zeros((Hh, W), dtype=np.int32)
def ublock(x, y, w, h): mask[max(0, y):max(0, y + h), max(0, x):max(0, x + w)] = 1
for w in u_walls: ublock(*w)
for f in u_faces: ublock(*f)
for p in u_pieces:
    if p["solid"]: ublock(p["at"][0] + p["fp"][0], p["at"][1] + p["fp"][1], p["fp"][2], p["fp"][3])
def flood(n):
    S = np.pad(mask, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    free = (S[n:, n:] - S[:-n, n:] - S[n:, :-n] + S[:-n, :-n]) == 0
    hx, hy, hw, hh = u_rooms["hall"]["rect"]
    start = next(((x, y) for y in range(hy + hh // 2, hy + hh) for x in range(hx, hx + hw - n) if free[y, x]), None)
    seen = np.zeros_like(free); st = [start] if start else []
    if start: seen[start[1], start[0]] = True
    while st:
        x, y = st.pop()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= ny < free.shape[0] and 0 <= nx < free.shape[1] and free[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; st.append((nx, ny))
    return free, seen
uok = True
for rid in ("hall", "master-bedroom", "walk-in-closet", "bathroom", "abe-room", "stairs", "linen", "utility", "abe-closet"):
    x, y, w, h = u_rooms[rid]["rect"]
    n = 96 if rid in ("hall", "master-bedroom", "walk-in-closet", "bathroom", "abe-room", "stairs") else 56   # small rooms: the hero (48 px) must fit
    free, seen = flood(n)
    r = seen[y:y + h - n + 1, x:x + w - n + 1]; f = free[y:y + h - n + 1, x:x + w - n + 1]
    reach = bool(r.any()); pocket = int((f & ~r).sum())
    if not reach: uok = False
    print("  up %-16s gap=%d reached=%s unreachable spots=%d" % (rid, n, reach, pocket))
print("UPSTAIRS ROUTES", "PASS" if uok else "FAIL")
np.save("/tmp/house4u_mask.npy", mask)
