# Midlife Survivors: Visual Pass Handoff for ChatGPT

**From:** Claude (lead developer) for Rami Daud
**For:** ChatGPT, image generation (GPT Image)
**Date:** November 1, 2026
**Game:** https://ramidaud.github.io/midlife-survivors/ (play it first; it shows what every asset is for)
**Devlog:** https://ramidaud.github.io/midlife-survivors/devlog/

---

## 0. How to use this document

1. Paste **Section 1 (Setup)** and **Section 2 (Style bible)** into the ChatGPT Project's instructions, or as the first message.
2. Then work through the batches in **Section 5**, in order. **One object per image.** Paste one JSON prompt at a time.
3. Save each PNG with the file name given in its prompt, into the folder named for its batch, inside the Midlife Survivors folder.
4. After each batch, ChatGPT writes a short change-log block (Section 7). Rami pastes it into `docs/handoffs/chatgpt-changes.md`. Claude reads that file, cuts the sheets into frames, and wires them into the game.

---

## 1. Setup (paste into ChatGPT)

```
You're the pixel artist for MIDLIFE SURVIVORS, a Vampire Survivors-style browser game about surviving midlife (ages 40 to 65). You move; weapons fire on their own; swarms of midlife annoyances chase you. Tone: warm, funny, recognizable, never mean (no jokes about bodies, weight, illness or mental health).

Claude is the lead developer and keeps the master copy of the game. You make art only. You can't see or change the game files, so never say you changed the game.

Every asset follows the Midlife Survivors style bible (below). Make ONE object per image. Use the exact file name I give you. Keep every frame of a sheet the same size, scale and camera angle.

Style: no em dashes in any text you write. Start replies with a 2-3 sentence summary.

After each batch, end your reply with a change-log block in the format I give you.
```

---

## 2. Style bible (paste into ChatGPT)

**Look:** crisp 16-bit pixel art. Top-down three-quarter view (you see tops and fronts). Chunky, readable silhouettes. Warm affectionate office satire with tired determination.

**Light:** warm fluorescent light from the upper left. Highlights face up-left; short stepped navy shadows fall down-right.

**Outline:** 1 logical pixel of #171C35 around every silhouette. Broken interior lines. Two or three shade clusters per material. Never pure black.

**Palette (production targets):**

| Role | Hex |
|---|---|
| Outline / deepest shadow | #171C35 |
| Shadow slate | #303750 |
| Muted blue | #526078 |
| Office teal | #3E7775 |
| Sage | #83A89A |
| Warm brown | #A88B70 |
| Khaki | #D3B78D |
| Fluorescent cream | #F2D7A1 |
| Warm white | #FFF0CF |
| Dark russet | #874C3B |
| Tie red | #C45C4B |
| Coffee orange (hero accent) | #EF9347 |
| Warm skin | #E5A995 |
| Donut pink | #F1B5BF |
| Sticky-note lavender | #BFA8CF |

**Readability:** coffee orange belongs to the hero and his weapons. Enemies must read clearly against a dark navy-and-carpet floor. Small props stay quieter than enemies.

**Sprite rules (every game asset):**
- Solid flat magenta background **#FF00FF**. No shadow, texture or gradient on the background.
- Hard pixel edges. No anti-aliasing, blur, gradients or soft glow.
- No text, letters or numbers on sprites unless the prompt asks for it.
- Draw at the stated logical size, then enlarge only by whole numbers (2x, 4x, 8x) with nearest-neighbor. A big canvas is packaging, not the sprite's real size.
- Sheets are an even grid: frames left to right, equal padding, every frame filled.

**Characters (keep consistent everywhere):**
- **The 9-to-5er (main hero):** middle-aged office worker, black rectangular glasses, messy brown hair greying at the temples, white short-sleeve dress shirt, loosened red tie, khaki slacks, brown loafers, orange coffee mug in the right hand.
- **The Soccer Dad:** navy cap, teal polo, khaki shorts, whistle on a lanyard, soccer ball under one arm, coffee mug.
- **The Grad Student at 45:** lavender hoodie, glasses, grey-streaked hair in a bun, notebook, backpack, coffee.

---

## 3. Already done (don't redo)

