# Midlife Survivors: Roadmap

Pace: about 3-5 hours a week, 45-90 minute sessions. Every session ends with something playable.
Weekly check-in: Sundays, evening (automatic).

**Current phase:** Fun Pass (one objective at a time; feature freeze on new content)
**Last updated:** 2026-10-30 (Added 5 Unlockable Life Stage Environments in `src/data/stages.js` + Phase 7 Roadmap for Birth, Parenting, and Friendship Challenges)

---

## Fun Pass (current focus, Oct 30)
One objective per session. Build it, publish it, Rami plays it, then move on.
1. [x] **Clean screen HUD:** XP bar on top, age in the middle, HP under the player, 3D views parked (V. 1.9.0)
2. [x] **Lower third:** on-demand strip for alerts, first-time tips, chapter cards and rewards, one at a time (V. 1.10.0)
3. [x] **Title screen:** pick a character, then Start. Shop, Options and Extras sit behind buttons (V. 1.11.0)
4. [x] **Hints toggle:** GAME TIPS on/off in the Pause menu (V. 1.12.0)
5. [ ] **Menu fixes (from the Oct 30 UI test run):**
   - Options, Lore and Patch Notes open *behind* the title screen (they share a layer and the title wins)
   - Keyboard focus gets stuck on buttons in menus that already closed, so Enter can do nothing
   - Game Over's "401(k) Shop" button lands on the main title screen, not the shop
   - Lower third keeps counting down behind the pause and level-up menus, so messages expire unseen
   - Pause menu opens with the Lore row highlighted instead of Resume; menu is long (8 rows)
   - Top HUD shows faintly behind the title and Game Over screens
   - Death joke can mismatch the killer (died to a Bill, joke about an HOA fee)
6. [ ] **Credits, not cameo:** remove Rami as a playable character and from the lore; add a Credits screen with his name
7. [ ] **Run length:** 1 minute per year, no stop at 80, Death arrives at 100
8. [ ] **Intensity curve:** swarms and bosses ramp harder each decade
9. [ ] **First twist: Errands:** a To-Do List marks spots on the map, shown in the lower third
10. [ ] **Art direction:** Rami's mood board, then restyle sprites and UI (including the lower third's look) to match

---

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
