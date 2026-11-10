# UI audit, November 2026 (V. 2.25.0, build 327)

**Summary:** I ran the game on a phone, an iPad both ways, and a desktop, and photographed 60 surfaces at each size (239 screenshots). Each piece is well made. They were built one at a time, so each one chose its own spot, shape and volume, and nothing decides which one gets to speak. That is why it is hard to know where to look.

- **Visual version (with every screenshot):** https://claude.ai/artifact/UH1Uc4GaGXHiwsmB9sq8a7 (the "Midlife Survivors UI Audit" artifact). Page source: `docs/design/ui-audit-2026-11.html`.
- **Screenshots:** `docs/design/audit-shots/<size>/` where size is `phone` (390x844), `ipadp` (820x1180), `ipadl` (1180x820), `desk` (1440x900).
- **Capture scripts:** `docs/design/audit-tools/` (Playwright, stats and leaderboard blocked, nothing posted).
- **Scope:** audit only. No game code was changed.

## Counts
| What | Count |
|---|---|
| Different containers for a message during a run | 11 |
| Font sizes in the game's CSS | 30 (most between 8 and 13 px) |
| Corner radii | 12 |
| Stacking layers (z-index values) | 29 |
| Screen-width breakpoints | 13 (480 to 1800 px) |
| Files in `src/` that inject their own styles | 16 |
| Messages in a typical office run (Grok's model) | about 110, plus 31 pausing menus |

## Measured on a 390x844 phone
- HUD: y 0 to 112. Pause and sound buttons: 36x36 px (touch minimum is 44).
- Minimap: x 212 to 384, y 115 to 251.
- Center flash: y 226 to 279. Errand, key hunt and beat strip: y 293 to 337. Hero: about y 385 to 450.
- Lower third: y 773 to 826 (where the thumb rests).
- **Bug:** `--ms-nav-h` stays at 57px during a run while the site nav is hidden, so every in-run element positioned from it (minimap, chips, briefing, catch card) sits 57 px lower than its CSS says.
- Chips and the minimap draw above level-up, chest and shop menus. They only hide for the pause menu.

## Worth keeping
- The lower third: one bar, a color-coded label, already queued. It should become the main voice.
- The cream memo strip and the devlog's reading sizes.
- The Spotlight band. It has the most character and needs a smaller job.
- The level-up cards, and the bonus chest as a full-screen moment.
- The title key art and one big PUNCH IN on a phone.

# Every surface


## The front door

### 01. Title screen, first visit
Shots: `audit-shots/<size>/a01-title-first-visit.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The strongest screen in the game. Key art, cream memo strip, pixel logo and one orange button all agree with each other.
- **Attention:** On a phone the eye lands on PUNCH IN, which is right. On desktop PUNCH IN moves inside the middle tile and competes with two other tiles, a row of five links, and the site nav above.
- **Device fit:** Three different layouts for one screen. Phone stacks, iPad portrait stacks with the art cropped, desktop becomes a three-tile dashboard. The type stays phone-sized on iPad and desktop, so the tiles read as fine print.

### 02. Title screen, returning player
Shots: `audit-shots/<size>/b01-title-returning.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The employee file adds four kinds of pill (STATUS, MEMO, TO-DO, stat boxes) in sizes from 8 to 13 px. The devlog card is cream paper, the other tiles are navy. Two paper colors side by side.
- **Attention:** Six things ask for a tap before PUNCH IN: the version line, the feed, MORE 1/4, the account row, the devlog card, the settings chip. A returning player wants one thing: play again.
- **Device fit:** Phone needs a full scroll to reach the shop and options. On iPad portrait the title art is covered by the stack after one screen.

### 03. Shift settings (location, mode, sprint, tax)
Shots: `audit-shots/<size>/b03-title-shift-settings-open.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Four rows of small pill buttons with emoji and locks, each followed by a line of help text. It reads like a settings form, and nothing else in the game looks like it.
- **Attention:** This is where you pick the stage, which is one of the biggest choices before a run. It hides behind a small gray chip under PUNCH IN.
- **Device fit:** Opens inline and pushes everything down on phone. On desktop it grows inside the middle tile and shoves PUNCH IN upward, so the main button moves when you open it.

### 04. What's New bubble
Shots: `audit-shots/<size>/a02-title-whats-new-pop.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A fourth container style on the title: a navy sheet with a small orange tag. Not the memo strip, not a tile.
- **Attention:** Fine as a one-time nudge. On phone it covers the employee picker, bottom of screen. On desktop it sits top right. Two homes for one message.
- **Device fit:** Bottom sheet on phone and iPad, floating card on desktop. That split is actually the right instinct and worth keeping in the system.

### 05. Title screen, Maple Hollow picked
Shots: `audit-shots/<size>/d01-title-maple-hollow.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The title art swaps to the house, which is a lovely touch. Nothing else on the screen says which stage you picked.
- **Attention:** After you choose Maple Hollow the only confirmation is the picture. The settings chip still reads Midlife, 40-65, Tax 0 with no location in it.
- **Device fit:** Same layout notes as the title.

### 06. Save your file prompt
Shots: `audit-shots/<size>/b13-account-save-prompt.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Cleanest dialog in the game: one strip, one headline, one primary and one secondary button. Its strip says HR // BADGE OFFICE, a third naming pattern next to INTERNAL MEMO and FORM 401-K.
- **Attention:** It appears on its own over the title for players with progress. Good moment, but it blocks PUNCH IN until answered. (The red error line in these shots is my test rig blocking the network.)
- **Device fit:** Centered card at every size. On a phone a bottom sheet would put both buttons under the thumb.

### 07. We Moved note
Shots: `audit-shots/<size>/b14-moved-note.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Same card as the account prompt, with MEMO // FACILITIES on the strip. Here the orange button is on the right and the outline button on the left. The account prompt stacks them.
- **Attention:** One-time notice. No issue.
- **Device fit:** Fine.


## Menus from the title

### 08. 401(k) Shop
Shots: `audit-shots/<size>/b04-401k-shop.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Every row carries a full-width orange BUY button, so the screen has eight primary buttons. Pips are text squares. Locked rows use a gray that isn't in the palette.
- **Attention:** Your coin balance, the one number this screen is about, is a line of small text under the heading. The game logo and tagline repeat above it and take the best spot.
- **Device fit:** One column on phone (two items visible), two on iPad, four on desktop. The grid adapts well. The panel header does not: logo, tagline and strip cost about 150 px on every size.

### 09. Extras
Shots: `audit-shots/<size>/b05-extras.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A poll, a start-age picker, and eight unrelated buttons (Lore, Patch Notes, Credits, Achievements, Discord, Reset Progress, Art Room, Back) in one grid. Reset Progress sits next to Art Room with only a red outline to mark it.
- **Attention:** No order of importance. A destructive button shares a row with links that leave the game.
- **Device fit:** Buttons stack one per row on phone, which makes this a long scroll of same-looking bars.

### 10. Performance record (achievements)
Shots: `audit-shots/<size>/b06-achievements.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Tiles are consistent with each other. Earned tiles get an orange border, locked ones dim. This is close to a reusable card already.
- **Attention:** 55 tiles with 10 px descriptions. Hard to see what's close to done.
- **Device fit:** 2, 3 and 5 columns. Works. Text is too small on iPad and desktop, where there is room to grow.

### 11. Leaderboard
Shots: `audit-shots/<size>/b07-leaderboard.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The table uses 8 to 9 px Silkscreen headers. The Back button is the largest thing on the panel.
- **Attention:** The panel is a small box over busy key art, and on desktop most of the screen is the swarm picture behind it. (Offline here because the test blocks the network, so the empty state is what you see.)
- **Device fit:** The panel does not use the height it has on iPad or desktop.

### 12. Credits
Shots: `audit-shots/<size>/b08-credits.jpg` (phone, ipadp, ipadl, desk)
- **Look:** All Silkscreen caps, including names. The One Look rule says Atkinson for anything you read.
- **Attention:** Fine. It is a list.
- **Device fit:** One column on phone, four on desktop. Works.

### 13. Options and controls
Shots: `audit-shots/<size>/b09-options.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A different design language from the title panels: Atkinson bold caps heading, green READY pills, arrow steppers, a teal reset button. The strip reads ALL 4 INPUT DEVICES ACTIVE // AUTO-SAVED TO LOCALSTORAGE and rows say (BTN 0). That is developer language.
- **Attention:** The screen opens on input remapping. Sound, music and game tips, the things most players come here for, live in the pause menu instead.
- **Device fit:** Long single column on phone, two columns on iPad and desktop. Steppers are about 20 px tall on a phone, well under a comfortable tap.

### 14. What's New (patch notes)
Shots: `audit-shots/<size>/b11-whats-new-changelog.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Third heading style (Atkinson bold caps with an emoji). The orange button label includes its own key list: BACK TO MENU (SPACE / ENTER / ESC / A).
- **Attention:** Readable. The newest entry is boxed in orange, good.
- **Device fit:** Same card at every size, centered. Fine on desktop, tight on phone.

### 15. Lore archive
Shots: `audit-shots/<size>/b12-lore-archive.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Tabs are a fourth kind of pill. Strip says BUREAU OF ACTUARIAL SURVIVAL // FORM W-40 ARCHIVE.
- **Attention:** Fine for a reading screen.
- **Device fit:** Same as patch notes.


## Starting a run

### 16. Shift briefing and hire card
Shots: `audit-shots/<size>/a03-shift-briefing-first-run.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Two cards from two systems at once: a cream briefing card at the top and the slanted Spotlight band at the bottom, plus a speech bubble. Cream card, white bubble, navy band, sage tag.
- **Attention:** Top card says tap anywhere. Bottom band introduces your hero. The hero stands between them. Three reading spots before the run starts.
- **Device fit:** Positions hold at every size. On desktop the briefing card is small and far from the band.

### 17. Move to start hint
Shots: `audit-shots/<size>/a04-move-to-start-hint.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Navy box, cream outline, Silkscreen. A fifth box style in the first ten seconds.
- **Attention:** Clear and alone on screen. Good.
- **Device fit:** Text changes per input (drag, WASD). Good. Sits low on phone near the thumb, which is right.

### 18. Sound nudge
Shots: `audit-shots/<size>/c02c-sound-nudge.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A cream button with a rounded 8 px corner and an emoji. The only cream button in the game.
- **Attention:** It sits on top of the timer and age on a phone, the two numbers the HUD is built around.
- **Device fit:** Fixed 70 px from the top at every size, so it lands on the HUD everywhere.

### 19. Touch joystick
Shots: `audit-shots/<size>/c02b-touch-joystick.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A soft dark circle with a yellow dot. The yellow is off-palette.
- **Attention:** Out of the way. Good.
- **Device fit:** The lower third sits exactly where the thumb rests (measured: y 773 to 826 on a 844 px phone).


## The HUD

### 20. HUD, early run
Shots: `audit-shots/<size>/c02-hud-early-run.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Three type sizes in one corner (12, 11, 10 px), a 22 px timer, a 15 px orange age. Empty loadout slots are 12 gray squares with no labels.
- **Attention:** Calm, which is right for the first minutes. The age is the number that matters (it is the goal) and it is smaller than the timer.
- **Device fit:** On iPad portrait the HUD is the phone HUD, slightly enlarged, on a much bigger screen. The camera also zooms out, so the hero is tiny. Pause and sound buttons are 36 px on phone, under the 44 px touch minimum.

### 21. HUD with minimap
Shots: `audit-shots/<size>/c08a-hud-with-minimap.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The minimap has its own art frame and a cream room tag. It is the only framed-art element in the HUD.
- **Attention:** On a phone it takes the top right quarter of the play area (172 by 136 px) and never leaves.
- **Device fit:** It sits 57 px lower than its own CSS asks for, on every size. The site nav hides during a run but its height variable stays at 57 px, so everything positioned from it sits low.

### 22. Big map
Shots: `audit-shots/<size>/c08-minimap-big.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A navy card with a cream strip and an orange CLOSE button. Close to the standard card.
- **Attention:** Pauses the game. Clear.
- **Device fit:** The map itself is small inside the card on iPad and desktop.

### 23. HUD in Maple Hollow
Shots: `audit-shots/<size>/d02-maple-hollow-hud.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Same HUD. World labels (YOUR HOUSE, LEMONADE STAND) are cream tags that look like the minimap room tag.
- **Attention:** World labels slide under the timer and age when you walk north. Text on text.
- **Device fit:** Same as the office.


## Messages during a run

### 24. Lower third
Shots: `audit-shots/<size>/c03-lower-third.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Navy bar with a colored label block on the left: sage for tips, red for alerts, cream for promotions, orange for wins. The most consistent message in the game.
- **Attention:** 89 places in the code send messages here. It is the workhorse.
- **Device fit:** On a phone it sits under the thumb. On iPad and desktop it is capped at 720 px wide and reads well.

### 25. Center flash
Shots: `audit-shots/<size>/c04-center-flash.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Pixel text with a shadow and no backing plate, straight on the floor. Over the tan carpet the subtitle is hard to read.
- **Attention:** One slot, newest wins. A second flash erases the first mid-read.
- **Device fit:** 30% from the top at every size. On a phone that is inside the band where boss attacks are drawn.

### 26. Boss arrival card
Shots: `audit-shots/<size>/c18-boss-arrival-card.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The most characterful element: slanted band, big portrait, kicker tag, pixel name. It dims the lower 60% of the screen.
- **Attention:** It is aimed at the bottom of the screen while the boss walks in from the edge. The dim covers the floor where the first attack lands.
- **Device fit:** On a phone the band and bubble cover about a third of the play area. On desktop it is a strip along the bottom and far less intrusive.

### 27. Boss card, first attack and an alert together
Shots: `audit-shots/<size>/c20-boss-card-flash-lower-third.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Slanted band, speech bubble, TIP strip, center flash, and a lower third that was already showing. Five text styles in one frame.
- **Attention:** This is the moment the game most needs your eyes on the floor, and it has the most to read. Happens on every boss, every run.
- **Device fit:** Worst on phone, where the card, the flash and the telegraph share the same vertical band.

### 28. Boss fight
Shots: `audit-shots/<size>/c21-boss-fight-hud.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The boss gets a small name tag (HR: 27) above its head. No health bar in the HUD.
- **Attention:** You have to find the boss to read its health. Minor on desktop, real on a phone when it is off screen.
- **Device fit:** Same at every size.

### 29. Boss down stamp
Shots: `audit-shots/<size>/c22-boss-down.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A rubber-stamp banner in the world (EXCEEDS EXPECTATIONS), then a lower third, then a chest. Stamp style appears only here.
- **Attention:** Good payoff. It overlaps the next lower third by a beat.
- **Device fit:** Fine.

### 30. Promotion card
Shots: `audit-shots/<size>/c16-spotlight-room-promotion.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Same Spotlight band in teal, with a speech bubble and a TIP row. The PROMOTED line follows in the lower third once the card clears.
- **Attention:** The same news twice in a row, plus a LIFE line right after. Tips keep arriving in the lower third while the card is up.
- **Device fit:** Same as the boss card.

### 31. Tip card
Shots: `audit-shots/<size>/c17-spotlight-tip.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Spotlight band again, with a TIP row. Tips also arrive as lower thirds with a sage TIP block. Two homes for tips.
- **Attention:** A full band for a tip is loud.
- **Device fit:** Same as the boss card.

### 32. Lounge is open
Shots: `audit-shots/<size>/c25-lounge-open-card.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Spotlight band with two portraits, a speech bubble, a TIP row, a world tag and an arrow.
- **Attention:** Four signals for one event, and a lower third follows.
- **Device fit:** Same as the boss card.

### 33. GOTCHA! catch card
Shots: `audit-shots/<size>/c15-catch-card-gotcha.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A navy card with a slanted orange title, a speech bubble and a reward row. Good energy. Its own card style.
- **Attention:** Slow motion helps. On a phone it covers the chips and half the minimap.
- **Device fit:** 340 px card at every size. Small on iPad.

### 34. Boss toast (fallback)
Shots: `audit-shots/<size>/c30-boss-toast.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Red glowing box with an emoji. Off-palette red and the only glow in the UI.
- **Attention:** Rare today (only when a boss has no Spotlight card). It lands on top of the timer and age.
- **Device fit:** Covers the HUD center at every size.

### 35. The real age 45 moment
Shots: `audit-shots/<size>/c41-age-45-pileup-2.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Untouched game, jumped to just before 45. Errand strip, arrow, minimap, alert, name tags, damage numbers, a birthday line.
- **Attention:** Seven separate things to read while Bills surround you. This is the busiest minute Grok's model predicted, and it looks like it.
- **Device fit:** Phone has no room left around the hero. Desktop spreads it out but nothing is removed.


## Chips and objectives

### 36. Errand starts
Shots: `audit-shots/<size>/c10-errand-start.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A cream strip the full width of a phone, with a checkbox, a TO-DO label and a countdown. Looks like the memo strip, which is otherwise a heading.
- **Attention:** It starts with a strip, a lower third and an arrow together.
- **Device fit:** Full width under the minimap on phone and iPad portrait. Centered and narrow at the top on landscape and desktop. Two different homes.

### 37. Errand strip and arrow
Shots: `audit-shots/<size>/c11-errand-chip-and-arrow.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The arrow is a flat orange triangle. Other arrows in the game (Lounge, reorg) are drawn differently.
- **Attention:** On a phone the strip sits about 50 px above the hero (measured y 293 to 337, hero at 385). It is the closest text to the action, for up to 45 seconds.
- **Device fit:** See above.

### 38. Checked off buff
Shots: `audit-shots/<size>/c12-errand-done-buff-chip.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Sage outline, square corners, far left, 11 px text. A third chip shape.
- **Attention:** No phone rule, so it runs under the minimap and its countdown is cut off.
- **Device fit:** Left edge at every size. Overlaps the modifier chip on phone (next row).

### 39. Modifier starts
Shots: `audit-shots/<size>/c13-modifier-start.jpg` (phone, ipadp, ipadl, desk)
- **Look:** A center flash, then an alert lower third, then a chip. The code fires the flash twice.
- **Attention:** Same news three times.
- **Device fit:** Same at every size.

### 40. Modifier chip
Shots: `audit-shots/<size>/c14-modifier-chip.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Orange outline pill, rounded. Sits on top of the sage buff chip on a phone. Two chip styles colliding.
- **Attention:** Unreadable when both are up.
- **Device fit:** Top center at every size. No phone rule.

### 41. Overtime beat
Shots: `audit-shots/<size>/c28-overtime-beat-chip.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Same cream strip as errands, with a heart.
- **Attention:** Shares the errand home, which is good.
- **Device fit:** Same split as errands.

### 42. Overtime stack
Shots: `audit-shots/<size>/c29-overtime-stack.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Cream strip, orange pill, minimap, lower third: four message shapes at once. The Workload chip adds a fifth in a real Overtime run (I could not trigger it in the test; its style is in the code).
- **Attention:** Past 65 this is the normal state of the screen.
- **Device fit:** Phone loses the top third of the play area to it.

### 43. Key hunt (Maple Hollow)
Shots: `audit-shots/<size>/d03-key-hunt-chip.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Cream strip again with a key emoji. Good reuse.
- **Attention:** Strip plus a lower third saying the same thing.
- **Device fit:** Same split as errands.


## Menus that pause the game

### 44. Level-up
Shots: `audit-shots/<size>/c05-level-up.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Cards are well made: icon, name, one line, a pairs-with tag. Each card has a TAP TO SELECT button, so there are three orange buttons and no single primary.
- **Attention:** Title, subtitle, a loadout strip, a skip row, then the cards. The cards are the fourth thing down on a phone.
- **Device fit:** Rows on phone, three columns on iPad and desktop. Right idea. On iPad the cards are narrow with a lot of dead space around the panel.

### 45. Level-up with a live errand
Shots: `audit-shots/<size>/c11b-errand-chip-over-level-up.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The errand strip, its arrow and the minimap draw on top of the level-up menu.
- **Attention:** They cover the menu title and the first card. Chips and the minimap only hide for the pause menu, not for level-ups, chests or shops.
- **Device fit:** Every size. Worst on phone, where the minimap hides the heading.

### 46. Performance Bonus
Shots: `audit-shots/<size>/c31-perf-bonus.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The level-up menu with a different strip (EXECUTIVE BONUS // TAX-FREE REWARD).
- **Attention:** Reads the same as a level-up, which is fine.
- **Device fit:** Same as level-up.

### 47. Bonus chest
Shots: `audit-shots/<size>/c23-bonus-chest.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Its own frame: double gold border, FORM 401-K strip, pixel title. The only double-border card.
- **Attention:** One big OPEN button. Clear.
- **Device fit:** Same card at every size. Good.

### 48. Bonus chest, opened
Shots: `audit-shots/<size>/c24-bonus-chest-opened.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Light rays, coin count, reward list, CASH IT IN. A proper full-screen moment.
- **Attention:** The subtitle is covered by the reward icons flying out.
- **Device fit:** Good.

### 49. The Lounge
Shots: `audit-shots/<size>/c26-lounge-shop.jpg` (phone, ipadp, ipadl, desk)
- **Look:** List rows with a price line. No buy button, the row is the button. The 401(k) shop does the opposite.
- **Attention:** Clear. Scene art at the top is a nice touch.
- **Device fit:** Full screen on phone, a small card on iPad and desktop.

### 50. Lemonade Stand
Shots: `audit-shots/<size>/d04-lemonade-stand.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Same list as the Lounge without the art.
- **Attention:** Clear.
- **Device fit:** Same as the Lounge.

### 51. Pause
Shots: `audit-shots/<size>/c06-pause.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Resume is clear. Below it sit Save and Exit, Start Fresh, a hero card, run stats, a Right Now box, loadout, and seven settings rows with small steppers.
- **Attention:** The pause menu is also the settings screen and the run summary. Sound and tips live here and not under Options.
- **Device fit:** Single long column on phone. Two columns on iPad and desktop. The site nav comes back on top of it.

### 52. Retire at 80 choice
Shots: `audit-shots/<size>/c32-retire-at-80-choice.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Atkinson caps heading, italic body, two full-width buttons in orange and teal.
- **Attention:** A big decision presented as a wall of text.
- **Device fit:** Same card at every size.


## Text in the world

### 53. Speech bubble and damage numbers
Shots: `audit-shots/<size>/c09-speech-bubble-world-text.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The Dad Joke bubble is a dark box with yellow monospace text. Spotlight speech bubbles are white with navy text. Name tags are tiny red or gray labels. Damage numbers are the pixel font in white and yellow.
- **Attention:** The bubble sits on the hero for 2.3 seconds, up to 280 px wide. On a phone that is most of the screen width.
- **Device fit:** World text is drawn inside the game camera, so it shrinks on iPad when the camera zooms out. You (40) is nearly unreadable on iPad portrait.


## End of a run

### 54. Game over
Shots: `audit-shots/<size>/c33-game-over.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Art, then a strip, a headline, a quote, four stat boxes, a long earnings box with six emoji bullets, then three buttons in three colors (orange, teal, teal).
- **Attention:** The headline is good. Your score, the number you would brag about, is below the fold.
- **Device fit:** One long scroll on phone. On desktop it is the same narrow column in the middle of a wide screen.

### 55. Score and leaderboard on game over
Shots: `audit-shots/<size>/c34-game-over-scrolled.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Name field, POST SCORE in orange, then QUICK RETRY also in orange. Two primaries stacked.
- **Attention:** Quick Retry is the right default. Post Score competes with it.
- **Device fit:** Same.

### 56. Retirement (the win)
Shots: `audit-shots/<size>/d05-retirement-win-screen.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Party art and a certificate strip. Same layout as game over.
- **Attention:** The win deserves a full-screen moment. It gets the game over card with happier art.
- **Device fit:** Same as game over.


## The website

### 57. Devlog index
Shots: `audit-shots/<size>/e01-devlog-index.jpg` (phone, ipadp, ipadl, desk)
- **Look:** The cream memo card with a slight tilt is the brand at its best. Memo list cards are clean.
- **Attention:** A New here? bubble covers the filter row on phone.
- **Device fit:** Good on every size. This is the layout quality the game menus should match.

### 58. A memo page
Shots: `audit-shots/<size>/e02-devlog-memo.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Big Atkinson headline, comfortable body text at about 17 px. The game uses 10 to 13 px for the same job.
- **Attention:** Easy to read. One thing at a time.
- **Device fit:** The best-scaling page in the product.

### 59. Art Room
Shots: `audit-shots/<size>/e03-art-room.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Character cards with pose pills. Consistent.
- **Attention:** Fine.
- **Device fit:** Fine.

### 60. About
Shots: `audit-shots/<size>/e04-about.jpg` (phone, ipadp, ipadl, desk)
- **Look:** Stats block, personnel file strip, portrait.
- **Attention:** Fine.
- **Device fit:** Fine.


## Top 10 problems
Ranked by how much each one hurts "where should I be looking."

1. **One moment speaks through three or four channels at once.** A boss arrives with a card, a speech bubble, a tip strip, a center flash and often an alert. A modifier fires a flash, a lower third and a chip. A birthday is world text twice, a lower third and a flash. Nothing decides who talks. *See: Boss card, first attack and an alert together, Modifier starts, The real age 45 moment, Promotion card.*
2. **In-run messages have no single home.** The same kind of news can land in the center, the bottom, the top, a side chip or a full band. Tips alone have two homes. Your eyes have to search for where the game chose to speak this time. *See: Center flash, Lower third, Tip card, Errand starts.*
3. **The busiest reading happens exactly when you need to dodge.** The boss card dims the floor where the first attack is drawn, and on a phone the flash and the errand strip sit in the same band as the hero. *See: Boss arrival card, Boss card, first attack and an alert together, Errand strip and arrow.*
4. **Chips and the minimap draw on top of menus.** Level-ups, chests and shops open underneath a live errand strip, its arrow and the minimap. They only hide for the pause menu. *See: Level-up with a live errand.*
5. **Chips collide with each other on a phone.** The buff chip, modifier chip, errand strip, minimap and (in Overtime) the Workload chip each picked their own spot and shape. Several have no phone rule at all. *See: Modifier chip, Overtime stack, Checked off buff.*
6. **Everything in a run sits 57 px too low.** The site nav hides during a run but its height keeps being added to every position. That pushes the minimap and chips toward the hero on every device. A one-line fix. *See: HUD with minimap.*
7. **The interface does not grow with the screen.** iPad and desktop get phone-sized type (8 to 13 px) with more empty space around it. On iPad portrait the camera zooms out too, so the hero and all world text shrink. *See: HUD, early run, Title screen, first visit, Speech bubble and damage numbers, Leaderboard.*
8. **There is no one card, one button, one chip.** During a run a message can arrive in 11 different containers. Menus use more than 10 different strip headings and at least 5 pill styles. In the code: 30 font sizes, 12 corner radii, 29 stacking layers, 13 screen-width breakpoints, and 16 files that inject their own styles. *See: Options and controls, Bonus chest, Modifier chip, Shift briefing and hire card.*
9. **Most screens have several primary buttons, or none.** Eight orange BUY buttons in the shop, three TAP TO SELECT on level-up, Post Score stacked on Quick Retry. On the desktop title PUNCH IN is one of three tiles. *See: 401(k) Shop, Level-up, Score and leaderboard on game over, Title screen, returning player.*
10. **Settings and identity are scattered.** Sound and tips are in Pause, controls are in Options, stage and mode hide behind a chip on the title. Sub-menus repeat the game logo and tagline at the top of every panel. Options and patch notes use developer wording (LOCALSTORAGE, BTN 0). *See: Pause, Options and controls, Shift settings (location, mode, sprint, tax), 401(k) Shop.*

## Rami's open decisions, with what the audit adds
| Decision | Suggested | What the audit adds |
|---|---|---|
| 1. One headline + one ticker; one total on a phone during a boss | Yes | The boss rows show five text styles in one frame. Biggest single fix. |
| 2. Boss card 3.5 s vs. delaying the first attack | Shorten | Also use a compact band with no floor dim on phones. |
| 3. Rewards never take the center | Yes | The center flash has no backing plate and is hard to read on the tan floor. |
| 4. Hold errands during bosses and off milestone ages | Yes | On a phone the errand strip sits about 50 px above the hero for up to 45 s. |
| 5. Pause swarm events during the Review, Mortgage and V8 | Yes | The age 45 row is that collision. |
| 6. First modifier roll at 50.8 | Yes | Moves a pile-up apart. |
| 7. Phone center banner at 18% height | **Not 18%** | Move it to a slot directly under the HUD with a backing plate. At 18% it lands on the minimap (x 212+). The minimap gives way while a headline is up. |
| 8. Plain verbs on buttons, joke in the subtitle | Plain verbs | Labels already run long (BACK TO MENU (SPACE / ENTER / ESC / A)). Keep the humor in the line under the button. |

## What I could not capture
- The Workload chip (only draws in a real Overtime run; style read from `src/workload.js`).
- Phone landscape (not in the brief's four sizes; the spec will cover it).
- Real notches and home bars (headless browsers have no safe areas).
- Controller focus on every menu (pause menu only).
- The live leaderboard and share pages (network blocked on purpose).

## Next
1. Rami: yes or no on the eight decisions.
2. Design lead: `design-system-v1.md` (tokens, attention ladder, size classes, components, mapping table, migration order), wireframes, and two before/after mockups.
3. Nothing in the game changes until the spec is approved.

