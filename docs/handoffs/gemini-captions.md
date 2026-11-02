# Gemini captions (Nov 1, 2026)

Text-only handoff from Gemini: MEMO captions for the remaining districts and overheard lines for ambient coworkers.
**Claude's review notes:**
- Set A (keyed to the stage brief) is the main library: landmarks, promotion gates, remaining slang and posters.
- Set B is extra district flavor. Good ideas for new props (crash cart, dongle ring, rubber band ball, puzzle table, stray cart).
- Props that already exist in the game keep ChatGPT's captions (roundabout, gauge, fruit tree, pool, base, ocean pot, ducks, goalposts, STOP, lamp). Gemini's versions of those are alternates only.
- Small edits applied: brand name removed (staplers), "o clock" fixed, "Let us" changed to "Let's".



## 1. Drop-In `window.STAGE_PROPS.captions` Object

```javascript
  // === SERVER ROOM ("Take It Offline") ===
  server_rack_blinking: 'Rows of little blue lights blinking in the chill. It is the closest thing the third floor has to a fireplace.',
  server_taken_offline: 'TAKEN OFFLINE. Someone pulled the plug and taped a polite note to the chassis.',
  slang_unplugged_lamp: 'Let's take this offline. Somebody took the memo literally and unplugged the floor lamp.',
  slang_boil_ocean: 'A tiny ocean simmering on a breakroom hot plate. Management asked us to boil it by Friday.',
  server_cable_waterfall: 'Color-coded in 2014 by an intern with a dream. Nobody has dared to unplug the yellow wire since.',
  server_crash_cart: 'A forty-pound monitor on a squeaky cart. When the cloud goes down, this old friend still listens.',
  gate_authorized_only: 'AUTHORIZED PERSONNEL. You will need a few more birthdays on your badge before IT lets you in.',

  // === EXECUTIVE WING ===
  exec_putting_green: 'A velvet putting mat with an automatic ball return. Quarter four is all about the short game.',
  exec_thought_leader_chair: 'THE THOUGHT LEADERSHIP CHAIR. Currently empty, which leaves plenty of room for thoughts.',
  slang_move_needle: 'The giant wall gauge is stuck firmly on MEH. We have a task force looking into nudging it.',
  slang_flagpole_memo: 'Someone ran the new Dress Code memo all the way up an indoor flagpole. Nobody is saluting yet.',
  slang_piece_of_pie: 'A literal pie chart on the credenza, already half eaten. Help yourself to a slice of Q3.',
  slang_herding_cats: 'Six cats on one mahogany desk and none of them have read the agenda. Management is doing its best.',
  gate_executives_only: 'EXECUTIVES ONLY. Keep surviving until fifty-five and they might give you the keycard.',

  // === CONFERENCE ROOMS ("Synergy", "Bandwidth", "Alignment") ===
  conf_room_synergy: 'Conference Room Synergy. Booked every Tuesday since 2019 by a recurring invite nobody owns.',
  conf_room_bandwidth: 'Conference Room Bandwidth. Ironically, the Wi-Fi barely reaches the far end of the table.',
  conf_room_alignment: 'Conference Room Alignment. All twelve chairs are adjusted to slightly different heights.',
  conf_nine_hour_meeting: 'Hour nine of the quarterly roadmap sync. The dry-erase markers gave up around lunch.',
  slang_hard_stop: 'A literal aluminum STOP sign bolted outside the glass. This meeting ends at three, no exceptions.',
  slang_touch_base: 'First base is taped right to the carpet. Step on it on your way to the whiteboard so it counts.',
  slang_move_goalposts: 'Regulation soccer goalposts on rolling dollies. Facilities moves them twenty feet every Friday.',
  poster_synergy_staplers: 'SYNERGY: Two office staplers locked in mortal combat. Only one is coming out with staples.',
  poster_teamwork_dumb: 'TEAMWORK: Because none of us is as confused as all of us.',
  poster_think_big: 'THINK BIG, printed in twelve-point font. The framing budget went to the mahogany border.',

  // === SUPPLY CLOSET / ARCHIVE ===
  supply_binder_mountain: 'Mountains of three-ring binders dating back to the nineties. Half of them just say MISC.',
  supply_lost_binder: 'The lost lavender binder from Post 6. Tucked safely behind the bulk staples where it belongs.',
  supply_secret_cot: 'A folding army cot behind the paper towers. The best-kept secret in the building since 2011.',
  slang_outside_box: 'He is sitting inside a copier paper box to help himself think outside of it. Please do not disturb.',
  slang_ducks_in_row: 'Five rubber ducks lined up on the shelf, and one facing the wall. Close enough for a Thursday.',
  poster_hang_one_claw: 'Hang in there. The cat is down to one claw, and honestly we respect the grip.',

  // === WELLNESS CORNER ===
  wellness_sad_yoga_mat: 'One thin purple yoga mat rolled out on the linoleum. Your lower back appreciates the gesture.',
  wellness_mandatory_fun: 'MANDATORY FUN. The banner is held up with masking tape and very high hopes.',
  wellness_nap_pod_broken: 'NAP POD: OUT OF ORDER. You are still welcome to sit next to it and close your eyes.',
  slang_deep_dive: 'A plastic kiddie pool with a diving board in the corner. Please take off your badge before diving.',
  slang_low_hanging_fruit: 'A potted ficus with a single plastic apple tied to the bottom branch. Easy pickings.',
  poster_success_pto: 'SUCCESS. Someone crossed out the last two letters and wrote PTO DENIED in marker.',
  poster_no_i_in_team: 'THERE IS NO I IN TEAM. Penciled neatly underneath: but there are two in quiet quitting.',
  gate_please_see_hr: 'PLEASE SEE HR. At age sixty they finally let you into the room with the lavender spray.',

  // === THE PARKING LOT (Remaining Cars & Slang Props) ===
  car_blockchain: 'BLOCKCHAIN. Parked diagonally across two spaces in 2021. Nobody remembers who has the keys.',
  car_casual_fridays: 'BRING BACK CASUAL FRIDAYS. Parallel parked with care and waiting for a hero.',
  slang_circle_back: 'A tiny plastic roundabout right in the middle of the lane. Yield to oncoming action items.',
  slang_firehose_cooler: 'A canvas firehose hooked right up to the water cooler. Take small sips during onboarding.',
  slang_per_last_email: 'PER MY LAST EMAIL. Taped right to the glass so nobody can claim it went to spam.',
  gate_parking_break: 'BREAK ROOM AND LOT. Congratulations on turning forty-five, you have earned a lap around the cars.'


## Set B: extra district flavor
 `window.STAGE_PROPS.captions` Block

```javascript
  // --- Server Room ---
  server_rack: 'Thousands of tiny green lights blink in unison. None of them know the Wi-Fi password either.',
  server_cable_waterfall: 'Color-coded in 2014 by someone with a vision. Nobody has touched the blue wire since.',
  server_portable_ac: 'The building chiller is on sabbatical. The five-gallon bucket is doing its best.',
  server_crash_cart: 'The monitor weighs forty pounds and only speaks green. It has saved the company twice.',
  server_folding_chair: 'Parked right behind the warm exhaust fan. The best seat in the house during a Tuesday outage.',
  server_backup_tapes: 'Seven years of spreadsheets, safely stored on plastic bricks. Sleep well knowing 2018 is secure.',

  // --- Executive Wing ---
  exec_credenza: 'Polished to a mirror shine every Thursday. Holds three crystal triangles and a bowl of good mints.',
  exec_putting_mat: 'The plastic cup returns the ball with a polite whirr. Quarter four is all about the short game.',
  exec_founder_portrait: 'Painted before two-factor authentication was invented. He looks very proud of us anyway.',
  exec_ficus_tree: 'The only plant on the floor with its own vendor contract. It has outlasted three vice presidents.',
  exec_visitor_chair: 'Real leather that sinks three inches lower than you expect. Standing back up is a team-building exercise.',
  exec_award_cabinet: 'Heavy acrylic stars for synergies nobody quite remembers. They catch the afternoon light nicely.',

  // --- Conference Rooms ---
  conf_speakerphone: 'Please lean toward the plastic starfish when speaking. It is trying to hear six people and a radiator.',
  conf_whiteboard_saved: 'DO NOT ERASE. The flowchart is from November, and at this point it is load-bearing.',
  conf_dry_erase_tray: 'Eight markers in four colors. Together they hold roughly half a word of ink.',
  conf_dongle_ring: 'Every display adapter invented since 2011 on one wire loop. Your laptop port is in the next room.',
  conf_glass_wall: 'Frosted at eye level for privacy. You can still tell who is pacing by their shoes.',
  conf_pastry_box: 'Half a cheese danish and a plastic knife. Nobody wants to be the person who takes the last crumb.',

  // --- Supply Closet ---
  supply_toner_stack: 'Guarded more closely than the petty cash box. Shake the magenta gently before installing.',
  supply_sticky_wall: 'Canary yellow for gentle reminders. Neon pink for when the spreadsheet is due at noon.',
  supply_good_pens: 'The 0.7mm gel pens are hidden behind the legal pads. Take one and tell no one.',
  supply_kick_stool: 'Rolls smooth and locks down with a solid rubber thud. The top shelf of binders respects your reach.',
  supply_mystery_keys: 'Thirty little paper tags and not a matching lock in sight. One of them just says Old Shed.',
  supply_rubber_band_ball: 'Started during the software migration three summers ago. Now roughly the size of a cantaloupe.',

  // --- Wellness ---
  wellness_massage_chair: 'Sounds like a bag of walnuts in a dryer. Still the best fifteen minutes on the third floor.',
  wellness_zen_fountain: 'Trickles over river pebbles to mask the hum of the copier. Top it off before the pump starts slurping.',
  wellness_sad_lamp: 'Ten thousand lumens of simulated July. Sit here for ten minutes and pretend you hear seagulls.',
  wellness_yoga_mats: 'Three foam mats and a bottle of lavender spray. Your lower back will thank you by three o'clock.',
  wellness_puzzle_table: 'A thousand-piece lighthouse that has been at eighty percent since February. Snap in a piece of sky for a quick win.',
  wellness_quiet_pod: 'Felt walls that swallow the sound of notifications. Step inside and breathe like nobody is scheduling you.',

  // --- Parking Lot ---
  lot_compact_spot: 'COMPACT ONLY. Painted by an optimist with a very narrow tape measure.',
  lot_shade_tree: 'Covers two and a half spaces in cool shadow by mid-afternoon. Arriving early enough to get it feels like a bonus.',
  lot_traffic_cone: 'Standing watch over the same dip in the asphalt since April. We steer around it out of respect.',
  lot_stray_cart: 'Traveled four blocks from the grocery plaza to retire in the mulch bed. Honestly, good for it.',
  lot_ev_charger: 'Two plugs and a very polite group chat. Remember to move your car when you hit eighty percent.',
  lot_badge_gate: 'Roll your window down and stretch your shoulder. Wait for the friendly green beep before you coast through.'

