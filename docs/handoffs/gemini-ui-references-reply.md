Here is the complete reference and UI/UX design foundation formatted for docs/handoffs/gemini-ui-references-reply.md. It analyzes 7 benchmark games, translates Apple’s Human Interface Guidelines into hard rules for a 17-color retro pixel-art engine, provides an accessibility checklist, and establishes clear voice rules for interactive UI elements.

UI References & Design Pass Foundation (Nov 10, 2026)

1. How Great Games Solve It

Vampire Survivors

⚬ In-Run Notifications: Level-up and chest popups pause the gameplay completely; floating floating damage numbers and gold pickups pop directly over sprites; boss arrival flashes a crimson tint and an icon on screen edges.
⚬ Level-Up / Choice Screen:
  ⚬ Desktop: A vertical centered modal stack (3–4 wide horizontal rows) showing icon, level pips, name, and a one-line stat description.
  ⚬ Phone: Identical layout, but the touch target fills the entire screen width (48–56px high per card), with large hitboxes and clear reroll/skip buttons docked at the bottom.
⚬ Action Readability: Saturated, distinct weapon colors (blue daggers, red whips) contrasted against dark, muted, low-contrast tiled ground textures.
⚬ Worth Stealing: Evolution indicator icons right on the level-up card. When an item can evolve with something in your inventory, a tiny pairing badge or icon appears directly on the card so you never need an external wiki.
  ⚬ How it looks in Midlife Survivors: When Coffee Splash appears in your level-up choices, render a small 8x8 pixel mug icon with a tiny green checkmark if you already own Good Night's Sleep.

Brotato

