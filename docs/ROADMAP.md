# Midlife Survivors: Roadmap

Pace: about 3-5 hours a week, 45-90 minute sessions. Every session ends with something playable.
Weekly check-in: Sundays, evening (automatic).

**Current phase:** Next up: healing, interns and the Lounge (feature freeze lifted Nov 3)
**Last updated:** 2026-11-11 (V. 2.29.2, repainted heroes; art redo brief out)

---

## Rami's to-do list (kept current by Claude; updated Nov 7)
Things only Rami can do. Claude adds items as they come up and checks them off when they're done.

**Next session (Rami said yes, Nov 8)**
- [x] Sync the Desktop folder with GitHub (Nov 9: it was already Codex's git copy; now up to date)
- [x] Build Your New Boss (Age 26) at 48 (V2.12.0)
- [x] Play to 48 and fight him: fair? funny? too easy? (Nov 9 playtest: too easy, lame defeat; fixed in V2.15.3)
- [x] Age-56 slot + The Holiday Party (V2.13.0)
- [ ] Reach 56 and meet the Party: is the slow fair? does the conga line read?
- [x] The Reorg (V2.14.0)
- [ ] Meet the Reorg at 56 (it's a coin flip with the Party): do the desks read? fair?

**Level art pass (Nov 11, from the audit: `docs/design/level-art-audit-2026-11.md`)**
- [x] Audit: why the levels don't look like the art (three leaks: display, translation, composition)
- [x] Rami: yes to "Pixel rules for the world" in CLAUDE.md
- [x] Sitting 1 (V2.29.0): crisp pass. Hard edges, whole-number zoom, Camera setting (Close/Wide), green grid fixed
- [ ] Rami: look at V2.29.0 on your MacBook, phone and a 1080p screen. Sharper? Pick the default camera: Close or Wide
- [x] Rami: pasted the Pixel rules block into the Project's custom instructions (Nov 11)
- [ ] Rami: hand Codex `docs/handoffs/codex-level-art-pass.md` (Job 1 heroes and Bill, Job 2 house fill, Job 3 Maple Hollow trees and greens), one job at a time
- [x] World rules approved (wall, breakable, walk-through; 96 px gaps; two exits; trees contain the level), in CLAUDE.md
- [x] Backyard quick fix (V2.29.1): gates and hedge steps 96 px wide
- [x] Codex Job 1: four hero sheets approved and live (V2.29.2). Bill goes back for a third try
- [x] Codex Jobs 2 and 3 reviewed and rejected: built from code shapes, flat. PR #1 stays unmerged
- [x] New rule in CLAUDE.md: world art is painted, then reduced by a whole number
- [x] Rami: send Codex `docs/handoffs/codex-level-art-redo.md` (a sample of eight first, then stop)
- [x] Sample of eight approved (PR #2). The painted Bill is live (V2.29.3)
- [x] Codex Batch A reviewed (PR #3): trees, pines, shrubs and the four wall sides approved. Corners go back (trees twice the size of the sides, hard seams)
- [x] Tree wall live on all four sides of Maple Hollow, camera locked inside it (V2.29.5). Corners were plain side pieces until V2.29.6
- [x] Codex corner redo approved and live (V2.29.6). Batch A is done
- [ ] Rami: tell Codex to start Batch B (yard furniture as separate sprites, plain yards, props, fences, lawns)
- [ ] Rami: walk the edge of Maple Hollow. Does the forest feel like the end of the world, or does the street running into trees look odd?
- [ ] Place the new trees and shrubs as their own sprites (waits for Batch B's plain yards; today's trees are painted into the yard pictures)
- [ ] Rami: paste the two new CLAUDE.md lines into the Project's custom instructions
- [ ] Sitting 2: true sizes. Enemies, pickups and yard props at 1x or 2x, hitboxes unchanged
- [ ] Sitting 3: heroes and Bill. Colors by material (the khaki slacks), then a clean-up round on the Sprite Board
- [ ] Sitting 4: fill the big house (same as Maple v2 step 2c), with art sized to the rooms
- [ ] Sitting 5: Maple Hollow trees, bushes and greens (new ChatGPT brief), placed by hand
- [ ] Sitting 6: office density (Lobby and Parking first) and a lighter darkness layer

**UI/UX pass (Nov 10, design lead chat)**
- [x] Audit: 60 surfaces at 4 device sizes (`docs/design/ui-audit-2026-11.md`)
- [x] Rami's 8 open decisions: yes to all, with a headline slot under the HUD for the phone banner
- [x] Design system spec, wireframes and before/after mockups: **ready for review** (`docs/design/design-system-v1.md`)
- [x] Rami: yes to the boss health bar and the phone bottom bar
- [x] Rami approved the design system and the new "One look" text for CLAUDE.md (spec section 10)
- [x] Migration A1 (V2.26.1): tokens file, minimap and chips placed from the HUD's real bottom, hidden under menus, new "One look" in CLAUDE.md
- [x] Migration A2 (V2.26.2): one message router; center flashes, Spotlight cards and the catch card take turns by importance
- [x] Migration A3 (V2.26.3): headline plate under the HUD with a solid backing; minimap steps aside on phones
- [x] Migration A4 (V2.26.4): boss cards 3.5 s, no floor dim, compact on phones, first-attack notice skipped while the card is up
- [x] Migration A5 (V2.26.5): one status row, one objective chip + one status chip; beside the minimap on phones
- [x] Migration A6 (V2.26.6): holds and merges; errands, Lounge and swarms wait their turn, one birthday line, modifier at 50.8
- [x] Migration A7 (V2.26.7): ticker lifted above the thumb on touch phones, one speech-bubble style, at most 6 pop-ups at once
- [x] Migration A8 (V2.26.8): HUD with age first, 44 px buttons, owned slots only, hero at least 48 px on phones, sideways-phone layout
- [x] **Part A (where to look) done.** Rami to playtest on his phone, then Part B (menus)
- [x] Migration B1 (V2.26.9): Button + Sheet parts; level-up and Performance Bonus with one orange PICK; A picks, X rerolls, Y skips
- [x] Migration B2 (V2.27.0): one Settings sheet (Sound, Game, Controls) from Pause and the title; slimmer pause
- [x] Migration B3 (V2.27.1): Lounge and Lemonade Stand as a Sheet of Rows; price tags, locked reasons, balance at the top
- [x] Migration B4 (V2.27.2): 401(k) shop on Rows, balance up top; six upgrades visible on a phone without scrolling
- [x] Migration B5 (V2.27.3): PUNCH IN the only orange thing; shift chip names the stage; phone tab bar replaces the site nav on the title
- [x] Migration B6 (V2.27.4): game over and retirement as Moments; score, age and RETRY above the fold everywhere; pay stub folded
- [x] Migration B7 (V2.27.5): chest, briefing, account prompt, We Moved and retire at 80 share the Sheet/Moment shells; one orange button each
- [x] Migration C1 (V2.27.6): the devlog and the top bar read colors and fonts from the game's tokens file; the cream strip label is navy
- [x] Migration C2 (V2.27.7): wording pass; no developer words or key lists on buttons (controls screen rewritten)
- [x] Migration C3: audit rerun. 6 of the first top 10 retired, 3 better, 1 (old CSS underneath) unchanged. New list in docs/design/ui-audit-c3-2026-11.md
- [x] Photosensitivity (V2.28.2, Kevin's playtest note): flashing lights warning on first visit, Reduce flashing in Settings > Game, and a flash cap for everyone (one screen flash per 0.6 s, a few white kill pops per beat)
- [ ] Rami: check a maxed-out late run with Reduce flashing off, then on. Still strobing anywhere?
- [ ] Settings sheet draws behind the title tiles on desktop (seen in a headless test, also on V2.28.1). Confirm in a real browser
- [x] Alerts say it once (V2.27.8): headline only, ticker as a fallback
- [ ] Next: iPad nav overlap (brand under TITLE SCREEN); then old CSS cleanup; then Maple Hollow v2 step 2
- [x] Migration B8 (V2.27.9): extras, achievements, scores, credits, patch notes and lore on one header; no repeated logo; nothing under 14 px. Part B done

**From the Nov 9 playtest notes (Claude builds, in this order)**
- [x] Boss bite: New Boss tougher, real defeat moment, weapons pop Group Chat pings (V2.15.3)
- [x] Errand payoff: shockwave, bonus XP on every errand, 15 s CHECKED OFF buff, up to 3 errands per run (V2.15.5)
- [x] Late-game XP: Performance Bonus pick every 75 s without a level-up after 55, faster with Workload (V2.16.0)
- [x] Polish: phone vibration sound and controller screenshot button (V2.18.2)
- [x] Coffee cart moved onto the lounge rug by the coffee table (V2.18.3)
- [ ] Later: HOA President and Midlife Crisis car move to Maple Hollow; Lounge cosmetics shop (Rami's "64-bit" look idea)
- [x] Clean Out Your Desk at 68.5 (V2.17.0)
- [x] The Reunion (V2.18.0)
- [x] Then: the polish items
- [x] Maple Hollow step 1: walkable neighborhood + LOCATION picker (V2.19.0)
- [x] Maple Hollow: locked out + spare key (V2.19.1), inside your house, 3 rooms (V2.20.0)
- [x] Maple Hollow step 4: home enemies, toy bricks, Lemonade Stand (V2.21.0)
- [x] Maple Hollow boss lineup (V2.21.2): HOA 48, Mortgage 52, Holiday Party 56, V8 60
- [x] Maple Hollow step 5a: Fifth-Grade Math Homework boss at 45 (V2.22.0)
- [x] Maple Hollow step 5b: the garage, and the V8 bursting out of it at 60 (V2.23.0)
- [x] Maple Hollow v2 step 1: the outside at twice the scale, side paths, connected backyards, your real house (V2.26.0)
- [x] Maple Hollow v2 step 2a (V2.28.0): the big house ground floor (option C, rooms 2x wide) and the front-door walk-through
- [x] Maple Hollow v2 step 2b (V2.28.1): upstairs (Abe's room, the main bedroom) and the stair climb both ways
- [ ] Check in a real browser: do the walkers near the stairs follow you up? (the slow test browser couldn't show it)
- [ ] Rami: hand Codex the art direction audit brief (docs/handoffs/codex-art-direction-audit.md): sprites in motion, effects, bosses, UI over art, and an art request list
- [ ] Maple Hollow v2 step 2c: fill the big rooms (rugs, plants, lamps, shelves, from Rami's photos) and your desk's Ship It buff
- [ ] Maple Hollow v2 step 3: one thing to do in each backyard, the desk's Ship It buff, Grok's spawn rules
- [ ] Later (Rami): make sure the office doesn't feel light on bosses
- [x] Art saved for later builds: Reunion cast, Maple Hollow kit + 6 houses + 4 enemies, retro skins for all 3 heroes, Overtime UI kit
- [x] Rami decided: Lounge cosmetics are bought in the Lounge, this run only (V2.17.3, Polygon Upgrade)

**Play and react**
- [ ] Fight the New Boss again (V2.15.3): tough enough now? does the defeat feel good?
- [ ] Play V. 2.10.22: do the Close Call afterimages read clearly?
- [ ] Try one Ben-style run: stay close to the crowd, check your level by 55
- [ ] Play V. 2.10.23: does catch-up XP get you through the 50s?
- [x] Cut scene beats: the title card stays, on the new title slide (Nov 8)

**Decide**
- [x] Code ping sound: C, the bubble pop (Nov 8)
- [x] Cut scenes: at most three (start, middle, end); Performance Review became a title slide (Nov 8)
- [x] Memo 13: Darvin's notes (headers in your words, cover color cooled, memo pages redesigned)

**Do**
- [x] Add the `build` column in Supabase (done Nov 8)
- [ ] Optional: a real photo of the school run for a future memo (Darvin's note; you kept the AI cover for 13)
- [x] Final read and OK on Memo 13, then publish (published Nov 7)
- [ ] Part-Time Job stage: jot down the Apple lore and inside jokes you want in it
- [x] Send Kevin the merch zips (he already ran them through Meshy)

**Merch (from the 3D chat)**
- [ ] Run the Medical Bill turnaround prompt in ChatGPT (`art/merch/medical-bill-turnaround-prompt.md`, attach the sprite) and drop the result in `assets/characters/merch/`
- [x] **Memo 14: Achievement Unlocked: Gaussian Splatting** published Nov 11, with the in-game achievement (V2.29.4) and the social kit (files on Rami's Mac)
- [ ] Post the Memo 14 kit: Reel, carousel, Story, Facebook, LinkedIn (captions in docs/social/14-posts.md)
- [ ] Memo 15: answer the interview questions (`docs/devlog-plans/how-i-write-these-memos.md`)

**Waiting on others**
- ChatGPT: redraw the Performance Review frame with the loose shoe (handoff after the beats are picked)
- Abe: soundtrack noodling, no deadline

---

## Fun Pass (current focus, Oct 30)
One objective per session. Build it, publish it, Rami plays it, then move on.
1. [x] **Clean screen HUD:** XP bar on top, age in the middle, HP under the player, 3D views parked (V. 1.9.0)
2. [x] **Lower third:** on-demand strip for alerts, first-time tips, chapter cards and rewards, one at a time (V. 1.10.0)
3. [x] **Title screen:** pick a character, then Start. Shop, Options and Extras sit behind buttons (V. 1.11.0)
4. [x] **Hints toggle:** GAME TIPS on/off in the Pause menu (V. 1.12.0)
5. [x] **Menu fixes:** sub-menus open on top, Game Over shop button goes to the shop, lower third waits during menus, pause opens on Resume and is shorter, HUD hidden behind title and Game Over (V. 1.13.0)
6. [x] **Credits, not cameo:** the photographer is now The Soccer Dad, Grad Student lore made generic, Credits screen in Extras (V. 1.14.0)
7. [x] **Run length:** 1 minute per year, retirement bonus at 80 with no stop screen, Death at 100 is the only win (V. 1.15.0)
8. [x] **Intensity curve + swarms:** packs that grow each decade, smooth ramp, bigger crowds with age, 7 announced swarm events (V. 1.16.0)
9. [x] **Enemy variety:** 3 AM Thought (ghosts in and out), Calendar Invite (straight-line charge), Group Chat (ranged pings), Math Homework (shrinking spiral), plus 3 new swarms (V. 1.17.0)
10. [x] **More weapons:** TV Remote (boomerang), Spreadsheet (orbit), Podcast at 2x (piercing line), each with level-ups and an evolution (V. 1.18.0)
- [x] **Scores + leaderboard:** score at Game Over, name entry (no accounts), top-10 board on Game Over and the title screen (V. 1.19.0). Online via Supabase once Rami connects it; on-device until then.
11. [x] **First twist: Errands:** a To-Do List marks spots on the map, shown in the lower third (first errand live Nov 8, V. 2.11.0; more errands after Rami plays it)
12. [ ] **Art direction + bigger world:** Rami's mood board, then a larger, detailed pixel-art office full of funny details, and restyled sprites and UI (including the lower third)

---

## Game plan after V. 2.0 (set Nov 4, Rami by voice)
V. 2.0 shipped Nov 4: playable start to finish, a hero and a mode to unlock, art mostly in. Work these in order, one at a time.
1. [x] **Minimap HUD (V. 2.1, first version with placeholder art; ChatGPT art brief out).** Once you find the map, a small corner map fills in as you explore: a dot for you, door icons that flip from locked to open when you get promoted, and markers for chests, the Lounge and nearby interns. Tap it (or press M) to open it big with the game paused. Keep it small and hideable on phones. Builds on the test map in the Art Room.
2. [ ] **New stages: St. Deductible Hospital and the home neighborhood.** Pickable from the title screen like Vampire Survivors' stage select, each its own short run with its own enemies, boss and gimmick, unlocked by an achievement. (Why: only about 4% of runs reach 65, so stages hidden deep in Full Life would go unseen.) Later, Full Life can chain them: office, then hospital, then home. Ideas already in GAME_DESIGN: the hospital's newborn and 3 a.m. feedings challenge; the home's LEGO-brick floor hazards and a New Math boss.
3. [ ] **Phone apps (iOS and Android).** See "Phase B2" under Platforms.
- [x] **Real music** from Rami's Flow Music tracks (V. 2.7.9). Sound effects next.
- [x] **Coin economy** (V. 2.8.0): paycheck, late taper, lifestyle inflation. Tune from Rami's ledger run.
- [x] **Day One Lounge cart** (V. 2.8.2-2.8.5): Lounge weapons, run perks and Emergency Contact in the Lobby for the first minute.
- [x] **First Day / first-minute pass** (V. 2.9.0). Re-check first-run deaths before 42 after a week of data.
- [x] **Coworker sprite cleanup** (Paul, Nov 5; done V. 2.9.2: working ~2%, idle under 1.1%, no holes): idles that explode with changed pixels, plus see-through holes visible on the Sprite Board's magenta backdrop. ChatGPT brief next.
- [x] **Controller pass** (V. 2.10.0; Rami's Nov 5 playtest on iPad + TV): title screen order and PUNCH IN reach, shop up/down, scrolling the Shift Ended screen, Devlog/Art Room/About scrolling and back, non-selectable current nav tab, shortcut buttons (map, shop), menus closing too easily, menu responsiveness.
- [ ] **Boss and stage fit** (design talk): Mortgage and Midlife Crisis car may move to the neighborhood stage; brainstorm office-only replacements.
- [ ] **Hero art polish (Paul McKinney's review, Nov 5).** Step 1 done (V. 2.7.11): walk rows redrawn so the legs alternate. Step 2 near the end: a polish round on the four heroes drawn natively at game size, with readable small details (Mario's mustache idea), and calmer idle loops for the seated coworkers. Check every change on the Sprite Board (`tools/sprites.html`, CHANGED PIXELS view).
- Still open from V2: Lounge redo (Rami sent photos of the real student lounge Nov 4; ChatGPT brief out), Abdel's music, Errands, a Daily Challenge.

## Kevin's notes (Nov 6)
- [x] Bigger, glowing pizza and Desk Salad (V2.10.8)
- [x] Bigger Group Chat shots with an orange ring (V2.10.8)
- [x] **Active effects list** in the pause menu (Ghost Hour, Rent Hike and the rest, with a plain-English line each) (V2.10.10)
- [x] **A real butterscotch** on the Executive Wing credenza (small heal + joke line; needs a tiny art request) (V2.10.11)
- [ ] **Our own instant-message sound** for Group Chat pings (ElevenLabs; original, not the AIM sound)

## Merch with Kevin (Nov 6, side quest)
- [x] Prep merch-ready sprite files for Kevin: Medical Bill, regular Bill and the four heroes (native PNG, 8x, 16x, silhouette, palette notes) in `art/merch/`
- [x] Rami sends `bill-merch-pack.zip` and `heroes-merch-pack.zip` to Kevin
- [ ] Rami replies to Kevin's "what were you thinking": keychains, magnets and stickers first; bobbleheads and fidget toys later
- [ ] Settle with Kevin who covers material and shipping before any batch becomes a Ko-fi reward
- [ ] Ask Kevin his build-plate size and whether he wants STL or 3MF (only matters if Claude ends up generating models)
- [x] First 3D test: Kevin ran the sprites through Meshy Pro (Nov 7). Medical Bill came out great, if a little Disney. GLB saved in `art/merch/3d/`
- [ ] Kevin builds a Meshy agent ("sixteen-bit-to-voxel-3d") tuned to the game's style; Rami collabs to learn it
- [ ] Feed the agent front/left/right/back views instead of one sprite (Kevin's suggestion; the bobblehead turnaround prompt already does this)
- [ ] Get the Medical Bill GLB into Blender: check scale, fix any holes, add a flat base, export STL for a test print

## Devlog to-do (Nov 6)
- [x] **Memo 13: the music memo.** Interviewed Nov 7 (car ride to Costco). Published Nov 7 after Darvin's notes and the memo page redesign.
- [ ] **Memo 13 follow-ups:** ~~Spotify playlist~~ (done Nov 7, linked in Memo 13 and the playlist card); "Abdel's tracks" option in the music settings once he records something; Ben prefers the original tracks (logged, ask him what he misses).
- [ ] **Side quest:** an Instagram reel of our characters doing the Paradise (Harachan) office-skit video, AI video. Reel only; the song can't go in the game or devlog.
- [ ] **Memo 15: how I write these memos.** Answer the interview questions in `docs/devlog-plans/how-i-write-these-memos.md` (why your own words matter, what Claude gets wrong in your voice, the edit that mattered most in Memo 12, editing memos vs editing photos, what you're still unsure about).

## Now (Nov 3)
- [x] Bonus chests, elites, poster title, one look, lighting, dev console (V. 1.48 to 1.60)
- [x] **Healing 1:** birthday cake every 5 years and the Desk Salad (V. 1.61.0), freeze safety net (V. 1.61.1)
- [x] **Healing 2:** interns (TJ, Derek) bring coffee, snacks and buffs (V. 1.62.0)
- [x] **Healing 3:** the Lounge counter in the Break Room (V. 1.63.0); title version line and credits (V. 1.63.1)
- [x] **Retirement screen** with ChatGPT's art (V. 1.64.0)
- [x] **Age 50+ run modifiers** (V. 1.65.0)
- [x] **Spotlight cards, Style B** (V. 1.66.0) (copy from Gemini: docs/handoffs/gemini-spotlight-cards.md)

## Next up (planned Oct 31, usage-light: one session per item)
1. [x] **Playtest fix pack (V. 1.20.0):** Retry touch bug, tap-to-confirm perks, joke wrapping + quieter jokes, Start over Resume, plain rarity labels, coin economy fix, softer first minutes, leaderboard shows personal bests only with no top-10 cap
2. [x] **Core 19-minute run (V. 1.21.0) (ages 40 to 65, 45 s/year):** short Midlife mode as the main game, Overtime unlocks, Full Life (to 100) as an unlockable mode, separate leaderboards
3. [x] **Content drop + items (V. 1.22.0):** new jokes and death lines, Annual Checkup replacements, discoverable items (magnet, energy drink, more)
4. [x] **Achievements (V. 1.23.0)** (one unlocks Full Life)
4b. [x] **Grok difficulty handoff, Parts 1 and 2 (V. 1.25.0)**
4c. [ ] **Grok Part 3, one at a time:** ~~Tax Bracket (V. 1.26.0)~~ done, ~~dynamic intensity (V. 1.27.0)~~ done, ~~near-miss rewards (V. 1.30.0)~~ built, awaiting playtest, ~~age-50+ run modifiers~~ built V. 1.65.0
5. [ ] **Art pass** with GPT Image assets Rami prepares in parallel. Campus study now includes three desk variants and walking sheets for all three playable characters. Explore As switches characters; the gallery compares four directions and exports native grids. Approved walking sheets now run in the main game (V. 1.28.13); extra idle/combat poses remain pending.
   - Batch 1 enemy generation complete: ten enemy species plus Group Chat ping, 11 native sheets and 42 frames. Review animated enemies from the Art Room, with pause, pose, scale and floor controls. Approved Batch 1 is integrated in V. 1.28.12 with independent canvas fallback; bosses remain a separate batch.
   - Office environment study: detailed Accounts Payable with seamless carpet/wood, fluorescent lighting accents, native printer/cabinet/plant props and floor-level stories. Visit Accounts opens it directly. Expanded ground pass now adds brighter carpet, welcome rug, chair mats, floor wear, paper trails and cream lighting. Rami approved the larger exploration scale. Furniture now has fitted contact shadows, visible chair mats and nearby floor wear; grounded room art and repeating campus now run in the main game (V. 1.28.13), with crowd-pressure QA completed.
5b. [ ] **Stage art pass (Rami, Nov 1):** the office needs to be more pixel-art forward, friendly and funny. Many different desk setups and break-room clutter, with inside jokes hidden in props (a "Reply All" mug, a fern that has given up). Rami sends his own inside jokes; Claude turns them into a prop list for ChatGPT.
   - [x] **Overview v2:** unequal wings, 13 dressed fighting spaces, Lobby/Bullpen starting area and age-gate review. Parking Lot v1 approved as density/scale target; previous square-grid overview superseded. Promotion schedule and 72-family modular kit are proposal data, not live gameplay.
   - [x] Rami approved v2. Every doorway retains a 224px clear opening; hidden Archive entrance readable but subtle. Claude owns runtime flow-field navigation and locked-area spawn filtering.
   - [x] Stage 2A first art batch: 13 prop/poster families, 31 colorways, native hero/Bill comparisons, manifest and gate-clearance study. Review in the Art Room.
   - [x] Stage 2B: 12 literal-slang/landmark families, 24 colorways. Total kit now 25 families and 55 colorways, with batch filters and native comparisons. New batch is art-only; Claude's current-office integration and navigation are preserved.
   - [x] Stage 2C and start-area slice: eight new prop families, corrected ducks, static coworkers, 35 desks in five clusters, dressed floors, modular boundaries and two closed 224px promotion doors. Total kit: 33 families, 79 colorways. V. 1.31.0.
   - [x] Stage 2D: Parking Lot and Break Room built behind closed age-45 doors, eight new prop families and two car paints, 224px routes, closed age-50 doors. V. 1.36.0.
   - [x] Age-45 doors open with a PROMOTED banner (V. 1.37.0).
   - [x] Stage 2E: Server Room and three glass Conference Rooms behind the age-50 doors, closed Executive door at 55. Approved; doors open at 50 in V. 1.39.0.
   - [x] Stage 2F: Executive Wing behind the age-55 door, crash cart smashable. Approved; opens at 55 in V. 1.41.0.
   - [x] Stage 2G: Wellness Corner behind the age-60 door (moved beside Conference). Approved; opens at 60 in V. 1.42.1. Every Midlife promotion now leads to a room.
   - [ ] Later: animated coworkers, remaining prop families, Full Life (60+) districts.
5d. [ ] **Combat feel pass (Rami, Nov 2, after playing Nerd Survivors).** One at a time:
   - [x] **Bigger enemies (V. 1.32.0):** regulars about hero-sized (now 25 to 42px vs a 56x60 hero), bosses 2 to 3x the hero.
   - [x] **Art package ready for Rami review (Nov 2, Codex):** eight breakable families in all 18 colorways, 54 state frames / 108 debris cells, and three native Midlife bosses with 33 poses and three telegraphs. Art only; runtime features below remain pending.
   - [x] **Break things for loot (V. 1.35.0):** most small office props smash open (printers, cabinets, vending machines, trash cans). The good loot hides there. Big structures (walls, desks) stay solid.
   - [x] **Bosses with their own attacks (V. 1.34.0):** each boss gets a telegraphed attack and look (charges, shockwaves, summons). Spec from Grok, art from ChatGPT.
   - [x] **Smoother animation:** 8-frame enemy sheets from ChatGPT (V. 1.45.0); hit flash, squash and stretch, knockback and a death poof in code (V. 1.33).
   - [x] **Death and hit effects (V. 1.33.0):** pop, squash, flash and a little burst when enemies die; small dust puffs and bumps when you move or touch enemies.
   - [x] **Sound sliders (V. 1.33.0):** separate volume for music and effects.
   - [x] **Sound effects pass ("beautiful chaos", V. 1.33.0):** several variations per sound, random pitch, a cap on how many play at once, and layering so big fights sound rich instead of repetitive.
   - [x] **End-of-run summary (V. 1.33.2):** achievements earned this run, what they unlocked and how that changes your next run.
   - [x] **Track damage taken per run (V. 1.33.0)** (needs one new column in the runs table).
   - [ ] **Music by Rami's son** (guidance in GAME_DESIGN.md).
   - [x] Plants regrow (V. 1.32.2). [x] Tougher first minutes (V. 1.32.2).
   - Also considering: bigger early crowds, office mess that lingers (paper scraps, coffee rings), build icons on the HUD.
5c. [x] **Enemy navigation (V. 1.29.0):** flow field so swarms walk around furniture and through doorways; spawns avoid furniture and unreachable (locked) areas. Gates hook in via `window.navExtraBlockers`.
6. [ ] **Discoverable map + bigger world:** Rami chose exploration and Corporate Campus. Separate blockout ready in Extras > Art Test: 3072x2048 floor (5.5x previous area), seven areas, explored-path map and five optional finds. Central lanes are 224px, outer loop 192px. Test navigation first, then crowd pressure before main-game integration.
7. [x] **Accounts / cloud saves** (live Nov 4, V. 1.85.0: Google sign-in and cloud saves. Still to do: email codes for players (Resend + ramidaud.com at directnic), Apple if wanted)
8. [ ] Errands, Daily Challenge, gallery
9. [ ] **Version archive + devlog:** git tag each major version, screenshots in `devlog/img/`, one devlog post per milestone (devlog page started in V. 1.20.0). Office exploration draft now has a 1536x1024 illustrated cover with a quiet left third; awaits Rami approval
10. [ ] **AI layer (proof of concept):** LLM-generated dialogue, then LLM character creation

## Phase 0: Setup and first pixels (week 1)
- [x] Create project folder, CLAUDE.md, design doc, roadmap
- [x] Schedule weekly check-ins
- [x] Rami answers the open questions in GAME_DESIGN.md (at least the Top 10 annoyances)
- [x] "Hello game": a square on screen that moves with arrow keys / WASD
- [x] Publish the first playtest link
- [x] Rami plays it on laptop and phone
- [x] Learn: what a game loop is

## Phase 1: Core loop (weeks 2-3)
- [x] Player moves smoothly; camera follows across an endless floor
- [x] Bills spawn offscreen and chase the player
- [x] Coffee Splash fires automatically (aims at nearest Bill; hits come next)
- [x] Enemies take damage and disappear; player takes contact damage
- [x] Game Over screen with a funny cause of death
- [x] Learn: collisions, spawning (delta time comes up later)

## Phase 2: Growing stronger (weeks 4-5)
- [x] Wisdom gems drop and get collected
- [x] Level-up screen with 3 choices
- [x] 3 weapons and 2 passives working
- [x] Age clock (40 to 50) replaces the timer
- [x] Learn: data-driven design (editing src/data files yourself)

## Phase 3: The midlife run (weeks 6-8)
- [x] Wave schedule tied to age
- [x] 6+ enemy types, including an elite
- [x] Bosses: Performance Review, Mortgage Refinance, Midlife Crisis
- [x] Evolutions (at least 2)
- [x] Win screen at 50
- [x] Learn: difficulty curves and balancing

## Phase 4: Feel and look (weeks 9-10)
- [x] Decide art direction (procedural pixel-art sprites in src/sprites.js)
- [x] Hit flashes, damage numbers, screen shake
- [x] Sound effects and music
- [x] Title screen
- [x] Learn: "game juice" and why it matters

## Phase 5: Coming back for more (weeks 11-12)
- [x] 401(k) Coins and the permanent upgrade shop
- [x] Save data between sessions
- [x] 2-3 unlockable characters
- [x] Learn: saving data, meta-progression

## Phase 6: Share it (week 13+)
- [ ] Playtest with friends or colleagues and collect notes
- [x] Decide the platform goal (Nov 1): Steam first, then PlayStation and Xbox. See "Platforms" below.
- [ ] Optional: tie a write-up into EMAT coursework or Framing the Cosmos-style storytelling

## Platforms: Steam, then consoles (goal set Nov 1)
Full write-up: [Platform Roadmap doc](https://claude.ai/artifact/QVWrudNVvGRGWPHXN3jtsk). Steam is realistic with the current Phaser code. PlayStation and Xbox can't run browser code, so consoles mean a Unity rebuild or a porting studio or publisher.

**Phase A: Finish the browser game**
- [ ] Fun Pass and visual pass done (enemies, bosses, pickups, icons)
- [ ] Stage art pass: friendlier, funnier, lots of props and inside jokes
- [x] Auto-post changelog, memos and stats to Discord (Nov 4)
- [ ] Grow the Discord and devlog audience; collect playtest notes

**Phase B: Steam**
- [ ] Wrap as a desktop app (Electron or Tauri), the way Vampire Survivors first shipped
- [ ] Steamworks account and app fee, store page, capsule art, trailer
- [ ] Steam achievements, cloud saves, full controller support, Steam Deck testing
- [ ] Wishlist campaign; consider a free demo and Steam Next Fest

**Phase B2: Phone apps, iOS and Android (added Nov 4, before consoles)**
The game already runs in a phone browser, so this is a wrapper, not a rebuild. Rough size: a few focused weekends.
- [ ] Wrap the game with Capacitor (one codebase, an app shell for each store)
- [ ] Trim graphics memory further (iPad Safari already struggled) and test on older phones
- [ ] Apple Developer account ($99/year, build on Rami's Mac) and Google Play account ($25 once)
- [ ] Hide the Ko-fi tip links in the iPhone app (Apple doesn't allow outside payment links)
- [ ] Store pages, screenshots, privacy labels, and app review

**Phase C: Consoles (PlayStation, Xbox)**
- [ ] Apply to ID@Xbox and PlayStation Partners for dev kits
- [ ] Port: Unity rebuild (what Vampire Survivors did for consoles) or a porting studio
- [ ] Strongly consider a publisher for porting, certification and console marketing
- [ ] Certification: performance, controller-only menus, platform save rules, ESRB/PEGI ratings

**Keep doing now so a port is easier:** content stays in data files, every menu works with a controller, art stays in clean native sprite sheets, no browser-only shortcuts in core gameplay.

**Open questions:** self-publish on Steam or pitch publishers early? Budget for the Steam fee, trailer and capsule art?

## Phase 7: Life Chapters, Diverse Environments & Interactive Challenges (Planned Expansion)
- [x] **Multi-Stage Biome Architecture (`src/data/stages.js`):** 5 unlockable environments (`🏢 The Open-Plan Office`, `🏥 St. Deductible Hospital`, `🏡 Suburban Home & Yard`, `🍻 The Social Courtyard`, `🌴 Sunset Palms Resort`) with multi-zone procedural floors, 3D sky palettes, and Title Screen Stage Selector
- [x] **Full 4-Device Input Mapping & Input Configuration Screen (`#controls-modal`):** Complete playability and live rebinding across **Keyboard**, **Mouse** (Hold-Click Steer, Cursor Auto-Follow, Click & Drag, Right-Click & Wheel actions), **Touch** (Floating Stick, Fixed Left/Right Thumbstick, Direct Touch Follow & Sensitivity), and **Video Game Controller** (live button listening, cycling, and deadzone config) persisted in `localStorage`
- [x] **Broadcast Lower-Third HUD & Contextual Story/Help Engine (`#hud-lower-third`):** Moved the HUD console to the bottom lower third to keep the upper 82% of the screen and 3D horizon unobstructed, adding a live **Contextual Storytelling & In-Game Help Ticker (`#hud-context-bar`)** and **On-Screen Situational Radar (`#hud-radar-row`)**
- [x] **Version Tracking Stamp & Release Notes Dossier (`src/data/version.js` & `#changelog-modal`):** Added live version and date badge (`V. 1.8.20 • Last updated on: Oct 30, 2026`) on the Title Screen, Pause Menu, and Lower-Third HUD, plus an interactive **Patch Notes & Version History Modal (`#changelog-modal`)**
- [x] **World Mythos, Subject Backstories & Scenario Lore Archive (`src/data/lore.js` & `#lore-modal`):** Created the official lore bible (*Form W-40: The Great Compounding*, the 3 Playable Subject Dossiers, the 5 Life Scenario Backstories, and the 7 Milestone Boss Profiles), displayed in an interactive 4-tab **Mythos & Lore Modal (`#lore-modal`)** and a live **Subject Bio Preview Strip (`#title-subject-bio`)** on the Title Dossier
- [x] **401(k) Compound Interest Scaling & 5-Year Survival Dividends (`src/data/pickups.js` & `src/main.js`):** Coins scale in value from `+1k` up to `+6k+` per coin across 6 Compound Yield Tiers (`1x Match` -> `2x Vested` -> `3x Seniority` -> `4x Executive` -> `5x Compound` -> `6x Golden`) the longer you survive, paired with automatic **5-Year Compound Dividend payouts** (`Ages 45, 50, 55, 60, 65, 70, 75, 80+`) and a live HUD Yield Pill (`#hud-yield-pill`)
- [x] **Full Mobile Viewport Scaling (Portrait, Landscape & Safe-Area Support `V. 1.8.22`):** Added `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">`, iOS/Android safe-area insets (`env(safe-area-inset-*)`), `94dvh` touch-scrollable modals (`touch-action: pan-y`), and dedicated breakpoints for Mobile Portrait (`max-width: 768px`), Mobile Landscape (`max-height: 520px`), and Coarse Pointer devices (`(pointer: coarse)`)
- [ ] **Stage 2 Mechanics (🏥 Hospital & Birth):** Custom hospital props (rolling IV stands, triage curtains, heart monitors) + **3 AM Sleep-Deprivation / Newborn Feeding Challenge**
- [ ] **Stage 3 Mechanics (🏡 Home & Parenting):** Custom suburban home props (minivans, backyard grills, toy chests), **LEGO-Brick Floor Hazards**, and **Boss: Common Core New Math**
- [ ] **Stage 4 Mechanics (🍻 Social Courtyard & Navigating Friendships):** Custom bistro/patio props + **Friendship Battery / Group-Chat Scheduling Challenge** (reach RSVP zones before flaky friends cancel at 6:45 PM)
- [ ] **Stage 5 Mechanics (🌴 Senior Resort 80-100):** Golf-cart obstacles, pickleball nets, and Early-Bird Buffet rush events

### Title background review (Nov 1, Codex)
- [x] Three 1920x1080 pixel-art concepts saved with prompts: swarm, midlife panorama and 8:59 lobby. Lobby includes a 900px center-crop check.
- [ ] Rami chooses a direction before title-screen integration. Desktop lobby composition crops the hero out on portrait; decide whether mobile needs separate artwork.

### Visual handoff, Batch 1 (Nov 1, Codex)
- [x] First enemy reference: Bill's four-frame 48x48 walking sheet, native PNG, preview GIF and full prompts saved and checked.
- [ ] Rami reviews Bill's expression and motion. Remaining Batch 1 enemies follow the approved reference; Art Room and production integration remain with the lead developer.

### Bio portrait (Nov 1, Codex)
- [x] Replace the About silhouette with a game-style pixel-art illustration of Rami's studio photograph. Update social preview and alt text; verify desktop and phone layouts.

- [x] Bio portrait revised toward the actual game-art style after Rami's feedback: larger flat color clusters, stronger outlines and simpler studio details (V. 1.28.6).

- [x] Restore the first studio portrait after Rami's comparison (V. 1.28.8). Bio work parked; resume Batch 1 with Late Fee. Bill is the only completed enemy-art reference so far.

### Clocking Out identity (Nov 1, Codex)
- [x] Rami selected clock concept 02 to replace the orange MS badge. Native-size favicon exports, home-screen icon and devlog headers updated, including static-post template and phone layout.

### Batch 1 enemy artwork (Nov 1, Codex)
- [x] Generate the full regular enemy batch: 10 species plus one projectile, 42 frames. Save exact native exports, full prompts, sources, loops and review/download page.
- [x] Integrate approved Batch 1 in combat, preserving bodies and balance, with per-sheet fallback and desktop/phone checks (V. 1.28.12). Boss generation remains Batch 2.

### Hero and office production pass (Nov 1, Codex)
- [x] Bring the three approved walking heroes and the detailed Corporate Campus into normal play (V. 1.28.13). Preserve hero/combat values; use approved furniture footprints, contact shadows and depth sorting. Repeat the campus for open-ended exploration, with fallback and desktop/phone checks.
- [ ] Rami's feedback on the complete cast in the office; bosses and later environment kits remain pending.

### Coffee-post illustration (Nov 1, Codex)
- [x] Place Rami's simplified twins portrait in the published coffee memo's Why now section, replacing the previous illustration (V. 1.28.15).

### Stage Pass: authored overworld (Nov 1, Codex)
- [x] Stage 1: illustrated nine-district campus and Parking Lot camera study in the Art Room, with a measured 7680x4320 proposal and clear routes/plazas (V. 1.28.16).
- [ ] Rami approves district layout, landmark direction and Parking Lot concept. Stop here until approval.
- [x] Start-area Stage 2 kit and review page. Remaining district props wait for feedback.
- [ ] Stage 3: ambient coworker idle sheets and review page.
- [x] Stage 4 start-area slice only: authored Lobby/Bullpen, closed gates, age-50 and crowd checks.
- [ ] Full campus, gate opening, wrapping and explored-path map after Rami plays.


### 2026-11-04: Focused art delivery (Codex)
- [x] Derek's On Break camera-only v2 correction, three preview GIFs and comparison.
- [ ] Claude switches the Lounge and Intern Delivery portrait reference to v2 after review.


### 2026-11-04: Retirement-goal art (Codex)
- [x] Friendly clock-out station sheet, waiting/contact previews and size comparison delivered.
- [ ] Claude integrates the station for Midlife age65 while keeping Full Life Father Time separate.


### 2026-11-04: Wall-lining kit (Codex)
- [x] All listed wall/floor families, colorways, metadata and room review boards delivered.
- [ ] Claude places the kit along intact wall segments, keeping doors and224px routes clear.


### 2026-11-04: Coworker world poses (Codex)
- [x] Six complete seated/standing pairs, all row GIFs, metadata and real-size comparison delivered.
- [ ] Claude replaces the assembled room coworkers after review; preserve navigation and spawn behavior.

### 2026-11-04: Rami's About portrait (Codex)
- [x] Studio redraw, square headshot, likeness comparison and hero check delivered as art only.
- [ ] Rami reviews; Claude switches the About-page image and square placements.

### 2026-11-04: GOTCHA! art (Codex)
- [x] Caught portraits, wordmark, treats, ticket frame, burst and review checks delivered.
- [x] Claude integrated catch art in V. 1.89.0; expanded loadout art is delivered below.

### 2026-11-04: Expanded loadout art (Codex)
- [x] 34 card/HUD icons, four style badges, nine world families and all animated-row previews delivered.
- [x] Claude integrated the atlas and weapon art in V. 1.91.0.

### 2026-11-04: Full Life bosses and floor pickups (Codex)
- [x] Three boss sheets/markers, friendly Father Time, pickup/shine sheet, manifests and previews delivered.
- [ ] Rami reviews; Claude wires Full Life attacks, the age-100 handshake and floor pickups.

### 2026-11-04: Memo 11 cover (Codex)
- [x] Mail-bot clubhouse cover, portrait crop, 2x preview and export checks delivered.
- [ ] Rami reviews; Claude places the art with Memo 11.

### 2026-11-04: Memo 10 cover (Codex)
- [x] Paternity-leave cover, portrait crop, 2x preview and export checks delivered.
- [ ] Rami reviews; Claude places the art with Memo 10.

### 2026-11-04: Minimap art (Codex)
- [x] Frame, buttons, eight markers and standing evacuation sign delivered with manifest, prompts and checks.
- [ ] Rami reviews; Claude swaps out the minimap placeholders.

### 2026-11-04: Student Lounge art (Codex)
- [x] Eleven modular prop families, fifteen cells and two shop illustrations delivered with manifest, prompts and scale checks.
- [ ] Rami reviews; Claude builds the Lounge in the Break Room's north end and wires in the shop scenes.

### 2026-11-04: Defeat art (Codex)
- [x] Thirty remains, seven knockdown poses and blank nine-slice stamp delivered with manifests, prompts and native-size checks.
- [ ] Rami reviews; Claude replaces the remains and boss-down placeholders.

### 2026-11-05 Wall bonk art (Codex)

- [x] Deliver crack variants, dizzy star and bird frames, and the integration manifest.
- [ ] Wire the effects into the boss wall bonk.

### 2026-11-05 Lounge weapons (Codex)

- [x] Deliver Mic Drop and Say Cheese sheets, HUD icons, manifest and previews.
- [ ] Wire the Lounge weapon art into the existing effects and HUD.

### 2026-11-05 Retirement party strip (Codex)

- [x] Deliver wide and tall retirement celebration sheets, previews and frame manifest.
- [ ] Wire both layouts into the retirement screen.

### 2026-11-05 Hero walk cycles (Codex)

- [x] Deliver alternating walks in all four directions for all four heroes, with previews and Sprite Board checks.
- [ ] Wire the new sheets into the game and refresh the Sprite Board catalog.

### 2026-11-05 Coworker cleanup (Codex)

- [x] Deliver stable seated work, personal gestures and alternating standing walks for all six coworkers.
- [ ] Switch to the keyed v2 sheets and refresh the Sprite Board catalog.

### 2026-11-05 Medical Bill and Lounge Cart (Codex)

- [x] Deliver transparent enemy, icon and cart art with animation previews and manifest.
- [ ] Wire the art into the Hustle penalty and Day One Lounge Cart.

### 2026-11-05 Pickups and projectiles (Codex)

- [x] Deliver the transparent pickup and projectile sheets.
- [ ] Wire the sheets into the pickup and projectile visuals.

## Flow cut-scene references (Nov 7, Codex)
- [x] Ten empty backgrounds in day and night versions, with a contact sheet and review page in `art/flow-kit/backgrounds/`. Approved, review touchups done Nov 7.
- [x] First clean character batch, four heroes plus TJ and Derek with two poses each. Ready for Rami's review in `art/flow-kit/key-art/clean/`.
- [x] Remaining ten clean characters, two poses each, from `docs/handoffs/chatgpt-flow-kit.md` (Codex, Nov 7).

## Supply Closet (Nov 7, Rami's call; design in docs/plans/supply-closet.md)
- [x] Step 1: back hallway (Server Room to Executive Wing), two doors, badge-reader trigger, "Please Don't Tell IT" achievement (placeholder art) (V2.10.17)
- [x] Step 2: random supply each run: bonus chest, nap spot, stash (V2.10.18)
- [x] Step 3: ChatGPT art pass (docs/handoffs/chatgpt-supply-closet.md) (V2.10.19)
- [ ] Later: closet-only weapon joins the roll


## 2026-11-07 art delivery (Codex)
- [x] Registered late-night title layers and Supply Closet art kit, including current badge-reader entrance.
- [ ] Claude integrates the art; Rami reviews playback and in-world placement.

## 2026-11-07 Flow and intro art (Codex)
- [x] Flow portrait batch 2, twenty clean PNGs and review page.
- [x] Seven Performance Review intro layers, unchanged plate and four-second preview.
- [ ] Rami reviews both art sets; Claude wires the intro playback.

### Codex art review, Nov 11
- [x] Paint Batch B backyard furniture, plain ground, props, gates and two 512px lawns; prepare comparisons.
- [ ] Rami reviews Batch B PR before Claude integrates it.

- [x] Add left/right 512px street ends to Batch B art PR, with separate barricades and assembled check.
