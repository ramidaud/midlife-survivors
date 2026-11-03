# ChatGPT brief: the kill screen (Nov 3, 2026)

Thanks for the key art v2. It's live on the title screen (V. 1.70.0) and looks great. Next job: art for the screen almost every player sees at the end of a run, **the HR Exit Interview** (the death screen).

## Why
Most runs end in a death, so this screen gets seen more than anything but the title. Right now it's text only: "BURNOUT! SHIFT ENDED", the cause of death, stats and the leaderboard. We want it to land the joke: **who got you, and how you look about it.**

## The layout Claude will build
```
┌────────────────────────────────────────────┐
│  [ exit interview banner art, no text ]    │
│                                            │
│  [hero, defeated]   vs   [killer, smug]    │
│   "Taken out by Spam Likely at 43.2"       │
│  stats · score · leaderboard · retry       │
└────────────────────────────────────────────┘
```
On phones it stacks: banner, then the hero and killer side by side (smaller), then the rest.

## What to make
### 1. Defeated hero portraits (4 sheets)
The four heroes, in the same 96×112 portrait format as their On Break sheets (768×336, 8 columns × 3 rows, transparent, hard alpha, shoe line at local y111):
- **Row 0, "slump":** 8 frames at 120 ms. They give up gracefully: shoulders drop, then they sink into an office chair or sit down on the floor. It ends on a held pose.
- **Row 1, "defeated idle":** 6 frames at 220 ms. Sitting there, breathing, one small blink or sigh. Columns 6–7 blank.
- **Row 2, "shake it off":** 8 frames at 140 ms. They get back up, dust off and give a small determined nod (plays when you hit Retry).
- Keep it warm and funny, never hurt or sad. Tired, rumpled, coffee spilled, tie loosened, a single sweat drop, swirly eyes for one frame.
- **Hero details:**
  - **9-to-5er:** mug tips over.
  - **Soccer Dad:** soccer ball rolls away.
  - **Grad Student:** papers fly out of her notebook.
  - **Cold War Cowboy:** his hat slides over his eyes, and in the shake-off he blows on the floppy disk.
- **Files:** `assets/characters/portraits/<hero>-defeated-v1.png` with hero = `office-worker`, `soccer-dad`, `grad-student`, `cold-war-cowboy`.
- **Identity reference:** each hero's `*-on-break-*.png` sheet in that folder (Ben uses `cold-war-cowboy-on-break-v3.png`).

### 2. Smug killer mugshots (9 sheets)
The enemies that actually end runs, ranked by the play stats: **Bill, Group Chat, Late Fee, Spam Likely, Late-Night Donut (Snack Attack), 3 AM Thought, Reply All (Office Gossip), Calendar Invite, Back Twinge.**
- **Format:** 96×96 cells, 4 frames in one row (384×96), 200 ms per frame, transparent, hard alpha.
- **Pose:** a big close-up "mugshot" of the enemy looking pleased with itself. Arms crossed, a smirk, a little victory bounce or a wink. Same character design as their in-game sheet, just bigger and more expressive.
- **Files:** `assets/enemies/mugshots/<id>-mugshot-v1.png` with id = `bill`, `group-chat`, `late-fee`, `spam-likely`, `late-night-donut`, `3am-thought`, `reply-all`, `calendar-invite`, `back-twinge`.
- **Identity reference:** `assets/enemies/enemy-<id>-v2.png`.

### 3. Exit interview banner (1 scene, 2 sizes)
- A small HR office: a desk with a clipboard, a box of the hero's desk stuff (plant, mug, framed photo), a "take a number" style ticket dispenser, a wall clock past 5:00 and blinds with evening light. No people in it; the hero and killer portraits sit in front of it.
- **Desktop:** 1200×360. **Phone:** 800×400. Keep the middle and bottom calm and slightly darker, because portraits and text go there. Detail goes along the top and edges.
- **Files:** `assets/ui/kill-screen/exit-interview-banner-desktop-v1.png` and `-phone-v1.png`.

## Style
The same pixel style and palette as the portraits and key art: crisp 16-bit pixel art, warm upper-left light, navy #171C35, slate #303750, teal #3E7775, sage #83A89A, cream #F2D7A1, warm white #FFF0CF, coffee orange #EF9347, tie red #C45C4B, lavender #BFA8CF. **No text, letters, numbers or logos.**

## Also include
- Preview GIFs of every row.
- One check image showing each defeated hero next to a killer mugshot at 2× on a navy background.
- A README with the frame map.

## When done
Pull first (`git stash && git pull`). Commit art and docs only, push to main, and log it in `docs/handoffs/chatgpt-changes.md`. Claude will build the new kill screen around the art.
