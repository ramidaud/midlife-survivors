# Midlife Survivors design system, v1 (spec for approval)

**Status:** proposal. Nothing here is built. The other Claude session migrates one surface at a time after Rami approves.
**Based on:** `ui-audit-2026-11.md` (V. 2.25.0), Grok's attention budget, Gemini's references.
**Visual version:** https://claude.ai/artifact/5jaXT3oLSEqrpabEq3QneM (source: `design-system-v1.html`, with the two before/after mockups). **Wireframes:** https://claude.ai/artifact/1YifCvzjZZHWYtuNssN4pa (source: `wireframes-v1.html`). **Audit:** https://claude.ai/artifact/UH1Uc4GaGXHiwsmB9sq8a7

**The short version**
- **Two homes for words during a run.** Alarms go up top, under the HUD. Story goes at the bottom. One of each at most, and on a phone during a boss, one total.
- **One kit of parts.** 10 type sizes (down from 30), 3 corner sizes (from 12), 9 layers (from 29), 3 screen classes (from 13 breakpoints).
- **One orange button per screen.** Everything else is an outline or a row.
- **The interface grows with the screen.** Phone, tablet and desktop get their own type scale and layout, and the hero never shrinks below a readable size.

---

## 0. Decisions on record (Rami, Nov 10)

| # | Decision | Answer |
|---|---|---|
| 1 | One headline + one ticker at a time. One total on a phone during a boss. | Yes |
| 2 | Boss intro card | Shorten to 3.5 s, compact band on phones |
| 3 | Rewards never take the center | Yes |
| 4 | Hold errands during bosses and off milestone ages | Yes |
| 5 | Pause swarm events during the Review, Mortgage and V8 | Yes |
| 6 | First modifier roll at 50.8 | Yes |
| 7 | Phone center banner | **Not 18%.** A slot directly under the HUD with a backing plate. The minimap gives way while a headline is up. |
| 8 | Button labels | Plain verbs (PAUSE, REROLL, SKIP). The joke goes in the line under the button. |

---

## 1. Five rules everything else follows

1. **The floor is sacred.** Danger is drawn in the world. No text, dim or card may cover the area around the hero during a boss.
2. **One voice at a time.** Every in-run message goes through one router with one queue. Nothing shows itself.
3. **Same job, same part.** If two things do the same job, they are the same component in the same place.
4. **One primary action per screen.** Coffee orange fill means "this is the thing to press." It appears once.
5. **Read at arm's length.** Nothing you read is under 14 px. Nothing you tap is under 44 px.

---

## 2. Tokens

Tokens are named values. Code says `--ms-space-3`, never `11px`. One file, `assets/ui/ms-tokens.css`, shared by the game and the devlog.

### 2.1 Color: the palette mapped to roles

| Role | Token | Value | Use |
|---|---|---|---|
| Background | `--ms-bg` | deep navy `#10142A` | page, scrim base |
| Surface | `--ms-surface` | navy `#171C35` | cards, sheets, plates |
| Raised | `--ms-raised` | slate `#303750` | rows, wells, inactive slots |
| Line | `--ms-line` | `#526078` | hairlines and dividers only (too faint for text) |
| Border | `--ms-border` | teal `#3E7775` | resting borders. Never text (3.3:1) |
| Text | `--ms-text` | warm white `#FFF0CF` | everything you read (14.8:1 on navy) |
| Text, quiet | `--ms-text-quiet` | `#B8C0D4` | captions, help lines (9.2:1) |
| Paper | `--ms-paper` | cream `#F2D7A1` | memo strips, memo cards, focus ring. Text on paper is navy (12:1) |
| Accent | `--ms-accent` | coffee `#EF9347` | the one primary button, selection, the age number (7.1:1) |
| Success | `--ms-ok` | sage `#83A89A` | done, earned, buffs, tips (6.4:1) |
| Danger | `--ms-danger` | russet `#C45C4B` | alerts and destructive actions, as a **shape** |
| Scrim | `--ms-scrim` | `rgba(16,20,42,.78)` | behind sheets. Solid. No blur |

