Honestly, I'm not that familiar with Discord. To me, it seems like one of the million ways to chat with people that already exist, like Teams and messages and email and blah, blah, blah. The fact that it's kind of gamer focused is useful. But ultimately, I'm trusting my gut and what my students have to say about it being a good place to collaborate and evolve this game, and hopefully build a community.

That's what I'm really going after here. If that's where community is right now, that's where I want to be.

## Setting it up

Setting it up was super easy with help from Claude. The server has a handful of channels: #general for hanging out, #playtest-notes for bugs and "this is too hard," #art-and-ideas, and three channels the game fills in by itself: #changelog, #devlog and #stats.

## The game posts its own updates

![The #changelog channel: the Nov 4 roundup lists every build that day, from V. 1.76 to 1.91.](img/11-changelog.jpg "side")

Here's the trick. Discord lets you make a **webhook** for a channel: a private link where anything sent to it shows up as a post. The game's code lives on GitHub, and GitHub can run little jobs on a schedule or whenever something changes. So now:

- **Every evening**, GitHub rounds up that day's builds and posts them to #changelog.
- **When a memo goes live**, like this one, it lands in #devlog with its cover.
- **Every morning**, after the play-stats summary, the numbers go to #stats.
- **When new art comes in**, it goes up in #art-and-ideas.

The webhook links are kept as GitHub secrets, so they never sit in the public code. And GitHub remembers what it already posted, so nothing shows up twice.

![The #devlog channel, with the archive memos posted by the game.](img/11-devlog-channel.jpg "side")

The first time I saw the game post its own changelog and stats without me touching anything, I was thrilled. One less thing for me to worry about while I'm working on making the game better.

![The #art-and-ideas channel on my phone, with the key art gallery.](img/11-art-and-ideas-phone.jpg "side")

## Out in the open

![A morning #stats post: who played, how far they got, top killers, difficulty and lag.](img/11-stats.jpg "side")

The stats are the part I like most. Every morning you can see how many people played, how far they got, and what killed them. Group Chats are winning right now.

I love the idea of transparency, and of this being a potential learning tool for others who want to try to build a game. And community at the same time.

## What I hope you find there

Say someone finds the server six months from now. I want them to find a thriving community, and a way to check what's been done in the game and how we got there. I think that will be important for other people who want to try the same thing, or something similar, or even people trying to learn how to code, like myself. This has direct implications for what I'm doing in EMAT, and it's a really cool way to explore all that code can do.

Next for the server: your screenshots, your bug reports, maybe a weekly challenge. All of the above.

[Join the Midlife Survivors Discord.](https://discord.gg/E6N9j5tZe) Come say hi, tell me what's too hard, and watch the game update itself.
