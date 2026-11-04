// World Mythos, Subject Dossiers (Playable Characters), Scenario Backstories & Boss Registry (`src/data/lore.js`).
// Powers the interactive Mythos & Lore Archive (`#lore-modal`), the Title Dossier Subject Preview,
// and the Broadcast Lower-Third Storytelling Engine.

const GAME_LORE = {
  worldMythos: {
    kicker: "FORM W-40 // BUREAU OF ACTUARIAL SURVIVAL",
    title: "THE GREAT COMPOUNDING",
    subtitle: "Why your unpaid bills, back spasms, and group-chat texts suddenly have legs.",
    chapters: [
      {
        heading: "1. Midnight on Your 40th Birthday",
        body: "At 12:00 AM on your 40th birthday, every human is quietly enrolled in Form W-40, known inside the Bureau of Actuarial Survival as 'The Great Compounding.' Every minor adult responsibility you postponed in your twenties and thirties (the electric bill on the kitchen counter, sleeping on a saggy mattress, 'we should totally get dinner soon!' texts, and adjustable-rate paperwork) achieves physical sentient form and begins walking toward you at a brisk, determined pace."
      },
      {
        heading: "2. Life Follows You to Work",
        body: "You never actually leave the office. On a Midlife run (Ages 40 to 65) the whole journey happens on one corporate campus: every promotion rolls up a new door (the Break Room and Parking Lot at 45, the Server Room and Conference Rooms at 50, the Executive Wing at 55, the Wellness Corner at 60), and the rest of your life follows you in. Hospital co-pays find you by the vending machine. Your kid's tuition and the carpool schedule wander into the server racks. The group chat RSVPs to the Wellness Corner, then cancels at 6:45 PM. The five arenas of adult life (the Office, St. Deductible Hospital, the Suburban Home, the Social Courtyard and Sunset Palms) are the chapters you'll live through on a Full Life run, all the way to 100."
      },
      {
        heading: "3. The Relics of Resilience",
        body: "Conventional weapons are useless against compound interest and sciatica. To survive, Subjects wield the three sacred relics of midlife: scalding dark-roast Coffee, weaponized Dad Jokes spoken loud enough to stun a room, and the hard-earned psychological boundary of simply saying 'No.' Every crisis you overcome drops crystallized Wisdom Gems and tax-deferred 401(k) Coins that persist across runs until your pension finally vests."
      }
    ]
  },

  subjects: {
    officeWorker: {
      id: "officeWorker",
      code: "SUBJECT #01 // DEPT: CUBICLE OPS",
      name: "The 9-to-5er",
      realName: "Arthur 'Artie' Pendelton (Age 40)",
      icon: "☕",
      archetype: "Senior Spreadsheet Wrangler & Breakroom Veteran",
      backstory: "Survived twelve corporate restructurings by carrying a manila folder and looking mildly stressed in hallways. On his 40th birthday, the 4th-floor espresso machine achieved singularity and bonded to his right hand. He has 1,400 unread emails, a favorite mug nobody is allowed to touch, and a calm determination to make it to 5:00 PM.",
      relic: "☕ Hot Coffee Splash (Evolves with 😴 Good Night's Sleep -> ⚡☕ Cold Brew Concentrate)",
      edge: "Balanced baseline stats. Reliable dark-roast arcs that melt paper invoices before they turn overdue.",
      quote: '"Per my last email, I will be surviving until 5:00 PM or Age 80, whichever comes first."'
    },
    photographer: { // internal id kept for old saves; this is The Soccer Dad
      id: "photographer",
      code: "SUBJECT #02 // DEPT: SATURDAY SIDELINES",
      name: "The Soccer Dad",
      realName: "Dale 'Coach' Mercer (Age 43)",
      icon: "⚽",
      archetype: "Folding-Chair Veteran & Orange-Slice Logistics Lead",
      backstory: "Has spent every Saturday for nine years pacing a muddy sideline with a travel mug and a whistle he was never asked to bring. Years of yelling encouragement at under-10s and keeping the snack schedule alive unlocked a weaponized Dad Joke Aura so potent it physically blasts back oncoming paperwork.",
      relic: "😂 Dad Joke Aura + ☕ Coffee (Evolves with 👓 Reading Glasses -> 🌩️😂 Unhinged Pun Storm)",
      edge: "Starts with Dad Joke unlocked, +25% wider acoustic blast radius, and +12% faster sideline footwork.",
      quote: '"Hustle back on defense! Also, did you hear about the claustrophobic astronaut? He just needed a little space."'
    },
    gradStudent: {
      id: "gradStudent",
      code: "SUBJECT #03 // DEPT: NIGHT SCHOOL",
      name: "The Grad Student at 45",
      realName: "The Dual-Career Night-Owl (Age 45)",
      icon: "🎓",
      archetype: "Full-Time Professional, Seminar Scholar & Boundary Architect",
      backstory: "Decided that working a full-time career wasn't quite intense enough, so they enrolled in graduate school at 45. Powered by late-night study sessions, peer-reviewed PDFs, and zero remaining patience for pointless committee meetings, they mastered the rarest superpower in adult life: looking a calendar invite dead in the eye and saying 'No.'",
      relic: '🛑 The Word "No." + ☕ Coffee (Evolves with 👟 Comfortable Shoes -> 🛡️🛑 Healthy Boundaries)',
      edge: 'Starts with the "No." repulsor shockwave, 10% faster ability cooldowns, and +50% Wisdom Gem magnet range.',
      quote: '"I have a paper due at midnight and a staff meeting at eight. Your calendar invite has been declined."'
    },
    coldWarCowboy: {
      id: "coldWarCowboy",
      code: "SUBJECT #04 // DEPT: IT, BASEMENT LEVEL",
      name: "The Coldwar Cowboy",
      realName: "Ben (inspired by a real IT friend of the developer, since 2002)",
      icon: "🤠",
      archetype: "Help Desk Legend & Keeper of the Spare Parts Closet",
      backstory: "Has worked IT since the floppy disk was cutting edge, and never fully moved on. Keeps a drawer of cables nobody else can name, a pager that still buzzes, and a cowboy hat that has outlasted three CIOs.",
      relic: "💾 Floppy Disk (a boomerang; evolves into the Zip Drive)",
      edge: "Starts with the Floppy Disk and +2 max health. Once a run, at a quarter health, he turns it off and on again: clears the area and gets 40% back.",
      quote: '"Have you tried turning it off and on again? No? Then I will."'
    }
  },

  scenarios: [
    {
      id: "office",
      code: "SCENARIO I // AGES 40 TO 43",
      name: "🏢 The Open-Plan Office",
      subtitle: "The Cubicle Panopticon & Fluorescent Grind",
      lore: "An endless floor of low-partition grey cubicles where the thermostat is permanently locked at 63 degrees and someone is always reheating tilapia in the breakroom microwave. Utility bills and Reply-All chains drift between desks, while decorative potted ferns conceal emergency stashes of leftover conference-room pizza.",
      manifestations: [
        "💵 [BILL] Green Utility Invoices: Split into two fast red [LATE!] fees if ignored for 11 seconds.",
        "📞 [SPAM] Extended-Warranty Robo-Calls: Creep close, vibrate 'RING!', and rocket across the carpet.",
        "🍩 [DONUT] Pink-Frosted Breakroom Traps: Coat your shoes in sugar glaze, slowing movement by 32%.",
        "📨 [RE:RE:] 40-Person Reply-All Chains (Elite): Tanky inbox threads that drop 3 Gems + 2 Coins."
      ],
      survivalTip: "Smash printers, vending machines and potted plants for Pizza (+3 HP), Wisdom Gems and 401(k) Coins. They grow back."
    },
    {
      id: "hospital",
      code: "SCENARIO II // AGES 44 TO 49 · FOLLOWS YOU TO THE BREAK ROOM",
      name: "🏥 St. Deductible Hospital",
      subtitle: "The 3:00 AM Maternity & Triage Wing",
      lore: "The chapter of birth, growing families, and sudden midlife checkups! The terrazzo floor gleams under cyan emergency triage stripes while itemized out-of-network co-pays roll down the corridor. Between 2:00 AM and 5:00 AM, time loses all meaning as nursery monitors chime and cafeteria Jell-O slows your stride.",
      manifestations: [
        "🧾 [CO-PAY] & [DEDUCT!]: Itemized medical invoices that multiply if left unfiled.",
        "📟 [PAGER!] Emergency Corridor Pagers: Pause to beep before dashing straight down the triage lane.",
        "🍮 [JELL-O] Hospital Cafeteria Trays & [CRAMP!] Waiting-Room Vinyl Chair Spasms.",
        "👶 [3AM CRY] Sleepless Night Elites: High-HP waves that test your crowd-control perks."
      ],
      survivalTip: "Pair a Rank 2+ Weapon with its matching Passive perk before Age 50 so you unlock a Gold Evolution ahead of the Silver Fox decade!"
    },
    {
      id: "home",
      code: "SCENARIO III // AGES 50 TO 59 · FOLLOWS YOU TO THE SERVER ROOM",
      name: "🏡 Suburban Home & Yard",
      subtitle: "The Cul-de-Sac Crucible & LEGO Minefield",
      lore: "You finally bought the house! Unfortunately, the oak living room rug is a tactical minefield of barefoot LEGO bricks, the water heater just started making an expensive rhythmic knocking sound, and Common Core fractions homework is waiting at the dining table while the minivan carpool honks outside.",
      manifestations: [
        "🎒 [TUITION] Activity & Camp Fees + [LEGO!] Barefoot Plastic Caltrops.",
        "🏫 [SCHOOL] Automated Nurse/Attendance Calls + [JUICEBX] Sticky Fruit-Punch Spills.",
        "🚐 [CARPOOL] Double-Booked Soccer Runs + [NEWMATH] Common Core Word-Problem Elites."
      ],
      survivalTip: "Reaching Age 50 permanently unlocks the Age 50 Decade Checkpoint (+2 free starting perks on future runs)!"
    },
    {
      id: "social",
      code: "SCENARIO IV // AGES 60 TO 79 · FOLLOWS YOU TO THE WELLNESS CORNER",
      name: "🍻 The Social Courtyard",
      subtitle: "Adult Friendships & The 6:45 PM Cancellation",
      lore: "Navigating adult friendships in your sixties: it took eleven weeks and three group-chat polls to schedule one patio dinner with four friends, and three of them just texted 'So sorry, crazy week, raincheck??' at 6:45 PM. Meanwhile, the one acquaintance who ordered artisanal truffle tapas wants to split the check evenly.",
      manifestations: [
        "💳 [SPLIT$] Uneven Group Tabs + [FLAKE!] Last-Minute 6:45 PM Cancellations.",
        "📱 [TXT-47] Unmuted Group-Chat Notifications + [TAPAS] Overpriced Shared Plates.",
        "🥱 [9PM BED] Sudden 9:00 PM Bedtime Waves + [DRAMA] Patio Gossip Elites."
      ],
      survivalTip: "Use your 401(k) Coins in the Title Dossier Shop to max out Employer Match (+HP) and Roth IRA (+Damage) for the late-career gauntlets!"
    },
    {
      id: "senior",
      code: "SCENARIO V // AGES 80 TO 100 (FULL LIFE BONUS ERA)",
      name: "🌴 Sunset Palms Resort",
      subtitle: "The Golden Lanai & 6:00 AM Pickleball Arena",
      lore: "Congratulations on reaching Age 80 Full Retirement! Those who decline the quiet rocking chair enter the 20 Bonus Senior Rounds (Ages 80 to 100): a sun-drenched terracotta resort where custom golf carts drift around corners, the 3:00 PM Early-Bird Buffet triggers stampedes, and the 6:00 AM Pickleball League takes no prisoners.",
      manifestations: [
        "💊 [COPAY] Part-D Co-pays + [HOA$] Condo Special Assessments.",
        "☎️ [SCAM!] Grandkid Gift-Card Robo-Scams + [PRUNE] Early-Bird Buffet Trays.",
        "🦴 [HIP!] Rain-Predicting Hip Twinges + [BINGO] High-Stakes Bingo Hall Callers."
      ],
      survivalTip: "Look for Senior-exclusive perks like Executive Delegation and Titanium Knees to conquer Age 100 and claim the Centenarian Legend certificate!"
    }
  ],

  bosses: [
    {
      age: "AGE 45",
      name: "📋 The Annual Performance Review",
      stage: "🏢 The Lobby & Bullpen",
      lore: "A 30-HP sentient crimson HR binder that corners you between cubicles and demands you justify your Q3 synergy metrics. Drops a gold Tax-Free Bonus Chest on defeat."
    },
    {
      age: "AGE 52",
      name: "🏦 The 30-Year Adjustable Mortgage",
      stage: "🏡 Home life, fought in the Conference Rooms",
      lore: "A 70-HP monument of escrow clauses, closing costs, and surprise roof repairs. Slow and relentless, it tests whether you evolved your primary weapon."
    },
    {
      age: "AGE 60",
      name: "🏎️ The Midlife Crisis V8",
      stage: "🏎️ Executive Wing & Wellness Corner",
      lore: "A cherry-red two-seater convertible temptation with 130 HP and 118 top speed. It drifts across the good carpet trying to convince you that you definitely need a leather jacket."
    },
    {
      age: "AGE 70",
      name: "🏡 The HOA Board President",
      stage: "🍻 The Social Courtyard",
      lore: "Armed with a laminated clipboard, a brass ruler for measuring grass blades, and 210 HP of sheer neighborhood authority over trash-can placement."
    },
    {
      age: "AGE 80",
      name: "🏖️ The Mandatory Retirement Audit",
      stage: "🌴 Sunset Palms Gate",
      lore: "The 300-HP final boss of the standard career! Defeating it awards +15k 401(k) Coins and lets you choose between retiring at 80 or entering the 80-100 Senior Bonus Rounds."
    },
    {
      age: "AGE 90",
      name: "🏓 The 6:00 AM Pickleball Champion",
      stage: "🌴 Sunset Palms Resort",
      lore: "A 420-HP Senior Bonus super-boss wearing dual knee braces and a visor, patrolling the kitchen line with terrifying dink-shot precision."
    },
    {
      age: "AGE 100",
      name: "👑 Father Time (Centenarian Trial)",
      stage: "🌴 Sunset Palms Resort",
      lore: "Appears at Age 100.0! Touching or defeating Father Time at Age 100 crowns you a Centenarian Legend instead of ending your run in defeat."
    }
  ]
};

window.GAME_LORE = GAME_LORE;
