# Stage 2E: Server Room and Conference Rooms

The six-district slice now includes Server Room behind `server-return` and three glass Conference pods behind `conference-return`. The original four districts retain their exact 131 props, twenty workers and four gate records. Stage 2E adds 56 placements and six seated placeholders, with 25 placements from the existing smashable families.

- Server: nineteen racks with blinking blue/teal status lamps, cable waterfall, offline rack and lamp, ocean pot, crash cart and seven existing breakable props. The center has a 768x672 clear reserve.
- Conference: Synergy, Bandwidth and Alignment have native long tables with starfish speakerphones, 224px glass door gaps, and at least 224px on both sides of every table. The approach wraps south of the reserved Wellness plot. A broad shared hallway and 736x704 combat reserve accommodate the Mortgage rings and V8 drift. Eighteen smashable fixtures dress the approach and room bays.
- Five gate records preserve rectangle object identity. The age-45 promotion system is unchanged. `PROMOTIONS.openUpToAge` stays **45**, so age-50 and age-55 doors remain closed. After room approval Claude can set it to **50**, keeping Executive access at 55 closed.
- The new `executive-return` uses the existing 128x224 closed-door format at the Server far side. Its sign and approach caption explain age 55. Future Executive floor is not built.
- Shared floors repeat at 64px; paint, cable covers, rugs and floor litter are non-solid and baked by the existing 1024px floor-image pass. Glass walls and every solid fixture join propGroup with floor footprints. Visible props remain capped at 120. The camera includes extra top margin so tall north-wall racks remain visible.
- The crash cart is new art and currently structural. Claude's breakable scan already recognizes all 25 placements from existing families; cart damage art/registration is a later task. No breaking, loot or boss-attack rules changed.

## Review

Open `review-2e.html?nostats=1`. Use **Open through 50 (test only)**, choose a room, then **Explore (no swarms)**. Executive remains closed. These controls affect only the isolated review iframe. **Check shipped age-50 cap** tests the unchanged real promotion system from a fresh scene, without test-opening doors first. Restart restores the scene.

The harness blocks Supabase/analytics before game loading and uses in-memory saves. `?desktop=1` fixes the game frame at 1280x800; `?phone=1` fixes it at 390x844. Walking tests use real movement along validated routes. Stress tests use 350 real physics/navigation actors with HP guards and firing paused. Evidence lives in `qa-2e/`.

## Data and native art

`layout.json`, `room_data_2e.py` and `build-layout.py` author the assembly; `src/data/start-area.js` embeds it for the no-build game. `art-data.js` embeds 48 used native families, never generated source paintings. The five new art families and full built-in imagegen prompts are `../props/batch-2e.json`; the gallery is `../props/review.html`. Longer jokes use Gemini Set A; Alignment's chair count was generalized to match the six-chair prop.

```sh
python3 assets/stage/start-area/build-layout.py
python3 assets/stage/start-area/build-art-data.py
python3 assets/stage/start-area/validate-layout.py
python3 assets/stage/props/build-review-data.py
python3 assets/stage/props/validate-2d.py 2e
```

The validator checks all 66 protected route sections, exact locked/open connectivity, furniture footprints and a full 328px escape circle in both boss spaces. This includes ring radius260, half-thickness16, hero half-body26 and its outer extent26. It also authors `qa-paths-2e.js` for the review only. Optional authoring tools do not add a game build step. `USE_START_AREA=false` retains the repeating-office fallback. Earlier Stage 2D evidence stays in `qa/`.
