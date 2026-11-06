# Stats: whose runs to leave out

Rami's own devices. Leave these player IDs out of every stats report (Supabase `runs`):
`where player_id not in (...)`. Don't delete their rows; his runs are still useful for debugging.

How to add a device: open https://ramidaud.github.io/midlife-survivors/?me=1 on it. That also turns off
GoatCounter for that browser. The card shows the device ID to send to Claude. `?me=0` undoes it.

| Player ID | Device | Added |
|---|---|---|
| twxxxtcqmvyqevm7 | Rami's Mac | Nov 5, 2026 |
| 1tou53humvyubmzb | Rami's iPad | Nov 5, 2026 |
| y43kg4uimvz48biq | Rami's iPhone | Nov 5, 2026 |

The morning stats report (scheduled task) leaves out every ID in this table, so add new devices here.

Not excluded on purpose: Ben (Taiwan). He's a real player.