**Three contrast rules that change today's UI**
- **Russet never carries small text.** It measures 4.0:1 on navy, under the 4.5 needed. Alerts use a russet edge plus a "!" mark, with the words in warm white. That also covers colorblind players: never red alone.
- **Teal is a border color.** The memo strip's "RE:" label is teal on cream today (3.7:1). It becomes navy.
- **Off-palette colors go.** The audit found 324 hex values. Yellow `#FFE042`, gold `#F5C542`, greens and the glowing red move to the palette, or become art (a sprite), which is allowed any color.

### 2.2 Type: two fonts, ten sizes

| Token | Font | Phone | Tablet | Desktop | Use |
|---|---|---|---|---|---|
| `label-s` | Silkscreen | 11 | 12 | 13 | tags, chips, captions in caps |
| `label-m` | Silkscreen | 13 | 14 | 16 | buttons, kickers, HUD labels |
| `label-l` | Silkscreen | 16 | 18 | 20 | section heads, the timer |
| `display-s` | Silkscreen 700 | 22 | 26 | 30 | the age, sheet titles, boss names |
| `display-l` | Silkscreen 700 | 32 | 44 | 56 | logo, full-screen moments |
| `body-s` | Atkinson | 14 | 15 | 16 | help lines, descriptions. **The floor** |
| `body` | Atkinson | 16 | 17 | 18 | default reading size |
| `body-l` | Atkinson 700 | 18 | 20 | 22 | card titles, ticker text |
| `title` | Atkinson 700 | 22 | 26 | 30 | screen headings in words |
| `headline` | Atkinson 700 | 28 | 34 | 40 | memo headlines, game over line |

- Silkscreen is for **labels of four words or fewer**, in caps, with 0.06em letter spacing. Anything longer is Atkinson.
- Numbers that change (score, coins, timers) use tabular figures so they don't jiggle.
- The three columns are one variable, `--ms-scale` (1, 1.12, 1.25), set by the size class.

### 2.3 Space, shape, depth

| Kind | Tokens |
|---|---|
| Spacing | 4, 8, 12, 16, 24, 32, 48 px (`--ms-space-1` to `-7`) |
| Corners | **2** px (strips, tags, chips), **4** px (buttons, rows), **8** px (cards, sheets). Round only for the two HUD buttons |
| Borders | 2 px resting. 3 px for selected and for focus |
| Shadow | Hard pixel offsets, no blur: `0 3px 0 #0B0E1D` (buttons), `4px 4px 0 rgba(0,0,0,.45)` (cards, sheets) |
| Plate | A solid navy backing at 94% behind any words over the game world. No bare text on the floor |
| Touch target | 44 px minimum, 48 px for a primary |

**No glass.** Blurred backgrounds smear the pixel art and cost frames on phones. Menus sit on a solid scrim.

### 2.4 Motion

| Token | Time | Use |
|---|---|---|
| `--ms-fast` | 120 ms | press, focus, hover, every exit |
| `--ms-base` | 200 ms | chips, banners, toasts entering |
| `--ms-slow` | 320 ms | sheets and cards entering |
| `--ms-moment` | 600 ms | full-screen moments only |

- **Ease:** `cubic-bezier(.2,.8,.2,1)` for everything. A small overshoot, `cubic-bezier(.2,1.5,.4,1)`, is reserved for rewards (chest, catch, level-up card landing).
- **Direction says where it lives.** Alarms drop from the top. Story rises from the bottom. Sheets rise on phones and fade in place on bigger screens.
- **Reduce motion:** every entrance becomes a 120 ms fade. No shake, no overshoot.

### 2.5 Layers (who draws on top)

