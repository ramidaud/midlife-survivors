# ChatGPT brief: The Gold Watch, the final boss (Nov 3, 2026)

Thanks for the HR Exit Interview art. It's live in V. 1.72.0. Next job: the art for Midlife mode's **final boss, The Gold Watch** (plan: `docs/handoffs/final-boss-gold-watch.md`).

## Who it is
A giant gold pocket watch, the classic retirement gift, except it's ticking **down**. Warm cream face, roman numerals drawn as simple tick marks (no readable numbers or letters), black hands, a gold chain that trails behind it, a small winding crown on top. It has a face: two little eyes in the dial and a smug, patient smile. It floats slightly above the floor with a soft shadow. Funny and a little ominous, never scary or gory.

## 1. Boss sheet (same format as the other three bosses)
`assets/bosses/boss-gold-watch-v1.png`, **576×456: four columns × three rows of 144×152 frames**, exact magenta #FF00FF background, foot point (72,148), at least 4 px of clear margin, native pixel scale like `boss-midlife-crisis-v8-v1.png`.
| Frames | Pose |
|---|---|
| 0–5 | Float and tick: a gentle bob, the chain swings, the second hand ticks around |
| 6–7 | Wind-up: the crown spins, eyes narrow, a glow builds at 12 o'clock |
| 8–9 | Attack: hands thrust outward, the bell on top rings, small motion lines |
| 10 | Hurt: glass cracks, eyes squint |
| 11 | **Stopped:** the hands rest at 5:00, eyes closed, content (plays when you beat it) |

## 2. Attack art (transparent PNGs, hard alpha)
- `assets/bosses/gold-watch-minute-hand-v1.png`: a long hand segment, **32×192**, pointing up, pivot at the bottom center. Black with a gold edge. The game rotates it.
- `assets/bosses/gold-watch-hour-hand-v1.png`: **48×128**, thicker, same pivot.
- `assets/bosses/gold-watch-gear-v1.png`: **4 frames of 24×24** in one row (96×24), a small spinning brass gear.
- `assets/bosses/telegraph-gold-watch-v1.png`: a floor decal like the other bosses' telegraph markers, **256×128**, a faint clock face of tick marks in cream/gold on transparent.

## 3. Kill screen mugshot
`assets/enemies/mugshots/gold-watch-mugshot-v1.png`, **384×96, four 96×96 frames at 200 ms**, the same smug style as the other mugshots (it taps its own glass, winks, and the hands click forward).

## 4. Keepsake
`assets/ui/kill-screen/gold-watch-keepsake-v1.png`, **64×64**, the watch stopped at 5:00 and resting on a small velvet box. It shows on the retirement screen if you beat it.

## Style
The same pixel style and palette as the bosses and key art: crisp 16-bit pixel art, warm upper-left light, gold #D9A441 and khaki #D3B78D for the case, cream #FFF0CF dial, navy #171C35 outlines, coffee orange #EF9347 highlights, tie red #C45C4B for a single accent. **No text, letters or numbers.**

## Also include
Preview GIFs for the sheet (float, wind-up and attack, stopped), the gear and the mugshot, and a check image of the boss next to the V8 and the 9-to-5er at 1× and 2×. A short README with the frame map.

## When done
Pull first (`git stash && git pull`). Commit art and docs only, push to main, and log it in `docs/handoffs/chatgpt-changes.md`. Claude builds the fight.
