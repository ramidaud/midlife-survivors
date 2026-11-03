# Courtyard floor dressing

[Open the floor review](review-floor.html?nostats=1). Use **Lobby runner**, **Commons**, and **Bullpen aisle** for the matched camera positions. **Hero, Bill and gem** stages the contrast check over the compass inlay. Add `&phase=before` for the archived V. 1.54.2 floor and `&phone=1` for the 390×844 view. The review blocks analytics and uses in-memory saves.

The floor pass uses 45 matte marks, three floor labels and an L-shaped runner from the decorative lift doors to reception. Worn tread follows the loop, gate approaches and the paths to the cooler and printer. The commons gets a woven compass rose, dragged chairs, a forgotten pizza box, and a spill with a printed warning. Look for the old printer outline, the HR note, and the sticky trail in the north aisle. The Lobby runner has wet prints, a dropped badge, a lost umbrella and a turned corner.

The marks live in `room_data_floor.py` and draw during room construction. The existing 1024 px floor bake flattens them underneath all actors, pickups and furniture. The floor colors use subdued alpha against the existing surfaces. Claude can light the same 63 anchors.

[Before-and-after captures and reports](qa-floor/) cover 1280×800 and 390×844. The 350-enemy check averaged 116.7 to 118.5 FPS on desktop and 118.5 to 118.9 FPS at phone size on the same desktop browser. Both runs retained all 350 actors on the floor.
