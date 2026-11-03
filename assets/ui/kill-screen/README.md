# HR Exit Interview art

[Portrait and mugshot check at 2×](kill-screen-portraits-check-v1.png). Nine pairs, in the mugshot table order, on the game's navy backdrop. The art has no embedded UI or labels.

| Banner | Dimensions |
|---|---|
| [Desktop](exit-interview-banner-desktop-v1.png) | 1200×360 |
| [Phone](exit-interview-banner-phone-v1.png) | 800×400 |

## Defeated heroes

The transparent PNGs are 768×336, eight columns by three rows of 96×112. Local shoe baseline is y111. Sample with nearest-neighbor filtering.

| Row | Columns | Timing | Use |
|---:|---|---:|---|
| 0 | 0–7 | 120 ms | Play the slump once, then hold the last cell or move to idle. |
| 1 | 0–5 | 220 ms | Loop the seated idle. Columns 6–7 are empty. |
| 2 | 0–7 | 140 ms | Play the shake-off and recovery once when retrying. |

| Hero ID | Sheet | Previews |
|---|---|---|
| `office-worker` | [PNG](../../characters/portraits/office-worker-defeated-v1.png) | [slump](../../characters/portraits/office-worker-defeated-slump-v1.gif) · [idle](../../characters/portraits/office-worker-defeated-idle-v1.gif) · [shake-off](../../characters/portraits/office-worker-defeated-shake-off-v1.gif) |
| `soccer-dad` | [PNG](../../characters/portraits/soccer-dad-defeated-v1.png) | [slump](../../characters/portraits/soccer-dad-defeated-slump-v1.gif) · [idle](../../characters/portraits/soccer-dad-defeated-idle-v1.gif) · [shake-off](../../characters/portraits/soccer-dad-defeated-shake-off-v1.gif) |
| `grad-student` | [PNG](../../characters/portraits/grad-student-defeated-v1.png) | [slump](../../characters/portraits/grad-student-defeated-slump-v1.gif) · [idle](../../characters/portraits/grad-student-defeated-idle-v1.gif) · [shake-off](../../characters/portraits/grad-student-defeated-shake-off-v1.gif) |
| `cold-war-cowboy` | [PNG](../../characters/portraits/cold-war-cowboy-defeated-v1.png) | [slump](../../characters/portraits/cold-war-cowboy-defeated-slump-v1.gif) · [idle](../../characters/portraits/cold-war-cowboy-defeated-idle-v1.gif) · [shake-off](../../characters/portraits/cold-war-cowboy-defeated-shake-off-v1.gif) |

## Killer mugshots

Each transparent 384×96 PNG has four 96×96 cells in a single row, played at 200 ms each. Select by killer ID. The enlarged silhouettes are centered on a common y89 line.

| Art ID | Sheet | Preview |
|---|---|---|
| `bill` | [PNG](../../enemies/mugshots/bill-mugshot-v1.png) | [GIF](../../enemies/mugshots/bill-mugshot-preview-v1.gif) |
| `group-chat` | [PNG](../../enemies/mugshots/group-chat-mugshot-v1.png) | [GIF](../../enemies/mugshots/group-chat-mugshot-preview-v1.gif) |
| `late-fee` | [PNG](../../enemies/mugshots/late-fee-mugshot-v1.png) | [GIF](../../enemies/mugshots/late-fee-mugshot-preview-v1.gif) |
| `spam-likely` | [PNG](../../enemies/mugshots/spam-likely-mugshot-v1.png) | [GIF](../../enemies/mugshots/spam-likely-mugshot-preview-v1.gif) |
| `late-night-donut` | [PNG](../../enemies/mugshots/late-night-donut-mugshot-v1.png) | [GIF](../../enemies/mugshots/late-night-donut-mugshot-preview-v1.gif) |
| `3am-thought` | [PNG](../../enemies/mugshots/3am-thought-mugshot-v1.png) | [GIF](../../enemies/mugshots/3am-thought-mugshot-preview-v1.gif) |
| `reply-all` | [PNG](../../enemies/mugshots/reply-all-mugshot-v1.png) | [GIF](../../enemies/mugshots/reply-all-mugshot-preview-v1.gif) |
| `calendar-invite` | [PNG](../../enemies/mugshots/calendar-invite-mugshot-v1.png) | [GIF](../../enemies/mugshots/calendar-invite-mugshot-preview-v1.gif) |
| `back-twinge` | [PNG](../../enemies/mugshots/back-twinge-mugshot-v1.png) | [GIF](../../enemies/mugshots/back-twinge-mugshot-preview-v1.gif) |

## Production references

Built-in imagegen used each existing On Break sheet for hero identity and pose scale, and each v2 enemy sheet for the corresponding mugshot. Hero prompts specified an eight-pose slump, six seated breath poses and eight recovery poses with their signature props. Mugshot prompts specified a smug rest, anticipation, a bounce or wink, and settle. Separate desktop and phone office prompts used the Lounge title scene for pixel style and asked for an empty HR office with quiet negative space. Native portrait exports use hard alpha and the cast palette.
