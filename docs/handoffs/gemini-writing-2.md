# Gemini writing pass 2 (Nov 2, 2026)

**Claude review notes:**
- Prop smash lines and death lines: approved, except "PC Load Letter, my ass" (cursing, swap for a clean line).
- Section 1 (achievement unlock lines): **not usable as written.** The IDs are invented and the lines promise bonuses the game does not have (+15 Max HP, rerolls, etc.). Redo against the real list below.

I cannot directly read src/data/achievements.js from your local repo yet. Paste src/data/achievements.js here and I will map the exact achievement IDs, names, and unlock mechanics 1:1.

In the meantime, I have written the complete Prop Smash One-Liners, Ten New Death Lines, and a Template Pack of End-of-Run Achievement Unlock Lines (covering the Supply Closet/Lost Binder secret from the stage pass plus standard midlife progression milestones) in the exact Midlife Survivors voice: warm, deadpan, relatable, never mean, and with zero em dashes.

1. Achievement Unlock Messages (end-of-run summary lines)

Drop-in one-liners explaining what changes on the next run. Paste src/data/achievements.js and I will bind these to your exact keys and reward values.

export const ACHIEVEMENT_UNLOCK_LINES = {
  // Known Campus / Stage Pass Unlocks
  lost_binder: 'The Supply Closet is now unlocked. Help yourself to the good gel pens and the secret army cot.',
  age_45_break: 'The Break Room and Parking Lot gates now open at Age 45. Your ideas finally have somewhere to park.',
  age_50_meetings: 'The Server Room and Conference Wing now unlock at Age 50. Please remember to mute your mic.',
  age_55_exec: 'The Executive Wing gate is now on your calendar for Age 55. Practice your putting.',
  age_60_wellness: 'HR has approved your access to the Wellness Corner at Age 60. The lavender spray awaits.',

  // Progression / Stat / Loadout Unlocks (Template Pack)
  first_promotion: 'You start your next shift with a slightly higher base salary and a calmer lower back.',
  coffee_mastery: 'The breakroom pot is now brewed fresh for your next run, granting +10% morning movement speed.',
  ergonomic_enlightenment: 'Facilities upgraded your lumbar support. You begin your next run with +15 Max HP.',
  inbox_zero: 'Your spam filter is finally working. You gain +1 extra reroll on level-up memos.',
  reply_all_survivor: 'You have learned when to mute the thread. Area-of-effect radius increases by 10% on future runs.',
  spreadsheet_wizard: 'Your macros are locked in. Experience gems pull in from 20% further away next shift.',
  vested_401k: 'Compound interest kicks in. Leftover XP at the end of each wave now pays a small health dividend.',
  tenure_track: 'HR knows your name in a good way. You start your next run with one free passive item already equipped.',
  printer_whisperer: 'Destructible office props now have a higher chance of dropping warm snacks instead of paper clips.',
  tax_bracket_veteran: 'Your accountant found a deduction. Elite enemies drop 15% more experience on your next run.'
};


2. Smashed Prop One-Liners

Short lower-third or floating text lines when the player breaks a prop. Multiple options per prop so you can pick your favorite or rotate them.

Printer

⚬ "PC Load Letter, my foot. Oh look, a warm bagel."
⚬ "That was for Tuesday. And also for every Tuesday since 2016."
⚬ "The magenta cartridge was full the whole time. You knew it."

Filing Cabinet

⚬ "Seven years of receipts, finally set free. Tax season can wait."
⚬ "The bottom drawer was only stuck because of an old pair of sneakers."
⚬ "Everything labeled MISC has officially been resolved."

Vending Machine

⚬ "The spiral finally let go of the pretzels from 2022. You earned these."
⚬ "No more smoothing out crumpled dollar bills on the edge of your pants."
⚬ "B4 was stuck for a month. Consider this a public service."

Trash Can

⚬ "Mostly crumpled drafts of polite emails and one very good coupon."
⚬ "Three cold coffee cups and a stress ball that still has some squeeze left."
⚬ "Recycling is on Thursdays, but today is about survival."

Water Cooler

⚬ "It made one last majestic glug before going down. Stay hydrated."
⚬ "Five gallons of spring water and zero small talk. A clean break."
⚬ "The little paper cone cups are everywhere. Watch your step."

Lost and Found

⚬ "Fourteen left gloves, three prescription reading glasses, and a decent umbrella."
⚬ "So that is where your good fleece vest went two winters ago."
⚬ "Nobody ever claims the Tupperware lids. Take one for luck."

Coat Rack

⚬ "Built to hold four jackets, bravely carrying nineteen since November."
⚬ "It wobbled with dignity for years. Grab the scarf and keep moving."
⚬ "Someone left a cough drop in that cardigan pocket. Today is your day."

Potted Plant

⚬ "Turns out the ficus was plastic all along. You can stop feeling guilty now."
⚬ "Just potting soil, pebbles, and forty years of leftover coffee splashes."
⚬ "It survived three office moves and a fluorescent light shortage. Rest easy, little guy."

3. Ten New Death Lines

Warm, recognizable midlife defeat screens. Never mean, zero em dashes.

1. "You pulled something reaching for a dropped pen. Take the rest of the afternoon to ice it."
2. "You accidentally clicked Reply All and decided it was best to simply go home."
3. "Your reading glasses were on top of your head the entire time. Rest your eyes and try again tomorrow."
4. "A calendar invite with no agenda finally caught up to you. Clock out and go get a sandwich."
5. "You stood up a little too fast and the third floor won this round. Drink some water before your next run."
6. "Your password expired mid-battle and required a special character you have never seen before."
7. "That five-minute quick sync turned into a two-hour workshop. Nobody blames you for lying down."
8. "The breakroom decaf pot was mislabeled again. Go home, put your feet up, and start fresh at nine."
9. "You gave it a solid eight hours, plus a working lunch. The spreadsheets will still be here when you get back."
10. "Your lower back filed a formal grievance with HR. Grab a heating pad and we will circle back tomorrow."

Paste src/data/achievements.js whenever you are ready and I will match Section 1 directly to your live achievement keys!