# UI audit, round 2 (design system C3, Nov 10, 2026)

The same capture script as the first audit (`docs/design/audit-tools/capture.py`), run again on V2.27.7 at phone, iPad portrait, iPad landscape and desktop. Before and after sheets (old on the left, new on the right) are in `docs/design/audit-shots-c3/`.

**Short version:** six of the ten problems are retired, three are better but still open, and one (the code underneath) hasn't moved. Two new problems showed up, and both are small.

## The first top 10, checked again

| # | Problem (Nov 10 audit) | Now | What the new shots show |
|---|---|---|---|
| 1 | One moment speaks through three or four channels | **Better, still open** | The boss arrives with one card and nothing else. But an alert still shows twice: the same words in the headline and again in the ticker (TAX SEASON, RENT HIKE). |
| 2 | In-run messages have no single home | **Retired** | Alarms sit in the headline slot under the HUD, story lines in the ticker at the bottom, and chips in the status row. |
| 3 | The busiest reading happens while you dodge | **Retired** | No floor dim during the boss card. On a phone the headline sits at y 90 to 138, well above the hero (about y 385). |
| 4 | Chips and the minimap draw on top of menus | **Retired** | The level-up with a live errand shows only the menu. |
| 5 | Chips collide on a phone | **Retired** | One objective chip and one status chip, stacked beside the map (y 102 to 183). |
| 6 | Everything in a run sits 57 px too low | **Retired** | Phone HUD ends at y 94 (was 112), map starts at y 96 (was 115). |
| 7 | The interface doesn't grow with the screen | **Better, still open** | Migrated menus and the HUD scale up on iPad and desktop. The B8 screens (achievements, leaderboard, credits, extras, lore) still use phone-size type. |
| 8 | No one card, one button, one chip | **Better on screen, not in code** | Every migrated screen uses the same Sheet, Button, Row and Chip. But the code still has 31 font sizes, 21 corner styles, 27 layers, 14 breakpoints, 17 files that inject styles and 344 hex colors. The new parts were added on top, and the old rules were never deleted. |
| 9 | Several primary buttons, or none | **Retired** | Shop, level-up, title, pause, game over, chest and the small pop-ups each have one orange button. |
| 10 | Settings scattered, developer wording | **Mostly retired** | One Settings sheet (B2), plain words everywhere (C2). The B8 screens still repeat the game logo at the top. |

### Code counts, same method both times
| What | Nov 10 audit | Now |
|---|---|---|
| Font sizes in px | 31 | 31 |
| Corner styles | 17 | 21 |
| Stacking layers | 27 | 27 |
| Width breakpoints | 12 | 14 |
| Files that inject their own styles | 16 | 17 |
| Hex colors | 341 | 344 |

(Token fallbacks like `var(--ms-accent, #EF9347)` are not counted. The first audit's "30 font sizes, 12 radii, 29 layers" came from a slightly different count; this table uses one method for both.)

## New top list, re-ranked

1. **Alerts show twice.** `showLowerThird` sends an alert to the headline and also queues it for the ticker, so the same sentence is on screen twice. During a boss on a phone that breaks "one total." Small fix in `src/ui.js`.
2. **B8 screens are still the old style.** Achievements, leaderboard, credits, extras, patch notes and lore: repeated logo, phone-size type on big screens, emoji tabs. This is step B8, which is still open.
3. **The iPad nav overlaps itself.** At iPad portrait width the brand name sits under the TITLE SCREEN button. It was there before, but the old orange button hid it.
4. **Old CSS is still underneath.** The counts above haven't dropped. A cleanup pass would delete the rules the new parts replaced. It isn't urgent for players, but it makes every later change riskier.
5. **The headline touches the HUD on a phone.** It starts at y 90 while the HUD ends at y 94, a 4 px overlap. Cosmetic.

## What I could not capture
- Same limits as the first audit: no real notches, no live leaderboard, no phone landscape.
- iPad landscape only has its menus. The in-run pass was cut off twice by the cloud machine restarting, so the in-run checks come from phone, iPad portrait and desktop.
- Two desktop title shots timed out; the title was already checked at desktop size in step B5.
- Shot 5 ("the headline touches the HUD") is measured on phone only.
