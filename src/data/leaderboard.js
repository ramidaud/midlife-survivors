// Online leaderboard settings (Supabase). Paste your project's URL and "anon public" key here.
// The anon key is meant to be public: the database rules (set up once in Supabase) only allow
// reading scores and adding new ones. Nobody can edit or delete scores with it.
window.LEADERBOARD = {
  supabaseUrl: "https://pgxmvhabcgxvdnjtiect.supabase.co",
  supabaseAnonKey: "sb_publishable_zkBwMyrwywrriq0lJWTXTg_pIos5d5s",  // Supabase > Project Settings > API Keys: the "Publishable" key (sb_publishable_...) or the legacy "anon public" key
  table: "scores",
  topCount: 10,

  // Score formula: years you survived count the most, then enemies beaten, then 401(k) coins earned.
  pointsPerYear: 1000,
  pointsPerKill: 2,
  pointsPerCoin: 5,
  centennialBonus: 25000 // meeting Death at 100
};
