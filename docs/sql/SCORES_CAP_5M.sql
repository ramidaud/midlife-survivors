-- Nov 4, 2026: raise the leaderboard's score cap from 500,000 to 5,000,000.
-- Derek's real run (579,444: Midlife cleared, overtime to 80.1, Grad Student, Tax 2) was rejected by the old cap.
-- Run in Supabase: SQL Editor > New query > paste > Run.

alter table public.scores drop constraint scores_score_check;
alter table public.scores add constraint scores_score_check check (score >= 0 and score <= 5000000);

-- Put Derek's run on the board (values from the runs table, Nov 4 05:59 UTC).
insert into public.scores (name, score, age, start_age, character, version)
values ('Derek', 579444, 80.1, 40, 'gradStudent', '1.76.0 T2');
