# Standing coworker Spotlight portraits

[Compare at 1× and 4×](coworker-portraits-v1-comparison.png). At each scale, the first group shows the 9-to-5er, TJ, salad and retiring. The second group shows intern, email, dozer and mute. Each group shows resting and signature poses.

| Sheet ID | Room | Signature | Native sheet | Previews |
|---|---|---|---|---|
| `salad` | Break Room | Fork salute over a salad bowl | [PNG](coworker-salad-on-break-v1.png) | [breathe](coworker-salad-breathe-v1.gif) · [signature](coworker-salad-signature-v1.gif) · [stretch](coworker-salad-stretch-v1.gif) |
| `retiring` | Parking Lot | Coffee sip and thumbs-up | [PNG](coworker-retiring-on-break-v1.png) | [breathe](coworker-retiring-breathe-v1.gif) · [signature](coworker-retiring-signature-v1.gif) · [stretch](coworker-retiring-stretch-v1.gif) |
| `intern` | Server Room | Energy drink sip and wave | [PNG](coworker-intern-on-break-v1.png) | [breathe](coworker-intern-breathe-v1.gif) · [signature](coworker-intern-signature-v1.gif) · [stretch](coworker-intern-stretch-v1.gif) |
| `email` | Conference Rooms | Types, pauses, and raises a finger | [PNG](coworker-email-on-break-v1.png) | [breathe](coworker-email-breathe-v1.gif) · [signature](coworker-email-signature-v1.gif) · [stretch](coworker-email-stretch-v1.gif) |
| `dozer` | Executive Wing | Slow blink, dips, and perks up | [PNG](coworker-dozer-on-break-v1.png) | [breathe](coworker-dozer-breathe-v1.gif) · [signature](coworker-dozer-signature-v1.gif) · [stretch](coworker-dozer-stretch-v1.gif) |
| `mute` | Wellness Corner | Nods and taps the headset | [PNG](coworker-mute-on-break-v1.png) | [breathe](coworker-mute-breathe-v1.gif) · [signature](coworker-mute-signature-v1.gif) · [stretch](coworker-mute-stretch-v1.gif) |

Each 768×336 PNG is eight columns by three rows of 96×112 cells. The standing shoe line is local y111. Use nearest-neighbor sampling and the native binary alpha.

| Row | Columns | Frame time | Animation |
|---:|---|---:|---|
| 0 | 0–5 | 220 ms | Breathing and blink. Columns 6–7 are blank. |
| 1 | 0–7 | 140 ms | Signature, used by the room Spotlight card. |
| 2 | 0–7 | 150 ms | Stretch and settle. |

The six built-in imagegen prompts paired each existing desk sheet for identity with TJ’s standing On Break sheet for grid, style, scale and lighting. They specified six breathing poses, eight poses for the signature action listed above, and eight stretch poses. Native cleanup aligned shoes, removed background residue and matched the cast palette. Use the stable sheet IDs to wire the room cards.