- Office key art, plus three title-screen concepts (the **8:59 Lobby** is now the title screen).
- Four-direction walking sheets for all three heroes (56x60 frames, 4 directions x 4 poses).
- Office environment: three desks (tidy, paperwork, lunch), filing cabinet, plant, printer, carpet and wood floor tiles.
- A single-pose Bill from the first art test (Batch 1 replaces it with a walking version).
- Devlog covers.

---

## 4. Delivery specs

| Asset type | Logical frame | Frames | Layout | Folder |
|---|---|---|---|---|
| Regular enemy | 48x48 | 4 (walk/bob loop) | 1 row | `assets/enemies/` |
| Small enemy or projectile | 32x32 | 2-4 | 1 row | `assets/enemies/` |
| Boss | 112x112 | 4 (idle/advance loop) | 1 row | `assets/bosses/` |
| Pickup | 32x32 | 2 (bob or glint) | 1 row | `assets/pickups/` |
| Weapon effect | listed per prompt | 2-4 | 1 row | `assets/weapons/` |
| Hero extra poses | 56x60 (match walk sheets) | listed per prompt | rows per prompt | `assets/characters/` |
| Icon sheet | 32x32 | one per icon | grid of 8 per row | `assets/icons/` |
| Floor tile | 64x64 repeating unit | 1 | single tile, seamless edges | `assets/stages/<stage>/` |
| Stage prop | listed per prompt | 1 | single | `assets/stages/<stage>/` |

- Enemies face **down-right** (the game flips them for left).
- File names are lowercase with dashes, ending in `-v1.png`. Later revisions become `-v2.png`.
- Save the full prompt as a `.txt` next to each PNG (same name, `-prompt.txt`).

---

## 5. Prompts, by batch (in priority order)

Every prompt uses this shared header. Paste it in front of each JSON, or keep it in the Project instructions:

```
STYLE: Midlife Survivors style bible. Crisp 16-bit pixel art, top-down 3/4 view, 1px #171C35 outline, warm upper-left fluorescent light, project palette only, hard pixel edges, solid flat #FF00FF background, no text, no anti-aliasing, no gradients, no blur.
```

### Batch 1: Enemies (do these first: they fill the screen)

Logical frame 48x48, 4 frames, one row, facing down-right, on magenta.

```json
{ "file": "enemy-bill-v1.png",
  "subject": "Bill (the most common enemy)",
  "physical": "an angry cream paper bill-envelope with a red FINAL NOTICE band (a red stripe only, no readable letters), furrowed brows, gritted teeth, tiny navy legs and clenched mitten hands",
  "animation": "4-frame waddling walk loop, slight paper flutter",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-late-fee-v1.png",
  "subject": "Late Fee (small, fast; two of them burst out of an unpaid Bill)",
  "physical": "a small torn receipt with a red stamp mark, jagged torn bottom edge, sharp toothy grin, sprinting pose",
  "animation": "4-frame fast scurry loop",
  "frame": "32x32 logical, one row of 4" }
```

```json
{ "file": "enemy-spam-likely-v1.png",
  "subject": "Spam Likely (rings, then charges)",
  "physical": "a purple smartphone with an angry face on the screen, small red and green call buttons below the face, two stubby navy legs",
  "animation": "4 frames: two walking frames, then two trembling 'ringing' frames with small vibration lines",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-late-night-donut-v1.png",
  "subject": "Late-Night Donut (slows you down if it touches you)",
  "physical": "a round pink-frosted donut with rainbow sprinkles, a mischievous half-lidded smile, stubby arms, a little drip of frosting",
  "animation": "4-frame rolling bounce loop",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-back-twinge-v1.png",
  "subject": "Back Twinge (lunges in bursts, then pauses)",
  "physical": "a jagged orange-yellow lightning bolt creature with a pained grimace and two thin arms, a few small 'ouch' spark pixels around it",
  "animation": "4 frames: coil, lunge, stretched lunge, recover",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-reply-all-v1.png",
  "subject": "Reply-All Chain (an elite; tougher)",
  "physical": "three stacked white envelopes linked together by a paperclip chain, the top envelope has a smug face, small arrows curling off it like replies",
  "animation": "4-frame slow advancing sway, envelopes bobbing out of sync",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-3am-thought-v1.png",
  "subject": "3 AM Thought (fades in and out; can only be hit when solid)",
  "physical": "a lavender cloud-ghost with wide worried eyes and a wavy tail, a tiny crescent moon floating beside it",
  "animation": "4 frames: solid, slightly faded, mostly faded (dithered, not transparent), solid again",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-calendar-invite-v1.png",
  "subject": "Calendar Invite (charges in a straight line)",
  "physical": "a white calendar page with a red header strip and two ring binders on top, angry eyebrows, running legs",
  "animation": "4-frame charging run loop, leaning forward",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-group-chat-v1.png",
  "subject": "Group Chat (keeps its distance and fires pings)",
  "physical": "a green rounded speech bubble with three typing dots and an exasperated face, a small tail at the bottom",
  "animation": "4 frames: idle, typing dots 1, typing dots 2, typing dots 3",
  "frame": "48x48 logical, one row of 4" }
```

