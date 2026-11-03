// The Interns (Nov 3): Rami's playtesters as office interns. Not playable. They walk over with
// coffee, snacks and small boosts, and later run the Lounge counter in the Break Room.
// Numbers from Grok's spec (docs/handoffs/grok-healing-spec.md, section 8). Lines are the playtesters' own.
window.INTERNS = {
  enabled: true,
  roster: [
    // Placeholder colors from Rami's photos (Nov 3): TJ in a gray beanie, glasses, black parka; Derek with dark curly hair, beard, glasses.
    { id: "tj", name: "TJ", title: "Coffee Runner", sheet: "assets/characters/intern-tj-v1.png", shirt: "#22263d", skin: "#5c3a26", hair: "#4a4f5c", glasses: true, beanie: true, pants: "#b0844f",
      lines: ["You're old enough to be my dad!", "Do you want Chipotle for lunch?", "What were the dinosaurs like?",
              "Oh big coffee guy huh?", "Another coffee today?", "I love my job!", "For my Manager!!!"] },
    { id: "derek", name: "Derek", title: "Snack Scout", sheet: "assets/characters/intern-derek-v1.png", shirt: "#22263d", skin: "#e0a98c", hair: "#2a1d15", glasses: true, beard: true,
      // Placeholder lines until Derek sends his own.
      lines: ["Got you something, boss.", "Is this part of the internship?", "They told me to bring you this.", "Don't tell HR I ran."] }
  ],
  fleeLines: ["Nope!", "Ack! HR paperwork!", "Not in my job description!"],

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
      { id: "bandAidKit",   name: "Band-Aid Kit",    price: 28, stock: 1, perRun: 1, healFrac: 0.28, healMin: 4, text: "Big heal. Once per run." }
    ],
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
