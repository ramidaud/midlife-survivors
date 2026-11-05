// Online leaderboard settings (Supabase). Paste your project's URL and "anon public" key here.
// The anon key is meant to be public: the database rules (set up once in Supabase) only allow
// reading scores and adding new ones. Nobody can edit or delete scores with it.
window.LEADERBOARD = {
  supabaseUrl: "https://pgxmvhabcgxvdnjtiect.supabase.co",
  supabaseAnonKey: "sb_publishable_zkBwMyrwywrriq0lJWTXTg_pIos5d5s",  // Supabase > Project Settings > API Keys: the "Publishable" key (sb_publishable_...) or the legacy "anon public" key
  table: "scores",
  topCount: 10, fetchLimit: 1000,

  // Score formula: years you survived count the most, then enemies beaten, then 401(k) coins earned.
  pointsPerYear: 1000,
  pointsPerKill: 2,
  pointsPerCoin: 5,
  // Nov 5 score pass (Rami: "all of the above"): reward skill inside 40-65 instead of raw swarm size.
  killPointsCapPerYear: 400,    // the first 400 kills each year of age earn full points...
  pointsPerKillOverCap: 0.25,   // ...after that a kill is worth a quarter point (late swarms used to drown everything)
  bossBonus: 5000,              // every boss you beat
  bossFastBonus: 5000,          // up to this much more for a quick kill
  bossFastSecs: 30,             // full fast bonus if the boss falls within 30 s of arriving
  bossSlowSecs: 120,            // no fast bonus after 2 minutes
  centennialBonus: 25000 // meeting Death at 100
};

// Fiscal-year seasons (Nov 5; Kevin's "corporate buyout" idea, Rami's OK). Each big version starts a new fiscal year:
// the board shows this year's scores by default (ALL-TIME is one tap away), and players with shop ranks get a
// one-time, optional Corporate Buyout. Add a season here when a big version ships (3.0 = Fiscal Year 3).
window.SEASONS = {
  list: [
    { id: "fy1", name: "Fiscal Year 1", start: "2026-10-30", note: "Version One" },
    { id: "fy2", name: "Fiscal Year 2", start: "2026-11-04", note: "Version Two" }
  ],
  buyoutRate: 0.5,  // the buyout pays back this share of everything you spent in the 401(k) Shop
  current() { const today = new Date().toISOString().slice(0, 10); return this.list.filter(s => s.start <= today).pop() || this.list[0]; }
};
