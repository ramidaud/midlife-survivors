# Stage 2D: Lobby, Bullpen, Parking Lot and Break Room

The original 63 fixtures, 35 desks and 18 coworkers are unchanged. Stage 2D adds 68 prop placements and two static coworkers across the age-45 rooms. All four promotion doors ship closed. Claude owns opening and navigation integration.

- Parking Lot: 27 cars in five paints, broad driving lanes, cart corrals, light poles and three tree islands. Read-on-approach jokes explain the 2014 reserved spot, Honda sticker, parked whiteboard and Dave's boot.
- Break Room: kitchenette/microwave, communal fridge, coffee landmark, two round tables, last cake slice, cat poster and birthday corner. Twenty small-prop placements are ready for Claude's breakable/loot pass. This slice adds no loot rules.
- Doorways and 35 protected route sections retain 224px clear spans. The two age-50 doors lead toward future Server/Conference rooms; those destination floors are not built.
- Floor stories are non-solid and baked into the existing 1024px images. Every solid uses an accurate floor footprint in propGroup. Four owned navExtraBlockers are cleaned up on scene shutdown. Visible fixtures are capped at 120.
- Birth candidates stay inside the current navigation field, clear of solid bodies and floor edges. This avoids NAV's intentionally permissive out-of-field fallback without changing its algorithm.
- Editable assembly: layout.json plus room_data.py/build-layout.py; embedded copy: src/data/start-area.js. The schedule is promotions.json. Native art embeds 38 used families including coworkers and gate jambs. Sources are never loaded at runtime.

## Review and validation

Open `review.html?nostats=1`. This isolated harness blocks Supabase/analytics before game loading and uses in-memory saves. **Open 45 (test only)** disables just the two age-45 blockers in that iframe. It does not modify production or open age-50 doors. Tour buttons jump to landmarks; Explore (no swarms) resumes movement in the isolated iframe; 350-enemy tests use HP guards and paused firing. Restart restores all four closed doors.

Optional authoring tools, no game build step:

```sh
python3 assets/stage/start-area/build-layout.py
python3 assets/stage/start-area/build-art-data.py
python3 assets/stage/start-area/validate-layout.py
python3 assets/stage/props/build-review-data.py
python3 assets/stage/props/validate-2d.py
```

The offline flood check verifies locked rooms remain excluded and every tour point becomes reachable when either age-45 gate is test-opened. The staff corridor links the new rooms behind the gates. QA artifacts live in qa/. The shared prop review compares the 56x60 hero and current 50px Bill at native scale. Set USE_START_AREA=false for the repeating-office fallback.
