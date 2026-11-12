# Discord setup handoff (Codex)

Date: 2026-11-04. Server: **Midlife Survivors**.
Invite already published by the project: https://discord.gg/E6N9j5tZe
Server ID: `1566483955614621726`.

## Purpose

Rami confirmed this existing server is for players, playtest feedback, and development updates. Keep it small enough to maintain alongside 3-5 hours of weekly game work.

## Completed and verified live

- Created the three channels already promised in the existing welcome description: `#playtest-notes`, `#art-and-ideas`, and `#want-to-help`.
- Saved short topics for all three, covering useful bug details, warm humor and credit, and checking with Rami before starting substantial contributions.
- Enabled **Block Suspected Spam Content** in native AutoMod. It blocks messages and sends alerts to the existing private `#moderator-only` channel. Reopened AutoMod and verified the rule is on and the destination is saved.
- Kept the existing announcement posting restriction and denied creating public threads and sending messages in announcement threads. Saved and verified the denied thread settings.
- Put the original four house rules in the designated `#rules` topic. Kept its existing member posting restriction and denied public/private thread creation and thread replies. Final persistence check pending.

## Existing settings observed

- Community mode already enabled; six members at the initial audit.
- Default notifications already **Only @mentions**.
- Safety Setup showed raid protection **3 of 3** and DM/spam protection **5 of 5** enabled.
- Sensitive image filtering already applies to all members.
- The only role shown was `@everyone`. Its Administrator, Manage Server, Manage Roles, Manage Channels, Manage Webhooks, Kick, Ban, Timeout, and mass-mention permissions were off.
- `#moderator-only` is marked private in the channel list. No new staff access was granted.
- Existing welcome content was stored in a long topic, with no welcome message. The designated `#rules` channel was also empty.

## Channel map

| Channel | Purpose | Member use |
| --- | --- | --- |
| `#welcome-and-rules` | Start here, game/devlog links, channel guide | Read welcome |
| `#rules` | One place for the house rules | Read rules |
| `#announcements` | Meaningful build updates and playtest requests | Read/react |
| `#general` | Introductions, scores, screenshots, conversation | Chat |
| `#playtest-notes` | Bugs, difficulty, confusing moments, jokes | Post a note, follow up in a thread |
| `#art-and-ideas` | Art previews, sketches, office jokes, suggestions | Share/discuss |
| `#want-to-help` | Small contributions coordinated with Rami | Introduce skills and a small idea |
| `#moderator-only` | Private moderation alerts | Existing owner/staff only |
| General voice | Optional live playtesting or hanging out | Join when useful |

New channel links:
- Playtest: https://discord.com/channels/1566483955614621726/1567430731372957726
- Art: https://discord.com/channels/1566483955614621726/1567430885031018496
- Help: https://discord.com/channels/1566483955614621726/1567431092460326973

## Prepared messages, not yet sent

These are concrete drafts for Rami to approve before Codex posts messages to members. No mass pings or announcement cross-publication are needed.

### Welcome in #welcome-and-rules

**Welcome to Midlife Survivors. Your coffee fights back.**

I'm Rami, a photographer building my first video game: a Vampire Survivors-style game about surviving from 40 to 65. Bills, robocalls, late-night donuts and back twinges chase you.

**Play free:** https://ramidaud.github.io/midlife-survivors/
**Read the devlog:** https://ramidaud.github.io/midlife-survivors/devlog/

Start with #rules, then play a shift and tell us how it went.

- #announcements: new builds and playtest requests.
- #playtest-notes: too easy, too hard, a bug, or a joke that missed. All useful.
- #art-and-ideas: art previews, sketches, enemy ideas, and midlife annoyances.
- #want-to-help: introduce yourself if you'd like to help with art, sound, music, code, design, writing, or testing.
- #general: say hello, share your run, and hang out.

You don't need game-development experience to help. One honest reaction is useful.

### Rules in #rules

**House rules**

1. Be kind. Midlife is hard enough.
2. Roast the game, not each other.
3. No spam or self-promo without asking.
4. Keep it PG-13. Some of us have newborns on our laps.

For a moderation concern, message Rami privately rather than arguing in public.

### Pinned guide in #playtest-notes

**How did your shift go?**

A sentence is enough: what was fun, confusing, too easy, or too hard?

