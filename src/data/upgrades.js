// Level-up choices (`src/data/upgrades.js`).
// Perks scale across the 40->80->100 playthrough using rank caps (`maxRank`), weapon rank prerequisites
// for Evolutions, and Mid/Late-Career Executive & Senior Tier perks!

function getRank(s, id) { return (s.perkRanks && s.perkRanks[id]) || 0; }
function addRank(s, id) {
  if (!s.perkRanks) s.perkRanks = {};
  s.perkRanks[id] = (s.perkRanks[id] || 0) + 1;
}

window.UPGRADES = [
  // ---- TIER 1: Coffee Splash Upgrades (Ranks 1 to 4) ----
  {
    id: "extraShot",
    name: "Extra Shot",
    maxRank: 4,
    text: "Coffee fires 18% faster.",
    when: s => getRank(s, "extraShot") < 4,
    apply: s => { addRank(s, "extraShot"); s.fireEveryMs = Math.max(160, Math.round(s.fireEveryMs * 0.82)); s.coffeeUp = true; s.coffeeRank = (s.coffeeRank || 0) + 1; }
  },
  {
    id: "darkRoast",
    name: "Dark Roast",
    maxRank: 4,
    text: "Coffee deals +1 damage per splash.",
    when: s => getRank(s, "darkRoast") < 4,
    apply: s => { addRank(s, "darkRoast"); s.damage += 1; s.coffeeUp = true; s.coffeeRank = (s.coffeeRank || 0) + 1; }
  },
  {
    id: "longPour",
    name: "Long Pour",
    maxRank: 3,
    text: "Coffee splashes fly 25% farther.",
    when: s => getRank(s, "longPour") < 3,
    apply: s => { addRank(s, "longPour"); s.range = Math.round(s.range * 1.25); s.coffeeUp = true; s.coffeeRank = (s.coffeeRank || 0) + 1; }
  },

  // ---- TIER 1: Secondary Weapon Unlocks & Ranks ----
  {
    id: "unlockJoke",
    name: "Unlock: Dad Joke",
    maxRank: 1,
    text: "Groan-worthy cringe aura damages nearby enemies.",
    when: s => !s.dadJoke,
    apply: s => { addRank(s, "unlockJoke"); s.dadJoke = true; }
  },
  {
    id: "louderGroan",
    name: "Louder Groan",
    maxRank: 4,
    text: "Dad Joke ring is 25% bigger and deals +1 damage.",
    when: s => s.dadJoke && getRank(s, "louderGroan") < 4,
    apply: s => { addRank(s, "louderGroan"); s.jokeRadius = Math.round(s.jokeRadius * 1.25); s.jokeDamage += 1; s.jokeUp = true; s.jokeRank = (s.jokeRank || 0) + 1; }
  },
  {
    id: "unlockNo",
    name: 'Unlock: "No."',
    maxRank: 1,
    text: "Teal shockwave shoves enemies back and damages them.",
    when: s => !s.wordNo,
    apply: s => { addRank(s, "unlockNo"); s.wordNo = true; }
  },
  {
    id: "firmBoundaries",
    name: "Firm Boundaries",
    maxRank: 4,
    text: '"No." reaches 22% farther, shoves harder, +1 damage.',
    when: s => s.wordNo && getRank(s, "firmBoundaries") < 4,
    apply: s => { addRank(s, "firmBoundaries"); s.noRadius = Math.round(s.noRadius * 1.22); s.noPush = Math.round(s.noPush * 1.3); s.noDamage += 1; s.noUp = true; s.noRank = (s.noRank || 0) + 1; }
  },

  // ---- TIER 1: Core Passives (Unlock Evolutions!) ----
  {
    id: "comfyShoes",
    name: "Comfortable Shoes",
    maxRank: 3,
    text: "Passive: Move 14% faster with arch support.",
    when: s => getRank(s, "comfyShoes") < 3,
    apply: s => { addRank(s, "comfyShoes"); s.speed = Math.round(s.speed * 1.14); s.hasShoes = true; }
  },
  {
    id: "goodSleep",
    name: "Good Night's Sleep",
    maxRank: 3,
    text: "Passive: ALL weapons fire 14% faster.",
    when: s => getRank(s, "goodSleep") < 3,
    apply: s => { addRank(s, "goodSleep"); s.cooldownMult *= 0.86; s.hasSleep = true; }
  },
  {
    id: "readingGlasses",
    name: "Reading Glasses",
    maxRank: 3,
    text: "Passive: Gem & Coin magnet reaches 35% farther.",
    when: s => getRank(s, "readingGlasses") < 3,
    apply: s => { addRank(s, "readingGlasses"); s.magnetRadius = Math.round(s.magnetRadius * 1.35); s.hasGlasses = true; }
  },

  // ---- TIER 2: MID-CAREER EVOLUTIONS (Requires Weapon Rank 2+ AND Matching Passive!) ----
  {
    id: "evoColdBrew",
    name: "EVOLVE: Cold Brew Concentrate",
    maxRank: 1,
    text: "Coffee Lv 2+ & Sleep: Fires 3 piercing espresso shots in a spread!",
    isEvolution: true,
    when: s => (s.coffeeRank || 0) >= 2 && s.hasSleep && !s.coldBrew,
    apply: s => { addRank(s, "evoColdBrew"); s.coldBrew = true; s.damage += 1; s.fireEveryMs = Math.max(140, Math.round(s.fireEveryMs * 0.78)); }
  },
  {
    id: "evoPunStorm",
    name: "EVOLVE: Unhinged Pun Storm",
    maxRank: 1,
    text: "Dad Joke Lv 2+ & Glasses: Giant rapid-fire cringe ring, +2 damage!",
    isEvolution: true,
    when: s => s.dadJoke && (s.jokeRank || 0) >= 2 && s.hasGlasses && !s.punStorm,
    apply: s => { addRank(s, "evoPunStorm"); s.punStorm = true; s.jokeRadius = Math.round(s.jokeRadius * 1.45); s.jokeDamage += 2; s.jokeEveryMs = Math.round(s.jokeEveryMs * 0.58); }
  },
  {
    id: "evoBoundaries",
    name: "EVOLVE: Healthy Boundaries",
    maxRank: 1,
    text: '"No." Lv 2+ & Shoes: Massive shockwave shoves 2x farther & heals +1 HP!',
    isEvolution: true,
    when: s => s.wordNo && (s.noRank || 0) >= 2 && s.hasShoes && !s.healthyBoundaries,
    apply: s => { addRank(s, "evoBoundaries"); s.healthyBoundaries = true; s.noRadius = Math.round(s.noRadius * 1.4); s.noPush = Math.round(s.noPush * 1.75); s.noDamage += 2; }
  },

  // ---- TIER 3: LATE-CAREER & SENIOR PERKS (Unlocks after Lv 6 / Age 50+ to scale into 80-100!) ----
  {
    id: "execDelegation",
    name: "Executive Delegation",
    maxRank: 4,
    text: "Senior Perk: ALL weapons deal +1 damage and fire 10% faster.",
    when: s => (s.coffeeRank || 0) >= 2 && getRank(s, "execDelegation") < 4,
    apply: s => { addRank(s, "execDelegation"); s.damage += 1; s.jokeDamage += 1; s.noDamage += 1; s.cooldownMult *= 0.90; }
  },
  {
    id: "titaniumKnees",
    name: "Titanium Knees",
    maxRank: 3,
    text: "Senior Perk: +4 Max HP, heal +4 HP, and +10% move speed.",
    when: s => (s.hasShoes || s.hasSleep) && getRank(s, "titaniumKnees") < 3,
    apply: s => { addRank(s, "titaniumKnees"); s.maxHp += 4; s.heal = 4; s.speed = Math.round(s.speed * 1.10); }
  },

  // ---- ALWAYS AVAILABLE SUSTAINABILITY PERK ----
  {
    id: "annualCheckup",
    name: "Annual Checkup",
    maxRank: 99,
    text: "+3 Max HP and immediately restore +4 HP.",
    apply: s => { addRank(s, "annualCheckup"); s.maxHp += 3; s.heal = 4; }
  }
];
