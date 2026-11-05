# Defeat art v1

Art-only delivery, Nov 4, 2026 (Codex). Native remains, seven static comic knockdowns and an optional blank ink plate replace the visual placeholders when Claude wires them in. No gameplay code or version changes.

## Enemy remains

`../enemies/remains-v1.png` is **96x200**, three columns by ten rows of **32x20**. Row order: bill, lateFee, spamCall, snackAttack, backTwinge, officeGossip, threeAmThought, calendarInvite, groupChat, mathWorksheet. Each row has three distinct arrangements, not animation. Frame index is `row*3+variant`. The [remains manifest](../enemies/manifest-remains.json) maps every enemy and sets suggested tint to **none**.

The tiny piles are intentionally sparse, with at most 29 painted pixels per cell, including outlines. They sit within the middle of the cell with clear padding. Paper, russet stubs, slate phone bits, pink/orange crumbs, cream heat patches, arrow printouts, lavender wisps, calendar corners, popped bubbles and graph-paper shreds retain their own colors. The wisp has checker-dither holes; all stored pixels are fully opaque, never semitransparent. Existing runtime duration/fading/pooling remains Claude's responsibility.

## Boss knockdowns

`boss-knockdown-v1.png` is **1008x152**, one row of seven **144x152** cells. Order:

| Frame | Boss |
| --- | --- |
| 0 | performanceReview |
| 1 | mortgageRefinance |
| 2 | midlifeCrisis |
| 3 | goldWatch |
| 4 | hoaPresident |
| 5 | retirementBoss |
| 6 | pickleballChamp |

Each is a new flattened/dazed pose, with small stars, using the existing boss's identity. The clipboard reclines, the house and filing cabinet topple, the V8 is belly-up, the watch lies face-up, and the HOA President and athlete sprawl on their backs. Bodies and belongings stay intact. No gore or injury marks. Ground line is **y148**, anchor **(72,148)**, origin **(0.5,148/152)**. Preserve full cells; do not auto-trim or apply an extra boss scale multiplier. The [knockdown manifest](manifest-knockdown.json) maps keys and references. Every existing boss sheet remains untouched.

## Blank stamp

`../ui/stamp-plate-v1.png` is **48x24**, **8px corners**. Russet ink with slightly irregular corners; horizontal/vertical stretch bands are constant to avoid seams. Its entire x8..39/y8..15 center is empty magenta. [Stamp metadata](../ui/stamp-plate-v1.json) has the slice values. Claude overlays defeat words; no text is baked into the art.

## Format and review

All production PNGs use the requested twelve colors plus opaque exact **#FF00FF** key background. No background shadows, blur, antialiasing, readable words or brands. Key magenta first, use nearest-neighbor filtering, and use final art colors without tinting.

[Review page](review-defeat-v1.html) shows each boss next to its original pose at 1x, every remains row at 1x/2x, a 60-pile floor preview and the blank stamp. `knockdown-check-v1.png` and `../enemies/remains-check-v1.png` are labeled QA boards only. The hero is included for scale. No game, analytics or leaderboard runs are loaded by the review page.

Built-in imagegen produced the studies using the brief's JSON prompt template. [Full prompts and selected sources](defeat-prompts-v1.json) are saved, followed by native pixel cleanup, uniform scaling, exact palette and key export. Unpainted source edge padding was removed before normalizing floor anchors; sparse wisp occupancy was preserved before checker-dithering. Generation sources are not runtime assets and remain outside the repo.

Run `python3 assets/bosses/validate-defeat-v1.py` from the repo root. It checks grids, palette/background, debris budget and distinctness, wisp holes, boss ground lines, blank stamp center and stretch seams. Results are saved in `checks-defeat-v1.json`.