```json
{ "file": "enemy-group-chat-ping-v1.png",
  "subject": "Group Chat ping (its projectile)",
  "physical": "a tiny red notification badge circle with a white center dot (no number), with a small motion streak",
  "animation": "2-frame pulse",
  "frame": "16x16 logical, one row of 2" }
```

```json
{ "file": "enemy-math-homework-v1.png",
  "subject": "Math Homework (circles you, spiraling closer)",
  "physical": "a worksheet with scribbled pencil lines and shapes (no readable numbers), a pencil-eraser nose, cross-eyed frustrated face, dog-eared corner",
  "animation": "4-frame spinning flutter loop",
  "frame": "48x48 logical, one row of 4" }
```

### Batch 2: Midlife bosses (ages 45, 52, 60, and the ending at 65)

Logical frame 112x112, 4 frames, one row, facing down-right, on magenta.

```json
{ "file": "boss-performance-review-v1.png",
  "subject": "The Performance Review (boss at age 45)",
  "physical": "a giant clipboard creature with a stern manager face, a red pen held like a sword, checkbox marks on the paper (marks only, no letters), a lanyard badge",
  "animation": "4-frame stomping advance, pen raised on frame 3",
  "frame": "112x112 logical, one row of 4" }
```

```json
{ "file": "boss-30-year-mortgage-v1.png",
  "subject": "The 30-Year Mortgage (boss at age 52)",
  "physical": "a towering rolled document scroll with a house-shaped wax seal, heavy-lidded patient eyes, the scroll unrolling into a long tail of fine print lines",
  "animation": "4-frame slow looming sway, the tail unrolling a little more each frame",
  "frame": "112x112 logical, one row of 4" }
```

```json
{ "file": "boss-midlife-crisis-v8-v1.png",
  "subject": "The Midlife Crisis V8 (boss at age 60)",
  "physical": "a red convertible sports car with a chrome grille shaped like a toothy grin, headlights as eyes, flame decals on the sides, a leather jacket draped over the driver's seat",
  "animation": "4-frame revving loop: body shakes, exhaust puffs on frames 2 and 4",
  "frame": "112x112 logical, one row of 4" }
```

```json
{ "file": "boss-retirement-party-v1.png",
  "subject": "Your Retirement Party (the ending at 65; touching it wins the run)",
  "physical": "a big sheet cake with lit candles, three balloons tied to it, a gold watch box on top, a cheerful frosting face, confetti pixels around it",
  "animation": "4-frame celebratory bounce, candle flames flicker, confetti shifts",
  "frame": "112x112 logical, one row of 4" }
```

### Batch 3: Pickups

Logical frame 32x32, 2 frames (bob or glint), one row, on magenta.

