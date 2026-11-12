-- Nov 12, 2026: Full Life runs can go past 100 (Ben reached 103), but the Full Life board (public.scores)
-- only accepted ages up to 101, so those scores were turned away. Raise the age limit on both boards to 200 (one run already reached 144).
-- Run in Supabase: SQL Editor > New query > paste > Run.

alter table public.scores drop constraint if exists scores_age_check;
alter table public.scores add constraint scores_age_check check (age between 40 and 200);

alter table public.scores_midlife drop constraint if exists scores_midlife_age_check;
alter table public.scores_midlife add constraint scores_midlife_age_check check (age between 40 and 200);
