// Single source of truth for Midlife Survivors Version Tracking & Patch Notes (`src/data/version.js`).
// Update `version`, `displayVersion`, `lastUpdated`, `build`, and prepend a `changelog` entry after each finished step!

const GAME_VERSION = {
  version: "1.19.1",
  displayVersion: "V. 1.19.1",
  lastUpdated: "Oct 30, 2026",
  codename: "Online Board",
  build: 36,
  changelog: [
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
