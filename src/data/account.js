// Optional accounts and cloud saves (Nov 4, 2026). Signing in is never required.
// Turn a sign-in button on here once its provider is set up in Supabase (Authentication > Sign In / Providers).
// The cloud save lives in the Supabase table player_saves; each player can only read and write their own row.
window.ACCOUNT = {
  enabled: false, // false until the Supabase setup is done (docs/handoffs/accounts-setup.md). Test anytime with ?accounts=1
  providers: {
    email: true,   // 6-digit code by email (needs the code in the Magic Link email template, and custom SMTP for real players)
    google: true,  // on since Nov 4 (Google Cloud project "Midlife Survivors")
    apple: false   // flip to true after the Apple provider is on (needs an Apple Developer account)
  },
  // supabase-js, pinned, loaded only when someone opens the account screen or is already signed in
  lib: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js",
  table: "player_saves",
  pushEveryMs: 20000,   // at most one cloud save every 20 seconds during a run (and always when you leave the page)
  // Everything that counts as "your file" besides the main save: name, sound, tips already seen, local scores
  prefKeys: ["ms-player-name", "ms-audio-vol", "ms-audio-mix", "ms-tips-seen-v1", "ms-spotlight-seen-v1", "ms-local-scores-v1", "ms-seen-version"]
};
