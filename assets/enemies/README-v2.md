# Enemy animation v2: art for review

Ten enemies have eight poses each. Group Chat ping has four, for **11 native sheets and 84 poses**. Every existing file in this folder is unchanged. The game still uses v1; no runtime file or version number was edited.

Open **review-v2.html** for v1/v2 comparisons, exact game-speed timing, 1x/2x inspection, pause, step, individual pose inspection and 30-enemy crowds. Special enemies have behavior selectors. The review loads native images only, with no game, storage, analytics or leaderboard. Embedded PNGs also support file:// viewing.

## Native files and timing

| Filename stem | Cell | Sheet | Poses | V2 delay |
| --- | --- | --- | --- | --- |
| bill | 48x48 | 384x48 | 8 | 90ms |
| late-fee | 32x32 | 256x32 | 8 | 50ms |
| spam-likely | 48x48 | 384x48 | 8 | 80ms |
| late-night-donut | 48x48 | 384x48 | 8 | 75ms |
| back-twinge | 48x48 | 384x48 | 8 | 70ms |
| reply-all | 48x48 | 384x48 | 8 | 110ms |
| 3am-thought | 48x48 | 384x48 | 8 | 115ms |
| calendar-invite | 48x48 | 384x48 | 8 | 60ms |
| group-chat | 48x48 | 384x48 | 8 | 100ms |
| math-homework | 48x48 | 384x48 | 8 | 85ms |
| group-chat-ping | 16x16 | 64x16 | 4 | 80ms |

Use **enemy-ID-v2.png**, one row of equal native cells. Each has an **enemy-ID-preview-v2.gif**, at 4x on slate. The GIF's centisecond delays alternate when needed to preserve the exact total loop period; the HTML review uses exact milliseconds. These are art timing proposals for Claude's integration, not changes to attack clocks.

## Special layouts

- **Spam Likely:** 0–3 walk; 4–7 ring. Each four-pose subset closes on itself. Do not play ring poses while walking.
- **Back Twinge:** 0–3 lunge; 4–7 rest/twitch. The old lunge/stretch keys are now 0/2, and coil/recovery are 4/6. The effect has no literal feet; approved v1 center offsets are retained. Claude owns matching poses to the existing attack state.
- **3 AM Thought:** 0–3 solid float, 4–5 fading, 6–7 ghost. Ghost poses have fewer pixels, hard magenta holes and a softer palette without navy contours. PNG alpha stays fully opaque; only exact magenta is removed on import. Collision and vulnerability still belong to game logic.
- **Donut:** its existing two-pixel hop is divided into 45/44/43/44 contact heights, then repeated for the opposite step. Feet on grounded walk enemies remain at 45, or 29 for Late Fee.
- **Ping:** four centered expansion/contraction poses, 16x16 each.

## Identity and native cleanup

Built-in imagegen produced one pose study per enemy using its approved v1 sheet as the edit reference. Full prompts and references are in **batch-v2.json**; selected studies are **enemy-ID-source-v2.png**. Eight-pose studies use 4x2 cells for drawing space, then flatten to one production row. Never import the studies into the game.

The new native export retains v1 key drawings on even indices and uses the generated drawings to guide moving contours, corners and limbs between them. Shared face/body pixels are preserved to avoid flickering into a different character on alternate frames. Group Chat gets a small native-pixel squash while its feet stay planted. All colors stay in the original 15-color palette, with exact opaque #FF00FF, hard edges and one-pixel navy outer contours. No background shadows or blur are baked in.

Frames 0 and 4 are **pixel-exact v1 keys**, with explicit state-aware mappings in manifest-v2.json. The only softened even key is ghost pose 6, which deliberately uses a paler palette. Math Homework retains its approved back-view key rather than inventing new markings. Existing source, PNG, GIF, README and review files are protected by hashes in v1-invariants-v2.json.

## Reproduce and validate

Optional offline art tools, not a game build step:

```sh
swift -module-cache-path /private/tmp/midlife-bio-swift-cache assets/enemies/export-enemies-v2.swift "$PWD/assets/enemies"
python3 assets/enemies/qa-enemies-v2.py
```

The validator checks all 84 poses, dimensions, opaque exact colors, margins, unique poses, outlines, native foot/contact positions, exact key parity, ghost fade density, GIF frame counts/loop durations and every pre-existing file hash. It writes checks-v2.json, manifest-v2.json and review-v2-data.js only. Browser evidence is in qa-v2/.

**Integration stays with Claude after Rami approves.** Keep v1 available as a fallback. Native frame/collision sizes, speeds, HP, damage, spawn and attack timing must not change when switching the renderer.
