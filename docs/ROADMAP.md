# Midlife Survivors: Roadmap

Pace: about 3-5 hours a week, 45-90 minute sessions. Every session ends with something playable.
Weekly check-in: Sundays, evening (automatic).

**Current phase:** Fun Pass (one objective at a time; feature freeze on new content)
**Last updated:** 2026-11-01 (Codex: approved Batch 1 enemy art integrated, combat values preserved)

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
11. [ ] **First twist: Errands:** a To-Do List marks spots on the map, shown in the lower third
12. [ ] **Art direction + bigger world:** Rami's mood board, then a larger, detailed pixel-art office full of funny details, and restyled sprites and UI (including the lower third)

---

## Next up (planned Oct 31, usage-light: one session per item)
1. [x] **Playtest fix pack (V. 1.20.0):** Retry touch bug, tap-to-confirm perks, joke wrapping + quieter jokes, Start over Resume, plain rarity labels, coin economy fix, softer first minutes, leaderboard shows personal bests only with no top-10 cap
2. [x] **Core 19-minute run (V. 1.21.0) (ages 40 to 65, 45 s/year):** short Midlife mode as the main game, Overtime unlocks, Full Life (to 100) as an unlockable mode, separate leaderboards
3. [x] **Content drop + items (V. 1.22.0):** new jokes and death lines, Annual Checkup replacements, discoverable items (magnet, energy drink, more)
4. [x] **Achievements (V. 1.23.0)** (one unlocks Full Life)
4b. [x] **Grok difficulty handoff, Parts 1 and 2 (V. 1.25.0)**
4c. [ ] **Grok Part 3, one at a time:** ~~Tax Bracket (V. 1.26.0)~~ done, ~~dynamic intensity (V. 1.27.0)~~ done, near-miss rewards, age-50+ run modifiers
5. [ ] **Art pass** with GPT Image assets Rami prepares in parallel. Campus study now includes three desk variants and walking sheets for all three playable characters. Explore As switches characters; the gallery compares four directions and exports native grids. Await animation feedback before idle/combat art and main-game replacement.
   - Batch 1 enemy generation complete: ten enemy species plus Group Chat ping, 11 native sheets and 42 frames. Review animated enemies from the Art Room, with pause, pose, scale and floor controls. Approved Batch 1 is integrated in V. 1.28.12 with independent canvas fallback; bosses remain a separate batch.
   - Office environment study: detailed Accounts Payable with seamless carpet/wood, fluorescent lighting accents, native printer/cabinet/plant props and floor-level stories. Visit Accounts opens it directly. Expanded ground pass now adds brighter carpet, welcome rug, chair mats, floor wear, paper trails and cream lighting. Rami approved the larger exploration scale. Furniture now has fitted contact shadows, visible chair mats and nearby floor wear; await grounding feedback, then test crowd pressure before integration.
6. [ ] **Discoverable map + bigger world:** Rami chose exploration and Corporate Campus. Separate blockout ready in Extras > Art Test: 3072x2048 floor (5.5x previous area), seven areas, explored-path map and five optional finds. Central lanes are 224px, outer loop 192px. Test navigation first, then crowd pressure before main-game integration.
7. [ ] **Accounts / cloud saves**
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
- [ ] Decide: stay on the web, itch.io, or desktop app
- [ ] Optional: tie a write-up into EMAT coursework or Framing the Cosmos-style storytelling

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
