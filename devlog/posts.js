// The devlog's table of contents. Newest first.
// Keep this array in JSON style (quoted keys, no trailing commas): scripts/build_devlog.py reads it directly.
// draft: true hides a post until Rami approves it (preview drafts with devlog/?drafts=1).
// Optional fields: cover, teaser, changes[], nextUp, playUrl.
window.DEVLOG_POSTS = [
  {
    "slug": "04-the-long-way-to-coffee",
    "date": "2026-11-01",
    "title": "I took the long way to coffee.",
    "version": "V. 1.27.1",
    "draft": true,
    "cover": "img/04-long-way-cover-v1.jpg",
    "leadAlt": "Pixel-art cover illustration: the 9-to-5er takes the long way to coffee through the office, with Bills, a spam phone and a donut trailing him.",
    "teaser": "The art preview grows an atrium, side wings and a records annex with a lost binder. The map fills in as you walk.",
    "changes": ["Atrium, longer paths and side wings in the Campus preview", "Map reveals as you explore", "Brighter carpet, chair mats, coffee rings and a printer paper trail"],
    "nextUp": "See what happens when a crowd tries to get around those desks.",
    "playUrl": "https://ramidaud.github.io/midlife-survivors/art-test.html"
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
