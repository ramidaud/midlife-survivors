# Maple Hollow ground v2

Native plates and eight matte decals, matching the clean fields and readable details of the house fronts. No runtime files changed. All v1 files retained.

- Street A/B: **832x320**, horizontally repeatable with matching edge columns. Rami explicitly approved 832 instead of 800. Use 832 as the repeat step. Thirteen complete 32px dash / 32px gap cycles; phase 16. Top aprons x280..343 and x680..743, 64px wide. Sidewalks y0..63 and y256..319; road y64..255.
- Lawn A/B: 512x512, compatible on all four edges. Sage base, teal clumps, clover, dandelions, leaf drifts and worn ground. No random noise. Alternate variants to reduce recognizable motif repetition.
- Driveway: 64x256, repeats vertically. Center seam, two worn tracks, oil spot and leaves. Uniform crop from generated source, never stretched.
- Details: 512x64, eight 64px cells with 4px clear margins. Exact opaque magenta behind the art. These are non-solid decor. Key magenta for runtime use.

Manifest: `manifest-ground-v2.json`. Every plate has a repeated seam check; mixed street and lawn checks show A/B compatibility. Prompt JSONs retain the generation briefs. Palette, opacity, dimensions and border equality checked with the native exporter. Seam checks also inspected visually. No collision, navigation, spawning, lighting or version changes. Local review draft, not pushed.
