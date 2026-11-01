# Enemy art: Batch 1 complete for visual review

Ten enemy species plus one projectile, 11 native sheets and 42 frames. Bill is the existing reference; the other nine species and ping were generated in this pass with built-in imagegen. Art generation is complete. Visual approval and production integration remain pending.

Open `review.html` locally or use **Review animated enemies** in the devlog Art Room. Pause, step poses, change floor, and inspect at 1x/2x/4x. `review-data.js` embeds the exact native PNGs so file:// preview works without a server. No game code or asset loader is required.

| ID / filename stem | Frame | Count | Sheet | Suggested frame delay |
|---|---|---|---|---|
| bill | 48x48 | 4 | 192x48 | 180ms |
| late-fee | 32x32 | 4 | 128x32 | 100ms |
| spam-likely | 48x48 | 4 | 192x48 | 160ms |
| late-night-donut | 48x48 | 4 | 192x48 | 150ms |
| back-twinge | 48x48 | 4 | 192x48 | 140ms |
| reply-all | 48x48 | 4 | 192x48 | 220ms |
| 3am-thought | 48x48 | 4 | 192x48 | 230ms |
| calendar-invite | 48x48 | 4 | 192x48 | 120ms |
| group-chat | 48x48 | 4 | 192x48 | 200ms |
| math-homework | 48x48 | 4 | 192x48 | 170ms |
| group-chat-ping | 16x16 | 2 | 32x16 | 160ms |

For each ID, `enemy-ID-v1.png` is the canonical game-sized export, `enemy-ID-source-v1.png` is the large generated source, `enemy-ID-v1-prompt.txt` records the full prompt, and `enemy-ID-preview-v1.gif` is a 4x loop on slate. Every sheet is one row, left to right. Use native exports, not generated sources, for cutting frames.

Production PNG rules: opaque exact #FF00FF background, exact 15-color style palette, hard edges, clear cell margins, no text or baked floor shadows. Walking feet share y45, or y29 for Late Fee. Donut uses y45 ground contacts and y43 airborne poses. Floating effects retain their source offsets within a shared center. A shared scale is used across poses. Solid silhouettes have a one-pixel navy boundary; the two fading ghost poses preserve hard magenta checker gaps without adding a dark outline around every hole.

Animation notes for integration:
- Spam Likely frames 0/1 walk; 2/3 ring. Select by behavior state rather than ringing on every walk loop.
- Back Twinge poses are coil, lunge, stretch and recovery. Match timing to the existing attack without changing balance.
- Ghost fading is cosmetic pixel omission. Keep collision/vulnerability controlled by the existing game logic.
- Group Chat has three typing dots that brighten in sequence; tiny tail/face changes distinguish the return pose. Math Homework flips to its marked back for the third pose.
- Add renderer contact shadows only for grounded enemies. No shadow is painted into these PNGs. Review against the hero at gameplay zoom before changing any display scale; Late Fee should remain visibly smaller.

Offline utilities, not a new build step:

```sh
swift -module-cache-path /private/tmp/midlife-bio-swift-cache assets/enemies/export-enemies.swift "$PWD/assets/enemies"
python3 assets/enemies/qa-enemies.py
swift -module-cache-path /private/tmp/midlife-bio-swift-cache assets/enemies/export-overview.swift "$PWD/assets/enemies"
```

Bill retains its earlier dedicated `export-bill.swift`. The batch exporter skips it. QA checks PNG dimensions, opacity, exact colors/magenta, clear borders, unique poses, foot baselines, navy outline boundaries and ghost fade ordering; it also refreshes embedded review data. `enemy-batch-1-overview.gif` synchronizes poses for comparison, while individual GIFs and the review page use the suggested per-species delays. Preview labels/floors are not part of sprite assets.

`enemy-batch-1-native.zip` contains native PNGs, prompts, manifest and this README. Browser proofs are `review-desktop.png` and `review-phone.png`. Checked 11 loaded sheets, scale widths, pose selection (including two-frame ping), floor switches, pause/play, phone overflow and clean browser logs. Bosses are Batch 2, outside this regular-enemy delivery.
