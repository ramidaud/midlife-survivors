# Stage 2G: HR Says Relax

The eighth district is Wellness, the last promotion room in a Midlife run. It has warm cork flooring, sage walls, lavender accents, thirteen plants, a massage chair, felt quiet pod, unfinished lighthouse puzzle, zen fountain, SAD lamps, yoga mats and a broken nap pod. The MANDATORY FUN banner and short maintenance signs use the existing chunky pixel font. Gemini Wellness captions supply the longer jokes in the lower third.

## Approved door relocation

Rami approved moving the single age-60 door from the Executive dead end to Wellness's east edge beside Conference. The record is now `wellness-conference`, fromDistrict `conference`, campus x 4960/y 3632, width 128/height 224, clearWidth 224. It retains the PLEASE SEE HR caption and the existing exact-rectangle blocker format. No extra door was added. Production PROMOTIONS.openUpToAge remains **55**, so Wellness ships closed. Claude can raise it to 60 after approval.

The former Executive opening is sealed with a full solid wall. Wellness's west boundary is inside x 3040, leaving the public Conference corridor at x 2800..3024 fully 224px wide, with the earlier 16px gap. An older connector meets the Wellness west edge at y 3632..3856; an explicit 32x224 internal boundary seals that seam so it cannot bypass the age-60 gate. Only the east doorway enters Wellness.

All original 217 fixtures,26 workers and first five gate records are unchanged. The room adds 31 placements, including 19 existing breakables. The full map has 248 fixtures,26 workers,320 wall/partition modules,3 curbs and 6 gates, for 558 bodies. Every one of 84 protected sections passes 224px clearance. Wellness has an 896x448 clear reserve,600px charge lane,130px drift loop and 220px escape envelope. Previous boss-space checks remain intact.

## Isolated review

Open `review-2g.html?nostats=1`. **Check shipped age-60 cap** tests the real promotion component at 60 from a fresh page. **Closed-door collision** physically drives against the still-closed gate and checks nearby navigation. **Spawn probe** can be used there to test locked-room births. **Open through 60 (test only)** then opens the door in this iframe only; tour buttons show the Wellness landmarks. **Explore (no swarms)** enables movement. Reload restores production state.

The review disables telemetry before loading, blocks Supabase/GoatCounter and uses in-memory saves. `&desktop=1` uses 1280x800; `&phone=1` uses 390x844. These are viewport checks, not physical-device benchmarks. Full walking tests follow Lobby → Break Room → Conference → Wellness. The gallery compares native art with the 56x60 hero and Bill at 50px. Evidence lives in `qa-2g/`.

## Authoring and performance

`room_data_2g.py` extends the modular assembly. `build-layout.py` writes layout.json and src/data/start-area.js; build-art-data.py embeds native art. Eight families, selected built-in imagegen sources and full prompts are in `../props/batch-2g.json`. There are three colorways per family, using the shared palette and opaque exact magenta. Existing breakable families are reused; no new health/drop entries were needed.

The 64px cork tile repeats without seams. Floor stories and the four non-solid yoga mat images join the existing 1024px floor bake. Lightweight caption records preserve mat read-on-approach jokes after those images are baked. Other solids use propGroup with measured footprints. Off-screen culling and the 120-visible-prop cap are unchanged. Navigation, spawn selection, promotions, combat and balance files are untouched.

```sh
python 3 assets/stage/start-area/build-layout.py
python 3 assets/stage/start-area/build-art-data.py
python 3 assets/stage/start-area/validate-layout.py
python 3 assets/stage/props/build-review-data.py
python 3 assets/stage/props/validate-2d.py 2g
```

The validator checks closed/open reachability, gate leaks, protected routes, boss clearances, the full Conference corridor and the sealed Executive opening. It writes qa-paths-2g.js for review only. Optional tools add no runtime build step. Earlier room authoring and QA remain available; USE_START_AREA=false retains the repeating-office fallback.
