# Grok brief: difficulty check with real play data (Nov 3, 2026)

Thanks for the healing spec. All of it is in the game: birthday cake, the Desk Salad, intern deliveries and the Lounge (V. 1.61 to 1.63). Now we have real runs from after it shipped. Question: **is the difficulty curve right?**

## The game in one paragraph
Midlife Survivors is a Vampire Survivors-style game. You only move; weapons fire on their own. A run goes from **age 40 to 65 at 45 seconds per year** (about 19 minutes). Enemies are bills, spam calls, group chats and other midlife things, with bosses at 45 (Performance Review), 52 (30-Year Mortgage) and 60 (Midlife Crisis V8). After 50, random "life happens" modifiers kick in for a couple of years. The **Tax Bracket** (0 to 5) is an opt-in hard mode.

## The data (anonymous play stats, Midlife mode starting at 40, pulled Nov 3)
Not every run ends in a death: some are quits or restarts. Dev mode runs are never recorded.

**Overall**
| Era | Runs | Players | Died | Cleared (reached 65) | Quit/restart | Median age | Avg age | Avg minutes | Avg level |
|---|---|---|---|---|---|---|---|---|---|
| Before healing (V. 1.30 to 1.60) | 217 | 38 | 143 | 0 | 74 | 43.3 | 45.3 | 4.0 | 7.6 |
| After healing (V. 1.61 to 1.69) | 32 | 12 | 23 | 1 | 8 | 48.4 | 51.8 | 8.8 | 12.9 |

(Average damage taken went from 24 to 342 per run, but health and damage numbers were rescaled in between, so don't compare those two.)

**Age at death, after healing (23 deaths)**
| Age | 40 | 42 | 43 | 47 | 49 | 55 | 60 | 61 | 81* |
|---|---|---|---|---|---|---|---|---|---|
| Deaths | 3 | 2 | 2 | 1 | 2 | 1 | 3 | **8** | 1 |

\*One run used Delayed Retirement overtime.

**Age at death, before healing (143 deaths)**
40: 9 · 41: 13 · 42: 15 · 43: 19 · 44: 7 · 45: 12 · 46: 8 · 47: 11 · 48: 6 · 49: 2 · 50: 4 · 51: 8 · 52: 9 · 54: 3 · 58–59: 2 · 60: 13 · 62–63: 2

**What killed them, after healing**
Group Chat 9 (avg age 63.4) · Bill 5 (42.8) · Spam Call 3 (50.8) · Snack Attack 3 (50.9) · Office Gossip 1 · Midlife Crisis V8 1 · Late Fee 1

**By hero, after healing:** Grad Student 19 runs, avg age 57.1 · 9-to-5er 13 runs, avg age 44.0
**By device, after healing:** desktop 19 runs, avg age 55.7 · phone 13 runs, avg age 46.0
**By Tax Bracket, after healing:** 0: 8 runs, avg 45.8 · 1: 2, avg 40.1 · 2: 4, avg 67.1 · 3: 3, avg 54.3 · 5: 15, avg 51.9

## What it seems to say (check our reading)
1. **Healing helped.** The median death moved from about 43 to 48, and runs doubled in length.
2. **A wall at 60–61.** Eight of 23 deaths happen right at 61, and the Group Chat is the top killer, at an average age of 63. The V8 boss arrives at 60 too.
3. **The early game is still rough for the 9-to-5er and on phones.** The starting hero averages 44, and phones run about 10 years shorter than desktop.
4. **Small sample:** 32 runs from 12 players, and one or two players likely make up most of the Tax 5 runs.

## Questions for you
1. **Is the 60–61 wall a spike we should smooth, or a fair final exam?** If smooth: what would you change first, the Group Chat (stats below) or the overlap with the V8 boss?
2. **The opening (40 to 45):** what's the smallest change that gets a new player using the 9-to-5er past 45 more often, without making it boring?
3. **Phones vs desktop:** what could explain a gap this size (touch controls, smaller view, frame rate), and what data should we add to find out?
4. **Healing:** is it about right now, or is it hiding a problem? (The healing config file says what to turn down first.)
5. **What's a healthy target curve** for ages at death in a ~19-minute run like this? For example, what share of runs should reach 50, 55 and 65?

## Current numbers you'll want (attach these files)
- `src/data/enemies.js`: enemy stats. The Group Chat: speed 80, 4 HP, 1 damage, keeps 260 px away, fires a message ping every 2.6 s after a 0.65 s "typing..." warning.
- `src/data/healing.js`: birthday cake 18% at 45 and 55, 25% at 50 and 60, 22% at 65.
- `src/data/pickups.js`: pizza and the Desk Salad.
- `src/data/swarms.js` and `src/data/waves.js`: spawn pacing by age.
- `src/data/interns.js`: delivery cadence and payloads.
- `src/data/bosses.js`: boss attacks.

## Return format
A short spec like last time (`docs/handoffs/grok-difficulty-spec.md`): what to change, exact numbers, why, and what to watch in the stats afterward. Keep each change small and reversible. Log it in `docs/handoffs/grok-changes.md`.
