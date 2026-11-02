-- Midlife Survivors: anonymous play stats ("runs" table)
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run. Safe to run twice.
-- The game can only ADD rows. Nobody can read them from the game or the internet; you read them here in the dashboard.

create table if not exists public.runs (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  player_id     text    check (char_length(player_id) <= 40),           -- random ID per browser, not a person
  mode          text    check (char_length(mode) <= 16),                -- midlife or full
  character     text    check (char_length(character) <= 32),
  outcome       text    check (outcome in ('died','cleared','quit','restarted')),
  killer        text    check (char_length(killer) <= 40),              -- what ended the run
  start_age     real    check (start_age between 0 and 150),
  age_reached   real    check (age_reached between 0 and 150),
  duration_sec  integer check (duration_sec between 0 and 86400),       -- game time, pauses excluded
  score         integer check (score between 0 and 100000000),
  level         integer check (level between 0 and 1000),
  kills         integer check (kills between 0 and 10000000),
  close_calls   integer check (close_calls between 0 and 1000000),
  tax_bracket   smallint check (tax_bracket between 0 and 10),
  device        text    check (device in ('phone','desktop')),
  resumed       boolean default false,                                  -- continued a saved run
  version       text    check (char_length(version) <= 24)
);

alter table public.runs enable row level security;

drop policy if exists "anyone can add a run" on public.runs;
create policy "anyone can add a run" on public.runs for insert to anon with check (true);
-- (No select policy on purpose: the public key can add rows but never read them.)

grant insert on public.runs to anon;