20 Ambient Coworker "Overheard" Lines

Short, one-breath lower-third or speech-bubble lines. Warm, tired, relatable, zero em dashes.

Asleep Under a Desk (5)

1. "The carpet down here is firmer than my ergonomic chair."
2. "Tell the two o'clock sync I am aligned in spirit."
3. "My chiropractor said ten minutes of floor time counts as stretching."
4. "If you drop a pen, I will hand it right back up."
5. "Just resting my eyes while the big spreadsheet saves."

Water Cooler Crowd (5)

6. "I brought zucchini from the garden. Please take two before I have to bake bread."
7. "Wait for the big bubble to glug to the top. That is how you know it is cold."
8. "We are not loitering. This is a cross-functional hallway sync."
9. "My left knee knew it was going to rain two days before the forecast did."
10. "Someone put a real bagel cutter by the toaster. Today is going to be a good day."

On a Call (5)

11. "Sorry, I was muted on the laptop AND on the little cord button."
12. "Can everyone see the slide deck, or are you still looking at my desktop wallpaper?"
13. "Let's park that in the lot and circle back when we have had lunch."
14. "No rush at all, finding the right browser tab is half the battle."
15. "I think we are both saying yes in different fonts."

Microwaving Fish (5)

16. "I put a damp paper towel over the cod. That traps at least eighty percent of it."
17. "It is lemon pepper tilapia and my doctor said we are doing heart-healthy now."
18. "Forty seconds on medium power. I am watching the timer like a hawk."
19. "I brought extra lemon wedges if anyone wants to forgive me."
20. "In my defense, it already smelled like burnt popcorn in here."


