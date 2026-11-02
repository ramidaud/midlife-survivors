# Start-area QA, V. 1.31.0

All browser game loads used the isolated harness with `?nostats=1`, in-memory storage, TELEMETRY_OFF before load, and blocked Supabase/GoatCounter. No live score or run row was submitted.

- Native PNG checks: `assets/stage/props/checks.json`, `checks-2c.json`, `checks-placeholder.json`.
- Layout: `assets/stage/start-area/checks.json`, connected tour points and clear 224px spans with padded floor footprints.
- `age-50-desktop.json` is the first successful containment run before removing one trial middle partition. `pre-fix-soak.json` retains the original failed off-floor-spawn evidence. Final geometry has 132 solids, not the earlier 133.
- `enemy-route.json` shows the discarded partition corner snag. `enemy-route-final.json` shows the off-route Circle Back edge hesitation, retained for Claude. `protected-route-desktop.json` confirms the authored clear through-route crosses successfully.
- `stress-final-desktop.json`: all 350 actual enemies remained active, no off-floor enemies, roughly 98.6 FPS average / 97.3 minimum in this desktop browser. Six-second rendering/navigation stress, test-only HP guards and paused firing. This is not a low-end physical-phone benchmark.
- `spawn-probe.json`: 1,750 sampled birth requests, zero invalid returned floor cells, two owned blockers.
- Door collision test confirms a closed gate stops the player and an internal through-route can be crossed. Future promotion opening was deliberately not implemented.

The soak moves through the real level on production age/spawn timers, accepts level choices and has a test-only HP guard. It is not evidence that an unassisted fresh-save player can survive to age 50. Enemy stats, attack timing and progression numbers are unchanged in production.

Desktop viewport 1280x800; phone layout viewport 390x844. Screenshots show native scale. Rami's playtest remains necessary for density, feel and humor.

Final geometry: `age-50-final-desktop.json` and `age-50-final-phone.json` both reached 50 at Tax Bracket 0, with zero off-floor enemies, console errors or analytics requests. These tests ran at production age speed with HP guards. Peak natural crowds were 126 desktop and 136 phone-layout. The six-second phone-layout crowd test started at 350 and ended at 364 after an existing event; minimum 98.0 / average 98.6 FPS in this desktop browser. `normal-health-smoke.json` adds a 47-second merged-build run with real 12 HP and no guard.

Both endurance runs began before the concurrent iPhone fix was merged; no slice geometry or combat behavior changed after they began. The merged build received an additional normal-health smoke, restart/fallback and door collision check.
