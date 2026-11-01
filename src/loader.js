// Loads the game's code files in order, all tagged with the same BUILD number.
// index.html fetches this file fresh on every visit, so the browser can't mix an old page with new code
// (that mismatch broke controls until a second reload). Bump BUILD after every change; it replaces the old ?v= tags.
window.BUILD = 63;
window.GAME_FILES = [
  "src/data/version.js",
  "src/data/lore.js",
  "src/data/player.js",
  "src/data/modes.js",
  "src/data/stages.js",
  "src/data/enemies.js",
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
  "src/data/upgrades.js",
  "src/data/meta.js",
  "src/data/sounds.js",
  "src/sfx.js",
  "src/sprites.js",
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