| Layer | z | What |
|---|---|---|
| world | 0 | the game canvas, telegraphs, world text |
| hud | 10 | HUD, minimap |
| status | 20 | status row chips, edge arrows |
| ticker | 30 | ticker, spotlight band |
| headline | 40 | headline plate |
| sheet | 50 | scrim + any menu that pauses |
| moment | 60 | chest, game over, retirement |
| system | 70 | sound prompt, account prompt, site nav |
| dev | 90 | dev console |

**One rule fixes the audit's #4:** when anything at `sheet` or above opens, layers 20 to 40 hide, and the minimap hides with them.

---

## 3. The attention ladder

Like iOS: a quiet change, a banner, a sheet, a full-screen moment. Each rung is louder and rarer than the one below.

| Rung | Name | Looks like | Pauses? | Examples |
|---|---|---|---|---|
| 0 | **World** | drawn on the floor, near the hero | no | telegraphs, SAFE labels, damage numbers, name tags |
| 1 | **HUD pulse** | a number or slot blinks. No words | no | cake +HP, coins, Workload pip, buff ending |
| 2 | **Status row** | chips under the HUD. At most 1 objective + 1 status | no | errand, key hunt, Overtime beat; modifier, Workload, buff |
| 3 | **Ticker** | one bar at the bottom, label + one sentence | no | tips, rewards, promoted, achievements, lore |
| 4 | **Headline** | a plate under the HUD, or the spotlight band | no | boss arrival, swarm, modifier start, errand start, GOTCHA |
| 5 | **Sheet** | a menu over a solid scrim | **yes** | level-up, Performance Bonus, Lounge, big map, pause |
| 6 | **Moment** | the whole screen | **yes** | bonus chest, game over, retirement, retire at 80 |

### 3.1 Two homes

```
+----------------------------+
| XP bar                     |
| coins    AGE 45    II  )) |   HUD
| score    03:47             |
+----------------------------+
| [ ! TAX SEASON           ] |   HEADLINE plate (alarms)
| [   Pick a gap.          ] |   at rest: status row + minimap
|                            |
|            hero            |   THE FLOOR: nothing covers it
|                            |
|                            |
| [TIP | Elites drop gems. ] |   TICKER (story)
|        (thumb)             |   lifted 96 px on touch phones
+----------------------------+
```

- **Top, under the HUD: alarms.** The headline plate. At rest this zone holds the status row and the minimap. When a headline arrives on a phone, they step aside until it leaves.
- **Bottom: story.** The ticker. The spotlight band (hire, promotion, Lounge) uses the same home and replaces the ticker while it is up.
- **Boss arrival** is a spotlight band for 3.5 s: name, portrait, the one dodge tip. No floor dim, no speech bubble on phones. The boss's own first-attack banner is skipped while it shows, because the band already says how to dodge.

### 3.2 The queue (from Grok's budget, now approved)

| Tier | What | Where | Rule |
|---|---|---|---|
| T0 Danger | telegraphs, LOW HP | world, HUD | never queued, never covered |
| T1 Threat | boss arrival, swarm, modifier start, Comfort Zone Tax (first time) | headline | waits 4 s at most, then dropped |
| T2 Objective | errand, beat, key hunt, promotion | headline once, then status row | stale after 10 s |
| T3 Reward | cake, treats, buffs, achievements | ticker only | stale after 8 s |
| T4 Flavor | chapter lines, lore, chatter | ticker only, after 20 s of quiet, never during a boss | dropped if late |

- **No cutting in.** A message never replaces one of equal or higher tier. It waits or it is dropped.
- **Quiet window:** nothing new starts while a boss is winding up or attacking, plus 300 ms.
- **Gaps:** 1.2 s between headlines, 0.8 s between tickers. The same message at most once a minute.
- **Merges:** a milestone birthday is one ticker line. A promotion is one band and one ticker line. A modifier is one headline, then a chip.
- **Holds:** errands and the Lounge wait for no boss and 0.6 years clear of 45, 50, 55, 60. Swarm events wait for any boss.
- **Targets:** 4 messages a minute on average, 6 in any minute at most, 40% of every minute with nothing on screen but the HUD.