```json
{ "file": "pickup-wisdom-gem-v1.png", "subject": "Wisdom gem (XP)", "physical": "a small faceted blue crystal with a cream highlight", "animation": "2-frame glint", "frame": "32x32 logical, one row of 2" }
```
```json
{ "file": "pickup-401k-coin-v1.png", "subject": "401(k) coin (permanent money)", "physical": "a chunky gold coin with a small embossed piggy bank (no letters)", "animation": "2-frame spin glint", "frame": "32x32 logical, one row of 2" }
```
```json
{ "file": "pickup-pizza-v1.png", "subject": "Leftover breakroom pizza (heals)", "physical": "a single pepperoni pizza slice on a small paper plate, one string of cheese", "animation": "2-frame steam wisp", "frame": "32x32 logical, one row of 2" }
```
```json
{ "file": "pickup-bonus-chest-v1.png", "subject": "Bonus chest (boss reward)", "physical": "a small gold-trimmed office supply box like a treasure chest, a bow on top, light leaking from the lid", "animation": "2-frame lid jiggle", "frame": "32x32 logical, one row of 2" }
```
```json
{ "file": "pickup-fanny-pack-v1.png", "subject": "Fanny Pack (pulls in every gem and coin)", "physical": "a teal fanny pack with an orange zipper pull and a buckle strap", "animation": "2-frame bob", "frame": "32x32 logical, one row of 2" }
```
```json
{ "file": "pickup-energy-drink-v1.png", "subject": "Energy Drink (speed boost)", "physical": "a tall can in coffee orange and navy with a lightning-bolt shape (no letters), condensation pixels", "animation": "2-frame fizz", "frame": "32x32 logical, one row of 2" }
```
```json
{ "file": "pickup-pto-day-v1.png", "subject": "PTO Day (clears the screen)", "physical": "a tiny beach umbrella stuck in sand with a folded beach towel", "animation": "2-frame umbrella flutter", "frame": "32x32 logical, one row of 2" }
```

### Batch 4: Weapons and effects

One row each, on magenta.

```json
{ "file": "weapon-coffee-splash-v1.png", "subject": "Coffee Splash (the starting weapon, a flying blob)", "physical": "a brown coffee splash blob with cream foam highlights and two trailing droplets", "animation": "4-frame wobble in flight", "frame": "24x24 logical, one row of 4" }
```
```json
{ "file": "weapon-dad-joke-ring-v1.png", "subject": "Dad Joke aura (a yellow ring that pulses out from the hero)", "physical": "a cheesy yellow ring made of tiny groan squiggles and a few small speech-bubble shapes", "animation": "4 frames expanding from small to large, thinning as it grows", "frame": "128x128 logical, one row of 4" }
```
```json
{ "file": "weapon-word-no-v1.png", "subject": "The word 'No.' (a teal shockwave that shoves enemies away)", "physical": "a hard-edged teal shockwave ring with a stop-sign octagon shape at its center (no letters)", "animation": "4 frames expanding outward", "frame": "128x128 logical, one row of 4" }
```
```json
{ "file": "weapon-tv-remote-v1.png", "subject": "TV Remote (a boomerang)", "physical": "a black TV remote with a red power button, grey rubber buttons and a small teal screen strip", "animation": "4 frames rotating 90 degrees each", "frame": "24x24 logical, one row of 4" }
```
```json
{ "file": "weapon-spreadsheet-cell-v1.png", "subject": "Spreadsheet cell (orbits the hero)", "physical": "a green spreadsheet cell with gridlines and a header stripe, a tiny sum symbol (the only allowed mark)", "animation": "2-frame shimmer", "frame": "24x24 logical, one row of 2" }
```
```json
{ "file": "weapon-podcast-wave-v1.png", "subject": "Podcast at 2x (a piercing sound wave)", "physical": "purple headphones with three curved sound arcs flying forward", "animation": "4-frame pulse, arcs moving forward", "frame": "32x32 logical, one row of 4" }
```
```json
{ "file": "weapon-evolutions-v1.png",
  "subject": "Evolved weapon versions, one per frame",
  "physical": "frame 1 Cold Brew Concentrate: a darker, glossier coffee bolt with ice-cube pixels; frame 2 Unhinged Pun Storm: a yellow storm cloud raining tiny speech bubbles; frame 3 Healthy Boundaries: a teal shield with a heart; frame 4 Smart TV: a big flat remote with a glowing screen; frame 5 Pivot Table: a bright green cell with arrows; frame 6 Binge Mode: purple headphones with a popcorn bucket",
  "frame": "32x32 logical, one row of 6" }
```

### Batch 5: Hero poses beyond walking (one sheet per hero)

Match the existing 56x60 walking sheets exactly: same scale, crop and palette.

