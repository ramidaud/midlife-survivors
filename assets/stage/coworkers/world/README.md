# Native coworker world poses

[Animation review](review.html) · [2x hero/TJ comparison](coworkers-world-size-check-2x-v1.png) · [Full prompts and frame metadata](batch-world-v1.json) · [Pixel checks](checks-world-v1.json)

Twelve complete sheets replace the proposed cropped-torso assemblies. Every seated pose includes its chair, bent knees, shoes and wheel contact. Standing poses have their own full bodies and eight-frame directional strides. No names or lettering are drawn into the sprites. The older world and Spotlight sheets remain untouched.

| Stable ID | Name | Seated personal action | Sheets |
|---|---|---|---|
| salad | Art from Payroll | Salad, fork salute and bite | [Seated](coworker-salad-seated-v1.png) · [Standing](coworker-salad-standing-v1.png) |
| retiring | Sam at the Front Desk | Packs his box | [Seated](coworker-retiring-seated-v1.png) · [Standing](coworker-retiring-standing-v1.png) |
| intern | Eli from IT | Untangles a cable | [Seated](coworker-intern-seated-v1.png) · [Standing](coworker-intern-standing-v1.png) |
| email | Nora in Marketing | Reply-all, realization and wince | [Seated](coworker-email-seated-v1.png) · [Standing](coworker-email-standing-v1.png) |
| dozer | June from Legal | Dozes, dips and wakes up | [Seated](coworker-dozer-seated-v1.png) · [Standing](coworker-dozer-standing-v1.png) |
| mute | Mina in Benefits | Talks on mute, notices and taps her mic | [Seated](coworker-mute-seated-v1.png) · [Standing](coworker-mute-standing-v1.png) |

## Seated frame map

**576x128**, eight columns by two rows of **72x64**. Chair-wheel contact is local **y63**; normalized floor origin is **(0.5,63/64)**. The bottom chair/wheel band is identical in every pose so it never jitters against the floor.

| Row | Frames | Timing | Loop |
|---:|---|---:|---|
| 0 | 0-7 | 180ms | Working: type, sip, sigh, phone glance, settle |
| 1 | 8-15 | 160ms | Personal action above |

The sprite includes a compact keyboard/work surface where needed, not a whole solid desk. Place the chair in the desk's seat position and use normal desk occlusion so hands meet the existing worktop. These images supply no collision bodies.

## Standing frame map

**448x300**, eight columns by five rows of **56x60**. Shoes contact local **y59**; normalized floor origin **(0.5,59/60)**. Keep that explicit anchor when integrating rather than copying another sheet's visible shoe coordinate.

| Row | Frames | Timing | Pose |
|---:|---|---:|---|
| 0 | 0-7 | 120ms | Walk down |
| 1 | 8-15 | 120ms | Walk up, back facing viewer |
| 2 | 16-23 | 120ms | Walk left |
| 3 | 24-31 | 120ms | Walk right |
| 4 | 32-39 | 240ms | Slower signature fidget |

All rows have eight distinct native frames. Walks alternate stride and arm positions with a one-pixel height cycle. Offset loops between coworkers so the office does not perform in sync. Runtime pacing, trigger distances and room placement belong to Claude.

## Previews and scale

The review page links **all 42 row GIFs**: two seated and five standing for each person. GIFs use 3x nearest-neighbor pixels on navy, the row timings above and endless loops. The review canvases offer 1x/2x and row selection. At 2x on a phone, scroll within a canvas to see the comparison hero.

The 2x check board shows Art/Sam/Eli on top and Nora/June/Mina in the middle. Each pair is seated personal action, then standing down-walk. The original 9-to-5er and TJ are below, with their actual visible shoe lines aligned to the comparison floor.

## Production and QA

Built-in imagegen used each existing On Break portrait for identity and the current 9-to-5er walk sheet for scale and style. Full-person studies supplied the limbs, chairs and actions. Native cleanup removed transparent-edge noise, kept the main actor component, normalized scale uniformly, pinned the declared floor line and quantized to the requested twelve-color palette with hard alpha. No torso crop or procedural replacement legs were used. The chairs' lowest band was stabilized after preparation.

```sh
python3 assets/stage/coworkers/world/validate-world.py
```

The offline check covers all twelve dimensions, 336 frames, palette, binary alpha, floor contact, side margins, hero-scale standing heights, stable chair bases and eight distinct poses per row. Native sheets and the comparison were visually inspected; review controls and phone containment were checked. GIF frame counts/timing are checked separately with ImageIO. This is art only: no navigation, coworker behavior, lighting, spawning or game version change. Claude swaps in the new files after review.