---

## 4. Size classes

Three classes replace 13 breakpoints. A fourth flag handles phones held sideways.

| Class | When | Scale | Typical device |
|---|---|---|---|
| **Compact** | width under 600 | 1 | phone, portrait |
| **Regular** | 600 to 1023 | 1.12 | iPad portrait, small windows |
| **Wide** | 1024 and up | 1.25 | iPad landscape, laptop, desktop |
| **Short** (flag) | height under 500 | 1 | phone, landscape |

Input is separate from size: **touch**, **pointer** (mouse and keys), **pad** (controller). The UI follows the last input used.

| Surface | Compact | Short (phone landscape) | Regular | Wide |
|---|---|---|---|---|
| HUD | one row + XP bar, 96 px tall, buttons 44 px | one row, 44 px | scaled 1.12 | scaled 1.25, max 1200 px wide, centered |
| Status row | full width under HUD | inside the HUD row | centered, max 560 | centered, max 560 |
| Minimap | 120 x 96, yields to headlines | 96 x 72 | 184 x 146 | 232 x 184 |
| Headline plate | full width minus 16 px margins | one line, max 60% width | centered, max 560 | centered, max 560 |
| Ticker | 96 px above the bottom on touch | one line, bottom, max 60% | bottom, max 640 | bottom, max 720 |
| Spotlight band | compact: name + tip, 88 px | name only, 56 px | full band | full band |
| Sheet | bottom sheet, full width, up to 88% tall, actions pinned at the bottom | full screen, two columns | centered card, max 640 | centered card, max 880 |
| Choice cards | stacked rows | 3 across | 3 across | 3 across |
| Lists (shop, settings) | 1 column | 2 columns | 2 columns | 3 columns |
| Title | art on top, PUNCH IN in thumb reach, bottom bar | art left, actions right | art on top, two columns below | art left 60%, actions right |
| Moments | full screen | full screen | full screen, content max 640 | full screen, content max 880 |

**Safe areas.** Every edge-anchored part adds `env(safe-area-inset-*)`. The HUD adds the top inset, the ticker and sheet action bars add the bottom inset.

**Thumb reach (touch phones).** The bottom 35% is for thumbs. Nothing you need to read sits there for long. Primary buttons on sheets and on the title do sit there.

**The hero stays readable.** The camera zoom is chosen so the hero is at least 48 CSS px tall on every device. Today iPad portrait zooms out until the hero and all world text are tiny.

**Controllers.** One focus ring everywhere: 3 px cream outside a 2 px navy gap, so it shows on any color. Focus order follows reading order. Button hints (A, B, X, Y) live in one footer legend per sheet, and only when a controller or keyboard is the active input. They never go inside a button label.

---

## 5. Components

Eight parts. Each lists its states.

### 5.1 Button
- **Primary:** coffee fill, navy `label-m` text, 4 px corners, hard shadow. One per screen.
- **Secondary:** 2 px teal outline, warm white text.
- **Quiet:** text only with an underline on focus. For "Not now", "See all".
- **Danger:** russet outline. Always asks twice ("ERASE EVERYTHING? TAP AGAIN").
- **States:** default, hover (pointer only, fill lightens), focus (ring), pressed (moves down 2 px, shadow closes), disabled (40% with a lock mark and a reason in the line below).
- **Labels:** a plain verb, one to three words. No emoji, no key lists.

### 5.2 Row
One list row for the shop, the Lounge, settings, leaderboard, credits and the pay stub.
- Leading icon (pixel art, 32 px), title (`body-l`), one help line (`body-s`), trailing slot.
- **Trailing slot is one of:** a price tag, a stepper, a switch, a value, a chevron.
- The whole row is the tap target (56 px minimum). No button inside a row.
- **States:** default, focus, pressed, selected (coffee border), locked (lock mark + reason), done (sage check).

