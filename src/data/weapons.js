// Weapon settings. Change a number, reload, and feel the difference.
window.WEAPONS = {
  coffeeSplash: {
    name: "Coffee Splash",
    fireEveryMs: 650,  // brisk auto-fire right from Level 1 so early Bills don't overwhelm you
    speed: 440,        // pixels per second the splash flies
    damage: 1,         // health removed per hit (a fresh Bill has 3 HP, so 3 splashes pay it off)
    range: 480,        // how far it flies before it evaporates, in pixels
    size: 12,
    color: 0x7b4a2a    // coffee brown
  },
  dadJoke: {
    name: "Dad Joke",
    fireEveryMs: 2200, // how often the punchline blast goes off (Grok weapon pass, Nov 2: was 2300)
    radius: 130,       // size of the groan circle, in pixels (was 110)
    damage: 2,         // hits EVERY Bill inside the circle (Nov 2, Rami: make it an attack weapon. Was 1)
    cringeMs: 240,     // enemies in the circle flinch for this long (was 650: it was mostly a stun)
    cringeMsEvo: 320,  // longer flinch once it evolves into Pun Storm
    pushSpeed: 70,     // and stagger back this fast (was 260, then 90; bosses ignore both). "No." owns real shoving
    // The punchline blast (Nov 2): flash, shockwave, rays and a few "HA!"s. Visual only.
    blast: { rays: 12, has: 3, shake: 0.0025, words: ["HA!", "HA!", "BA-DUM-TSS", "HEH", "GROAN"] },
    bonusEveryMs: 50000, // a bonus joke is told (and spoken) at most this often; jokes are also told right after you unlock or upgrade Dad Joke
    color: 0xe6c84f,   // cheesy yellow
    // Fallback jokes for any stage. Stage-specific jokes are in linesByStage below (from Rami's design doc).
    lines: [
      "Didn't scan? Must be free!",
      "Who touched the thermostat?!",
      "I'm not sleeping, I'm resting my eyes!",
      "Are we paying to air-condition the whole neighborhood?",
      "Let's rock and roll... right after my ibuprofen.",
      "Careful, that's load-bearing drywall!",
      "I know a guy who can fix that.",
      "Lefty loosey, righty... hang on.",
      "Back in a minute. Gotta check the gutters.",
      "That's a 'future me' problem."
    ],
    linesByStage: {
      office: [
        "Per my last email... and the twelve before that!",
        "The microwave has claims on that leftover.",
        "If you're free at 4:58, you're not free.",
        "Reply-all is a lifestyle, not a button.",
        "My standing desk is sitting today.",
        "This meeting could've been a calendar decline.",
        "Breakroom coffee: burnt, beloved, mandatory.",
        "I brought a mug. Do not touch the mug.",
        "Synergy? I thought we fired synergy.",
        "Parking garage cardio counts as steps!"
      ],
      hospital: [
        "Out-of-network is just Latin for surprise.",
        "The pager knows when you sit down.",
        "Jell-O is not a personality, but it's dinner.",
        "3 AM: baby's fine. I'm negotiating with time.",
        "Copay first, existential dread second.",
        "Vinyl chairs: where backs go to complain.",
        "We packed the bag. Twice. Still forgot the charger.",
        "Sleep is a rumor we tell coworkers."
      ],
      home: [
        "LEGO: the original home security system.",
        "Carpool math beats Common Core math.",
        "The water heater knocks in Morse for money.",
        "Homework help: I too am discovering fractions.",
        "Snack schedule is my magnum opus.",
        "Yard work: where weekends go to retire.",
        "We own a house! The house also owns us.",
        "Lost a sock. Gained a mystery.",
        "Thermostat wars: Geneva Conventions apply."
      ],
      social: [
        "Rain check #4 still counts as friendship.",
        "Splitting the check evenly is a contact sport.",
        "Group chat: 47 unread, 0 plans.",
        "9 PM is the new midnight, and I honor it.",
        "Tapas: paying rent for three olives.",
        "Let's pencil that in... in disappearing ink.",
        "I muted the chat. It evolved.",
        "We should do this more often! (annually)"
      ],
      senior: [
        "Early-bird buffet: cardio before soup.",
        "Pickleball: where knees file HR complaints.",
        "HOA newsletter: gripping seasonal content.",
        "If we leave now, we beat the 4:00 seating.",
        "My hip is a better forecast than the app.",
        "Scam call? Ask them to hold for my attorney.",
        "Visor on. Knees braced. Let's dink.",
        "Father Time can take a number."
      ]
    },
    seniorLines: [
      "Turn that racket down, it's 4:15 PM!",
      "My left knee says a storm's rolling in!",
      "Is this covered by Medicare Part B?",
      "If we leave now, we'll beat the 3 PM dinner rush!",
      "Get off my meticulously edged Bermuda grass!"
    ]
  },
  // ---- New weapon types (Objective 10) ----
  remote: {
    name: "The TV Remote",   // boomerang: thrown out, flies back, hits both ways
    fireEveryMs: 1900,
    speed: 520,
    range: 300,
    damage: 2
  },
  spreadsheet: {
    name: "Spreadsheet",     // orbit: cells circle you and hit what they touch
    count: 2,
    radius: 78,
    damage: 1,
    spinPerSec: 3.4          // radians per second (Grok weapon pass: was 3.2)
  },
  podcast: {
    name: "Podcast at 2x",   // piercing line: fires the way you walk
    fireEveryMs: 1400,
    speed: 480,
    lifeMs: 1300,
    damage: 2,
    pierce: 3                // how many enemies one wave passes through
  },
  wordNo: {
    name: 'The Word "No."',
    fireEveryMs: 3200, // how often you put your foot down
    radius: 140,       // reach of the shockwave
    damage: 1,         // damage dealt
    pushPx: 110,       // how far Bills get shoved backward (Grok weapon pass: was 95)
    noPushCap: 520,    // shoves never go farther than this, even fully upgraded
    healthyHealEvery: 2, // Healthy Boundaries heals on every Nth pulse
    healthyHealAmt: 1,
    color: 0x6fd9c4    // calm boundary teal
  }
};