For a bug, copy what you know:
```text
Game version:
Device and browser:
Character and mode:
Age reached:
What I did:
What happened:
What I expected:
Screenshot or short clip, if available:
```

One issue per message helps. Use a thread to follow up on the same issue. Missing details are fine, please still report it. Crop personal information out of screenshots.

### Starter in #art-and-ideas

**What should be chasing us next?**

Share a sketch, an office absurdity, or a midlife annoyance that belongs in the game. Keep the humor warm and credit the people whose work you share. Ideas go on the list; the next build still gets one focused step at a time.

### Starter in #want-to-help

**Want to help make this thing?**

Say hello, tell us what you enjoy making, and suggest one small task. Art, music, sound, code, writing, design, and honest playtesting all help. Check with Rami before starting a big piece so we can agree on the brief and credit first.

## Lightweight weekly routine

- Twice a week, spend about 10 minutes acknowledging feedback and checking private AutoMod alerts. Mark reports with reactions such as eyes for seen and a check after a fix is verified. Do not promise a fix before investigating.
- For a meaningful build, post one short announcement: what changed, the play link, and one question about that change. Point replies to `#playtest-notes`.
- During the weekly project check-in, pick one useful report to investigate and record approved work in the roadmap. Discord is the conversation; project docs remain the record of decisions.
- Add channels, moderators, bots, or notification roles only when there is actual demand. No bot or paid upgrade is needed for the current setup.

## Remaining checks and follow-up

- [ ] Verify rules topic and thread restrictions persist after reopening.
- [ ] Make welcome read-only, give it a short topic, and consider renaming it `start-here` to separate it from `rules`.
- [ ] With Rami's posting authorization, send and pin the prepared welcome, rules, and three channel guides. Replace written channel names with real Discord channel mentions.
- [ ] Inspect verification level, Rules Screening, Community rules-channel assignment, and the existing published invite's expiry/destination. Preserve the existing invite.
- [ ] Test the join path and channel access with an ordinary member or Discord's member-role preview. Owner visibility alone does not prove member permissions.
- [ ] Verify the result on Rami's phone. Desktop audit does not substitute for a phone check.

## Project handoff to Claude

This is a Discord/community configuration session. No game code, runtime version, loader BUILD, or public website was changed. No game run, telemetry row, or leaderboard submission was generated.

Keep subsequent repository updates confined to this handoff unless Rami authorizes more. Claude should fold the final community status into ROADMAP, PROGRESS_LOG, LEARNING_NOTES, and GAME_DESIGN as relevant, and sync the Claude Project using its usual workflow. Do not mark the broader audience-growth/playtest objective complete just because the server is configured.

Learning note: a channel topic is a short sign above the conversation. A pinned message holds the fuller instructions. Keep topics brief and use pins for templates.

## Official references checked

- AutoMod: https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ
- Rules Screening: https://support.discord.com/hc/en-us/articles/1500000466882-Rules-Screening-FAQ
- Community requirements: https://support.discord.com/hc/en-us/articles/360047132851-Enabling-Your-Community-Server

The live UI is the evidence for this server's settings. Documentation explains feature behavior; it does not establish that a setting was saved here.

## 2026-11-08: Medical Bill turnaround (Codex)

- Built-in imagegen produced a five-view reference from `assets/enemies/medical-bill-v1.png`: front, left side, back, right side, three-quarter front. The corrected render makes the fifth view visibly turned.
- Deliverables: `assets/characters/merch/medical-bill-turnaround-v1.png` (480x112), `medical-bill-turnaround-v1-4x.png` (1920x448), original generated source, prompt and checks JSON alongside them.
- Export uses only the six requested character colors plus exact magenta. Each occupied view is 100 pixels high, starts at row 6 and ends at row 105. The enlargement repeats each logical pixel in a 4x4 block.
- Claude next: inspect the illustrated anatomy and base width against the brief, strip magenta, and package in `art/merch/` for Kevin. Baseline and outer height are normalized; exact head/body proportions, disc geometry, profile consistency and printability are not certified by this image export. The supplied Meshy GLB was left unchanged.
- Art handoff only. No game run, telemetry, code, runtime version or loader BUILD changes. Fold this art status into ROADMAP, PROGRESS_LOG, GAME_DESIGN and LEARNING_NOTES as relevant when accepting the handoff.