### 5.3 Card
- Navy surface, 2 px teal border, 8 px corners, hard shadow, 16 px padding.
- **Variants:** choice (level-up), tile (title screen), record (achievement), memo (cream paper, navy text).
- **States:** default, focus, selected (3 px coffee border), locked (dim + lock), earned (sage mark).

### 5.4 Sheet
The one container for every menu that pauses.
- **Header:** memo strip + a title in `display-s` + at most one line of help.
- **Body:** scrolls if needed.
- **Action bar:** pinned at the bottom. One primary on the right, up to two secondaries on the left.
- **Footer legend:** controller and key hints, only when relevant.
- Compact: rises from the bottom. Regular and wide: a centered card. Always on the solid scrim.
- **Close:** B, Esc, or the secondary button. Tapping the scrim closes only sheets with nothing to lose.

### 5.5 Banner (the headline)
- **Plate:** navy backing, 2 px border in the tier color, a kicker in `label-m`, one line in `body-l`. Lives under the HUD. Lasts 2 to 3 s.
- **Band:** the spotlight band with a portrait. Lives at the bottom. 3.5 s for bosses, 5 s for hire, promotion and Lounge.
- **Tier colors:** threat = russet edge + "!" mark. Objective = cream edge + checkbox mark. Reward = coffee edge + star mark.
- **States:** entering, showing, leaving. Tap or A dismisses a band.

### 5.6 Toast (the ticker)
- Today's lower third, kept. Navy bar, a label block on the left, one sentence in `body-l`, two lines at most.
- **Label block:** sage for tips and done, cream for objectives, coffee for rewards. Alerts use a russet edge and "!" with a navy block.
- **States:** entering, showing, leaving, held (while a sheet is open).

### 5.7 Chip
- 28 px tall, 2 px corners, navy plate, 2 px border, `label-s` text, an optional timer on the right in tabular figures.
- **Objective chip:** cream border. Short target and a countdown: "PRINTER · BULLPEN 40s". The full sentence goes to the ticker once.
- **Status chip:** coffee border for modifiers, sage for buffs, russet edge for Workload and Comfort Zone Tax.
- **States:** default, low time (blinks at 10 s), done (sage flash, then leaves), hidden (while a headline or sheet is up).
- **One arrow.** Every "go here" arrow is the same coffee triangle at the screen edge.

### 5.8 Memo
- **Strip:** cream, 4 px coffee left edge, `label-s` navy kicker + bold Atkinson subject. One naming pattern: `DEPARTMENT · RE: Subject`.
- **Paper card:** cream surface, navy text, a slight tilt allowed on the devlog only.
- Used for sheet headers, the briefing, devlog memos and social cards.

### 5.9 HUD parts
- **Stat:** a small pixel icon + a number in `label-m`.
- **Hero number:** the age in `display-s` coffee, with the timer under it in `label-m` quiet.
- **Meter:** XP across the top, health under the hero.
- **Slot:** 28 px, shows what you own. Empty slots appear only in the level-up sheet.
- **Round button:** pause and sound, 44 px.
- **Boss meter (new):** the boss's name and a health bar under the HUD for the whole fight. Today you have to find the tag over the boss's head. Needs Rami's OK.

---

## 6. Voice for UI

| Where | Rule | Example |
|---|---|---|
| Buttons | plain verb, 1 to 3 words | PUNCH IN, RESUME, REROLL, SKIP, BUY, BACK |
| Line under a button | this is where the joke goes | "Keep your loadout. Heal 2 HP." |
| Memo strip | `DEPARTMENT · RE: Subject`, one pattern | HR · RE: Your 401(k) |
| Headline kicker | 1 to 3 words, caps | TAX SEASON |
| Headline line | one sentence, 45 characters, says what to do | "A wall of bills from the east. Pick a gap." |
| Ticker | one or two sentences, 90 characters | "Fueled up. +3 HP and 15 s of Checked Off." |
| Chip | a noun and a number | PRINTER · BULLPEN 40s |
| Empty state | warm, never blames, says the next step | "No scores yet. Punch in and set one." |
| Locked | say how to unlock | "Reach age 55 to open Maple Hollow." |
| Errors | what happened, then what to do | "Couldn't reach sign-in. Your file is still saved on this device." |
| Settings | name what the player sees | "Confirm: A" (not "BTN 0"), "Saved on this device" (not "LOCALSTORAGE") |

