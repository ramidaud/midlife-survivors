# Enemy art, Batch 1 in progress

First review asset: Bill. Generated with built-in imagegen to match the office key art and the Nov 1 visual-pass handoff. The remaining Batch 1 enemies are pending; review this reference before repeating the style across the batch.

- `enemy-bill-v1.png`: canonical production-sized delivery, 192x48 PNG, four 48x48 frames left to right. Shared foot baseline y45, clear padding, pure opaque #FF00FF background, no baked floor shadows, exact project-palette colors and one-pixel navy silhouette outline.
- `enemy-bill-preview-v1.gif`: 4x nearest-neighbor review loop on slate, four frames at 180ms each (0.72-second cycle). Preview only, not the sprite export.
- `enemy-bill-source-v1.png`: corrected large generated source. The first output repeated the forward foot; a targeted imagegen edit corrected frame 3 to the opposite stride.
- `enemy-bill-v1-prompt.txt`: full generation and correction prompts.
- `export-bill.swift`: offline native export. One shared scale for all four poses, magenta keying, palette mapping and a consistent one-logical-pixel silhouette outline. The game does not run this script.

QA: inspected the sheet and loop; decoded the final PNG to verify dimensions, all four distinct frames, baseline, padding, exact palette/magenta, opacity and outline boundaries. Local reference playtest confirmed the current enemy context. The new Bill is NOT loaded into the production run or Art Room yet. Await Rami's style/motion feedback, then Claude can preview/integrate the approved asset per the handoff. No gameplay values or hitboxes change.
