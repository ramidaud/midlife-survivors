# Handoff: The Stage Pass, "Corporate Campus" overworld (for ChatGPT / Codex)

Paste everything below the line into ChatGPT (Codex) with the Midlife Survivors folder connected. Work in the stages listed at the bottom, and stop for Rami's approval after Stage 1.

---

You're helping Rami Daud with **Midlife Survivors**, a Vampire Survivors-style browser game (Phaser 3.80.1, no build step). Live: https://ramidaud.github.io/midlife-survivors/

**Read first:** `CLAUDE.md`, `AGENTS.md`, `docs/handoffs/chatgpt-visual-pass.md` (style bible), `assets/office-environment/README.md`, `src/world-art.js`, `src/office-environment.js`.

## Rami's feedback, in his words
The stage is **too plain**. It should feel **massive and explorable, like an old Zelda game**. More pixel-art forward, friendly and funny, with lots of inside jokes and **lots of variety in objects and setups**.

His joke list:
1. "What the hell is a KPI again?"
2. "Let's put that in the parking lot."
3. More annoying corporate slang, **visualized literally**.
4. Other people at desks, sleeping under tables, hanging at the water cooler.
5. "Hang in there" posters.
6. Motivational posters gone wrong.

## What exists now
- `src/world-art.js` repeats one seven-area campus section through a 3x3 pool, so the same few props come back again and again. That repetition is the main reason it feels plain.
- Props today: three desk variants, a printer, a cabinet and a plant. The floors are carpet, wood and vinyl, with paper trails and coffee rings.
- Rules that work and must stay: palette-mapped native PNGs on `#FF00FF`, floor-footprint collisions, foot-point depth sorting, see-through foreground furniture, and contact shadows drawn in code (never baked into sprites).

## The goal: an overworld, not a tile
Think of *A Link to the Past*'s overworld: one big hand-made map made of distinct **districts**, each with its own look and a **landmark** you can recognize from a distance. You should be able to say "I'm by the Parking Lot" or "I'm near the Server Room" without a map.

**Size:** about **6 x 4 screens** (around 7680 x 4320 px) as the repeating unit, up from one small section. It still wraps, so runs stay endless, but you'd walk for a long time before seeing anything twice.

**Gameplay rules (do not break these):**
- Main routes stay **at least 192 px wide** and branches at least 160 px, so swarms can follow you.
- Every district needs at least one **open plaza** (about 512 x 512 px, no solid props) for big fights.
- Solid props use small floor footprints. Decor that doesn't need collision (rugs, papers, posters, wall art) stays non-solid.
- No dead ends deeper than about two screen-widths. Loops are better than corridors.
- Keep floors calmer than characters, enemies and pickups. The player must always read first.

## Districts (one landmark each)
| District | Landmark | Vibe |
|---|---|---|
| **Lobby and Reception** (start) | Giant company logo wall, a receptionist desk with a "Please Wait to Be Ignored" sign | Clean, bright, a little fake |
| **The Bullpen** (open-plan sea of desks) | A towering "Q4 Goals" whiteboard covered in arrows | Busy, cluttered, lived-in |
| **The Parking Lot** | A literal indoor parking lot where *ideas are parked*: cars labeled "Rebrand?", "Blockchain", "Bring Back Casual Fridays", one with a boot on it labeled "Dave's Idea" | The signature joke district |
| **The Break Room and Water Cooler** | A water cooler with a permanent crowd of gossiping coworkers | Warm, cozy, crumbs everywhere |
| **The Server Room** ("Take It Offline") | Rows of blinking racks, one unplugged with a sign: "TAKEN OFFLINE" | Cool blue, humming |
| **Executive Wing** | A corner office with a putting green and an empty "Thought Leadership" chair | Wood paneling, too much space |
| **The Conference Rooms** | "Synergy," "Bandwidth" and "Alignment" rooms. One meeting has clearly been going for 9 hours | Glass walls, sticky notes |
| **The Supply Closet / Archive** | Mountains of binders, the lost binder from devlog post 6, a cot | Dusty, secret-feeling |
| **The Wellness Corner** | A sad yoga mat, a "Mandatory Fun" banner, a nap pod that's out of order | Pastel, trying too hard |

