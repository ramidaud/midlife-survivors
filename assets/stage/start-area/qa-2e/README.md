# Stage 2E validation (Codex, Nov 2, 2026)

## What passed

- Six-district assembly, 187 props, 26 static coworkers, 264 boundary/glass panels, three curb islands and five doors. Original 131 prop placements, twenty workers and first four gate records are unchanged. All 66 protected route sections retain 224px clearance.
- Offline padded flood: Lobby/Bullpen reachable at 40, Parking/Break at 45, Server/Conference only when age-50 doors are test-opened. Executive stays closed. Every tour stop is connected. The Conference approach wraps around the future Wellness footprint, with no new floor inside that plot.
- Both boss centers admit a 328px clear circle: Mortgage radius260 + half-thickness16 + player half-body26 + its outer extent26. V8 radius130 fits comfortably. Source tuning and attack code are unchanged.
- `final-phone-walk-*` records V. 1.38.0 / build97 with the final 449-body geometry: actual movement from Lobby through Parking into Server and from Lobby through Break into Conference. Both passed, about 38 and 40 seconds in this browser. Earlier desktop walks also passed; the earlier Conference trace precedes the south-wrap revision. Final desktop Conference recheck is recorded separately.
- Entrance/detour traces cover both age-50 doors, the Conference hall, a server rack and a meeting table. `phone-entrances.json` uses the earlier straight Conference approach; final entrance results supersede its Conference-door trace.
- Spawn probes cover the full expanded bounds, then instantiate real Reply-All enemies and compare their physics boxes with floor edges and solid bodies. Reports record probe counts and separate overlap/off-floor/closed-room counters.
- Six-second stress tests use 350 actual animated physics/navigation enemies, with player/enemy HP guards and firing paused. These are rendering/traversal checks, not balance tests or physical phone benchmarks.
- Desktop game frame 1280x800 and phone game frame 390x844 run inside explicitly sized iframes. The native prop gallery is reviewed separately beside the 56x60 hero and 50px Bill. Wide comparison canvases retain 1x pixels and scroll inside phone cards.
- All review runs use ?nostats=1, preload TELEMETRY_OFF, in-memory saves, removed GoatCounter and blocked Supabase/analytics fetches. No leaderboard submissions or run records.

## Existing runtime issue outside this job's allowed files

A forced full-game jump to age50 produced `Cannot read properties of null (reading depth)` at **src/enemy-art.js:142**. The shadow update is conditional on record.shadow, but its following depth read is unconditional. Shadowless enemies such as 3 AM Thought therefore expose the error. The file is unchanged from main and was not edited under the room-only restriction. `known-ghost-renderer-error.json` saves the stack and the correct gate state from that run. `production-cap.json` is the first failed full-age-jump run, not a clean runtime result.

`production-cap-controlled.json` separately tests the real `Promotions.update` at age50 while the rest of gameplay is paused. It confirms the existing cap 45 opens only age45 doors and retains the age50/55 bodies and blocker identity, with no errors. It is a gate-component check, not evidence of an error-free full run at age50. Ordinary room checks and four-species crowd tests run without that unrelated shadowless-enemy path. Claude should guard the depth access before later-age full-run testing.


Final crowd results: all four Server/Conference tests retained all 350 actors, zero off-floor enemies and no room-test errors. Desktop averages 99.8/99.5 FPS; phone-layout averages 99.4/99.3 FPS in this browser. Final screenshots include the north camera margin added to keep tall rack tops visible; geometry/footprints are unchanged by that camera-only adjustment. Full-size game frames and source prompts/native scale evidence are retained beside this note.

The final expanded-bounds closed-map checks resolve all 1504 birth requests safely on desktop and phone, with all five initial doors closed and no runtime errors. Shipped cap 45 was also checked separately using the real promotion updater; age 50 and 55 remain closed.
