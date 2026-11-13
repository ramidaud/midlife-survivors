-- Nov 12, 2026: Full Life runs can go past 100 (Ben reached 103), but the Full Life board (public.scores)
-- only accepted ages up to 101, so those scores were turned away. Raise the age limit on both boards to 200 (one run already reached 144).
-- Run in Supabase: SQL Editor > New query > paste > Run.

alter table public.scores drop constraint if exists scores_age_check;
alter table public.scores add constraint scores_age_check check (age between 40 and 200);

alter table public.scores_midlife drop constraint if exists scores_midlife_age_check;
alter table public.scores_midlife add constraint scores_midlife_age_check check (age between 40 and 200);

-- Nov 12, 10:11 PM (Rami's OK): Ben's Full Life run bounced before the cap was raised. Values from the runs table
-- (Nov 12 20:10 UTC, Coldwar Cowboy, age 104.0, 750,126, Tax 1). Added by hand so he doesn't have to reopen the game.
insert into public.scores (name, score, age, start_age, character, version)
values ('Coldwar Cowboy', 750126, 104.0, 40, 'coldWarCowboy', '2.29.11 T1');

-- Nov 12, 10:14 PM (Rami: "add Derek's too"): Derek's 579,444 Midlife run was added by hand on Nov 4 to the Full Life
-- table (public.scores), so it never showed on the Midlife board. Copied to the Midlife board. The Full Life copy is
-- still there until Rami says to remove it.
insert into public.scores_midlife (name, score, age, start_age, character, version)
values ('Derek', 579444, 80.1, 40, 'gradStudent', '1.76.0 T2');
