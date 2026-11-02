# Stage 2F: Corner Office Energy

Seven districts now include the Executive Wing behind `executive-return`. Original 187 fixtures, 26 workers and five gate records are unchanged. The wing adds a wide reception, visitor chairs, wood-panelled walls, glass corner office, skyline window, oversized desk, putting mat, credenza, portrait and award display. Seventeen placements use existing breakable families. Floors have runners, rugs, papers and coffee rings; the open V8 reserve is non-solid.

Production `PROMOTIONS.openUpToAge` remains **50**. Age-55 Executive and age-60 Wellness doors ship closed. After Rami approves, Claude can raise the cap to **55**. Wellness is not built. Its far-side gate is `wellness-executive`, in the southwest exit of Executive, campus x5152/y1088, 128x224. Each opening remains 224px clear. The reserved Wellness floor and the Conference corridor's 16px separation remain unchanged.

The full assembly has 217 fixtures, 26 workers, 297 wall modules, three curbs and six gates, for 509 physical bodies. Seventy-six protected sections remain at least 224px wide. Executive has an 832x448 combat reserve, a 600px straight charge lane, a 130px drift loop and a clear 220px escape envelope. Floor detail uses the existing 1024px bake and visible fixtures stay capped at 120.

## Isolated review

Open `review-2f.html?nostats=1`. **Open through 55 (test only)** opens the earlier rooms and Executive in this iframe only. Wellness stays closed. Tour buttons show reception, corner office, putting mat, awards and Wellness door. **Explore (no swarms)** enables movement. **Check shipped age-55 cap** uses the real promotion component, from a fresh page before test-opening, to confirm the cap remains 50. Cart buttons exercise automatic registration, cracking and destruction. Reload restores the shipped state.

The harness disables telemetry before loading, blocks Supabase/GoatCounter and uses in-memory saves. `&desktop=1` uses a 1280x800 game frame; `&phone=1` uses 390x844. These are viewport checks, not physical-device benchmarks. Evidence and pathing caveats are in `qa-2f/`. Navigation and spawn algorithms are unchanged; Claude owns their follow-up.

## Authoring

`room_data_2f.py` extends the existing modular assembly. `build-layout.py` writes layout.json and embeds it in src/data/start-area.js; `build-art-data.py` embeds native images. The seven new families, sources and full built-in imagegen prompts are in `../props/batch-2f.json`. The existing crash cart now has three damage states and six debris cells per colorway in `../../breakables/`; its render family remains server_crash_cart and only scan metadata aliases it to crash_cart.

```sh
python3 assets/stage/start-area/build-layout.py
python3 assets/stage/start-area/build-art-data.py
python3 assets/stage/start-area/validate-layout.py
python3 assets/stage/props/build-review-data.py
python3 assets/stage/props/validate-2d.py 2f
python3 assets/breakables/build-review.py
python3 assets/breakables/validate.py
```

The offline validator checks floor footprints, closed/open reachability, protected routes, boss clearances and future Wellness exclusion. It writes qa-paths-2f.js for review controls only. Earlier QA and room authoring files remain available. Optional tools add no runtime build step; USE_START_AREA=false retains the fallback office.
