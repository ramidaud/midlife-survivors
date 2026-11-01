# Clocking Out brand mark, v1

Rami selected concept 02 on Nov 1, 2026: cream clock face, stepped teal rim, navy hands and a small coffee-orange hour marker. Replaces the orange MS badge. The wordmark stays readable text in the existing pixel font.

The source is the 16x16 pixel grid in `build-clock.swift`. This is code-native icon geometry, not a cropped or resampled piece of the generated concept board. The offline script exports:

- `clock-mark-v1.svg`: crisp-edge vector representation for the 32px devlog header.
- `clock-16-v1.png`, `clock-32-v1.png`, `clock-64-v1.png`: transparent, integer-scaled PNGs.
- `clock-touch-180-v1.png`: opaque navy home-screen icon, with the clock at 8x scale and 26px padding.
- `clock-header-preview.jpg`: desktop proof in the actual devlog.

Root `favicon.png` matches the 32px PNG; `apple-touch-icon.png` matches the 180px export. All pages use `?v=clock-1` to refresh previously cached icons. The static-post generator contains the same branding and versioned CSS reference.

QA: inspected 16px/32px silhouettes, checked exact PNG dimensions and 2x blocks, hard alpha, root/export byte equality, page references, desktop and phone header layout, and clean browser logs. Existing published article bodies were verified unchanged.

Re-export with `swift -module-cache-path /private/tmp/midlife-bio-swift-cache assets/branding/build-clock.swift /absolute/path/to/assets/branding`, then copy the 32px and touch PNGs to the root filenames.
