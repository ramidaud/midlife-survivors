// Discoverable items: found on the floor (from smashed plants, and rarely from enemies).
// Walk over one to use it right away. Tweak drop chances, durations and text here.
window.FIELD_ITEMS = {
  fannyPack: {
    name: "Fanny Pack",
    emoji: "👝",
    glow: 0xf5c542,
    text: "Fanny Pack! Every gem and coin on screen comes to you.",
    short: "EVERYTHING COMES TO YOU",
    weight: 5            // how often it's picked when an item drops
  },
  energyDrink: {
    name: "Energy Drink",
    emoji: "🥤",
    glow: 0x6be2ff,
    text: "Energy Drink! 35% faster, and nothing can touch you while you keep moving. 12 seconds.",
    short: "FAST + SHIELD WHILE MOVING · 12s",
    speedMult: 1.35,
    durMs: 12000,
    // Nov 5 (Rami): "a strong shield buff while you're running around". Every hit is blocked while you move
    // at least this fast; stand still and you're on your own.
    shieldMinSpeed: 60,
    weight: 4
  },
  ptoDay: {
    name: "PTO Day",
    emoji: "🌴",
    glow: 0x5fd39c,
    text: "PTO Day! Out of office. Everything on screen leaves (bosses stay).",
    short: "SCREEN CLEARED",
    weight: 2
  }
};

window.ITEM_DROPS = {
  fromPlant: 0.22,       // chance a smashed plant also drops an item
  fromEnemy: 0.006,      // chance a regular enemy drops one (0.6%)
  maxOnFloor: 2,         // never more than this many waiting on the floor
  lifeMs: 30000          // items vanish if you leave them for 30 seconds
};
