// Level-up choices. When you level up, 3 of these are picked at random.
// "when" (optional) controls whether a card can appear right now (e.g., unlock a weapon first, then power it up).
// Evolutions appear once you upgrade a weapon AND take its matching passive!
window.UPGRADES = [
  // ---- Coffee Splash (starting weapon) ----
  { name: "Extra Shot",         text: "Coffee fires 20% faster.",               apply: s => { s.fireEveryMs = Math.max(150, Math.round(s.fireEveryMs * 0.8)); s.coffeeUp = true; } },
  { name: "Dark Roast",         text: "Coffee does +1 damage.",                 apply: s => { s.damage += 1; s.coffeeUp = true; } },
  { name: "Long Pour",          text: "Coffee flies 30% farther.",              apply: s => { s.range = Math.round(s.range * 1.3); s.coffeeUp = true; } },

  // ---- Weapon 2: Dad Joke (expanding cringe ring) ----
  { name: "Unlock: Dad Joke",   text: "Groan-worthy aura hurts nearby Bills.",  when: s => !s.dadJoke, apply: s => { s.dadJoke = true; } },
  { name: "Louder Groan",       text: "Dad Joke ring is 30% bigger, +1 damage.", when: s => s.dadJoke,  apply: s => { s.jokeRadius = Math.round(s.jokeRadius * 1.3); s.jokeDamage += 1; s.jokeUp = true; } },

  // ---- Weapon 3: The Word "No." (knockback wave) ----
  { name: 'Unlock: "No."',      text: "Shockwave shoves Bills away from you.",  when: s => !s.wordNo,  apply: s => { s.wordNo = true; } },
  { name: "Firm Boundaries",    text: '"No." reaches 25% farther and shoves harder.', when: s => s.wordNo, apply: s => { s.noRadius = Math.round(s.noRadius * 1.25); s.noPush = Math.round(s.noPush * 1.35); s.noDamage += 1; s.noUp = true; } },

  // ---- Passives (always-on boosts, and keys to Evolutions!) ----
  { name: "Comfortable Shoes",  text: "Passive: Move 15% faster.",              apply: s => { s.speed = Math.round(s.speed * 1.15); s.hasShoes = true; } },
  { name: "Good Night's Sleep", text: "Passive: ALL weapons fire 15% faster.",  apply: s => { s.cooldownMult *= 0.85; s.hasSleep = true; } },
  { name: "Annual Checkup",     text: "+3 max HP, and heal 3.",                 apply: s => { s.maxHp += 3; s.heal = 3; } },
  { name: "Reading Glasses",    text: "Gem magnet reaches 40% farther.",        apply: s => { s.magnetRadius = Math.round(s.magnetRadius * 1.4); s.hasGlasses = true; } },

  // ---- EVOLUTIONS (Weapon Upgrade + Matching Passive) ----
  {
    name: "EVOLVE: Cold Brew Concentrate",
    text: "Coffee + Sleep: Fires 3 piercing espresso shots in a spread!",
    isEvolution: true,
    when: s => s.coffeeUp && s.hasSleep && !s.coldBrew,
    apply: s => { s.coldBrew = true; s.damage += 1; s.fireEveryMs = Math.max(140, Math.round(s.fireEveryMs * 0.75)); }
  },
  {
    name: "EVOLVE: Unhinged Pun Storm",
    text: "Dad Joke + Glasses: Huge double-speed cringe ring, +2 damage!",
    isEvolution: true,
    when: s => s.dadJoke && s.jokeUp && s.hasGlasses && !s.punStorm,
    apply: s => { s.punStorm = true; s.jokeRadius = Math.round(s.jokeRadius * 1.5); s.jokeDamage += 2; s.jokeEveryMs = Math.round(s.jokeEveryMs * 0.55); }
  },
  {
    name: "EVOLVE: Healthy Boundaries",
    text: '"No." + Shoes: Giant shockwave shoves twice as far and heals 1 HP!',
    isEvolution: true,
    when: s => s.wordNo && s.noUp && s.hasShoes && !s.healthyBoundaries,
    apply: s => { s.healthyBoundaries = true; s.noRadius = Math.round(s.noRadius * 1.45); s.noPush = Math.round(s.noPush * 1.8); s.noDamage += 2; }
  }
];
