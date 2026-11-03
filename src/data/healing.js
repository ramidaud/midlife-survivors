// More ways to heal (Nov 3, TJ's idea, numbers from Grok's spec: docs/handoffs/grok-healing-spec.md).
// Every heal still goes through healAmt(), so the Tax Bracket trims it.
// If runs get too easy, turn these down first: fracNormal 0.18 -> 0.12, fracDecade 0.25 -> 0.18.
window.HEALING = {
  milestones: {             // birthday cake on the same 5-year beat as the 401(k) dividend
    everyYears: 5,
    firstAge: 45,
    fracNormal: 0.18,       // 45, 55: 18% of max health (at least 2)
    fracDecade: 0.25,       // 50, 60: 25% (at least 3)
    fracEnd: 0.22,          // 65: 22% (at least 3)
    minNormal: 2,
    minDecade: 3,
    endAge: 65,
    bannerBadge: "HAPPY BIRTHDAY",
    bannerNormal: "The breakroom sprang for cake. +{n} HP.",
    bannerDecade: "Decade cake. Someone remembered. +{n} HP.",
    bannerFull: "Full already. Save some frosting."
  },
  budget: {                 // for the interns later: they skip snacks when you're healthy
    skipInternAboveHpFrac: 0.75,
    windowMs: 20000,
    maxBigHealsInWindow: 2
  }
};
