"""Build the big-house interior (Maple Hollow v2, step 2, option C "spread out", Nov 10).

Reads Codex's measured floor plan (assets/stage/home/v2/interior-floor1-v3.png + .json) and writes:
  assets/stage/home/v2/house2-floor1-pieces.png   every piece cut out with the floor around it removed, plus
                                                  floor patches and wall textures
  src/data/house-v2.js                            rooms, walls, doors and where each piece goes, at the new size

The rooms get SX times wider and SY times taller. Furniture keeps its drawn size: a piece against a wall stays
against that wall, anything else keeps its relative spot in the bigger room. Run: python3 tools/build_house_v2.py
"""
import json, os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "assets/stage/home/v2/")
SX, SY = 2.0, 1.5
LO, HI_X, HI_Y = 16, 400, 1370          # the scaled span; outside it, coordinates just shift

plate = Image.open(SRC + "interior-floor1-v3.png").convert("RGBA")
plan = json.load(open(SRC + "interior-floor1-v3.json"))

def tx(x):
    if x <= LO: return x
    if x <= HI_X: return LO + (x - LO) * SX
    return LO + (HI_X - LO) * SX + (x - HI_X)
def ty(y):
    if y <= LO: return y
    if y <= HI_Y: return LO + (y - LO) * SY
    return LO + (HI_Y - LO) * SY + (y - HI_Y)

walls = plan["walls"]
# 16 px walls stay 16 px: an edge that sits on a wall maps through the wall's center line
vx = {}; hy = {}
for w in walls:
    x, y, ww, hh = w["rect"]
    if ww == 16: vx[x] = "L"; vx[x + 16] = "R"
    if hh == 16: hy[y] = "T"; hy[y + 16] = "B"
def ex(x):
    if x in vx: return round(tx(x + 8) - 8) if vx[x] == "L" else round(tx(x - 8) + 8)
    return round(tx(x))
def ey(y):
    if y in hy: return round(ty(y + 8) - 8) if hy[y] == "T" else round(ty(y - 8) + 8)
    return round(ty(y))
def rect(r):
    x, y, w, h = r
    x0, y0, x1, y1 = ex(x), ey(y), ex(x + w), ey(y + h)
    if w == 16: x1 = x0 + 16
    if h == 16: y1 = y0 + 16
    return [x0, y0, x1 - x0, y1 - y0]

rooms = [{"id": r["id"], "src": r["rect"], "rect": rect(r["rect"])} for r in plan["rooms"] + plan.get("zones", [])] # zones (the desk nook) count as rooms
def room_of(cx, cy, box=None):
    """The smallest room that holds the whole piece; if none does, the smallest one holding its center."""
    def pick(test):
        best = None
        for r in rooms:
            if r["id"] == "stairs": continue
            if test(r["src"]) and (best is None or r["src"][2] * r["src"][3] < best["src"][2] * best["src"][3]): best = r
        return best
    if box:
        bx, by, bw, bh = box
        b = pick(lambda q: q[0] - 2 <= bx and q[1] - 2 <= by and bx + bw <= q[0] + q[2] + 2 and by + bh <= q[1] + q[3] + 2)
        if b: return b
    return pick(lambda q: q[0] <= cx <= q[0] + q[2] and q[1] <= cy <= q[1] + q[3])

# ---- the atlas: pack every cut-out on shelves ----
atlas_items = []   # (key, Image)
def add(key, im): atlas_items.append((key, im))

blocked = [f["rect"] for f in plan["furniture"]] + [d["rect"] for d in plan["decals"]] + [w["rect"] for w in walls]
def overlaps(a, b): return a[0] < b[0] + b[2] and b[0] < a[0] + a[2] and a[1] < b[1] + b[3] and b[1] < a[1] + a[3]
def floor_patch(r):
    x, y, w, h = r
    for size in (32, 16):
        for yy in range(y, y + h - size + 1, 4):
            for xx in range(x, x + w - size + 1, 4):
                if not any(overlaps([xx, yy, size, size], b) for b in blocked):
                    return plate.crop((xx, yy, xx + size, yy + size))
    return None
