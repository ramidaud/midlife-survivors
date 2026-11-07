# Supply Closet (design, Nov 7)

Rami's calls: it opens when you **pay off 50 Bills in a run** (the plan already in the map notes), and what's inside **changes randomly every run**.

## Where
- A small room tucked into the empty space **between the Lobby's north wall and the Server Room** (map x 0 to 512, y -1232 to -880, about 512×352).
- The door is the existing **FILES cabinet** art (`gate_hidden_cabinet`, the one with the lavender binder sticking out), standing against the Lobby's north wall at about x 256.
- Nobody has a reason to notice it until it clicks open, and the binder is the hint.

## How it opens
- When you've paid off 50 Bills this run, the cabinet slides aside (4 frames, 320 ms, already in the map notes).
- The lower third says: "A filing cabinet clicks open. You found the Supply Closet."
- It opens in **every run that hits 50 Bills**, not only the first time.
- **First time ever:** the achievement **"Inventory Day"** (🗄️, 5k).
- Enemies can't path into the closet until it's open (same rule as promotion doors).

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
1. **Room and door.** Build the closet's floor, walls and the cabinet door in a new `src/supply-closet.js`, plus the 50-Bills trigger and the achievement. Use placeholder props until the art arrives.
2. **The three rolls.** Chest, nap spot, stash. Plus a dev-console shortcut to open the closet.
3. **Art pass.** ChatGPT's closet props and the 4-frame cabinet slide (handoff: `docs/handoffs/chatgpt-supply-closet.md`).
4. **Later:** the closet-only weapon.

## Open questions
- Should the room show on the office map (minimap) before it's found? Proposal: no. It appears after it opens.
