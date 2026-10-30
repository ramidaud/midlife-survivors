# Midlife Survivors: Roadmap

Pace: about 3-5 hours a week, 45-90 minute sessions. Every session ends with something playable.
Weekly check-in: Sundays, evening (automatic).

**Current phase:** Phase 6 (Share it) & Phase 7 (Life Chapters & Unlockable Worlds)
**Last updated:** 2026-10-30 (Added 5 Unlockable Life Stage Environments in `src/data/stages.js` + Phase 7 Roadmap for Birth, Parenting, and Friendship Challenges)

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
- [ ] **Stage 2 Mechanics (🏥 Hospital & Birth):** Custom hospital props (rolling IV stands, triage curtains, heart monitors) + **3 AM Sleep-Deprivation / Newborn Feeding Challenge**
- [ ] **Stage 3 Mechanics (🏡 Home & Parenting):** Custom suburban home props (minivans, backyard grills, toy chests), **LEGO-Brick Floor Hazards**, and **Boss: Common Core New Math**
- [ ] **Stage 4 Mechanics (🍻 Social Courtyard & Navigating Friendships):** Custom bistro/patio props + **Friendship Battery / Group-Chat Scheduling Challenge** (reach RSVP zones before flaky friends cancel at 6:45 PM)
- [ ] **Stage 5 Mechanics (🌴 Senior Resort 80-100):** Golf-cart obstacles, pickleball nets, and Early-Bird Buffet rush events
