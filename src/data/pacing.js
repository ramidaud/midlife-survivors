// Message pacing (design system A6, Nov 10, 2026). Spec: docs/design/design-system-v1.md, section 3.2.
// Tweak these numbers to change when things are allowed to start. Nothing here changes how anything looks.
window.MSG_PACING = {
  milestoneAges: [45, 50, 55, 60],  // the busy birthdays: bosses, promotions and cake all land around these
  clearYears: 0.6,                  // errands and the Lounge wait until you're this far from a milestone (before or after)
  holdErrandsForBoss: true,         // no new errand while a boss is on the floor
  holdLoungeForBoss: true,          // (the Lounge already waited for bosses; kept here so it's one list)
  holdSwarmsForBoss: true,          // swarm events (Tax Season, Reply-All...) wait until the boss is down
  swarmRetryMs: 5000,               // how often a held swarm checks again
  rewardsInTickerOnly: true,        // cake, treats, salad, buffs: the bottom bar only, never the headline under the HUD
  flavorQuietMs: 20000,             // flavor lines ("LIFE" after a promotion) wait for this much quiet in the bottom bar...
  flavorMaxWaitMs: 90000            // ...and are dropped if that never comes
};
