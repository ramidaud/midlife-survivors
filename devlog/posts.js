// The devlog's table of contents. Newest first.
// Keep this array in JSON style (quoted keys, no trailing commas): scripts/build_devlog.py reads it directly.
// draft: true hides a post until Rami approves it (preview drafts with devlog/?drafts=1).
// Optional fields: cover, teaser, blurb (one or two short sentences for the title screen's memo note), changes[], nextUp, playUrl.
window.DEVLOG_POSTS = [
  {
    "slug": "11-where-community-is",
    "date": "2026-11-05",
    "title": "If that's where community is, that's where I want to be.",
    "version": "V. 2.0",
    "draft": true,
    "cover": "img/11-discord-key-art.jpg",
    "leadAlt": "The office mail room turned clubhouse: Rami with a coffee, little mail-bots dropping glowing envelopes into cubbies labeled #changelog, #devlog, #stats and #art-and-ideas, while TJ, Derek and the Coldwar Cowboy look on.",
    "blurb": "I still don't totally get Discord. But my students say it's where community is, so the game has a server now, and it keeps itself up to date.",
    "teaser": "The game got its own Discord, and it posts its own updates.",
    "changes": [
      "A Midlife Survivors Discord server, open to everyone",
      "The game posts its own changelog every evening",
      "New memos land in #devlog automatically",
      "Morning play stats in #stats, out in the open",
      "New art goes up in #art-and-ideas when it lands"
    ],
    "nextUp": "A minimap that fills in as you explore, then two new stages you can pick: the hospital and the home neighborhood. And Abdel's music.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "10-version-two",
    "date": "2026-11-04",
    "title": "This is starting to feel real.",
    "version": "V. 1.68 to 2.0",
    "draft": false,
    "cover": "img/10-key-art.jpg",
    "leadAlt": "3 a.m. on the couch: Rami in a hoodie with a burp cloth and a bottle, the V2 title screen on his laptop, the whole cast standing on the coffee table, and the twins asleep in their bassinet.",
    "blurb": "Between 3 a.m. feedings and Election Day, the game got a whole second version: new title art, lights, coworkers and a final boss you can't beat.",
    "teaser": "Version two, built on paternity leave, one feeding at a time.",
    "changes": [
      "The Gold Watch: an unbeatable final boss you can only wind back until 65",
      "Spotlight cards for heroes, bosses, rooms, interns and big moments",
      "Dynamic lighting: weapons, enemies and bosses light up the dark",
      "A new HR Exit Interview with defeated heroes and smug killers",
      "Five new title scenes with the whole cast, drawn for phones too",
      "The Coldwar Cowboy, TJ and Derek, and a rack with a yellow note",
      "Faster on phones: lighter loading, smoother late game, instant Quick Retry",
      "GOTCHA!: chase down TJ and Derek for a heal, a shield and a treat",
      "Clock in with Google: your employee file follows you to any device",
      "Twice the gear: 13 new weapons and passives, 6 weapon and 6 passive slots, four play styles",
      "Retirement at 65 is a party: walk up to the clock-out station and punch out",
      "Coworkers with real bodies, dressed-up walls, and bosses that bounce off walls",
      "Safer runs: auto-save if your graphics drop out, plus lighter memory use",
      "Full Life bosses: the HOA President, the Retirement Audit, the Pickleball Champ, and Father Time at 100",
      "Sprint mode: years pass 2x faster for +50% coins, unlocked by beating the V8",
      "Balance, writing and art passes from Fable, Grok, Gemini and ChatGPT"
    ],
    "nextUp": "Next memo: the game got its own Discord, and it posts its own updates. After that: Abdel's music, a redone Lounge, and bosses for the Full Life years.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "09-my-friends-work-here-now",
    "date": "2026-11-03",
    "title": "My friends work here now.",
    "version": "V. 1.48 to 1.67",
    "draft": false,
    "cover": "img/09-cowboy-spotlight.jpg",
    "leadVideo": "img/09-cowboy-spotlight.mp4",
    "leadAlt": "A Spotlight card in the game: a spotlight opens, the band wipes in, the Coldwar Cowboy hops up and lands in a puff of dust, his name drops in letter by letter, and he says, \"Back in my day, a gig was a gig. Now hand me that disk.\"",
    "blurb": "Two of my student photographers became interns with their own Lounge, my friend Ben became a hero, and every big moment now gets a Spotlight card.",
    "teaser": "TJ found a bug, Derek and TJ became interns with their own Lounge, Ben became the Coldwar Cowboy, and the game and the devlog finally feel like one thing.",
    "changes": ["Fixed the second-run force field TJ found", "Birthday cake, the Desk Salad and interns who bring you coffee", "The Lounge: a counter shop in the Break Room after every promotion", "New hero: the Coldwar Cowboy (read 10 memos)", "Spotlight cards for bosses, rooms and new hires", "Lighting, age 50+ surprises and a retirement party"],
    "nextUp": "Derek's own intern lines, Ben's jokes, and more playtesting with the crew.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "08-promoted-four-times",
    "date": "2026-11-02",
    "title": "I got promoted four times before lunch.",
    "version": "V. 1.31 to 1.47",
    "draft": false,
    "cover": "img/08-promoted-key-art.jpg",
    "leadNote": "**Made with Grok** (image generation), from a prompt Claude wrote and Rami directed: 16-bit pixel art in the game's palette, the 9-to-5er raising his coffee under a PROMOTED banner as a garage door rolls up and golden light pours out. [Read the full prompt](art/prompts/08-key-art-grok.txt).",
    "leadAlt": "Pixel-art key art: the 9-to-5er strides out of a rolled-up office door under a PROMOTED banner, coffee mug raised, with golden light, server racks and a conference room behind him, a coworker's thumbs-up on the left and a Bill, a Spam Likely phone and a donut chasing him on the right.",
    "teaser": "Promotions open six new rooms, almost everything breaks, bosses fight back, a sneaky bug made enemies run away, every weapon got a job, and the whole office moves smoother.",
    "changes": ["Promotions at 45, 50, 55 and 60 open the Parking Lot, Break Room, Server Room, Conference Rooms, Executive Wing and Wellness Corner", "Breakable printers, vending machines and more, with loot", "Bigger bosses with real attacks", "Fixed enemies walking through walls and backing away", "Dad Joke is now an attack; every weapon has a role", "8-frame enemies and heroes, idle fidgets, animated coworkers, pixel icons"],
    "nextUp": "Two layout plans for a less repetitive office, with team pods, landmarks and coworkers who actually sit in their chairs.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "07-around-the-desk",
    "date": "2026-11-01",
    "title": "My office got jokes. Then my enemies got smarter.",
    "version": "V. 1.29 to 1.30.2",
    "draft": false,
    "cover": "img/07-around-the-desk.jpg",
    "leadAlt": "Before and after: an empty beige hallway on the left, and a break room with a booted car and a Hang in There poster on the right.",
    "teaser": "Corporate slang became furniture, the swarm learned to walk around desks, dodging got a streak meter, and real playtesters told me what was broken.",
    "changes": ["Office props: corporate slang taken literally, with jokes on approach", "Enemies walk around furniture (flow field)", "Close Calls: rewards and a streak meter for near misses", "Playtest fixes: center flash banners, a stronger Dad Joke", "Anonymous play stats"],
    "nextUp": "The new Lobby and Bullpen, with doors that unlock as you age.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "06-the-office-got-bigger",
    "date": "2026-11-01",
    "title": "The office got bigger. Somebody lost a binder.",
    "version": "V. 1.27.1",
    "draft": false,
    "cover": "img/04-long-way-cover-v1.jpg",
    "leadAlt": "Pixel-art cover illustration: the 9-to-5er takes the long way to coffee through the office, with Bills, a spam phone and a donut trailing him.",
    "teaser": "The art preview grows an atrium, side wings and a records annex with a lost binder. The map fills in as you walk.",
    "changes": ["Atrium, longer paths and side wings in the Campus preview", "Map reveals as you explore", "Brighter carpet, chair mats, coffee rings and a printer paper trail"],
    "nextUp": "See what happens when a crowd tries to get around those desks.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/devlog/art/"
  },
  {
    "slug": "05-buy-the-dev-a-coffee",
    "date": "2026-11-01",
    "title": "There's a coffee button now. It feels weird.",
    "version": "V. 1.28.7",
    "draft": false,
    "cover": "img/05-buy-the-dev-a-coffee.jpg",
    "leadAlt": "The Midlife Survivors main menu, with a cream Buy the Dev a Coffee button next to Devlog.",
    "teaser": "Asking for money feels weird, so here is exactly where it goes: more AI time to finish this game. Also, I am looking for people who want to help build it.",
    "changes": ["Buy the Dev a Coffee on the main menu and Game Over screen", "Ko-fi links in the devlog header, footer and About page", "Early tips go to AI usage to finish the game"],
    "nextUp": "Reviewing the first batch of real enemy art from ChatGPT.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "04-midlife-is-hard",
    "date": "2026-11-01",
    "title": "I could beat my own game standing still. So I hired a robot.",
    "version": "V. 1.24 to 1.27",
    "draft": false,
    "cover": "img/04-midlife-is-hard.jpg",
    "leadVideo": "img/04-midlife-is-hard.mp4",
    "leadAlt": "15 seconds at age 49: the Performance Review walks in, the swarm builds, and the Comfort Zone Tax kicks in.",
    "teaser": "Four minutes in, I could put the controller down. A test bot, a Grok review and a Comfort Zone Tax fixed that.",
    "changes": [
      "Enemies and bosses scale with your level",
      "Coins come in slowly; the 401(k) Shop is the long game",
      "Tax Bracket: optional difficulty with bigger rewards",
      "Comfort Zone Tax: 45 seconds without a hit brings more enemies"
    ],
    "nextUp": "Near-miss rewards for dodging, then the art pass.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "03-office-with-some-history",
    "date": "2026-11-01",
    "title": "The office has seen a few restructurings.",
    "version": "V. 1.24.1",
    "draft": false,
    "cover": "img/03-office-with-some-history.jpg",
    "leadAlt": "The first detailed office section in the separate Campus preview.",
    "teaser": "Accounts Payable gets desks with personality, a jammed printer, and a plant that needs PTO.",
    "changes": [
      "Three desk personalities in the Campus art test",
      "Carpet and wood floor patterns, warmer lighting",
      "Printer jam, filing cabinet, breakroom plant props"
    ],
    "nextUp": "Decide how much detail survives before the other departments get the same look.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "02-three-different-strides",
    "date": "2026-10-31",
    "title": "The office has people in it now. And they walk.",
    "version": "V. 1.23.4",
    "draft": false,
    "cover": "img/02-three-different-strides.jpg",
    "leadAlt": "The first walking pass for the three playable characters.",
    "teaser": "Walking sheets for the 9-to-5er, Soccer Dad, and Grad Student. Four directions, feet that stop when you do.",
    "changes": [
      "Four-direction walking sheets for all three playable characters",
      "Explore As switcher and direction gallery in the art test",
      "Step timing tied to distance traveled"
    ],
    "nextUp": "Judge the costumes and rhythm, then idle and combat poses.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  },
  {
    "slug": "01-never-made-a-game",
    "date": "2026-10-30",
    "title": "I've never made a game. Here's a green dollar sign chasing a square.",
    "version": "V. 0.1 to 1.8",
    "draft": false,
    "cover": "img/01-never-made-a-game.jpg",
    "teaser": "A photographer, Vampire Survivors, and the moment midlife became a bullet hell.",
    "changes": [
      "First playable square with touch and keyboard movement",
      "First Bill (green $) chase",
      "Top 10 midlife annoyances became the enemy roster"
    ],
    "nextUp": "Coffee Splash that fires on its own, and the first real Game Over.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/"
  }
];

// Hotspots for the key-art hero (percent of image width/height). Verified against office-key-art-v1.png.
window.DEVLOG_HOTSPOTS = [
  {
    id: "bill-left",
    label: "Bill",
    x: 29, y: 40, w: 9, h: 14,
    joke: "Paper-cut to death by a water bill.",
    tip: "Bills chase you. Pay them off fast or they split into Late Fees.",
    post: "01-never-made-a-game"
  },
  {
    id: "spam-likely",
    label: "Spam Likely",
    x: 71, y: 22, w: 10, h: 16,
    joke: "Answered a call about your car's extended warranty.",
    tip: "Spam Likely rings before it charges. Step aside.",
    post: "01-never-made-a-game"
  },
  {
    id: "late-night-donut",
    label: "Late-Night Donut",
    x: 86, y: 45, w: 10, h: 14,
    joke: "Ate four glazed donuts at 11:30 PM and entered a food coma.",
    tip: "Donuts slow you down if they touch you. Tempting, but no.",
    post: "03-office-with-some-history"
  },
  {
    id: "bill-right",
    label: "Bill (Final Notice)",
    x: 64, y: 63, w: 9, h: 14,
    joke: "Buried under 'FINAL NOTICE' envelopes.",
    tip: "Leave one unpaid and it becomes two athletic Late Fees.",
    post: "01-never-made-a-game"
  },
  {
    id: "you",
    label: "You (Age 40)",
    x: 50, y: 50, w: 8, h: 16,
    joke: "Coffee in hand. Tie in the wind. No meetings declined yet.",
    tip: "One input: move. Everything else attacks automatically.",
    post: "02-three-different-strides"
  }
];
