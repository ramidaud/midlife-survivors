# Handoff: UI/UX audit + design system for Midlife Survivors (Nov 10, 2026)

Paste everything below the line into a fresh chat in the "Midlife Survivors" Project.

---

You're joining **Midlife Survivors** as the design lead for one job: a serious UI/UX pass. Another Claude session builds features
day to day; your job is the **audit and the design system**, not the migration. Read the Project's CLAUDE.md first (who Rami
is, how he likes replies, the guardrails), then this brief.

## What Rami said
"We need to do a serious pass on the UI/UX, the overall design language of the menus, maps, memos, tips, spotlights, errands,
messages. Right now it feels very disjointed. It doesn't feel like a unified experience, and it's hard to tell where I should be
looking. We need to incorporate more of Apple's iOS/macOS design philosophy. The experience should scale to the device you're
playing on."

## The game
- A Vampire Survivors-style browser game about midlife. Phaser 3.80.1, plain JS, no build step. Live at https://midlifesurvivors.com
- Repo: github.com/ramidaud/midlife-survivors (clone it; also on Rami's Mac at "~/Desktop/03 Ai/Midlife Survivors").
- Played on phone (portrait), iPad (both orientations) and desktop, with touch, keyboard/mouse and game controllers (Xbox, PlayStation, Switch). Controller focus uses `bindNavItem` in `src/ui.js`.
- Two stages: the Office and Maple Hollow (home). The art is crisp 16-bit pixel art.

## Where the UI lives
- `index.html`: almost all CSS (about 1,700 lines) plus the title pre-paint.
- `src/ui.js` (about 3,300 lines): title screen and its tiles (employee file feed, shift picker, devlog memo card), settings/options, shop, extras, leaderboard, what's new, achievements, controls, pause, level-up modal, game over and score posting, `showLowerThird`, `flashBanner`, boss toasts, retirement screen.
- In-run surfaces in their own files: `src/spotlight.js` (boss intro cards), `src/errands.js` (errand chips and buffs), `src/tips` data in `src/data/tips.js`, `src/lounge.js` (in-run shop), `src/moved-note.js`, `src/catch-moment.js`, `src/bonus-chest.js`, `src/perf-bonus.js`, minimap, HUD (score, 401(k), timer, age, XP bar, weapon slots, pause/sound buttons), pop-up texts in the game world.
- The devlog site (`devlog/`) shares fonts and colors: `assets/ui/ms-bar.css`, `assets/ui/ms-nav.*`.
- Current rules: CLAUDE.md "One look (Nov 3)": Silkscreen for short labels and headings, Atkinson Hyperlegible for reading text, the devlog palette only (navy, slate, teal, sage, cream, coffee orange, russet), cream "MEMO · RE:" strips, teal-bordered tiles, the shared progress bar.

## Read these first if they exist
- `docs/handoffs/grok-ui-attention-budget-reply.md`: every in-run message, how dense they get, what collides, a proposed attention budget.
- `docs/handoffs/gemini-ui-references-reply.md`: how other games solve this, Apple HIG translated for pixel art, accessibility.
- `docs/handoffs/gemini-maple-voice-reply.md` part 2: a draft UI voice guide (read Claude's fact-check at the bottom).

## Open decisions (Rami hasn't answered yet; treat these as proposals)
From Grok's attention budget, section 8, with Claude's suggested answers:
1. 1 headline + 1 ticker at a time, only 1 on phones during a boss: **yes**.
2. Boss intro card 3.5 s (vs. delaying first attacks): **shorten**.
3. Rewards (cake, buffs, salad) never take the center: **yes**.
4. Hold errands during bosses and off milestone ages: **yes**.
5. Pause swarm events during the Review, Mortgage and V8: **yes**.
6. First modifier roll at 50.8: **yes**.
7. Phone center banner at 18% height: **your call after the audit**.
Plus one from Gemini's references: plain verbs on buttons (PAUSE, REROLL, SKIP) with the joke in a subtitle, vs. joke labels ("TAKE PTO"). Claude suggests plain verbs. Present your recommendation and let Rami decide.

## Coming soon (design for it, don't audit it)
- **Maple Hollow v2** is about to be wired in: bigger houses, a wide street, connected backyards with one interactive thing each (trampoline, grill, fire pit...), a two-floor house with stairs, Rami's desk (a "Ship It" buff) and Abe's room. Art: `assets/stage/home/v2/`. Play spec: `docs/handoffs/grok-maple-v2-reply.md`. New surfaces it adds: yard "ready" sparkles, stair transitions, a desk buff chip, yard gag pop-ups.
- **The Quarterly All-Hands** (office boss at 60, V2.25.0) is live: dashed floor shapes, a projector screen, a Q&A with spotlights.
- Another Claude session keeps building while you work. Always `git pull --rebase` before you push, and only touch `docs/design/`.

## Every surface in scope (audit all of them)
**Out of the game (menus and pages)**
- Title screen: the slideshow, logo and version, Punch In, the employee-file feed (to-dos), the shift and mode picker, the LOCATION picker, the devlog memo card, the account/save prompt
- Title sub-views (`ui.js` `renderTitleModal` views): 401(k) shop, Extras, Performance record (achievements), Leaderboard, Credits
- Options/settings, Controls, What's New (changelog), Lore archive, Pause, Game over + score posting, the Retirement screen, the shift briefing
- The sound nudge, the "move to start" hint, the screenshot control
- **The website:** the devlog index and each memo page (`devlog/`), the Art Room (`devlog/art`), About (`devlog/about`), the shared top nav (`assets/ui/ms-nav.*`) and progress bar (`assets/ui/ms-bar.css`), share pages, and the Discord link
**In the game**
- The HUD (XP bar, age and timer, score, 401(k) coins, loadout slots, pause and sound buttons), the minimap and its big view
- The center flash, the lower third, Spotlight cards (hire, boss, room, lounge, tip, event), boss toasts, the catch card (GOTCHA!)
- Chips: errand + arrow, "checked off" buff, modifier, Workload, key hunt, Overtime beats
- Menus that pause: level-up, Performance Bonus, bonus chest, the Lounge / Lemonade Stand
- World text: damage numbers, Close Calls, speech bubbles, pickup pops, name tags, boss labels
- Touch controls (the floating joystick) and controller focus on every menu

## Your job, in order
1. **Audit (deliver first).** Run the game headless (Playwright; serve the repo with `python3 -m http.server`, add `?nostats=1` so no stats are sent, block supabase/goatcounter requests, and never post to the leaderboard). Capture **every surface** at phone 390x844, iPad 820x1180 and 1180x820, and desktop 1440x900. Make one review page: each surface in a row across the device sizes, with notes on what's inconsistent (type, spacing, radius, color, motion, placement), what competes for attention, and what doesn't adapt to the device. Publish it as an artifact and give Rami the link.
2. **Design system (deliver second), as a spec for Rami to approve before anything is built:**
   - **Tokens:** type scale, spacing scale, radii, borders, shadows/materials, the palette mapped to roles (background, surface, raised, accent, danger, success), motion durations and easing. Respect the pixel-art look: crisp, no blur-heavy glassmorphism unless it truly reads.
   - **An attention ladder,** like iOS: what's a quiet HUD change, a banner, a sheet/modal, a full-screen moment. One home on screen for in-run messages, a queue so two never fight, and what pauses the game.
   - **Size classes:** how each surface lays out on phone portrait, phone landscape, iPad, desktop. Safe areas and thumb reach on touch, focus rings for controllers.
   - **Components:** one card, one sheet, one banner, one button family, one list row, one chip, one toast, one memo style, used everywhere, each with its states (default, focus, pressed, disabled).
   - **A mapping table:** every current surface → the component it becomes.
   - **A migration order** sized for Rami's 45-90 minute sessions, starting with in-run messages (hardest to know where to look), then menus, then memos and the devlog.
3. **Stop there.** Don't rewrite the game's UI. The other session migrates one surface at a time after Rami approves the spec. If you build a prototype, keep it to a separate page or artifact.

## How to work with Rami
- First game ever, ADHD-friendly replies: start with a 2-3 sentence summary, short paragraphs, headers, bold for key points, end with clear next steps.
- No em dashes. No formulaic parallel structures or AI-sounding openers/closers.
- Show, don't describe: screenshots and side-by-side pictures beat paragraphs.
- Pushes: only docs and the audit page (in `docs/design/`). Never change game code, version numbers, Supabase or the leaderboard. Commit with a clear message.
- **Instruction check:** the design system will replace the "One look (Nov 3)" section of CLAUDE.md. Propose the new text, ask Rami yes or no, and don't change CLAUDE.md without his OK.

## What you hand back at the end
1. **The audit page** (published artifact + `docs/design/ui-audit-2026-11.md`): every surface above, screenshotted at phone, iPad portrait, iPad landscape and desktop, with notes. Ends with a **top 10 problems**, ranked by how much each hurts "where should I be looking."
2. **The design system spec** (`docs/design/design-system-v1.md` + a published visual version): tokens, components with states, the attention ladder, size classes, a voice-for-UI section (button labels, banners, empty states).
3. **Wireframes** (published artifact, `docs/design/wireframes-v1.html`): simple gray-box layouts, no final art, built from the new components. One per key screen, each at phone, iPad and desktop: the title screen, the 401(k) shop, the leaderboard, options, the level-up menu, pause, game over, the in-run HUD with the headline / ticker / status-row slots marked, a boss arrival moment, the devlog memo page and the Art Room. Label every region (what goes there, what tier of message, what the thumb or controller does).
4. **A before/after mockup** of two screens in real colors: the in-run HUD during a boss, and the title screen. Enough for Rami to feel the direction.
5. **A ranked list of recommendations,** each tagged by effort (S/M/L), what it fixes from the top 10, and which surfaces it touches.
6. **A migration plan,** one surface per 45-90 minute session, in order, each with a "done when" test.
7. **The proposed CLAUDE.md text** that replaces "One look (Nov 3)," plus the instruction-check question for Rami.

## Deliverables
- `docs/design/ui-audit-2026-11.md` plus the published audit page.
- `docs/design/design-system-v1.md` (the spec), with a published visual version (tokens, components, the attention ladder, size classes).
- A short note at the end of `docs/PROGRESS_LOG.md` and a line in `docs/ROADMAP.md` saying the spec is ready for review.
