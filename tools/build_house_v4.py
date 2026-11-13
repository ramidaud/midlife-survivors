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
layout = json.load(open(DEL + "mockups/room-layout.json"))
living = json.load(open(ROOT + "/docs/plans/house-layout/placements-round2.json"))["rooms"]["living"]["items"]
REPLACED = {"living", "dining", "downstairs-desk-nook", "kitchen", "entry"}
keep = [p for p in H2["pieces"] if p["room"] not in REPLACED and p["id"] != "abstract-painting"]  # the old hallway painting: Codex repainted it for the dining wall

# Rami's living room (round 2), with the route nudges; the toy bin moves off the doorway's approach
LIVING_FIX = {"twins-toy-bin": (520, 20)}
# the dining wall swap (option 1): desk + shelves to the left, painting to the right, the moon print over the stairs
DINING_FIX = {"corner-computer-desk": (112, -48), "camera-book-shelves": (124, -144), "mesh-office-chair": (200, -8),
              "abstract-wall-painting": (352, -128), "kids-drawings": (376, -24), "moon-print": (-128, -104)}
placements = []   # (view room id, piece id, x, y) room-relative, in the room's own (old-rect) frame
seen = {}
for it in living:
    x, y = LIVING_FIX.get(it["id"], (it["x"], it["y"]))
    placements.append(("living", it["id"], x, y))
for p in layout["placements"]:
    if p["room"] == "living" or p["id"].startswith("existing-"): continue
    if p["id"] == "window-blinds-west": continue   # the dining room's west side is open to the stairs: no wall to hang it on
    x, y = p["at"]
    if p["room"] == "dining-desk-shared": x, y = DINING_FIX.get(p["id"], (x, y))
    if p["room"] in ("entry", "laundry-closet") and man[p["id"]]["renderLayer"] == "wall-mounted": y = max(y, -28)  # no tall face here
    placements.append((p["room"], p["id"], x, y))
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
    if reach is False: ok = False
    # pockets: free squares in the room that the walk never reaches
    fr = free[max(0, y):max(0, y + h - n + 1), max(0, x):max(0, x + w - n + 1)]
    sn = seen[max(0, y):max(0, y + h - n + 1), max(0, x):max(0, x + w - n + 1)]
    pocket = int((fr & ~sn).sum())
    print("  %-22s reached=%s  unreachable 96px spots=%d" % (rid, reach, pocket))
print("ROUTES", "PASS" if ok else "FAIL")
np.save("/tmp/house4_seen.npy", seen); np.save("/tmp/house4_mask.npy", mask)
