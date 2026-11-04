// The loadout (Nov 4, Rami: "twice as many items... I want the users to have to make a choice about how they like to play").
// 13 weapons and 11 passives, but you can only carry 6 of each. Every item has a style: Healing, Shield, Offense or Defense,
// shown as a small colored badge on the level-up cards and the HUD.
// Weapon numbers live in src/data/weapons.js; the new weapons run in src/weapons_more.js.
// Loads right after src/data/upgrades.js and adds the new cards to UPGRADES.

window.LOADOUT = {
  weaponSlots: 6,   // Coffee Splash is always in slot 1, so you pick 5 more
  passiveSlots: 6,

  // The four play styles. Colors are from the devlog palette.
  cats: {
    healing: { label: "HEALING", color: "#83A89A", ink: "#171C35" },
    shield:  { label: "SHIELD",  color: "#3E7775", ink: "#FFF0CF" },
    offense: { label: "OFFENSE", color: "#EF9347", ink: "#171C35" },
    defense: { label: "DEFENSE", color: "#BFA8CF", ink: "#171C35" }
  },

  // id: the weapon. has: is it in your loadout? cards: every level-up card that belongs to it.
  weapons: [
    { id: "coffee",      cat: "offense", icon: "☕", evoIcon: "⚡", has: s => true,           evo: s => s.coldBrew,     cards: ["extraShot", "darkRoast", "longPour", "evoColdBrew"] },
    { id: "dadJoke",     cat: "offense", icon: "😂", evoIcon: "🌩️", has: s => s.dadJoke,     evo: s => s.punStorm,     cards: ["unlockJoke", "louderGroan", "evoPunStorm"] },
    { id: "wordNo",      cat: "defense", icon: "🛑", evoIcon: "🛡️", has: s => s.wordNo,      evo: s => s.healthyBoundaries, cards: ["unlockNo", "firmBoundaries", "evoBoundaries"] },
    { id: "remote",      cat: "offense", icon: "📺", evoIcon: "📡", has: s => s.remote,      evo: s => s.smartTv,      cards: ["unlockRemote", "universalRemote", "evoSmartTv"] },
    { id: "sheet",       cat: "defense", icon: "📊", evoIcon: "🧮", has: s => s.sheet,       evo: s => s.pivotTable,   cards: ["unlockSheet", "moreColumns", "evoPivotTable"] },
    { id: "podcast",     cat: "offense", icon: "🎧", evoIcon: "🍿", has: s => s.podcast,     evo: s => s.bingeMode,    cards: ["unlockPodcast", "playbackSpeed", "evoBingeMode"] },
    { id: "casserole",   cat: "healing", icon: "🍝", evoIcon: "🍲", has: s => s.casserole,   evo: s => s.potluck,      cards: ["unlockCasserole", "secondHelping", "evoPotluck"] },
    { id: "headphones",  cat: "shield",  icon: "🔇", evoIcon: "🔕", has: s => s.phones,      evo: s => s.dnd,          cards: ["unlockPhones", "activeNoise", "evoDnd"] },
    { id: "officeChair", cat: "offense", icon: "🪑", evoIcon: "💺", has: s => s.chair,       evo: s => s.swivel,       cards: ["unlockChair", "wd40", "evoSwivel"] },
    { id: "replyAll",    cat: "offense", icon: "📧", evoIcon: "📨", has: s => s.replyAll,    evo: s => s.memo,         cards: ["unlockReplyAll", "ccEveryone", "evoMemo"] },
    { id: "outOfOffice", cat: "defense", icon: "✈️", evoIcon: "🏖️", has: s => s.ooo,         evo: s => s.sabbatical,   cards: ["unlockOoo", "extendedLeave", "evoSabbatical"] },
    { id: "stickyNotes", cat: "offense", icon: "🗒️", evoIcon: "📋", has: s => s.sticky,      evo: s => s.postItWall,   cards: ["unlockSticky", "bulkPack", "evoPostItWall"] },
    { id: "thermostat",  cat: "defense", icon: "❄️", evoIcon: "🌀", has: s => s.thermo,      evo: s => s.polarVortex,  cards: ["unlockThermo", "crankAc", "evoPolarVortex"] }
  ],
  passives: [
    { id: "comfyShoes",     cat: "defense", icon: "👟", has: s => s.hasShoes },
    { id: "goodSleep",      cat: "offense", icon: "😴", has: s => s.hasSleep },
    { id: "readingGlasses", cat: "defense", icon: "👓", has: s => s.hasGlasses },
    { id: "titaniumKnees",  cat: "healing", icon: "🦿", has: s => getRank(s, "titaniumKnees") > 0 },
    { id: "execDelegation", cat: "offense", icon: "💼", has: s => getRank(s, "execDelegation") > 0 },
    { id: "multivitamin",   cat: "healing", icon: "💊", has: s => s.hasVitamin },
    { id: "mealPrep",       cat: "healing", icon: "🍱", has: s => s.hasMealPrep },
    { id: "cardigan",       cat: "shield",  icon: "🧥", has: s => s.hasCardigan },
    { id: "lumbar",         cat: "defense", icon: "🦴", has: s => s.hasLumbar },
    { id: "fitnessTracker", cat: "defense", icon: "⌚", has: s => s.hasTracker },
    { id: "bifocals",       cat: "offense", icon: "🧐", has: s => s.hasBifocals }
  ],
  // Cards outside the slots still get a style badge.
  extraCats: { annualCheckup: "healing", leftoverFriday: "healing", hrSnack: "healing", ptoDayCard: "defense", calendarBlock: "offense", standingDesk: "defense" }
};

