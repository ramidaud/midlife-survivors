# ChatGPT handoff: Performance Review boss intro (Nov 7)

The first cut scene to build, from Grok's storyboards (`docs/handoffs/grok-cutscene-storyboards.md`, scene 3). It plays for 4 seconds right before the Performance Review fight (around age 45), so almost every player sees it. Follow the same rules as `docs/handoffs/chatgpt-live-title-scene.md`: every file 1920×1080, sprite frames transparent and registered to the plate, and each new frame made by editing the previous one and changing only what moves.

## Plate
`art/flow-kit/backgrounds/bg-bullpen-day.png`, **used as is**. No caption, no paint-over. Copy it in as `plate.png`.

## Placement
- Characters stand on the open floor in front of the desks. Feet stay planted the whole scene.
- The hero's feet are at about 35% of the width, and the Performance Review's are at about 60%.
- Both are the same scale, sized so the hero is about 40% of the frame height.
- Fit each reference onto the background's pixel grid once (nearest neighbor), then keep every pose on that exact grid.

## Frames
Folder: `assets/cutscenes/performance-review/`

**Start with the 9-to-5er only.** If the scene works, we'll add the other three heroes using the same three poses.

| Files | Who | Pose |
|---|---|---|
| `hero-01.png` | The 9-to-5er (`art/flow-kit/key-art/clean/keyart-9to5er.png`), facing right toward the boss | Neutral attention, holding his mug |
| `hero-02.png` | Same | One eyebrow up, head tipped back one pixel-art pixel. Nothing else changes. |
| `hero-03.png` | Same | Quiet, determined little smile, chin level. |
| `review-01.png` | Performance Review (`art/flow-kit/boss-performance-review.png`; use the clean key-art version if you've made it), facing left | Feet planted, original chart and frown |
| `review-02.png` | Same | Elbows out, fists a little higher: trying to look important |
| `review-03.png` | Same | Like 02, with one foot raised in place |
| `review-04.png` | Same | Like 02, both feet down, knees bent one pixel (the stomp landing) |

**The chart and face on the clipboard must be identical in every review frame.**

## Timing (for reference; Claude builds the playback)
| Beat | Time | Frames |
|---|---|---|
| Formal introduction | 1.0 s | hero-01 + review-01 |
| A very important clipboard | 1.0 s | hero-02 + review-02 |
| Make an impression | 1.0 s | hero-02 + review-03 (0.5 s), then review-04 (0.5 s) |
| Not intimidated, much | 1.0 s | hero-03 + review-01 |

## Deliver
- `plate.png` and the 7 frames
- `plate-check.png`: the plate with hero-01 and review-01 placed on it
- a contact sheet of every frame in order
- prompts and a short README