⚬ In-Run Notifications: Minimal in-run text; wave timer and material counter sit strictly docked in the upper screen bar. Danger areas (incoming alien rushes) use flashing red floor circles.
⚬ Level-Up / Choice Screen: Stat upgrades are selected between distinct waves (never mid-action), featuring clean 4-card horizontal or vertical blocks with stat pills (e.g., +5 Max HP, +3% Speed).
⚬ Action Readability: High-contrast character silhouettes (white potato on dark brown arena) with bright red enemy outlines and danger rings that telegraph 1.5 seconds before strikes.
⚬ Worth Stealing: Telegraphed floor charging zones. Red dashed danger zones for rushing enemies.
  ⚬ How it looks in Midlife Survivors: When the Performance Review or Midlife Crisis V8 prepares to dash, draw a translucent 2-pixel dashed red warning lane (#C45C4B) across the carpet 1.2 seconds prior to charging.

Hades

⚬ In-Run Notifications: Mid-action dialogue appears as bottom-anchored narrative letterboxes with large animated character portraits on the left and clean 2-line dialogue boxes on the right.
⚬ Level-Up / Choice Screen (Boon Selection): A 3-column modal panel pausing action, clearly detailing Boon Name, Rarity badge, core mechanics, and secondary synergy tags.
⚬ Action Readability: Vignettes dim room edges; gold particle rings telegraph incoming enemy spawns; active player character features an internal highlight rim.
⚬ Worth Stealing: The "Heroic Choice" hierarchy. The card banner is color-coded by rarity/tier, with clean badge pills in the corner.
  ⚬ How it looks in Midlife Survivors: When an evolved weapon or rare modifier drops, cap the card with a solid navy-and-gold header bar (EVOLVED WORKFLOW) rather than plain text.

Balatro

⚬ In-Run Notifications: Popups ("NOPE!", "+4 Mult", "FOIL") bounce out of the affected card as juicy floating pixel tags with immediate spring-damping physics.
⚬ Choice / Shop Screen: Rigid CRT monitor bezel framing; items sit on a clear felt tabletop; tooltips dock dynamically above cards without obscuring the active shop inventory.
⚬ Action Readability: Muted felt green/blue background; cards possess distinct white borders and heavy drop shadows, making them pop effortlessly.
⚬ Worth Stealing: Tactile spring physics on floating text badges. Popups don't just appear; they punch upward with a sharp 3-frame scale bounce before fading.
  ⚬ How it looks in Midlife Survivors: When an intern hands off a coffee or snack, have [SNACK!] punch upward by 6 pixels with a quick 2-frame wobble before settling.

Dave the Diver

⚬ In-Run Notifications: Oxygen and depth warnings blink amber and red on the peripheral HUD; item pickups float in a subtle bottom-right stack.
⚬ Level-Up / Choice Screen (Sushi / Equipment): Rich smartphone UI mockup ("Bancho Sushi App") on phone-like proportions, using tab bars, rounded pills, and list views.
⚬ Action Readability: Blue ocean gradient with heavy dark vignette; interactable fish have subtle white highlights when targeted with the harpoon.
⚬ Worth Stealing: The Smartphone In-Game Menu metaphor. Clean tab bars with unread notification pips.
  ⚬ How it looks in Midlife Survivors: Menus (401(k) Shop, Lore Archive, Achievements) can be styled as tabs on an office tablet or intranet dashboard with subtle 1-pixel pips.

Stardew Valley

⚬ In-Run Notifications: Item collection prompts dock in a tidy vertical stack in the lower-left corner; dialogue boxes use warm wooden borders with expressive 64x64 character portraits.
⚬ Choice Screen: Crisp, tiled grid windows with high-contrast text and warm parchment backgrounds; active selections highlight with a bouncing red pixel arrow.
⚬ Action Readability: Clean pastel tilemaps with dark 1-pixel outlines on all collidable objects; player and tools always render above ground foliage.
⚬ Worth Stealing: Bouncing cursor / Focus indicator for non-touch play.
  ⚬ How it looks in Midlife Survivors: A 12x12 chunky pixel pointer or yellow border bracket that snaps smoothly from card to card when navigating with a controller or keyboard arrow keys.

Slay the Spire

⚬ In-Run Notifications: Intent icons hover permanently above enemy heads (attack damage, shield, buff) so you can plan your next turn without guessing.
⚬ Choice Screen: Centered 3-card modal; picking an item zooms it slightly with a bright amber glow and dims the rejected cards.
⚬ Action Readability: Neutral, painterly background; high-contrast card art with clear numeric energy costs in the top-left circle.
⚬ Worth Stealing: Keyword tooltips anchored on card hover/touch. If a card says "Late Fee", tapping or hovering reveals a small floating glossary chip explaining what it is.
  ⚬ How it looks in Midlife Survivors: Tapping a card mentioning "Evolves with Good Night's Sleep" pops a small 1-line explainer chip directly above the card footer.

2. Apple HIG Translated for a Pixel-Art Game

Apple HIG Principle	Meaning in Native iOS/macOS	The Midlife Survivors Pixel Rule
1. Hierarchy	Primary actions stand out over secondary and tertiary actions.	One Gold Button per screen: The primary action (e.g., CLOCK IN, CLAIM BONUS) uses solid mustard gold with navy text; secondary actions (REROLL, SETTINGS) use hollow 1-pixel navy frames.
2. Clarity & Legibility	Text is legible at any scale; icons are precise and unambiguous.	Dual-Font Pipeline: Chunky Silkscreen caps for kickers and numbers (10–12px native); crisp, high-x-height pixel sans for descriptions and dialogue (max 2 lines per card).
3. Deference	The UI recedes so the content and gameplay take center stage.	Backdrop Dimming: When in-run menus, modals, or Spotlight cards open, apply a uniform 60% navy scrim (rgba(18, 24, 38, 0.65)) over the gameplay world to immediately direct focus.
4. Size Classes (Compact vs. Regular)	UI adapts between handheld phone screens and iPad/desktop displays.	Responsive Card Flow: On compact viewports (<600px width), stack upgrade cards vertically in full-width rows (52px tall); on regular viewports (>600px), array them as 3 or 4 vertical cards side-by-side.
5. Safe Areas & Margins	UI respects notches, home indicators, and display cutouts.	16px Native Padding: Keep all floating HUD elements (Health, Age, Coin tally) at least 16 canvas pixels inside the viewport edges (or 24px from top/bottom on mobile notches).
6. Sheets vs. Alerts vs. Banners	Different presentation styles match the urgency and permanence of the information.	Tri-Tier Messaging:
• Banner: Non-blocking top/bottom lower-third bar for tips/memos (auto-dismisses in 4s).
• Sheet: Bottom-docked half-modal for mid-action level-ups and shop choices.
• Alert: Centered modal with dim scrim for game over and boss spotlights.
7. Focus & Controller Navigation	Full keyboard and game controller accessibility across all menus.	Focus Ring Engine: Any focused button or card receives a pulsing 2-pixel cream/gold outer frame bracket and responds to D-pad navigation and Gamepad A / Space confirmation.
8. Dynamic Type / Text Scaling	Accommodate user text size preferences.	No-Truncation Text Boxes: Containers size dynamically to fit 1 to 3 lines of copy without letter-clipping; never hardcode card heights that clip localized or scaled fonts.
9. Reduce Motion	Provide a calm experience for players sensitive to camera shake and screen movement.	Instant Modal Option: When prefers-reduced-motion is active, disable the screen-dim zoom, camera shake on hits, and sliding card tweens, replacing them with a crisp 1-frame opacity cut.
10. Haptics & Feedback	Tactile confirmation of user input.	Web Vibration API Trigger: Trigger a crisp 15ms vibration (navigator.vibrate(15)) on mobile when tapping level-up cards, collecting a boss chest, or taking damage.

3. Accessibility Checklist

Contrast & Legibility on Busy Floors

⚬ [ ] Solid Card Plates: Never render raw pixel text directly over patterned carpet, wood grain, or floor tiles. Always back text with a solid dark navy (#1B2432) or warm cream parchment (#F5EEDB) container plate.
⚬ [ ] 1-Pixel Outline or Shadow: When floating damage numbers or prop labels appear over sprites, apply a hard 1-pixel shadow in solid black/navy.
⚬ [ ] Contrast Ratio: Maintain a minimum 4.5:1 contrast ratio between font color and plate background (e.g., Cream #F5EEDB text on Navy #1B2432 scores over 11:1).

Minimum Text Sizes per Device

⚬ [ ] Phone (Mobile viewport 390px): Core body font must render at no less than 10px native bitmap font (scaled cleanly via crisp nearest-neighbor integer scaling, e.g., 2x = 20 CSS pixels).
⚬ [ ] Desktop (1280x800+): Native 12px or 16px bitmap rendering, ensuring zero fuzzy half-pixel blur.
⚬ [ ] Max Line Lengths: Spoken lines capped at 60 characters; tooltips and lower-third captions capped at 55 characters; memo approach captions capped at 90 characters max (2 lines).

Colorblind-Safe Warning Colors

⚬ [ ] Dual-Channel Indicators: The danger color is tie red (#C45C4B). Never rely on red alone:
  ⚬ Red elite enemies must carry an animated pulsing red ring plus a distinct icon or skull mark ([!]).
  ⚬ Incoming boss dash lines must display a dashed track and exclamation icons, not just a solid red line.
  ⚬ Low HP warnings must combine a red edge vignette with an audible warning heartbeat and a visible flashing health bar icon.

Reduce-Motion Settings

⚬ [ ] Check window.matchMedia('(prefers-reduced-motion: reduce)').matches on initialization.
⚬ [ ] Disables screen-shake on player damage and boss slams.
⚬ [ ] Replaces animated Spotlight card slants and slide-ins with a direct 1-frame fade-in.
⚬ [ ] Disables flashing/strobe effects on red elites and boss charge telegraphs.

Controller-Only & One-Hand Phone Play

⚬ [ ] Controller-Only: Every menu (Title, Shop, Pause, Level-up, Game Over) navigable using only D-pad / Left Stick and buttons A (Confirm) / B (Back/Cancel).
⚬ [ ] Virtual Joystick & Auto-Aim: Mobile supports touch-anywhere virtual joystick or one-thumb dragging. Weapons auto-aim at the nearest foe so one hand can navigate continuously.
⚬ [ ] Thumb Reach Zone: On phone layouts, primary interaction buttons (Reroll, Confirm, Pause) sit docked in the lower 40% of the display for easy one-hand thumb access.

4. Voice Rules for Interactive UI Elements

Derived directly from the unified style guide (gemini-maple-voice-reply.md): warm, deadpan, collegial, and never mean, with strictly zero em dashes and zero brand names.

1. Buttons & Action Links

⚬ Style: All Caps or Title Case, 1 to 3 words, action-oriented with a polite corporate wink.
⚬ Primary Gameplay Action:
  ⚬ CLOCK IN (Start Run)
  ⚬ CONFIRM SELECTION (Pick Upgrade)
  ⚬ CLAIM SPOT BONUS (Open Boss Chest)
⚬ Secondary / Utility Actions:
  ⚬ SUBMIT TICKET (Settings / Report)
  ⚬ TAKE PTO (Pause Game)
  ⚬ EXPENSE RECEIPT (Reroll Upgrades)
  ⚬ DECLINE MEETING (Skip Upgrade)
  ⚬ CLOCK OUT (Quit to Main Menu)

2. Attack Warnings & Status Banners

⚬ Style: Two-tier structure. Line 1 is a 1–2 word ALL CAPS Kicker; Line 2 is a sentence-case tactical hint under 45 characters.
⚬ Examples:
  ⚬ MINUTE HAND / Fast sweep around the dial. Keep moving.
  ⚬ RATE LOCK / Interest expands. Slip into the % gap.
  ⚬ V8 BURNOUT / Drift loop incoming. Skip the skids.
  ⚬ MANDATORY FUN / The breakroom is crowded. Mind your space.

3. Empty States

⚬ Style: Gentle, sympathetic observations in sentence case. Never blame the player or use blunt tech errors like "No data found."
⚬ Shop / 401(k) Upgrades Maxed Out:
  ⚬ "All benefits fully enrolled. HR has nothing left to offer you today."
⚬ Lore Archive / Empty District Tab:
  ⚬ "No memos on file for this wing yet. Keep exploring during your next shift."
⚬ Achievements Tab (None Earned Yet):
  ⚬ "Your permanent record is completely clean. Clock in and make some memories."
⚬ Leaderboard (Offline / Empty):
  ⚬ "The server cart is taking a quick nap. Your local shifts are safe and sound."
---

## Claude's check (Nov 10, 9:20 AM), for the design lead
**Solid and useful:** the game comparisons (evolution badges on level-up cards, keyword chips, a focus bracket for controllers, a smartphone/tablet metaphor for menus), the banner / sheet / alert tiers, compact vs. regular card layouts, the colorblind "never red alone" rule, the empty-state lines.

**Checked against the code**
- The Coffee + Good Night's Sleep example is real: that pair evolves into Cold Brew (`src/data/upgrades.js`).
- Already in the game: phone vibration (`navigator.vibrate`), reduce-motion checks in about 15 files, dashed telegraphs on the newer bosses (Math Homework, All-Hands). The V8 already has skid lines. So those rows are "make consistent," not "add."

**Doesn't match our rules, adjust before adopting**
- **Colors:** "mustard gold," #1B2432 and #F5EEDB aren't in the palette. Use navy #171C35, cream #F2D7A1, warm white #FFF0CF, and coffee orange #EF9347 as the one accent.
- **Fonts:** Silkscreen and Atkinson Hyperlegible are web fonts, not bitmap fonts, so "10px native bitmap at integer scale" doesn't apply as written. Set minimum CSS sizes per device instead.
- **Joke button labels** ("TAKE PTO" for Pause, "EXPENSE RECEIPT" for Reroll, "DECLINE MEETING" for Skip) trade clarity for a gag, which goes against the Clarity principle in the same doc. Suggest: plain verb on the button (PAUSE, REROLL, SKIP), with the joke in a subtitle or tooltip. Rami decides.
- **"Spotlight cards as centered alerts with a scrim"** would pause and cover the action on every boss arrival. Grok's attention-budget reply should decide which moments earn a full stop.
