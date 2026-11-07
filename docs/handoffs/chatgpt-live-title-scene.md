# ChatGPT handoff: live title scene "11:58 PM" (Nov 7)

We're turning the late-night title slide into a gentle live scene. No video: a still background plate plus small sprite frames that Claude plays back in the game at 8 poses per second. Claude has a working player already (`tools/live-scene.html`). Your job is the art.

**Source art:** `assets/title-screen/slides/06-late-night.jpg` (1920×1080). Everything you make must line up with it exactly.

## The golden rule: same canvas, same spot
- **Every file is a 1920×1080 PNG,** the same size as the source, so things line up without anyone nudging them.
- **Sprite frames have transparent backgrounds,** and each character stays in **exactly the same place** as in the source art.
- **Make each new frame by editing the previous one** and changing only the part that moves. Don't redraw the face or the outfit from scratch. If anything besides the moving part changes, start that frame over.
- Keep the pixel look of the source: chunky dark outlines, the same pixel size, and no blur, glow or soft gradients added.
- No text anywhere except the two pieces already in the plate.

## 1. The plate: `plate.png`
The source scene with the **worker, the steam and Bill removed**, and the floor, wall and chair repainted where they were. Repaint it properly; don't smudge it.

Keep in the plate:
- the clock reading **11:58**
- the desk and the lamp
- the monitor in its "normal" glow
- the empty office chair
- the sticky note reading **"just one more run"**, letter for letter

Also make `plate-check.png`: the plate with frame 1 of each sprite placed on top. It should look identical to the source art.

## 2. Sprite frames
Folder: `assets/title-screen/live/late-night/`. Name frames with two digits, starting at 01.

| Files | What | Frames | What changes |
|---|---|---|---|
| `worker-01..06.png` | The 9-to-5er in the chair, with his mug | 6 | **01** resting (as in the source). **02** breathing in: chest and shoulders up 1 pixel-art pixel. **03** blink: eyes closed, nothing else changes. **04** mug lifted a little toward his mouth. **05** sip: mug at his mouth, eyes half closed. **06** same as 04 (mug coming back down). |
| `steam-01..04.png` | Steam curl above the mug | 4 | A small 2-3 puff curl rising and fading. It must sit right above the mug in frame 01. |
| `monitor-01..02.png` | Just the monitor screen | 2 | **01** normal glow. **02** a touch brighter, with one faint scanline. A subtle flicker, not a flash. |
| `note-01..02.png` | Just the sticky note | 2 | **01** flat (as in the plate). **02** bottom-right corner curled up slightly. **The words must stay identical.** |
| `bill-01..04.png` | Bill, stomping in place | 4 | **01** both feet down. **02** left foot raised. **03** both feet down, body 1 pixel lower (impact). **04** right foot raised. He doesn't travel: same spot, same size, same angry face in every frame. **Use the in-game Bill with the red stripe across the top** (see `art/flow-kit/key-art/clean/` once he's in there, or `assets/enemies/enemy-bill-source-v2.png`). |

## 3. Rules for the empty space
- The big dark area (the top two thirds, and everything between the desk and Bill) is where the title and menu sit. **Nothing in any frame may move there.** No steam drifting up into it, no glow spilling out.
- Bill stays on the right, and the worker and desk stay on the left, exactly where they are now. Phones crop this picture to the left part, so the worker must stay within the left 40%.

## 4. Deliver
- All PNGs in `assets/title-screen/live/late-night/`.
- A contact sheet, `contact-late-night.png`, showing every frame in order.
- Your prompts and a short README with anything that didn't work.
- A quick check: for each layer, list which pixels changed between its frames. Claude will cut the frames down to just the changed areas and build the strips and `scene.json`, so you don't need to make strips.
