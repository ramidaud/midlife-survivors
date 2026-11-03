# ChatGPT brief: Lobby and Bullpen layout plan (plan only, no game changes) (Nov 2, 2026)

Rami's playtest of V. 1.47.0: **the coworkers look "slapped on" and the office "still seems very repetitive and poorly laid out."** He's right. This step is a **plan for him to approve**, not a build. Don't change any game file in this step.

## What's wrong now (from Claude's zoomed-out captures)
- **Coworkers float behind the back partitions** at head-and-shoulders size, while the chairs in front stay empty. It reads as "someone standing behind a wall," and they're too small next to the 56x60 hero.
- **One desk module is stamped ~40 times** (desk + partition + chair, two monitor variants) in evenly spaced rows.
- **Desks are islands** on a flat navy floor. There are no shared cubicle walls, no pods and no aisles you can read.
- **No zones:** one floor color, plus faint gray "light pool" rectangles that read as boxes.
- **No landmark on most screens,** so every screen looks alike and nothing is memorable.
- **The Lobby is mostly empty cream,** with props pushed to the edges and the water cooler stranded in the middle.

## What to deliver
Two layout options, **A and B**, each covering the Lobby and the Bullpen inside their **current outer walls**. Doors, gates and room shapes stay where they are.

For each option:
1. **A top-down plan image** (`assets/stage/layout-plan/option-A.png`, `option-B.png`): a clean, readable blockout at 1 px = 4 world px or similar, with a legend.
   - Mark pods, desk types, zones (floor colors), landmarks, aisles (with 224 px clearance shown), the hero spawn and the existing doors and gates.
   - Annotate the joke props.
2. **A mood frame** (`option-A-mood.png`, etc.): one in-style pixel-art mockup of a representative Bullpen screen at game camera scale (about 1280x800 at 1.25x zoom), so Rami can judge the look, not just the diagram.
3. **A short write-up** (`assets/stage/layout-plan/README.md`): the idea behind each option in a few sentences, what each screen's landmark is, and the prop counts.

### Design rules both options must follow
- **Pods, not rows.** Desks grouped into team pods of 4 to 6 with shared partitions, each team with an identity:
  - Accounting: binders, adding machine, a "Q3" calendar
  - IT: cable spaghetti, server tower, rubber duck
  - Marketing: mood boards, beanbag, neon sign
  - HR: candy bowl, "Wellness Wednesday" flyers
  - Feel free to invent others in the house voice.
- **Variety:** no two neighboring desks look the same. Use a personalization layer (photo frame, plant, mug collection, sticky notes, nameplate, desk toy) and mix desk types:
  - cubicle
  - L-desk
  - standing desk
  - an empty "last day" desk with a cardboard box
  - one glass manager's office
- **Zoned floors:** carpet tile color per team area, worn lighter paths down the aisles, entrance mats. Replace the gray light-pool boxes with window light shapes or remove them.
- **One landmark per screen:** printer station, whiteboard wall, kitchenette nook, ping-pong table, a dying office tree with a sign. No two screens should feel the same.
- **Density gradient:** the Lobby is the bright, open breathing room; the Bullpen gets denser toward the back, like the key art, but never cramped.
- **Gameplay space:** every main route stays at least 224 px clear, with a few open "arenas" between pods where the swarm can surround you (this is a Vampire Survivors-style game, so open floor matters). Mark them on the plan.
- **The Lobby:**
  - reception as the centerpiece facing the entrance
  - seating grouped on the rug
  - plants framing doors
  - an elevator bank wall
  - the WELCOME rug placed with purpose
  - less dead floor

### Coworkers (plan where they go and how they sit)
- **Seat them in the chairs**, in the aisle-facing seat at hero scale (roughly 44 to 52 px tall seated), with the desk front hiding their legs and the depth sort fixed so they sit in front of their own partition. The current sheets may need a redraw at the right scale and seating angle. Say so in the README if so.
- **Add 3 or 4 standing scenes:**
  - two people chatting at the water cooler
  - someone fighting the jammed printer
  - a person on the phone pacing a short loop
  - one slow ambient walker with a mug
- **Ambient people are visual only:** not solid, and they don't affect enemies or spawning.

## Rules
- **Plan only.** Don't edit `src/`, `index.html` or any shipped asset. New files go in `assets/stage/layout-plan/` only.
- No version bump.
- Don't touch `CLAUDE.md` or devlog posts.

## Finish
- Commit and push, and log it in `docs/handoffs/chatgpt-changes.md`.
- Then **stop for Rami's review.** He'll pick A or B (or a mix) and mark it up before anything is built.
