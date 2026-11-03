# Bonus Approved art pack

[Full Tier 5 mockup, 1280×800](mockup-bonus-approved-1280x800.png)

I played the shipped sequence before drawing. An isolated Performance Review defeat produced a real Tier 1 pickup. **OPEN** ran the reel, landed the TV Remote, and finished at 4k 401(k). The mockup shows the equivalent Tier 5 payoff with example rewards, the memo header, the stamp, the gold and evolution beams, and the coin and check fountain.

All sprites have transparent RGBA backgrounds. Sample with nearest neighbor at whole-pixel coordinates. The beam strips use stepped alpha for readable light behind a reel.

| File | Dimensions | Frame order or use |
|---|---:|---|
| [chest-tier-1-v1.png](chest-tier-1-v1.png) | 384×96 | Four 96×96 cells. Employee Appreciation gift box. Closed, shake left, shake right, open. |
| [chest-tier-3-v1.png](chest-tier-3-v1.png) | 384×96 | Four 96×96 cells. Mortgage office safe. Closed, shake left, shake right, open. |
| [chest-tier-5-v1.png](chest-tier-5-v1.png) | 384×96 | Four 96×96 cells. Executive bonus chest with brass trim and red velvet lining. Closed, shake left, shake right, open. |
| [coin-gold-v1.png](coin-gold-v1.png) | 128×16 | Eight 16×16 cells, left to right. 401(k) face, turn, narrowing, edge, reverse, turn, narrowing, edge. |
| [coin-silver-v1.png](coin-silver-v1.png) | 128×16 | Eight 16×16 cells. Same spin phases in silver. |
| [bonus-check-v1.png](bonus-check-v1.png) | 128×16 | Four 32×16 cells. Level, right edge down, left edge up, right edge up. |
| [beam-gold-v1.png](beam-gold-v1.png) | 64×256 | One vertically repeatable strip. Align the core to the reel and anchor the bottom at the chest opening. |
| [beam-lavender-v1.png](beam-lavender-v1.png) | 64×256 | Same geometry for evolution rewards. |
| [card-9slice-v1.png](card-9slice-v1.png) | 96×96 | One panel with 12 px fixed insets on every side. Navy center, brass edge, teal outer trim. |
| [memo-header-v1.png](memo-header-v1.png) | 96×24 | Stretch horizontally between 6 px fixed end caps. Add the form and tier text as live UI. |
| [approved-stamp-v1.png](approved-stamp-v1.png) | 62×22 | Place as a separate upper-corner overlay at native size. |
| [retirement-title-v1.png](retirement-title-v1.png) | 336×48 | Gold HAPPY RETIREMENT wordmark. Center above the age-65 payout. |
| [retirement-cake-v1.png](retirement-cake-v1.png) | 64×48 | One cream sheet cake with lavender icing accents and candles. |
| [retirement-watch-v1.png](retirement-watch-v1.png) | 32×32 | One gold watch reward icon. |
| [retirement-streamer-v1.png](retirement-streamer-v1.png) | 128×24 | One horizontal repeat strip. |
| [reading-glasses-v1.png](reading-glasses-v1.png) | 32×32 | Transparent replacement with cream and teal frame highlights for navy #171C35. |
| [mockup-bonus-approved-1280x800.png](mockup-bonus-approved-1280x800.png) | 1280×800 | Composite of the Tier 5 payoff. The chest is enlarged 2× for the review. |
| [generation-prompts-v1.json](generation-prompts-v1.json) | Text | Built-in imagegen chest pose studies. Final art was redrawn on the native grid. |
| README.md | Text | Frame map and integration notes. |

The Reading Glasses replacement lives here with the rest of the review pack. To update the atlas during integration, replace zero-based cell **19**, column 3 and row 2, at x96/y64. Use the transparent PNG for the runtime atlas and opaque #FF00FF in the transparent pixels for the keyed authoring atlas.