```json
{ "file": "office-worker-extra-56x60-v1.png",
  "subject": "The 9-to-5er: extra poses",
  "physical": "same character as office-worker-walk-56x60.png: black rectangular glasses, messy brown hair greying at the temples, white short-sleeve shirt, loosened red tie, khaki slacks, brown loafers, orange coffee mug",
  "rows": "row 1 idle facing down, 4 frames (breathing, a sip of coffee on frame 3); row 2 hurt, 2 frames (flinch, recover); row 3 victory, 4 frames (raises mug, cheers)",
  "frame": "56x60 logical, grid 4 columns x 3 rows" }
```
Repeat for `soccer-dad-extra-56x60-v1.png` and `grad-student-extra-56x60-v1.png` using their descriptions from Section 2.

### Batch 6: Icons (replaces the emoji in menus)

Each icon 32x32, a single object, centered, 1px outline, on magenta. Grid of 8 per row, in the order listed.

```json
{ "file": "icons-perks-v1.png",
  "subject": "Level-up perk icons, in this order",
  "icons": [
    "Extra Shot: espresso cup with a plus", "Dark Roast: dark coffee bean", "Long Pour: tall to-go cup",
    "Unlock Dad Joke: grinning dad face with a speech bubble", "Louder Groan: megaphone", "Unlock No.: stop-sign octagon",
    "Firm Boundaries: orange traffic barrier", "Unlock TV Remote: remote", "Universal Remote: remote with circular arrows",
    "Unlock Spreadsheet: green grid", "More Columns: grid with a plus", "Unlock Podcast: headphones",
    "Playback Speed: fast-forward arrows", "Comfortable Shoes: sneaker", "Good Night's Sleep: pillow with Z shapes",
    "Reading Glasses: half-moon glasses", "Smart TV: flat-screen TV", "Pivot Table: grid with swap arrows",
    "Binge Mode: popcorn bucket", "Cold Brew Concentrate: iced coffee with a bolt", "Unhinged Pun Storm: storm cloud with a speech bubble",
    "Healthy Boundaries: shield with a heart", "Executive Delegation: briefcase with a star", "Titanium Knees: robotic knee joint",
    "Annual Checkup: stethoscope", "Leftover Friday Pizza: pizza slice", "PTO Day: beach umbrella",
    "Fanny Pack: fanny pack", "Standing Desk: small standing desk", "Focus Block: calendar page with a padlock",
    "HR Appreciation Snacks: granola bar"
  ],
  "frame": "32x32 logical per icon, 8 per row" }
```

```json
{ "file": "icons-shop-v1.png",
  "subject": "401(k) Shop icons, in this order",
  "icons": [ "Employer Match: two hands shaking over a coin", "Home Espresso: small espresso machine", "CPA on Retainer: calculator with a magnet",
    "Roth IRA & Pension: piggy bank", "Continuing Ed: graduation cap on a book", "Side Hustle: delivery bag with a coin",
    "Second Opinion: two clipboards with a heart", "Delayed Retirement: alarm clock with a plus" ],
  "frame": "32x32 logical per icon, 8 per row" }
```

```json
{ "file": "icons-achievements-v1.png",
  "subject": "Achievement badges, in this order; each a round badge with a navy rim and one object inside",
  "icons": [ "Per My Last Email: envelope", "Past Due Professional: alarm clock", "Stronger Than Glaze: donut with a slash", "The Sock Incident: single sock",
    "Leave This Thread: envelope with an exit arrow", "Solid Advice: crescent moon", "Could Have Been An Email: calendar page", "Mute Failed: speech bubble with a crossed bell",
    "Show Your Work: protractor", "Exceeds Expectations: rising chart arrow", "Initial Here: house with a seal", "Keep The Sedan: plain sedan",
    "Retirement Plan: sheet cake", "0.2 Inches Legal: ruler on grass", "Fully Vested: gold coin stack", "Kitchen Violation: pickleball paddle",
    "Shake Death's Hand: handshake", "Concentrate: iced coffee", "Unhinged: storm cloud", "Healthy Boundaries: shield",
    "Lost The Remote: remote under a cushion", "Pivot Table Of Doom: green grid", "One More Episode: popcorn", "Fully Evolved Adult: DNA helix",
    "Orange Slice Logistics: orange slice", "Seminar Survivor: graduation cap", "April Is Coming: tax form with a clock", "Breakroom Forager: potted plant",
    "Audit Survivor: magnifying glass", "Paper Trail: stack of folders", "Full Audit: courthouse columns", "Maxed The Match: full piggy bank" ],
  "frame": "32x32 logical per icon, 8 per row" }
```

