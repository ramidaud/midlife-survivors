#!/usr/bin/env python3
"""Builds tools/sprite-catalog.js for the sprite dashboard (tools/sprites.html).
Reads the art manifests plus a few sheets whose timing lives in the game code. Re-run after new art lands:
    python3 tools/build_sprite_catalog.py
"""
import json, glob, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
cat = []
def size(p): return Image.open(p).size
def add(group, name, file, cw, ch, anims, note=""):
    if not os.path.exists(file): return
    W, H = size(file)
    cat.append({"group": group, "name": name, "file": file, "cw": cw, "ch": ch, "cols": W // cw, "rows": H // ch,
                "anims": [a for a in anims if a["frames"]], "note": note})
def row(r, n, cols=8, start=0): return [r * cols + start + i for i in range(n)]

# Heroes: game timing from src/world-art.js (walkFrameMs 95, breathMs 320, fidgetFrameMs 170)
HEROES = {"The 9-to-5er": "office-worker-walk-56x60-v3", "The Soccer Dad": "soccer-dad-walk-56x60-v3",
          "The Grad Student at 45": "grad-student-walk-56x60-v3", "The Coldwar Cowboy": "cold-war-cowboy-walk-56x60-v4"}
for name, f in HEROES.items():
    add("Heroes", name, f"assets/characters/{f}.png", 56, 60, [
        {"name": "walk down", "frames": row(0, 8), "ms": 95}, {"name": "walk up", "frames": row(1, 8), "ms": 95},
        {"name": "walk left", "frames": row(2, 8), "ms": 95}, {"name": "walk right", "frames": row(3, 8), "ms": 95},
        {"name": "idle (breathing)", "frames": row(4, 4), "ms": 320}, {"name": "fidget", "frames": row(4, 4, start=4), "ms": 170}])
# Lounge staff (same layout; README: walk rows, then counter + idle)
for name, f in {"TJ": "intern-tj-v2", "Derek": "intern-derek-v2"}.items():
    add("Friends", name, f"assets/characters/{f}.png", 56, 60, [
        {"name": "walk down", "frames": row(0, 8), "ms": 95}, {"name": "walk up", "frames": row(1, 8), "ms": 95},
        {"name": "walk left", "frames": row(2, 8), "ms": 95}, {"name": "walk right", "frames": row(3, 8), "ms": 95},
        {"name": "counter", "frames": row(4, 4), "ms": 240}, {"name": "idle bit", "frames": row(4, 4, start=4), "ms": 240}])
# Office coworkers: src/start-area.js (seated: working 180 ms, personal bit 160 ms; standing idle 240 ms)
for f in sorted(glob.glob("assets/stage/coworkers/world/coworker-*-seated-v2.png")):
    who = f.split("coworker-")[1].split("-seated")[0]
    add("Coworkers", f"{who} (seated)", f, 72, 64, [{"name": "working", "frames": row(0, 8), "ms": 180}, {"name": "personal bit", "frames": row(1, 8), "ms": 160}])
    st = f.replace("-seated-", "-standing-")
    add("Coworkers", f"{who} (standing)", st, 56, 60, [{"name": "idle", "frames": row(4, 8), "ms": 240},
        {"name": "walk down", "frames": row(0, 8), "ms": 95}, {"name": "walk right", "frames": row(3, 8), "ms": 95}])
# Enemies v2
m = json.load(open("assets/enemies/manifest-v2.json"))
for a in m["assets"]:
    for g in a.get("groups", []):
        pass
    add("Enemies", a["name"], "assets/enemies/" + a["file"], a["size"], a["size"],
        [{"name": g["name"].lower(), "frames": g["v2"], "ms": a.get("v2DelayMs", 90)} for g in a.get("groups", [])])
# Bosses
for mf in ["assets/bosses/manifest.json"]:
    for a in json.load(open(mf))["assets"]:
        an = [{"name": k, "frames": v["frames"], "ms": v.get("delay", 160)} for k, v in a.get("animations", {}).items()]
        add("Bosses", a["name"], "assets/bosses/" + a["file"], a["frame"][0], a["frame"][1], an)
fl = json.load(open("assets/bosses/manifest-full-life-v1.json"))
for a in fl["bosses"] + [fl["fatherTime"]]:
    an = [{"name": k, "frames": v["frames"], "ms": v.get("ms", 160)} for k, v in a.get("animations", {}).items()]
    add("Bosses", a["name"], "assets/bosses/" + a["file"], a["cell"][0], a["cell"][1], an)
kn = json.load(open("assets/bosses/manifest-knockdown.json"))
add("Bosses", "Knockdown poses (one per boss)", "assets/bosses/boss-knockdown-v1.png", kn["cell"][0], kn["cell"][1],
    [{"name": "all poses (stills)", "frames": list(range(kn["columns"] * kn["rows"])), "ms": 700}], "Stills, cycled slowly so you can compare them.")
bk = json.load(open("assets/bosses/manifest-bonk.json"))
add("Effects", "Wall bonk crack", bk["crack"]["file"], 48, 48, [{"name": "variants (stills)", "frames": [0, 1, 2], "ms": 700}])
dz = bk["dizzy"]
add("Effects", "Dizzy stars", dz["file"], 16, 16, [{"name": k, "frames": v["frames"], "ms": v.get("frameMs", 100)} for k, v in dz["animations"].items()])
# Weapons
lw = json.load(open("assets/weapons/manifest-loadout-v1.json"))
for s in lw["sprites"]:
    an = [{"name": a["name"], "frames": [a["row"] * s["columns"] + i for i in range(a["frames"])], "ms": a.get("ms", 600)} for a in s.get("animations", [])]
    if not an: an = [{"name": "frames", "frames": list(range(s["columns"] * s["rows"])), "ms": 140}]
    add("Weapons", s.get("displayName", s["id"]), "assets/weapons/" + s["file"], s["cell"][0], s["cell"][1], an)
for f, s in json.load(open("assets/weapons/manifest-lounge-weapons-v1.json"))["sheets"].items():
    an = [{"name": a["id"], "frames": a["frameIndices"], "ms": 600, **({"durs": a["frameDurationsMs"]} if a.get("frameDurationsMs") else {})} for a in s.get("animations", [])]
    if not an: an = [{"name": "frames", "frames": list(range(s["columns"] * s["rows"])), "ms": 600}]
    add("Weapons", f.replace("-v1.png", "").replace("-", " "), "assets/weapons/" + f, s["cellWidth"], s["cellHeight"], an)
# UI
for f, s in json.load(open("assets/ui/manifest-retire-party-v1.json"))["sheets"].items():
    add("UI", "Retirement party (" + s["layout"] + ")", "assets/ui/" + f, s["cellWidth"], s["cellHeight"], [{"name": "loop", "frames": s["frameIndices"], "ms": s["frameDurationMs"]}])
rm = json.load(open("assets/enemies/manifest-remains.json"))
add("Effects", "Defeat remains", "assets/enemies/remains-v1.png", rm["cell"][0], rm["cell"][1],
    [{"name": "all scraps (stills)", "frames": list(range(rm["columns"] * rm["rows"])), "ms": 400}])

with open("tools/sprite-catalog.js", "w") as out:
    out.write("// Generated by tools/build_sprite_catalog.py. Don't edit by hand; re-run the script.\nwindow.SPRITE_CATALOG = ")
    json.dump(cat, out, indent=0)
    out.write(";\n")
from collections import Counter
print(len(cat), "sheets:", dict(Counter(c["group"] for c in cat)))
