-- Midlife Survivors: second leaderboard for Midlife mode (ages 40 to 65). Paste into Supabase > SQL Editor and press Run.
create table if not exists public.scores_midlife (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 16),
  score integer not null check (score between 0 and 500000),
  age numeric(5,2) not null check (age between 40 and 81),
  start_age integer not null default 40 check (start_age between 40 and 80),
  character text check (char_length(character) <= 32),
  version text check (char_length(version) <= 16)
);

-- Rules: anyone can READ scores and ADD a score. Nobody can edit or delete (except you, in the dashboard).
alter table public.scores_midlife enable row level security;
create policy "Anyone can read midlife scores" on public.scores_midlife for select to anon using (true);
create policy "Anyone can add a midlife score" on public.scores_midlife for insert to anon with check (true);

create index if not exists scores_midlife_score_idx on public.scores_midlife (score desc);