## Corporate slang, visualized literally (sprinkle across districts)
- **"Circle back"**: a little traffic roundabout with a sign.
- **"Move the needle"**: a giant gauge on a wall, needle stuck at "MEH."
- **"Low-hanging fruit"**: a potted tree with one apple on the lowest branch.
- **"Deep dive"**: a kiddie pool with a diving board.
- **"Touch base"**: a baseball base taped to the carpet.
- **"Boil the ocean"**: a pot on a hot plate with a tiny ocean inside.
- **"Ducks in a row"**: rubber ducks lined up on a desk, one out of line.
- **"Herding cats"**: a manager's desk surrounded by cats.
- **"Move the goalposts"**: soccer goalposts on dollies.
- **"Think outside the box"**: a coworker sitting inside a cardboard box.
- **"Run it up the flagpole"**: an indoor flagpole with a memo on it.
- **"Hard stop"**: a stop sign outside a meeting room.
- **"Drink from the firehose"**: a firehose next to the water cooler.
- **"Piece of the pie"**: a pie chart that is literally a pie, half eaten.
- **"KPI"**: a big framed sign reading "KPIs" with a sticky note underneath: "What the hell is a KPI again?"
- **"Per my last email"**: a sticky note on a monitor.
- **"Let's take this offline"**: an unplugged lamp.

## Coworkers (ambient, non-interactive, no collision with enemies)
Small 2 to 4 frame idle loops in the existing character style. They are scenery and never attack or block swarms. Give them small floor footprints so the hero walks around them.
- Typing at a desk, then pausing to stare into space
- **Asleep under a desk**, with tiny "Z"s
- **The water cooler crowd**: three people, one telling a story with big hand gestures
- On a call, pacing in a tiny loop
- Microwaving fish (a stink cloud)
- In a 9-hour meeting, head on the table
- A diverse cast of ages, body types, skin tones and styles. Warm and recognizable, never mean.

## Posters (non-solid wall art, about 32 x 40 native)
**"Hang in There" variants:** the classic cat on a branch, then the cat on a lower branch, then the cat holding on with one claw, then just the branch.

**Motivational posters gone wrong:**
- "TEAMWORK: Because none of us is as dumb as all of us."
- "SYNERGY" over a photo of two staplers fighting.
- "OPPORTUNITY" over a door that's bricked up.
- "PERSEVERANCE" over a printer with a paper jam.
- "SUCCESS" with the "SS" crossed out and "PTO denied" written underneath.
- "THINK BIG" in tiny type.
- "THERE IS NO 'I' IN TEAM" with someone scrawling "but there is in 'quiet quitting'".

## Art specs (same style bible as Batch 1)
- 3/4 top-down, upper-left light, one-pixel navy outlines on solid shapes, the shared 17-color palette.
- Opaque exact `#FF00FF` backgrounds, hard pixels, no baked shadows, no text inside sprite art *except* on signs and posters, where short labels are the joke. Keep labels in a chunky pixel font and spell them correctly.
- Native sizes: small props 32 to 64 px, furniture 64 to 96 px, landmarks 128 to 256 px, posters about 32 x 40, coworkers 48 x 48 frames.
- Document every asset in a manifest (`assets/stage/campus-manifest.json`) with ID, size, floor footprint, solid or decor, district and frame count, the same way the enemy batch did.

