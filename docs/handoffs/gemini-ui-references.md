# Gemini brief: UI references for the design pass (Nov 10, 2026)

Rami wants the game's menus, maps, memos, tips, spotlights, errands and messages to feel like one unified experience, with
more of Apple's iOS/macOS design philosophy, scaling to the device (phone, iPad, desktop; touch, mouse, controller).

1. **How great games solve it:** Vampire Survivors, Brotato, Hades, Balatro, Dave the Diver, Stardew Valley, Slay the Spire. For each: where in-run notifications appear, how the level-up/choice screen works on phone vs. desktop, how they keep the action readable, one thing worth stealing. Short, concrete, with how it would look in a pixel-art game.
2. **Apple HIG, translated for a pixel-art game:** the 8-10 principles that matter most here (hierarchy, clarity, deference, size classes, safe areas, sheets vs. alerts vs. banners, focus and controller navigation, Dynamic Type, Reduce Motion, haptics), each with one rule we could adopt.
3. **Accessibility checklist:** contrast for pixel text on busy backgrounds, minimum text sizes per device, colorblind-safe warning colors (our danger color is tie red #C45C4B on navy and beige floors), reduce-motion behavior, controller-only and one-hand phone play.
4. **Voice for UI text:** fold in your earlier style guide (`gemini-maple-voice-reply.md`, part 2) as rules for buttons, banners and empty states.

Reply in `docs/handoffs/gemini-ui-references-reply.md`. The design lead (a separate chat) will use it.
