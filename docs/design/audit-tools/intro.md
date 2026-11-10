# UI audit, November 2026 (V. 2.25.0, build 327)

**Summary:** I ran the game on a phone, an iPad both ways, and a desktop, and photographed {{TOTAL}} surfaces at each size ({{SHOTS}} screenshots). Each piece is well made. They were built one at a time, so each one chose its own spot, shape and volume, and nothing decides which one gets to speak. That is why it is hard to know where to look.

- **Visual version (with every screenshot):** https://claude.ai/artifact/UH1Uc4GaGXHiwsmB9sq8a7 (the "Midlife Survivors UI Audit" artifact). Page source: `docs/design/ui-audit-2026-11.html`.
- **Screenshots:** `docs/design/audit-shots/<size>/` where size is `phone` (390x844), `ipadp` (820x1180), `ipadl` (1180x820), `desk` (1440x900).
- **Capture scripts:** `docs/design/audit-tools/` (Playwright, stats and leaderboard blocked, nothing posted).
- **Scope:** audit only. No game code was changed.

## Counts
| What | Count |
|---|---|
| Different containers for a message during a run | 11 |
| Font sizes in the game's CSS | 30 (most between 8 and 13 px) |
| Corner radii | 12 |
| Stacking layers (z-index values) | 29 |
| Screen-width breakpoints | 13 (480 to 1800 px) |
| Files in `src/` that inject their own styles | 16 |
| Messages in a typical office run (Grok's model) | about 110, plus 31 pausing menus |

## Measured on a 390x844 phone
- HUD: y 0 to 112. Pause and sound buttons: 36x36 px (touch minimum is 44).
- Minimap: x 212 to 384, y 115 to 251.
- Center flash: y 226 to 279. Errand, key hunt and beat strip: y 293 to 337. Hero: about y 385 to 450.
- Lower third: y 773 to 826 (where the thumb rests).
- **Bug:** `--ms-nav-h` stays at 57px during a run while the site nav is hidden, so every in-run element positioned from it (minimap, chips, briefing, catch card) sits 57 px lower than its CSS says.
- Chips and the minimap draw above level-up, chest and shop menus. They only hide for the pause menu.

## Worth keeping
- The lower third: one bar, a color-coded label, already queued. It should become the main voice.
- The cream memo strip and the devlog's reading sizes.
- The Spotlight band. It has the most character and needs a smaller job.
- The level-up cards, and the bonus chest as a full-screen moment.
- The title key art and one big PUNCH IN on a phone.

# Every surface