floor_colors = {}; shared_floor = {}
for r in sorted(rooms, key=lambda r: r["id"] != "circulation"):
    if r["id"] == "stairs": continue
    p = floor_patch(r["src"])
    if p is None: continue
    cols = sorted(((n, c) for n, c in p.getcolors(4096)), reverse=True)
    floor_colors[r["id"]] = {c for n, c in cols[:2]}
    # rooms with the same main floor color share one patch (the circulation's planks), so the boards line up
    main = cols[0][1]
    if main in shared_floor: r["floor"] = shared_floor[main]; continue
    add("floor_" + r["id"], p); r["floor"] = shared_floor[main] = "floor_" + r["id"]

# a base floor under the whole house (the plan's floorBase), so no spot is ever bare
base_keys = []
for i, fb in enumerate(plan.get("floorBase", [])):
    probe = room_of(fb[0] + 40, fb[1] + fb[3] - 40)
    key = (probe or {}).get("floor") or next((r["floor"] for r in rooms if r.get("floor")), None)
    base_keys.append({"rect": rect(fb), "floor": key})
for r in rooms:                                   # rooms without a clean patch borrow the room they sit in
    if not r.get("floor") and r["id"] != "stairs":
        x, y, w, h = r["src"]; host = None
        for q in rooms:
            if q is not r and q.get("floor") and q["src"][0] <= x + w / 2 <= q["src"][0] + q["src"][2] and q["src"][1] <= y + h / 2 <= q["src"][1] + q["src"][3]: host = q
        r["floor"] = (host or {}).get("floor") or base_keys[0]["floor"]
        floor_colors[r["id"]] = floor_colors.get((host or {}).get("id"), set())

def cutout(src, cols):
    """Crop a piece and clear the floor pixels touching its edge (flood fill), so it sits on any floor."""
    x, y, w, h = src
    im = plate.crop((x, y, x + w, y + h)).copy(); px = im.load()
    seen = set(); stack = [(i, j) for i in range(w) for j in (0, h - 1)] + [(i, j) for j in range(h) for i in (0, w - 1)]
    while stack:
        i, j = stack.pop()
        if (i, j) in seen or not (0 <= i < w and 0 <= j < h): continue
        seen.add((i, j))
        if px[i, j][3] == 0 or px[i, j] in cols:
            px[i, j] = (0, 0, 0, 0)
            stack += [(i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)]
    return im

pieces = []
def place(f, solid, layer, unit=None):
    x, y, w, h = f["rect"]
    ux, uy, uw, uh = unit or f["rect"]            # a group of touching pieces is placed as one block
    cx, cy = ux + uw / 2, uy + uh / 2
    r = room_of(cx, cy, [ux, uy, uw, uh]) or rooms[0]
    rx, ry, rw, rh = r["src"]; nx, ny, nw, nh = r["rect"]
    if ux - rx <= 6: UX = nx + (ux - rx)
    elif (rx + rw) - (ux + uw) <= 6: UX = nx + nw - ((rx + rw) - ux)
    else: UX = round(tx(cx) - uw / 2)
    if uy - ry <= 6: UY = ny + (uy - ry)
    elif (ry + rh) - (uy + uh) <= 6: UY = ny + nh - ((ry + rh) - uy)
    else: UY = round(ty(cy) - uh / 2)
    X, Y = UX + (x - ux), UY + (y - uy)
    cols = floor_colors.get(r["id"], set()) | {(0, 0, 0, 0)}
    key = "p_" + f["id"]
    add(key, cutout(f["rect"], cols))
    fp = f.get("footprint") or f["rect"]
    pieces.append({"id": f["id"], "key": key, "at": [int(X), int(Y)], "size": [w, h],
                   "foot": [fp[0] - x, fp[1] - y, fp[2], fp[3]], "solid": bool(solid), "layer": layer, "room": r["id"]})

# groups: furniture pieces closer than GAP px join one unit (the galley kitchen, the L sofa, desk + chair)
GAP = 10
fur = plan["furniture"]
def near(a, b): return a[0] - GAP < b[0] + b[2] and b[0] - GAP < a[0] + a[2] and a[1] - GAP < b[1] + b[3] and b[1] - GAP < a[1] + a[3]
# pieces that move together as one block (edit these to change what stays together)
GROUPS = [["cream-sofa-side", "cream-sofa-back"], ["silver-mirror-fireplace", "baby-swing-left", "baby-swing-right"],
          ["desk-by-dining-window", "mesh-desk-chair"], ["white-double-sink", "white-stove-microwave", "oak-trim-worktop"],
          ["magnet-fridge", "galley-right-worktop"], ["garage-workbench"], ["toilet"], ["bath-sink"]]