// Card icons and labels for the new cards (merged into UPGRADE_META in src/ui.js).
window.LOADOUT_META = {
  "Unlock: Mom's Spaghetti":            { icon: "🍝", tag: "NEW WEAPON", rarity: "unlock" },
  "Second Helping":                     { icon: "🍽️", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Potluck":                    { icon: "🍲", tag: "✨ EVOLUTION", rarity: "evo" },
  "Unlock: Noise-Cancelling Headphones": { icon: "🔇", tag: "NEW WEAPON", rarity: "unlock" },
  "Active Noise Cancelling":            { icon: "🎚️", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Do Not Disturb":             { icon: "🔕", tag: "✨ EVOLUTION", rarity: "evo" },
  "Unlock: Rolling Office Chair":       { icon: "🪑", tag: "NEW WEAPON", rarity: "unlock" },
  "WD-40 the Wheels":                   { icon: "🛢️", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Executive Swivel":           { icon: "💺", tag: "✨ EVOLUTION", rarity: "evo" },
  "Unlock: Reply-All Storm":            { icon: "📧", tag: "NEW WEAPON", rarity: "unlock" },
  "CC Everyone":                        { icon: "👥", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Company-Wide Memo":          { icon: "📨", tag: "✨ EVOLUTION", rarity: "evo" },
  "Unlock: Out-of-Office Reply":        { icon: "✈️", tag: "NEW WEAPON", rarity: "unlock" },
  "Extended Leave":                     { icon: "📆", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Sabbatical":                 { icon: "🏖️", tag: "✨ EVOLUTION", rarity: "evo" },
  "Unlock: Sticky Notes":               { icon: "🗒️", tag: "NEW WEAPON", rarity: "unlock" },
  "Bulk Pack":                          { icon: "📝", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Wall of Post-its":           { icon: "📋", tag: "✨ EVOLUTION", rarity: "evo" },
  "Unlock: Thermostat Wars":            { icon: "❄️", tag: "NEW WEAPON", rarity: "unlock" },
  "Crank It to 62":                     { icon: "🌬️", tag: "UPGRADE", rarity: "common" },
  "EVOLVE: Polar Vortex":               { icon: "🌀", tag: "✨ EVOLUTION", rarity: "evo" },
  "Multivitamin":                       { icon: "💊", tag: "PASSIVE", rarity: "passive" },
  "Meal Prep Sunday":                   { icon: "🍱", tag: "PASSIVE", rarity: "passive" },
  "Cardigan":                           { icon: "🧥", tag: "PASSIVE", rarity: "passive" },
  "Lumbar Support":                     { icon: "🦴", tag: "PASSIVE", rarity: "passive" },
  "Fitness Tracker":                    { icon: "⌚", tag: "PASSIVE", rarity: "passive" },
  "Bifocals":                           { icon: "🧐", tag: "PASSIVE", rarity: "passive" }
};

// Starting numbers for the new weapons and passives. main.js calls this when a run starts (pension = shop damage ranks).
window.loadoutResetStats = (s, pension) => {
  const W = WEAPONS, p = pension || 0;
  Object.assign(s, {
    casserole: false, potluck: false, casRank: 0, casEveryMs: W.casserole.fireEveryMs, casRadius: W.casserole.radius, casDamage: W.casserole.damage + p,
    phones: false, dnd: false, phonesRank: 0, phonesRechargeMs: W.headphones.rechargeMs, phonesPopRadius: W.headphones.popRadius, phonesPopDamage: W.headphones.popDamage + p,
    chair: false, swivel: false, chairRank: 0, chairEveryMs: W.officeChair.fireEveryMs, chairSpeed: W.officeChair.speed, chairDamage: W.officeChair.damage + p,
    replyAll: false, memo: false, replyRank: 0, replyEveryMs: W.replyAll.fireEveryMs, replyChains: W.replyAll.chains, replyDamage: W.replyAll.damage + p,
    ooo: false, sabbatical: false, oooRank: 0, oooRadius: W.outOfOffice.radius, oooSlow: W.outOfOffice.slowMult,
    sticky: false, postItWall: false, stickyRank: 0, stickyEveryMs: W.stickyNotes.fireEveryMs, stickyCount: W.stickyNotes.count, stickyMs: W.stickyNotes.stickMs, stickyDamage: W.stickyNotes.damage + p,
    thermo: false, polarVortex: false, thermoRank: 0, thermoEveryMs: W.thermostat.fireEveryMs, thermoRadius: W.thermostat.radius, thermoFreezeMs: W.thermostat.freezeMs, thermoDamage: W.thermostat.damage + p,
    hasVitamin: false, regenMs: 0, hasMealPrep: false, foodMult: 1, hasCardigan: false, cardiganMs: 0,
    hasLumbar: false, armor: 0, hasTracker: false, dodge: 0, hasBifocals: false, crit: 0
  });
};

(() => {
  const U = window.UPGRADES, mult = (v, k, min) => Math.max(min || 0, Math.round(v * k));
  const cards = [
    // ---- Mom's Spaghetti (HEALING; was Mom's Casserole until Nov 4, Rami's call) ----
    { id: "unlockCasserole", name: "Unlock: Mom's Spaghetti", maxRank: 1,
      text: "Drops a steaming bowl of spaghetti every few seconds. It burns anything that walks in, and standing in it heals you.",
      when: s => !s.casserole, apply: s => { addRank(s, "unlockCasserole"); s.casserole = true; } },
    { id: "secondHelping", name: "Second Helping", maxRank: 4,
      text: "Spaghetti: a bigger bowl, +1 damage, and it comes out 10% sooner.",
      when: s => s.casserole, apply: s => { addRank(s, "secondHelping"); s.casRank++; s.casRadius = mult(s.casRadius, 1.15); s.casDamage += 1; s.casEveryMs = mult(s.casEveryMs, 0.9, 2000); } },
    { id: "evoPotluck", name: "EVOLVE: Potluck", maxRank: 1, isEvolution: true,
      text: "Spaghetti Lv 2+ and Meal Prep Sunday: two bowls at once, they stay hot longer, and they heal twice as fast.",
      when: s => s.casserole && s.casRank >= 2 && s.hasMealPrep && !s.potluck, apply: s => { addRank(s, "evoPotluck"); s.potluck = true; s.casDamage += 1; } },

    // ---- Noise-Cancelling Headphones (SHIELD) ----
    { id: "unlockPhones", name: "Unlock: Noise-Cancelling Headphones", maxRank: 1,
      text: "A bubble blocks the next hit, then pops in a wave that hurts everything nearby. It recharges.",
      when: s => !s.phones, apply: s => { addRank(s, "unlockPhones"); s.phones = true; } },
    { id: "activeNoise", name: "Active Noise Cancelling", maxRank: 4,
      text: "Headphones recharge 15% faster, and the pop is wider and hits +2 harder.",
      when: s => s.phones, apply: s => { addRank(s, "activeNoise"); s.phonesRank++; s.phonesRechargeMs = mult(s.phonesRechargeMs, 0.85, 4000); s.phonesPopRadius = mult(s.phonesPopRadius, 1.12); s.phonesPopDamage += 2; } },
    { id: "evoDnd", name: "EVOLVE: Do Not Disturb", maxRank: 1, isEvolution: true,
      text: "Headphones Lv 2+ and Cardigan: the bubble holds 2 hits, recharges twice as fast, and the pop is huge.",
      when: s => s.phones && s.phonesRank >= 2 && s.hasCardigan && !s.dnd, apply: s => { addRank(s, "evoDnd"); s.dnd = true; s.phonesRechargeMs = mult(s.phonesRechargeMs, 0.5, 3000); s.phonesPopRadius = mult(s.phonesPopRadius, 1.4); s.phonesPopDamage += 3; } },

    // ---- Rolling Office Chair (OFFENSE) ----
    { id: "unlockChair", name: "Unlock: Rolling Office Chair", maxRank: 1,
      text: "Launches a chair at the nearest enemy. It bowls through everything in its path.",
      when: s => !s.chair, apply: s => { addRank(s, "unlockChair"); s.chair = true; } },
    { id: "wd40", name: "WD-40 the Wheels", maxRank: 4,
      text: "Chair rolls 20% faster and farther, +1 damage, and launches 8% sooner.",
      when: s => s.chair, apply: s => { addRank(s, "wd40"); s.chairRank++; s.chairSpeed = mult(s.chairSpeed, 1.2); s.chairDamage += 1; s.chairEveryMs = mult(s.chairEveryMs, 0.92, 900); } },
    { id: "evoSwivel", name: "EVOLVE: Executive Swivel", maxRank: 1, isEvolution: true,
      text: "Chair Lv 2+ and Comfortable Shoes: three spinning chairs at once, +2 damage.",
      when: s => s.chair && s.chairRank >= 2 && s.hasShoes && !s.swivel, apply: s => { addRank(s, "evoSwivel"); s.swivel = true; s.chairDamage += 2; } },

    // ---- Reply-All Storm (OFFENSE) ----
    { id: "unlockReplyAll", name: "Unlock: Reply-All Storm", maxRank: 1,
      text: "An email zaps the nearest enemy, then jumps to 3 more.",
      when: s => !s.replyAll, apply: s => { addRank(s, "unlockReplyAll"); s.replyAll = true; } },
    { id: "ccEveryone", name: "CC Everyone", maxRank: 4,
      text: "Reply-All jumps to 1 more enemy, +1 damage, and sends 8% sooner.",
      when: s => s.replyAll, apply: s => { addRank(s, "ccEveryone"); s.replyRank++; s.replyChains += 1; s.replyDamage += 1; s.replyEveryMs = mult(s.replyEveryMs, 0.92, 800); } },
    { id: "evoMemo", name: "EVOLVE: Company-Wide Memo", maxRank: 1, isEvolution: true,
      text: "Reply-All Lv 2+ and Bifocals: two storms at once, and each one jumps 10 times.",
      when: s => s.replyAll && s.replyRank >= 2 && s.hasBifocals && !s.memo, apply: s => { addRank(s, "evoMemo"); s.memo = true; s.replyChains = Math.max(s.replyChains, 10); s.replyDamage += 1; } },

    // ---- Out-of-Office Reply (DEFENSE) ----
    { id: "unlockOoo", name: "Unlock: Out-of-Office Reply", maxRank: 1,
      text: "An \"Away\" field around you. Enemies inside move at about half speed.",
      when: s => !s.ooo, apply: s => { addRank(s, "unlockOoo"); s.ooo = true; } },
    { id: "extendedLeave", name: "Extended Leave", maxRank: 4,
      text: "The Out-of-Office field is 15% wider and slows a little more.",
      when: s => s.ooo, apply: s => { addRank(s, "extendedLeave"); s.oooRank++; s.oooRadius = mult(s.oooRadius, 1.15); s.oooSlow = Math.max(0.3, s.oooSlow - 0.05); } },
    { id: "evoSabbatical", name: "EVOLVE: Sabbatical", maxRank: 1, isEvolution: true,
      text: "Out-of-Office Lv 2+ and Lumbar Support: a much wider field that also deals 1 damage every second.",
      when: s => s.ooo && s.oooRank >= 2 && s.hasLumbar && !s.sabbatical, apply: s => { addRank(s, "evoSabbatical"); s.sabbatical = true; s.oooRadius = mult(s.oooRadius, 1.35); } },

    // ---- Sticky Notes (OFFENSE) ----
    { id: "unlockSticky", name: "Unlock: Sticky Notes", maxRank: 1,
      text: "Leaves sticky notes on the floor. Enemies that step on one get stuck, then it pops.",
      when: s => !s.sticky, apply: s => { addRank(s, "unlockSticky"); s.sticky = true; } },
    { id: "bulkPack", name: "Bulk Pack", maxRank: 4,
      text: "One more note per drop, +1 damage, and notes hold enemies longer.",
      when: s => s.sticky, apply: s => { addRank(s, "bulkPack"); s.stickyRank++; s.stickyCount += 1; s.stickyDamage += 1; s.stickyMs = mult(s.stickyMs, 1.15); } },
    { id: "evoPostItWall", name: "EVOLVE: Wall of Post-its", maxRank: 1, isEvolution: true,
      text: "Sticky Notes Lv 2+ and Fitness Tracker: drops a whole ring of notes around you, with bigger pops.",
      when: s => s.sticky && s.stickyRank >= 2 && s.hasTracker && !s.postItWall, apply: s => { addRank(s, "evoPostItWall"); s.postItWall = true; s.stickyDamage += 2; } },

    // ---- Thermostat Wars (DEFENSE, freezes) ----
    { id: "unlockThermo", name: "Unlock: Thermostat Wars", maxRank: 1,
      text: "Someone cranked the AC. Every few seconds a cold snap freezes everything near you.",
      when: s => !s.thermo, apply: s => { addRank(s, "unlockThermo"); s.thermo = true; } },
    { id: "crankAc", name: "Crank It to 62", maxRank: 4,
      text: "The cold snap is 15% wider, freezes 20% longer, and comes 8% sooner.",
      when: s => s.thermo, apply: s => { addRank(s, "crankAc"); s.thermoRank++; s.thermoRadius = mult(s.thermoRadius, 1.15); s.thermoFreezeMs = mult(s.thermoFreezeMs, 1.2); s.thermoEveryMs = mult(s.thermoEveryMs, 0.92, 3000); } },
    { id: "evoPolarVortex", name: "EVOLVE: Polar Vortex", maxRank: 1, isEvolution: true,
      text: "Thermostat Lv 2+ and Multivitamin: a huge cold snap that freezes twice as long and deals +2 damage.",
      when: s => s.thermo && s.thermoRank >= 2 && s.hasVitamin && !s.polarVortex, apply: s => { addRank(s, "evoPolarVortex"); s.polarVortex = true; s.thermoRadius = mult(s.thermoRadius, 1.4); s.thermoFreezeMs *= 2; s.thermoDamage += 2; } },

    // ---- New passives ----
    { id: "multivitamin", name: "Multivitamin", maxRank: 3,
      text: "Passive: heal 1 HP every 20 seconds (15, then 10, at higher levels).",
      apply: s => { addRank(s, "multivitamin"); s.hasVitamin = true; s.regenMs = [20000, 15000, 10000][getRank(s, "multivitamin") - 1]; } },
    { id: "mealPrep", name: "Meal Prep Sunday", maxRank: 3,
      text: "Passive: pizza, salad and spaghetti heal 50% more.",
      apply: s => { addRank(s, "mealPrep"); s.hasMealPrep = true; s.foodMult = 1 + 0.5 * getRank(s, "mealPrep"); } },
    { id: "cardigan", name: "Cardigan", maxRank: 3,
      text: "Passive: a free shield that blocks 1 hit, back every 30 seconds (25, then 20).",
      apply: s => { addRank(s, "cardigan"); s.hasCardigan = true; s.cardiganMs = [30000, 25000, 20000][getRank(s, "cardigan") - 1]; } },
    { id: "lumbar", name: "Lumbar Support", maxRank: 2,
      text: "Passive: take 1 less damage from every hit (never less than 1).",
      apply: s => { addRank(s, "lumbar"); s.hasLumbar = true; s.armor = getRank(s, "lumbar"); } },
    { id: "fitnessTracker", name: "Fitness Tracker", maxRank: 3,
      text: "Passive: 8% chance to dodge a hit completely. 10,000 steps!",
      apply: s => { addRank(s, "fitnessTracker"); s.hasTracker = true; s.dodge = 0.08 * getRank(s, "fitnessTracker"); } },
    { id: "bifocals", name: "Bifocals", maxRank: 3,
      text: "Passive: 8% chance for any hit to be a critical hit for double damage.",
      apply: s => { addRank(s, "bifocals"); s.hasBifocals = true; s.crit = 0.08 * getRank(s, "bifocals"); } }
  ];
  // Same maxRank rule as the original cards, then add them before the one-time boosts.
  cards.forEach(u => { const prev = u.when; u.when = s => getRank(s, u.id) < u.maxRank && (!prev || prev(s)); });
  const firstBoost = U.findIndex(u => u.isConsumable);
  U.splice(firstBoost < 0 ? U.length : firstBoost, 0, ...cards);

  // ---- Slots: a new weapon or passive only shows up while you have room for it ----
  const L = window.LOADOUT, byCard = {};
  L.weapons.forEach(w => w.cards.forEach(c => { byCard[c] = { kind: "weapon", item: w }; }));
  L.passives.forEach(p => { byCard[p.id] = { kind: "passive", item: p }; });
  L.held = s => ({ weapons: L.weapons.filter(w => w.has(s)), passives: L.passives.filter(p => p.has(s)) });
  L.catOf = up => { const b = up && byCard[up.id]; return b ? b.item.cat : (up && L.extraCats[up.id]) || null; };
  L.kindOf = up => { const b = up && byCard[up.id]; return b ? b.kind : null; };
  U.forEach(u => {
    const b = byCard[u.id]; if (!b) return;
    const isNewWeapon = b.kind === "weapon" && u.name.startsWith("Unlock:");
    const isPassive = b.kind === "passive";
    if (!isNewWeapon && !isPassive) return;
    const prev = u.when;
    u.when = s => {
      if (prev && !prev(s)) return false;
      const h = L.held(s);
      if (isNewWeapon) return h.weapons.length < L.weaponSlots;
      return b.item.has(s) || h.passives.length < L.passiveSlots; // ranking up a passive you own never needs a slot
    };
  });
})();
