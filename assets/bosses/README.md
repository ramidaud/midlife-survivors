# Three Midlife bosses, Part B

Art only, awaiting Rami's review. Built-in imagegen sources, full prompts and native exports are stored here. No game code, boss values, attack behavior or timing was changed.

[Open the shared animated review](../breakables/review.html#bosses). Every boss appears beside the 56x60 hero and a Bill at the current approximately 50px size. Use Walk, Wind-up, Attack or Hurt, inspect any individual frame, toggle the ground marker, pause and switch between 1x and 2x. Native comparisons fit a 390px phone; 2x views scroll inside their cards.

| Native file | Game key | Planned attack |
| --- | --- | --- |
| boss-performance-review-v1.png | performanceReview | Straight charge |
| boss-30-year-mortgage-v1.png | mortgageRefinance | Compounding-interest shockwave |
| boss-midlife-crisis-v8-v1.png | midlifeCrisis | Drifting loops |

Each boss sheet is **576x456: four columns by three rows of 144x152 frames**. Row-major frames 0-5 are walk, 6-7 wind-up, 8-9 attack, 10 hurt; cell 11 is blank magenta. There are 33 active poses across the three bosses. Individual frame PNGs are included. The V8's six walk frames are a driving/engine cycle, not walking legs.

Each frame shares the foot point `(72,148)`, normalized origin `(0.5, 148/152)`, with at least four pixels of clear outer margin. Six walk poses use a common source scale per boss. Do not auto-trim frames. This is one down-facing three-quarter set; mirror where appropriate. The attack set is stylized pose art, not a simulated trajectory.

**Draw these native 144x152 frames around 1x.** They already replace the old roughly 2.3x boss art. Multiplying them by ENEMY_SCALE.boss again would make them far too large. Claude should preserve/tune the existing physics independently; the art contains no new hit-box or attack-damage values.

## Ground markers

- telegraph-performance-review-v1.png: 256x128, dashed rightward charge lane and chevrons.
- telegraph-30-year-mortgage-v1.png: 192x128, broken interest rings and percent signs.
- telegraph-midlife-crisis-v8-v1.png: 256x128, paired curved tire tracks.

Each marker is one centered, semi-flat floor decal with a center origin, open magenta gaps and hard pixels. Rotate the charge lane or drift marker to match the coded move. Telegraph timing, collision and damage remain Claude's work. The review loops warning/attack pairs for inspection even though the manifest proposes one-shot playback for integration.

All native pixels use the shared 17-color palette, exact opaque #FF00FF background and one-native-pixel navy outlines. No antialiasing, blur, baked shadow or background glow. The hurt pose keeps its silhouette and materials so an additional runtime flash can still be used later.

## Sources and authoring

- brief.json: full original boss prompts and design descriptions.
- marker-brief.json: full telegraph prompts.
- sources/: selected large generated sources, never runtime textures.
- attack-corrections.json: full refinement prompts for the Clipboard and V8 attack pairs, removing neighboring-cell fragments.
- walk-correction-prompt.txt: Mortgage weight-bearing/passing pose refinement for frames 4 and 5.
- manifest.json: keys, grid, origins, state ranges, marker metadata and review-only cadence proposals.

The Clipboard walk source order is regrouped into left-foot and right-foot halves. Native exports replace its two attack poses and the V8's two drift poses with their corrected sources. The Mortgage retains its original design while two refined poses finish the walk cycle.

```sh
swift -module-cache-path /private/tmp/midlife-art-swift-cache assets/bosses/export-native.swift "$PWD/assets/bosses"
python3 assets/bosses/build-manifest.py
python3 assets/bosses/validate.py
python3 assets/breakables/build-review.py
```

These are optional authoring steps, not a game build. No fallback image-generation CLI was used. Review evidence is in ../breakables/qa/. Bosses beyond these three and all runtime integration wait for Rami's review.