### Batch 7: Stage kits for the rest of Midlife (later)

The Midlife run moves through four places as you age: the Open-Plan Office (done), **St. Deductible Hospital**, **the Suburban Home & Yard** and **the Social Courtyard**. Each needs a seamless floor tile and four or five props in the same style as the office kit.

```json
{ "file": "stage-hospital-kit-v1.png",
  "subject": "St. Deductible Hospital: floor tile and props, one per frame",
  "physical": "frame 1 seamless 64x64 pale teal-and-cream checker vinyl floor; frame 2 row of three teal vinyl waiting chairs; frame 3 IV pole; frame 4 vending machine; frame 5 reception desk with a bell; frame 6 potted fern",
  "frame": "64x64 logical per frame (desk and chairs may be 96x64), one row" }
```
```json
{ "file": "stage-home-kit-v1.png",
  "subject": "Suburban Home & Yard: floor tile and props",
  "physical": "frame 1 seamless warm wood-plank floor; frame 2 kitchen island with a fruit bowl; frame 3 scattered colorful toy bricks; frame 4 laundry basket; frame 5 lawn mower; frame 6 minivan back corner",
  "frame": "64x64 logical per frame (island and minivan may be 96x64), one row" }
```
```json
{ "file": "stage-social-kit-v1.png",
  "subject": "The Social Courtyard: floor tile and props",
  "physical": "frame 1 seamless brick-paver patio tile; frame 2 bistro table with two chairs; frame 3 string-light pole; frame 4 small tapas board; frame 5 planter box; frame 6 patio heater",
  "frame": "64x64 logical per frame, one row" }
```

### Later (Full Life mode, after Midlife ships)

- **Bosses (112x112, 4 frames):** HOA Board President (a clipboard-wielding neighbor with a measuring tape for grass), Mandatory Retirement Test (a giant exam booklet with a stopwatch), 6 AM Pickleball Champion (a spry senior in a visor with a paddle), Father Time (a gentle hooded figure with an hourglass; dignified, not scary).
- **Sunset Palms Resort kit:** pool-tile floor, lounge chair, shuffleboard court, pickleball net, palm planter.

---

## 6. QA checklist (check before sending each image)

- [ ] Background is pure flat #FF00FF with no shadow, texture or gradient.
- [ ] Every frame is the same size, scale and camera angle; nothing is cropped at the frame edge.
- [ ] 1px #171C35 outline; no anti-aliased edges; no blur or glow.
- [ ] Colors come from the palette; the enemy reads clearly against dark navy carpet.
- [ ] No letters or numbers (except where a prompt allows a single mark).
- [ ] The character matches the existing walk sheets (Batch 5).
- [ ] File named exactly as in the prompt, with the prompt saved next to it as `-prompt.txt`.

---

## 7. Change-log block (end every batch with this)

```
## YYYY-MM-DD: <batch name> (ChatGPT)
- What: <what was made, in one or two lines>
- Files: <file names, and the folder they belong in>
- For the game: <enemy / boss / pickup / weapon / icon / stage, and which in-game thing it replaces>
- Frame size and count: <e.g. 48x48, 4 frames, one row>
- Notes or open questions for Claude or Rami: <anything unclear or worth a second look>
```

Rami pastes this into `docs/handoffs/chatgpt-changes.md`. Claude then slices the sheets, tests them in the devlog's Art Room first, and swaps them into the game one batch at a time.

## Delivery status: November 1, 2026 (Codex)
Batch 1 art generation is complete: all ten enemy species and Group Chat ping are saved under `assets/enemies/`. Review via the Art Room's **Review animated enemies** link or `assets/enemies/review.html`. The manifest lists 11 sheets and 42 native frames. Full prompts, corrected sources, individual GIFs, an overview and a native ZIP are included. Await visual review before production integration. Bosses and later batches remain pending; see `chatgpt-changes.md` for the integration handoff.
