# Corporate Campus v2 review QA (Codex, Nov 1, 2026)

Scope: isolated Stage 1 revision, not runtime integration. V. 1.28.17, build 73.

- `python3 assets/stage/validate-campus-v2.py` passes. Physical floor flood at 16px resolution agrees with the connection graph for ages 40, 44.99, 45, 49.99, 50, 54.99, 55, 59.99 and 60, each with/without the hidden achievement. No locked district is physically reachable, including through wrapped seams. District polygons do not overlap. This checks the proposed geometry without furniture, not runtime navigation.
- All 13 combat reserves fit their districts and specify non-solid dressing. The early connected floor has 7,749,632 square pixels before solid prop placement. Kit count is 72; each family has two or three variants. Fifteen caption records reference valid families, carry one-to-three-word short labels and reserve at least 64px sign width.
- Browser tested at 1280x800 and 390x844. All five age controls show the expected open wings and gate states; achievement opens Archive separately at age 40. Illustration/plan switching, contained 2x phone zoom, caption selection and district selection are functional. Phone document width 375px within 390px viewport, no horizontal page overflow. Real hero canvas displays 56px wide; Bill reference 36px wide. Images report natural sizes 1672x941 and 1280x800. No browser warnings/errors captured.
- Screenshots: desktop overview, desktop starting floor, desktop achievement/control view, phone illustration and phone plan. Overview paint is approximate, especially corridors and the tiny Archive; measured data is authoritative.
- Exact Parking Lot image SHA-256 remains `868f2d7c905fef49208bbf66c304fbffce36ab80abc1ada0967375980f28aedf`.
- JSON/data parity, embedded SVG parity, review links, JavaScript syntax and whitespace checks pass. Runtime world/office renderer, main.js, enemy data, balance, saves, leaderboard, posts and CLAUDE.md are untouched. No leaderboard requests or test scores were made by this review.

Not tested or implemented: live age gates, door animations, caption proximity, spawn filtering, native new prop comparisons, age-50 run and 350-enemy stress on this map. The 120-visible-prop and 350-enemy limits are production targets. Stage 2 waits for v2 feedback.
