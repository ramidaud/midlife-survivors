-- Midlife Survivors: handy stats queries. Paste one at a time into Supabase > SQL Editor and click Run.
-- Note: runs played before V. 1.30.1 aren't in this table. The leaderboards (scores_midlife, scores) go back further.

-- 1. The big picture: players, runs, and typical run length
select count(distinct player_id) as players,
       count(*) as runs,
       round(avg(duration_sec) / 60.0, 1) as avg_minutes,
       round(percentile_cont(0.5) within group (order by duration_sec)::numeric / 60.0, 1) as median_minutes,
       round(avg(age_reached)::numeric, 1) as avg_age_reached,
       max(score) as best_score
from runs;

-- 2. Players and runs per day
select date_trunc('day', created_at at time zone 'America/New_York')::date as day,
       count(distinct player_id) as players, count(*) as runs
from runs group by 1 order by 1 desc;

-- 3. Where runs end (age reached, in 5-year buckets)
select (floor(age_reached / 5) * 5)::int as age_bucket, count(*) as runs
from runs where outcome in ('died','cleared') group by 1 order by 1;

-- 4. What gets people (top killers)
select killer, count(*) as deaths from runs where outcome = 'died' group by 1 order by 2 desc limit 15;

-- 5. Phone vs laptop
select device, count(*) as runs, round(avg(age_reached)::numeric, 1) as avg_age, round(avg(duration_sec) / 60.0, 1) as avg_minutes
from runs group by 1;

-- 6. How each version is doing (did a balance change help?)
select version, count(*) as runs, round(avg(age_reached)::numeric, 1) as avg_age, round(avg(close_calls)::numeric, 1) as avg_close_calls
from runs group by 1 order by min(created_at) desc;

-- 7. Quit rate (closing the tab mid-run)
select outcome, count(*) as runs, round(100.0 * count(*) / sum(count(*)) over (), 1) as pct from runs group by 1;
