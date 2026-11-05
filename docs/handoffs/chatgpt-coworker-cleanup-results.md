# Coworker cleanup results

The Sprite Board counts changed pixels between successive frames, including the wrap from frame 8 to frame 1. Counts below are means of those eight comparisons. Percentages divide each changed-pixel count by the current frame's painted area, then take the highest transition in each row.

| Coworker | Working mean pixels | Working peak | Idle mean pixels | Idle peak |
| --- | ---: | ---: | ---: | ---: |
| dozer | 608.9 → 36.0 | 47.0% → 4.1% | 503.8 → 1.0 | 64.0% → 0.4% |
| email | 504.5 → 23.5 | 48.2% → 3.4% | 410.2 → 2.8 | 58.2% → 0.8% |
| intern | 550.5 → 35.5 | 54.8% → 4.3% | 635.2 → 1.0 | 72.4% → 0.2% |
| mute | 459.1 → 32.5 | 44.8% → 4.2% | 554.1 → 11.5 | 70.8% → 3.5% |
| retiring | 653.2 → 34.5 | 46.5% → 3.9% | 615.0 → 2.8 | 79.3% → 0.6% |
| salad | 734.0 → 40.0 | 58.7% → 4.7% | 780.6 → 5.8 | 84.4% → 1.4% |

All working transitions are below 10% and all idle transitions are below 12%. The new loops average 1.7–2.4% for seated work and 0.1–1.1% for standing breath. A flood fill from the frame edges found zero enclosed magenta pixels in all 336 frames. The magenta review also checks open seams and shows the original spaces between the chair spokes.

[Sprite Board CHANGED PIXELS](img/coworker-cleanup-diff-v2.png) · [Magenta pose check for all six](img/coworker-cleanup-magenta-v2.png)

The 1280×800 and 390×844 reviews used a temporary copy of the Sprite Board catalog pointing to the v2 sheets. COWORKERS, MAGENTA, CHANGED PIXELS and ALL CARDS → WORKING then IDLE were checked. Both viewport sizes produced the same 96 v2 counts.

The twelve keyed PNGs and 42 row previews live in `assets/stage/coworkers/world/`. Working uses 180 ms, personal bits 160 ms, walking 120 ms and idle 240 ms. Consecutive identical GIF poses share their combined duration. Standing contact uses local y56, so the two standing origins should become `56/60` when Claude switches the runtime to the v2 sheets. The seated anchor remains `63/64`. Key exact magenta to transparent before placing the sprites. The art carries no monitor layer, so working motion lives in the hands over the keyboard.
