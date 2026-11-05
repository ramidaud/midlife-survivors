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
