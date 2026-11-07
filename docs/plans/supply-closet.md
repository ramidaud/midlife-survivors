# Supply Closet (design, Nov 7)

Rami's calls: it's a **secret back hallway from the Server Room to the Executive Wing**, it opens with a **new easter egg (the badge reader glitch)**, and what's inside **changes randomly every run**.

## Where (changed Nov 7: it's a secret back hallway now)
- A long, narrow closet in the empty space **between the Server Room's east wall and the Executive Wing's west wall** (map x 1248 to 2208, y -1680 to -1440, about 960×240).
- One door in the Server Room's east wall (around y -1560, walls 131/132) and one in the Executive Wing's west wall (around y -1560, wall 174).
- **Why it matters:** the Server Room opens at 50 and the Executive Wing at 55. Find the closet and you can sneak into the corner office up to five years early. The early Executive Wing is quiet (no enemies spawn in a room before its promotion) and June's butterscotch is waiting.

## How it opens: the badge reader glitch (Rami's pick)
- A badge reader on the Server Room wall next to the closet door blinks red.
- **Stand on the floor plate in front of it for 5 seconds without getting hit.** It beeps, turns green, and the door slides open: "Badge accepted. Please don't tell IT."
- Getting hit resets the 5 seconds. A small ring fills up while you stand there, so players can tell something is happening.
- It works in any run once the Server Room is open (age 50). Both doors open together.
- **First time ever:** the achievement **"Please Don't Tell IT"** (🪪, 5k).
- Enemies can't path through the closet until it's open (same rule as promotion doors).
- The old idea (opens at 50 Bills paid) is dropped.

## What's inside: today's supply (random each run)
The room always has the joke props, plus one random "supply" that is rolled when the door opens:

| Roll | What you find | Lower-third line |
|---|---|---|
| **Bonus chest** | One bonus chest (the one that already exists) | "Somebody expensed this and forgot." |
| **Nap spot** | No enemies spawn inside. Stand still for 2 seconds and heal 1 HP every 2 seconds. Leave and it stops. | "Lights off. Door closed. Nobody checks the Supply Closet." |
| **Stash** | 3 coin piles and a Leftover Pizza | "Petty cash. Technically." |
| *Later: weapon* | A closet-only weapon unlock (e.g. a red stapler). Needs its own art and balancing, so it joins the roll later. | |

**Always there (decor with captions):**
- shelves of paper reams and toner
- a lost-and-found bin ("Every pen you've lost since 2009.")
- a mop bucket
- a single dusty chair

## Build plan (each step is one sitting, and each ends playable)
1. **Room, doors and badge reader.** Build the closet's floor and walls, the two doors and the badge reader in a new `src/supply-closet.js`, plus the 5-second trigger and the achievement. Use placeholder art until ChatGPT's arrives.
2. **The three rolls.** Chest, nap spot, stash. Plus a dev-console shortcut to open the closet.
3. **Art pass.** ChatGPT's closet props and the 4-frame cabinet slide (handoff: `docs/handoffs/chatgpt-supply-closet.md`).
4. **Later:** the closet-only weapon.

## Open questions
- Should the room show on the office map (minimap) before it's found? Proposal: no. It appears after it opens.
