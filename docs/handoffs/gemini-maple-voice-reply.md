Here is the complete output formatted for docs/handoffs/gemini-maple-voice-reply.md, covering the Maple Hollow suburban worldbuilding (neighbors, yard gags, home tips, Rami's desk) and the comprehensive one-voice copy audit.

Maple Hollow Voice Pass & One-Voice Copy Audit (Nov 10, 2026)

Part 1: Maple Hollow Writing

1. The Six Neighbors

Warm, recognizable, never mean. Exactly one-line personalities.

1. The Young Family — The Millers (Dan, Chloe, and toddler Leo)
   Personality: Operating entirely on cold brew and dry shampoo, with a double stroller permanently parked on the porch like a getaway car.
2. The Retirees — Harold & Evelyn Henderson
   Personality: Up since 5:15 AM observing bird feeders with binoculars, always ready to hand you three surplus beefsteak tomatoes over the fence.
3. The Grill-Master Dad — "Big Rick" Kowalski
   Personality: Stands before a three-burner propane grill in crew socks and white sneakers, holding metal tongs that he clicks twice before every greeting.
4. The Fixer-Upper — Marcus Vance
   Personality: In year four of a weekend kitchen remodel, wearing work gloves covered in drywall mud and speaking exclusively in lumber dimensions.
5. The HOA President (Boss) — Brenda Vance
   Personality: Carries a brass ruler in her pocketbook and measures driveway weeds with the solemn authority of a supreme court justice.
6. The Early-Halloween House — Wayne & Sarah Gable
   Personality: Inflates a twelve-foot lawn skeleton on Labor Day afternoon and leaves orange string lights glowing until Thanksgiving morning.

2. Yard Gag Pop-Ups (When Cutting Through Backyards)

Shown when the player takes a backyard shortcut. Max 40 characters each, zero em dashes.

The Young Family (The Millers)

1. "Tripped over a plastic bubble mower." (37 chars)
2. "Stepped in an inflatable kiddie pool." (38 chars)
3. "Chalk hopscotch path on the patio." (35 chars)

The Retirees (The Hendersons)

1. "Spooked four goldfinches at once." (34 chars)
2. "Two Adirondack chairs facing east." (35 chars)
3. "Polite wave from behind the hedges." (36 chars)

The Grill-Master Dad (Big Rick)

1. "Smells like hickory smoke and pride." (37 chars)
2. "Pair of heavy tongs clicks twice." (34 chars)
3. "A bag of briquettes by the smoker." (35 chars)

The Fixer-Upper (Marcus)

1. "Walked around a pile of deck lumber." (37 chars)
2. "A wheelbarrow full of dry pea gravel." (38 chars)
3. "Sawhorses blocking the garden path." (36 chars)

The HOA President (Brenda)

1. "Lawn trimmed to exactly three inches." (38 chars)
2. "A small brass ruler stuck in the sod." (38 chars)
3. "Clipboard reflection in the window." (36 chars)

The Early-Halloween House (The Gables)

1. "Twelve-foot skeleton watching you." (35 chars)
2. "A plastic tombstone in the ivy." (32 chars)
3. "Glow-in-the-dark eyes in the maple." (36 chars)

3. Home Stage Tips (Max 70 Characters Each)

Plain, tactical, warm, and recognizable. Zero em dashes.

1. Spare Key Under the Rock:
   "The fake rock is plastic and warm. Tap it once to grab the spare key." (69 chars)
2. Lemonade Stand:
   "Stop by the stand for fifty-cent cups. Restores health in two gulps." (68 chars)
3. Toy Bricks:
   "Plastic bricks in the grass will slow you down. Step around the studs." (70 chars)
4. The Garage at Age 60:
   "The roll-up door creaks open at 60. Plenty of tools and room to kite." (69 chars)
5. The Math Homework at Age 45:
   "Common core homework spirals tight at 45. Break out before it circles." (70 chars)
6. Crossing Yards:
   "Cut between fences to break line of sight, but mind the flower beds." (69 chars)

4. Rami's Desk (Upstairs Office Interaction Lines)

Lower-third inspect lines when walking up to Rami's desk in the game.

1. "Two monitors, a lukewarm mug of tea, and sixteen open tabs about tile engines."
2. "A mechanical keyboard dusted with cracker crumbs and good intentions."
3. "The standing desk motor has been stuck at thirty-eight inches since June."
4. "Sticky note on the webcam: Remember to hydrate and stretch your shoulders."

Part 2: One-Voice Copy Audit

An audit across spotlight.js, errands.js, tips.js, deaths.js, and title/banner strings to unify tone, punctuation, and terminology ahead of the UI/UX pass.

1. Lines That Break Voice

⚬ Cynical / Sharp Edges vs. Warm Relatability:
  ⚬ deaths.js (officeGossip): Older drafts had "Accidentally hit 'Reply All' to the entire company." right next to "You accidentally clicked Reply All and decided it was best to simply go home." The latter is gentle and relatable; the former felt like a generic internet meme.
  ⚬ deaths.js (midlifeCrisis): "Started a podcast instead of going to therapy." slightly violates the "never mean" guardrail.
    ⚬ Fix: "Bought two condenser microphones for a podcast you recorded one episode of."
  ⚬ deaths.js (bill): Older strings containing "Died of autopay failure" and "Paper-cut to death". Replace all literal "died" and "to death" variants with polite midlife fatigue ("Signed out", "Took the rest of the day off", "Clocked out").
  ⚬ tips.js (age 90): "Death is getting impatient." clashes with the gentle personification of time.
    ⚬ Fix: "Your 90s. Father Time is checking his watch."

2. Places That Say the Same Thing Differently

⚬ The Hero's Name:
  ⚬ In spotlight.js: "THE GRAD STUDENT".
  ⚬ In achievements.js: "The Grad Student at 45".
  ⚬ In lore.js: "The Grad Student at 45".
  ⚬ Rule: Canonical display name is The Grad Student at 45. On 20-character Silkscreen caps cards where length is restricted, use GRAD STUDENT AT 45 (18 chars).
⚬ The IT Coworker:
  ⚬ Written as "The Cold War Cowboy" in early drafts and "The Coldwar Cowboy" in meta.js and lore.js.
  ⚬ Rule: Standardize to The Coldwar Cowboy (one word, Ben's preference).
⚬ Boss Naming:
  ⚬ lore.js uses "The Annual Performance Review" and "The 30-Year Adjustable Mortgage", while the banners and spotlight.js use "PERFORMANCE REVIEW" and "30-YEAR MORTGAGE".
  ⚬ Rule: Strip "Annual" and "Adjustable" in UI banners and cards; use the concise base names (Performance Review, 30-Year Mortgage, Midlife Crisis V8, The Gold Watch).
⚬ Senior Enemy Tags (Ages 80–100):
  ⚬ Both officeGossip and calendarInvite share the senior tag "BINGO" in enemies.js.
  ⚬ Rule: Change officeGossip senior label to "RUMOR" or "CHAIN", leaving "BINGO" reserved for calendarInvite.
⚬ Evolution Weapon Names:
  ⚬ The Lore archive refers to Ben's weapon evolving into the "Zip Drive", whereas upgrades.js uses "EVOLVE: Smart TV" paired with s.remote.
  ⚬ Rule: Update the tooltip/lore string to match whichever evolution is active on Ben's kit (Smart TV or Zip Drive).

3. Style Guide for UI/UX Pass

⚬ Sentence Length & Brevity:
  ⚬ Spotlight Card spoken lines: Max 60 characters (1 breath).
  ⚬ Action tips & lower-third captions: Max 55 characters (must fit a 390px mobile viewport without wrapping into 3 lines).
  ⚬ Approach MEMO prop captions: 1 to 2 short sentences, maximum 90 characters total.
⚬ Capitalization (Caps Rules):
  ⚬ ALL CAPS: Reserved for Spotlight Kickers (2–3 words, e.g., ANNUAL EVALUATION, NEW HIRE, LIFE HAPPENS), Spotlight character titles (BRENDA AT RECEPTION), and Attack Alert banners (MINUTE HAND).
  ⚬ Title Case: Proper names (Coffee Splash, Dad Joke, Late Fee, Performance Review).
  ⚬ Sentence case: Spoken dialogues, lower-third tips, and floor prop memos.
⚬ Emoji Usage:
  ⚬ Strictly Zero Emoji in Gameplay Banners & Floating Prompts: Avoid emoji in floating damage text, spotlight cards, tips, or lower thirds so they don't fight the 17-color retro pixel art aesthetic.
  ⚬ Exception: Allowed sparingly in menu meta tabs (like the Lore Archive index headers ⌚ The Gold Watch).
⚬ How to Address the Player (Second Person):
  ⚬ Always use a warm, collegial "You" (e.g., "You clocked out at five," "Your reading glasses were on your desk," "You paid off 50 bills").
  ⚬ Never use third-person detachment ("The player did..."), and never speak in cynical corporate buzzwords unless it is a boss directly attacking you (like the Age 26 Boss or Brenda).
---

## Claude's fact-check against the code (Nov 10, 8:40 AM)
Read this before using the audit. Some of Gemini's claims don't match the current game.

**Confirmed, worth fixing**
- deaths.js midlifeCrisis: "Started a podcast instead of going to therapy." is in the game. The suggested swap fits "never mean."
- The style guide (sentence lengths, caps rules, no emoji in gameplay text, warm second person) is a good starting point for the design system.

**Not accurate (already fine or not in the game)**
- officeGossip's senior tag is already "RUMOR". Only calendarInvite uses "BINGO".
- "Death is getting impatient." isn't in tips.js.
- deaths.js has no "died" or "to death" lines.
- "Cold War Cowboy" (two words) only appears in old changelog entries; the live UI already says "Coldwar Cowboy".
- "Zip Drive" only appears in old changelog entries; the live evolution is "Smart TV".
- Spotlight cards don't say "THE GRAD STUDENT"; the game uses "Grad Student at 45".

**Needs changes before use**
- **Name clash:** "Brenda" is already the office receptionist, and "Vance" is used twice (Marcus and the HOA President). The HOA President needs a different name.
- **Home tips describe the wrong mechanics:** the Math Homework throws paper airplanes (it doesn't spiral), the V8 bursts out of the garage at 60 (the garage isn't a tool stop), the spare key is picked up by walking over the rock, and toy bricks make you limp. Rewrite against `src/math-homework.js`, `src/garage.js`, `src/key-hunt.js`, `src/home-hazards.js`.
- **Desk lines don't match Rami's real desk** (`docs/handoffs/img/rami-desk-setup.jpg`): it's a curved ultrawide plus a second monitor, an iPad, a laptop, a silver tumbler (not tea), a red controller, a podcast mic and the kids' drawings. No standing desk or mechanical keyboard in the photo.
- Several yard gags are descriptions, not jokes ("Two Adirondack chairs facing east."). Keep the funny ones (smoke and pride, the brass ruler, the skeleton watching you).
