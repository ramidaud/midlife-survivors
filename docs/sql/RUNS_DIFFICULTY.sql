-- Grok's difficulty check (Nov 3, 2026; Rami OK): extra anonymous fields per run.
-- Run once in the Supabase SQL editor (Project > SQL Editor > New query > paste > Run).
-- Then tell Claude, who flips DIFFICULTY_DETAIL to true in src/telemetry.js.
-- All columns are optional (nullable) and bounded, like the existing ones.
alter table public.runs
  add column if not exists view_zoom real check (view_zoom is null or (view_zoom >= 0 and view_zoom <= 10)),
  add column if not exists view_short_px integer check (view_short_px is null or (view_short_px >= 0 and view_short_px <= 10000)),
  add column if not exists touch_mode text check (touch_mode is null or char_length(touch_mode) <= 16),
  add column if not exists boss_alive_at_death text check (boss_alive_at_death is null or char_length(boss_alive_at_death) <= 32),
  add column if not exists age_at_first_group_chat real check (age_at_first_group_chat is null or (age_at_first_group_chat >= 0 and age_at_first_group_chat <= 150)),
  add column if not exists pings_hit integer check (pings_hit is null or (pings_hit >= 0 and pings_hit <= 100000)),
  add column if not exists meta_shop_ranks integer check (meta_shop_ranks is null or (meta_shop_ranks >= 0 and meta_shop_ranks <= 1000));
