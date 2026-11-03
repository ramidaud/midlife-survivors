#!/usr/bin/env python3
"""Build devlog/data/stats.json for the devlog sidebar.

- builds: every game version and the moment it was committed (from the git history of src/data/version.js)
- posts: when each devlog post was first committed (shows how fast posts follow builds)
- play: aggregate play stats copied from devlog/data/play-stats.json (Claude refreshes it from Supabase; no personal data)

Run from the repo root:  python3 devlog/scripts/build_stats.py
"""
import json, re, subprocess, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parents[2]
def git(*a): return subprocess.run(["git", *a], cwd=ROOT, capture_output=True, text=True).stdout

builds, seen = [], set()
for line in git("log", "--reverse", "--format=%H %cI", "--", "src/data/version.js").splitlines():
    sha, when = line.split(" ", 1)
    src = git("show", f"{sha}:src/data/version.js")
    m = re.search(r'version:\s*"([\d.]+)"', src)
    if not m or m.group(1) in seen: continue
    v = m.group(1); seen.add(v)
    t = re.search(r'codename:\s*"([^"]*)"', src)
    first = re.search(r'changelog:\s*\[\s*\{[^}]*?highlights:\s*\[\s*"((?:[^"\\]|\\.)*)"', src, re.S)
    builds.append({"v": v, "at": when, "title": t.group(1) if t else "",
                   "note": (json.loads('"' + first.group(1) + '"') if first else "")[:140]})

posts = {}
for f in sorted((ROOT / "devlog/posts").glob("*.md")):
    first = git("log", "--diff-filter=A", "--format=%cI", "--", str(f.relative_to(ROOT))).strip().splitlines()
    if first: posts[f.stem] = first[-1]

play = {}
pf = ROOT / "devlog/data/play-stats.json"
if pf.exists(): play = json.loads(pf.read_text())

out = {"generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
       "firstCommit": git("log", "--reverse", "--format=%cI").splitlines()[0],
       "builds": builds, "posts": posts, "play": play}
(ROOT / "devlog/data/stats.json").write_text(json.dumps(out, indent=1))
print(f"stats.json: {len(builds)} builds, {len(posts)} posts, play stats {'yes' if play else 'no'}")
