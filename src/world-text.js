// World text (design system A7, Nov 10). Two small rules for words drawn on the floor:
//   1. One speech-bubble style everywhere: cream paper, navy reading text (the interns already used it).
//   2. A cap on pop-ups (+HP, coins, DODGED!...): at most MAX float at once; when another arrives, the oldest goes.
// Damage numbers have their own cap (DMG.perFrame and the pool in main.js).
window.WORLD_TEXT = { maxPops: 6, bubbleWrap: 220 };
window.WorldText = (() => {
  let live = [];
  function cap(obj) {
    if (!obj || !obj.scene) return obj;
    live = live.filter(o => o.active && o.scene);
    live.push(obj);
    obj.once("destroy", () => { live = live.filter(o => o !== obj); });
    while (live.length > (WORLD_TEXT.maxPops || 6)) { const old = live.shift(); if (old && old.active) { if (old.scene) old.scene.tweens.killTweensOf(old); old.destroy(); } }
    return obj;
  }
  // the one bubble: cream paper, navy Atkinson, 14 px
  function bubbleStyle(extra) {
    return Object.assign({ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: "14px", fontStyle: "bold", color: "#171C35",
      backgroundColor: "#F2D7A1", padding: { x: 8, y: 5 }, align: "center", wordWrap: { width: WORLD_TEXT.bubbleWrap || 220, useAdvancedWrap: true } }, extra || {});
  }
  return { cap, bubbleStyle, count: () => live.filter(o => o.active).length };
})();
