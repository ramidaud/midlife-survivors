# Lobby and Bullpen layout review

Both options use the current Lobby and Bullpen outlines, hero spawn, wide shared opening, and age-45 Parking and Break Room gates. The light bands on the plans measure 224 world px across. Dashed combat areas reserve contiguous open floor. The plan images use one image pixel per four world pixels. The orange camera boxes show the intended 1024×640 world px view at 1.25× zoom.

| | A · The Main Avenue | B · The Courtyard Loop |
|---|---|---|
| **Review** | [Plan](option-A.png) · [Mood frame](option-A-mood.png) | [Plan](option-B.png) · [Mood frame](option-B-mood.png) |
| **First read** | See the straight avenue from the Lobby, then branch around the printer apron or head east for a larger fight. | Pick either side of a loop around the commons. Cross the middle when you need an escape line. |
| **Lobby** | Reception faces the arrival rug. The sofa group sits south of the avenue beside a bright 848×320 court. | Reception and the sofa group make one arrival cluster. A 688×320 court opens up across the aisle. |
| **Bullpen** | The printer apron measures 552×400. The east swivel measures 864×420. The back edge holds the glass office and Q4 board. | The 704×656 commons is the main fight. The 400×416 south apron sits beside the glass office for a smaller turn. |
| **Pod desks** | 19 across four pods. 7 cubicles, 7 L-desks, 4 standing desks, 1 empty last-day desk. | 18 across four pods. 8 cubicles, 5 L-desks, 4 standing desks, 1 empty last-day desk. |
| **Chairs and larger props** | 16 occupied chairs including reception and manager. 48 measured solid envelopes including all pod desks, four shared partition spines, chairs, office, and lobby and landmark fixtures. | 15 occupied chairs including reception and manager. 46 measured solid envelopes on the same counting basis. |
| **People on their feet** | Four scenes, five people. | Four scenes, five people. |

Count the reception and manager’s work surfaces in addition to the pod desks. Envelope counts describe the shapes checked in the blockout. The glass office is one conservative envelope and the rest of the decoration is a dressing budget. Allow one or two personal items per desk. Plan positions and clearances are in [plan-geometry.json](plan-geometry.json).

## Landmarks as the camera moves

| View | A · The Main Avenue | B · The Courtyard Loop |
|---|---|---|
| **Lobby arrival** | Reception’s spinning OUR VALUES logo anchors the WELCOME rug. Elevator doors and paired sofas read as a waiting area. | The same logo marks the compact welcome area, with the seating and elevator wall in one view. |
| **Lobby throat** | Two coworkers and a paper cup tower give the cooler bay a reason to exist. | The cooler chat is the first activity before the loop splits. |
| **West Bullpen** | Ochre Accounting, a Q3 calendar and binder towers. | Accounting’s adding machine gives the north fork a distinct silhouette. HR’s candy bowl and flyers mark the south fork. |
| **Central Bullpen** | Jammed printer and paper trail, visible from the avenue. Slate teal IT has a rubber duck perched on a tower. | The dying office tree marks the edge of the open sage commons. The printer owns the north turn. |
| **South annex** | Ping-pong table with a permanent 1–1 score, plus Marketing’s plum rug and boxed desk. | The glass manager’s office looks onto the small apron. The kitchenette marks the southeast turn. |
| **Far east** | LOW HANGING FRUIT tree and the recycled Q4 goals board at opposite ends of the east combat space. | Whiteboard with a full “parking lot for ideas,” next to the route back around. |

Both plans put plants at the Lobby threshold and give the WELCOME rug a direction toward reception. A uses straight bands of worn carpet on the avenue. B uses lighter tread around the commons, with stepped tile edges at the corners. The mood frames show soft floor texture, stepped window light, and approximate play scale. The measured plans govern placement and collision clearance.

## How the desks and people fit

Each pod shares a low partition spine. Accounting uses folders, an adding machine, a calendar, a framed photo and a desk lamp. IT uses a duck, coiled cable, a tower, a tool roll and a stickered laptop. Marketing uses a mood board, a beanbag, a tiny neon sign, a tape dispenser and a boxed last-day desk. HR uses a candy bowl, a tiny plant, flyers and a mug collection. Assign these accents in desk order within each pod so adjacent desks read differently, even when both are cubicles.

The orange dots are occupied chair anchors. Use a seated redraw with a 44–52 world px head-to-shoe height beside the 56×60 hero. Draw the shared partition first, then the chair and coworker, then the worktop and apron over the thighs. Let the chair back or caster base show so you can see where the person sits. The current 34px crops need a redraw for this pose and angle. The [seating study](seat-scale.svg) compares a 48px pose with the approved hero at the same 3× enlargement.

The lavender marks stage two people at the cooler, one at the printer, a short phone pacing loop in a side bay, and a slow mug walker along the dotted trace. Treat all five people as visual actors. Keep the printer and cooler bodies inside their bays. The lift doors are a decorative wall feature. The two red doors and shared opening are the current campus access points.

The plan SVGs are editable. The mood frames use built-in imagegen for composition and seating studies. They depict the route and material ideas at approximate scale, with some furniture positions simplified for the illustration. [Mood prompts](mood-prompts.json)
