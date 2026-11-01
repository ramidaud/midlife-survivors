// Single source of truth for Midlife Survivors Version Tracking & Patch Notes (`src/data/version.js`).
// Update `version`, `displayVersion`, `lastUpdated`, `build`, and prepend a `changelog` entry after each finished step!

const GAME_VERSION = {
  version: "1.28.17",
  displayVersion: "V. 1.28.17",
  lastUpdated: "Nov 1, 2026",
  codename: "Promotion Plan",
  build: 73,
  changelog: [
    {
      ver: "V. 1.28.17",
      date: "Nov 1, 2026",
      title: "Promotion Plan",
      highlights: ["Campus overview v2 adds irregular wings, starting-area and age-gate previews, plus a modular production plan in the Art Room. The playable world stays unchanged pending review."]
    },
    {
      ver: "V. 1.28.16",
      date: "Nov 1, 2026",
      title: "Parked Ideas",
      highlights: ["The Art Room has a nine-district campus proposal, measured route/plaza plan and literal idea Parking Lot concept for review. The playable world is unchanged pending approval."]
    },
    {
      ver: "V. 1.28.15",
      date: "Nov 1, 2026",
      title: "Two New Humans",
      highlights: ["The coffee devlog now includes the simplified pixel-art twins portrait in its Why now section."]
    },
    {
      ver: "V. 1.28.14",
      date: "Nov 1, 2026",
      title: "Join the Crew",
      highlights: [
        "There's a Midlife Survivors Discord now. Find it in Extras, or in the devlog. Come share playtest notes, see art early, or help build the game."
      ]
    },
    {
      ver: "V. 1.28.13",
      date: "Nov 1, 2026",
      title: "Out of the Art Room",
      highlights: ["All three animated heroes and the detailed Corporate Campus now appear in the main game, with looping office sections, grounded furniture and readable characters behind desks."]
    },
    {
      ver: "V. 1.28.12",
      date: "Nov 1, 2026",
      title: "The Inbox Moves",
      highlights: ["All ten regular enemies and chat pings now use animated pixel art with grounded shadows, original-art fallback and unchanged combat rules."]
    },
    {
      ver: "V. 1.28.11",
      date: "Nov 1, 2026",
      title: "Link Previews",
      highlights: [
        "Sharing any Midlife Survivors link (the game, devlog, posts, About, Art Room or the enemy review) now shows a proper preview card with art and a title."
      ]
    },
    {
      ver: "V. 1.28.10",
      date: "Nov 1, 2026",
      title: "A Whole Inbox of Trouble",
      highlights: [
        "All ten Batch 1 enemy species and the Group Chat projectile now have animated native sprite sheets: 11 sheets, 42 frames, with magenta backgrounds and the office palette.",
        "Review the full cast from the Art Room with pause, individual poses, native scale and floor comparisons. Art awaits visual review before combat integration."
      ]
    },
    {
      ver: "V. 1.28.9",
      date: "Nov 1, 2026",
      title: "Clocking Out",
      highlights: [
        "New Clocking Out brand mark: a cream clock with a teal rim and orange accent replaces the boxed MS initials across the devlog. Matching game/devlog favicons and a new home-screen icon are included.",
        "The phone header keeps the clock and game name together above the navigation links."
      ]
    },
    {
      ver: "V. 1.28.8",
      date: "Nov 1, 2026",
      title: "Back to the Studio",
      highlights: [
        "Restored the previous studio bio portrait and its share image at Rami's request. Both portrait revisions remain saved."
      ]
    },
    {
      ver: "V. 1.28.7",
      date: "Nov 1, 2026",
      title: "Coffee on the Menu",
      highlights: [
        "The Buy the Dev a Coffee button moved out of Extras and onto the main menu, next to Devlog."
      ]
    },
    {
      ver: "V. 1.28.6",
      date: "Nov 1, 2026",
      title: "Drawn Into the Game",
      highlights: [
        "Reworked the About portrait with chunkier game-art shapes, simpler shading, stronger navy outlines and the office key art's warm cream-and-teal lighting. Updated the bio and share image to the new revision."
      ]
    },
    {
      ver: "V. 1.28.5",
      date: "Nov 1, 2026",
      title: "Buy the Dev a Coffee",
      highlights: [
        "The game is free. If you'd like to support it, there's now a Ko-fi tip link in Extras and on the Game Over screen."
      ]
    },
    {
      ver: "V. 1.28.4",
      date: "Nov 1, 2026",
      title: "In the Studio",
      highlights: [
        "The devlog About page now features a new pixel-art portrait of Rami at his studio desk, based on his supplied photo. Updated the page's social preview image and accessible descriptions too."
      ]
    },
    {
      ver: "V. 1.28.3",
      date: "Nov 1, 2026",
      title: "The Bill Has Legs",
      highlights: [
        "Prepared the first Batch 1 enemy-art review asset: Bill, with four 48x48 walking frames, a looping preview and complete generation prompts. Awaiting visual approval before Art Room or production integration."
      ]
    },
    {
      ver: "V. 1.28.2",
      date: "Nov 1, 2026",
      title: "8:59 AM",
      highlights: [
        "New title screen art: you clocking in at 8:59 while the whole swarm presses against the lobby glass."
      ]
    },
    {
      ver: "V. 1.28.1",
      date: "Nov 1, 2026",
      title: "Before the Swarm",
      highlights: [
        "Prepared three 1920x1080 title-screen art concepts for review: a surrounding swarm, a whole-midlife panorama and the 8:59 office lobby. Selection and title-screen integration remain pending."
      ]
    },
    {
      ver: "V. 1.28.1",
      date: "Nov 1, 2026",
      title: "The Art Room",
      highlights: [
        "Extras > Art Room now opens the art preview inside the devlog, with the devlog's header and links."
      ]
    },
    {
      ver: "V. 1.28.0",
      date: "Nov 1, 2026",
      title: "One Office",
      highlights: [
        "The game and the devlog now share one look: the same palette, fonts and cream HR-memo headers.",
        "The title screen sits on the office key art, with a Devlog button right on the main menu.",
        "Teal replaces the old blue buttons, and the game has its own icon in your browser tab."
      ]
    },
    {
      ver: "V. 1.27.3",
      date: "Nov 1, 2026",
      title: "The Long Way, Illustrated",
      highlights: [
        "Prepared a 1536x1024 illustrated cover for the draft office-exploration devlog, with calm space on the left for a future title overlay. The post remains a draft."
      ]
    },
    {
      ver: "V. 1.27.2",
      date: "Nov 1, 2026",
      title: "Feet on the Floor",
      highlights: [
        "Campus furniture now has contact shadows fitted to each sprite's base, including printers, plants and cabinets. Chair mats, wheel wear and short cables connect desks to their floor space.",
        "Added a player foot shadow and richer carpet/wood texture. Paused resets and Visit Accounts keep the hero, shadow and health bar together."
      ]
    },
    {
      ver: "V. 1.27.1",
      date: "Nov 1, 2026",
      title: "The Long Way to Coffee",
      highlights: [
        "The separate Campus art preview is now 3072 by 2048 pixels, about 5.5 times its previous area, with seven areas, looping routes and five optional finds.",
        "Brighter carpet, floor wear, chair mats, paper trails and cream light pools give the office ground more character. The map remembers the paths you explore."
      ]
    },
    {
      ver: "V. 1.27.0",
      date: "Nov 1, 2026",
      title: "Comfort Zone Tax",
      highlights: [
        "Go 45 seconds without getting hit and the Comfort Zone Tax kicks in: bigger crowds for 20 seconds.",
        "Drop below 25% HP and enemies arrive a little slower until you recover.",
        "Neither happens in the first 90 seconds."
      ]
    },
    {
      ver: "V. 1.26.0",
      date: "Nov 1, 2026",
      title: "Tax Bracket",
      highlights: [
        "New on the title screen: Tax Bracket, an optional difficulty from 0 to 5 (Standard Deduction to Full Audit).",
        "Each bracket: enemies tougher and more numerous, hits harder, heals weaker. In return: more coins, more XP and a bigger score.",
        "Leaderboard shows a TAX badge on high-bracket scores. Three new achievements for retiring at Tax Bracket 1, 3 and 5."
      ]
    },
    {
      ver: "V. 1.25.0",
      date: "Nov 1, 2026",
      title: "Tax Season Prep",
      highlights: [
        "Harder mid-game: enemies thicken faster as you level, hits start hurting more at 48, and the safe window after a hit is shorter.",
        "Bosses are real fights now: more base HP, and they scale with your age as well as your level. Their HP tag shows the real number.",
        "Less free healing: +1 HP per level (was +2), smaller pizza heals, HR Snacks capped at 3, Healthy Boundaries heals every other pulse.",
        "Fixes: Roth IRA and Executive Delegation now boost Remote, Spreadsheet and Podcast too. Podcast pierce is exact. Holding a move key no longer scrolls the perk cards. Late-game hits no longer double-count age damage.",
        "The first 90 seconds stay gentle."
      ]
    },
    {
      ver: "V. 1.24.1",
      date: "Nov 1, 2026",
      title: "An Office With Some History",
      highlights: [
        "The Campus art test has new office floors, warm lighting accents, a jammed printer, filing cabinet and drooping plant.",
        "Visit Accounts jumps to the first detailed section. Native props and seamless floor tiles can be downloaded in the environment gallery."
      ]
    },
    {
      ver: "V. 1.24.0",
      date: "Oct 31, 2026",
      title: "Midlife Is Hard",
      highlights: [
        "Much harder. Enemies get tougher and more numerous as YOU level up, bosses scale with you, and hits hurt more after 52. Standing still no longer works.",
        "Coins come in slowly (a first run banks about 10k), so the 401(k) Shop is the long game.",
        "Three new shop upgrades: Continuing Ed (more XP), Side Hustle (more coins) and Second Opinion (get back up after a fatal hit).",
        "Extras > Reset Progress wipes your save for a true fresh start (tap twice)."
      ]
    },
    {
      ver: "V. 1.23.4",
      date: "Oct 31, 2026",
      title: "Three Different Strides",
      highlights: [
        "The art test now lets you walk as the 9-to-5er, Soccer Dad or Grad Student, with four-direction animation.",
        "Compare all three walking sheets in motion, pause a pose, and download their native sprite grids."
      ]
    },
    {
      ver: "V. 1.23.3",
      date: "Oct 31, 2026",
      title: "Three Desks, Three Personalities",
      highlights: [
        "The Campus art test now has tidy, paperwork-covered and working-lunch desks together in Accounts Payable.",
        "Compare the three in the new close-up gallery. They share a game frame and collision footprint."
      ]
    },
    {
      ver: "V. 1.23.2",
      date: "Oct 31, 2026",
      title: "Timer and Live Score",
      highlights: [
        "A run timer sits at the top center, above your age. It turns red in the last minute before your Retirement Party.",
        "Your score now counts up live in the top left."
      ]
    },
    {
      ver: "V. 1.23.1",
      date: "Oct 31, 2026",
      title: "Explore the Office Layout Study",
      highlights: [
        "Extras > Art Test now opens Corporate Campus: four departments, a revealing map and three optional discoveries.",
        "Switch Layout to return to the original art comparison. This separate study tests exploration before combat and finished scenery."
      ]
    },
    {
      ver: "V. 1.23.0",
      date: "Oct 31, 2026",
      title: "Achievements",
      highlights: [
        "29 achievements with midlife names, like Per My Last Email, The Sock Incident and Keep The Sedan. Each pays 401(k) coins.",
        "See them all in Extras > Achievements. New ones pop up in the lower third and on the Game Over screen.",
        "Full Life now unlocks with the Retirement Plan achievement (reach your Retirement Party in Midlife)."
      ]
    },
    {
      ver: "V. 1.22.0",
      date: "Oct 31, 2026",
      title: "Lost and Found",
      highlights: [
        "Items on the floor: Fanny Pack (pulls in every gem and coin), Energy Drink (faster for 12 seconds) and PTO Day (clears the screen). Smash plants to find them.",
        "New Boost cards when your regular perks run out: Leftover Friday Pizza, Standing Desk, Focus Block, HR Snacks and more. Annual Checkup no longer repeats forever.",
        "Dad Joke tells jokes that match where you are: office, hospital, home or the social scene.",
        "Over 50 new death lines, one set for every enemy and boss."
      ]
    },
    {
      ver: "V. 1.21.1",
      date: "Oct 31, 2026",
      title: "Reload Fix",
      highlights: [
        "Fixed controls sometimes not working until a second reload right after an update."
      ]
    },
    {
      ver: "V. 1.21.0",
      date: "Oct 31, 2026",
      title: "The 19-Minute Midlife",
      highlights: [
        "New main mode: Midlife, ages 40 to 65 in about 19 minutes. Three bosses, then your Retirement Party. Walk up and clock out to win.",
        "Full Life (40 to 100) is still here. It unlocks once you reach 65 in Midlife.",
        "Overtime: buy Delayed Retirement in the 401(k) Shop to add 5 more years per rank (up to 80).",
        "Each mode has its own leaderboard."
      ]
    },
    {
      ver: "V. 1.20.1",
      date: "Oct 31, 2026",
      title: "A Clearer Office Art Test",
      highlights: [
        "The new hero is about 15% larger in the art test.",
        "Desk collisions match their full floor space, with smoother movement around corners and believable overlap."
      ]
    },
    {
      ver: "V. 1.20.0",
      date: "Oct 31, 2026",
      title: "Playtest Fix Pack",
      highlights: [
        "Phones: steering works again after Retry. Perks need a second tap to confirm, so no more accidental picks.",
        "Dad Joke tells a joke when you unlock or upgrade it, plus an occasional bonus joke. Bubbles wrap and sit higher.",
        "Gentler first few minutes, then the usual ramp. Coins come in slower so the shop means something.",
        "Start is the big button; a saved run is a smaller Continue link. Perk labels are plain: New Weapon, Upgrade, Passive, Evolution.",
        "Leaderboard shows each player's personal best, with no top-10 cap. New Devlog link in Extras."
      ]
    },
    {
      ver: "V. 1.19.2",
      date: "Oct 31, 2026",
      title: "Try the New Office Art",
      highlights: [
        "Extras > Art Test opens a small office art preview with the new hero, Bill and workstation.",
        "Switch between current and new art at gameplay size, or zoom in for a closer look."
      ]
    },
    {
      ver: "V. 1.19.1",
      date: "Oct 30, 2026",
      title: "Online Leaderboard Is Live",
      highlights: [
        "Scores now post to one shared online leaderboard for everyone who plays.",
        "If the internet drops, your score is still saved on your device."
      ]
    },
    {
      ver: "V. 1.19.0",
      date: "Oct 30, 2026",
      title: "Scores & Leaderboard",
      highlights: [
        "Every run ends with a score: years survived, enemies beaten and 401(k) coins earned.",
        "Type a name and post it. No account needed; the game remembers your name.",
        "New Leaderboard button on the title screen. Online for everyone once it's connected; saved on this device until then."
      ]
    },
    {
      ver: "V. 1.18.0",
      date: "Oct 30, 2026",
      title: "Three New Weapons",
      highlights: [
        "The TV Remote: a boomerang thrown at the nearest enemy that hits both ways.",
        "Spreadsheet: cells orbit you and damage what they touch.",
        "Podcast at 2x: fires the way you walk and passes through crowds.",
        "3 new evolutions: Smart TV (Remote + Shoes), Pivot Table (Spreadsheet + Glasses), Binge Mode (Podcast + Sleep)."
      ]
    },
    {
      ver: "V. 1.17.0",
      date: "Oct 30, 2026",
      title: "Enemy Variety",
      highlights: [
        "3 AM Thought (age 50+): fades into a ghost you can't hit, then turns solid again.",
        "Calendar Invite (45+): locks a direction and charges straight through.",
        "Group Chat (60+): keeps its distance, shows 'typing...', then fires message pings. The first enemy that shoots.",
        "Math Homework (60+): circles you in a shrinking spiral.",
        "3 new swarms: Back-to-Back, 3 AM and Homework. New tips and death jokes for each."
      ]
    },
    {
      ver: "V. 1.16.1",
      date: "Oct 30, 2026",
      title: "Balance Pass: Fight Back",
      highlights: [
        "Bills take 2 hits. Enemies spawn about 25-40% faster at every age, and packs grow sooner.",
        "Enemies get tougher smoothly every year (+9%) instead of in big 4-year steps.",
        "Swarms grow with age, and Tax Season starts at 41. Standing still now catches up with you in about 30 seconds."
      ]
    },
    {
      ver: "V. 1.16.0",
      date: "Oct 30, 2026",
      title: "Intensity Curve & Swarm Events",
      highlights: [
        "Enemies now arrive in packs that grow each decade (1 at 40, up to 6 in your 90s), and the spawn rate ramps smoothly every year.",
        "The crowd limit grows with age: 60 on screen at 40, up to 200 at 100.",
        "New swarm events announced in the lower third: Tax Season, Robocalls, Donut Drop, Past Due, Reply All, Threw Out Back, and Everything (80+)."
      ]
    },
    {
      ver: "V. 1.15.0",
      date: "Oct 30, 2026",
      title: "A Full Life",
      highlights: [
        "1 real minute = 1 year. A full run from 40 to 100 takes about an hour (Save & Exit keeps your place).",
        "No more stop screen at 80: the retirement bonus (+15k, full health) pays out automatically and the run keeps going.",
        "The only win is meeting Death at 100. Dying earlier is a regular Game Over."
      ]
    },
    {
      ver: "V. 1.14.1",
      date: "Oct 30, 2026",
      title: "Steady Furniture",
      highlights: [
        "Fixed desks, plants and watercoolers flickering and jumping around while you walk.",
        "Furniture near the mezzanine platforms no longer blinks in and out."
      ]
    },
    {
      ver: "V. 1.14.0",
      date: "Oct 30, 2026",
      title: "Credits, Not Cameo",
      highlights: [
        "New Credits screen in Title > Extras.",
        "The second character is now The Soccer Dad (same stats: Dad Joke aura, wider range, faster feet). Old saves keep the unlock.",
        "Grad Student lore made generic."
      ]
    },
    {
      ver: "V. 1.13.0",
      date: "Oct 30, 2026",
      title: "Menu Fixes",
      highlights: [
        "Options, Lore and Patch Notes now open on top of the title screen instead of behind it.",
        "Game Over's 401(k) Shop button takes you straight to the shop.",
        "Lower third messages wait while a menu is open instead of expiring unseen.",
        "Pause menu opens on Resume and is shorter (Lore and Patch Notes live in Title > Extras).",
        "Top HUD no longer peeks out behind the title and Game Over screens."
      ]
    },
    {
      ver: "V. 1.12.0",
      date: "Oct 30, 2026",
      title: "Game Tips Switch",
      highlights: [
        "New Pause menu option: GAME TIPS on or off, for experienced players. Remembered between visits.",
        "Alerts, chapter cards and rewards still show when tips are off.",
        "Replaced the Visual Engine row while 3D is parked."
      ]
    },
    {
      ver: "V. 1.11.0",
      date: "Oct 30, 2026",
      title: "Clean Title Screen",
      highlights: [
        "The title screen is now: pick a character, press Start.",
        "The 401(k) Shop, Options and Extras (start age, location, lore, patch notes) moved behind three buttons.",
        "Visual engine buttons removed while 3D is parked."
      ]
    },
    {
      ver: "V. 1.10.0",
      date: "Oct 30, 2026",
      title: "Lower Third",
      highlights: [
        "New broadcast-style strip at the bottom that appears only when there's something to say: boss alerts, low HP, first-time tips, decade chapter cards and 401(k) dividends.",
        "One message at a time. Urgent messages jump the line; minor ones are skipped when it's busy. Tips show once ever.",
        "Bigger HP bar under the player. Fixed a rare error when restarting a run."
      ]
    },
    {
      ver: "V. 1.9.0",
      date: "Oct 30, 2026",
      title: "Clean Screen HUD",
      highlights: [
        "Replaced the bottom console with a minimal Vampire Survivors-style HUD: XP bar across the top, age in the middle, coins and loadout top-left, pause and mute top-right.",
        "Added a small HP bar that rides under your character.",
        "Parked the 3D camera views; the game stays in 2D for now."
      ]
    },
    {
      ver: "V. 1.8.22",
      date: "Oct 30, 2026",
      title: "Mobile Viewport Scaling (Portrait, Landscape & Safe-Area Support)",
      highlights: [
        "Added <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'> and iOS/Android safe-area insets so mobile browsers render at native device resolution.",
        "Optimized the Broadcast Lower-Third HUD for both Mobile Portrait (max-width: 768px) and Mobile Landscape (max-height: 520px), keeping over 78% of the arena open while the top Mobile Floating Dock handles Pause, Input, View, and Mute.",
        "Added smooth vertical touch scrolling (touch-action: pan-y; 94dvh max-height) and compact 3-column Subject Cards inside the Title Dossier and modals."
      ]
    },
    {
      ver: "V. 1.8.21",
      date: "Oct 30, 2026",
      title: "401(k) Compound Interest Scaling & 5-Year Survival Dividends",
      highlights: [
        "Added 6 Compound Interest Yield Tiers (1x Match -> 2x Vested -> 3x Seniority -> 4x Executive -> 5x Compound -> 6x Golden): the longer you survive in a run, the more each gold 401(k) Coin is worth (+1k up to +6k+ per coin!).",
        "Added automatic 5-Year Compound Dividends at Ages 45, 50, 55, 60, 65, 70, 75, 80+ that deposit scaling bonus payouts directly into your 401(k).",
        "Increased base coin drop rate (55% scaling up to 78%) and added guaranteed bonus coins to Potted Plants and Boss Chests."
      ]
    },
    {
      ver: "V. 1.8.20",
      date: "Oct 30, 2026",
      title: "World Mythos, Subject Backstories & Scenario Lore Archive",
      highlights: [
        "Created the official Midlife Survivors Mythos ('Form W-40: The Great Compounding'), Subject Dossiers (The 9-to-5er, The Senior Photographer, The Grad Student at 45), and 5 Life Scenario Backstories in src/data/lore.js.",
        "Added an interactive 4-tab Mythos & Lore Archive modal (#lore-modal) accessible from the Title Screen and Pause Menu.",
        "Added a live Subject Bio & Quote preview bar right under the Character Select cards on the Title Dossier."
      ]
    },
    {
      ver: "V. 1.8.19",
      date: "Oct 30, 2026",
      title: "Version Tracking Stamp & Release Notes Dossier",
      highlights: [
        "Added live Version & Last Updated stamp ('V. 1.8.19 // Last updated on: Oct 30, 2026') on the Title Dossier, Pause Screen, and Lower-Third HUD.",
        "Added interactive Release Notes & Version History modal (#changelog-modal) accessible right from the Title Screen version badge."
      ]
    },
    {
      ver: "V. 1.8.18",
      date: "Oct 30, 2026",
      title: "Broadcast Lower-Third HUD & Contextual Story/Help Engine",
      highlights: [
        "Moved the gameplay HUD to a bottom Broadcast Lower-Third Console (#hud-lower-third), leaving the upper 82% of the 3D viewport unobstructed.",
        "Added a live Contextual Story & In-Game Help Ticker (#hud-context-bar) that reacts in real time to Bosses, low HP, Potted Plant drops, Mezzanine high ground, and Life Chapters.",
        "Added the 'ON SCREEN' Situational Radar row (#hud-radar-row) tracking live enemy counts, nearby plants, and next milestone countdown."
      ]
    },
    {
      ver: "V. 1.7.17",
      date: "Oct 30, 2026",
      title: "Full 4-Device Input Mapping & Controls Configuration Screen",
      highlights: [
        "Mapped all 4 input devices for gameplay and menus: Keyboard, Mouse (Hold-Click Steer, Cursor Auto-Follow, Click-Drag), Touch (4 stick modes), and Game Controller.",
        "Built the Input & Controls Configuration Screen (#controls-modal) with live key/button listening and localStorage persistence."
      ]
    },
    {
      ver: "V. 1.7.16",
      date: "Oct 30, 2026",
      title: "5 Unlockable Life Environments & Telephoto vs. Horizon 3D Cameras",
      highlights: [
        "Added 5 unlockable Life Stages (src/data/stages.js): Office (Age 40), Hospital (Age 44), Suburban Home (Age 50), Social Courtyard (Age 60), and Senior Resort (Age 80).",
        "Replaced the simple checkerboard with 3-zone 512x512 procedural architecture floors and locked in FOV 16 deg Isometric vs. FOV 68 deg 3D Skyscraper Horizon cameras."
      ]
    },
    {
      ver: "V. 1.6.14",
      date: "Oct 30, 2026",
      title: "Age 80-100 Senior Bonus Rounds, Save States & Spoken Dad Jokes",
      highlights: [
        "Extended campaign to Age 80 with 20 Senior Bonus Rounds (Age 80-100), Decade Checkpoints, and mid-run browser auto-save.",
        "Added breakable Potted Plants (dropping Pizza, Coins, and Jackpots) and spoken Web Speech API Dad Jokes."
      ]
    }
  ]
};

window.GAME_VERSION = GAME_VERSION;
