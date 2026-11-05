// Hustle & Burning the Candle (Nov 5, idea from Kevin on Discord: "income tied to your hustle ... then the script
// flips around 55-60, where doing too much running around starts to burn the candle at both ends").
window.HUSTLE = {
  // Hustle Bonus: added to the end-of-run paycheck for what you did before the flip.
  bonusUntilAge: 55,
  pxPerCoin: 6000,        // 1k per 6,000 px walked (a full sprint from 40 to 55 is roughly 35k)
  perNewArea: 4,          // 4k for each office area you set foot in (Lobby, Bullpen, Break Room...)
  bonusCap: 60,
  // Burning the Candle: after this age, nonstop hustling wears you down. Pause now and then to catch your breath.
  candleFromAge: 55,
  fillPerSecMoving: 2.2,  // wear per second while moving (about 45 s of nonstop movement fills it)
  fillSpeedBuffMult: 2,   // twice as fast under a speed buff (Energy Drink, Cold Brew)
  energyDrinkAdd: 35,     // drinking an Energy Drink after 55 adds this much at once
  drainPerSecStill: 18,   // standing still drains it fast: 2-3 s takes off a big chunk
  drainPerSecSlow: 4,     // barely moving still drains a little
  full: 100, resetTo: 50, // when it fills: a Medical Bill shows up and the meter drops back to this
  medical: { hpMult: 2, damageAdd: 1, copay: 5, tint: 0xF1B5BF, label: "MEDICAL BILL" },
  lines: {
    flip: "Your doctor says slow down now and then. Nonstop hustling burns the candle at both ends.",
    warn: "Catch your breath: stand still for a second.",
    medical: "A Medical Bill found you. All those energy drinks add up.",
    copay: "COPAY -{n}k"
  }
};
