// Loads the game's code files in order, all tagged with the same BUILD number.
// index.html fetches this file fresh on every visit, so the browser can't mix an old page with new code
// (that mismatch broke controls until a second reload). Bump BUILD after every change; it replaces the old ?v= tags.
window.BUILD = 108;
window.GAME_FILES = [
  "assets/stage/start-area/qa-finish/before-version.js",
  "src/data/lore.js",
  "src/data/player.js",
  "src/data/modes.js",
  "src/data/stages.js",
  "src/data/enemies.js",
  "src/data/bosses.js",
  "src/data/breakables.js",
  "src/data/weapons.js",
  "src/data/deaths.js",
  "src/data/tips.js",
  "src/data/credits.js",
  "src/data/swarms.js",
  "src/data/leaderboard.js",
  "src/data/pickups.js",
  "src/data/items.js",
  "src/data/achievements.js",
  "src/data/heat.js",
  "src/data/nearMiss.js",
  "src/data/upgrades.js",
  "src/data/meta.js",
  "src/data/sounds.js",
  "src/sfx.js",
  "src/sprites.js",
  "src/enemy-art.js",
  "assets/characters/character-data.js",
  "assets/desks/desk-native-data.js",
  "assets/office-environment/environment-data.js",
  "src/character-animation.js",
  "src/data/office-layout.js",
  "src/data/stage-props.js",
  "src/office-environment.js",
  "assets/stage/start-area/qa-finish/before-layout.js",
  "assets/stage/start-area/qa-finish/before-art-data.js",
  "assets/stage/start-area/qa-finish/before-start-area.js",
  "src/world-art.js",
  "src/navigation.js",
  "src/near-miss.js",
  "src/art-sheets.js",
  "src/juice.js",
  "src/breakables.js",
  "src/boss-art.js",
  "src/promotions.js",
  "src/boss-attacks.js",
  "src/telemetry.js",
  "src/weapons_extra.js",
  "src/view3d.js",
  "src/leaderboard.js",
  "src/ui.js",
  "src/main.js"
];
(function () {
  window.GAME_FILES.forEach(function (f) {
    var s = document.createElement("script");
    s.src = f + "?v=" + window.BUILD;
    s.async = false; // keep the order: data first, main.js last
    document.body.appendChild(s);
  });
})();
