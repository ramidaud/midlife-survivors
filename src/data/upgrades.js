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
    text: "Coffee flies 25% farther. Same strength; better reach.",
    when: s => getRank(s, "longPour") < 3,
    apply: s => { addRank(s, "longPour"); s.range = Math.round(s.range * 1.25); s.coffeeUp = true; s.coffeeRank = (s.coffeeRank || 0) + 1; }
  },

  // ---- TIER 1: Secondary Weapon Unlocks & Ranks ----
  {
    id: "unlockJoke",
    name: "Unlock: Dad Joke",
    maxRank: 1,
    text: "A punchline blast hits everything around you every couple of seconds.",
    when: s => !s.dadJoke,
    apply: s => { addRank(s, "unlockJoke"); s.dadJoke = true; }
  },
  {
    id: "louderGroan",
    name: "Louder Groan",
    maxRank: 4,
    text: "Dad Joke blasts 8% sooner, hits a wider crowd, and deals +1 damage.",
    when: s => s.dadJoke && getRank(s, "louderGroan") < 4,
    apply: s => { addRank(s, "louderGroan"); s.jokeRadius = Math.round(s.jokeRadius * 1.20); s.jokeEveryMs = Math.max(1000, Math.round(s.jokeEveryMs * 0.92)); s.jokeDamage += 1; s.jokeUp = true; s.jokeRank = (s.jokeRank || 0) + 1; }
  },
  {
    id: "unlockNo",
    name: 'Unlock: "No."',
    maxRank: 1,
    text: "A teal shockwave that shoves enemies back. Light damage, real space.",
    when: s => !s.wordNo,
    apply: s => { addRank(s, "unlockNo"); s.wordNo = true; }
  },
  {
    id: "firmBoundaries",
    name: "Firm Boundaries",
    maxRank: 4,
    text: '"No." reaches farther and shoves harder. Ranks 2 and 4 also add +1 damage.',
    when: s => s.wordNo && getRank(s, "firmBoundaries") < 4,
    apply: s => { addRank(s, "firmBoundaries"); const fr = getRank(s, "firmBoundaries"); s.noRadius = Math.round(s.noRadius * 1.22); s.noPush = Math.round(s.noPush * 1.35); if (fr === 2 || fr === 4) s.noDamage += 1; s.noUp = true; s.noRank = (s.noRank || 0) + 1; }
  },

  // ---- New weapon types (Objective 10) ----
  {
    id: "unlockRemote",
    name: "Unlock: The TV Remote",
    maxRank: 1,
    text: "Thrown at the nearest enemy, then flies back. Hits both ways.",
    when: s => !s.remote,
    apply: s => { addRank(s, "unlockRemote"); s.remote = true; }
  },
  {
    id: "universalRemote",
    name: "Universal Remote",
    maxRank: 4,
    text: "Remote deals +1 damage and flies 15% farther. Ranks 2 and 4 throw an extra remote. Odd ranks also throw a bit sooner.",
    when: s => s.remote && getRank(s, "universalRemote") < 4,
    apply: s => { addRank(s, "universalRemote"); const r = getRank(s, "universalRemote"); s.remoteDamage += 1; s.remoteRange = Math.round(s.remoteRange * 1.15); if (r === 2 || r === 4) s.remoteCount += 1; if (r === 1 || r === 3) s.remoteEveryMs = Math.round(s.remoteEveryMs * 0.95); s.remoteRank = r; }
  },
  {
    id: "unlockSheet",
    name: "Unlock: Spreadsheet",
    maxRank: 1,
    text: "Cells orbit you and damage anything they touch.",
    when: s => !s.sheet,
    apply: s => { addRank(s, "unlockSheet"); s.sheet = true; }
  },
  {
    id: "moreColumns",
    name: "More Columns",
    maxRank: 4,
    text: "Spreadsheet gets +1 cell, +1 damage and a wider orbit.",
    when: s => s.sheet && getRank(s, "moreColumns") < 4,
    apply: s => { addRank(s, "moreColumns"); s.sheetCount += 1; s.sheetDamage += 1; s.sheetRadius = Math.round(s.sheetRadius * 1.1); s.sheetRank = getRank(s, "moreColumns"); }
  },
  {
    id: "unlockPodcast",
    name: "Unlock: Podcast at 2x",
    maxRank: 1,
    text: "Fires the way you are facing and passes through crowds. Keep moving to aim.",
    when: s => !s.podcast,
    apply: s => { addRank(s, "unlockPodcast"); s.podcast = true; }
  },
  {
    id: "playbackSpeed",
    name: "Playback Speed",
    maxRank: 4,
    text: "Podcast fires 15% faster, +1 damage, passes through 1 more enemy.",
    when: s => s.podcast && getRank(s, "playbackSpeed") < 4,
    apply: s => { addRank(s, "playbackSpeed"); s.podEveryMs = Math.max(450, Math.round(s.podEveryMs * 0.85)); s.podDamage += 1; s.podPierce += 1; s.podRank = getRank(s, "playbackSpeed"); }
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
    id: "evoSmartTv",
    name: "EVOLVE: Smart TV",
    maxRank: 1,
    text: "Remote Lv 2+ & Comfortable Shoes: 3 big remotes, +2 damage, faster throws!",
    isEvolution: true,
    when: s => s.remote && (s.remoteRank || 0) >= 2 && s.hasShoes && !s.smartTv,
    apply: s => { addRank(s, "evoSmartTv"); s.smartTv = true; s.remoteCount = Math.max(s.remoteCount, 3); s.remoteDamage += 2; s.remoteEveryMs = Math.round(s.remoteEveryMs * 0.7); }
  },
  {
    id: "evoPivotTable",
    name: "EVOLVE: Pivot Table",
    maxRank: 1,
    text: "Spreadsheet Lv 2+ & Reading Glasses: 8 big cells, +2 damage!",
    isEvolution: true,
    when: s => s.sheet && (s.sheetRank || 0) >= 2 && s.hasGlasses && !s.pivotTable,
    apply: s => { addRank(s, "evoPivotTable"); s.pivotTable = true; s.sheetCount = Math.max(s.sheetCount, 8); s.sheetDamage += 2; s.sheetRadius = Math.round(s.sheetRadius * 1.2); }
  },
  {
    id: "evoBingeMode",
    name: "EVOLVE: Binge Mode",
    maxRank: 1,
    text: "Podcast Lv 2+ & Good Night's Sleep: fires 3 waves at once, pierces twice as far!",
    isEvolution: true,
    when: s => s.podcast && (s.podRank || 0) >= 2 && s.hasSleep && !s.bingeMode,
    apply: s => { addRank(s, "evoBingeMode"); s.bingeMode = true; s.podPierce *= 2; s.podDamage += 1; }
  },
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
    text: "Dad Joke Lv 2+ and Glasses: huge rapid punchline blasts, +2 damage, longer flinch.",
    isEvolution: true,
    when: s => s.dadJoke && (s.jokeRank || 0) >= 2 && s.hasGlasses && !s.punStorm,
    apply: s => { addRank(s, "evoPunStorm"); s.punStorm = true; s.jokeRadius = Math.round(s.jokeRadius * 1.45); s.jokeDamage += 2; s.jokeEveryMs = Math.round(s.jokeEveryMs * 0.58); }
  },
  {
    id: "evoBoundaries",
    name: "EVOLVE: Healthy Boundaries",
    maxRank: 1,
    text: '"No." Lv 2+ and Shoes: much bigger shove, +2 damage, and heal +1 HP on every other pulse.',
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
    apply: s => { addRank(s, "execDelegation"); s.damage += 1; s.jokeDamage += 1; s.noDamage += 1; s.remoteDamage += 1; s.sheetDamage += 1; s.podDamage += 1; s.cooldownMult *= 0.90; }
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
    maxRank: 3,
    text: "+3 Max HP and immediately restore +4 HP.",
    apply: s => { addRank(s, "annualCheckup"); s.maxHp += 3; s.heal = 4; }
  },

  // ---- BOOSTS (one-time effects). Offered when the regular cards run low, or now and then after 50. ----
  { id: "leftoverFriday", name: "Leftover Friday Pizza", maxRank: 6, isConsumable: true,
    text: "Heal 3 HP and pull in every gem and coin nearby.",
    apply: s => { addRank(s, "leftoverFriday"); s.heal = 3; window.itemEffect && window.itemEffect("fannyPack", true); } },
  { id: "ptoDayCard", name: "PTO Day", maxRank: 3, isConsumable: true,
    text: "Out of office: every regular enemy on screen leaves.",
    apply: s => { addRank(s, "ptoDayCard"); window.itemEffect && window.itemEffect("ptoDay", true); } },
  { id: "fannyPackCard", name: "Fanny Pack", maxRank: 4, isConsumable: true,
    text: "Every gem and coin on screen comes to you.",
    apply: s => { addRank(s, "fannyPackCard"); window.itemEffect && window.itemEffect("fannyPack", true); } },
  { id: "standingDesk", name: "Standing Desk", maxRank: 5, isConsumable: true,
    text: "Move 15% faster for 45 seconds.",
    apply: s => { addRank(s, "standingDesk"); window.startBuff && window.startBuff("speed", 1.15, 45000, "STANDING DESK"); } },
  { id: "calendarBlock", name: "Focus Block", maxRank: 5, isConsumable: true,
    text: "Blocked your calendar: +25% damage for 30 seconds.",
    apply: s => { addRank(s, "calendarBlock"); window.startBuff && window.startBuff("damage", 1.25, 30000, "FOCUS BLOCK"); } },
  { id: "hrSnack", name: "HR Appreciation Snacks", maxRank: 3, isConsumable: true,
    text: "+2 Max HP and heal 2. Someone brought the good granola bars.",
    apply: s => { addRank(s, "hrSnack"); s.maxHp += 2; s.heal = 2; } }
];

// Every card respects its maxRank (so Annual Checkup no longer shows up forever).
window.UPGRADES.forEach(u => {
  if (!u.id || !u.maxRank) return;
  const prev = u.when;
  u.when = s => getRank(s, u.id) < u.maxRank && (!prev || prev(s));
});
