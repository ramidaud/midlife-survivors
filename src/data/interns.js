// The Interns (Nov 3): Rami's playtesters as office interns. Not playable. They walk over with
// coffee, snacks and small boosts, and later run the Lounge counter in the Break Room.
// Numbers from Grok's spec (docs/handoffs/grok-healing-spec.md, section 8). Lines are the playtesters' own.
window.INTERNS = {
  enabled: true,
  roster: [
    // Placeholder colors from Rami's photos (Nov 3): TJ in a gray beanie, glasses, black parka; Derek with dark curly hair, beard, glasses.
    { id: "tj", name: "TJ", title: "Coffee Runner", sheet: "assets/characters/intern-tj-v2.png", portrait: "assets/characters/portraits/intern-tj-on-break-v1.png", shirt: "#22263d", skin: "#5c3a26", hair: "#4a4f5c", glasses: true, beanie: true, pants: "#b0844f",
      lines: ["You're old enough to be my dad!", "Do you want Chipotle for lunch?", "What were the dinosaurs like?",
              "Oh big coffee guy huh?", "Another coffee today?", "I love my job!", "For my Manager!!!"] },
    { id: "derek", name: "Derek", title: "Snack Scout", sheet: "assets/characters/intern-derek-v2.png", portrait: "assets/characters/portraits/intern-derek-on-break-v2.png", shirt: "#22263d", skin: "#e0a98c", hair: "#2a1d15", glasses: true, beard: true,
      // Derek's own lines (Nov 3).
      lines: ["Hey man, here's your coffee", "I love my manager", "Do you want a bundt cake?", "Unc", "Hey you don't want to take damage"] }
  ],
  fleeLines: ["Nope!", "Ack! HR paperwork!", "Not in my job description!"],

  // Chase mode (Nov 4, Rami: "can we chase them? if we catch them we get a health boost and a shield buff").
  // An intern shows up on screen with a coffee and runs. Catch them for a heal plus a shield. mode: "deliver"
  // brings back the old walk-up hand-off.
  mode: "chase",
  chase: {
    spawnDist: [210, 290],      // how far from you they appear (on screen)
    speedMult: 0.8,             // run speed vs. your BASE speed, so speed upgrades make them easier to catch
    slowAfterPx: 380,           // if you fall this far behind, they ease off and taunt you...
    slowMult: 0.4,              // ...at this fraction of their speed
    catchRadius: 40,
    giveUpMs: 15000,            // then they get away
    healFrac: 0.15, healMin: 2, // the heal
    shieldHits: 2, shieldMs: 20000, // the shield: blocks your next 2 hits within 20 seconds
    // Catch one and they toss you a treat (Rami, Nov 4). Stronger than the old deliveries, but short.
    treats: {
      coffee:  { name: "DOUBLE SHOT",     speedMult: 1.30, durMs: 10000, text: "30% faster for 10 seconds", color: "#EF9347" },
      burrito: { name: "FOOD COMA POWER", damageMult: 1.30, durMs: 10000, text: "30% more damage for 10 seconds", color: "#C45C4B" },
      bundt:   { name: "OFFICE PARTY",    xpMult: 1.50, durMs: 12000, vacuumMs: 2500, text: "every gem flies to you, +50% XP for 12 seconds", color: "#F1B5BF" }
    },
    treatOdds: { tj: { coffee: 2, burrito: 2, bundt: 1 }, derek: { bundt: 3, coffee: 1, burrito: 1 } }, // "Do you want a bundt cake?"
    tauntLines: ["Catch me, Unc!", "Cardio counts as overtime!", "You'll never take me alive!"],
    escapeLines: ["Too slow!", "Back to my desk!", "Ha! Next time."]
  },

  delivery: {
    armAfterMs: 45000,          // nobody shows up in the first 45 seconds
    maxOnMap: 1,
    speedMult: 0.85,            // walks a bit slower than you
    handOffRadius: 70,
    waitMs: 4000,               // if you're mobbed, they wait this long, then leave it on the floor
    crowdRadius: 90, crowdCount: 5,
    fleeRadius: 26,             // an enemy this close sends them running
    cadenceByAge: [[40, 55000], [50, 75000], [58, 110000], [66, 140000]], // they get busier (rarer) as you age
    jitterFrac: 0.25,
    giveUpMs: 25000,            // can't reach you in time? they head back to their desk
    payloads: {
      snack:  { weight: 40, healFrac: 0.12, healMin: 2, label: "SNACK" },
      coffee: { weight: 30, speedMult: 1.18, durMs: 8000, label: "COFFEE" },
      focus:  { weight: 15, damageMult: 1.15, durMs: 8000, label: "FOCUS" },
      magnet: { weight: 15, vacuumMs: 2500, label: "GEM RUN" }
    }
  },

  lounge: {
    districtId: "breakroom",
    displayName: "The Lounge",
    browseRadius: 56,
    openMsPromotion: 50000,     // was 35 s; TJ couldn't find it in time (Nov 3)
    promotionAges: [45, 50, 55, 60],
    showArrowMs: 6000,
    bubblePushRadius: 160,
    priceRampAdd: 1,
    safety: { threatRadius: 180, closeIfEnemiesInRadius: 3, loiterMs: 12000, loiterPackAdd: 2, loiterPackMs: 15000 },
    catalog: [
      { id: "stalePastry",  name: "Stale Pastry",    price: 6,  stock: 2, healFlat: 3, text: "Heals 3. Still mostly pastry." },
      { id: "deskSaladBox", name: "Desk Salad Box",  price: 12, stock: 1, useSaladFrac: true, text: "Heals like a Desk Salad. No wilting." },
      { id: "coldBrewCup",  name: "Cold Brew Cup",   price: 10, stock: 1, speedMult: 1.20, durMs: 12000, text: "20% faster for 12 seconds." },
      { id: "loanerBadge",  name: "Loaner Badge",    price: 14, stock: 1, vacuumMs: 4000, text: "Pulls in every gem nearby." },
      { id: "quietHour",    name: "Quiet Hour Pass", price: 22, stock: 1, clearRadius: 220, text: "Small fry near you clock out early." },
      { id: "bandAidKit",   name: "First-Aid Kit",    price: 28, stock: 1, perRun: 1, healFrac: 0.28, healMin: 4, text: "Big heal. Once per run." },
    ],
    // Day One cart (Nov 5, Rami): for the first two minutes of every run (openMs), the Lounge rolls a cart into the Lobby
    // (the Break Room is still locked). It sells the Lounge-only weapons, while you still have free hands,
    // and perks that last the whole run. The Break Room counter later sticks to heals and quick buffs.
    cart: {
      // Nov 5 (Rami): it used to park next to you, so you'd shopped before its card even showed. Then it hid too well
      // (once in the locked manager's office). Now: somewhere in the Lobby, mostly bottom right before the office area,
      // a different spot each run, open for the first 2 minutes. All spots checked reachable from the start.
      openMs: 120000,
      spots: [[1100, 240], [900, 240], [1100, 80], [700, 240], [300, 560], [100, 560], [-300, 560]],
      minDistance: 700,         // never closer than this to where you start
      header: "THE LOUNGE CART · LOBBY",
      sign: "LOUNGE CART\nOPEN",
      catalog: [
        { id: "micDropBuy",   name: "🎤 Mic Drop",          price: 45, stock: 1, perRun: 1, weapon: "unlockMicDrop", text: "LOUNGE EXCLUSIVE weapon. Drop the mic, stun the room." },
        { id: "sayCheeseBuy", name: "📸 Say Cheese",        price: 40, stock: 1, perRun: 1, weapon: "unlockSayCheese", text: "LOUNGE EXCLUSIVE weapon. Derek's camera. Everyone freeze." },
        { id: "cushionBuy",   name: "🪑 Ergonomic Cushion", price: 25, stock: 1, perRun: 1, runMaxHp: 2, text: "+2 max health for this whole run. Lumbar approved." },
        { id: "beansBuy",     name: "🫘 Good Beans",        price: 30, stock: 1, perRun: 1, runSpeedMult: 1.08, text: "8% faster for this whole run. Single origin, obviously." },
        // Revive (Nov 5, Rami): one extra get-back-up for this run, on top of the 401(k) Shop's Second Opinion.
        { id: "emergencyContact", name: "🚑 Emergency Contact", price: 100, stock: 1, perRun: 1, runRevive: 1, text: "If a hit would end your run, get back up with half health. Once, this run." }
      ],
      lines: { open: "{name} parked the Lounge cart somewhere on this floor. Find it in the first 2 minutes.", shutter: "The cart's heading back to the Break Room. See you after your promotion." }
    },
    lines: {
      open: "{name} is on the Lounge register. Cash only.",
      buy: "Receipt is a vibe.",
      threat: "Customers only. That means Bills, apparently.",
      shutter: "Break's over. Back to the Bullpen.",
      leave: "Stay hydrated. Or don't. I'm hourly.",
      loiter: "Facilities: no sleeping in the Break Room."
    }
  }
};
