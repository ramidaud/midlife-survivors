-- Coarse device details and smoothness per run (Nov 2). Run once in the Supabase SQL editor,
-- then tell Claude so it can switch DEVICE_DETAIL on in src/telemetry.js.
alter table runs
  add column if not exists form text,          -- phone / tablet / desktop
  add column if not exists os text,            -- iOS, iPadOS, Android, macOS, Windows, ChromeOS, Linux
  add column if not exists browser text,       -- Safari, Chrome, Firefox, Edge, Samsung
  add column if not exists screen_size text,   -- rounded to 100 px, e.g. 1200x800
  add column if not exists avg_fps int,        -- how smooth the run was
  add column if not exists slow_frame_pct int; -- % of frames under 40 fps