## Work in stages
1. **Overworld mockup first (stop for Rami's approval).** One large top-down illustrated map of the full 6x4-screen campus showing every district, landmark, route and plaza, plus a one-screen close-up of the Parking Lot at gameplay zoom. Put both in the Art Room. **Nothing goes into the game until Rami approves.**
2. **Props and posters.** Districts' landmarks, slang props, desks with personality (lunch, plants, family photos, a 2009 calendar, a desk buried in sticky notes), and posters. Review page like `assets/enemies/review.html`.
3. **Coworkers.** Idle sheets plus a review page.
4. **Build the overworld.** Replace the repeating section in `src/world-art.js` with the authored 6x4 map (wrapping), keep the culling of off-screen sections, the collisions and the depth rules. Keep `window.USE_OFFICE_ART` as the old/new switch. Update the explored-path map so districts show their names.

## Test before pushing (stages 2 to 4)
- Desktop 1280x800 and phone 390x844: no console errors, the player and enemies stay readable, no overflow.
- Play to age 50 at Tax Bracket 0: swarms path around props, plazas work, frame rate holds.
- **Do not post test scores to the live leaderboard.** No balance changes.

## Finish each stage
- Bump `src/data/version.js` and `BUILD` in `src/loader.js`, commit and push to `main`.
- Log it in `docs/handoffs/chatgpt-changes.md` (What, Files, For the game, Sizes, Notes for Claude or Rami).
- Don't edit `CLAUDE.md` or devlog posts.

---

## Addendum 1: scale and production rules (Claude, Nov 1, after Stage 1 review)
Paste this to ChatGPT along with Rami's approval notes before Stage 2.

**Review notes on the Stage 1 concept (Claude's, confirmed by Rami before sending):** the Parking Lot close-up is the target: its density, jokes and scale are right. The full overview is too much like a grid. Nine identical square rooms, each a ring of props around an empty beige plaza, would feel plain again at game size, because the player spends most of a run standing in a plaza.

1. **Break the grid.** Districts get different shapes and sizes (L-shapes, long halls, a big open Bullpen, a small cramped Archive). Connect them with hallways that have things in them (vending machines, a lost-and-found bin, a sad birthday banner), not empty sand-colored roads. Old Zelda overworlds are irregular on purpose.
2. **Plazas are dressed, not empty.** Keep the open fighting space and clearances, but cover the floor with non-solid decor: tape lines, rugs, scattered papers, spilled coffee, a floor decal joke. Vary plaza shapes and sizes, and not every district needs a perfect 512 square in the middle. Some can sit off-center or be split in two.
3. **Build from a modular kit, never a painted map.** Production uses repeatable 64x64 floor tiles per district, modular wall and cubicle segments, and a reusable prop library with 2 or 3 color variants each. Districts are assembled from a data file (positions and prop IDs) so Claude and Rami can rearrange them later without new art. Aim for a kit of about 60 to 80 props, not hundreds of one-offs.
4. **Text must read at game size.** At 1x on a 390px-wide phone, small signs must be readable. Signs carry 1 to 3 words in a chunky pixel font on props at least 64px wide ("REBRAND?", "CIRCLE BACK"). Longer jokes (motivational posters, the KPI note, "Per my last email") also get a **"read on approach" caption**: walking near shows the full line in the existing lower-third tip bar, once per run. That's how long jokes scale.
5. **Check every new prop against the real hero.** Show each Stage 2 prop next to the 56x60 hero and an enemy at actual game size, on desktop and at 390px phone width, in the review page.
6. **Performance budget.** At most about 120 visible props per screen, everything culled off-screen, and no frame drop with 350 enemies, as in the earlier test.
7. **Areas unlock as you age ("promotions").** Keep one campus map, but put locked doors or keycard gates between areas. Each gate is a solid, readable prop with a short sign ("AUTHORIZED PERSONNEL", "EXECUTIVES ONLY", "PLEASE SEE HR"). Proposed schedule, to tune later:
   - Age 40: Lobby and Bullpen open (the new hire)
   - Age 45: Break Room and Parking Lot ("You've earned a break")
   - Age 50: Server Room and Conference Rooms ("Now you're in the meetings")
   - Age 55: Executive Wing (the Performance Review boss could guard it)
   - Age 60: Wellness Corner ("HR says you should relax")
   - Hidden: Supply Closet, opened by an achievement

   **Revise the overview (v2) to show the gates and the starting area before Stage 2.** Even with every gate locked, the starting area must be big enough for a full early swarm. Gates open with a short lower-third message and a door animation. While a gate is closed, enemies never spawn behind it. Store the schedule in a data file so Claude can tune it.
