# Jobs for the other AIs (Nov 8): new office bosses and the Home stage

Rami pastes each block into the named tool and drops the reply into `docs/handoffs/<tool>-changes.md` (or attaches the images here). Claude folds approved items into the game.

---

## ChatGPT: art

### 1. The three new office bosses (one chat per boss)
Use `docs/handoffs/chatgpt-new-office-bosses.json`. Attach `assets/bosses/boss-hoa-president-v1.png` and `assets/bosses/boss-performance-review-v1.png` as style and grid references, then paste:

> Make one Midlife Survivors boss sprite sheet. Use the "shared_rules" exactly, and the boss named [The Reorg / The Holiday Party / Your New Boss (Age 26)] from this JSON. Match the attached sheets' pixel style, grid, scale and camera angle. Neutral white balance, no sepia, no golden haze, no film-look tint. Then make its floor telegraph marker as a separate image.
> [paste the JSON]

### 2. Home stage style board
Attach `docs/plans/home-map.png` (layout) and `docs/plans/reference/twin-stones-forest.png` (mood), plus one office screenshot for style, then paste:

```json
{
  "task": "Style board for Midlife Survivors stage 2, 'Home': one wide image showing a slice of the neighborhood in the game's top-down 3/4 pixel art style, plus a row of 12 separate props underneath",
  "setting": "a tree-lined northeastern American suburb in peak fall, late afternoon",
  "scene": {
    "street": "two-lane residential street with a dashed center line, cream sidewalks, curbs, a storm drain, fallen leaves in the gutter",
    "houses": "varied styles side by side: a slate-blue colonial with white trim, a russet brick split-level, a sage cape cod with dormers; front porches, mailboxes, pumpkins on steps",
    "your_house": "a warm coffee-orange two-story with a cream front door, a basketball hoop over the driveway, a kid's bike on the lawn",
    "yards": "raked leaf piles, a swing set, a kid's lemonade stand made from a folding table with a hand-painted pink sign (no readable text)",
    "trees": "big maples and oaks in red, orange and gold, a few evergreen pines, falling leaves"
  },
  "props_row": ["leaf pile", "LEGO brick cluster", "mailbox", "pumpkin trio", "garbage and recycling bins", "kid's bike", "lemonade stand", "fire hydrant", "basketball hoop", "rake leaning on a fence", "shopping cart", "school crossing sign (no text)"],
  "style": "match the office stage: hard 16-bit pixel clusters, one-pixel navy outlines, three hue-shifted tones per material, warm upper-left light, 3/4 top-down camera",
  "palette": "game palette first: navy #171C35, slate #303750 and #526078, teal #3E7775, sage #83A89A, tan #D3B78D, cream #F2D7A1 and #FFF0CF, coffee orange #EF9347, russet #C45C4B, lavender #BFA8CF, pink #F1B5BF; add fall reds and golds that sit next to these",
  "color": "neutral white balance, no sepia, no golden haze, no film-look tint",
  "forbidden": "text, letters, numbers, logos, brands, watermarks, real people"
}
```

### 3. The Reorg's Hot Desk (prop)
Attach `assets/bosses/boss-reorg-v1.png` as the style reference, then paste:

> Make one Midlife Survivors prop sheet for the Reorg boss's rolling Hot Desk, matching the attached sheet's pixel style, outline and light. Follow this JSON exactly. Neutral white balance, no sepia, no golden haze, no film-look tint.

```json
{
  "game_key": "hotDesk",
  "name": "Hot Desk (The Reorg's rolling desk)",
  "file": "prop-hot-desk-v1.png",
  "sheet": "192x64 logical: 2 cells of 96x64. Cell 0 resting, cell 1 rolling (casters turned, a few cream motion ticks behind it). Footprint is the bottom 96x56; draw the 3/4 top-down view so the desk top shows",
  "physical_description": {
    "desk": "a small modern office desk on four navy caster wheels, slate-blue metal legs, a tan laminate top with a thin teal edge band",
    "on_top": "a closed laptop, a coffee-orange mug, a lavender sticky note, a tiny cream tent card with no text (the 'hot desk' placard)",
    "mood": "generic, temporary, nobody's desk"
  },
  "style": "same as the boss sheets: hard 16-bit pixel clusters, one-pixel navy outline, three tones per material, warm upper-left light",
  "background": "exact flat opaque magenta #FF00FF, no floor shadow",
  "color": "neutral white balance, no sepia, no golden haze, no film-look tint",
  "forbidden": "text, letters, numbers, logos, brands, watermarks"
}
```

---

## Grok: design specs (its lane: attacks, difficulty, balance)

> I'm building Midlife Survivors, a free Vampire Survivors-style browser game about ages 40 to 65 (about 45 seconds per year, one input: move). The office stage has bosses that spawn at set ages, each with a walk, a telegraphed wind-up and an attack. I'm adding three new office bosses and need a spec for each, in the same format as your earlier boss attack spec (attack pattern, telegraph shape and timing, HP relative to the Performance Review boss, speed, what makes the fight readable on a phone, one counterplay tip):
> 1. **The Reorg**: a consultant with a whiteboard org chart. Attack idea: reshuffles the room (desks slide, spawn points move). How do we make that fair and readable?
> 2. **The Holiday Party**: leads a conga line of ugly-sweater coworkers. Mistletoe zones freeze you for an awkward second. How long, how many zones, how does the line behave?
> 3. **Your New Boss (Age 26)**: fast, chugs energy drinks, every attack comes with a pep talk. A dash boss.
> Also suggest **which ages** each should appear at between 42 and 62, given players currently die around age 50 on average, and what each should drop.

---

## Gemini: writing (its lane: short game lines)

> I'm writing lines for Midlife Survivors, a warm, funny browser game about surviving midlife (ages 40 to 65 in an office, then a suburb). Humor is recognizable and kind, never mean. Short lines only, no em dashes, no brand names. Please write:
> 1. **Your New Boss (Age 26):** 20 pep-talk lines he shouts while attacking (under 8 words each, well-meaning and hopelessly young: "Let's circle back on your energy!").
> 2. **The Holiday Party:** 12 party lines (conga, ugly sweaters, Secret Santa, the punch bowl).
> 3. **The Reorg:** 12 memo-speak lines ("We're flattening the structure. You're the structure.").
> 4. For each boss: a **spotlight card** (kicker of 2-3 words, name, one-line intro under 70 characters) and **3 death lines** for when it beats you (under 60 characters).
> 5. For the new Home stage (a peak-fall suburb): 20 short **floor captions** that pop up as you walk past things (mailbox, leaf pile, lemonade stand, LEGO brick, school pickup line, the neighbor's leaf blower, a minivan, the grocery store), under 50 characters each.

---

## Muse: social feedback (its lane: how a post will land)

Muse doesn't write posts. When the boss art comes back from ChatGPT, write a short "meet the new office bosses" teaser in your own words, then send Muse the draft with the three sprites, and ask which boss to lead with and whether the image reads at phone size.
