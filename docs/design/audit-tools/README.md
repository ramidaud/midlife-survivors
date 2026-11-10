# Audit capture tools (Nov 10, 2026)

How the UI audit screenshots were made. Kept so the same shots can be re-taken after each migration step.

- `harness.py`: launches headless Chromium, serves Phaser and the two fonts from local copies, and blocks every other network request (stats, sign-in, leaderboard).
- `capture.py <size>`: the main pass. Sizes: `phone`, `ipadp`, `ipadl`, `desk`.
- `fix.py`, `fix2.py`, `fix3.py`: re-takes of timing-sensitive rows (cards, chips, the boss moment) that wait for the element to appear.
- `supp.py`: the sound nudge and HUD measurements.
- `page-build.py` + `page-data.py`: build `ui-audit-2026-11.html` and `.md` from the notes.

To run: serve the repo with `python3 -m http.server 8765`, `npm i phaser@3.80.1 marked@4.3.0 @fontsource/silkscreen @fontsource/atkinson-hyperlegible` into `audit-work/vendor`, then run the scripts. Paths inside the scripts point at `./audit-work`; adjust if needed. The game is always opened with `?nostats=1` and nothing is ever posted.