- Second person, warm, deadpan. Never mean.
- No emoji in gameplay text. Buttons and rows use pixel icons from the game's own art.
- Sentence case for anything in Atkinson. Caps only in Silkscreen.
- Humor lives in subtitles, ticker lines, death lines and memo subjects. Controls stay plain.

---

## 7. Mapping: every current surface and what it becomes

### In a run
| Today | Becomes | Rung |
|---|---|---|
| Center flash (`flashBanner`) | Banner, plate | 4 |
| Boss toast | removed (Banner covers it) | |
| Spotlight: boss | Banner, band, 3.5 s, compact on phones | 4 |
| Spotlight: hire, room, Lounge | Banner, band, 5 s | 4 |
| Spotlight: tip | Toast with a TIP label (band only in a player's first 3 runs) | 3 |
| Lower third | Toast | 3 |
| Catch card (GOTCHA!) | Banner, plate with portrait, reward tier, slow motion kept | 4 |
| Boss down stamp | world art (kept) + one Toast | 0 + 3 |
| Errand strip, key hunt strip, Overtime beat strip | Chip, objective | 2 |
| "Checked off" buff, modifier chip, Workload chip, Comfort Zone Tax | Chip, status | 2 |
| Errand, Lounge and reorg arrows | the one edge arrow | 2 |
| Cake, dividend, treats, salad | HUD pulse + world text + one Toast | 1 + 3 |
| Shift briefing | Sheet (compact memo), with the hire band under it | 5 |
| "Move to start" hint | Toast, held until you move | 3 |
| Sound nudge | system prompt, bottom on phones, never over the HUD | system |
| Level-up, Performance Bonus | Sheet + 3 choice Cards + action bar | 5 |
| Lounge, Lemonade Stand | Sheet + Rows | 5 |
| Big map | Sheet | 5 |
| Pause | Sheet (resume, run summary, 3 rows) | 5 |
| Bonus chest | Moment | 6 |
| Retire at 80 | Moment with two Buttons | 6 |
| Game over, retirement | Moment + Rows for the pay stub | 6 |
| Damage numbers, Close Calls, name tags, speech bubbles | World text: one bubble style (cream paper, navy text), caps on count | 0 |
| HUD | HUD parts | 1 |
| Minimap | HUD part, yields on phones | 1 |

### Out of a run
| Today | Becomes |
|---|---|
| Title: logo, strip, PUNCH IN | Memo strip + `display-l` + the one primary Button |
| Title: settings chip (location, mode, sprint, tax) | a Row, "Today's shift", that opens a Sheet |
| Title: employee picker | 4 Cards, tile variant |
| Title: employee file feed | a Card with 3 Rows at most |
| Title: devlog memo | Card, memo variant |
| Title: link row | bottom bar on phones, the top nav elsewhere |
| What's New bubble | Toast on the title (bottom on phones, top right on wide) |
| Account prompt, We Moved | Sheet, small |
| 401(k) Shop | Sheet + Rows, balance in the header |
| Extras | Sheet + Rows, grouped. Reset Progress moves into Settings under a divider |
| Achievements | Sheet + Cards, record variant |
| Leaderboard | Sheet + Rows |
| Credits | Sheet + Rows, names in Atkinson |
| Options and controls, plus the settings inside Pause | **one** Settings Sheet with three sections: Sound, Game, Controls |
| Patch notes, Lore | Sheet + memo Cards |
| Devlog index, memo, Art Room, About | unchanged layout, moved onto the tokens file |

---

## 8. Recommendations, ranked

Effort: **S** is one sitting, **M** is two or three, **L** is more. "Fixes" points at the audit's top 10.

| # | Recommendation | Effort | Fixes | Touches |
|---|---|---|---|---|
| 1 | Clear `--ms-nav-h` when a run starts | S | 6 | minimap, every chip, briefing, catch card |
| 2 | Hide the status layer and minimap whenever a sheet or moment is open | S | 4 | level-up, chest, Lounge, big map |
| 3 | One message router with a headline slot and a ticker slot, tiers, no cutting in | L | 1, 2 | every in-run message (about 110 call sites) |
| 4 | Headline plate under the HUD replaces the center flash. Minimap yields on phones | M | 2, 3 | center flash, boss toast, catch card |
| 5 | Boss arrival: 3.5 s, compact on phones, no floor dim, skip the first-attack banner | S | 1, 3 | every boss |
| 6 | One status row for errands, key hunt, beats, modifier, Workload, buff | M | 5, 8 | six chips in six files |
| 7 | Holds and merges from the budget (errands, swarm events, milestones, promotion, modifier at 50.8) | M | 1 | errands, promotions, modifiers, swarms |
| 8 | Tokens file and size classes. Type never under 14 px. HUD buttons 44 px | M | 7, 8 | everything, gradually |
| 9 | Keep the hero at least 48 px tall on every device | S | 7 | camera zoom, world text |
| 10 | Sheet and Button family on level-up first: one primary, cards as the tap targets | M | 8, 9 | level-up, Performance Bonus |
| 11 | One Settings sheet. Pause keeps only resume, summary and three rows | M | 10 | pause, options |
| 12 | Shop and Lounge on the Row. Balance in the header | M | 9, 8 | 401(k) shop, Lounge, Lemonade Stand |
| 13 | Title: PUNCH IN is the only orange thing at every size. Stage and mode become one visible row | M | 9, 10 | title screen |
| 14 | Game over and retirement as moments: score and age first, RETRY primary, pay stub folded | M | 9 | game over, retirement |
| 15 | Wording pass: plain verbs, one strip pattern, no developer words, no emoji in gameplay | S | 10 | all menus |
| 16 | Palette cleanup: off-palette colors, russet text, teal text | S | 8 | HUD, chips, strips |

---

## 9. Migration plan

One surface per sitting, in this order. Each ends playable. Each has a test Rami can do on his phone.

**Part A: where to look (in-run messages)**

| # | Session | Done when |
|---|---|---|
| A1 | Foundations: add the tokens file (no visual change), fix `--ms-nav-h`, hide chips and minimap under menus | On a phone the minimap sits right under the HUD. Open a level-up during an errand: nothing draws over it |
| A2 | Message router: one queue behind `flashBanner`, `showLowerThird`, `Spotlight` and the catch card. Same look | Fire two flashes 200 ms apart: the second waits. Never more than one headline and one ticker on screen |
| A3 | Headline plate under the HUD, with a backing plate. Minimap yields on phones | A swarm alert on the tan floor is readable. On a phone the plate never touches the hero's band |
| A4 | Boss arrival: 3.5 s, compact phone band, no dim, first-attack banner skipped | Spawn each boss: the floor is never dimmed, the band is gone before the second attack |
| A5 | Status row: one objective chip + one status chip | Errand + modifier + buff at once on a phone: no overlap, minimap untouched |
| A6 | Holds and merges (data + small code) | Age 45 on a phone: at most one headline and one ticker at any time. At 50: one birthday line |
| A7 | Ticker position and world text: lifted on touch phones, one bubble style, caps on pop-ups | Play with your thumb down: you can read every ticker line |
| A8 | HUD: age first, 44 px buttons, owned slots only, scaled by size class | On iPad the HUD and hero are comfortably readable from a lap |

**Part B: menus**

| # | Session | Done when |
|---|---|---|
| B1 | Button and Sheet parts, used on level-up and Performance Bonus | One orange button. A controller picks with A, rerolls with X, skips with Y |
| B2 | Pause slimmed down + the one Settings sheet | Sound is in one place, reachable from pause and from the title |
| B3 | Row part, used on the Lounge and Lemonade Stand | Looks the same on phone and iPad, rows are easy to tap |
| B4 | 401(k) shop on Rows, balance in the header | You can see your balance and three items without scrolling on a phone |
| B5 | Title screen | PUNCH IN is the only orange thing on every device. You can see which stage you picked |
| B6 | Game over and retirement moments | Score and age are visible without scrolling. RETRY is under your thumb |
| B7 | Chest, briefing, account prompt, We Moved, retire at 80 | All share the Sheet or Moment shell |
| B8 | Achievements, leaderboard, credits, extras, patch notes, lore | No screen repeats the game logo. No text under 14 px |

**Part C: memos and the devlog**

| # | Session | Done when |
|---|---|---|
| C1 | Devlog and nav move onto the tokens file. Strip label contrast fixed | Game and devlog read from one file. Nothing looks different except the strip label |
| C2 | Wording pass across the game | No developer words, no key lists in buttons |
| C3 | Re-run the audit capture and compare | The top 10 list is retired or re-ranked |

That is 19 sittings. Part A is the one that answers "where should I be looking."

---

## 10. Proposed CLAUDE.md text (replaces "One look (Nov 3)")

> ## One look (design system v1, Nov 2026)
> The game and the devlog are one product. The full spec is `docs/design/design-system-v1.md`.
> - **Tokens only.** Colors, type sizes, spacing, corners, layers and timings come from `assets/ui/ms-tokens.css`. No new hex values, pixel sizes or z-index numbers in code.
> - **Fonts:** Silkscreen for labels of four words or fewer, in caps. Atkinson Hyperlegible for anything you read. Nothing you read is under 14 px. Nothing you tap is under 44 px.
> - **Colors:** the devlog palette only (navy, slate, teal, sage, cream, coffee orange, russet). Coffee orange fill means the one primary button on a screen. Russet and teal never carry small text.
> - **Eight parts:** Button, Row, Card, Sheet, Banner, Toast, Chip, Memo. A new surface is built from these. If it can't be, raise it with Rami before inventing a ninth.
> - **In-run messages go through the router.** Alarms show in the headline slot under the HUD, story in the ticker at the bottom. One of each at most, and one total on a phone during a boss. Only sheets and moments pause the game. Nothing covers the floor around the hero during a boss.
> - **Three size classes:** compact (under 600 px wide), regular, wide (1024 and up), plus a short flag for phones held sideways. No other breakpoints.
> - **Voice:** plain verbs on buttons, the joke in the line underneath. No emoji in gameplay text.
> - **Every screen is checked** at phone, iPad (both orientations) and desktop sizes, with touch, keyboard and a controller, before it ships.
> - **Devlog memos, social post images and the social kit:** unchanged from Nov 6 and Nov 7 (keep those three bullets as they are).

**Instruction check:** this replaces the first four bullets of "One look (Nov 3)" and keeps the three devlog and social bullets as they are. Yes or no?

---

## 11. Still open

- **Phone landscape** is specified here but was not captured in the audit. It needs a real-device check in A8.
- **Safe areas** need Rami's phone. Headless browsers have no notch.
- **The Workload chip** was read from code. It joins the status row in A5.
- **Maple Hollow v2** adds yard sparkles (rung 0), stair transitions (a 320 ms fade, no words), a desk buff (status chip) and yard gag pop-ups (world text, one at a time). None need a new part.
- **Two new things need a yes or no:** the boss meter (5.9) and the phone bottom bar (below).
- **Site nav on the title screen:** on phones it costs 57 px and scrolls sideways. The wireframes replace it with a brand mark and a bottom bar. This changes a shared devlog part, so it needs Rami's eye.
