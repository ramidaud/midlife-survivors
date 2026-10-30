-- Midlife Survivors leaderboard table. Paste all of this into Supabase > SQL Editor and press Run.
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 16),
  score integer not null check (score between 0 and 500000),
  age numeric(5,2) not null check (age between 40 and 101),
  start_age integer not null default 40 check (start_age between 40 and 80),
  character text check (char_length(character) <= 32),
  version text check (char_length(version) <= 16)
);

-- Rules: anyone can READ scores and ADD a score. Nobody can edit or delete (except you, in the dashboard).
alter table public.scores enable row level security;
create policy "Anyone can read scores" on public.scores for select to anon using (true);
create policy "Anyone can add a score" on public.scores for insert to anon with check (true);

create index if not exists scores_score_idx on public.scores (score desc);
