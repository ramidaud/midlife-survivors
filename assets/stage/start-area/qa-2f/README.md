# Stage 2F review evidence, V. 1.40.0 build102

Final runtime JSON uses desktop1280x800 and phone390x844 game frames in the local isolated review. Telemetry is disabled before game loading, Supabase/GoatCounter are blocked, saves are in memory, and all pages use ?nostats=1. Zero external score/run/analytics requests. The phone check is browser viewport emulation, not a physical-device benchmark.

- Both full player walks pass Lobby → Parking → Server → Executive in about34 seconds using real game movement and collision. Review controls multiply the test joystick vector to clear its dead zone and sample every40ms. Earlier runs with a seven-pixel arrival threshold and unscaled joystick could stop/oscillate inside the ten-pixel dead zone. That was a test-controller issue, not a game movement change.
- Both Executive doorway enemy pursuits pass with no off-floor actors. Gates test-open through55 only; Wellness remains closed. Production cap50 is separately tested at age55 and keeps55/60 closed, with exact blocker identity preserved.
- Both spawn probes pass1504 resolved requests: zero overlaps, off-floor body corners, locked-room births or bad reachability results. Tests use full Reply-All body bounds.
- Both six-second350-enemy tests keep all350 real physics/navigation/animation actors on the floor, with HP guards and firing paused. Desktop average98.94/min98.24FPS; phone average99.30/min98.88FPS on this browser. Peak visible fixtures41 desktop,26 phone, below120. These are rendering/traversal checks, not balance or physical-device benchmarks.
- Crash cart automatically registers under crash_cart while retaining server_crash_cart as its art family. Intact→cracked→broken keeps96x112 frames, position and bottom-center origin. Breaking disables its72x42 body, emits six debris pieces and adds three gem pickups. All runtime check error arrays are empty.
- Native gallery comparisons use hero56x60 and Bill50px. Seven new families show at1x with no phone page overflow; wide comparison canvases scroll within cards. Scale captures include the desk, hero and Bill. Native palette/grid/outline checks and full layout checks are separate machine-readable files one directory up and under props/breakables.

## Pathing observation for Claude

The Executive doorway follow test passes. The separate **Desk detour** does not: a Bill starting at campus(7152,336), with the player at(7152,608), moves down to approximately(7152,368) and remains against the desk's north edge for the12-second trace. This reproduces on both viewports after pulling25310f8. The desk has its measured184x68 floor footprint; the surrounding floor is open. See detours traces in final-runtime JSON. Navigation and spawn code were deliberately left unchanged. The full player walk succeeds; no broader pathing fix is claimed.

## Files

`*-final-closed.json`: real promotion ceiling/component check. `*-final-walk.json`: complete corrected player walk. `*-final-runtime.json`: doorway, detour, spawn, stress and cart evidence. Screenshots show the finished rooms and native scale review. `props-phone.html` embeds the isolated gallery at390x844 and provides desk/hero comparison buttons.

The final decorative trophy was lowered10px to sit on the cabinet top rather than float. This changes no solid footprint or route. Final screenshots include that placement.
