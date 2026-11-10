// Single source of truth for Midlife Survivors Version Tracking & Patch Notes (`src/data/version.js`).
// Update `version`, `displayVersion`, `lastUpdated`, `build`, and prepend a `changelog` entry after each finished step!

const GAME_VERSION = {
  version: "2.27.4",
  displayVersion: "V. 2.27.4",
  lastUpdated: "Nov 10, 2026",
  codename: "Version Two",
  build: 342,
  changelog: [
    {
      ver: "V. 2.27.4", date: "Nov 10, 2026", title: "Version Two",
      teaser: "The end of a run, without the paperwork.",
      highlights: [
        "Game over and retirement lead with what you want to know: your score and your age, big, side by side.",
        "RETRY is right under them (and under your thumb on a phone), with Shop and Title beside it.",
        "The pay stub, goals and paycheck details fold into a drawer you can open when you're curious."
      ]
    },
    {
      ver: "V. 2.27.3", date: "Nov 10, 2026", title: "Version Two",
      teaser: "One orange button on the title. You know which one.",
      highlights: [
        "PUNCH IN is now the only orange thing on the title screen, on every device.",
        "The shift chip under it says where you're working today (The Office or Maple Hollow), plus your mode and tax bracket.",
        "On phones, a bar along the bottom keeps Shop, Scores, Extras, Settings and the Devlog one tap away, and the site menu gets out of the way."
      ]
    },
    {
      ver: "V. 2.27.2", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your 401(k), front and center.",
      highlights: [
        "The 401(k) Shop shows your balance big at the top, then one row per upgrade: what it does, your level, and a price tag.",
        "No more wall of orange BUY buttons. Tap a row to buy it. Maxed upgrades get a check, locked ones say how to unlock them.",
        "On a phone you can see your balance and six upgrades without scrolling."
      ]
    },
    {
      ver: "V. 2.27.1", date: "Nov 10, 2026", title: "Version Two",
      teaser: "The Lounge got a menu you can actually read.",
      highlights: [
        "The Lounge and the Lemonade Stand list each item as one big tappable row: what it is, what it does, and a price tag on the right.",
        "Things you can't buy say why (too pricey, sold out) with a little lock. Your 401(k) balance sits right at the top.",
        "Same layout on phone, iPad and desktop, and one orange button: BACK TO WORK."
      ]
    },
    {
      ver: "V. 2.27.0", date: "Nov 10, 2026", title: "Version Two",
      teaser: "All your settings, in one drawer.",
      highlights: [
        "New Settings screen: sound, music and effects volume, sound style, the Dad Joke voice, game tips and controls, all in one place.",
        "It's the same screen from the pause menu and from the title (the old OPTIONS button), so a change in one shows in the other.",
        "The pause menu is calmer: RESUME, Settings, Save & exit, Start over, and your run at a glance."
      ]
    },
    {
      ver: "V. 2.26.9", date: "Nov 10, 2026", title: "Version Two",
      teaser: "One orange button. You know what it does.",
      highlights: [
        "The level-up menu has a proper bottom bar: SKIP and REROLL on the left, one orange PICK button on the right that names the card you're on.",
        "On a phone, tap a card, then tap PICK (or the card again). On a controller: A picks, X rerolls, Y skips.",
        "Buttons say what they do in plain words; the joke moved to the line underneath."
      ]
    },
    {
      ver: "V. 2.26.8", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your age is the big number now. As it should be.",
      highlights: [
        "The HUD leads with your age, with the clock tucked underneath. Pause and sound are bigger, easier buttons, and empty item slots only show up when you level up.",
        "On phones the camera sits a little closer, so your hero is never smaller than a fingertip.",
        "Phone held sideways: the HUD fits in one row, the minimap shrinks, and the message bar stays short, so most of the screen is the floor."
      ]
    },
    {
      ver: "V. 2.26.7", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your thumb was sitting on the news.",
      highlights: [
        "On touch phones the bottom message bar sits higher, so your thumb on the joystick doesn't cover it. The full sentence fits now too.",
        "Speech bubbles all look the same: cream paper, easy-to-read text. Your Dad Jokes finally float above the furniture.",
        "No more than six little pop-ups (+HP, coins, DODGED!) float at once, so a big pickup moment doesn't bury your hero in text."
      ]
    },
    {
      ver: "V. 2.26.6", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your birthdays got a lot less crowded.",
      highlights: [
        "Errands and the Lounge now wait until there's no boss and you're a little past the big birthdays (45, 50, 55, 60). Swarm events wait for the boss to go down.",
        "Turning 50 or 60 is one line now: the new decade, the cake and the dividend together.",
        "Rewards stay in the bottom bar instead of the top. The first life modifier waits until 50.8, and a boss card or the bottom bar never talk over each other."
      ]
    },
    {
      ver: "V. 2.26.5", date: "Nov 10, 2026", title: "Version Two",
      teaser: "The little reminders got their own shelf.",
      highlights: [
        "To-dos, modifiers, Workload and buffs now live in one row under the HUD: at most one thing to do and one thing that's on you. No more chips stacked on top of each other.",
        "The to-do chip just says where to go and how long you have. The full sentence still shows once at the bottom.",
        "On phones the row sits next to the minimap instead of under it, so your hero has the middle of the screen to themselves."
      ]
    },
    {
      ver: "V. 2.26.4", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Bosses still make an entrance. They just don't turn the lights off anymore.",
      highlights: [
        "Boss arrival cards are shorter (3.5 seconds) and no longer dim the floor, so you can see the first attack being drawn while the boss introduces itself.",
        "On phones the boss card is a compact band with the name and the one dodge tip. No speech bubble over the action.",
        "The boss's own first-attack notice is skipped while its card is up, since the card already tells you how to dodge."
      ]
    },
    {
      ver: "V. 2.26.3", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Big notices moved out of your way.",
      highlights: [
        "The big notices no longer float over the middle of the floor. They drop into a solid plate right under the HUD, so you can read them on any carpet and still see where you're walking.",
        "Each kind has its own edge: a red ! for danger, a cream checkbox for to-dos, an orange star for rewards.",
        "On phones, the minimap steps aside for a moment while a notice is up."
      ]
    },
    {
      ver: "V. 2.26.2", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Messages now take a number and wait their turn.",
      highlights: [
        "Big center notices, Spotlight cards and the GOTCHA card now take turns. Only one of them is ever on screen at once.",
        "The most important one goes first: a boss card beats a reward, and alarms that were already waiting go before newer cards.",
        "If a notice waits too long it's skipped instead of showing up late, and the same notice never repeats within a minute."
      ]
    },
    {
      ver: "V. 2.26.1", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your map moved up. It was standing in the wrong spot.",
      highlights: [
        "The minimap and to-do chips now sit right under the HUD on every screen size, instead of 57 pixels too low and drifting toward your hero.",
        "Level-ups, the bonus chest, shops and the big map now get the screen to themselves. Chips and the minimap step back while a menu is open.",
        "Behind the scenes: the first piece of the new design system. Nothing else should look different yet."
      ]
    },
    {
      ver: "V. 2.26.0", date: "Nov 10, 2026", title: "Version Two",
      teaser: "The neighborhood got a lot bigger. So did the houses.",
      highlights: [
        "Maple Hollow is rebuilt at twice the scale: six bigger houses, each with its own personality, and a street wide enough for parked cars.",
        "Every house has a side path to its backyard, and the backyards connect through gates, so you can cut through the whole block.",
        "Your house is the real one now: front door on the left, garage on the right, spare key under the fat gray rock. Your kid moved the lemonade stand one house over."
      ]
    },
    {
      ver: "V. 2.25.0", date: "Nov 10, 2026", title: "Version Two",
      teaser: "This meeting could have been an email.",
      highlights: [
        "New office boss at 60: The Quarterly All-Hands. He plants at a podium and clicks through slides, and every slide is a hazard on the floor: a bar chart, a pie chart, and a line that goes Up and to the Right.",
        "At half health he opens the floor to questions. Two spotlights follow you around. Stand still too long and you get Called On.",
        "The Midlife Crisis V8 now lives only in Maple Hollow, where it bursts out of your garage. Beating either one unlocks Sprint. New achievement: Could Have Been An Email."
      ]
    },
    {
      ver: "V. 2.24.4", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Second notice: your high score is approved.",
      highlights: [
        "The 40-to-65 board also turned away runs that went past 81 (Overtime plus the walk to the punch clock). It takes up to 101 now, and those scores get re-sent once more."
      ]
    },
    {
      ver: "V. 2.24.3", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your high score finally gets its paperwork.",
      highlights: [
        "The 40-to-65 leaderboard had an old 500,000 cap, and Maple Hollow runs blew past it. The cap is 5,000,000 now.",
        "Scores the online board turned away are kept and re-sent the next time you open the game, so big runs from before this fix show up too."
      ]
    },
    {
      ver: "V. 2.24.2", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Your to-do list knows where you live.",
      highlights: [
        "At home, your employee file's to-do points at the right boss: finish the Fifth-Grade Math Homework at 45, then keep an ear on the garage at 60."
      ]
    },
    {
      ver: "V. 2.24.1", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Four wheels. Like a normal midlife crisis.",
      highlights: [
        "The V8 on the \"That's Not the Minivan\" title picture had six wheels. It has four now (thanks, Rami)."
      ]
    },
    {
      ver: "V. 2.24.0", date: "Nov 10, 2026", title: "Version Two",
      teaser: "New sidewalks. Same HOA.",
      highlights: [
        "Maple Hollow's ground is redrawn to match the houses: clean sidewalk slabs with chalk drawings, storm drains, leaves in the gutters, a lost mitten, and lawns with real leaf drifts, mums and stepping stones.",
        "Two new title-screen pictures: Welcome to Maple Hollow, and That's Not the Minivan. Pick Maple Hollow and the title opens on your town."
      ]
    },
    {
      ver: "V. 2.23.0", date: "Nov 10, 2026", title: "Version Two",
      teaser: "That's not the minivan.",
      highlights: [
        "Your house has a garage now, at the end of the hallway: the family minivan, a workbench, holiday bins, a lawn mower, and one very shiny convertible parked over a car-shaped patch of dust.",
        "A little before 60 you'll hear it turning over. At 60 the Midlife Crisis V8 bursts out: through the garage if you're home, down your driveway if you're out on the street."
      ]
    },
    {
      ver: "V. 2.22.0", date: "Nov 10, 2026", title: "Version Two",
      teaser: "Show your work. No, the new way.",
      highlights: [
        "Maple Hollow's first boss arrives at 45: the Fifth-Grade Math Homework. He scribbles, dotted lines fan out, and then the paper airplanes fly. Stand in a gap.",
        "Below half health he throws a second fan into the gaps of the first and lobs crumpled pages onto marked circles. New achievement: Carried the One."
      ]
    },
    {
      ver: "V. 2.21.3", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Nothing left to give? Have a raise.",
      highlights: [
        "Fixed (thanks again, Kevin, at age 275): a fully maxed build could open \"YOU'VE EARNED A PERK!\" with no cards and freeze the game. Now it skips the menu and hands you a Seniority perk on the spot.",
        "Fixed: resuming a saved run past the finish line could leave the punch clock (or Father Time) missing, so the run never ended. It comes back now."
      ]
    },
    {
      ver: "V. 2.21.2", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The neighbors have opinions.",
      highlights: ["Maple Hollow has its own boss lineup: the HOA President at 48, the 30-Year Mortgage at 52, the Holiday Party at 56 (at your place this time), and the Midlife Crisis V8 at 60. The Fifth-Grade Math Homework boss takes 45 soon; the Performance Review is filling in until then."]
    },
    {
      ver: "V. 2.21.1", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Father Time doesn't wait forever.",
      highlights: [
        "Fixed (thanks, Kevin, who idled a run to age 213): the punch clock at 65 and Father Time at 100 wait one year for you. After that they walk over to you, faster each year, and after four years they simply arrive.",
        "Group Chat pings get through again. Coffee, Dad Jokes and \"No.\" still knock them out of the air, but area weapons like Sticky Notes no longer act as a force field around you."
      ]
    },
    {
      ver: "V. 2.21.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The neighborhood fights back.",
      highlights: [
        "Maple Hollow has its own crowd now: Leaf Piles, Gutter Clogs, the neighbor's Lawn Mower (fast, and it does not wave) and Property Tax Notices. They mix in with the office regulars who followed you home.",
        "Toy bricks on the floor in the kid's room and on your lawn. Step on one: a hit, a limp, and a lot of language.",
        "Your kid opened a Lemonade Stand by the curb. It's the Lounge at home: lemonade heals, sugar cookies, a friendship bracelet that pulls in gems, the Polygon Upgrade and more. Open at the start of a run and after each promotion age."
      ]
    },
    {
      ver: "V. 2.20.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "You can go inside now.",
      highlights: [
        "Maple Hollow has your house now: coffee orange, a basketball hoop, a bike on its side, and a fake rock that fools no one. The key hunt uses real props too (fake rocks, welcome mats, tipped flower pots, mailboxes), and the rock flips open when the key is under it.",
        "Unlock the front door and walk in: a living room, a kitchen and the kid's room, off one hallway. The fridge has leftovers (a heal, once per run). Step on the front mat to go back out. The swarm follows you in, so it isn't a hiding spot."
      ]
    },
    {
      ver: "V. 2.19.1", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Locked out of your own house.",
      highlights: [
        "Maple Hollow: you're locked out. The spare key is hidden around the block (fake rocks, welcome mats, flower pots, the neighbors' mailboxes), somewhere different every run. Walk over a ? to check it.",
        "Find the key, then walk to your front door for a bonus chest, half your health back, +1,500 score and the achievement Under The Fake Rock."
      ]
    },
    {
      ver: "V. 2.19.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Welcome to Maple Hollow.",
      highlights: [
        "First look at the second stage: Maple Hollow, a peak-fall neighborhood with two streets, twelve houses (the HOA colonial, the pumpkin overload, the cat-lady cottage, the reno with the dumpster...) and a yard full of gnomes and flamingos.",
        "Reach age 55 in any run to unlock it, then pick LOCATION in the title screen settings. Your saved run remembers which stage it started on.",
        "Early build: the office crowd followed you home for now. The neighborhood's own enemies, the Lemonade Stand and getting into your house come next."
      ]
    },
    {
      ver: "V. 2.18.3", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The coffee moved to the couch.",
      highlights: ["The Lounge's coffee cart moved off the Break Room's back wall and onto the lounge rug, right next to the coffee table, so the corner feels like a real hangout. The Lounge still opens there after each promotion."]
    },
    {
      ver: "V. 2.18.2", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Say cheese, for real.",
      highlights: [
        "Screenshot button: press Y on a controller (or V on a keyboard) during a run to save what's on screen, stamped with your age. Phones and tablets open the share sheet. You can rebind it under Controls.",
        "The Spam Likely phone buzz is now two soft bass thumps, like a phone vibrating on a desk, so it sits with the rest of the sounds instead of on top of them."
      ]
    },
    {
      ver: "V. 2.18.1", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The Cowboy gets polygons too.",
      highlights: ["The Polygon Upgrade in the Lounge now works for the Cold War Cowboy too, floppy disk and all. All four heroes can go late-'90s 3D for a run."]
    },
    {
      ver: "V. 2.18.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Your old coworkers are all here.",
      highlights: [
        "New Overtime event: the Reunion (at 72.5, or at 70 when the HOA isn't coming). Eight old coworkers walk in from every side wearing name tags: Gary from accounting with his cake, Linda the office manager, Dale from IT with his cables, Pat with every photo she ever took, and friends.",
        "They're friendly and can't hurt you. Walk past each one to catch up (\"Dale! Did you try turning retirement off and on?\"). You have 20 seconds.",
        "Catch up with 6 for a bonus chest and +1,500 score; all 8 earns the achievement Reply All, In Person."
      ]
    },
    {
      ver: "V. 2.17.3", date: "Nov 9, 2026", title: "Version Two",
      teaser: "You, in glorious late-'90s 3D.",
      highlights: [
        "New in the Lounge: the Polygon Upgrade (20k). Your hero, re-rendered like a 1998 video game, for the rest of the run. Purely cosmetic. Available for the 9-to-5er, the Soccer Dad and the Grad Student, at the Lounge cart and the Break Room counter.",
        "Say Cheese now gives a slight knockback before everyone freezes for the photo."
      ]
    },
    {
      ver: "V. 2.17.2", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Boss chests pay out again, even when you're maxed.",
      highlights: [
        "Fixed (thanks, Derek): late in Full Life, when every weapon and passive was maxed, a boss chest paid a few coins per slot, which looked like an empty chest.",
        "Now each of those slots is a Seniority perk with no cap: a Cost-of-Living Raise (+6% damage), Comp Time, Tenure or a Corner Office. They stack, so every chest still makes you stronger."
      ]
    },
    {
      ver: "V. 2.17.1", date: "Nov 9, 2026", title: "Version Two",
      teaser: "New faces, new falls.",
      highlights: [
        "The Bargain Hunters have their own look now: bucket hat, sage cardigan, tote bag and one coin held high, speed-walking for your stapler.",
        "Your New Boss, the Holiday Party and the Reorg each get a proper knockout pose: spiral eyes and a spilled can, a flattened party hat, and a man face-down on his own org chart."
      ]
    },
    {
      ver: "V. 2.17.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Twenty-five years of desk. One cardboard box.",
      highlights: [
        "New Overtime event at 68.5: Clean Out Your Desk. Your drawer bursts and eight keepsakes scatter across the floor: the stapler, the World's Okayest mug, the family photo, the emergency granola bar, the cactus, the good pen, the rubber band ball and a 2009 coupon.",
        "Walk over them to pack them. Magnets don't work here; some things you carry by hand. You have 15 seconds.",
        "Bargain Hunters (50¢) race you to them. If one gets there first, it's SOLD. Pack 6 for a bonus chest, all 8 for +2,000 score and the achievement Box of Memories."
      ]
    },
    {
      ver: "V. 2.16.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Employee of the Month.",
      highlights: [
        "Late in a run, levels take forever, so your upgrades used to dry up right when you were strongest. Now, after 55, if 75 seconds go by with no level-up, the company hands you a free pick: a Performance Bonus, a Spot Bonus, Employee of the Month...",
        "In Overtime, every Workload pip makes the next bonus come 10 seconds sooner (never faster than every 35 seconds). Crush it, get more perks."
      ]
    },
    {
      ver: "V. 2.15.5", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Errands pay off now.",
      highlights: [
        "Finishing an errand sets off a shockwave that clears the regular enemies around you (bosses and elites stay).",
        "Every errand now gives bonus XP, plus 15 seconds of CHECKED OFF: +50% damage and +50% XP from gems. A chip shows the timer.",
        "Up to three errands per run now, two minutes apart, and never the same one twice."
      ]
    },
    {
      ver: "V. 2.15.4", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The grandkids got dressed up.",
      highlights: [
        "The Grandkids' Visit has real grandkids now: a girl in a pink rain jacket and gold boots, a boy in a lavender hoodie with a paper airplane, and a little one in sage overalls with a tiny backpack.",
        "They run in four directions with their own walk cycles, and keep the pink ring and heart so you can spot them in a crowd."
      ]
    },
    {
      ver: "V. 2.15.3", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Your New Boss hits back now.",
      highlights: [
        "Your New Boss has more health and dashes more often. He was going down too fast.",
        "He goes down in style now: he crashes in his own pose, gets one last line, and his energy drinks, phone and lanyard go flying under a MEETING ADJOURNED stamp. The Holiday Party and the Reorg get their own stamps and last words too.",
        "Your weapons can knock Group Chat pings out of the air, just like in Vampire Survivors. Coffee, Dad Jokes, \"No.\" and any hit next to a ping will leave it on read."
      ]
    },
    {
      ver: "V. 2.15.2", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The grandkids stopped by.",
      highlights: [
        "New Overtime event at 66: the Grandkids' Visit. Three kids run in and want to play tag. You're it. They dash through the crowd, so you'll have to dive in after them. Look for the pink hearts.",
        "Each kid you tag hands you a gift: a crayon drawing (gems), a cookie (health) or Grandpa's lucky coin. Tag them all for a bonus chest, +2,000 score and the achievement World's Okayest Grandparent.",
        "Runs to 80 get a second visit at 72.5 with five kids."
      ]
    },
    {
      ver: "V. 2.15.1", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Your Medicare window is open.",
      highlights: [
        "New Overtime event at 64: Open Enrollment. Visit four offices in order (Part A, B, C, D), ten seconds each, while spam calls play hold music. Follow the purple arrow.",
        "Each office pays coins and gems. Finish all four for a big bonus chest, +2,500 score and the achievement Initial Enrollment Period. Miss one and you're just on hold. No penalty.",
        "Runs that go to 80 get Annual Enrollment at 75.8: three offices, same forms as last year."
      ]
    },
    {
      ver: "V. 2.15.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Overtime gets busier.",
      highlights: [
        "Workload: past 65 in an Overtime run, if you're cruising (full health, a quiet room, barely moving) the office gives you more work. A WORKLOAD chip with five pips shows it, and a pip blinks before each rise. It eases off the moment your health drops.",
        "Each Workload level means faster, tougher enemies and hits that sting a little more, plus overtime pay: more score and 401(k) coins.",
        "The Gold Watch now arrives earlier in Overtime runs, so its fight isn't squeezed by the shorter late years.",
        "Runs that go to 80 get a visit from the HOA President at 70."
      ]
    },
    {
      ver: "V. 2.14.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The Reorg is here. Your desk is now a pod.",
      highlights: [
        "New boss at age 56: The Reorg. He takes turns with The Holiday Party, one per run.",
        "He rolls in his own Hot Desks and slides them around after showing ghost outlines and arrows. A desk never lands on you or boxes you in, and it stops short if you're in the way. Use them as walls.",
        "New Org Chart: for a few seconds every new enemy comes from one corner. Arrows on the screen edge show where, ahead of time.",
        "He stands still while he works the whiteboard. That's your chance. Beat him for a big chest and a Fanny Pack. New achievement: Org Chart Survivor."
      ]
    },
    {
      ver: "V. 2.13.3", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Overtime moves faster.",
      highlights: [
        "In Midlife, Overtime years past 65 now take 25 seconds instead of 45, so 65 to 80 is about 6 minutes instead of 11. The swarm ramps up faster too, so the late game stays busy."
      ]
    },
    {
      ver: "V. 2.13.2", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The Holiday Party is harder to ignore.",
      highlights: [
        "The conga line now protects her. While three or more dancers are in line she shrugs off most of your damage (look for the tinsel ring). Break the line, then hit her.",
        "Bigger, sturdier dancers with little party bulbs, and the line rebuilds faster.",
        "She arrives with a burst of confetti."
      ]
    },
    {
      ver: "V. 2.13.1", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Less clutter late in a run.",
      highlights: [
        "The big center banner shows the same reward (like DESK SALAD) at most once a minute, so it doesn't sit over the middle of the screen late in a run. The message at the bottom still tells you every time.",
        "A minimized corner map now shows a clear MAP button. Tap it to bring the map back.",
        "The corner map hides while the pause menu is open."
      ]
    },
    {
      ver: "V. 2.13.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "The Holiday Party will not let you leave.",
      highlights: [
        "New boss at age 56: The Holiday Party. The leader chases you slowly while a conga line of ugly-sweater coworkers follows her exact path. Knock a dancer out of line to open a gap.",
        "Mistletoe circles drop near you. Get caught under one and you slow down for an awkward moment, but nothing can hurt you while it lasts.",
        "Below half health the line grows to seven, more mistletoe drops, and she adds a Group Hug lunge.",
        "Age 56 is now a 'middle management' slot: The Holiday Party and The Reorg will take turns, one per run. The Reorg arrives in a later update.",
        "Beat her for a big bonus chest and a Desk Salad. New achievement: Left Before The Slideshow."
      ]
    },
    {
      ver: "V. 2.12.0", date: "Nov 9, 2026", title: "Version Two",
      teaser: "Meet Your New Boss. He's 26.",
      highlights: [
        "New boss at age 48: Your New Boss (Age 26). He chugs an energy drink, then dashes at you down a lane of arrows, twice in a row. Step off the arrows, then hit him while he catches his breath.",
        "Below half health he dashes three times, and sometimes hits a sugar crash. Every attack comes with a pep talk.",
        "Beat him for a bonus chest and his spare energy drink. New achievement: Circle Back Later.",
        "The swarm eases off a little while he's around, so the fight stays readable."
      ]
    },
    {
      ver: "V. 2.11.5", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Fewer sign-in pop-ups.",
      highlights: [
        "The 'Save your file?' sign-in box no longer pops up on a device that has signed in before. The badge on the title screen still works anytime.",
        "Closing that box any way (X or Escape) now means 'not now' for a week, instead of coming back next visit."
      ]
    },
    {
      ver: "V. 2.11.4", date: "Nov 8, 2026", title: "Version Two",
      teaser: "A lighter office, and your hero stays yours.",
      highlights: [
        "The office floor now uses about a quarter of the graphics memory it did. Only the part near you is painted, so laptops (especially Safari on a MacBook) are much less likely to go dark.",
        "A saved run now stays with the hero who started it. Picking someone else on the title screen sets up your next new run instead."
      ]
    },
    {
      ver: "V. 2.11.3", date: "Nov 8, 2026", title: "Version Two",
      teaser: "No more dark office.",
      highlights: [
        "Fixed: when your computer's graphics hiccup and come back, the office could stay dark with only names and numbers showing. Now the reload card stays up so you can reload and continue your saved run.",
        "Fixed: the errand chip and arrow could linger on the game over screen."
      ]
    },
    {
      ver: "V. 2.11.2", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Your bonus chest always finds you.",
      highlights: [
        "Beating a boss now says so (\"SURVIVED... your bonus chest is on its way\"). That line had been switched off by mistake.",
        "Boss chests can't go missing: the chest is set up before any effects run, and if it hasn't reached you 12 seconds after it's ready, it opens wherever it is."
      ]
    },
    {
      ver: "V. 2.11.1", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Errands say where to go now.",
      highlights: [
        "Errands are clearer: the card names the place (\"the printer in the Bullpen\"), says you have 45 seconds for a bonus, and a TO-DO HERE tag floats over the spot.",
        "Fixed: an errand could start while a menu was open and get missed. It now waits until you're back in the game."
      ]
    },
    {
      ver: "V. 2.11.0", date: "Nov 8, 2026", title: "Version Two",
      teaser: "You have one errand.",
      highlights: [
        "New: Errands. About a minute in, a TO-DO card gives you one errand, like picking up your printing before someone reads it. Follow the orange arrow (and the marker on your map), get there before the timer runs out, and you get a reward. Miss it and nothing bad happens."
      ]
    },
    {
      ver: "V. 2.10.27", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Grab the map on your way in.",
      highlights: [
        "The office map is back to being found: every run starts without it. Grab the YOU ARE HERE sign by reception on your way in.",
        "The map looks like a real evacuation map now: crisp rooms, cream walls, desks, room names, and dashed outlines for rooms you haven't found (locked ones show the age they open).",
        "The corner map is bigger on every screen, with a tag underneath showing which room you're in."
      ]
    },
    {
      ver: "V. 2.10.26", date: "Nov 8, 2026", title: "Version Two",
      teaser: "The title screen shuffles now.",
      highlights: [ "Title screen slides play in a random order after the first one, so every visit looks a little different." ]
    },
    {
      ver: "V. 2.10.25", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Secrets pay now.",
      highlights: [
        "Finding an easter egg gives you a free level, once per egg each run: the yellow note, June's butterscotch, a caught intern, the Day One cart and the Supply Closet.",
        "New title screen slide on laptops: the Performance Review steps up, clipboard first, with its own boss card."
      ]
    },
    {
      ver: "V. 2.10.24", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Your weapons want to grow up.",
      highlights: [
        "Level-up cards now tell you when a pick unlocks an evolution (the card glows) or when you're one more pick away. Fewer weapons, fully grown, beat six weak ones.",
        "Group Chat pings have their own sound now: a soft message pop instead of the phone buzz."
      ]
    },
    {
      ver: "V. 2.10.23", date: "Nov 8, 2026", title: "Version Two",
      teaser: "Falling behind? The office notices.",
      highlights: [
        "Catch-up XP: if you're a few levels behind where most players are at your age, gems give a little extra (up to +60%) until you catch up. Careful players should hit the 50s with a fighting build."
      ]
    },
    {
      ver: "V. 2.10.22", date: "Nov 7, 2026", title: "Version Two",
      teaser: "We're taking notes on your loadout.",
      highlights: [
        "Run stats now note which weapons and passives you ended with, so we can see which builds make it past 55. No names, nothing personal."
      ]
    },
    {
      ver: "V. 2.10.21", date: "Nov 7, 2026", title: "Version Two",
      teaser: "You can see yourself dodge now.",
      highlights: [
        "Close Calls are easier to spot: a quick trail of afterimages follows you during the speed burst, the popup text is bigger, and the first one ever explains what just happened. (From Grok's playtest.)",
        "Fewer messages pile up in your first seconds: the \"weapons fire on their own\" tip no longer repeats the first-day line, and the Bill tip now waits until a Bill actually splits into Late Fees."
      ]
    },
    {
      ver: "V. 2.10.20", date: "Nov 7, 2026", title: "Version Two",
      teaser: "It's 11:58 PM and he's still here.",
      highlights: [
        "The 11:58 PM title scene is alive: he breathes, blinks and sips his coffee, the steam curls, the monitor flickers, and Bill stomps in the corner. The camera holds still. (Art by ChatGPT, original scene by Grok.)",
        "With reduced motion on, it stays a still picture."
      ]
    },
    {
      ver: "V. 2.10.19", date: "Nov 7, 2026", title: "Version Two",
      teaser: "Someone finally cleaned up the back hallway.",
      highlights: [
        "New art for a certain hallway: shelves, a mop bucket, a lost-and-found bin, bare bulbs and a door that actually slides. (Art by ChatGPT.)"
      ]
    },
    {
      ver: "V. 2.10.18", date: "Nov 7, 2026", title: "Version Two",
      teaser: "Whatever's behind that door changes every day.",
      highlights: [
        "If you find your way somewhere you shouldn't be, what's waiting there changes every run."
      ]
    },
    {
      ver: "V. 2.10.17", date: "Nov 7, 2026", title: "Version Two",
      teaser: "Eli from IT would like everyone to stop loitering.",
      highlights: [
        "Something new is hidden in the Server Room. Eli from IT has asked us not to say more."
      ]
    },
    {
      ver: "V. 2.10.16", date: "Nov 7, 2026", title: "Version Two",
      teaser: "A way home from the Game Over screen.",
      highlights: [
        "The Game Over screen has a Back to Title Screen button under Quick Retry and the 401(k) Shop."
      ]
    },
    {
      ver: "V. 2.10.15", date: "Nov 7, 2026", title: "Version Two",
      teaser: "The Day One cart has an achievement now.",
      highlights: [
        "New achievement: Early Bird Special. Buy something from TJ and Derek's Day One cart before it rolls out of the Lobby."
      ]
    },
    {
      ver: "V. 2.10.14", date: "Nov 7, 2026", title: "Version Two",
      teaser: "No more getting wedged between desks.",
      highlights: [
        "The gaps between desks in the office pods are closed, so you can't squeeze in and get pinned there anymore. (Thanks for the playtest, Rami.)",
        "Spam Likely buzzes like a phone on a desk again instead of chiming.",
        "Two new easter-egg achievements: Help Yourself (June's butterscotch) and Caught In The Act (catch TJ or Derek mid-errand)."
      ]
    },
    {
      ver: "V. 2.10.13", date: "Nov 7, 2026", title: "Version Two",
      teaser: "Kevin's in the credits.",
      highlights: [
        "Kevin Smith joins the credits for his Discord ideas (Hustle, fiscal years, the butterscotch) and for taking on the merch: 3D-printed and laser-engraved keychains, magnets and more are in the works."
      ]
    },
    {
      ver: "V. 2.10.12", date: "Nov 6, 2026", title: "Version Two",
      teaser: "Updates show up right away now.",
      highlights: [
        "If your browser was holding on to an old copy of the page, the game now notices and quietly reloads the new one, so updates show up within a minute or two of going live instead of ten."
      ]
    },
    {
      ver: "V. 2.10.11", date: "Nov 6, 2026", title: "Version Two",
      teaser: "June from Legal wasn't kidding about the butterscotch.",
      highlights: [
        "There's a candy dish on the Executive Wing credenza now. Walk up to it for +3 HP and a word from June from Legal. It restocks once a year. (Thanks, Kevin.)"
      ]
    },
    {
      ver: "V. 2.10.10", date: "Nov 6, 2026", title: "Version Two",
      teaser: "Ghost Hour, Rent Hike and friends now explain themselves.",
      highlights: [
        "The pause menu's RIGHT NOW list shows the life event you're in (Ghost Hour, Rent Hike, Reply-All Tax and the rest), what it does, and how many years it has left. (Thanks, Kevin.)",
        "The event tag no longer sits on top of the pause menu title."
      ]
    },
    {
      ver: "V. 2.10.9", date: "Nov 6, 2026", title: "Version Two",
      teaser: "New address: midlifesurvivors.com.",
      highlights: [
        "The office moved to midlifesurvivors.com. Old links forward here automatically.",
        "If you played as a guest, your coins, shop ranks and medals stayed at the old address. Sorry! Signed-in players get their file back by clocking in, and leaderboard scores made the move."
      ]
    },
    {
      ver: "V. 2.10.8", date: "Nov 6, 2026", title: "Version Two",
      teaser: "Lunch is easier to find, and the group chat is easier to dodge.",
      highlights: [
        "Pizza and Desk Salad are about 40% bigger and gently glow and breathe, so they stand out on the carpet. (Thanks, Kevin.)",
        "Group Chat shots are bigger and wear a pulsing orange ring, so you can tell what's coming at you."
      ]
    },
    {
      ver: "V. 2.10.7", date: "Nov 6, 2026", title: "Version Two",
      teaser: "The office is moving to midlifesurvivors.com.",
      highlights: [
        "The game is getting its own address: midlifesurvivors.com. Clock in before the move and your coins, shop ranks and unlocks come with you."
      ]
    },
    {
      ver: "V. 2.10.6", date: "Nov 6, 2026", title: "Version Two",
      teaser: "These patch notes have their own link now.",
      highlights: [
        "A link ending in #changelog opens these patch notes right on the title screen, so the devlog can point here."
      ]
    },
    {
      ver: "V. 2.10.5", date: "Nov 5, 2026", title: "Version Two",
      teaser: "HR has entered the leaderboard.",
      highlights: [
        "Leaderboard names now go past HR. Swears, slurs and hate terms get turned away. Classic office pun names are still fine. (Thanks, Kevin.)"
      ]
    },
    {
      ver: "V. 2.10.4", date: "Nov 5, 2026", title: "Version Two",
      teaser: "3 AM Thoughts don't walk straight anymore. Neither do yours.",
      highlights: [
        "3 AM Thoughts now drift side to side as they close in, while Bills march straight at you. Easy to tell apart in a crowd. (Thanks to a tip on Facebook.)"
      ]
    },
    {
      ver: "V. 2.10.3", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Real pixel art for the stuff you pick up and the stuff you throw.",
      highlights: [
        "XP gems, 401(k) coins, pizza, the Desk Salad, boss chests and the coffee splash are hand-drawn pixel art now.",
        "The TV Remote, Floppy, Spreadsheet cells, Podcast waves and Thermostat snowflakes got real art too."
      ]
    },
    {
      ver: "V. 2.10.2", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Behind the scenes: the dev's own visits stop padding the numbers.",
      highlights: [
        "A small tester switch keeps the developer's own visits and runs out of the play stats, so the numbers show real players."
      ]
    },
    {
      ver: "V. 2.10.1", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Medical Bills got scrubs, and the Lounge Cart got wheels.",
      highlights: [
        "The Medical Bill (after 55, when you hustle nonstop) has its own art: a hospital bill in a pink gown.",
        "The Day One Lounge Cart is a real rolling cart now, with a steaming pot and an orange awning you can spot across the Lobby. When time's up, the awning folds before it rolls away."
      ]
    },
    {
      ver: "V. 2.10.0", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The controller update: menus go where you point.",
      highlights: [
        "Every menu now moves the way you'd expect: press a direction and the cursor goes to whatever is that way on screen. Nothing there? The page scrolls.",
        "PUNCH IN, the whole 401(k) Shop and the bottom of the Shift Ended screen are all reachable with a controller.",
        "New controller shortcuts: Y opens the 401(k) Shop from the title screen, Select opens the office map during a run (M on a keyboard).",
        "The Devlog, Art Room and About pages work with a controller too: move with the D-pad, A to open, B to go back.",
        "The tab for the page you're on looks pressed in and can't be selected.",
        "Big screens and 4K TVs skip the blurred menu backdrop, so menus stay snappy."
      ]
    },
    {
      ver: "V. 2.9.6", date: "Nov 5, 2026", title: "Version Two",
      teaser: "A playtest cleanup: findable cart, one message at a time, clearer boss rings.",
      highlights: [
        "The Lounge cart now hides somewhere in the Lobby (never behind a locked door).",
        "Spotlight cards and message banners take turns instead of landing on top of each other.",
        "Second Opinion now freezes the moment for a beat with a big BACK ON YOUR FEET, so you know it saved you.",
        "The Bonus Approved card keeps its size while rewards land.",
        "The Mortgage's ring attack marks its escape gap with a clear SAFE tag (it used to be a mystery % sign).",
        "Desk Salads pop out with a label when an elite drops one.",
        "Spam calls chime softly in key instead of buzzing. On iPad with a controller, a button offers to turn the sound on."
      ]
    },
    {
      ver: "V. 2.9.5", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The Lounge cart is hiding somewhere on the floor. Go find it.",
      highlights: [
        "The Day One cart now parks in a far corner of the Bullpen or Lobby, a different one each run, and stays for your first 2 minutes. No arrow: exploring is the point.",
        "Its spotlight card tells you to start exploring for treats you can only get early in your shift.",
        "The Corporate Buyout memo now waits for your cloud save, so answering on one device answers it everywhere."
      ]
    },
    {
      ver: "V. 2.9.4", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Fixed: pink boxes behind the office coworkers.",
      highlights: ["The cleaned-up coworkers briefly showed a solid magenta background. They're see-through again."]
    },
    {
      ver: "V. 2.9.3", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Fiscal Year 2: a fresh leaderboard and an optional Corporate Buyout. (Thanks again, Kevin.)",
      highlights: [
        "The leaderboard now shows this fiscal year's scores (Fiscal Year 2 began with Version Two). SHOW ALL-TIME brings back every score.",
        "Corporate Buyout, once a fiscal year and completely optional: cash out your 401(k) Shop ranks for half of what you spent, start level with everyone, and wear a BOUGHT OUT tag on this year's board. Or keep everything."
      ]
    },
    {
      ver: "V. 2.9.2", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Calmer coworkers: no more shimmering pixels at the desks.",
      highlights: ["The six office coworkers were cleaned up after art director feedback: steady faces and chairs, no see-through spots, and walks that alternate feet."]
    },
    {
      ver: "V. 2.9.1", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Hustle pays, until it doesn't. (Thanks, Kevin.)",
      highlights: [
        "Hustle Bonus: before 55, the ground you cover and the office areas you explore add to your end-of-run paycheck.",
        "Burning the Candle: from 55, nonstop hustling fills a little meter under your health. Stand still for a second to catch your breath.",
        "Let it fill and a Medical Bill comes for you: tougher than a regular Bill, and its touch costs a copay. Energy Drinks after 55 fill the meter fast."
      ]
    },
    {
      ver: "V. 2.9.0", date: "Nov 5, 2026", title: "Version Two",
      teaser: "First Day: the shift clock now starts when you take your first step.",
      highlights: [
        "Nothing spawns and the clock doesn't tick until you move. A hint shows how: drag on phones, WASD or arrows on a keyboard, the left stick on a controller.",
        "Your first three runs ease you in: for the first 20 seconds, Bills arrive one or two at a time from the direction you're heading.",
        "Your first Bill paid off pops a big PAID! and a reminder that the coffee fires on its own. The first hit tells you to keep moving.",
        "The Lounge cart skips the Lobby when you can't afford anything yet."
      ]
    },
    {
      ver: "V. 2.8.5", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Emergency Contact moved to the Day One cart.",
      highlights: ["Emergency Contact (100k) is now sold from the Lobby cart at the start of each run, so you can plan around it."]
    },
    {
      ver: "V. 2.8.4", date: "Nov 5, 2026", title: "Version Two",
      teaser: "A revive in the Lounge and a snappier level-up.",
      highlights: ["New on the Day One Lounge cart: Emergency Contact (100k). If a hit would end your run, you get back up with half health. Once per run.", "The level-up fanfare is now a quick 1-second flourish."]
    },
    {
      ver: "V. 2.8.3", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Softer Mic Drops and phones that buzz instead of ring.",
      highlights: ["Mic Drop now plays just the drop and thud, no feedback squeal every time.", "Spam Likely buzzes like a phone vibrating on a desk instead of ringing."]
    },
    {
      ver: "V. 2.8.2", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The Lounge cart meets you in the Lobby on day one.",
      highlights: [
        "For the first minute of every run, a Lounge cart parks in the Lobby: buy Mic Drop or Say Cheese while your hands are still free.",
        "New run perks on the cart: Ergonomic Cushion (+2 max health) and Good Beans (8% faster), both for the whole run.",
        "The Break Room counter after promotions now sticks to heals and quick buffs."
      ]
    },
    {
      ver: "V. 2.8.1", date: "Nov 5, 2026", title: "Version Two",
      teaser: "A calmer mix, plus a Classic Beeps option for the nostalgic.",
      highlights: [
        "Music sits well under the action now, and the constant sounds (hits, paper rips, gems, coins) are quieter and can't pile up.",
        "The level-up fanfare plays at most every 20 seconds.",
        "New in Pause > Settings: Sound style. STUDIO is the new recorded audio; CLASSIC BEEPS brings back the original sounds and groove."
      ]
    },
    {
      ver: "V. 2.8.0", date: "Nov 5, 2026", title: "Version Two",
      teaser: "A new 401(k) economy: every shift gets a paycheck, and the shop is a longer climb.",
      highlights: [
        "Paycheck: every run now pays 3k per year you survived, so even a rough first day buys something.",
        "Late-career coins taper after 55, so one great run no longer buys the whole shop. Your score still counts every coin.",
        "Lifestyle inflation: each rank you own makes the next purchase 8% pricier. Cheap early ranks stay cheap; the last ones are real goals.",
        "Refunds still give back everything you spent."
      ]
    },
    {
      ver: "V. 2.7.16", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Behind the scenes: counting where every 401(k) coin comes from.",
      highlights: ["Testers with the dev console see a coin breakdown on the end screen, so the shop can be rebalanced from real numbers."]
    },
    {
      ver: "V. 2.7.15", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Bosses don't sound the same twice in a row anymore.",
      highlights: ["Boss entrances, boss knockdowns, wall bonks, Mic Drops and XP pings now rotate between several recorded takes."]
    },
    {
      ver: "V. 2.7.14", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Every sound in the fight is real now, including hits and coins.",
      highlights: ["The last two beeps are gone: weapon hits and 401(k) coins have real sound effects."]
    },
    {
      ver: "V. 2.7.13", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The office sounds real now: paper rips, oofs, bonks and a boss that slams the door.",
      highlights: [
        "Ten new sound effects: Bills ripping, XP pings, your 'oof', boss entrances and knockdowns, wall bonks, Mic Drop, the Say Cheese shutter, bonus chests and Spam Likely's ring.",
        "Each play shifts pitch a little, and kill streaks still climb the scale."
      ]
    },
    {
      ver: "V. 2.7.12", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The game is ready for real sound effects.",
      highlights: [
        "Behind the scenes: every sound can now play a real recording instead of a beep, with the same pitch variety so repeats don't sound robotic.",
        "Mic Drop, Say Cheese, wall bonks and bonus chests got their own sound slots."
      ]
    },
    {
      ver: "V. 2.7.11", date: "Nov 5, 2026", title: "Version Two",
      teaser: "All four heroes finally walk like people: left foot, right foot.",
      highlights: [
        "Redrawn walk cycles for the 9-to-5er, Soccer Dad, Grad Student and Coldwar Cowboy: the legs alternate in every direction, arms swing opposite, and there's a little bob on each step.",
        "Heads and shirts stay steady between frames, so the motion reads cleanly instead of shimmering."
      ]
    },
    {
      ver: "V. 2.7.10", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Your hero walks with a steady rhythm now, thanks to a sharp-eyed art director.",
      highlights: [
        "The walk animation plays on its own steady clock instead of following how far you moved, so it no longer stalls and skips.",
        "Behind the scenes: a Sprite Board that plays every sprite in the game at its real speed, with a view that shows which pixels change each frame."
      ]
    },
    {
      ver: "V. 2.7.9", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Real music! The office now has a soundtrack that grows with you.",
      highlights: [
        "Seven new tracks: a title theme, three office songs that get busier at 50 and 58, boss music, a Student Lounge groove and a retirement party.",
        "Music crossfades when a boss shows up or you hit a new decade, and loops without a gap.",
        "New stings for leveling up and for game over.",
        "Tracks download only when you need them, and the music slider and mute still control everything."
      ]
    },
    {
      ver: "V. 2.7.8", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Your retirement party finally has guests.",
      highlights: [
        "The HAPPY RETIREMENT screen now has the whole crew cheering around the sheet cake: TJ, Derek, Eli, an intern, and a Bill in a party hat.",
        "Phones get a two-row version so nobody gets cropped out of the photo."
      ]
    },
    {
      ver: "V. 2.7.7", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Retirement finally sounds like a party, and the Lounge weapons got their real art.",
      highlights: [
        "The end screen goes quiet: no more phantom hits behind your retirement card.",
        "Retire and you get a fanfare, then a slow victory-lap tune under the HAPPY RETIREMENT screen.",
        "Mic Drop and Say Cheese have real pixel art: a tipping mic, a feedback screech, a shockwave and a camera that leaves pose stickers on frozen enemies."
      ]
    },
    {
      ver: "V. 2.7.6", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The Student Lounge now sells two weapons you can't find anywhere else.",
      highlights: [
        "Mic Drop (45 coins): every 9 seconds you drop the mic and the feedback screech stuns everything around you. Upgrade it with Encore.",
        "Say Cheese (40 coins): a camera flash fires the way you're facing and freezes everything in the shot mid-pose. Burst Mode adds a second flash.",
        "Bosses only stagger from both, so no cheesing the birthday fights.",
        "Lounge weapons still count toward your six weapon slots."
      ]
    },
    {
      ver: "V. 2.7.5", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Ben's real one-liners are in the game, and new players get a gentler first shift.",
      highlights: [
        "The Coldwar Cowboy talks like Ben now: his own dad jokes in the Dad Joke rotation, his own last words on the death screen, and a couple of his catchphrases on tip cards.",
        "Eli from IT has new ticket notes when the yellow-note rack goes down (ID10T, PEBCAK). Thanks, Ben.",
        "New Hire Orientation: your first two shifts start with +2 health and Bills that pop in two hits until age 43."
      ]
    },
    {
      ver: "V. 2.7.4", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Energy Drinks make you untouchable, as long as you keep moving.",
      highlights: [
        "Energy Drink: besides 35% more speed for 12 seconds, nothing can hit you while you keep moving (TOO WIRED!). Stop and the shield drops. A cyan aura shows it, blinking in the last 2 seconds."
      ]
    },
    {
      ver: "V. 2.7.3", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Scores reward skill now: boss bonuses, a bigger retirement bonus, and late swarms count less.",
      highlights: [
        "Score: every boss pays +5,000, plus up to +5,000 more for a quick kill (shown under the stamp). Reaching retirement pays 25,000 (was 8,000).",
        "Score: the first 400 kills in each year of age count fully; after that a kill is worth a quarter point, so huge late swarms don't drown out everything else. Coins you spend in the Lounge no longer lower your score.",
        "Wall bonks have real art: drywall cracks, twinkling dizzy stars and a little bird. Fixed: bosses charging the Break Room's north wall stopped short without bonking.",
        "Behind the scenes: runs now record coins earned and spent, to balance the 401(k) shop."
      ]
    },
    {
      ver: "V. 2.7.2", date: "Nov 5, 2026", title: "Version Two",
      teaser: "The 401(k) Shop button tells you when there's something to buy, and the map stops forgetting you found it.",
      highlights: [
        "The 401(k) Shop button shows NEW when an item unlocks (like Sleep On It), or how many upgrades you can afford right now.",
        "Fixed: finding the office map, your Sprint switch and the Gold Watch keepsake were forgotten whenever the game reloaded. They stick now."
      ]
    },
    {
      ver: "V. 2.7.1", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Controllers can reach everything on the title screen now.",
      highlights: [
        "With a controller (or arrow keys), push up from the title screen to reach the top bar: Devlog, Art Room, About, Discord and Buy Rami a Coffee.",
        "The stage poll in Extras works with a controller too."
      ]
    },
    {
      ver: "V. 2.7", date: "Nov 5, 2026", title: "Version Two",
      teaser: "Don't like your cards? Sleep On It: rerolls you earn by making it to 55.",
      highlights: [
        "New: Sleep On It. Reach age 55 in any run (the new Middle Management achievement) to unlock it in the 401(k) shop. Each rank gives one reroll per run (up to 3).",
        "On the level-up screen, Sleep On It swaps all three cards for different ones. Evolutions always stay on the table."
      ]
    },
    {
      ver: "V. 2.6.1", date: "Nov 4, 2026", title: "Version Two",
      teaser: "No more gap at the bottom of iPhone screens.",
      highlights: [
        "Fixed a strip at the bottom of the screen on iPhone. The iPad fix from earlier today sized the game to the height Safari reports, which can be shorter than the real screen; it now measures the game's own full-screen box."
      ]
    },
    {
      ver: "V. 2.6", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Real art for the mess: knocked-out bosses, a rubber stamp, and what every enemy leaves behind.",
      highlights: [
        "Defeated bosses now drop into their own knockdown pose (the Mortgage in a heap of paperwork, the Review flat on its back) with dizzy stars, then fade.",
        "The defeat words land inside a russet rubber-stamp plate, above the fallen boss.",
        "Every enemy leaves its own debris: torn bills, red late-fee stubs, cracked phone bits, donut crumbs, a loose bandage, popped speech bubbles and more. Art by ChatGPT."
      ]
    },
    {
      ver: "V. 2.5.2", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Bosses splat into walls now, and \"No.\" stops shoving them across the room.",
      highlights: [
        "Wall bonks are a cartoon now: the boss splats flat and jiggles back, a crack appears in the wall, stars circle its head, and the BONK! word pops in. New words: LOAD-BEARING! and NOT IN THE BUDGET.",
        "The Word \"No.\" barely moves bosses anymore (about an eighth of the shove). Regular enemies still get the full push."
      ]
    },
    {
      ver: "V. 2.5.1", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Leaderboard runs from before V. 2.0 now wear a LEGACY tag.",
      highlights: [
        "Runs from before V. 2.0 are tagged LEGACY on the leaderboard and the devlog sidebar. Back then a Midlife run could go to age 80; now it ends at 65, so those scores can't be matched. Nothing was removed."
      ]
    },
    {
      ver: "V. 2.5", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Bosses go down in style: slow motion, a topple and a rubber stamp.",
      highlights: [
        "When a boss falls: the world slows for a beat, the boss flickers white, topples over with a puff of dust and fades, confetti goes off, and a stamp slams down (EXCEEDS EXPECTATIONS, PAID IN FULL, CRISIS AVERTED...).",
        "The boss chest waits two seconds so you get to watch, then comes to you.",
        "Fixed: a defeated boss could leave a frozen copy of itself standing on the floor."
      ]
    },
    {
      ver: "V. 2.4", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Every fight leaves a mess now, and TJ and Derek stop hiding behind walls.",
      highlights: [
        "Defeated enemies leave a little pile of scraps in their color (green for Bills, red for Late Fees). It sits for about 9 seconds, then fades. Bosses leave a bigger mess.",
        "TJ and Derek no longer disappear behind walls: they're drawn in front of or behind things by where their feet are, like everyone else. Their ALLY tags and speech bubbles always show.",
        "The Lounge sign, the register tag and the THE LOUNGE arrow can't be covered by furniture anymore."
      ]
    },
    {
      ver: "V. 2.3.4", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Every weapon upgrade card now tells you what it pairs with, so the Coldwar Cowboy can find the Zip Drive.",
      highlights: [
        "Weapon upgrade cards (Double Density, Second Helping, Bulk Pack and the rest) now say which passive they pair with, with a check mark if you already have it. Heroes who start with a weapon never see its Unlock card, so they never got the hint.",
        "Ben's Floppy Disk evolves into the Zip Drive: two Double Density upgrades plus Comfortable Shoes.",
        "Safety net: a boss chest can't get stuck behind a chest screen that isn't really showing. The BOSS CHESTS tip now says the chest comes to you."
      ]
    },
    {
      ver: "V. 2.3.3", date: "Nov 4, 2026", title: "Version Two",
      teaser: "The boss chest catches you now, even at full speed.",
      highlights: [
        "Fixed: the boss chest could trail right behind a fast hero and never open. It now always moves faster than you and opens from a little farther away."
      ]
    },
    {
      ver: "V. 2.3.2", date: "Nov 4, 2026", title: "Version Two",
      teaser: "One boss at a time, and the boss chest always finds you.",
      highlights: [
        "Bosses take turns: if you're still fighting one, the next waits (up to 3 years), then gives you 8 seconds after the kill to open your chest.",
        "The boss chest now slides to you from wherever the boss fell, even off screen. Its BONUS tag uses the game font and colors."
      ]
    },
    {
      ver: "V. 2.3.1", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Clearer level-up cards: Meal Prep Sunday no longer looks like Mom's Spaghetti.",
      highlights: [
        "Level-up cards now say \"Pairs with\" instead of \"Evolves\". Meal Prep Sunday's badge said \"Evolves Mom's Spaghetti\", which read like the card was the spaghetti. It's a healing passive; the bowl comes from Unlock: Mom's Spaghetti."
      ]
    },
    {
      ver: "V. 2.3", date: "Nov 4, 2026", title: "Version Two",
      teaser: "The Student Lounge moves into the Break Room, and Sprint's clock finally feels fast.",
      highlights: [
        "The Student Lounge is in the Break Room: futons and paper lamps on the big rug, a mic stand, a desk run with two monitors, a filing cabinet with pumpkins, and a collage wall behind the coffee cart. It's built from Rami's real office lounge, where TJ and Derek work.",
        "The Lounge shop now opens on an illustration of the lounge (wide on laptops, tall on phones).",
        "Sprint's clock ticks at double speed with a lightning bolt, so you can feel the years going twice as fast."
      ]
    },
    {
      ver: "V. 2.2", date: "Nov 4, 2026", title: "Version Two",
      teaser: "A friendlier first shift: a briefing before the clock starts, evolution hints on cards, and interns that look like friends.",
      highlights: [
        "Every run now opens with a shift briefing: your hero's card and today's goal, with the clock stopped. Tap or press any key to clock in.",
        "Level-up cards say what pairs with what: \"Evolves with Reading Glasses\" on a weapon, \"Evolves Podcast, Coffee Splash\" on a passive.",
        "TJ and Derek walk in with a green ring and an ALLY tag, so new players head toward them instead of running away.",
        "Your very first shift is simpler: just PUNCH IN (Mode and Tax show up after your first run), and Bills take a little longer to split into Late Fees before 43."
      ]
    },
    {
      ver: "V. 2.1.1", date: "Nov 4, 2026", title: "Version Two",
      teaser: "The office map gets its real art, and Grok tuned Sprint, Sticky Notes and two Full Life bosses.",
      highlights: [
        "The office map has its real look: a clipboard frame, pixel markers for doors, chests, the Lounge, interns and bosses, and a proper YOU ARE HERE sign with a blinking dot.",
        "Balance (Grok's check): Sprint now pays +25% coins instead of +50%, Sticky Notes pop for 2 instead of 3, and the Retirement Audit and the Pickleball Champ have less health, so those fights don't drag on."
      ]
    },
    {
      ver: "V. 2.1", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Find the YOU ARE HERE map in the Lobby, and the office maps itself as you explore.",
      highlights: [
        "New: the office map. Find the YOU ARE HERE sign by the reception desk once, and a small map rides in the corner of every run after.",
        "It starts dark and fills in as you explore. Doors show green when your promotion opens them and red while they're locked. Chests, the Lounge, interns and bosses are marked.",
        "Tap the map, or press M, to see everything you've explored, paused. The little – shrinks it out of the way."
      ]
    },
    {
      ver: "V. 2.0.1", date: "Nov 4, 2026", title: "Version Two",
      teaser: "New poll: which stage should we build first, the hospital or the home neighborhood?",
      highlights: [
        "A new quick poll on the devlog and in Extras: St. Deductible Hospital or the home neighborhood? Your votes help pick the next stage.",
        "Devlog memos can show screenshots as a tidy gallery of same-size tiles. Tap one to see it full size."
      ]
    },
    {
      ver: "V. 2.0", date: "Nov 4, 2026", title: "Version Two",
      teaser: "Version two is here: it's starting to feel real.",
      highlights: [
        "Midlife Survivors is officially V. 2.0. A new title screen and key art, an office full of coworkers, interns to catch, a 6 and 6 loadout with 13 new items, the Gold Watch, a retirement party at 65, Full Life bosses up to Father Time at 100, and Sprint mode.",
        "Clock in with Google and your file follows you to any device. Read the story in Memo 10 on the devlog."
      ]
    },
    {
      ver: "V. 1.93.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Sprint mode: beat the Midlife Crisis V8 and the years start flying.",
      highlights: [
        "New: Sprint. Turn it on under Mode on the title screen. Years pass 2x faster (Midlife in about 10 minutes), you and the enemies move 25% faster, and the 401(k) pays 50% more.",
        "Unlock it by beating the Midlife Crisis V8 (the Keep The Sedan achievement). It works with Full Life and Tax Brackets too.",
        "Sprint scores share the leaderboard with a ⚡ next to your name."
      ]
    },
    {
      ver: "V. 1.92.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Sticky Notes actually stick now.",
      highlights: [
        "Sticky Notes land in front of enemies that are coming for you, two at a time, and hold them longer. The glue catches the ones right behind too.",
        "Stuck enemies turn cream (not icy blue), and a STUCK! pops up so you can see it working."
      ]
    },
    {
      ver: "V. 1.92.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Full Life gets its own bosses: the HOA President, the Retirement Audit, the Pickleball Champ, and Father Time at 100.",
      highlights: [
        "The three Full Life bosses have their own art and attacks: the HOA President charges with a yardstick, the Retirement Audit stamps out rings of forms (slip through the checkmark), and the 6 AM Pickleball Champ lunges in loops.",
        "Father Time waits for you at 100 and shakes your hand. No reaper.",
        "Fanny Packs, Energy Drinks and PTO Days on the floor are real pixel art now, not emoji."
      ]
    },
    {
      ver: "V. 1.91.4", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "iPad fix: the office fills the whole screen again after you rotate.",
      highlights: [
        "On iPad Safari the office could fill only part of the screen after rotating or when the toolbars moved. The game now re-checks its size a moment later and fixes itself.",
        "Devlog: long memos read easier. Before-and-after sliders share one tabbed box, phone screenshots sit beside the text, and any picture opens full size with a tap."
      ]
    },
    {
      ver: "V. 1.91.3", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Four favorite title scenes are back: Promoted, 11:58 PM, The Long Way and The Swarm.",
      highlights: [
        "The title slideshow now has nine scenes. Rami's four favorites from the first key art came back, and they're in the Art Room too."
      ]
    },
    {
      ver: "V. 1.91.2", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The title screen opens at the top on short windows.",
      highlights: [
        "On a short laptop window the title opened halfway down, scrolled to the Punch In button. It now opens at the top; the arrow keys and gamepad still scroll to whatever you highlight."
      ]
    },
    {
      ver: "V. 1.91.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Scrolling the title screen on a short laptop window works again.",
      highlights: [
        "On a short window (Rami's Safari), scrolling up on the title screen snapped back down: each wheel or trackpad tick also moved the menu highlight. Now the wheel just scrolls when a menu is taller than the window."
      ]
    },
    {
      ver: "V. 1.91.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The new loadout gets its real art: spaghetti, spinning chairs, sticky notes and a cold snap.",
      highlights: [
        "All 13 new weapons and passives have real pixel icons on the level-up cards and in your HUD slots, plus new style badges.",
        "In the world: a bubbling bowl of Mom's Spaghetti, a spinning office chair, flapping reply-all emails, an out-of-office ring, sticky notes that shake and pop, a frost burst, and an ice crust on frozen enemies.",
        "The office floor now uses about a third less graphics memory, which should help older laptops and Safari."
      ]
    },
    {
      ver: "V. 1.90.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "No more silent white screens: if your graphics drop out, the game saves and offers a reload.",
      highlights: [
        "Sometimes a browser takes the graphics away when the computer is short on memory, and the game went white. Now your run is saved on the spot and a card offers a one-tap reload, then Continue saved run."
      ]
    },
    {
      ver: "V. 1.90.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Your loadout is your call: chests only upgrade what you carry, and you can skip a level-up.",
      highlights: [
        "Boss chests no longer hand you new weapons or passives. They only upgrade what you already carry (or evolve it), so every slot is your choice.",
        "Level-ups that offer something new now have a Skip button: keep your loadout as it is and heal 2 HP.",
        "TJ and Derek's Lounge card now actually shows when the Lounge opens (it used to get skipped right after a promotion card).",
        "Fixed: after a run, the cloud save could ask you to choose between two identical files."
      ]
    },
    {
      ver: "V. 1.89.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Bosses that charge into a wall now bounce off it. BONK.",
      highlights: [
        "The Performance Review used to charge straight through walls. Now he bounces off, wobbles for a second, and goes back to chasing you.",
        "The Midlife Crisis V8 spins out on walls the same way. They still plow through desks."
      ]
    },
    {
      ver: "V. 1.89.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The GOTCHA! card got real art, and Mom's Spaghetti is on the menu.",
      highlights: [
        "Catching an intern now shows a proper prize-ticket card: a pixel GOTCHA! that stamps in, a burst behind TJ or Derek as they hand over the treat, and new treat icons that shine when the reel lands.",
        "Treats on the floor use the new coffee, burrito and bundt cake art too.",
        "Mom's Casserole is now Mom's Spaghetti. Same healing bowl, better name.",
        "TJ and Derek's Special Delivery card now shows with the first intern of every run, not just once ever."
      ]
    },
    {
      ver: "V. 1.88.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The title screen now offers to save your file to the cloud.",
      highlights: [
        "If you have some progress and haven't signed in, a \"Save your file?\" card pops up on the title screen. Tap Continue with Google, Not now (it asks again in 2 days), or No thanks.",
        "Brand-new players aren't asked until they've played a run. The old accounts poll is retired."
      ]
    },
    {
      ver: "V. 1.88.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The office walls aren't bare anymore.",
      highlights: [
        "Every room's walls are lined now: whiteboards, kudos walls and printer nooks in the Bullpen, chore wheels and upper cabinets in the Break Room, cable trays in the Server Room, wood paneling in the Executive Wing, a cloud mural in Wellness, and posters, clocks, bookshelves and filing cabinets everywhere.",
        "Faint floor details too: scuffs, coffee rings, tape lines and chair-wheel marks.",
        "Furniture only goes where it can't block a hallway or a doorway.",
        "Fixed: signing in with Google could stop halfway before accounts were switched on for everyone."
      ]
    },
    {
      ver: "V. 1.87.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Your coworkers got real bodies: chairs, legs, and their own little habits.",
      highlights: [
        "Art, Sam, Eli, Nora, June and Mina now sit in proper office chairs and work: typing, sipping, sighing, checking their phones.",
        "Every so often (and when you walk by) they do their bit: Art eats his salad, Sam packs his box, Eli untangles a cable, Nora hits reply-all and winces, June dozes off, Mina talks on mute.",
        "The water-cooler crowd stands and walks on real legs now, facing the way they walk."
      ]
    },
    {
      ver: "V. 1.86.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Retirement at 65 is a party now, not a reaper.",
      highlights: [
        "At 65 a retirement punch clock shows up near you: balloons, gifts, a framed fish and a clock stopped at 5:00. It waits for you instead of chasing you.",
        "Walk into it to punch your golden card. Confetti, a flash, and nothing can hurt you while you clock out.",
        "Father Time still waits at 100 in Full Life."
      ]
    },
    {
      ver: "V. 1.85.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Clock in with Google and your employee file follows you to any device.",
      highlights: [
        "New Clock in badge on your employee file. Sign in with Google and your coins, shop ranks, unlocks, achievements, name, settings and a run in progress are saved to the cloud.",
        "Start on your laptop, keep going on your phone. If two devices disagree, the game shows both files and lets you pick.",
        "Completely optional. Your file still saves on your device like always. Email sign-in is coming soon."
      ]
    },
    {
      ver: "V. 1.84.3", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Accounts setup: Continue with Google is switched on.",
      highlights: [
        "The sign-in screen now offers Continue with Google, next to the emailed link or code. Still hidden from players while we finish testing."
      ]
    },
    {
      ver: "V. 1.84.2", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "New Privacy and Terms pages, in plain words.",
      highlights: [
        "Added a Privacy page and a short Terms page to the devlog: what the game keeps, why, and how to delete it. The sign-in screen links to it."
      ]
    },
    {
      ver: "V. 1.84.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Accounts setup: sign-in emails can be a link or a code.",
      highlights: [
        "The sign-in email can now be a link or a 6-digit code. Supabase's free email sends a link until we connect our own email sender, so the game handles both."
      ]
    },
    {
      ver: "V. 1.84.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Behind the scenes: your employee file is getting a cloud backup.",
      highlights: [
        "Optional accounts are built and waiting on setup. Soon you'll be able to clock in with an emailed code (Google and Apple later) and keep your coins, unlocks, achievements and a run in progress on every device.",
        "Signing in will never be required. Your file keeps saving on your device like always."
      ]
    },
    {
      ver: "V. 1.83.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "No more damage out of nowhere: Group Chats now stay where you can see them.",
      highlights: [
        "Ben kept taking damage \"for no apparent reason\" after 50. On phones, Group Chats were parking just past the edge of the screen and pinging you from out of sight.",
        "Group Chats now hang back closer on small screens, and they only send a ping when they're on screen.",
        "When a ping hits you, a little \"PING! GROUP CHAT\" pops up so you know what got you."
      ]
    },
    {
      ver: "V. 1.83.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Twice the gear, and only room for half of it. Pick your play style.",
      highlights: [
        "Seven new weapons: Mom's Casserole, Noise-Cancelling Headphones, the Rolling Office Chair, Reply-All Storm, Out-of-Office Reply, Sticky Notes and Thermostat Wars (it freezes everything near you).",
        "Six new passives: Multivitamin, Meal Prep Sunday, Cardigan, Lumbar Support, Fitness Tracker and Bifocals. Each new weapon also has its own evolution.",
        "You can only carry 6 weapons and 6 passives now, so every run is a choice. Your slots show on the HUD and on the level-up screen.",
        "Every card wears a style badge: Healing, Shield, Offense or Defense. The level-up screen counts what your build leans toward."
      ]
    },
    {
      ver: "V. 1.82.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Catching an intern is a moment now: GOTCHA!",
      highlights: [
        "Catch TJ or Derek and time slows for a beat, the screen flashes and a GOTCHA! card stamps in with their portrait and what they say.",
        "A little slot reel spins through coffee, burrito and bundt cake, then lands on the treat they tossed you, with its buff spelled out.",
        "New catch jingle, reel ticks and a ding when it lands. The whole thing takes about two seconds and never pauses the run."
      ]
    },
    {
      ver: "V. 1.81.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Interns don't walk up anymore. Chase them down for a heal, a shield and a treat.",
      highlights: [
        "TJ and Derek now show up with a coffee and run. Catch them for a heal plus a shield that blocks your next 2 hits (20 seconds). Let them go for 15 seconds and they get away.",
        "Every catch tosses a treat: Coffee (Double Shot: 30% faster), a Burrito (Food Coma Power: 30% more damage) or a Bundt Cake (Office Party: every gem flies to you, +50% XP). Derek usually brings the bundt cake.",
        "They run around desks, not into walls, so a corner is a good place to trap them."
      ]
    },
    {
      ver: "V. 1.80.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Damage numbers in the game's pixel font, and boss Spotlight cards that actually walk.",
      highlights: [
        "Damage numbers now use the game's pixel font: cream for small hits, coffee orange for big ones. They're reused instead of made fresh for every hit, which keeps big swarms smoother on phones.",
        "Boss Spotlight cards play the boss's walk cycle instead of one still frame."
      ]
    },
    {
      ver: "V. 1.79.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "A lighter, tidier build: the title loads about 3 MB less, colors stay on palette, and phones get a few fixes.",
      highlights: [
        "Loads lighter: the title art and the exit interview banners are about 3.5 MB smaller in total, with no visible change, and four unused fonts are gone.",
        "The last off-palette yellows (the bonus chest card, the score, menu highlights) now use the game's cream and coffee orange.",
        "Phones: the APPROVED stamp sits on the chest card's corner instead of over the headline, tall menus no longer tuck under the nav bar, and the Lounge sign is big enough to read.",
        "New players on phones get \"Drag anywhere to walk\" as their first tip."
      ]
    },
    {
      ver: "V. 1.79.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Your employee file is a little inbox now: status, news and to-dos, and your achievements are one tap away.",
      highlights: [
        "The employee file on the title screen shows a short feed: your last shift, what's new, something you can afford in the shop, and to-dos toward achievements. Tap MORE to page through it.",
        "Tap the achievements count in your file to see the full list. Back takes you right back to the title.",
        "Derek's camera finally looks like a camera on his Spotlight cards.",
        "Art Room: the cast filter hides the other cards again, and Spotlight previews show one character instead of a stretched sheet."
      ]
    },
    {
      ver: "V. 1.78.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The lights react now: coffee splashes glow, \"No.\" lights up the room, the V8 has headlights. And don't unplug the rack with the yellow note.",
      highlights: [
        "Dynamic lighting: coffee hits, \"No.\" and Dad Joke light up the dark. Spam phones glow, the Group Chat lights up while typing, elites have a red halo, the V8 sweeps its headlights and the Gold Watch pulses faster as 65 gets closer. Derek's camera flashes, level-ups bloom and boss chests land with a glow.",
        "Eli from IT warned you. The Server Room now has a rack with a yellow note. Trip over its cable and find out (new achievement: There Was A Note).",
        "Lighting is cheaper to draw on phones, so all of this costs less than the old lights did.",
        "Fixed: the Five O'Clock card at 65 could be skipped if you'd already seen two tips that run. Big one-off cards now always show.",
        "A score the online board turns down now says so, instead of \"couldn't reach the online board\"."
      ]
    },
    {
      ver: "V. 1.77.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "The Intern Delivery card now stars TJ and Derek, shouting it together: \"For my MANAGER!\"",
      highlights: [
        "The first intern delivery shows a new Spotlight card with TJ and Derek side by side, shouting \"For my MANAGER!\" Everyone gets to see it once, even if you saw the old card."
      ]
    },
    {
      ver: "V. 1.77.0", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Final balance and copy pass: a fairer Mortgage, a slower minute hand, +2 health for the 9-to-5er, and a fixed achievement.",
      highlights: [
        "Balance (Grok): the 30-Year Mortgage and the Performance Review have less health, the Gold Watch's minute hand sweeps slower, the donut's sugar crash is shorter, and the 9-to-5er starts with +2 health.",
        "\"Fully Evolved Adult\" can actually be earned now (it asked for 9 evolutions; there are 6).",
        "Copy (Gemini): end-screen lines for six newer achievements, a Gold Watch entry in the Lore archive, clearer modifier and upgrade text, shorter tips and a few fresher jokes."
      ]
    },
    {
      ver: "V. 1.76.2", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Sharp new title art on phones: ChatGPT redrew all five scenes at the right proportions, and the birthday party is bigger.",
      highlights: [
        "The five phone title scenes are redrawn at true proportions, so they're crisp instead of stretched. Happy 50th's party now fills the screen.",
        "Portrait iPads get their own crop, so the cast sits above Punch In instead of behind it."
      ]
    },
    {
      ver: "V. 1.76.1", date: "Nov 4, 2026", title: "The Gold Watch",
      teaser: "Ben's hero is now spelled the way Ben likes it: The Coldwar Cowboy.",
      highlights: [
        "The Cold War Cowboy is now The Coldwar Cowboy everywhere: title screen, Spotlight card, achievements, lore, the devlog and the Art Room. That's Ben's preference."
      ]
    },
    {
      ver: "V. 1.76.0", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "Cleaner phones: crowds drop their name tags, nav buttons are easier to tap, and Options puts touch settings first.",
      highlights: [
        "When the screen fills up, regular enemies hide their name tags (25+ on phones, 60+ on bigger screens). Bosses, elites and the Group Chat's \"typing...\" keep theirs.",
        "Nav buttons are at least 40 px tall on touch screens.",
        "Options: touch settings come first on phones, and the leftover 2D/3D view controls are gone while 3D is parked.",
        "Extras no longer lists stages that don't exist yet, and Reset Progress has a red outline so thumbs stay away from it."
      ]
    },
    {
      ver: "V. 1.75.1", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "Quick Retry drops you straight into the office. No more old placeholder room while it rebuilds.",
      highlights: [
        "Quick Retry used to show an old placeholder room for a couple of seconds while the office rebuilt. The office now reuses the art it already unpacked (about 10x faster) and fades in once it's ready."
      ]
    },
    {
      ver: "V. 1.75.0", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "Lighter on phones: no hidden 3D engine, a calmer HUD, and too many gems on the floor merge into one big red gem.",
      highlights: [
        "The game no longer downloads or starts the parked 3D engine (600 KB less, and one less graphics context on phones).",
        "The HUD only redraws what changed, instead of about 20 pieces every frame.",
        "More than 150 gems on the floor? The farthest ones merge into a big red gem worth all of them. Unclaimed 401(k) coins and leftover pizza blink out after a minute.",
        "Quick Retry no longer carries Spotlight cards or a resize listener over from the last run."
      ]
    },
    {
      ver: "V. 1.74.0", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "Quick Retry is right there on phones now, the title art shows up instantly, and clocking out at 65 is one clean moment.",
      highlights: [
        "Phones: Quick Retry and the 401(k) Shop ride along at the bottom of the exit interview, above the leaderboard.",
        "The title art paints the moment the page opens, instead of after a few seconds of navy.",
        "New players skip the What's New pop-up and the poll on their very first visit.",
        "At 65, retirement says CLOCK OUT HERE instead of showing a health number, and no alerts pile on top of the Five O'Clock card."
      ]
    },
    {
      ver: "V. 1.73.3", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "The title art on phones isn't squished anymore. The cast stands at full height again.",
      highlights: [
        "The phone versions of the five title scenes were squashed to about two thirds of their height, so everyone looked short and wide. They're back to the right proportions, with the cast in the same spot."
      ]
    },
    {
      ver: "V. 1.73.2", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "Your hero's big card only opens the run now. Tip cards name the topic, show your hero smaller, and stop at two per run.",
      highlights: [
        "Your hero's big Spotlight card only plays at the start of a run. First-time tip cards now say what they're about (\"BOSS CHESTS\", \"THE DESK SALAD\") with your hero smaller, so they don't look like the intro again.",
        "No more than two first-time tips per run; the rest wait for a later run."
      ]
    },
    {
      ver: "V. 1.73.1", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "You can't stop the Gold Watch. You can only buy time: hit it to wind it back, and clock out at 65.",
      highlights: [
        "The Gold Watch can't be beaten now, like the Reaper in Vampire Survivors. Your hits wind it back: they push it away and slow its hands for a moment. A stronger build keeps it further off.",
        "It arrives 1.5 years before retirement and gets faster as the clock runs down. Reach 65 and the hands stop at 5:00 on their own: big chest, +35 401(k) and the keepsake.",
        "New achievement: Keep The Receipt, for clocking out without the watch ever landing a hit."
      ]
    },
    {
      ver: "V. 1.73.0", date: "Nov 3, 2026", title: "The Gold Watch",
      teaser: "The final boss is here: The Gold Watch arrives at 63.5. Forty years of watching the clock, now it watches you.",
      highlights: [
        "New final boss for Midlife mode: The Gold Watch shows up at age 63.5. Its hands sweep the room, its 5 AM alarm rings out shockwaves (slip out the gap at 12) and loose gears bounce around. It speeds up in Overtime and The Last Minute.",
        "Stop its hands at 5:00 for a big bonus chest, +35 401(k), the Five O'Clock Somewhere achievement and a keepsake at your retirement party. Still ticking at 65? You clock out anyway.",
        "The office calms down while you fight it: fewer, smaller crowds and no Group Chats. Numbers by Grok, words by Gemini, art by ChatGPT."
      ]
    },
    {
      ver: "V. 1.72.2", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "A brand-new Art Room: the whole office animated, a live Spotlight demo and before-and-after sliders. The About page now starts with the game.",
      highlights: [
        "New Art Room: every hero, intern, coworker, boss and enemy animated from the real game art, a live Spotlight card demo, and drag sliders comparing first drafts with today's art. The old page lives on as the Workshop.",
        "The About page now opens with what the game is, and Rami's links sit beside his bio.",
        "The menu bar is the same height on every page."
      ]
    },
    {
      ver: "V. 1.72.1", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "The HR Exit Interview: when a run ends, your hero slumps in a chair while whatever got you gloats. Phones also see more of the office.",
      highlights: [
        "Anonymous play stats now also note screen zoom, touch layout, whether a boss was in the room when you went down, and Group Chat pings, so we can tune the late game with real numbers."
      ]
    },
    {
      ver: "V. 1.72.0", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "The HR Exit Interview: when a run ends, your hero slumps in a chair while whatever got you gloats. Phones also see more of the office.",
      highlights: [
        "New death screen art by ChatGPT: your hero slumps into a chair in an empty HR office while the thing that got you looks very pleased with itself. Hit Retry and they get back up and dust off.",
        "Phones zoom out a bit so you can see more of the office and spot Group Chats before they ping you (Grok's suggestion).",
        "The first minute is a little gentler: Bills arrive a bit less often at age 40."
      ]
    },
    {
      ver: "V. 1.71.1", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Age 60 is less of a wall: Group Chats show up a little at 50 so you learn them early, and the V8 gives you a breath.",
      highlights: [
        "The age 60 wall, smoothed (numbers by Grok): a few Group Chats now show up from age 50 so you learn their pings before the V8 arrives, and there are fewer of them once it does.",
        "Group Chat pings are easier to read: \"typing...\" shows a bit longer and the ping flies a bit slower.",
        "The Midlife Crisis V8 waits a moment longer before its first skid and warns a little longer before each one."
      ]
    },
    {
      ver: "V. 1.71.0", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Every hero has their own voice now: new bios, play styles and first-time tip lines, written by Gemini.",
      highlights: [
        "Every hero now has a line for every first-time tip, including the Coldwar Cowboy (\"That's like jumping from dial-up straight to a T1 line.\").",
        "Three new first-time tips: your first intern delivery, your first Desk Salad and your first age-50+ surprise.",
        "New bios and play styles on the hero cards at the start of each run. Copy by Gemini."
      ]
    },
    {
      ver: "V. 1.70.1", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Every run now opens with your hero's card, with a short bio and how they play. Spotlight cards spread out more.",
      highlights: [
        "Your hero's Spotlight card plays at the start of every run, not just the first, and now shows a one-line bio and their play style.",
        "More spacing between Spotlight cards: 15 seconds between cards, a boss goes before a promotion card that lands at the same moment, and the Lounge card never follows a room card."
      ]
    },
    {
      ver: "V. 1.70.0", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Five new title screen scenes starring the whole crew, drawn to fit around the menus, with their own tall versions for phones.",
      highlights: [
        "New title screen art by ChatGPT: Group Photo, Off and On Again, The Lounge, Coffee Run and Happy 50th, starring the heroes, TJ, Derek and the coworkers.",
        "Each scene is drawn so the cast sits where the menus leave room, and phones get a separately drawn tall version instead of a thin slice of the wide one."
      ]
    },
    {
      ver: "V. 1.69.2", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Spotlight cards take turns now: a breather between cards, bosses cut in, and the Lounge card shows once a run.",
      highlights: [
        "Spotlight cards no longer pile up back to back (Rami): there's a 12-second breather between cards, a boss cuts in right away, cards that wait too long are skipped, and the Lounge card shows once a run instead of right after the promotion card."
      ]
    },
    {
      ver: "V. 1.69.1", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "The devlog note on the title screen now says what the newest memo is about, and this pop-up shows up right away.",
      highlights: [
        "The pinned devlog note on the title screen shows a one-line summary of the newest memo.",
        "The \"What's new\" pop-up appears right away instead of after a pause, and opens instantly from the version button."
      ]
    },
    {
      ver: "V. 1.69.0", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Every Spotlight card now has a big animated portrait: the six coworkers who open new rooms got redrawn standing up.",
      highlights: [
        "The six coworkers who announce new rooms (Art, Sam, Eli, Nora, June and Mina) now appear as big standing portraits on their Spotlight cards, each with their own move. Art by ChatGPT.",
        "That makes every Spotlight card a full-size animated portrait: bosses, heroes, interns and coworkers."
      ]
    },
    {
      ver: "V. 1.68.4", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Derek has his own lines now. Yes, he will call you Unc.",
      highlights: [
        "Derek's lines are his own: \"Hey man, here's your coffee\", \"I love my manager\", \"Do you want a bundt cake?\", \"Unc\" and \"Hey you don't want to take damage\"."
      ]
    },
    {
      ver: "V. 1.68.3", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "The coworkers who announce new rooms now go by their real names: Art, Sam, Eli, Nora, June and Mina.",
      highlights: [
        "Room cards now use each coworker's own name, so the person on the card matches the name: Art from Payroll, Sam at the Front Desk, Eli from IT, Nora in Marketing, June from Legal and Mina in Benefits."
      ]
    },
    {
      ver: "V. 1.68.2", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Boss chests now slide over to you when you get close, so none get left behind.",
      highlights: [
        "Boss chests slide toward you once you're close, and touching one always opens it (Derek couldn't pick up the Mortgage chest)."
      ]
    },
    {
      ver: "V. 1.68.1", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "The Lounge card now shows TJ and Derek's big new portraits: TJ raises his coffee, Derek snaps a photo.",
      highlights: [
        "When the Lounge opens, its Spotlight card shows a big On Break portrait of TJ (raising his coffee with a grin) or Derek (snapping a photo, flash and all). Art by ChatGPT.",
        "On phones, long names on Spotlight cards wrap next to the sprite instead of covering it."
      ]
    },
    {
      ver: "V. 1.68.0", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Spotlight cards got a glow-up: a real spotlight, a hop-in landing, names that drop in letter by letter, and lines that type themselves.",
      highlights: [
        "New Spotlight animation for every card: a light beam opens, the band wipes in, the character hops up and lands in a puff, the name drops in letter by letter, and the line types itself out.",
        "Boss cards get a red spotlight. Cards also leave properly now: the sprite sinks and the band wipes away."
      ]
    },
    {
      ver: "V. 1.67.3", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Ben, TJ and Derek got redrawn: real faces, a proper walk, and they finally stand out on the office floor.",
      highlights: [
        "New art for the Coldwar Cowboy (v3 by ChatGPT): you can see his face under the hat, he strides with the floppy disk, blows on it when idle, and has a new On Break portrait and badge.",
        "TJ and Derek's intern sprites were redrawn to match the heroes. TJ sips his coffee while he waits, and Derek raises his camera."
      ]
    },
    {
      ver: "V. 1.67.2", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "Easier to find the Lounge: a big card when it opens, an arrow the whole time, and a sign on the counter when it's closed.",
      highlights: [
        "The Lounge is easier to find (TJ couldn't): a Spotlight card when it opens, an arrow pointing to it the whole time it's open, 50 seconds instead of 35, and a sign on the Break Room counter when it's closed."
      ]
    },
    {
      ver: "V. 1.67.1", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "New hero: The Coldwar Cowboy. Finish 10 devlog memos to hire him. He throws floppy disks, and once a run he turns it off and on again.",
      highlights: [
        "Spotlight cards load the hero art ahead of time, so the sprite rises with the card instead of popping in late."
      ]
    },
    {
      ver: "V. 1.67.0", date: "Nov 3, 2026", title: "The Coldwar Cowboy",
      teaser: "New hero: The Coldwar Cowboy. Finish 10 devlog memos to hire him. He throws floppy disks, and once a run he turns it off and on again.",
      highlights: [
        "New hero: The Coldwar Cowboy, based on Rami's friend Ben (they met working IT at Kent State in 2002). Unlock him by finishing 10 devlog memos.",
        "He starts with the Floppy Disk (a boomerang that evolves into the Zip Drive) and +2 max health. Once a run, at a quarter health: \"Have you tried turning it off and on again?\" The screen clears and he gets 40% back.",
        "TJ and Derek have real pixel art now, walking, carrying coffee and snacks, and working the Lounge counter. Art by ChatGPT."
      ]
    },
    {
      ver: "V. 1.66.1", date: "Nov 3, 2026", title: "Spotlight",
      teaser: "Spotlight cards: bosses, coworkers and new hires now make an entrance, with a big sprite and a line of their own.",
      highlights: [
        "More lights from ChatGPT: glowing exit signs, Lobby elevator lights, the OUR VALUES sign, headlights and a dome light in the Parking Lot, the Synergy whiteboard projector and the Break Room fridge."
      ]
    },
    {
      ver: "V. 1.66.0", date: "Nov 3, 2026", title: "Spotlight",
      teaser: "Spotlight cards: bosses, coworkers and new hires now make an entrance, with a big sprite and a line of their own.",
      highlights: [
        "Spotlight cards: big animated moments when a boss walks in, a coworker announces a new room, you play a hero for the first time, or you see something new (your first elite, chest, evolution, low health). A slanted band, a big sprite, one line and a tip. Lines by Gemini.",
        "They don't pause the game, they wait for menus to close, and you can tap the speech bubble to dismiss one."
      ]
    },
    {
      ver: "V. 1.65.0", date: "Nov 3, 2026", title: "Life Happens",
      teaser: "After 50, life happens: Ghost Hour, Reading Glasses, Rent Hike, Past Due and more roll in for a couple of years at a time.",
      highlights: [
        "Age 50+ modifiers: short \"life happens\" weather after 50. Ghost Hour, Reading Glasses, Rent Hike, Empty Nest, Back Spasm, Reply-All Tax, Past Due and Open Enrollment. One at a time, about two or three per run, each announced with a banner and a chip at the top of the screen.",
        "Some are pure trouble, some are double-edged (Empty Nest gives more XP, Open Enrollment gives better snacks). They never stack with the Comfort Zone Tax, and they never start during a boss fight."
      ]
    },
    {
      ver: "V. 1.64.0", date: "Nov 3, 2026", title: "Happy Retirement",
      teaser: "Make it to 65 and the office throws you a retirement party: streamers, cake, confetti and a gold watch.",
      highlights: [
        "Retiring at 65 now gets a real party on the win screen: a HAPPY RETIREMENT banner, streamers, falling confetti, a sheet cake and a swinging gold watch. Art by ChatGPT.",
        "What's new is now a proper pop-up (corner card on big screens, a pill on phones) instead of loose text under the title. Tap the version chip to see it again.",
        "Fixed: the pause menu said Start Fresh at age 50 in Midlife. It always restarts at 40, and now says so."
      ]
    },
    {
      ver: "V. 1.63.1", date: "Nov 3, 2026", title: "The Lounge",
      teaser: "The Lounge is open! After each promotion, an intern runs the Break Room counter. Walk up to shop for snacks and boosts.",
      highlights: [
        "Credits updated: the whole AI crew, our playtesters and the office interns."
      ]
    },
    {
      ver: "V. 1.63.0", date: "Nov 3, 2026", title: "The Lounge",
      teaser: "The Lounge is open! After each promotion, an intern runs the Break Room counter. Walk up to shop for snacks and boosts.",
      highlights: [
        "The Lounge: after each promotion (45, 50, 55, 60) an intern opens the Break Room counter for about 35 seconds. Walk up to it and the game pauses while you shop. Prices come out of your 401(k).",
        "On the menu: Stale Pastry, Desk Salad Box, Cold Brew Cup, Loaner Badge, Quiet Hour Pass and a once-per-run Band-Aid Kit.",
        "No hiding: crowds close the register, enemies still walk in, and hanging around the Break Room while it's closed brings company.",
        "The title screen now shows the version you're playing, with a quick note about what's new."
      ]
    },
    {
      ver: "V. 1.62.0", date: "Nov 3, 2026", title: "The Interns",
      highlights: [
        "Meet the interns: TJ and Derek, two of our playtesters, now work at the office. Every minute or so one walks over with a snack (heals), a coffee (faster), a focus boost (more damage) or a gem run.",
        "They get busier as you age, so deliveries get rarer late in a run. Bills scare them off, and if you're mobbed they leave it on the floor for you.",
        "Placeholder art for now. Their real pixel portraits are coming."
      ]
    },
    {
      ver: "V. 1.61.1", date: "Nov 3, 2026", title: "Birthday Cake",
      highlights: [
        "Freeze safety net: if the game ever stays paused with no menu on screen, it brings the menu back or unpauses within 2 seconds. Reported by Derek after a boss chest.",
        "A boss chest you walk over while a level-up is open now waits on the floor until you're done.",
        "Title screen: the settings chip (Midlife · Tax) no longer goes blank when you open it. Also spotted by Derek."
      ]
    },
    {
      ver: "V. 1.61.0", date: "Nov 3, 2026", title: "Birthday Cake",
      highlights: [
        "Birthdays heal now: at 45, 50, 55, 60 and 65 the break room springs for cake and you get back a share of your max health, along with your 401(k) dividend.",
        "New drop: the Desk Salad. Elites sometimes leave one behind (never more than 3 in a row without one). It heals more than pizza, but it wilts after 14 seconds, so go get it.",
        "Fixed old tips that said pizza heals 3 and level ups heal 2. It's 2 and 1."
      ]
    },
    {
      ver: "V. 1.60.1", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "Dev mode now shows a DEV MODE · SCORES OFF badge on every screen, so nobody forgets it's on before a real run."
      ]
    },
    {
      ver: "V. 1.60.0", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "New for playtesters: a dev console. Add ?dev=1 to the address, then tap DEV (or press the ` key) for god mode, full health, any upgrade, jumping to an age, calling a boss, clearing the screen and route arrows. Dev runs never post scores. Add ?dev=0 to turn it off. TJ's idea."
      ]
    },
    {
      ver: "V. 1.59.2", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "Fixed the force field: on your second run without a refresh, enemies could steer away from you because their route map was stuck where your last run ended. Found by TJ."
      ]
    },
    {
      ver: "V. 1.59.1", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "iPhone: the game no longer stops your music or podcast. It plays on top by default. Want the game louder than everything, even on silent? Pause and set Your music to Game only."
      ]
    },
    {
      ver: "V. 1.59.0", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "Every room has its own light now: orange street lamps in the Parking Lot, the SAD lamp in Wellness, fluorescent panels over the meeting tables (one sputters now and then), the banker's lamp in the Executive Wing, vending machines, coolers and the break room counter.",
        "Each room has a mood. The Lobby and Wellness Corner feel brighter, the Server Room and the Parking Lot at night feel darker, and it eases as you walk between them.",
        "Phone fix: the Shop no longer slides under the menu buttons or runs off the right edge. One card per row on phones.",
        "Phone fix: a stronger audio wake-up for iPhones."
      ]
    },
    {
      ver: "V. 1.58.1", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "New On Break portraits by ChatGPT on the pause screen. Your hero breathes for a bit, then takes a real break: the 9-to-5er sips his coffee, the Soccer Dad winces at the group chat, the Grad Student turns a page. Then everyone stretches their lower back."
      ]
    },
    {
      ver: "V. 1.58.0", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "The 401(k) Shop has a picture for every perk, plus four Classified Benefits still pending HR approval.",
        "Shop, Leaderboard and Options open at full length with no little scroll boxes. Your tiles fold into buttons underneath.",
        "On the title screen your tiles sit at the bottom again, and a small quick poll pops up until you vote or close it.",
        "The menu bar's Play button now says Title Screen."
      ]
    },
    {
      ver: "V. 1.57.2", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "You can post your score with a controller now: press up to Post Score, then pick a name badge if you haven't typed one.",
        "Quick poll: would you sign up for an account so your progress follows you to every device? Vote in Extras or on the devlog."
      ]
    },
    {
      ver: "V. 1.57.1", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "The Shop, Extras, Leaderboard, Achievements and Options now open as a panel above your tiles, with the key art still playing behind. Fold the tiles away when you need the room.",
        "Your hero has their own On Break tile on the pause screen, breathing slowly with the occasional fidget, just like in the game.",
        "The 8-bit cursor now works everywhere: the game, every menu, gameplay and the devlog."
      ]
    },
    {
      ver: "V. 1.57.0", date: "Nov 3, 2026", title: "After Hours",
      highlights: [
        "Lighting! The office is dim now, with warm pools under desk lamps and the vending machines, cool glows from screens and server racks, and a light that follows you. It gets darker every year you age, so your 60s feel like working late.",
        "Boss chests glow through the dark, and damage numbers stay bright on top."
      ]
    },
    {
      ver: "V. 1.56.0", date: "Nov 3, 2026", title: "Smooth Operator",
      highlights: [
        "Smoother title slideshow: softer crossfades, no snapping, and gentler motion. On wide screens the logo moves to the top-left and the art lifts above the tiles. Ultra-wide screens show the whole picture.",
        "Your hero now idles beside the On Break title on the pause screen.",
        "The Shop, Extras, Leaderboard, Achievements and Options screens match the new tile layout.",
        "Soft menu sounds when you hover or move between options.",
        "The menu bar says Devlog instead of Memos."
      ]
    },
    {
      ver: "V. 1.55.0", date: "Nov 3, 2026", title: "Office Footprints",
      highlights: ["The Courtyard Loop has worn paths, coffee stains, taped cables and a Lobby runner. Someone left a pizza box in the commons."]
    },
    {
      ver: "V. 1.54.2", date: "Nov 3, 2026", title: "On Break",
      highlights: ["Each title slide now moves around its subject: some start tight on the hero and pull back to reveal the scene, others drift slowly toward him. Phones crop on the same spot, so the hero stays in frame."]
    },
    {
      ver: "V. 1.54.1", date: "Nov 3, 2026", title: "On Break",
      highlights: ["A new pause screen built from tiles: a big Resume up top, then This Shift (age, health and XP bars, time, enemies paid off, 401(k)), Your Loadout (every weapon and perk with its level) and Settings."]
    },
    {
      ver: "V. 1.54.0", date: "Nov 3, 2026", title: "Bonus Approved II",
      highlights: [
        "Real Bonus Chest art: an Employee Appreciation gift box, an office safe and the executive bonus chest, with pixel light beams, spinning gold and silver coins, fluttering bonus checks and an APPROVED stamp. (Art by ChatGPT.)",
        "On wide screens, Punch In now lives in the Today's Shift tile with your crew, front and center.",
        "Two new title slides, 11:58 PM and Happy Retirement (art by Grok), plus new welcome-back lines and tips (written by Gemini).",
        "Reading Glasses has a brighter icon."
      ]
    },
    {
      ver: "V. 1.53.0", date: "Nov 3, 2026", title: "Hybrid Schedule",
      highlights: [
        "Three new achievements for playing everywhere: Hybrid Schedule (two kinds of devices, +5k), Remote Worker (phone, tablet and computer, +10k) and Plugged In (a run with a game controller, +5k).",
        "Your employee file on the title screen now has a tip just for you: try a bigger screen, plug in a controller, read the devlog or brag in the Discord."
      ]
    },
    {
      ver: "V. 1.52.1", date: "Nov 3, 2026", title: "One Look",
      highlights: ["One menu bar for the game and the whole devlog: Play, Memos, Art Room, About, Discord and Coffee. Tap ▲ to tuck it away (the MENU tab brings it back). It disappears while you're actually playing."]
    },
    {
      ver: "V. 1.52.0", date: "Nov 3, 2026", title: "Punch In",
      highlights: [
        "Title screen tiles: your employee file welcomes you back, says how your last shift went and shows your oldest age, best score, 401(k) and achievements. It sits beside your crew and the latest devlog memo, filling the width on desktop and iPad.",
        "The game now remembers how many shifts you've worked and your last run."
      ]
    },
    {
      ver: "V. 1.51.1", date: "Nov 3, 2026", title: "Punch In",
      highlights: ["The title screen cycles through the game's key art (the 8:59 lobby, the swarm, the whole-life panorama, the long way to coffee and PROMOTED), each with a slow push-in and a soft crossfade."]
    },
    {
      ver: "V. 1.51.0", date: "Nov 3, 2026", title: "Punch In",
      highlights: [
        "A new title screen built around the key art. Start the game with a glowing PUNCH IN button next to the time clock while the swarm presses on the glass.",
        "Pick your hero from a row of ID badges. Run mode and Tax Bracket now sit in a small settings chip.",
        "The latest devlog memo is pinned on the title screen, with the build count and how recently the game was updated."
      ]
    },
    {
      ver: "V. 1.50.2", date: "Nov 3, 2026", title: "One Look",
      highlights: [
        "New chunky progress bars, the same as the devlog's reading bar: XP across the top, the year bar under your age and the health bar under your hero. They get thicker on bigger screens.",
        "The HUD and the message strip at the bottom use the devlog's fonts and colors, with bigger text on iPad."
      ]
    },
    {
      ver: "V. 1.50.1", date: "Nov 3, 2026", title: "One Look",
      highlights: [
        "Level-up cards fit on phones now: icon on the left and the full description on the right, with nothing cut off the edge.",
        "On iPad, menus use the big screen with larger cards and type.",
        "Level-up cards and the Bonus Chest card use the devlog's colors and fonts. No more off-palette blue."
      ]
    },
    {
      ver: "V. 1.50.0", date: "Nov 3, 2026", title: "The Courtyard Loop",
      highlights: ["The Lobby has a proper reception and waiting area. The Bullpen has four team pods, an open commons and coworkers who finally sit in their chairs."]
    },
    {
      ver: "V. 1.49.0", date: "Nov 3, 2026", title: "Final Notice",
      highlights: [
        "Crowds have heavies now. Some enemies spawn as elites: bigger, standing in a red glow, with names like FINAL NOTICE, SCAM LIKELY and THE DOZEN. They always take at least 5 hits, however strong you get, and drop a jackpot of gems and coins.",
        "More elites show up as you age: about 1 in 20 early, about 1 in 9 by 55."
      ]
    },
    {
      ver: "V. 1.48.1", date: "Nov 3, 2026", title: "Required Reading",
      highlights: ["New achievement: Required Reading (+10k). Finish 10 memos on the devlog (scroll to the end of each), then clock in. The devlog now shows your own employee file too: best score, oldest age, 401(k) balance and achievements."]
    },
    {
      ver: "V. 1.48.0", date: "Nov 3, 2026", title: "Bonus Approved",
      highlights: [
        "Boss chests are a real moment now. The game pauses on a BONUS APPROVED card. Press OPEN and the chest shakes, light beams shoot up, rewards spin like a slot reel and land, and 401(k) coins fountain out while the counter ticks up.",
        "Bigger bosses pay bigger: the Performance Review pays 1 reward, the 30-Year Mortgage 3, and the Midlife Crisis V8 5, with a gold flash. Press SKIP if you're in a hurry."
      ]
    },
    {
      ver: "V. 1.47.0", date: "Nov 2, 2026", title: "Still on Mute",
      highlights: ["Six coworkers bring the office to life with small desk routines, reactions when you pass, and their own office memos."]
    },
    {
      ver: "V. 1.46.0", date: "Nov 2, 2026", title: "Smooth Operators",
      highlights: [
        "All three heroes now walk on 8 frames, and they breathe when you stand still. Wait a few seconds: the 9-to-5er pushes up his glasses, the Soccer Dad rubs his neck and the Grad Student checks her notebook. (Art by ChatGPT.)"
      ]
    },
    {
      ver: "V. 1.45.0", date: "Nov 2, 2026", title: "Smooth Operators",
      highlights: [
        "Every enemy now animates on 8 frames instead of 4, so the swarm moves smoothly. Spam Likely shakes when it rings, Back Twinge lunges and rests, and 3 AM Thought fades into a see-through ghost. (Art by ChatGPT.)",
        "Level-up cards, the HUD and the character picker use new pixel icons instead of phone emoji."
      ]
    },
    {
      ver: "V. 1.44.0", date: "Nov 2, 2026", title: "Office Finish",
      highlights: ["The Lobby gets stitched rugs and softer light, and the Bullpen gets more cubicles, CRTs, and a printer that will not stop printing."]
    },
    {
      ver: "V. 1.43.1", date: "Nov 2, 2026", title: "Life Follows You to Work",
      highlights: [
        "Each promotion now tells you what followed you to work: hospital co-pays at 45, tuition and carpool at 50, your knees at 55, the group chat at 60.",
        "The lore now says it plainly: a Midlife run never leaves the office. The hospital, home and resort are Full Life chapters.",
        "Important messages no longer get lost when a swarm alert or tip interrupts them."
      ]
    },
    {
      ver: "V. 1.43.0", date: "Nov 2, 2026", title: "Every Weapon Has a Job",
      highlights: [
        "Weapon pass (designed by Grok): Dad Joke is the crowd blast and Louder Groan now makes it fire faster too. \"No.\" is the space-maker: it shoves harder but adds damage only on ranks 2 and 4.",
        "Spreadsheet spins a little faster, TV Remote odd ranks throw sooner, and level-up cards now say exactly what they do."
      ]
    },
    {
      ver: "V. 1.42.1", date: "Nov 2, 2026", title: "HR Says Relax",
      highlights: [
        "Promoted at 60: the Wellness Corner opens beside the Conference Rooms. Massage chair, quiet pod, a puzzle stuck at 80% and plenty of plants to smash. (Room built by ChatGPT.) Every promotion in a Midlife run now leads somewhere."
      ]
    },
    {
      ver: "V. 1.42.0", date: "Nov 2, 2026", title: "HR Says Relax",
      highlights: [
        "The Wellness Corner is built: massage chair, quiet pod, unfinished puzzle and mandatory fun. Its age-60 door stays closed for room review.",
        "Wellness access now sits beside Conference; the old Executive opening is sealed and the public corridor stays full width."
      ]
    },
    {
      ver: "V. 1.41.0", date: "Nov 2, 2026", title: "Punchline",
      highlights: [
        "Promoted at 55: the Executive Wing opens, with its corner office, putting mat and leather chairs. (Room built by ChatGPT.)",
        "Dad Joke is now an attack: a punchline blast with a flash, shockwave and flying HA!s that deals double damage. Enemies only flinch now instead of freezing."
      ]
    },
    {
      ver: "V. 1.40.2", date: "Nov 2, 2026", title: "Corner Office Energy",
      highlights: [
        "Fixed enemies walking AWAY from you when they were directly behind a desk or other wide furniture. They now pick a side and go around. (Thanks Derek, T.J. and ChatGPT's room tests.)",
        "Leaderboard: if the scores don't load, it tries again and shows a Retry button instead of \"No scores yet.\""
      ]
    },
    {
      ver: "V. 1.40.1", date: "Nov 2, 2026", title: "Corner Office Energy",
      highlights: [
        "Playtesters: add ?navdebug=1 to the game link to see the spots enemies treat as solid (red squares). Handy for recording pathing bugs."
      ]
    },
    {
      ver: "V. 1.40.0", date: "Nov 2, 2026", title: "Corner Office Energy",
      highlights: [
        "The Executive Wing is built behind the closed age-55 door, with a skyline office, putting mat and a clear V8 lane; Wellness access at 60 stays closed.",
        "The server crash cart now cracks, collapses into rubble and drops loot."
      ]
    },
    {
      ver: "V. 1.39.2", date: "Nov 2, 2026", title: "In the Meetings",
      highlights: [
        "Fixed enemies lining up along walls and backing away: the \"No.\" shockwave could shove Bills straight through thin walls into the dark areas. Shoves now stop at walls, and any enemy that still ends up off the floor gets put back. (Thanks Derek and T.J.)"
      ]
    },
    {
      ver: "V. 1.39.1", date: "Nov 2, 2026", title: "In the Meetings",
      highlights: [
        "The music now stops when you switch apps, close the tab or lock your phone, and comes back when you return. (It used to keep plinking slowly in the background.)"
      ]
    },
    {
      ver: "V. 1.39.0", date: "Nov 2, 2026", title: "In the Meetings",
      highlights: [
        "At age 50 you get promoted again: the Server Room and three glass Conference Rooms open up. (Rooms built by ChatGPT.)",
        "The Executive Wing door stays locked until its room is built."
      ]
    },
    {
      ver: "V. 1.38.1", date: "Nov 2, 2026", title: "Take It Offline",
      highlights: [
        "Fixed a crash at age 50: the first 3 AM Thought (it has no shadow) broke enemy drawing. Spotted by ChatGPT during room testing."
      ]
    },
    {
      ver: "V. 1.38.0", date: "Nov 2, 2026", title: "Take It Offline",
      highlights: [
        "Server Room and three glass Conference Rooms are built behind the closed age-50 doors, with wide combat space and new office art.",
        "The Executive Wing age-55 door stays closed. Existing age-45 promotions still work; age-50 access awaits review."
      ]
    },
    {
      ver: "V. 1.37.0",
      date: "Nov 2, 2026",
      title: "Promoted",
      highlights: [
        "At age 45 you get promoted: the Parking Lot and Break Room doors roll up, giving you a lot more room to roam. Enemies follow you in. (Rooms built by ChatGPT.)",
        "The Server Room and Conference doors stay locked for now. Those rooms are next."
      ]
    },
    {
      ver: "V. 1.36.0",
      date: "Nov 2, 2026",
      title: "Coffee Break Campus",
      highlights: [
        "Parking Lot and Break Room are built behind the closed age-45 doors, ready for promotion access wiring.",
        "Wide parking lanes, five car paints and a cozy coffee-and-cake corner add room to explore; the next age-50 doors stay closed."
      ]
    },
    {
      ver: "V. 1.35.0",
      date: "Nov 2, 2026",
      title: "Smash the Printer",
      highlights: [
        "Printers, filing cabinets, vending machines, trash cans, water coolers, the lost and found, coat racks and plants now crack and then break apart for loot. Vending machines usually have pizza; the lost and found often hides an item. They're back in one piece after 90 seconds.",
        "The three Midlife bosses have real art: a stern clipboard, a house riding a stack of contracts, and a red convertible with too much confidence. Each one winds up before it attacks. (Art by ChatGPT, jokes by Gemini.)"
      ]
    },
    {
      ver: "V. 1.34.0",
      date: "Nov 2, 2026",
      title: "Boss Fight",
      highlights: [
        "The Performance Review now charges in a straight line after an orange warning lane. Step sideways.",
        "The 30-Year Mortgage sends out expanding interest rings. Slip into the % gap.",
        "The Midlife Crisis V8 drifts in a loop and leaves skid marks that hurt. Cut inside or get clear.",
        "Every attack gives a clear warning first, a little faster as you age or raise the Tax Bracket, but never too short to react on a phone. (Designed with Grok.)"
      ]
    },
    {
      ver: "V. 1.33.2",
      date: "Nov 2, 2026",
      title: "Exit Interview",
      highlights: [
        "The Game Over screen now sums up your run: each achievement you earned, what it means for your next run, what you can afford in the 401(k) Shop, and your next two goals.",
        "Ten new death lines (written with Gemini)."
      ]
    },
    {
      ver: "V. 1.33.1",
      date: "Nov 2, 2026",
      title: "Beautiful Chaos",
      highlights: [
        "Play stats now note the kind of device (phone, tablet or desktop, system, browser, rough screen size) and how smoothly the game ran, so we can find and fix lag. Nothing personal is recorded."
      ]
    },
    {
      ver: "V. 1.33.0",
      date: "Nov 2, 2026",
      title: "Beautiful Chaos",
      highlights: [
        "Enemies now flash, squash and pop with a little shockwave when you pay them off, and get shoved back when hit.",
        "Sound effects have variety: every hit sounds a little different, and fast kill streaks climb a happy scale. Big fights blend together instead of clipping.",
        "Separate MUSIC and EFFECTS volume in the pause menu.",
        "Little dust puffs follow your feet."
      ]
    },
    {
      ver: "V. 1.32.2",
      date: "Nov 2, 2026",
      title: "Second Helping",
      highlights: [
        "A little tougher up front: Bills take 3 hits instead of 2, and donuts start showing up at 42 instead of 45.",
        "Smashed plants grow back after 75 seconds, so long runs don't run out of pizza."
      ]
    },
    {
      ver: "V. 1.32.1",
      date: "Nov 2, 2026",
      title: "Tune-Up",
      highlights: [
        "Speed pass for iPads and phones: floor shadows are painted once instead of every frame, 120 Hz screens no longer run the game twice as often, and the HUD updates once per frame instead of once per gem."
      ]
    },
    {
      ver: "V. 1.32.0",
      date: "Nov 2, 2026",
      title: "Supersized",
      highlights: [
        "Enemies are 40% bigger, closer to your own size, and their hit boxes grew with them.",
        "Bosses are now more than twice your height, so they feel like bosses. Their hit box stays smaller than they look, so they still fit between desks."
      ]
    },
    {
      ver: "V. 1.31.1",
      date: "Nov 2, 2026",
      title: "Roundabout",
      highlights: [
        "Smarter enemies around small furniture: a Bill right behind the Circle Back roundabout used to charge into it and get stuck. Now it walks around."
      ]
    },
    {
      ver: "V. 1.31.0",
      date: "Nov 1, 2026",
      title: "New Hire Tour",
      highlights: ["The playable office is now an authored Lobby and Bullpen slice with reception, varied desk clusters, static coworkers and dressed floors. Promotion doors stay closed for this playtest; one duck is clearly out of line."]
    },
    {
      ver: "V. 1.30.5",
      date: "Nov 1, 2026",
      title: "Rebalance",
      highlights: [
        "401(k) Shop: REFUND ALL gives back every coin you've spent, so you can try a different build. Tap twice to confirm.",
        "Big screens zoom in automatically, so the office isn't tiny on a large monitor. Phones and small laptops look the same as before."
      ]
    },
    {
      ver: "V. 1.30.4",
      date: "Nov 1, 2026",
      title: "Let Go",
      highlights: [
        "iPhone fix: after visiting the 401(k) Shop, touch steering could stop working completely. Tapping a menu button that disappears left the game thinking your finger was still down. It now lets go. (Thanks, Ben, for the detective work.)"
      ]
    },
    {
      ver: "V. 1.30.3",
      date: "Nov 1, 2026",
      title: "Right Now",
      highlights: [
        "Pausing now shows a RIGHT NOW box: everything currently affecting your run (Comfort Zone Tax, power-ups, a sugar crash, your Close Call streak) with time left.",
        "Controller fix: B (or Escape on a keyboard) now backs out of the 401(k) Shop, Extras, Leaderboard and other title pages. Before, controller players could get stuck in the Shop."
      ]
    },
    {
      ver: "V. 1.30.2",
      date: "Nov 1, 2026",
      title: "Groan Zone",
      highlights: [
        "Dad Joke got a real job: everyone in the groan circle stops to cringe and staggers back, buying you room. Bigger circle and faster too. (Thanks, T.J.)",
        "Big, short notices now flash near the middle of the screen for bosses, the Comfort Zone Tax and power-ups, so you don't have to look away from the fight. (Thanks, Ben.)",
        "Controls are fully reset whenever a run starts, which should fix lost input after visiting the 401(k) Shop.",
        "Music now wakes back up more reliably, including on iPhones after a call or app switch, and with the ringer on silent."
      ]
    },
    {
      ver: "V. 1.30.1",
      date: "Nov 1, 2026",
      title: "Who Clocked In",
      highlights: [
        "The game now counts anonymous play stats (run length, age reached, what got you, phone or laptop) to help with balancing. No names, no tracking cookies. Details are on the devlog's About page."
      ]
    },
    {
      ver: "V. 1.30.0",
      date: "Nov 1, 2026",
      title: "Close Call",
      highlights: [
        "Dodging pays now. When an enemy nearly gets you and misses, you earn a Close Call: a little XP, a quick speed blip and a few points.",
        "Chain them for a streak meter under the age bar: CLOSE CALL, SIDE-STEP, OUT OF OFFICE, PERFORMANCE EXCEEDED. Getting hit breaks the streak.",
        "Hiding behind a desk while enemies circle doesn't count, and near misses keep the Comfort Zone Tax away while you're actively weaving. Designed by Grok."
      ]
    },
    {
      ver: "V. 1.29.3",
      date: "Nov 1, 2026",
      title: "Circle Back",
      highlights: [
        "Ten pieces of corporate slang, taken literally, are now in the office: a Circle Back roundabout, a Move the Needle gauge stuck on MEH, low-hanging fruit, a deep-dive kiddie pool, a pot boiling the ocean, ducks in a row, movable goalposts, a hard stop and a lamp that's been taken offline.",
        "Look for the Touch Base right where every run starts."
      ]
    },
    {
      ver: "V. 1.29.2",
      date: "Nov 1, 2026",
      title: "Circle Back",
      highlights: ["The Art Room adds 12 literal office-slang props and landmarks, bringing the modular kit to 25 families and 55 colorways. New art is ready for review; current navigation and first-batch integration are preserved."]
    },
    {
      ver: "V. 1.29.1",
      date: "Nov 1, 2026",
      title: "Hang in There",
      highlights: [
        "The office got its first batch of jokes: sticky-note fortresses, 2009 desks, family photos, Hang in There posters, a KPI sign nobody can explain, a parked REBRAND, and Dave's idea with a wheel boot.",
        "Walk up to a joke and the full line shows up as a MEMO at the bottom of the screen, once per run."
      ]
    },
    {
      ver: "V. 1.29.0",
      date: "Nov 1, 2026",
      title: "Around the Desk",
      highlights: [
        "Enemies now walk around furniture and through doorways instead of piling up against desks. No more hiding behind a cubicle.",
        "Enemies never spawn inside furniture, and the game is ready for locked areas in the bigger office coming soon."
      ]
    },
    {
      ver: "V. 1.28.18",
      date: "Nov 1, 2026",
      title: "Sticky Business",
      highlights: ["The Art Room has 13 new prop/poster families in 31 colorways, native hero comparisons and a 224px gate-clearance study. Stage 2 art is underway; runtime navigation and spawning are unchanged."]
    },
    {
      ver: "V. 1.28.17",
      date: "Nov 1, 2026",
      title: "Promotion Plan",
      highlights: ["Campus overview v2 adds irregular wings, starting-area and age-gate previews, plus a modular production plan in the Art Room. The playable world stays unchanged pending review."]
    },
    {
      ver: "V. 1.28.16",
      date: "Nov 1, 2026",
      title: "Parked Ideas",
      highlights: ["The Art Room has a nine-district campus proposal, measured route/plaza plan and literal idea Parking Lot concept for review. The playable world is unchanged pending approval."]
    },
    {
      ver: "V. 1.28.15",
      date: "Nov 1, 2026",
      title: "Two New Humans",
      highlights: ["The coffee devlog now includes the simplified pixel-art twins portrait in its Why now section."]
    },
    {
      ver: "V. 1.28.14",
      date: "Nov 1, 2026",
      title: "Join the Crew",
      highlights: [
        "There's a Midlife Survivors Discord now. Find it in Extras, or in the devlog. Come share playtest notes, see art early, or help build the game."
      ]
    },
    {
      ver: "V. 1.28.13",
      date: "Nov 1, 2026",
      title: "Out of the Art Room",
      highlights: ["All three animated heroes and the detailed Corporate Campus now appear in the main game, with looping office sections, grounded furniture and readable characters behind desks."]
    },
    {
      ver: "V. 1.28.12",
      date: "Nov 1, 2026",
      title: "The Inbox Moves",
      highlights: ["All ten regular enemies and chat pings now use animated pixel art with grounded shadows, original-art fallback and unchanged combat rules."]
    },
    {
      ver: "V. 1.28.11",
      date: "Nov 1, 2026",
      title: "Link Previews",
      highlights: [
        "Sharing any Midlife Survivors link (the game, devlog, posts, About, Art Room or the enemy review) now shows a proper preview card with art and a title."
      ]
    },
    {
      ver: "V. 1.28.10",
      date: "Nov 1, 2026",
      title: "A Whole Inbox of Trouble",
      highlights: [
        "All ten Batch 1 enemy species and the Group Chat projectile now have animated native sprite sheets: 11 sheets, 42 frames, with magenta backgrounds and the office palette.",
        "Review the full cast from the Art Room with pause, individual poses, native scale and floor comparisons. Art awaits visual review before combat integration."
      ]
    },
    {
      ver: "V. 1.28.9",
      date: "Nov 1, 2026",
      title: "Clocking Out",
      highlights: [
        "New Clocking Out brand mark: a cream clock with a teal rim and orange accent replaces the boxed MS initials across the devlog. Matching game/devlog favicons and a new home-screen icon are included.",
        "The phone header keeps the clock and game name together above the navigation links."
      ]
    },
    {
      ver: "V. 1.28.8",
      date: "Nov 1, 2026",
      title: "Back to the Studio",
      highlights: [
        "Restored the previous studio bio portrait and its share image at Rami's request. Both portrait revisions remain saved."
      ]
    },
    {
      ver: "V. 1.28.7",
      date: "Nov 1, 2026",
      title: "Coffee on the Menu",
      highlights: [
        "The Buy the Dev a Coffee button moved out of Extras and onto the main menu, next to Devlog."
      ]
    },
    {
      ver: "V. 1.28.6",
      date: "Nov 1, 2026",
      title: "Drawn Into the Game",
      highlights: [
        "Reworked the About portrait with chunkier game-art shapes, simpler shading, stronger navy outlines and the office key art's warm cream-and-teal lighting. Updated the bio and share image to the new revision."
      ]
    },
    {
      ver: "V. 1.28.5",
      date: "Nov 1, 2026",
      title: "Buy the Dev a Coffee",
      highlights: [
        "The game is free. If you'd like to support it, there's now a Ko-fi tip link in Extras and on the Game Over screen."
      ]
    },
    {
      ver: "V. 1.28.4",
      date: "Nov 1, 2026",
      title: "In the Studio",
      highlights: [
        "The devlog About page now features a new pixel-art portrait of Rami at his studio desk, based on his supplied photo. Updated the page's social preview image and accessible descriptions too."
      ]
    },
    {
      ver: "V. 1.28.3",
      date: "Nov 1, 2026",
      title: "The Bill Has Legs",
      highlights: [
        "Prepared the first Batch 1 enemy-art review asset: Bill, with four 48x48 walking frames, a looping preview and complete generation prompts. Awaiting visual approval before Art Room or production integration."
      ]
    },
    {
      ver: "V. 1.28.2",
      date: "Nov 1, 2026",
      title: "8:59 AM",
      highlights: [
        "New title screen art: you clocking in at 8:59 while the whole swarm presses against the lobby glass."
      ]
    },
    {
      ver: "V. 1.28.1",
      date: "Nov 1, 2026",
      title: "Before the Swarm",
      highlights: [
        "Prepared three 1920x1080 title-screen art concepts for review: a surrounding swarm, a whole-midlife panorama and the 8:59 office lobby. Selection and title-screen integration remain pending."
      ]
    },
    {
      ver: "V. 1.28.1",
      date: "Nov 1, 2026",
      title: "The Art Room",
      highlights: [
        "Extras > Art Room now opens the art preview inside the devlog, with the devlog's header and links."
      ]
    },
    {
      ver: "V. 1.28.0",
      date: "Nov 1, 2026",
      title: "One Office",
      highlights: [
        "The game and the devlog now share one look: the same palette, fonts and cream HR-memo headers.",
        "The title screen sits on the office key art, with a Devlog button right on the main menu.",
        "Teal replaces the old blue buttons, and the game has its own icon in your browser tab."
      ]
    },
    {
      ver: "V. 1.27.3",
      date: "Nov 1, 2026",
      title: "The Long Way, Illustrated",
      highlights: [
        "Prepared a 1536x1024 illustrated cover for the draft office-exploration devlog, with calm space on the left for a future title overlay. The post remains a draft."
      ]
    },
    {
      ver: "V. 1.27.2",
      date: "Nov 1, 2026",
      title: "Feet on the Floor",
      highlights: [
        "Campus furniture now has contact shadows fitted to each sprite's base, including printers, plants and cabinets. Chair mats, wheel wear and short cables connect desks to their floor space.",
        "Added a player foot shadow and richer carpet/wood texture. Paused resets and Visit Accounts keep the hero, shadow and health bar together."
      ]
    },
    {
      ver: "V. 1.27.1",
      date: "Nov 1, 2026",
      title: "The Long Way to Coffee",
      highlights: [
        "The separate Campus art preview is now 3072 by 2048 pixels, about 5.5 times its previous area, with seven areas, looping routes and five optional finds.",
        "Brighter carpet, floor wear, chair mats, paper trails and cream light pools give the office ground more character. The map remembers the paths you explore."
      ]
    },
    {
      ver: "V. 1.27.0",
      date: "Nov 1, 2026",
      title: "Comfort Zone Tax",
      highlights: [
        "Go 45 seconds without getting hit and the Comfort Zone Tax kicks in: bigger crowds for 20 seconds.",
        "Drop below 25% HP and enemies arrive a little slower until you recover.",
        "Neither happens in the first 90 seconds."
      ]
    },
    {
      ver: "V. 1.26.0",
      date: "Nov 1, 2026",
      title: "Tax Bracket",
      highlights: [
        "New on the title screen: Tax Bracket, an optional difficulty from 0 to 5 (Standard Deduction to Full Audit).",
        "Each bracket: enemies tougher and more numerous, hits harder, heals weaker. In return: more coins, more XP and a bigger score.",
        "Leaderboard shows a TAX badge on high-bracket scores. Three new achievements for retiring at Tax Bracket 1, 3 and 5."
      ]
    },
    {
      ver: "V. 1.25.0",
      date: "Nov 1, 2026",
      title: "Tax Season Prep",
      highlights: [
        "Harder mid-game: enemies thicken faster as you level, hits start hurting more at 48, and the safe window after a hit is shorter.",
        "Bosses are real fights now: more base HP, and they scale with your age as well as your level. Their HP tag shows the real number.",
        "Less free healing: +1 HP per level (was +2), smaller pizza heals, HR Snacks capped at 3, Healthy Boundaries heals every other pulse.",
        "Fixes: Roth IRA and Executive Delegation now boost Remote, Spreadsheet and Podcast too. Podcast pierce is exact. Holding a move key no longer scrolls the perk cards. Late-game hits no longer double-count age damage.",
        "The first 90 seconds stay gentle."
      ]
    },
    {
      ver: "V. 1.24.1",
      date: "Nov 1, 2026",
      title: "An Office With Some History",
      highlights: [
        "The Campus art test has new office floors, warm lighting accents, a jammed printer, filing cabinet and drooping plant.",
        "Visit Accounts jumps to the first detailed section. Native props and seamless floor tiles can be downloaded in the environment gallery."
      ]
    },
    {
      ver: "V. 1.24.0",
      date: "Oct 31, 2026",
      title: "Midlife Is Hard",
      highlights: [
        "Much harder. Enemies get tougher and more numerous as YOU level up, bosses scale with you, and hits hurt more after 52. Standing still no longer works.",
        "Coins come in slowly (a first run banks about 10k), so the 401(k) Shop is the long game.",
        "Three new shop upgrades: Continuing Ed (more XP), Side Hustle (more coins) and Second Opinion (get back up after a fatal hit).",
        "Extras > Reset Progress wipes your save for a true fresh start (tap twice)."
      ]
    },
    {
      ver: "V. 1.23.4",
      date: "Oct 31, 2026",
      title: "Three Different Strides",
      highlights: [
        "The art test now lets you walk as the 9-to-5er, Soccer Dad or Grad Student, with four-direction animation.",
        "Compare all three walking sheets in motion, pause a pose, and download their native sprite grids."
      ]
    },
    {
      ver: "V. 1.23.3",
      date: "Oct 31, 2026",
      title: "Three Desks, Three Personalities",
      highlights: [
        "The Campus art test now has tidy, paperwork-covered and working-lunch desks together in Accounts Payable.",
        "Compare the three in the new close-up gallery. They share a game frame and collision footprint."
      ]
    },
    {
      ver: "V. 1.23.2",
      date: "Oct 31, 2026",
      title: "Timer and Live Score",
      highlights: [
        "A run timer sits at the top center, above your age. It turns red in the last minute before your Retirement Party.",
        "Your score now counts up live in the top left."
      ]
    },
    {
      ver: "V. 1.23.1",
      date: "Oct 31, 2026",
      title: "Explore the Office Layout Study",
      highlights: [
        "Extras > Art Test now opens Corporate Campus: four departments, a revealing map and three optional discoveries.",
        "Switch Layout to return to the original art comparison. This separate study tests exploration before combat and finished scenery."
      ]
    },
    {
      ver: "V. 1.23.0",
      date: "Oct 31, 2026",
      title: "Achievements",
      highlights: [
        "29 achievements with midlife names, like Per My Last Email, The Sock Incident and Keep The Sedan. Each pays 401(k) coins.",
        "See them all in Extras > Achievements. New ones pop up in the lower third and on the Game Over screen.",
        "Full Life now unlocks with the Retirement Plan achievement (reach your Retirement Party in Midlife)."
      ]
    },
    {
      ver: "V. 1.22.0",
      date: "Oct 31, 2026",
      title: "Lost and Found",
      highlights: [
        "Items on the floor: Fanny Pack (pulls in every gem and coin), Energy Drink (faster for 12 seconds) and PTO Day (clears the screen). Smash plants to find them.",
        "New Boost cards when your regular perks run out: Leftover Friday Pizza, Standing Desk, Focus Block, HR Snacks and more. Annual Checkup no longer repeats forever.",
        "Dad Joke tells jokes that match where you are: office, hospital, home or the social scene.",
        "Over 50 new death lines, one set for every enemy and boss."
      ]
    },
    {
      ver: "V. 1.21.1",
      date: "Oct 31, 2026",
      title: "Reload Fix",
      highlights: [
        "Fixed controls sometimes not working until a second reload right after an update."
      ]
    },
    {
      ver: "V. 1.21.0",
      date: "Oct 31, 2026",
      title: "The 19-Minute Midlife",
      highlights: [
        "New main mode: Midlife, ages 40 to 65 in about 19 minutes. Three bosses, then your Retirement Party. Walk up and clock out to win.",
        "Full Life (40 to 100) is still here. It unlocks once you reach 65 in Midlife.",
        "Overtime: buy Delayed Retirement in the 401(k) Shop to add 5 more years per rank (up to 80).",
        "Each mode has its own leaderboard."
      ]
    },
    {
      ver: "V. 1.20.1",
      date: "Oct 31, 2026",
      title: "A Clearer Office Art Test",
      highlights: [
        "The new hero is about 15% larger in the art test.",
        "Desk collisions match their full floor space, with smoother movement around corners and believable overlap."
      ]
    },
    {
      ver: "V. 1.20.0",
      date: "Oct 31, 2026",
      title: "Playtest Fix Pack",
      highlights: [
        "Phones: steering works again after Retry. Perks need a second tap to confirm, so no more accidental picks.",
        "Dad Joke tells a joke when you unlock or upgrade it, plus an occasional bonus joke. Bubbles wrap and sit higher.",
        "Gentler first few minutes, then the usual ramp. Coins come in slower so the shop means something.",
        "Start is the big button; a saved run is a smaller Continue link. Perk labels are plain: New Weapon, Upgrade, Passive, Evolution.",
        "Leaderboard shows each player's personal best, with no top-10 cap. New Devlog link in Extras."
      ]
    },
    {
      ver: "V. 1.19.2",
      date: "Oct 31, 2026",
      title: "Try the New Office Art",
      highlights: [
        "Extras > Art Test opens a small office art preview with the new hero, Bill and workstation.",
        "Switch between current and new art at gameplay size, or zoom in for a closer look."
      ]
    },
    {
      ver: "V. 1.19.1",
      date: "Oct 30, 2026",
      title: "Online Leaderboard Is Live",
      highlights: [
        "Scores now post to one shared online leaderboard for everyone who plays.",
        "If the internet drops, your score is still saved on your device."
      ]
    },
    {
      ver: "V. 1.19.0",
      date: "Oct 30, 2026",
      title: "Scores & Leaderboard",
      highlights: [
        "Every run ends with a score: years survived, enemies beaten and 401(k) coins earned.",
        "Type a name and post it. No account needed; the game remembers your name.",
        "New Leaderboard button on the title screen. Online for everyone once it's connected; saved on this device until then."
      ]
    },
    {
      ver: "V. 1.18.0",
      date: "Oct 30, 2026",
      title: "Three New Weapons",
      highlights: [
        "The TV Remote: a boomerang thrown at the nearest enemy that hits both ways.",
        "Spreadsheet: cells orbit you and damage what they touch.",
        "Podcast at 2x: fires the way you walk and passes through crowds.",
        "3 new evolutions: Smart TV (Remote + Shoes), Pivot Table (Spreadsheet + Glasses), Binge Mode (Podcast + Sleep)."
      ]
    },
    {
      ver: "V. 1.17.0",
      date: "Oct 30, 2026",
      title: "Enemy Variety",
      highlights: [
        "3 AM Thought (age 50+): fades into a ghost you can't hit, then turns solid again.",
        "Calendar Invite (45+): locks a direction and charges straight through.",
        "Group Chat (60+): keeps its distance, shows 'typing...', then fires message pings. The first enemy that shoots.",
        "Math Homework (60+): circles you in a shrinking spiral.",
        "3 new swarms: Back-to-Back, 3 AM and Homework. New tips and death jokes for each."
      ]
    },
    {
      ver: "V. 1.16.1",
      date: "Oct 30, 2026",
      title: "Balance Pass: Fight Back",
      highlights: [
        "Bills take 2 hits. Enemies spawn about 25-40% faster at every age, and packs grow sooner.",
        "Enemies get tougher smoothly every year (+9%) instead of in big 4-year steps.",
        "Swarms grow with age, and Tax Season starts at 41. Standing still now catches up with you in about 30 seconds."
      ]
    },
    {
      ver: "V. 1.16.0",
      date: "Oct 30, 2026",
      title: "Intensity Curve & Swarm Events",
      highlights: [
        "Enemies now arrive in packs that grow each decade (1 at 40, up to 6 in your 90s), and the spawn rate ramps smoothly every year.",
        "The crowd limit grows with age: 60 on screen at 40, up to 200 at 100.",
        "New swarm events announced in the lower third: Tax Season, Robocalls, Donut Drop, Past Due, Reply All, Threw Out Back, and Everything (80+)."
      ]
    },
    {
      ver: "V. 1.15.0",
      date: "Oct 30, 2026",
      title: "A Full Life",
      highlights: [
        "1 real minute = 1 year. A full run from 40 to 100 takes about an hour (Save & Exit keeps your place).",
        "No more stop screen at 80: the retirement bonus (+15k, full health) pays out automatically and the run keeps going.",
        "The only win is meeting Death at 100. Dying earlier is a regular Game Over."
      ]
    },
    {
      ver: "V. 1.14.1",
      date: "Oct 30, 2026",
      title: "Steady Furniture",
      highlights: [
        "Fixed desks, plants and watercoolers flickering and jumping around while you walk.",
        "Furniture near the mezzanine platforms no longer blinks in and out."
      ]
    },
    {
      ver: "V. 1.14.0",
      date: "Oct 30, 2026",
      title: "Credits, Not Cameo",
      highlights: [
        "New Credits screen in Title > Extras.",
        "The second character is now The Soccer Dad (same stats: Dad Joke aura, wider range, faster feet). Old saves keep the unlock.",
        "Grad Student lore made generic."
      ]
    },
    {
      ver: "V. 1.13.0",
      date: "Oct 30, 2026",
      title: "Menu Fixes",
      highlights: [
        "Options, Lore and Patch Notes now open on top of the title screen instead of behind it.",
        "Game Over's 401(k) Shop button takes you straight to the shop.",
        "Lower third messages wait while a menu is open instead of expiring unseen.",
        "Pause menu opens on Resume and is shorter (Lore and Patch Notes live in Title > Extras).",
        "Top HUD no longer peeks out behind the title and Game Over screens."
      ]
    },
    {
      ver: "V. 1.12.0",
      date: "Oct 30, 2026",
      title: "Game Tips Switch",
      highlights: [
        "New Pause menu option: GAME TIPS on or off, for experienced players. Remembered between visits.",
        "Alerts, chapter cards and rewards still show when tips are off.",
        "Replaced the Visual Engine row while 3D is parked."
      ]
    },
    {
      ver: "V. 1.11.0",
      date: "Oct 30, 2026",
      title: "Clean Title Screen",
      highlights: [
        "The title screen is now: pick a character, press Start.",
        "The 401(k) Shop, Options and Extras (start age, location, lore, patch notes) moved behind three buttons.",
        "Visual engine buttons removed while 3D is parked."
      ]
    },
    {
      ver: "V. 1.10.0",
      date: "Oct 30, 2026",
      title: "Lower Third",
      highlights: [
        "New broadcast-style strip at the bottom that appears only when there's something to say: boss alerts, low HP, first-time tips, decade chapter cards and 401(k) dividends.",
        "One message at a time. Urgent messages jump the line; minor ones are skipped when it's busy. Tips show once ever.",
        "Bigger HP bar under the player. Fixed a rare error when restarting a run."
      ]
    },
    {
      ver: "V. 1.9.0",
      date: "Oct 30, 2026",
      title: "Clean Screen HUD",
      highlights: [
        "Replaced the bottom console with a minimal Vampire Survivors-style HUD: XP bar across the top, age in the middle, coins and loadout top-left, pause and mute top-right.",
        "Added a small HP bar that rides under your character.",
        "Parked the 3D camera views; the game stays in 2D for now."
      ]
    },
    {
      ver: "V. 1.8.22",
      date: "Oct 30, 2026",
      title: "Mobile Viewport Scaling (Portrait, Landscape & Safe-Area Support)",
      highlights: [
        "Added <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'> and iOS/Android safe-area insets so mobile browsers render at native device resolution.",
        "Optimized the Broadcast Lower-Third HUD for both Mobile Portrait (max-width: 768px) and Mobile Landscape (max-height: 520px), keeping over 78% of the arena open while the top Mobile Floating Dock handles Pause, Input, View, and Mute.",
        "Added smooth vertical touch scrolling (touch-action: pan-y; 94dvh max-height) and compact 3-column Subject Cards inside the Title Dossier and modals."
      ]
    },
    {
      ver: "V. 1.8.21",
      date: "Oct 30, 2026",
      title: "401(k) Compound Interest Scaling & 5-Year Survival Dividends",
      highlights: [
        "Added 6 Compound Interest Yield Tiers (1x Match -> 2x Vested -> 3x Seniority -> 4x Executive -> 5x Compound -> 6x Golden): the longer you survive in a run, the more each gold 401(k) Coin is worth (+1k up to +6k+ per coin!).",
        "Added automatic 5-Year Compound Dividends at Ages 45, 50, 55, 60, 65, 70, 75, 80+ that deposit scaling bonus payouts directly into your 401(k).",
        "Increased base coin drop rate (55% scaling up to 78%) and added guaranteed bonus coins to Potted Plants and Boss Chests."
      ]
    },
    {
      ver: "V. 1.8.20",
      date: "Oct 30, 2026",
      title: "World Mythos, Subject Backstories & Scenario Lore Archive",
      highlights: [
        "Created the official Midlife Survivors Mythos ('Form W-40: The Great Compounding'), Subject Dossiers (The 9-to-5er, The Senior Photographer, The Grad Student at 45), and 5 Life Scenario Backstories in src/data/lore.js.",
        "Added an interactive 4-tab Mythos & Lore Archive modal (#lore-modal) accessible from the Title Screen and Pause Menu.",
        "Added a live Subject Bio & Quote preview bar right under the Character Select cards on the Title Dossier."
      ]
    },
    {
      ver: "V. 1.8.19",
      date: "Oct 30, 2026",
      title: "Version Tracking Stamp & Release Notes Dossier",
      highlights: [
        "Added live Version & Last Updated stamp ('V. 1.8.19 // Last updated on: Oct 30, 2026') on the Title Dossier, Pause Screen, and Lower-Third HUD.",
        "Added interactive Release Notes & Version History modal (#changelog-modal) accessible right from the Title Screen version badge."
      ]
    },
    {
      ver: "V. 1.8.18",
      date: "Oct 30, 2026",
      title: "Broadcast Lower-Third HUD & Contextual Story/Help Engine",
      highlights: [
        "Moved the gameplay HUD to a bottom Broadcast Lower-Third Console (#hud-lower-third), leaving the upper 82% of the 3D viewport unobstructed.",
        "Added a live Contextual Story & In-Game Help Ticker (#hud-context-bar) that reacts in real time to Bosses, low HP, Potted Plant drops, Mezzanine high ground, and Life Chapters.",
        "Added the 'ON SCREEN' Situational Radar row (#hud-radar-row) tracking live enemy counts, nearby plants, and next milestone countdown."
      ]
    },
    {
      ver: "V. 1.7.17",
      date: "Oct 30, 2026",
      title: "Full 4-Device Input Mapping & Controls Configuration Screen",
      highlights: [
        "Mapped all 4 input devices for gameplay and menus: Keyboard, Mouse (Hold-Click Steer, Cursor Auto-Follow, Click-Drag), Touch (4 stick modes), and Game Controller.",
        "Built the Input & Controls Configuration Screen (#controls-modal) with live key/button listening and localStorage persistence."
      ]
    },
    {
      ver: "V. 1.7.16",
      date: "Oct 30, 2026",
      title: "5 Unlockable Life Environments & Telephoto vs. Horizon 3D Cameras",
      highlights: [
        "Added 5 unlockable Life Stages (src/data/stages.js): Office (Age 40), Hospital (Age 44), Suburban Home (Age 50), Social Courtyard (Age 60), and Senior Resort (Age 80).",
        "Replaced the simple checkerboard with 3-zone 512x512 procedural architecture floors and locked in FOV 16 deg Isometric vs. FOV 68 deg 3D Skyscraper Horizon cameras."
      ]
    },
    {
      ver: "V. 1.6.14",
      date: "Oct 30, 2026",
      title: "Age 80-100 Senior Bonus Rounds, Save States & Spoken Dad Jokes",
      highlights: [
        "Extended campaign to Age 80 with 20 Senior Bonus Rounds (Age 80-100), Decade Checkpoints, and mid-run browser auto-save.",
        "Added breakable Potted Plants (dropping Pizza, Coins, and Jackpots) and spoken Web Speech API Dad Jokes."
      ]
    }
  ]
};

window.GAME_VERSION = GAME_VERSION;
