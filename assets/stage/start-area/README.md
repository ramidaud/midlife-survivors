# Lobby and Bullpen vertical slice, V. 1.31.0

This is the playable start area, not the whole campus. Lobby and Bullpen are open at age 40. Other districts wait for Rami to play this slice.

- `layout.json` is the editable assembly: 63 prop instances, 35 desks in five neighborhoods, 18 static coworker placeholders, modular boundaries, non-solid floor stories and two closed promotion gates. Coordinates are local to campus origin (3168,2448).
- `promotions.json` records the future age 40/45/50/55/60 schedule and hidden Archive proposal. Its slice policy holds both age-45 doors closed, even after 45, until destination floors and opening behavior are enabled by Claude.
- `src/data/start-area.js` is the embedded layout and comparison switch. Set `USE_START_AREA=false` and reload for the existing repeating office. Existing stage-props captions and fallback placements remain intact.
- `art-data.js` embeds 28 native prop families for file-safe loading. No source paintings are loaded. Colorway frames are static variants, not animation poses.
- `src/start-area.js` reuses 64px floor tiles, generates modular wall panels, dresses combat floor without collision, adds fitted contact shadows and culls to at most 120 visible fixtures. Every solid joins propGroup with its floor footprint.
- Both promotion gates span the full 224px route and own one navExtraBlockers rectangle each. Shutdown removes only this slice's blockers. Claude owns future opening, door animation and pathing changes.
- The shared Lobby/Bullpen connection is broad and open-plan, with two protected 224px routes. A trial middle partition was removed after an enemy corner-snag test. No navigation algorithm was changed. A separate off-route chase toward the Circle Back island can still hesitate against its edge; see the saved QA trace and handoff for Claude. Protected through-routes remain clear.
- The Archive clue is an ordinary FILES cabinet and lavender binder. It does not open in this slice.
- Coworkers are cropped upper-body static placeholders behind desks, not a Stage 3 animation delivery. Player physics remain 48x52; player art remains 56x60.

Optional authoring tools, no game build step:

```sh
python3 assets/stage/start-area/build-layout.py
python3 assets/stage/start-area/build-art-data.py
python3 assets/stage/start-area/validate-layout.py
```

Edit the Python authoring data if regenerating. Direct JSON changes must also be copied to the embedded JavaScript. Art export instructions live in ../props/README.md. The independent validator checks floor containment, clear openings and connected tour points with padded fixture footprints.

The slice checks births after NAV.fixSpawn because the local flow field cannot validate distant points outside its bounds. Off-floor births relocate to cached reachable floor cells, preferably offscreen, with original spawn timing, enemy stats and attack values preserved.

Test through `tests/start-area-playtest.html?nostats=1`. It disables telemetry before game loading, blocks analytics and Supabase, and uses in-memory saves. The age-50 soak uses a test-only HP guard; the separate 350-enemy test uses HP guards and paused firing to keep all 350 alive. These are rendering/navigation checks, not a balance verdict. Production balance tables are untouched.
