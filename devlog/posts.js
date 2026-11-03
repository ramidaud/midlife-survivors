// The devlog's table of contents. Newest first.
// Keep this array in JSON style (quoted keys, no trailing commas): scripts/build_devlog.py reads it directly.
// draft: true hides a post until Rami approves it (preview drafts with devlog/?drafts=1).
// Optional fields: cover, teaser, changes[], nextUp, playUrl.
window.DEVLOG_POSTS = [
  {
    "slug": "08-promoted-four-times",
    "date": "2026-11-02",
    "title": "I got promoted four times before lunch.",
    "version": "V. 1.31 to 1.47",
    "draft": false,
    "cover": "img/08-promoted-key-art.jpg",
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
