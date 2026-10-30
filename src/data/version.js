// Single source of truth for Midlife Survivors Version Tracking & Patch Notes (`src/data/version.js`).
// Update `version`, `displayVersion`, `lastUpdated`, `build`, and prepend a `changelog` entry after each finished step!

const GAME_VERSION = {
  version: "1.9.0",
  displayVersion: "V. 1.9.0",
  lastUpdated: "Oct 30, 2026",
  codename: "Clean Screen",
  build: 23,
  changelog: [
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
