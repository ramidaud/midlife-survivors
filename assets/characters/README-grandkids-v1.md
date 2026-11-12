# Grandkids world sprites

Three imaginary kids, each in a 448×240 sheet with 56×60 cells, eight columns × four rows. Rows are DOWN, UP, LEFT and RIGHT. No idle row. Foot line localy56, clear bottom rows57–59. Match TJ's nearest-neighbor sampling; key exact opaque#FF00FF to transparent.

- `grandkid-1-v1.png`:6-year-old girl, pigtails, bright pink rain jacket, gold rain boots. Target ink height37px.
- `grandkid-2-v1.png`:8-year-old boy, lavender hood up, cream sneakers with small light-up sole highlights, paper airplane. Target ink height38px.
- `grandkid-3-v1.png`:4-year-old, sage overalls, cream/orange striped shirt, flushed cheeks and lavender backpack. Target ink height36px.

The children are roughly70%of TJ's height. Shared twelve-color game palette; muted gold#E6BE58 is added only for the girl's requested yellow boots. No text, brands, people references, floor shadows or game-code changes.

Four directional GIF previews per child target95ms per frame (GIF time is quantized to hundredths of a second). [Comparison board](check-grandkids-final-v1.png) shows all32frames per child at2×, with TJ and the kids side by side at3× below. [Frame map](manifest-grandkids-v1.json), [prompts](prompts-grandkids-v1.json), [checks](checks-grandkids-v1.json). Generated pose studies were normalized and cleaned to native pixels; girl row-edge fragments removed before export. Saved locally for Rami's review; Claude owns integration.