SKIP = {"desk-drawings"}   # drawn on the plate's floor under the desk; the desk already shows its screens
parent = list(range(len(fur)))
def find(i):
    while parent[i] != i: parent[i] = parent[parent[i]]; i = parent[i]
    return i
ids = [f["id"] for f in fur]
for g in GROUPS:
    js_ = [ids.index(x) for x in g if x in ids]
    for j in js_[1:]: parent[find(j)] = find(js_[0])
units = {}
for i, f in enumerate(fur):
    x, y, w, h = f["rect"]; u = units.setdefault(find(i), [x, y, x + w, y + h])
    u[0], u[1], u[2], u[3] = min(u[0], x), min(u[1], y), max(u[2], x + w), max(u[3], y + h)
for i, f in enumerate(fur):
    u = units[find(i)]; place(f, f.get("solid", True), "furniture", [u[0], u[1], u[2] - u[0], u[3] - u[1]])
# decals ride with the furniture they overlap (a cable under the rig), otherwise they place on their own
for d in plan["decals"]:
    if d["id"] in SKIP: continue
    host = next((units[find(i)] for i, f in enumerate(fur) if near(d["rect"], f["rect"])), None)
    place(d, False, "decal", [host[0], host[1], host[2] - host[0], host[3] - host[1]] if host and d["rect"][1] > 16 else None)
# the stairs keep their drawn art at the top-left of the (bigger) stair room
st = next(r for r in rooms if r["id"] == "stairs")
add("stairs", plate.crop((st["src"][0], st["src"][1], st["src"][0] + st["src"][2], st["src"][1] + st["src"][3])))
# wall textures: a slice of the top wall and of the right wall
add("wall_h", plate.crop((160, 0, 192, 16)))
add("wall_v", plate.crop((400, 300, 416, 332)))

# shelf-pack the atlas
items = sorted(atlas_items, key=lambda kv: -kv[1].size[1])
AW, xo, yo, shelf, frames = 1024, 0, 0, 0, {}
for k, im in items:
    w, h = im.size
    if xo + w > AW: xo, yo, shelf = 0, yo + shelf + 2, 0
    frames[k] = [xo, yo, w, h]; xo += w + 2; shelf = max(shelf, h)
atlas = Image.new("RGBA", (AW, yo + shelf))
for k, im in items: atlas.paste(im, tuple(frames[k][:2]))
atlas.save(SRC + "house2-floor1-pieces.png")

W, H = round(tx(416)), round(ty(1392))
doors = [{"id": d["id"], "to": d["to"], "rect": rect(d["rect"])} for d in plan["doors"]]
out = {
    "note": "Built by tools/build_house_v2.py from interior-floor1-v3 (Codex). Rooms x%g wide, x%g tall; furniture keeps its drawn size." % (SX, SY),
    "size": [W, H], "atlas": "v2/house2-floor1-pieces.png", "frames": frames,
    "base": base_keys,
    "rooms": [{"id": r["id"], "rect": r["rect"], "floor": r.get("floor")} for r in rooms],
    "walls": [rect(w["rect"]) for w in walls], "doors": doors, "pieces": pieces,
    "stairs": {"rect": st["rect"], "art": "stairs"}, "wallTex": {"h": "wall_h", "v": "wall_v"},
}
js = "// GENERATED by tools/build_house_v2.py (do not hand-edit the layout; tweak the script or HOUSE_V2_TWEAKS below).\n"
js += "// Maple Hollow v2 ground floor, option C: the rooms twice as wide, the furniture at its drawn size.\n"
js += "window.HOUSE_V2 = " + json.dumps(out, separators=(",", ":")) + ";\n"
open(os.path.join(ROOT, "src/data/house-v2.js"), "w").write(js)
print("house", W, "x", H, "| pieces", len(pieces), "| atlas", atlas.size)
